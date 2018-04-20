import { Context, Geometry, Buffer } from 'webgl-operate';

import { GlTf, GltfAsset, MeshPrimitive } from 'gltf-loader-ts';

export class Primitive extends Geometry {
    constructor(context: Context, identifier?: string | undefined) {
        super(context, identifier);
    }

    protected bindBuffers(indices: number[]): void {
        throw new Error('Method not implemented.');
    }
    protected unbindBuffers(indices: number[]): void {
        throw new Error('Method not implemented.');
    }

    async setFromGltf(gPrimitive: MeshPrimitive, asset: GltfAsset) {
        const gl = this.context.gl;

        if (!gPrimitive.attributes.POSITION) {
            // TODO!: mesh/primitive index?
            throw new Error(`primitives must have the POSITION attribute (mesh: {}, primitive: {})`)
        }
        const positionAccessorIndex = gPrimitive.attributes.POSITION;
        const positionAccessor = asset.gltf.accessors[positionAccessorIndex];
        const bufferData = await asset.bufferViewData(positionAccessor.bufferView);
        const buffer = new Buffer(this.context); // TODO!? identifier
        buffer.data(bufferData, gl.STATIC_DRAW); // TODO!!!: Argument of type 'ArrayBuffer'
                                                 // is not assignable to parameter of type 'ArrayBufferView'.
        this._buffers.push(buffer);
        // TODO!!!: how to have only one buffer when the bufferview is shared
        // for all attribs?

        // TODO!!: bounds...

    }

    draw(): void {
        throw new Error('Method not implemented.');
    }
}
