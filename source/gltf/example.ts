

import * as gloperate from 'webgl-operate';

import { GltfRenderer } from './gltfrenderer';

import { GltfLoader } from 'gltf-loader-ts';

async function loadGltf(renderer: GltfRenderer) {
    const loader = new GltfLoader();
    const uri = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/' +
        'BoxTextured/glTF/BoxTextured.gltf';
    const asset = await loader.load(uri);
    await asset.fetchAll();
    console.log('loaded ' + uri, asset);
    (window as any)['asset'] = asset;
}


function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new GltfRenderer();
    canvas.renderer = renderer;
    canvas.element.addEventListener('click', () => gloperate.viewer.Fullscreen.toggle(canvas.element));
    canvas.element.addEventListener('touchstart', () => gloperate.viewer.Fullscreen.toggle(canvas.element));

    loadGltf(renderer);

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
