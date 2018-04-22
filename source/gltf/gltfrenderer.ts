import { vec3 } from 'gl-matrix';
import { Camera, Context, Invalidate, MouseEventProvider, Navigation, Program, Renderer, Shader } from 'webgl-operate';
import { Primitive } from './primitive';

export class GltfRenderer extends Renderer {
    private _program: Program;
    protected _uViewProjection: WebGLUniformLocation;
    protected _uModel: WebGLUniformLocation;
    protected _aVertex: GLuint;

    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    public primitive: Primitive;

    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider): boolean {

        const gl = this._context.gl;

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
        this._camera.far = 8.0;

        // Initialize navigation
        this._navigation = new Navigation(callback, mouseEventProvider);
        this._navigation.camera = this._camera;

        setTimeout(() => {
            this.clearColor = [0.0, 0.0, 1.0, 1.0];
        }, 0);

        return true;
    }
    protected onUninitialize(): void {
        this._program.uninitialize();
    }
    protected onUpdate(): boolean {
        // Resize
        if (this._altered.frameSize) {
            this._camera.viewport = [this._frameSize[0], this._frameSize[1]];
        }
        if (this._altered.canvasSize) {
            this._camera.aspect = this._canvasSize[0] / this._canvasSize[1];
        }

        // Update clear color
        if (this._altered.clearColor) {
            const c = this._clearColor;
            this.context.gl.clearColor(c[0], c[1], c[2], c[3]);
        }

        this._navigation.update();

        // Reset state
        const altered = this._altered.any || this._camera.altered;
        this._altered.reset();
        this._camera.altered = false;

        // If anything has changed, render a new frame
        return altered;
    }
    protected onPrepare(): void { }
    protected onFrame(frameNumber: number): void {
        const gl = this._context.gl;

        // Set viewport
        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);

        if (this.primitive) {
            this.primitive.bind();
            this.primitive.draw();
        }
    }
    protected onSwap(): void {
        // TODO!!: this.invalidate()? why?
    }
}
