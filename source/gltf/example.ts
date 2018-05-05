import { GltfAsset, GltfLoader } from 'gltf-loader-ts';
import * as gloperate from 'webgl-operate';

import { Mesh } from 'gltf-loader-ts/lib/gltf';
import { GltfRenderer } from './gltfrenderer';
import { Primitive } from './primitive';
import { Scene } from './scene';
import { Asset } from './asset';

const BASE_MODEL_URI = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/';
// const BASE_MODEL_URI = 'https://raw.githubusercontent.com/bwasty/glTF-Sample-Models/generate_index/2.0/'
// const BASE_MODEL_URI = 'http://localhost:8080/';

// tslint:disable:no-console
type GltfVariants = 'glTF'|'glTF-Binary'|'glTF-Draco'|'glTF-Embedded'|'glTF-pbrSpecularGlossiness'|string;
interface GltfSample {
    name: string;
    screenshot: string;
    variants: {[key in GltfVariants]: string };
}

async function setupSampleDropdown(renderer: GltfRenderer, loader: GltfLoader, selectedModel: string) {
    const url = BASE_MODEL_URI + 'model-index.json';
    const samples: GltfSample[] = await(await fetch(url)).json();
    const select = document.getElementById('sample-select') as HTMLSelectElement;
    for (const sample of samples) {
        const op = new Option();
        op.value = getSampleUrl(sample);
        op.text = sample.name;
        if (sample.name === selectedModel) {
            op.selected = true;
        }
        select.options.add(op);
    }

    select.onchange = async function(this: HTMLSelectElement) {
        const option = this.selectedOptions[0];
        const asset = await loader.load(BASE_MODEL_URI + option.value);
        loadScene(asset, renderer);
        history.pushState(option.value, undefined, '?model=' + option.text);
    };

    window.onpopstate = async(event) => {
        const modelUrl = event.state;
        console.time('GltfLoader.load');
        const asset = await loader.load(BASE_MODEL_URI + modelUrl);
        console.timeEnd('GltfLoader.load');
        loadScene(asset, renderer);
    };

    (window as any).cycleModels = async(delayMs?: number) => {
        const select = document.getElementById('sample-select') as HTMLSelectElement;
        const numOptions = select.options.length;
        for (const option of Array.from(select.options)) {
            console.log(option.text);
            const asset = await loader.load(BASE_MODEL_URI + option.value);
            try {
                await loadScene(asset, renderer);
            } catch (e) {
                console.error(e);
            }
            if (delayMs !== undefined) {
                await delay(delayMs);
            }
        }
    };
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms) );
}

/** baseUrl should end with a slash */
function getSampleUrl(sample: GltfSample, baseUrl = '/', variant = 'glTF') {
    return `${baseUrl}${sample.name}/${variant}/${sample.variants[variant]}`;
}

async function loadScene(gAsset: GltfAsset, renderer: GltfRenderer) {
    console.time('asset.preFetchAll');
    // TODO!!: fix lazy loading in gltf-loader-ts
    await gAsset.preFetchAll();
    console.timeEnd('asset.preFetchAll');
    console.time('asset.getScene');
    // console.profile('Scene.fromGltf');
    const asset = new Asset(gAsset, renderer.context);
    const scene = await asset.getScene();
    // console.profileEnd();
    console.timeEnd('asset.getScene');
    renderer.scene = scene;
}

async function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new GltfRenderer();
    canvas.renderer = renderer;

    const loader = new GltfLoader();

    let uri;
    const match = document.location.search.match(/model=(.+)/);
    if (match) {
        const model = match[1];
        uri = `${BASE_MODEL_URI}${model}/glTF/${model}.gltf`;
        setupSampleDropdown(renderer, loader, model);
    } else {
        uri = BASE_MODEL_URI +
            // 'BoxTextured/glTF/BoxTextured.gltf';
            // 'Box/glTF/Box.gltf';
            `DamagedHelmet/glTF/DamagedHelmet.gltf`;
            // 'DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
            // 'Buggy/glTF/Buggy.gltf';
            // 'BoomBox/glTF/BoomBox.gltf';

        setupSampleDropdown(renderer, loader, 'DamagedHelmet');
    }

    console.time('GltfLoader.load');
    const asset = await loader.load(uri);
    console.timeEnd('GltfLoader.load');
    loadScene(asset, renderer);

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
