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

// /** Byte size per element, as needed for example for `gl.vertexAttribPointer` */
function accessorElementSize(accessor: GLTF.Accessor) {
    return WEBGL_BYTES_PER_COMPONENT_TYPE[accessor.componentType] *
        GLTF_ELEMENTS_PER_TYPE[accessor.type];
}

/** Standard vertex attrib locations for all semantics in the spec */
const ATTRIB_LOCATIONS: { [semantic: string]: number } = {
    POSITION: 0,
    NORMAL: 1,
    TANGENT: 2,
    TEXCOORD_0: 3,
    TEXCOORD_1: 4,
    COLOR_0: 5,
    JOINTS_0: 6,
    WEIGHTS_0: 7,
};

// indices for Geometry._buffers
const INDEX_BUFFER = 0;

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

    enable(index: GLuint) {
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

    disable(index: GLuint) {
        this.buffer.attribDisable(index, true, true); // TODO!: param?
    }
}

export class Primitive extends Geometry {
    /** POINTS / LINES / TRIANGLES etc. */
    private mode: GLenum;
    /** Vertex attributes. Keys match the attribute semantic property names from glTF. */
    // TODO!!: uninitialization of attributes
    private attributes: { [semantic: string]: VertexAttribute } = {};

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
        // TODO!!!: WebGL1 support (location lookup)... also in unbind...
        for (const semantic in this.attributes) {
            const location = ATTRIB_LOCATIONS[semantic];
            if (location === undefined) {
                continue;
            }
            this.attributes[semantic].enable(location);
        }

        if (this.numIndices) {
            this._buffers[INDEX_BUFFER].bind();
        }
    }

    protected unbindBuffers(indices: number[]): void {
        for (const semantic in this.attributes) {
            const location = ATTRIB_LOCATIONS[semantic];
            if (location === undefined) {
                continue;
            }
            this.attributes[semantic].disable(location);
        }
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
            this.numVertices = accessor.count;
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

        if (gPrimitive.indices !== undefined) {
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

            const valid = this.initialize([gl.ELEMENT_ARRAY_BUFFER], [8]);

            indexBuffer.data(indexBufferData, gl.STATIC_DRAW);

            auxiliaries.assert(this._buffers[INDEX_BUFFER] !== undefined &&
                this._buffers[INDEX_BUFFER].object instanceof WebGLBuffer,
                `expected valid WebGLBuffer`);
        } else {
            const valid = this.initialize();
        }

        // TODO!!: do something with valid??
    }

    draw(): void {
        // overriden with optimized version in `initialize`
    }
}
