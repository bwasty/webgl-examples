import { mat4, vec3 } from 'gl-matrix';
import * as Stats from 'stats.js';
import { Camera, Context, Invalidate, MouseEventProvider, Navigation, Renderer, RenderView } from 'webgl-operate';

import { PbrShader } from '../gltf/pbrshader';
import { Scene } from '../gltf/scene';

export class WebXRRenderer extends Renderer {
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

    protected viewProjection = mat4.create(); // to avoid allocation per frame

    get context() {
        return this._context;
    }

    stats: Stats;

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

        this.stats = new Stats();
        // (this.stats.dom as any).height = '48px';
        // (this.stats.dom as any).top = '12px';
        // [].forEach.call(this.stats.dom.children, (child: any) => (child.style.display = ''));
        // // 0: fps, 1: ms, 2: mb, 3+: custom
        // (this.stats.dom.children[2] as any).style.display = 'none';

        return true;
    }

    protected onUninitialize(): void {
        this._scene.uninitialize();
        this.pbrShader.uninitialize();
    }

    // TODO!!: this is not called...
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
            this._camera.altered ||
            this._sceneChanged;
        this._altered.reset();
        this._camera.altered = false;
        this._sceneChanged = false;

        // If anything has changed, render a new frame
        return altered;
    }

    protected onPrepare(): void { }

    protected onFrame(frameNumber: number, renderViews?: RenderView[]): void {
        this.stats.begin();
        const gl = this._context.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.pbrShader.bind();

        if (renderViews) {
            this.drawRenderViews(renderViews);
        } else {
            // fallback - plain WebGL + mouse-based navigation
            gl.uniformMatrix4fv(this.pbrShader.uniforms.u_ViewProjection, false, this._camera.viewProjection);
            gl.uniform3fv(this.pbrShader.uniforms.u_Camera, this._camera.eye);

            if (this._scene) {
                this._scene.draw(this.pbrShader);
            }
        }

        this.pbrShader.unbind();
        this.stats.end();
    }

    protected drawRenderViews(renderViews: RenderView[]) {
        const gl = this._context.gl;
        if (this._scene) {
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
        }
    }

    protected onSwap(): void {
        this.invalidate();
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
