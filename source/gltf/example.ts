import { GltfAsset, GltfLoader } from 'gltf-loader-ts';
import * as gloperate from 'webgl-operate';

import { Mesh } from 'gltf-loader-ts/lib/gltf';
import { GltfRenderer } from './gltfrenderer';
import { Primitive } from './primitive';
import { Scene } from './scene';

// const BASE_MODEL_URI = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/'
const BASE_MODEL_URI = 'https://raw.githubusercontent.com/bwasty/glTF-Sample-Models/generate_index/2.0/'
// const BASE_MODEL_URI = 'http://localhost:8080/';

type GltfVariants = 'glTF'|'glTF-Binary'|'glTF-Draco'|'glTF-Embedded'|'glTF-pbrSpecularGlossiness'|string;
interface GltfSample {
    name: string;
    screenshot: string;
    variants: {[key in GltfVariants]: string };
}

async function setupSampleDropdown(renderer: GltfRenderer, loader: GltfLoader, selectedModel: string) {
    const url = 'https://raw.githubusercontent.com/bwasty/glTF-Sample-Models/generate_index/2.0/model-index.json';
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
        if (!modelUrl) {
            // TODO!!: necessar?
            console.warn('yes, remove todo above...');
            location.reload();
            return;
        }
        const asset = await loader.load(BASE_MODEL_URI + modelUrl);
        loadScene(asset, renderer);
    };
}

/** baseUrl should end with a slash */
function getSampleUrl(sample: GltfSample, baseUrl = '/', variant = 'glTF') {
    return `${baseUrl}${sample.name}/${variant}/${sample.variants[variant]}`;
}

async function loadScene(asset: GltfAsset, renderer: GltfRenderer) {
    // load the default or the first scene
    const gScene = asset.gltf.scenes![asset.gltf.scene || 0];
    const scene = await Scene.fromGltf(gScene, asset, renderer.context);
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


    const asset = await loader.load(uri);
    await asset.preFetchAll();
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
