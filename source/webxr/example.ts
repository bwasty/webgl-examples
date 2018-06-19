import { GltfAsset, GltfLoader } from 'gltf-loader-ts';
import * as gloperate from 'webgl-operate';

import { supportsXR, XRController, Canvas } from 'webgl-operate';
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

let gltfAsset: GltfAsset;

async function loadGltf(loader: GltfLoader, uri: string, renderer: WebXRRenderer) {
    try {
        console.time('GltfLoader.load');
        gltfAsset = await loader.load(uri);
        console.timeEnd('GltfLoader.load');
        console.time('asset.preFetchAll');
        await gltfAsset.preFetchAll();
        console.timeEnd('asset.preFetchAll');
        loadScene(gltfAsset, renderer);
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

let renderer: WebXRRenderer;
function initializeRenderer(canvas: Canvas) {
    renderer = new WebXRRenderer();
    canvas.renderer = renderer;

    if (gltfAsset) {
        // Asset has been loaded before - just need to re-create gl resources
        loadScene(gltfAsset, renderer);
    } else {
        const loader = new GltfLoader();
        // tslint:disable-next-line:max-line-length
        const uri = 'https://raw.githubusercontent.com/immersive-web/webxr-samples/master/media/gltf/space/space.gltf';
        loadGltf(loader, uri, renderer);
    }
}

function initFallback() {
    const canvas = new gloperate.Canvas('example-canvas', { depth: true });
    initializeRenderer(canvas);
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
        initFallback();
        return;
    }

    type Mode = 'present' | 'mirror' | 'magic-window';
    const mode = getQueryParam('mode') || 'present';

    let xrc: XRController;
    if (mode === 'present') {
        // This resembles the '1 - XR Presentation' example
        // https://immersive-web.github.io/webxr-samples/xr-presentation.html

        xrc = new gloperate.XRController({ immersive: true });
    } else if (mode === 'mirror') {
        // 2 - Mirroring
        // https://immersive-web.github.io/webxr-samples/mirroring.html

        // TODO!!: make XRPresentationContext type available here...
        const mirrorCanvas = document.getElementById('example-canvas') as HTMLCanvasElement;
        const context = mirrorCanvas.getContext('xrpresent');
        xrc = new gloperate.XRController({
            immersive: true,
            outputContext: context,
        });
    } else if (mode === 'magic-window') {
        // 3 - Magic Window
        // https://immersive-web.github.io/webxr-samples/magic-window.html

        const magicWindowCanvas = document.getElementById('example-canvas') as HTMLCanvasElement;
        const context = magicWindowCanvas.getContext('xrpresent');
        xrc = new gloperate.XRController({
            immersive: false,
            outputContext: context,
        });

    } else {
        throw new Error('invalid mode');
    }

    try {
        await xrc.initialize();
    } catch (e) {
        console.error(e);
        message(e.message);
        initFallback();
        return;
    }

    if (mode === 'magic-window') {
        // start non-immersive session and prepare for entering immersive session via button later
        await xrc.requestSession();
        initializeRenderer(xrc.canvas!);

        xrc.sessionCreationOptions.immersive = true;
    }

    if (!await xrc.supportsSession()) {
        message('immersive session not supported.');
    }
    message('Ready.', 'green');
    xrButton.disabled = false;

    xrButton.onclick = async () => {
        if (xrc.session && xrc.session.immersive) {
            await xrc.endSession();
            message('Ready.', 'green');
            xrButton.innerHTML = 'Enter XR';
        } else {
            message('Requesting session...', 'black');
            await xrc.requestSession();
            message('Session active.', 'green');
            xrButton.innerHTML = 'Exit XR';

            initializeRenderer(xrc.canvas!);

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
