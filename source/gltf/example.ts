import { GltfLoader } from 'gltf-loader-ts';
import * as gloperate from 'webgl-operate';

import { Mesh } from 'gltf-loader-ts/lib/gltf';
import { GltfRenderer } from './gltfrenderer';
import { Primitive } from './primitive';
import { Scene } from './scene';


async function loadGltf(renderer: GltfRenderer) {
    const loader = new GltfLoader();
    const baseUri = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/'
    // const baseUri = 'http://localhost:8080/';
    const uri = baseUri +
        // 'BoxTextured/glTF/BoxTextured.gltf';
        // 'Box/glTF/Box.gltf';
        'DamagedHelmet/glTF/DamagedHelmet.gltf';
        // 'DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
        // 'Buggy/glTF/Buggy.gltf';
        // 'BoomBox/glTF/BoomBox.gltf';
    const asset = await loader.load(uri);
    console.log('Loaded ' + uri);
    await asset.preFetchAll();
    console.log('Pre-fetched all buffers & images');
    return asset;
}


async function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new GltfRenderer();
    canvas.renderer = renderer;

    const asset = await loadGltf(renderer);
    // load the default or the first scene
    const gScene = asset.gltf.scenes![asset.gltf.scene || 0];
    const scene = await Scene.fromGltf(gScene, asset, context);
    renderer.scene = scene;

    canvas.element.addEventListener('dblclick', () => gloperate.viewer.Fullscreen.toggle(canvas.element));
    canvas.element.addEventListener('touchstart', () => gloperate.viewer.Fullscreen.toggle(canvas.element));

    // export variables
    (window as any)['canvas'] = canvas;
    (window as any)['context'] = context;
    (window as any)['renderer'] = renderer;
}

if (window.document.readyState === 'complete') {
    onload();
} else {
    window.onload = onload;
}
