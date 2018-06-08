import * as dat from 'dat.gui';
import { GltfAsset, GltfLoader } from 'gltf-loader-ts';
import * as SimpleDropzone from 'simple-dropzone/dist/simple-dropzone';
import * as gloperate from 'webgl-operate';

import { Asset } from './asset';
import { GltfRenderer } from './gltfrenderer';

const BASE_MODEL_URI = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/';
// For faster local testing, clone the sample repo and start a server there, e.g. with `http-server --cors`
// (-> `npm i -g http-server)
// const BASE_MODEL_URI = 'http://localhost:8080/';

// tslint:disable:no-console
type GltfVariant = 'glTF'|'glTF-Binary'|'glTF-Draco'|'glTF-Embedded'|'glTF-pbrSpecularGlossiness'|string;
interface GltfSample {
    name: string;
    screenshot: string;
    variants: {[key in GltfVariant]: string };
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
    const asset = new Asset(gAsset, renderer.context);
    const scene = await asset.getScene();
    console.timeEnd('asset.getScene');
    renderer.scene = scene;
}

async function loadGltf(loader: GltfLoader, uri: string, renderer: GltfRenderer) {
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

class GuiOptions  {
    // tslint:disable-next-line:variable-name
    Sample = 'DamagedHelmet';
    // tslint:disable-next-line:variable-name
    Variant: GltfVariant = 'glTF';
}


// https://stackoverflow.com/a/45699568
function updateDatDropdown(target: any, list: any) {
    let innerHTMLStr = '';
    if (list.constructor.name === 'Array') {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < list.length; i++) {
            const str = '<option value=\'' + list[i] + '\'>' + list[i] + '</option>';
            innerHTMLStr += str;
        }
    }

    if (list.constructor.name === 'Object') {
        for (const key in list){
            const str = '<option value=\'' + list[key] + '\'>' + key + '</option>';
            innerHTMLStr += str;
        }
    }
    if (innerHTMLStr !== '') { target.domElement.children[0].innerHTML = innerHTMLStr; }
}

async function setupDatGUI(renderer: GltfRenderer, loader: GltfLoader) {
    const gui = new dat.GUI({autoPlace: false, width: 310});
    const options = new GuiOptions();
    options.Sample = getQueryParam('model') || 'DamagedHelmet';

    const samples: GltfSample[] = await(await fetch(BASE_MODEL_URI + 'model-index.json')).json();
    const sampleNames = samples.map((s) => s.name);
    const selectedSample = samples.find(((s) => s.name === options.Sample))!;
    const sampleCtrl = gui.add(options, 'Sample', sampleNames);

    const advanced = gui.addFolder('Advanced');
    const variantCtrl = advanced.add(options, 'Variant', Object.keys(selectedSample.variants));
    advanced.open();

    sampleCtrl.onChange((sampleName: string) => {
        const sample = samples.find(((s) => s.name === sampleName))!;
        let variant = variantCtrl.getValue();
        if (!(variant in sample.variants)) {
            console.warn(`Model doesn't have variant ${variant}, resetting to glTF`);
            variant = 'glTF';
            variantCtrl.setValue(variant);
        }
        const url = getSampleUrl(sample, BASE_MODEL_URI, variant);
        loadGltf(loader, url, renderer);
        history.pushState(url, undefined, `?model=${sampleName}&variant=${variant}`);
        updateDatDropdown(variantCtrl, Object.keys(sample.variants));
        variantCtrl.setValue(variant);
    });

    variantCtrl.onChange((variant: string) => {
        const sampleName = sampleCtrl.getValue();
        const sample = samples.find(((s) => s.name === sampleName))!;
        const url = getSampleUrl(sample, BASE_MODEL_URI, variant);
        loadGltf(loader, url, renderer);
        history.pushState(url, undefined, `?model=${sampleName}&variant=${variant}`);
    });

    const perfFolder = advanced.addFolder('Performance');
    const perfLi = document.createElement('li');
    renderer.stats.dom.style.position = 'static';
    perfLi.appendChild(renderer.stats.dom);
    perfLi.classList.add('dat-gui-stats');
    (perfFolder as any).__ul.appendChild(perfLi);
    perfFolder.open();

    const guiWrap = document.createElement('div');
    document.getElementById('canvas-container')!.appendChild(guiWrap);
    guiWrap.classList.add('dat-gui-wrap');
    guiWrap.appendChild(gui.domElement);

    window.onpopstate = async(event) => {
        const modelUrl = event.state;
        loadGltf(loader, modelUrl, renderer);
    };

    // for interactive 'integration testing' - load all samples and optionally
    // wait a bit in between
    (window as any).cycleModels = async(delayMs?: number) => {
        for (const sample of samples) {
            console.log(sample.name);
            try {
                await loadGltf(loader, getSampleUrl(sample, BASE_MODEL_URI, variantCtrl.getValue()), renderer);
            } catch (e) {
                console.error(e);
            }
            if (delayMs !== undefined) {
                await delay(delayMs);
            }
        }
    };
}

async function onload() {
    // TODO!!: HACK - see https://github.com/cginternals/webgl-operate/issues/68
    (gloperate.Context as any).CONTEXT_ATTRIBUTES.depth = true;
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
    } else {
        uri = BASE_MODEL_URI + `DamagedHelmet/glTF/DamagedHelmet.gltf`;
    }

    setupDragAndDrop(loader, renderer);

    setupDatGUI(renderer, loader);

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
