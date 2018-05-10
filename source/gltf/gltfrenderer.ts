import { vec3 } from 'gl-matrix';
import { Camera, Context, Invalidate, MouseEventProvider, Navigation, Renderer  } from 'webgl-operate';
import { PbrShader } from './pbrshader';
import { Scene } from './scene';

export class GltfRenderer extends Renderer {
    protected pbrShader: PbrShader;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    protected _scene: Scene;
    protected _sceneChanged: boolean;
    set scene(scene: Scene) {
        if (this._scene) {
            this._scene.uninitialize();
        }
        this._scene = scene;
        this._sceneChanged = true;

        this.setCameraFromBounds();

        // TODO!!: hack? (_sceneChanged doesn't work...)
        this.invalidate();
    }

    get context() {
        return this._context;
    }

    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider): boolean {

        const gl = this._context.gl;

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

        gl.enable(gl.DEPTH_TEST);

        setTimeout(() => {
            this.clearColor = [0.1, 0.2, 0.3, 1.0];
        }, 0);

        return true;
    }

    protected onUninitialize(): void {
        this._scene.uninitialize();
        this.pbrShader.uninitialize();
    }

    protected onUpdate(): boolean {
        const gl = this.context.gl;
        // Resize
        if (this._altered.frameSize) {
            this._camera.viewport = [this._frameSize[0], this._frameSize[1]];
            gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        }
        if (this._altered.canvasSize) {
            this._camera.aspect = this._canvasSize[0] / this._canvasSize[1];
        }

        // Update clear color
        if (this._altered.clearColor) {
            const c = this._clearColor;
            gl.clearColor(c[0], c[1], c[2], c[3]);
        }

        this._navigation.update();

        // Reset state
        const altered = this._altered.any ||
            this._camera.altered ||
            this._sceneChanged;
        this._altered.reset();
        this._camera.altered = false;
        this._sceneChanged = false;

        // If anything has changed, render a new frame
        return altered;
    }

    protected onPrepare(): void { }

    protected onFrame(frameNumber: number): void {
        const gl = this._context.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.pbrShader.bind();
        // TODO!: only set when changed?
        gl.uniformMatrix4fv(this.pbrShader.uniforms.u_ViewProjection, false, this._camera.viewProjection);
        gl.uniform3fv(this.pbrShader.uniforms.u_Camera, this._camera.eye);

        if (this._scene) {
            this._scene.draw(this._camera, this.pbrShader);
        }

        this.pbrShader.unbind();
    }
    protected onSwap(): void {
         this.invalidate(); // TODO!: why?
    }

    protected setCameraFromBounds() {
        const bounds = this._scene.bounds;
        const size = vec3.len(bounds.size);
        const center = bounds.center;

        this._camera.eye = vec3.fromValues(
            center[0] + size / 1.5,
            center[1] + size / 5.0,
            center[2] + size / 1.5,
        );
        this._camera.center = center;
        this._camera.far = size * 20;
        this._camera.near = size / 100;
    }
}
