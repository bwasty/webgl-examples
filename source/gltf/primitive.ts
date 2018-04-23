import { auxiliaries, Buffer, Context, Geometry } from 'webgl-operate';
const assert = auxiliaries.assert;

import { GltfAsset } from 'gltf-loader-ts';
import { gltf as GLTF } from 'gltf-loader-ts';

// tslint:disable:max-classes-per-file

// TODO!!: move to gltf-loader-ts? GltfUtils?
/** Spec: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#accessor-element-size */
const WEBGL_BYTES_PER_COMPONENT_TYPE: { [index: number]: number } = {
    5120: 1, // BYTE
    5121: 1, // UNSIGNED_BYTE
    5122: 2, // SHORT
    5123: 2, // UNSIGNED_SHORT
    5125: 4, // UNSIGNED_INT
    5126: 4, // FLOAT
};

/** Spec: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#accessor-element-size */
const GLTF_ELEMENTS_PER_TYPE: { [index: string]: number } = {
    SCALAR: 1,
    VEC2:   2,
    VEC3:   3,
    VEC4:   4,
    MAT2:   4,
    MAT3:   9,
    MAT4:  16,
};

/** Byte size per element, as needed for example for `gl.vertexAttribPointer` */
function accessorElementSize(accessor: GLTF.Accessor) {
    return WEBGL_BYTES_PER_COMPONENT_TYPE[accessor.componentType] *
        GLTF_ELEMENTS_PER_TYPE[accessor.type];
}

// indices for Geometry._buffers
const VERTEX_BUFFER = 0;
const INDEX_BUFFER = 1;

/** Data needed for `gl.vertexAttribPointer` */
class VertexAttribute {
    static fromGltf(accessor: GLTF.Accessor, bufferView: GLTF.BufferView, buffer: Buffer) {
        return new VertexAttribute(
            buffer,
            GLTF_ELEMENTS_PER_TYPE[accessor.type],
            accessor.componentType,
            accessor.normalized || false,
            bufferView.byteStride || 0,
            bufferView.byteOffset || 0,
        );
    }

    constructor(
        private buffer: Buffer,
        private size: GLint,
        private type: GLenum,
        private normalized: boolean,
        private stride: GLsizei,
        private offset: GLintptr,
    ) {}

    enable(index: number) {
        this.buffer.attribEnable(
            index,
            this.size,
            this.type,
            this.normalized,
            this.stride,
            this.offset,
            true, // TODO!: param?
            false,
        );
    }

    disable(index: number) {
        this.buffer.attribDisable(index, true, true); // TODO!: param?
    }
}

export class Primitive extends Geometry {
    /** POINTS / LINES / TRIANGLES etc. */
    private mode: GLenum;
    /** Vertex attributes. Keys match the attribute semantic property names from glTF. */
    private attributes: { [semantic: string]: VertexAttribute };

    private numVertices: number;
    private numIndices: number;
    private indexType: GLenum;

    constructor(context: Context, identifier?: string | undefined) {
        super(context, identifier);
    }

    private getAccessor(gltf: GLTF.GlTf, accessorId: GLTF.GlTfId): GLTF.Accessor {
        if (gltf.accessors === undefined) { throw new Error('invalid gltf'); }
        const acc = gltf.accessors[accessorId];
        if (!!acc.sparse) { throw new Error('sparse accessors not implemented yet'); }
        return acc;
    }

    protected bindBuffers(indices: number[]): void {
        // this._buffers[VERTEX_BUFFER].bind();
        // this.bindAttrib(indices[0], this.positionAttribData);

        // for (const semantic in this.attributes) {

        // }

        if (this.numIndices) {
            this._buffers[INDEX_BUFFER].bind();
        }
    }

    protected unbindBuffers(indices: number[]): void {
        // this._buffers[VERTEX_BUFFER].attribDisable(indices[0], false, false); // TODO!?
        this._buffers[INDEX_BUFFER].unbind();
    }

    public initialize(...args: any[]): boolean {
        const valid = super.initialize(...args);
        if (valid) {
            const gl = this.context.gl;
            if (this.numIndices) {
                this.draw = function() {
                    gl.drawElements(this.mode, this.numIndices, this.indexType, 0);
                };
            } else {
                this.draw = function() {
                    gl.drawArrays(this.mode, 0, this.numVertices);
                };
            }
        }
        return valid;
    }

    async setFromGltf(gPrimitive: GLTF.MeshPrimitive, asset: GltfAsset) {
        this.mode = gPrimitive.mode || 4; // TRIANGLES (= default in spec)

        const gl = this.context.gl;
        const gltf = asset.gltf;
        assert(!!gPrimitive.attributes.POSITION, 'primitives must have the POSITION attribute');
        if (gltf.bufferViews === undefined) { throw new Error('invalid gltf'); }

        const buffersByView: {[bufferView: number]: Buffer} = {};
        for (const semantic in gPrimitive.attributes) {
            const accessor = this.getAccessor(gltf, gPrimitive.attributes[semantic]);
            const bufferViewIndex = accessor.bufferView as number; // TODO!: cast...

            let buffer;
            if (bufferViewIndex in buffersByView) {
                buffer = buffersByView[bufferViewIndex];
            } else {
                const bufferViewData = await asset.bufferViewData(bufferViewIndex);
                buffer = new Buffer(this.context); // TODO!? identifier
                buffer.initialize(gl.ARRAY_BUFFER);
                buffer.data(bufferViewData, gl.STATIC_DRAW);
                buffersByView[bufferViewIndex] = buffer;
            }

            this.attributes[semantic] = VertexAttribute.fromGltf(accessor, gltf.bufferViews[bufferViewIndex], buffer);
        }

        // TODO!!: bounds...

        const aVertex = 0; // TODO!!!

        if (gPrimitive.indices) {
            const indexAccessor = this.getAccessor(gltf, gPrimitive.indices);
            // TODO!: (cast) When not defined, accessor must be initialized with zeros;
            // sparse property or extensions could override zeros with actual values.
            const indexBufferData = await asset.bufferViewData(indexAccessor.bufferView as number);
            const indexBuffer = new Buffer(this.context); // TODO!? identifier
            this._buffers.push(indexBuffer);
            this.numIndices = indexAccessor.count;
            this.indexType = indexAccessor.componentType;
            if (this.indexType === gl.UNSIGNED_INT) {
                // TODO!!: make sure OES_element_index_uint is active
                throw new Error('not yet supported: UNSIGNED_INT indices');
            }

            const valid = this.initialize([gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER], [aVertex, 8]);

            indexBuffer.data(indexBufferData, gl.STATIC_DRAW);

            auxiliaries.assert(this._buffers[INDEX_BUFFER] !== undefined &&
                this._buffers[INDEX_BUFFER].object instanceof WebGLBuffer,
                `expected valid WebGLBuffer`);
        } else {
            const valid = this.initialize([gl.ARRAY_BUFFER], [aVertex, 8]);
        }


        // TODO!: do something with valid??

        auxiliaries.assert(this._buffers[VERTEX_BUFFER] !== undefined &&
            this._buffers[VERTEX_BUFFER].object instanceof WebGLBuffer,
            `expected valid WebGLBuffer`);
    }

    draw(): void {
        // overriden with optimized version in `initialize`
    }
}
