import { mat4 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Camera, Context, Program } from 'webgl-operate';

import { Node } from './node';

export class Scene {
    name: string;
    nodes: Node[];
    // TODO!
    // bounds: Bounds;

    static fromGltf(gScene: GLTF.Scene, asset: GltfAsset, context: Context): Scene {
        const scene = new Scene();
        scene.name = gScene.name;
        scene.nodes = gScene.nodes!.map((i) => {
            const gNode = asset.gltf.nodes![i];
            return Node.fromGltf(gNode, asset, context);
        });

        // propagate transforms
        const rootTransform = mat4.create(); // identity
        for (const node of scene.nodes) {
            node.updateTransform(rootTransform);
            node.updateBounds();
            // TODO!
            // scene.bounds = scene.bounds.union(&node.bounds);
        }

        return scene;
    }

    draw(camera: Camera, program: Program) {
        for (const node of this.nodes) {
            node.draw(camera, program);
        }
    }

    uninitialize() {
        for (const node of this.nodes) {
            node.uninitialize();
        }
    }
}
