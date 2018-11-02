import { mat4 } from 'gl-matrix';
import { FrameData, RenderView } from 'webgl-operate';
import { XRInputData } from 'webgl-operate/lib/framedata';

export class XRNavigation {
    private frameData: FrameData;

    /**
     * global transformation that is applied to the XR frame of reference.
     * Used for moving the user through the world
     */
    worldTransform: mat4 = mat4.create();

    constructor() {
    }

    /**
     * Takes ownership of FrameData (other function may transform
     * the data in-place)
     */
    update(frameData: FrameData) {
        this.frameData = frameData;
    }

    get transformedRenderViews(): RenderView[] {
        for (const renderView of this.frameData.renderViews) {
            renderView.transform(this.worldTransform);
        }
        return this.frameData.renderViews;
    }

    get transformedInputData(): XRInputData[] {

    }
}
