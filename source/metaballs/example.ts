

import * as gloperate from 'webgl-operate';

import { MetaballRenderer } from './metaballrenderer';


function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new MetaballRenderer();
    canvas.renderer = renderer;

    canvas.element.addEventListener('dblclick', () => { gloperate.viewer.Fullscreen.toggle(canvas.element); });

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
