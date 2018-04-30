import { mat4 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Camera, Context, Program } from 'webgl-operate';

import { Aabb3 } from './aabb3';
import { Node } from './node';
import { PbrShader } from './pbrshader';

export class Scene {
    name: string;
    nodes: Node[];
    bounds: Aabb3 = new Aabb3();

    static async fromGltf(gScene: GLTF.Scene, asset: GltfAsset, context: Context): Promise<Scene> {
        const scene = new Scene();
        scene.name = gScene.name;
        scene.nodes = await Promise.all(gScene.nodes!.map((i) => {
            const gNode = asset.gltf.nodes![i];
            return Node.fromGltf(gNode, asset, context);
        }));

        // propagate transforms
        const rootTransform = mat4.create(); // identity
        for (const node of scene.nodes) {
            node.updateTransform(rootTransform);
            node.updateBounds();
            scene.bounds.union(node.bounds);
        }

        return scene;
    }

    draw(camera: Camera, shader: PbrShader) {
        for (const node of this.nodes) {
            node.draw(camera, shader);
        }
    }

    uninitialize() {
        for (const node of this.nodes) {
            node.uninitialize();
        }
    }
}
