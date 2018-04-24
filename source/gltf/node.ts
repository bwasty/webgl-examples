import { mat4, quat, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Camera, Context, Program } from 'webgl-operate';

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
            node.matrix = mat4.fromValues.apply(undefined, gNode.matrix);
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

        if (gNode.mesh !== undefined) {
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
        this.finalTransform = mat4.clone(parentTransform);

        if (this.matrix) {
            mat4.mul(this.finalTransform, this.finalTransform, this.matrix);
        } else {
            const m = mat4.fromRotationTranslationScale(mat4.create(), this.rotation!, this.translation!, this.scale!);
            mat4.mul(this.finalTransform, this.finalTransform, m);
        }

        for (const node of this.children) {
            node.updateTransform(this.finalTransform);
        }
    }

    updateBounds() {
        // TODO!!
    }

    draw(camera: Camera, program: Program) {
        if (this.mesh) {
            const mvpMatrix = mat4.mul(mat4.create(), camera.viewProjection, this.finalTransform);
            this.mesh.draw(this.finalTransform, mvpMatrix, camera.eye, program);
        }

        for (const node of this.children) {
            node.draw(camera, program);
        }
    }
}
