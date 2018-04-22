import { Camera, Context, Invalidate, MouseEventProvider, Navigation, Program, Renderer, Shader } from 'webgl-operate';
import { Primitive } from './primitive';
import { vec3 } from 'gl-matrix';


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

        return true;
    }
    protected onUninitialize(): void {
        this._program.uninitialize();
    }
    protected onUpdate(): boolean {
        console.error('Method not implemented.');
        return false; // whether to redraw
    }
    protected onPrepare(): void { }
    protected onFrame(frameNumber: number): void {
        console.error('Method not implemented.');
    }
    protected onSwap(): void {
        console.error('Method not implemented.');
    }
}
