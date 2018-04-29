import { mat4, quat, vec3 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Camera, Context, Program } from 'webgl-operate';

import { Mesh } from './mesh';

export class Node {
    context: Context;
    mesh: Mesh | undefined;
    children: Node[] = [];

    // a node can eiter have a matrix, or T,R,S properties
    matrix: mat4 | undefined;
    translation: vec3 | undefined;
    rotation: quat | undefined;
    scale: vec3 | undefined;
    // TODO: weights
    // TODO!: camera
    // camera: Camera;
    name: string ;

    finalTransform: mat4 = mat4.create();
    // bounds: Bounds;

    static async fromGltf(gNode: GLTF.Node, asset: GltfAsset, context: Context): Promise<Node> {
        const node = new Node();
        node.name = gNode.name;
        node.context = context;

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

        // NOTE: no waiting on mesh and children in parallel because generally
        // only one of them exists on a node
        if (gNode.mesh !== undefined) {
            node.mesh = await Mesh.fromGltf(gNode.mesh, asset, context);
        }

        if (gNode.children) {
            node.children = await Promise.all(gNode.children.map((i) => {
                return Node.fromGltf(asset.gltf.nodes![i], asset, context);
            }));
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
        // TODO! updateBounds
    }

    draw(camera: Camera, program: Program) {
        if (this.mesh) {
            // TODO!!: proper uniform location handling
            const gl = this.context.gl;
            gl.uniformMatrix4fv(program.uniform('u_model'), gl.FALSE, this.finalTransform);
            this.mesh.draw();
        }

        for (const node of this.children) {
            node.draw(camera, program);
        }
    }

    uninitialize() {
        if (this.mesh) {
            this.mesh.uninitialize();
        }
        for (const node of this.children) {
            node.uninitialize();
        }
    }
}
