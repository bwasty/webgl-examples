import { mat4, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context, Program } from 'webgl-operate';

import { Aabb3 } from './aabb3';
import { PbrShader } from './pbrshader';
import { Primitive } from './primitive';

export class Mesh {
    context: Context;
    primitives: Primitive[];
    // TODO: weights
    name: string;
    bounds: Aabb3 = new Aabb3();

    static async fromGltf(meshIndex: GLTF.GlTfId, asset: GltfAsset, context: Context): Promise<Mesh> {
        const gMesh = asset.gltf.meshes![meshIndex];
        const mesh = new Mesh();
        mesh.context = context;
        mesh.name = gMesh.name;
        mesh.primitives = await Promise.all(gMesh.primitives.map((gPrim, i) => {
            const identifier = `mesh_${gMesh.name || meshIndex}_prim_${i}`;
            return Primitive.fromGltf(gPrim, asset, context, identifier);
        }));

        for (const primitive of mesh.primitives) {
            mesh.bounds.union(primitive.bounds);
        }

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
