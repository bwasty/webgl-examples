import { Context, Invalidate, MouseEventProvider, Program, Renderer, Shader } from 'webgl-operate';
import { Primitive } from './primitive';


export class GltfRenderer extends Renderer {
    private _program: Program;

    public primitive: Primitive;

    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider | undefined): boolean {

        const gl = this._context.gl;

        const vert = new Shader(this._context, gl.VERTEX_SHADER, 'simple.vert');
        vert.initialize(require('./simple.vert'));
        const frag = new Shader(this._context, gl.FRAGMENT_SHADER, 'simple.frag');
        frag.initialize(require('./simple.frag'));
        this._program = new Program(this._context);
        this._program.initialize([vert, frag]);

        return true;
    }
    protected onUninitialize(): void {
        this._program.uninitialize();
    }
    protected onUpdate(): boolean {
        console.error('Method not implemented.');
        return false; // whether to redraw
    }
    protected onPrepare(): void {
        console.error('Method not implemented.');
    }
    protected onFrame(frameNumber: number): void {
        console.error('Method not implemented.');
    }
    protected onSwap(): void {
        console.error('Method not implemented.');
    }
}
