import { mat4 } from 'gl-matrix';
import { gltf as GLTF } from 'gltf-loader-ts';
import { Camera, Context, Program } from 'webgl-operate';

import { Aabb3 } from './aabb3';
import { Asset } from './asset';
import { Material } from './material';
import { Node } from './node';
import { PbrShader } from './pbrshader';
import { Primitive } from './primitive';

export class Scene {
    name: string;
    /** all nodes */
    nodes: Node[] = [];
    rootNodes: Node[];
    // primitivesByMaterial: Map<Material, Primitive[]> = new Map();
    bounds: Aabb3 = new Aabb3();

    static async fromGltf(gScene: GLTF.Scene, asset: Asset): Promise<Scene> {
        const scene = new Scene();
        scene.name = gScene.name;
        scene.rootNodes = await Promise.all(gScene.nodes!.map((i) => {
            const gNode = asset.gAsset.gltf.nodes![i];
            return Node.fromGltf(gNode, asset);
        }));

        // propagate transforms
        const rootTransform = mat4.create(); // identity
        for (const node of scene.rootNodes) {
            node.updateTransform(rootTransform);
            node.updateBounds();
            scene.bounds.union(node.bounds);
        }

        // gather all nodes
        for (const rootNode of scene.rootNodes) {
            scene.nodes.push(rootNode);
            const stack = [rootNode];
            while (stack.length > 0) {
                const node = stack.pop()!;
                scene.nodes.push(node);
                stack.push.apply(stack, node.children);
            }
        }

        // TODO!!: not enough for batching by material - also needs to be per node....
        // gather primitives by material
        // for (const node of scene.nodes) {
        //     if (node.mesh === undefined) { continue; }
        //     for (const prim of node.mesh.primitives) {
        //         const mat = prim.material;
        //         const primitives = scene.primitivesByMaterial.get(mat) || [];
        //         if (primitives.length === 0) { scene.primitivesByMaterial.set(mat, primitives); }
        //         primitives.push(prim);
        //     }
        // }

        return scene;
    }

    draw(camera: Camera, shader: PbrShader) {
        for (const node of this.rootNodes) {
            node.draw(camera, shader);
        }
        // for (const [material, primitives] of this.primitivesByMaterial) {
        //     // TODO!!!: node...transforms...
        //     material.bind(shader);
        //     for (const prim of primitives) {
        //         prim.draw(shader);
        //     }
        //     material.unbind();
        // }
    }

    uninitialize() {
        for (const node of this.rootNodes) {
            node.uninitialize();
        }
    }
}
