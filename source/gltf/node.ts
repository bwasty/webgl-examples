import { mat4, quat, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context } from 'webgl-operate';

import { Mesh } from './mesh';

export class Node {
    mesh: Mesh | undefined;
    children: Node[] = [];

    // a node can eiter have a matrix, or T,R,S properties
    matrix: mat4 | undefined;
    translation: vec3 | undefined;
    rotation: quat | undefined;
    scale: vec3 | undefined;
    // TODO: weights
    // TODO!!: camera
    // camera: Camera;
    name: string ;

    finalTransform: mat4 = mat4.create();
    // bounds: Bounds;

    static fromGltf(gNode: GLTF.Node, asset: GltfAsset, context: Context): Node {
        const node = new Node();
        node.name = gNode.name;

        if (gNode.matrix !== undefined) {
            node.matrix = mat4.fromValues.apply(undefined, gNode.matrix)
        } else if (gNode.translation || gNode.rotation || gNode.scale) {
            node.translation = gNode.translation ?
                vec3.fromValues.apply(undefined, gNode.translation) :
                vec3.create();

            node.rotation = gNode.rotation ?
                quat.fromValues.apply(undefined, gNode.rotation) :
                quat.create();

            node.scale = gNode.scale ?
                vec3.fromValues.apply(undefined, gNode.scale) :
                vec3.fromValues(1, 1, 1);
        } else {
            node.matrix = mat4.create();
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

        // TODO!!: camera

        return node;
    }

    updateTransform(parentTransform: mat4) {
        // TODO!!
        this.finalTransform = parentTransform;

        if (this.matrix) {
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
