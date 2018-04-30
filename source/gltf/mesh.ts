import { mat4, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context, Program } from 'webgl-operate';

import { PbrShader } from './pbrshader';
import { Primitive } from './primitive';

export class Mesh {
    context: Context;
    primitives: Primitive[];
    // TODO: weights
    name: string;

    // bounds: Bounds;

    static async fromGltf(meshIndex: GLTF.GlTfId, asset: GltfAsset, context: Context): Promise<Mesh> {
        const gMesh = asset.gltf.meshes![meshIndex];
        const mesh = new Mesh();
        mesh.context = context;
        mesh.name = gMesh.name;
        mesh.primitives = await Promise.all(gMesh.primitives.map((gPrim, i) => {
            const identifier = `mesh_${gMesh.name || meshIndex}_prim_${i}`;
            return Primitive.fromGltf(gPrim, asset, context, identifier);
        }));

        return mesh;
    }

    draw(shader: PbrShader) {
        for (const primitive of this.primitives) {
            primitive.draw(shader);
        }
    }

    uninitialize() {
        for (const primitive of this.primitives) {
            primitive.uninitialize();
        }
    }
}
