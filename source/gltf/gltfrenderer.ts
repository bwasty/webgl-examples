import { vec3 } from 'gl-matrix';
import { BlitPass, Camera, Context, DefaultFramebuffer,
    Framebuffer, Invalidate, MouseEventProvider, Navigation, Program,
    Renderbuffer, Renderer, Shader, Texture2, TextureCube, Wizard } from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';
import { Scene } from './scene';

export class GltfRenderer extends Renderer {
    // FBO and Blit
    protected _defaultFBO: DefaultFramebuffer;
    protected _colorRenderTexture: Texture2;
    protected _depthRenderbuffer: Renderbuffer;
    protected _intermediateFBO: Framebuffer;
    protected _blit: BlitPass;

    protected _program: Program;
    protected _uViewProjection: WebGLUniformLocation;
    protected _uModel: WebGLUniformLocation;
    protected _aVertex: GLuint;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    // SkyBox
    protected _cubeMap: TextureCube;
    protected _skyBox: Skybox;
    protected _cubeMapChanged: boolean;

    public scene: Scene;

    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider): boolean {

        const gl = this._context.gl;
        const gl2facade = this._context.gl2facade;

        const vert = new Shader(this._context, gl.VERTEX_SHADER, 'simple.vert');
        vert.initialize(require('./simple.vert'));
        const frag = new Shader(this._context, gl.FRAGMENT_SHADER, 'simple.frag');
        frag.initialize(require('./simple.frag'));
        this._program = new Program(this._context);
        this._program.initialize([vert, frag]);
        this._aVertex = this._program.attribute('a_vertex', 0);

        this._uViewProjection = this._program.uniform('u_viewProjection');
        this._uModel = this._program.uniform('u_model');

        // Initialize camera
        this._camera = new Camera();
        this._camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this._camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._camera.eye = vec3.fromValues(0.0, 0.0, 2.0);
        this._camera.near = 0.1;
        this._camera.far = 20.0;

        // Initialize navigation
        this._navigation = new Navigation(callback, mouseEventProvider);
        this._navigation.camera = this._camera;

        // Initialize FBO & BlitPass
        this._defaultFBO = new DefaultFramebuffer(this._context, 'DefaultFBO');
        this._defaultFBO.initialize();
        this._colorRenderTexture = new Texture2(this._context, 'ColorRenderTexture');
        this._colorRenderTexture.initialize(480, 270,
            this._context.isWebGL2 ? gl.RGBA8 : gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        this._depthRenderbuffer = new Renderbuffer(this._context, 'DepthRenderbuffer');
        this._depthRenderbuffer.initialize(480, 270, gl.DEPTH_COMPONENT16);
        this._intermediateFBO = new Framebuffer(this._context, 'IntermediateFBO');
        this._intermediateFBO.initialize([[gl2facade.COLOR_ATTACHMENT0, this._colorRenderTexture]
            , [gl.DEPTH_ATTACHMENT, this._depthRenderbuffer]]);
        this._blit = new BlitPass(this._context);
        this._blit.initialize();
        this._blit.framebuffer = this._intermediateFBO;
        this._blit.readBuffer = gl2facade.COLOR_ATTACHMENT0;
        this._blit.drawBuffer = gl.BACK;
        this._blit.target = this._defaultFBO;

        // Initialize skyBox

        const internalFormatAndType = Wizard.queryInternalTextureFormat(this._context, gl.RGB, 'byte');
        this._cubeMap = new TextureCube(this._context);
        this._cubeMap.initialize(512, internalFormatAndType[0], gl.RGB, internalFormatAndType[1]);

        this._skyBox = new Skybox();
        this._skyBox.initialize(this._context, this._camera, this._cubeMap);

        this._cubeMap.load({
            positiveX: 'data/skybox.px.png', negativeX: 'data/skybox.nx.png',
            positiveY: 'data/skybox.py.png', negativeY: 'data/skybox.ny.png',
            positiveZ: 'data/skybox.pz.png', negativeZ: 'data/skybox.nz.png',
        }).then(() => this.invalidate(true));

        setTimeout(() => {
            this.clearColor = [0.0, 0.0, 1.0, 1.0];
        }, 0);

        return true;
    }

    protected onUninitialize(): void {
        // TODO!!:
        // this.scene.uninitialize();
        this._program.uninitialize();

        this._intermediateFBO.uninitialize();
        this._defaultFBO.uninitialize();
        this._colorRenderTexture.uninitialize();
        this._depthRenderbuffer.uninitialize();
        this._blit.uninitialize();

        this._skyBox.uninitialize();
    }

    protected onUpdate(): boolean {
        // Resize
        if (this._altered.frameSize) {
            this._intermediateFBO.resize(this._frameSize[0], this._frameSize[1]);
            this._camera.viewport = [this._frameSize[0], this._frameSize[1]];
        }
        if (this._altered.canvasSize) {
            this._camera.aspect = this._canvasSize[0] / this._canvasSize[1];
        }

        // Update clear color
        if (this._altered.clearColor) {
            const c = this._clearColor;
            this._intermediateFBO.clearColor(this._clearColor);
        }

        this._navigation.update();

        // Reset state
        const altered = this._altered.any || this._camera.altered || this._cubeMapChanged;
        this._altered.reset();
        this._camera.altered = false;
        this._cubeMapChanged = false;

        // If anything has changed, render a new frame
        return altered;
    }

    protected onPrepare(): void { }

    protected onFrame(frameNumber: number): void {
        const gl = this._context.gl;

        // Bind FBO
        this._intermediateFBO.bind();
        this._intermediateFBO.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, false, false);

        // Set viewport
        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);

        this._program.bind();
        gl.uniformMatrix4fv(this._uViewProjection, gl.GL_FALSE, this._camera.viewProjection);
        // TODO!!: model matrix - identity?

        if (this.scene) {
            this.scene.draw(this._camera, this._program);
        }

        this._program.unbind();

        // Render skybox
        this._skyBox.frame();

        // Unbind FBO
        this._intermediateFBO.unbind();
    }
    protected onSwap(): void {
         // Blit into framebuffer
         this._blit.frame();
         this.invalidate(); // TODO!: why?
    }
}
