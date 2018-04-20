import { Context, Invalidate, MouseEventProvider, Renderer } from 'webgl-operate';

export class GltfRenderer extends Renderer {
    protected onInitialize(
        context: Context,
        callback: Invalidate,
        mouseEventProvider: MouseEventProvider | undefined): boolean {
        console.error('Method not implemented.');
        return true; // TODO!!: ???
    }
    protected onUninitialize(): void {
        console.error('Method not implemented.');
    }
    protected onUpdate(): boolean {
        console.error('Method not implemented.');
        return true; // TODO!!: ???
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
