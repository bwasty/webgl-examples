import { GltfAsset, GltfLoader } from 'gltf-loader-ts';
import * as SimpleDropzone from 'simple-dropzone/dist/simple-dropzone';
import * as gloperate from 'webgl-operate';

import { Asset } from './asset';
import { GltfRenderer } from './gltfrenderer';

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

async function setupSampleDropdown(renderer: GltfRenderer, loader: GltfLoader,
        selectedModel: string, variant = 'glTF') {
    const url = BASE_MODEL_URI + 'model-index.json';
    const samples: GltfSample[] = await(await fetch(url)).json();
    const select = document.getElementById('sample-select') as HTMLSelectElement;
    for (const sample of samples) {
        if (!sample.variants[variant]) {
            continue;
        }
        const op = new Option();
        op.value = getSampleUrl(sample, '/', variant);
        op.text = sample.name;
        if (sample.name === selectedModel) {
            op.selected = true;
        }
        select.options.add(op);
    }

    select.onchange = async function(this: HTMLSelectElement) {
        const option = this.selectedOptions[0];
        loadGltf(loader, BASE_MODEL_URI + option.value, renderer);
        history.pushState(option.value, undefined, `?model=${option.text}&variant=${variant}`);
    };

    window.onpopstate = async(event) => {
        const modelUrl = event.state;
        loadGltf(loader, BASE_MODEL_URI + modelUrl, renderer);
    };

    (window as any).cycleModels = async(delayMs?: number) => {
        const select = document.getElementById('sample-select') as HTMLSelectElement;
        for (const option of Array.from(select.options)) {
            console.log(option.text);
            try {
                await loadGltf(loader, BASE_MODEL_URI + option.value, renderer);
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
    console.time('asset.getScene');
    // console.profile('Scene.fromGltf');
    const asset = new Asset(gAsset, renderer.context);
    const scene = await asset.getScene();
    // console.profileEnd();
    console.timeEnd('asset.getScene');
    renderer.scene = scene;
}

async function loadGltf(loader: GltfLoader, uri: string, renderer: GltfRenderer) {
    try {
        console.time('GltfLoader.load');
        const gAsset = await loader.load(uri);
        console.timeEnd('GltfLoader.load');
        // console.time('asset.preFetchAll');
        // await gAsset.preFetchAll();
        // console.timeEnd('asset.preFetchAll');
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

function setupDragAndDrop(loader: GltfLoader, renderer: GltfRenderer) {
    const canvas = document.getElementById('example-canvas');
    const input = document.getElementById('file-input');
    const dropzone = new SimpleDropzone(canvas, input);

    dropzone.on('drop', async({files}: {files: Map<string, File>}) => {
        const asset = await loader.loadFromFiles(files);
        loadScene(asset, renderer);
    });

    dropzone.on('droperror', ({message}: {message: string}) => {
        alert(`Error: ${message}`);
    });
}

async function onload() {
    const canvas = new gloperate.Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new GltfRenderer();
    canvas.renderer = renderer;

    const loader = new GltfLoader();

    let uri;
    const model = getQueryParam('model');
    if (model) {
        const variant = getQueryParam('variant') || 'glTF';
        const suffix = variant === 'glTF-Binary' ? 'glb' : 'gltf';
        uri = `${BASE_MODEL_URI}${model}/${variant}/${model}.${suffix}`;
        setupSampleDropdown(renderer, loader, model, variant);
    } else {
        uri = BASE_MODEL_URI + `DamagedHelmet/glTF/DamagedHelmet.gltf`;
        setupSampleDropdown(renderer, loader, 'DamagedHelmet');
    }

    setupDragAndDrop(loader, renderer);

    loadGltf(loader, uri, renderer);

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
