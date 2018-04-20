import { Context, Invalidate, MouseEventProvider, Renderer } from 'webgl-operate';


export class GltfRenderer extends Renderer {
    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider | undefined): boolean {

        return true;
    }
    protected onUninitialize(): void {
        console.error('Method not implemented.');
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
