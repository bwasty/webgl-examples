import { mat3, mat4, quat, vec3 } from 'gl-matrix';
import { gltf as GLTF } from 'gltf-loader-ts';
import { Context } from 'webgl-operate';

import { Aabb3 } from './aabb3';
import { Asset } from './asset';
import { Mesh } from './mesh';

export class Node {
    context: Context;
    mesh: Mesh | undefined;
    parent: Node | undefined;
    children: Node[] = [];

    // a node can either have a matrix, or T,R,S properties
    matrix: mat4 | undefined;
    translation: vec3 | undefined;
    rotation: quat | undefined;
    scale: vec3 | undefined;
    // TODO: weights
    // TODO!: camera
    // camera: Camera;
    name: string;

    finalTransform: mat4 = mat4.create();
    normalMatrix: mat3 = mat3.create();
    bounds: Aabb3;

    visible = true;

    static async fromGltf(gNode: GLTF.Node, asset: Asset, parent?: Node): Promise<Node> {
        const node = new Node();
        node.name = gNode.name;
        node.context = asset.context;

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
            node.mesh = await asset.getMesh(gNode.mesh);
        }

        node.parent = parent;
        if (gNode.children) {
            node.children = await Promise.all(gNode.children.map((i) => {
                return Node.fromGltf(asset.gAsset.gltf.nodes![i], asset, node);
            }));
        }

        // TODO!!: camera (including switcher in dat gui)

        return node;
    }

    updateTransform() {
        this.finalTransform = this.parent ? mat4.clone(this.parent.finalTransform) : mat4.create();

        if (this.matrix) {
            mat4.mul(this.finalTransform, this.finalTransform, this.matrix);
        } else {
            const m = mat4.fromRotationTranslationScale(mat4.create(), this.rotation!, this.translation!, this.scale!);
            mat4.mul(this.finalTransform, this.finalTransform, m);
        }

        mat3.normalFromMat4(this.normalMatrix, this.finalTransform);

        for (const node of this.children) {
            node.updateTransform();
        }
    }

    updateBounds() {
        if (this.mesh) {
            this.bounds = this.mesh.bounds.clone();
            this.bounds.transform(this.finalTransform);
        } else if (this.children.length === 0) {
            // Cameras (others?) have neither mesh nor children. Their position is the origin
            // TODO!: are there other cases? Do bounds matter for cameras?
            this.bounds = new Aabb3(vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0));
            this.bounds.transform(this.finalTransform);
        } else {
            // TODO!: mesh AND children?
            this.bounds = new Aabb3();
            for (const node of this.children) {
                node.updateBounds();
                this.bounds.union(node.bounds);
            }
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
