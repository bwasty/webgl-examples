import { auxiliaries, Buffer, Context, Geometry } from 'webgl-operate';

import { GltfAsset } from 'gltf-loader-ts';
import { gltf } from 'gltf-loader-ts';

export class Primitive extends Geometry {
    private gPrimitive: gltf.MeshPrimitive;
    private numVertices: number;
    private numIndices: number;

    constructor(context: Context, identifier?: string | undefined) {
        super(context, identifier);
    }

    private attribSize(accessor: gltf.Accessor) {
        // TODO!!!
    }

    private bindAttrib(index: number, accessor: gltf.Accessor) {
        // TODO!!!
        // this._buffers[0].attribEnable(
        //     index,
        //     accessor
        // ),
    }

    protected bindBuffers(indices: number[]): void {
        /* Please note the implicit bind in attribEnable */
        this._buffers[0].attribEnable(indices[0],
            3, // TODO!!!: base on acc type?
            this.context.gl.FLOAT, // TODO!!: type
            false, // TODO!! acc normalized... or false
            0, // TODO!!! stride from accessor
            0, // TODO!!! offset from accessor??
            true,
            false);
        this._buffers[1].bind(); // indices
    }
    protected unbindBuffers(indices: number[]): void {
        throw new Error('Method not implemented.');
    }

    async setFromGltf(gPrimitive: gltf.MeshPrimitive, asset: GltfAsset) {
        this.gPrimitive = gPrimitive;

        const gl = this.context.gl;
        const gltf: gltf.GlTf = asset.gltf; // TODO!!: why is implicit typing not working?

        if (!gPrimitive.attributes.POSITION) {
            // TODO!: mesh/primitive index?
            throw new Error(`primitives must have the POSITION attribute (mesh: {}, primitive: {})`);
        }

        if (gltf.accessors === undefined) { throw new Error('invalid gltf'); }

        // TODO!!: check accessor for being sparse; throw unimplemented for now
        const positionAccessor = gltf.accessors[gPrimitive.attributes.POSITION];
        // TODO!: (cast) When not defined, accessor must be initialized with zeros;
        // sparse property or extensions could override zeros with actual values.
        const bufferData = await asset.bufferViewData(positionAccessor.bufferView as number);
        const buffer = new Buffer(this.context); // TODO!? identifier
        buffer.data(bufferData, gl.STATIC_DRAW); // TODO!!!: Argument of type 'ArrayBuffer'
                                                 // is not assignable to parameter of type 'ArrayBufferView'.
        this._buffers.push(buffer);
        this.numVertices = positionAccessor.count;

        // TODO!!: does this happen? (multiple vertex attrib buffers for one primitive)
        for (const attr in gPrimitive.attributes || {}) {
            if (gltf.accessors[gPrimitive.attributes[attr]] !== positionAccessor) {
                throw new Error('unsupported: multiple vertex attrib bufferViews per primitive');
            }
        }

        // TODO!!: bounds...

        const aVertex = 0; // TODO!!!

        if (gPrimitive.indices) {
            const indexAccessor: gltf.Accessor = gltf.accessors[gPrimitive.indices as number]; // TODO!: check
            // TODO!: (cast) When not defined, accessor must be initialized with zeros;
            // sparse property or extensions could override zeros with actual values.
            const indexBufferData = await asset.bufferViewData(indexAccessor.bufferView as number);
            const indexBuffer = new Buffer(this.context); // TODO!? identifier
            indexBuffer.data(indexBufferData, gl.STATIC_DRAW);
            this._buffers.push(indexBuffer);
            this.numIndices = indexAccessor.count;

            const valid = super.initialize([gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER], [aVertex, 8]);

            auxiliaries.assert(this._buffers[0] !== undefined && this._buffers[0].object instanceof WebGLBuffer,
                `expected valid WebGLBuffer`);
        } else {
            // TODO!: make sure drawArrays is used later...
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
            gl.drawArrays(mode, 0, this.numVertices); // TODO!!: 0 correct?
        }
    }

    get hasIndices(): boolean {
        return this.gPrimitive.indices !== undefined;
    }
}
