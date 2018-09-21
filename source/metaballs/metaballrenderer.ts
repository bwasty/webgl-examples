
import {
    Camera, Context, Invalidate, MouseEventProvider, Navigation, Program, Renderer,
    Shader,
    Texture2,
    TextureCube,
    vec3,
    Wizard,
    Framebuffer,
    NdcFillingTriangle,
} from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';


export class MetaballRenderer extends Renderer {
    programParticleStep: Program;
    programMetaballs: Program;
    programBlurH: Program;
    programBlurV: Program;
    programGlow: Program;

    positions: Texture2;
    velocities: Texture2;
    materials: [Texture2, Texture2];
    // forces: Texture3;
    color: Texture2;
    glows: [Texture2, Texture2];

    stepFBO: Framebuffer;
    colorFBO: Framebuffer;
    glowFBO: Framebuffer;
    // TODO: depth?

    ndcTriangle: NdcFillingTriangle;

    // Camera and navigation
    camera: Camera;
    navigation: Navigation;

    // SkyBox
    cubeMap: TextureCube;
    skyBox: Skybox;
    cubeMapChanged: boolean;

    lastStepTimestamp: number;

    onUpdate(): boolean {
        // Update camera navigation (process events)
        this.navigation.update();

        // Reset state
        const altered = this._altered.any || this.camera.altered || this.cubeMapChanged;
        this._altered.reset();
        this.camera.altered = false;
        this.cubeMapChanged = false;

        // If anything has changed, render a new frame
        return altered;
    }

    onPrepare(): void {
    }

    onFrame(frameNumber: number): void {
        const gl = this.context.gl;

        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        gl.disable(gl.DEPTH_TEST);

        this.programMetaballs.bind();

        // Render skybox
        this.skyBox.frame();
    }

    step() {
        const now = performance.now();
        const delta = now - this.lastStepTimestamp;
        this.lastStepTimestamp = now;
    }

    onSwap(): void {
    }


    onInitialize(context: Context, callback: Invalidate, mouseEventProvider: MouseEventProvider): boolean {
        const gl = context.gl;

        this.programParticleStep = this.createProgram('particle_step.vert', 'particle_step.frag');
        this.programMetaballs = this.createProgram('particle_draw_5.vert', 'particle_draw_5_3.frag');
        this.programBlurH = this.createProgram('particle_glow_5_4.vert', 'gaussh.frag');
        this.programBlurV = this.createProgram('particle_glow_5_4.vert', 'gaussv.frag');
        this.programGlow = this.createProgram('particle_glow_5_4.vert', 'particle_glow_5_4.frag');

        // Initialize camera
        this.camera = new Camera();
        this.camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this.camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this.camera.eye = vec3.fromValues(0.0, 0.0, 2.0);
        this.camera.near = 0.1;
        this.camera.far = 8.0;

        // Initialize navigation
        this.navigation = new Navigation(callback, mouseEventProvider);
        this.navigation.camera = this.camera;

        // Initialize skyBox
        const internalFormatAndType = Wizard.queryInternalTextureFormat(this._context, gl.RGB, Wizard.Precision.byte);
        this.cubeMap = new TextureCube(this._context);
        this.cubeMap.initialize(1024, internalFormatAndType[0], gl.RGB, internalFormatAndType[1]);

        this.skyBox = new Skybox();
        this.skyBox.initialize(this._context, this.camera, this.cubeMap);

        this.cubeMap.load({
            positiveX: 'data/env_cube_px.png', negativeX: 'data/env_cube_nx.png',
            positiveY: 'data/env_cube_py.png', negativeY: 'data/env_cube_ny.png',
            positiveZ: 'data/env_cube_pz.png', negativeZ: 'data/env_cube_nz.png',
        }).then(() => this.invalidate(true));

        this.lastStepTimestamp = performance.now();

        return true;
    }

    createProgram(vertexFile: string, fragmentFile: string): Program {
        const vert = new Shader(this._context, WebGLRenderingContext.VERTEX_SHADER, vertexFile);
        vert.initialize(require('./' + vertexFile));
        const frag = new Shader(this._context, WebGLRenderingContext.FRAGMENT_SHADER, fragmentFile);
        frag.initialize(require('./' + fragmentFile));
        const program = new Program(this._context);
        program.initialize([vert, frag]);
        return program;
    }

    onUninitialize(): void {
    }
}

