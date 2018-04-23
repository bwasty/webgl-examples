import { mat4, quat, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context } from 'webgl-operate';

import { Mesh } from './mesh';

export class Node {
    children: Node[];
    matrix: mat4;
    mesh: Mesh;
    rotation: quat;
    scale: vec3;
    translation: vec3;
    // TODO: weights
    // camera: Camera;
    name: string;

    finalTransform: mat4;
    // bounds: Bounds;

    static fromGltf(gNode: GLTF.Node, asset: GltfAsset, context: Context): Node {
        const node = new Node();
        node.name = gNode.name;
        const m = gNode.matrix;
        // TODO!!!: same matrix layout??
        if (m === undefined) {
            node.matrix = mat4.create();
        } else {
            node.matrix = mat4.fromValues(
                m[0], m[1], m[2], m[3],
                m[4], m[5], m[6], m[7],
                m[8], m[9], m[10], m[11],
                m[12], m[13], m[14], m[15],
            );
        }

        const r = gNode.rotation;
        if (r === undefined) {
            // TODO!!!
        } else {
            node.rotation = quat.fromValues(r[0], r[1], r[2], r[3]);
        }

        if (gNode.mesh) {
            const mesh = asset.gltf.meshes![gNode.mesh];
            node.mesh = Mesh.fromGltf(mesh, asset, context);
        }

        if (gNode.children) {
            node.children = gNode.children.map((i) => {
                return Node.fromGltf(asset.gltf.nodes![i], asset, context);
            });
        }

        return node;
    }

    updateTransform(parentTransform: mat4) {
        // TODO!!
        this.finalTransform = parentTransform;

        // TODO!: static identity?
        if (!mat4.exactEquals(this.matrix, mat4.create())) {
            mat4.mul(this.finalTransform, this.matrix, this.finalTransform);
        } else {
            // TODO!!!
        }

        // TODO!!!
    }

    updateBounds() {
        // TODO!!
    }

    draw() {
        if (this.mesh) {
            // TODO!!
            // let mvp_matrix = cam_params.projection_matrix * cam_params.view_matrix * self.final_transform;
            const mvpMatrix = mat4.create();
            this.mesh.draw(this.finalTransform, mvpMatrix, vec3.create());
        }

        for (const node of this.children) {
            node.draw();
        }
    }
}
