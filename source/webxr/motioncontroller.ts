import { XRInputData } from 'webgl-operate/lib/framedata';
import { XRHandedness } from 'webgl-operate/lib/webxr';
import { Asset } from '../gltf/asset';

export class MotionController {
    hand: XRHandedness;
    model: Asset;

    node: Node;

    constructor(hand: XRHandedness) {
        this.hand = hand;
    }

    update(inputData: XRInputData) {
        const pose = inputData.pose;
        if (pose && pose.gripMatrix) {

        } else {
            // just keep current position (usual reason: tracking temporarily lost)
        }
    }
}
