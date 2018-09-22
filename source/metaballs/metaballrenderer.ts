
import {
    auxiliaries, Camera, Context, Framebuffer, Invalidate, MouseEventProvider, Navigation,
    NdcFillingTriangle, Program, Renderer, Shader, Texture2, TextureCube, vec3, Wizard, Renderbuffer,
} from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';

const rand = auxiliaries.rand;

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
    depthRenderbuffer: Renderbuffer;

    ndcTriangle: NdcFillingTriangle;

    // Camera and navigation
    camera: Camera;
    navigation: Navigation;

    // SkyBox
    cubeMap: TextureCube;
    skyBox: Skybox;
    cubeMapChanged: boolean;

    size: number;
    width: number;
    height: number;

    elapsed: number;

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

        const time = performance.now()
        const delta = time - this.elapsed;
        this.elapsed = time;

        this.step(delta * 10);

        gl.enable(gl.DEPTH_TEST);

        // Render skybox
        this.skyBox.frame();
    }

    step(delta: number) {
        const gl = this._context.gl;
        this.positions.bind(gl.TEXTURE0);
        this.velocities.bind(gl.TEXTURE1);
        // TODO!
        // this.forces.bind(2);

        this.stepFBO.bind();

        // TODO!!: continue
    }

    onSwap(): void {
    }


    onInitialize(context: Context, callback: Invalidate, mouseEventProvider: MouseEventProvider): boolean {
        const gl = context.gl;
        const gl2facade = context.gl2facade;

        this.programParticleStep = this.createProgram('particle_step.vert', 'particle_step.frag');
        this.programMetaballs = this.createProgram('particle_draw_5.vert', 'particle_draw_5_3.frag');
        this.programBlurH = this.createProgram('particle_glow_5_4.vert', 'gaussh.frag');
        this.programBlurV = this.createProgram('particle_glow_5_4.vert', 'gaussv.frag');
        this.programGlow = this.createProgram('particle_glow_5_4.vert', 'particle_glow_5_4.frag');

        // textures

        // Choose appropriate width and height for the current number of particles
        this.size = 16;
        this.width = Math.sqrt(this.size);
        this.height = this.width;
        const remain = this.size - (this.height * this.width);
        this.height += remain / this.width + (remain % this.width === 0 ? 0 : 1);

        const setFilterWrap = (tex: Texture2, filter = gl.NEAREST, wrap = gl.CLAMP_TO_EDGE) => {
            tex.filter(filter, filter, true, false);
            tex.wrap(wrap, wrap, false, true);
        };
        this.positions = new Texture2(context);
        this.positions.initialize(this.width, this.height, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        setFilterWrap(this.positions);

        this.velocities = new Texture2(context);
        this.velocities.initialize(this.width, this.height, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        setFilterWrap(this.velocities);

        this.materials = [new Texture2(context), new Texture2(context)];
        this.materials[0].initialize(this.width, this.height, gl.RGBA32F, gl.RGBA, gl.FLOAT)
        setFilterWrap(this.materials[0]);
        this.materials[1].initialize(this.width, this.height, gl.RGBA32F, gl.RGBA, gl.FLOAT)
        setFilterWrap(this.materials[1]);

        // TODO!: forces

        // fill buffers with data
        this.reset();

        this.color = new Texture2(context);
        this.color.initialize(1, 1, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
        setFilterWrap(this.color, gl.LINEAR);

        this.glows = [new Texture2(context), new Texture2(context)];
        this.glows.forEach((tex) => {
            tex.initialize(1, 1, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
            setFilterWrap(tex, gl.LINEAR);
        });

        // create write access to buffers

        this.depthRenderbuffer = new Renderbuffer(context);
        this.depthRenderbuffer.initialize(this.width, this.height, gl.DEPTH_COMPONENT16);

        // frame buffers
        this.stepFBO = new Framebuffer(context);
        this.stepFBO.initialize([
            [gl2facade.COLOR_ATTACHMENT0, this.positions],
            [gl2facade.COLOR_ATTACHMENT1, this.velocities],
            [gl.DEPTH_ATTACHMENT, this.depthRenderbuffer]
        ]);
        this.colorFBO = new Framebuffer(context);
        this.glowFBO = new Framebuffer(context);

        this.ndcTriangle = new NdcFillingTriangle(context);

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

        this.elapsed = performance.now();

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

    reset() {
        const rawPositions = new Float32Array(this.size * 4); // position + radius
        const rawVelocities = new Float32Array(this.size * 4); // velocities + dummy (e.g. active)
        const rawMaterials0 = new Float32Array(this.size * 4);
        const rawMaterials1 = new Float32Array(this.size * 4);

        for (let i = 0; i < this.size; ++i) {
            rawPositions[i * 4 + 0] = rand(-2., 2.);
            rawPositions[i * 4 + 1] = rand(-2., 2.);
            rawPositions[i * 4 + 2] = rand(-2., 2.);
            rawPositions[i * 4 + 3] = rand(0.4, 0.8);

            rawVelocities[i * 4 + 0] = rand(-1., 1.);
            rawVelocities[i * 4 + 1] = rand(-1., 1.);
            rawVelocities[i * 4 + 2] = rand(-1., 1.);
            rawVelocities[i * 4 + 3] = 0.;

            const S = rand(0., 1.);

            rawMaterials0[i * 4 + 0] = S;  // specular R
            rawMaterials0[i * 4 + 1] = S;  // specular G
            rawMaterials0[i * 4 + 2] = S;  // specular B
            rawMaterials0[i * 4 + 3] = rand(0., 0.66);  // refrectence

            rawMaterials1[i * 4 + 0] = rand(0., 1.);  // diffuse R
            rawMaterials1[i * 4 + 1] = rand(0., 1.);  // diffuse G
            rawMaterials1[i * 4 + 2] = rand(0., 1.);  // diffuse B
            rawMaterials1[i * 4 + 3] = rand(0., 0.33);  // roughness
        }

        const gl = this._context.gl;

        this.positions.data(rawPositions);
        this.velocities.data(rawVelocities);
        this.materials[0].data(rawMaterials0);
        this.materials[1].data(rawMaterials1);

        // random fill forces
        const fdimx = 5;
        const fdimy = 5;
        const fdimz = 5;

        // this has center axes and allows for random rings etc..
        const rawForces = new Float32Array(fdimx * fdimy * fdimz * 3);
        for (let i = 0; i < fdimx * fdimy * fdimz; ++i) {
            const f = vec3.fromValues(rand(-1, 1), rand(-1, 1), rand(-1, 1));
            vec3.normalize(f, f);
            rawForces[i * 3 + 0] = f[0];
            rawForces[i * 3 + 1] = f[1];
            rawForces[i * 3 + 2] = f[2];
        }

        // TODO!!: fill 3d texture...
    }

    onUninitialize(): void {
    }
}

