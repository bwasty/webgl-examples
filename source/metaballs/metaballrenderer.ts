
import {
    Camera, Context, Invalidate, MouseEventProvider, Navigation, Program, Renderer,
    Shader,
    TextureCube,
    vec3,
    Wizard,
} from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';


export class MetaballRenderer extends Renderer {
    protected _program: Program;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    // SkyBox
    protected _cubeMap: TextureCube;
    protected _skyBox: Skybox;
    protected _cubeMapChanged: boolean;

    protected onUpdate(): boolean {
        // Update camera navigation (process events)
        this._navigation.update();

        // Reset state
        const altered = this._altered.any || this._camera.altered || this._cubeMapChanged;
        this._altered.reset();
        this._camera.altered = false;
        this._cubeMapChanged = false;

        // If anything has changed, render a new frame
        return altered;
    }

    protected onPrepare(): void {
    }

    protected onFrame(frameNumber: number): void {
        const gl = this._context.gl;

        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);

        // this._program.bind();

        // Render skybox
        this._skyBox.frame();
    }

    protected onSwap(): void {
    }


    protected onInitialize(context: Context, callback: Invalidate, mouseEventProvider: MouseEventProvider): boolean {
        const gl = this._context.gl;

        const vert = new Shader(this._context, gl.VERTEX_SHADER, 'particle_draw_5.vert');
        vert.initialize(require('./particle_draw_5.vert'));
        const frags = ['particle_draw_5_3.frag', 'metaballs.frag', 'cooktorrance.frag'].map((fileName) => {
            const frag = new Shader(this._context, gl.FRAGMENT_SHADER, fileName);
            frag.initialize(require('./' + fileName));
            return frag;
        });

        this._program = new Program(this._context);
        this._program.initialize([vert, ...frags]);

        // Initialize camera
        this._camera = new Camera();
        this._camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this._camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._camera.eye = vec3.fromValues(0.0, 0.0, 2.0);
        this._camera.near = 0.1;
        this._camera.far = 8.0;

        // Initialize navigation
        this._navigation = new Navigation(callback, mouseEventProvider);
        this._navigation.camera = this._camera;

        // Initialize skyBox
        const internalFormatAndType = Wizard.queryInternalTextureFormat(this._context, gl.RGB, Wizard.Precision.byte);
        this._cubeMap = new TextureCube(this._context);
        this._cubeMap.initialize(1024, internalFormatAndType[0], gl.RGB, internalFormatAndType[1]);

        this._skyBox = new Skybox();
        this._skyBox.initialize(this._context, this._camera, this._cubeMap);

        this._cubeMap.load({
            positiveX: 'data/env_cube_px.png', negativeX: 'data/env_cube_nx.png',
            positiveY: 'data/env_cube_py.png', negativeY: 'data/env_cube_ny.png',
            positiveZ: 'data/env_cube_pz.png', negativeZ: 'data/env_cube_nz.png',
        }).then(() => this.invalidate(true));

        return true;
    }

    protected onUninitialize(): void {
    }

}

