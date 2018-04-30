import { vec3 } from 'gl-matrix';
import { BlitPass, Camera, Context, DefaultFramebuffer,
    Framebuffer, Invalidate, MouseEventProvider, Navigation, Program,
    Renderbuffer, Renderer, Shader, Texture2, TextureCube, Wizard } from 'webgl-operate';
import { Skybox } from '../camera-navigation/skybox';
import { PbrShader } from './pbrshader';
import { Scene } from './scene';

export class GltfRenderer extends Renderer {
    // FBO and Blit
    protected _defaultFBO: DefaultFramebuffer;
    protected _colorRenderTexture: Texture2;
    protected _depthRenderbuffer: Renderbuffer;
    protected _intermediateFBO: Framebuffer;
    protected _blit: BlitPass;

    protected pbrShader: PbrShader;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    // SkyBox
    protected _cubeMap: TextureCube;
    protected _skyBox: Skybox;
    protected _cubeMapChanged: boolean;

    protected _scene: Scene;
    protected _sceneChanged: boolean;
    set scene(scene: Scene) {
        if (this._scene) {
            this._scene.uninitialize();
        }
        this._scene = scene;
        this._sceneChanged = true;

        this.setCameraFromBounds();
    }


    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider): boolean {

        const gl = this._context.gl;
        const gl2facade = this._context.gl2facade;

        this.pbrShader = new PbrShader(context);

        // Initialize camera
        this._camera = new Camera();
        this._camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this._camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._camera.eye = vec3.fromValues(0.0, 0.0, 3.0);
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
        this._scene.uninitialize();
        this.pbrShader.uninitialize();

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
            this._intermediateFBO.clearColor(this._clearColor);
        }

        this._navigation.update();

        // Reset state
        const altered = this._altered.any ||
            this._camera.altered ||
            this._cubeMapChanged ||
            this._sceneChanged;
        this._altered.reset();
        this._camera.altered = false;
        this._cubeMapChanged = false;
        this._sceneChanged = false;

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

        this.pbrShader.bind();
        gl.uniformMatrix4fv(this.pbrShader.uViewProjection, gl.GL_FALSE, this._camera.viewProjection);

        if (this._scene) {
            this._scene.draw(this._camera, this.pbrShader);
        }

        this.pbrShader.unbind();

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

    protected setCameraFromBounds() {
        const bounds = this._scene.bounds;
        const size = vec3.len(bounds.size);
        const center = bounds.center;

        this._camera.eye = vec3.fromValues(
            center[0] + size / 2,
            center[1] + size / 5.0,
            center[2] + size / 2,
        );
        this._camera.center = center;
        this._camera.near = size / 100;
        this._camera.far = size * 20;
    }
}
