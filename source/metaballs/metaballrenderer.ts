
import {
    Camera, Context, Invalidate, MouseEventProvider, Navigation, Program, Renderer,
    Shader,
    TextureCube,
    vec3,
    Wizard,
} from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';


export class MetaballRenderer extends Renderer {
    protected _programParticleStep: Program;
    protected _programMetaballs: Program;
    protected _programBlurH: Program;
    protected _programBlurV: Program;
    protected _programGlow: Program;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    // SkyBox
    protected _cubeMap: TextureCube;
    protected _skyBox: Skybox;
    protected _cubeMapChanged: boolean;

    protected _lastStepTimestamp: number;

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

        ///
        gl.disable(gl.DEPTH_TEST);

        this._programMetaballs.bind();

        // Render skybox
        this._skyBox.frame();
    }

    protected step() {
        const now = performance.now();
        const delta = now - this._lastStepTimestamp;
        this._lastStepTimestamp = now;
    }

    protected onSwap(): void {
    }


    protected onInitialize(context: Context, callback: Invalidate, mouseEventProvider: MouseEventProvider): boolean {
        const gl = this._context.gl;

        this._programParticleStep = this.createProgram('particle_step.vert', 'particle_step.frag');
        this._programMetaballs = this.createProgram('particle_draw_5.vert', 'particle_draw_5_3.frag');
        this._programBlurH = this.createProgram('particle_glow_5_4.vert', 'gaussh.frag');
        this._programBlurV = this.createProgram('particle_glow_5_4.vert', 'gaussv.frag');
        this._programGlow = this.createProgram('particle_glow_5_4.vert', 'particle_glow_5_4.frag');

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

        this._lastStepTimestamp = performance.now();

        return true;
    }

    protected createProgram(vertexFile: string, fragmentFile: string): Program {
        const vert = new Shader(this._context, WebGLRenderingContext.VERTEX_SHADER, vertexFile);
        vert.initialize(require('./' + vertexFile));
        const frag = new Shader(this._context, WebGLRenderingContext.FRAGMENT_SHADER, fragmentFile);
        frag.initialize(require('./' + fragmentFile));
        const program = new Program(this._context);
        program.initialize([vert, frag]);
        return program;
    }

    protected onUninitialize(): void {
    }

}

