import { GltfAsset, GltfLoader } from 'gltf-loader-ts';
import * as gloperate from 'webgl-operate';

import { supportsXR } from 'webgl-operate';
import { Asset } from '../gltf/asset';
import { WebXRRenderer } from './webxrrenderer';

// tslint:disable:no-console

async function loadScene(gAsset: GltfAsset, renderer: WebXRRenderer) {
    console.time('asset.getScene');
    const asset = new Asset(gAsset, renderer.context);
    const scene = await asset.getScene();
    console.timeEnd('asset.getScene');
    renderer.scene = scene;
}

async function loadGltf(loader: GltfLoader, uri: string, renderer: WebXRRenderer) {
    try {
        console.time('GltfLoader.load');
        const gAsset = await loader.load(uri);
        console.timeEnd('GltfLoader.load');
        console.time('asset.preFetchAll');
        await gAsset.preFetchAll();
        console.timeEnd('asset.preFetchAll');
        loadScene(gAsset, renderer);
    } catch (e) {
        console.error(e);
        if (typeof e === 'string') {
            alert(e);
        } else {
            const detail = e.status ? ` (${e.status} ${e.statusText} ${e.url})` : '';
            alert(`Error loading glTF` + detail);
        }
    }
}

function getQueryParam(param: string): string | undefined {
    const re = new RegExp(`${param}=([^&]+)`);
    const match = document.location.search.match(re);
    if (match) {
        return match[1];
    }
}


async function onload() {
    // TODO!!: HACK - see https://github.com/cginternals/webgl-operate/issues/68
    // (gloperate.Context as any).CONTEXT_ATTRIBUTES.depth = true;
    // const canvas = new gloperate.Canvas('example-canvas');
    // const context = canvas.context;
    // const renderer = new WebXRRenderer();
    // canvas.renderer = renderer;

    const messageEl = document.getElementById('message')!;
    function message(msg: string, color: 'red' | 'black' | 'green' = 'red') {
        messageEl.innerHTML = msg;
        messageEl.style.color = color;
    }
    const xrButton = document.getElementById('xr-button') as HTMLButtonElement;

    if (!supportsXR()) {
        message('Your browser does not support WebXR.');
        return;
    }

    const xrc = new gloperate.XRController({ immersive: true });
    try {
        await xrc.initialize();
    } catch (e) {
        console.error(e);
        message(e.message);
        return;
    }
    if (!await xrc.supportsSession()) {
        message('immersive session not supported.')
    }
    message('Ready.', 'green');
    xrButton.disabled = false;

    xrButton.onclick = async () => {
        message('Requesting session...', 'black');
        await xrc.requestSession();
        message('Session active.', 'green');
        // TODO!: make it an exit button
        xrButton.disabled = true;
    };

    // TODO!!!: need to get canvas from xrc to set renderer?
    const loader = new GltfLoader();

    // const uri = 'https://raw.githubusercontent.com/immersive-web/webxr-samples/master/media/gltf/space/space.gltf';
    // loadGltf(loader, uri, renderer);

    // canvas.element.addEventListener('dblclick', () => gloperate.viewer.Fullscreen.toggle(canvas.element));
    // canvas.element.addEventListener('touchstart', () => gloperate.viewer.Fullscreen.toggle(canvas.element));

    // // export variables
    // (window as any)['canvas'] = canvas;
    // (window as any)['context'] = context;
    // (window as any)['renderer'] = renderer;
}

if (window.document.readyState === 'complete') {
    onload();
} else {
    window.onload = onload;
}
