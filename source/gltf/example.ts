import { GltfLoader } from 'gltf-loader-ts';
import * as gloperate from 'webgl-operate';

import { Mesh } from 'gltf-loader-ts/lib/gltf';
import { GltfRenderer } from './gltfrenderer';
import { Primitive } from './primitive';


async function loadGltf(renderer: GltfRenderer) {
    const loader = new GltfLoader();
    const uri = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/' +
        'BoxTextured/glTF/BoxTextured.gltf';
        // 'Box/glTF/Box.gltf';
    const asset = await loader.load(uri);
    await asset.preFetchAll();
    console.log('loaded ' + uri, asset);
    return asset;
}


async function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new GltfRenderer();
    canvas.renderer = renderer;

    const asset = await loadGltf(renderer);
    // TMP: just get the first primitive
    const meshes = asset.gltf.meshes as Mesh[];
    const gPrimitive = meshes[0].primitives[0];
    const primitive = new Primitive(context);

    primitive.setFromGltf(gPrimitive, asset);
    renderer.primitive = primitive;

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
