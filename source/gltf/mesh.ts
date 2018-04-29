import { mat4, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context, Program } from 'webgl-operate';

import { Primitive } from './primitive';

export class Mesh {
    context: Context;
    primitives: Primitive[];
    // TODO: weights
    name: string;

    // bounds: Bounds;

    static fromGltf(meshIndex: GLTF.GlTfId, asset: GltfAsset, context: Context): Mesh {
        const gMesh = asset.gltf.meshes![meshIndex];
        const mesh = new Mesh();
        mesh.context = context;
        mesh.name = gMesh.name;
        mesh.primitives = gMesh.primitives.map((gPrim, i) => {
            const identifier = `mesh_${gMesh.name || meshIndex}_prim_${i}`;
            const prim = new Primitive(context, identifier);
            prim.setFromGltf(gPrim, asset);
            return prim;
        });

        return mesh;
    }

    draw() {
        for (const primitive of this.primitives) {
            primitive.draw();
        }
    }

    uninitialize() {
        for (const primitive of this.primitives) {
            primitive.uninitialize();
        }
    }
}
