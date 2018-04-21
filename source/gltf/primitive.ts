import { auxiliaries, Buffer, Context, Geometry } from 'webgl-operate';
const assert = auxiliaries.assert;

import { GltfAsset } from 'gltf-loader-ts';
import { gltf } from 'gltf-loader-ts';

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
function accessorElementSize(accessor: gltf.Accessor) {
    return WEBGL_BYTES_PER_COMPONENT_TYPE[accessor.componentType] *
        GLTF_ELEMENTS_PER_TYPE[accessor.type];
}

// indices for Geometry._buffers
const VERTEX_BUFFER = 0;
const INDEX_BUFFER = 1;

export class Primitive extends Geometry {
    private gPrimitive: gltf.MeshPrimitive;
    private gVertexBufferView: gltf.BufferView;
    private gIndexBufferView: gltf.BufferView; // TODO!: obsolete?
    private numVertices: number;
    private numIndices: number;

    constructor(context: Context, identifier?: string | undefined) {
        super(context, identifier);
    }

    private getAccessor(gltf: gltf.GlTf, accessorId: gltf.GlTfId): gltf.Accessor {
        if (gltf.accessors === undefined) { throw new Error('invalid gltf'); }
        const acc = gltf.accessors[accessorId];
        if (!!acc.sparse) { throw new Error('sparse accessors not implemented yet'); }
        return acc;
    }

    private bindAttrib(index: number, accessor: gltf.Accessor, bufferView: gltf.BufferView) {
        this._buffers[VERTEX_BUFFER].attribEnable(
            index,
            accessorElementSize(accessor),
            accessor.componentType,
            accessor.normalized || false,
            bufferView.byteStride,
            bufferView.byteOffset,
            false,
            false,
        );
    }

    protected bindBuffers(indices: number[]): void {
        this._buffers[VERTEX_BUFFER].bind();
        // TODO!!!
        this.bindAttrib(indices[0], accessor, this.gVertexBufferView);
        this._buffers[INDEX_BUFFER].bind(); // indices
    }
    protected unbindBuffers(indices: number[]): void {
        this._buffers[VERTEX_BUFFER].attribDisable(indices[0], false, false); // TODO!?
        this._buffers[INDEX_BUFFER].unbind();
    }

    async setFromGltf(gPrimitive: gltf.MeshPrimitive, asset: GltfAsset) {
        this.gPrimitive = gPrimitive;

        const gl = this.context.gl;
        const gltf = asset.gltf;
        assert(!!gPrimitive.attributes.POSITION, 'primitives must have the POSITION attribute');
        if (gltf.bufferViews === undefined) { throw new Error('invalid gltf'); }

        const positionAccessor = this.getAccessor(gltf, gPrimitive.attributes.POSITION);
        // TODO!: (cast) When not defined, accessor must be initialized with zeros;
        // sparse property or extensions could override zeros with actual values.
        const bufferData = await asset.bufferViewData(positionAccessor.bufferView as number);
        const buffer = new Buffer(this.context); // TODO!? identifier
        buffer.data(bufferData, gl.STATIC_DRAW);
        this._buffers.push(buffer);
        this.numVertices = positionAccessor.count;
        this.gVertexBufferView = gltf.bufferViews[positionAccessor.bufferView as number];

        // TODO!: does this happen? (multiple vertex attrib buffers for one primitive)
        for (const attr in gPrimitive.attributes) {
            if (gltf.accessors && gltf.accessors[gPrimitive.attributes[attr]] !== positionAccessor) {
                throw new Error('unsupported: multiple vertex attrib bufferViews per primitive');
            }
        }

        // TODO!!: bounds...

        const aVertex = 0; // TODO!!!

        if (gPrimitive.indices) {
            const indexAccessor = this.getAccessor(gltf, gPrimitive.indices);
            // TODO!: (cast) When not defined, accessor must be initialized with zeros;
            // sparse property or extensions could override zeros with actual values.
            const indexBufferData = await asset.bufferViewData(indexAccessor.bufferView as number);
            const indexBuffer = new Buffer(this.context); // TODO!? identifier
            indexBuffer.data(indexBufferData, gl.STATIC_DRAW);
            this._buffers.push(indexBuffer);
            this.numIndices = indexAccessor.count;
            this.gIndexBufferView = gltf.bufferViews[indexAccessor.bufferView as number];

            const valid = super.initialize([gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER], [aVertex, 8]);

            auxiliaries.assert(this._buffers[0] !== undefined && this._buffers[0].object instanceof WebGLBuffer,
                `expected valid WebGLBuffer`);
        } else {
            const valid = super.initialize([gl.ARRAY_BUFFER], [aVertex, 8]);
        }

        auxiliaries.assert(this._buffers[1] !== undefined && this._buffers[1].object instanceof WebGLBuffer,
            `expected valid WebGLBuffer`);
    }

    draw(): void {
        const gl = this.context.gl;
        const mode = this.gPrimitive.mode;
        if (this.hasIndices) {
            gl.drawElements(mode, this.numIndices, gl.UNSIGNED_BYTE, 0);
        } else {
            gl.drawArrays(mode, 0, this.numVertices);
        }
    }

    get hasIndices(): boolean {
        return this.gPrimitive.indices !== undefined;
    }
}
