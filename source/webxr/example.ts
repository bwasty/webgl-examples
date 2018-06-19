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
    // TODO!: magic window...
    // const canvas = new gloperate.Canvas('example-canvas');

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
        if (xrc.session) {
            await xrc.endSession();
            message('Ready.', 'green');
            xrButton.innerHTML = 'Enter XR';
        } else {
            message('Requesting session...', 'black');
            await xrc.requestSession();
            message('Session active.', 'green');
            xrButton.innerHTML = 'Exit XR';

            const renderer = new WebXRRenderer();
            xrc.canvas!.renderer = renderer;

            const loader = new GltfLoader();
            // tslint:disable-next-line:max-line-length
            const uri = 'https://raw.githubusercontent.com/immersive-web/webxr-samples/master/media/gltf/space/space.gltf';
            loadGltf(loader, uri, renderer);

            xrc.session.addEventListener('end', () => {
                message('Ready.', 'green');
                xrButton.innerHTML = 'Enter XR';
            });
        }
    };



    // canvas.element.addEventListener('dblclick', () => gloperate.viewer.Fullscreen.toggle(canvas.element));
    // canvas.element.addEventListener('touchstart', () => gloperate.viewer.Fullscreen.toggle(canvas.element));

    // export variables
    (window as any)['xrcontroller'] = xrc;
}

if (window.document.readyState === 'complete') {
    onload();
} else {
    window.onload = onload;
}
