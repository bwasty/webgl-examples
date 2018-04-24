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

    static fromGltf(gMesh: GLTF.Mesh, asset: GltfAsset, context: Context): Mesh {
        const mesh = new Mesh();
        mesh.context = context;
        mesh.name = gMesh.name;
        mesh.primitives = gMesh.primitives.map((gPrim) => {
            const prim = new Primitive(context, gMesh.name);
            prim.setFromGltf(gPrim, asset);
            return prim;
        });

        return mesh;
    }

    draw(modelMatrix: mat4, mvpMatrix: mat4, cameraPosition: vec3, program: Program) {
        // TODO!!: proper uniform location handling
        const gl = this.context.gl;
        gl.uniformMatrix4fv(program.uniform('u_model'), gl.FALSE, modelMatrix);
        gl.uniformMatrix4fv(program.uniform('u_modelViewProjection'), gl.FALSE, mvpMatrix);

        for (const primitive of this.primitives) {
            primitive.draw();
        }
    }
}
