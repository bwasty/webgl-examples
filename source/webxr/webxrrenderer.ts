import { vec3 } from 'gl-matrix';
import { Camera, Context, Invalidate, MouseEventProvider, Navigation, XRRenderer, RenderView, FrameData } from 'webgl-operate';

import { XRInputPose } from 'webgl-operate/lib/webxr';
import { PbrShader } from '../gltf/pbrshader';
import { Scene } from '../gltf/scene';

export class WebXRRenderer extends XRRenderer {
    private frameCount = 0;

    protected pbrShader: PbrShader;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    protected _scene: Scene;
    set scene(scene: Scene) {
        if (this._scene) {
            this._scene.uninitialize();
        }
        this._scene = scene;

        this.setCameraFromBounds();

        this.invalidate(true);
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
        gl.clearColor(0, 0, 0, 1);

        return true;
    }

    protected onUninitialize(): void {
        this._scene.uninitialize();
        this.pbrShader.uninitialize();
    }

    // NOTE: this is ONLY called in fallback mode (when WebXR is not available)
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

        this._navigation.update();

        // Reset state
        const altered = this._altered.any ||
            this._camera.altered;
        this._altered.reset();
        this._camera.altered = false;

        // If anything has changed, render a new frame
        return altered;
    }

    protected onFrame(frameNumber: number): void {
        const gl = this._context.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.pbrShader.bind();

        // if (this.frameCount % 120 === 0) {
        //     console.log(inputPoses);
        // }

        // fallback - plain WebGL + mouse-based navigation
        gl.uniformMatrix4fv(this.pbrShader.uniforms.u_ViewProjection, false, this._camera.viewProjection);
        gl.uniform3fv(this.pbrShader.uniforms.u_Camera, this._camera.eye);

        if (this._scene) {
            this._scene.draw(this.pbrShader);
        }

        this.pbrShader.unbind();
        ++this.frameCount;
    }

    protected onXRFrame(frameData: FrameData) {
        const gl = this._context.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (!this._scene) {
            return;
        }

        this.pbrShader.bind();

        // TODO!: bind frameData.session.baseLayer.framebuffer here? (currently done in XRController)
        const renderViews = frameData.renderViews;
        if (renderViews.length === 1) {
            // Optimization for the single-view case: bind once instead of for each primitive
            // WebXR with a single view can happen for 'magic windows' and 'see-through' phone AR.
            const view = renderViews[0];
            const vp = view.viewport;
            gl.viewport(vp.x, vp.y, vp.width, vp.height);

            gl.uniformMatrix4fv(this.pbrShader.uniforms.u_ViewProjection, false, view.viewProjectionMatrix);
            gl.uniform3fv(this.pbrShader.uniforms.u_Camera, view.cameraPosition);

            this._scene.draw(this.pbrShader); // don't pass render views
        } else {
            this._scene.draw(this.pbrShader, renderViews);
        }

        this.pbrShader.unbind();
        ++this.frameCount;
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
