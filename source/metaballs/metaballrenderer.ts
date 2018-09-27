
import {
    auxiliaries, Camera, Context, Framebuffer, Invalidate, MouseEventProvider, Navigation,
    NdcFillingTriangle, Program, Renderbuffer, Renderer, Shader, Texture2, Texture3, TextureCube, vec3, Wizard,
} from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';

const rand = auxiliaries.rand;

// 'force' 3D texture dimensions
const fdimx = 5;
const fdimy = 5;
const fdimz = 5;

export class MetaballRenderer extends Renderer {
    programParticleStep: Program;
    programMetaballs: Program;
    programBlurH: Program;
    programBlurV: Program;
    programGlow: Program;

    positions: [Texture2, Texture2];
    velocities: [Texture2, Texture2];
    srcIndex = 0;
    dstIndex = 1;

    materials: [Texture2, Texture2];
    forces: Texture3;
    color: Texture2;
    glows: [Texture2, Texture2];

    stepFBOs: [Framebuffer, Framebuffer];
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

    simulationSize: number;
    simulationWidth: number;
    simulationHeight: number;

    elapsed: number;

    uElapsed: WebGLUniformLocation | null;
    uPositions: WebGLUniformLocation | null;
    uVelocities: WebGLUniformLocation | null;
    uForces: WebGLUniformLocation | null;

    onUpdate(): boolean {
        if (this._altered.frameSize) {
            const [width, height] = this._frameSize;
            console.log('new frameSize:', width, height);
            this.color.resize(width, height);
            this.glows[0].resize(width, height);
            this.glows[1].resize(width, height);

            this.camera.viewport = [width, height];
        }

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
        const gl2facade = this.context.gl2facade;

        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        gl.disable(gl.DEPTH_TEST);

        const time = performance.now();
        const delta = time - this.elapsed;
        this.elapsed = time;

        this.step(delta * 10);

        this.colorFBO.bind();
        gl.drawBuffers([gl2facade.COLOR_ATTACHMENT0]);
        this.draw(time);
        this.colorFBO.unbind();

        this.glow(time);

        gl.enable(gl.DEPTH_TEST);

        // Render skybox
        // this.skyBox.frame();
    }

