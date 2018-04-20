

import * as gloperate from 'webgl-operate';

import { GltfRenderer } from './gltfrenderer';


function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new GltfRenderer();
    canvas.renderer = renderer;
    canvas.element.addEventListener('click', () => gloperate.viewer.Fullscreen.toggle(canvas.element));
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