    step(delta: number) {
        const gl = this._context.gl;
        const gl2facade = this._context.gl2facade;
        this.positions[this.srcIndex].bind(gl.TEXTURE0);
        this.velocities[this.srcIndex].bind(gl.TEXTURE1);
        this.forces.bind(gl.TEXTURE2);

        this.stepFBOs[this.dstIndex].bind();
        gl2facade.drawBuffers!([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

        this.programParticleStep.bind();
        gl.uniform1f(this.uElapsed, delta);

        gl.viewport(0, 0, this.simulationWidth, this.simulationHeight);
        this.ndcTriangle.draw();
        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        // gl2facade.drawBuffers!([gl.BACK]); // -> invalid operation

        this.srcIndex = this.dstIndex;
        this.dstIndex = this.srcIndex === 0 ? 1 : 0;
    }

    draw(time: number) {
        const gl = this._context.gl;

        this.positions[this.srcIndex].bind(gl.TEXTURE0);
        this.materials[0].bind(gl.TEXTURE1);
        this.materials[1].bind(gl.TEXTURE2);
        this.cubeMap.bind(gl.TEXTURE3);

        this.programMetaballs.bind();
        this.ndcTriangle.draw();
    }

    glow(time: number) {
        const gl = this._context.gl;
        const gl2facade = this._context.gl2facade;

        this.color.bind(gl.TEXTURE0);
        this.glowFBO.bind();
        gl.drawBuffers([gl2facade.COLOR_ATTACHMENT0]);

        gl.viewport(0, 0, this._frameSize[0] / 2, this._frameSize[1] / 2);
        this.programBlurH.bind();
        this.ndcTriangle.draw();

        this.glows[0].bind();
        gl.drawBuffers([gl2facade.COLOR_ATTACHMENT1]);

        this.programBlurV.bind();
        this.ndcTriangle.draw();

        this.glowFBO.unbind();

        this.color.bind();
        this.glows[1].bind(gl.TEXTURE1);

        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        this.programGlow.bind();
        this.ndcTriangle.draw();
    }

    onSwap(): void {
    }


    onInitialize(context: Context, callback: Invalidate, mouseEventProvider: MouseEventProvider): boolean {
        const gl = context.gl;
        const gl2facade = context.gl2facade;

        this.programParticleStep = this.createProgram('particle_step.vert', 'particle_step.frag');
        this.programParticleStep.bind()
        this.uElapsed = this.programParticleStep.uniform('elapsed');
        this.uPositions = this.programParticleStep.uniform('positions');
        gl.uniform1i(this.uPositions, 0);
        this.uVelocities = this.programParticleStep.uniform('velocities');
        gl.uniform1i(this.uVelocities, 1);
        this.uForces = this.programParticleStep.uniform('forces');
        gl.uniform1i(this.uForces, 2);

        this.programMetaballs = this.createProgram('particle_draw_5.vert', 'particle_draw_5_3.frag');
        this.programBlurH = this.createProgram('particle_glow_5_4.vert', 'gaussh.frag');
        this.programBlurV = this.createProgram('particle_glow_5_4.vert', 'gaussv.frag');
        this.programGlow = this.createProgram('particle_glow_5_4.vert', 'particle_glow_5_4.frag');

        // textures

        // Choose appropriate width and height for the current number of particles
        this.simulationSize = 16;
        this.simulationWidth = Math.sqrt(this.simulationSize);
        this.simulationHeight = this.simulationWidth;
        const remain = this.simulationSize - (this.simulationHeight * this.simulationWidth);
        this.simulationHeight += remain / this.simulationWidth + (remain % this.simulationWidth === 0 ? 0 : 1);

        const setFilterWrap = (tex: Texture2, filter = gl.NEAREST, wrap = gl.CLAMP_TO_EDGE) => {
            tex.filter(filter, filter, true, false);
            tex.wrap(wrap, wrap, false, true);
        };
        this.positions = [new Texture2(context), new Texture2(context)];
        this.positions[0].initialize(this.simulationWidth, this.simulationHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        this.positions[1].initialize(this.simulationWidth, this.simulationHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        setFilterWrap(this.positions[0]);
        setFilterWrap(this.positions[1]);

        this.velocities = [new Texture2(context), new Texture2(context)];
        this.velocities[0].initialize(this.simulationWidth, this.simulationHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        this.velocities[1].initialize(this.simulationWidth, this.simulationHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        setFilterWrap(this.velocities[0]);
        setFilterWrap(this.velocities[1]);

        this.materials = [new Texture2(context), new Texture2(context)];
        this.materials[0].initialize(this.simulationWidth, this.simulationHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        setFilterWrap(this.materials[0]);
        this.materials[1].initialize(this.simulationWidth, this.simulationHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT);
        setFilterWrap(this.materials[1]);

        this.forces = new Texture3(context);
        this.forces.initialize(fdimx, fdimy, fdimz, gl.RGB32F, gl.RGB, gl.FLOAT);
        this.forces.filter(gl.NEAREST, gl.NEAREST, true, false); // TODO?: was linear in C++, but that 'not renderable'
        this.forces.wrap(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, false, true);

        // fill buffers with data
        this.reset();

        this.color = new Texture2(context);
        this.color.initialize(this.simulationWidth, this.simulationHeight, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
        setFilterWrap(this.color, gl.LINEAR);

        this.glows = [new Texture2(context), new Texture2(context)];
        this.glows.forEach((tex) => {
            tex.initialize(this.simulationWidth, this.simulationHeight, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
            setFilterWrap(tex, gl.LINEAR);
        });

        // create write access to buffers

        this.depthRenderbuffer = new Renderbuffer(context);
        this.depthRenderbuffer.initialize(this.simulationWidth, this.simulationHeight, gl.DEPTH_COMPONENT16);

        // frame buffers
        this.stepFBOs = [new Framebuffer(context), new Framebuffer(context)];
        this.stepFBOs.forEach((fbo, i) => fbo.initialize([
            [gl2facade.COLOR_ATTACHMENT0, this.positions[i]],
            [gl2facade.COLOR_ATTACHMENT1, this.velocities[i]],
            [gl.DEPTH_ATTACHMENT, this.depthRenderbuffer],
        ]));
        this.colorFBO = new Framebuffer(context);
        this.colorFBO.initialize([
            [gl2facade.COLOR_ATTACHMENT0, this.color],
            [gl.DEPTH_ATTACHMENT, this.depthRenderbuffer],
        ]);
        this.glowFBO = new Framebuffer(context);
        this.glowFBO.initialize([
            [gl2facade.COLOR_ATTACHMENT0, this.glows[0]],
            [gl2facade.COLOR_ATTACHMENT1, this.glows[1]],
            [gl.DEPTH_ATTACHMENT, this.depthRenderbuffer],
        ]);

        this.ndcTriangle = new NdcFillingTriangle(context);
        this.ndcTriangle.initialize(0);

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
        const rawPositions = new Float32Array(this.simulationSize * 4); // position + radius
        const rawVelocities = new Float32Array(this.simulationSize * 4); // velocities + dummy (e.g. active)
        const rawMaterials0 = new Float32Array(this.simulationSize * 4);
        const rawMaterials1 = new Float32Array(this.simulationSize * 4);

        for (let i = 0; i < this.simulationSize; ++i) {
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

        this.positions[this.srcIndex].data(rawPositions);
        this.velocities[this.srcIndex].data(rawVelocities);
        this.materials[0].data(rawMaterials0);
        this.materials[1].data(rawMaterials1);

        // random fill forces

        // this has center axes and allows for random rings etc..
        const rawForces = new Float32Array(fdimx * fdimy * fdimz * 3);
        for (let i = 0; i < fdimx * fdimy * fdimz; ++i) {
            const f = vec3.fromValues(rand(-1, 1), rand(-1, 1), rand(-1, 1));
            vec3.normalize(f, f);
            rawForces[i * 3 + 0] = f[0];
            rawForces[i * 3 + 1] = f[1];
            rawForces[i * 3 + 2] = f[2];
        }

        this.forces.data(rawForces);
    }

    onUninitialize(): void {
    }
}

