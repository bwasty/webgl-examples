import { mat4 } from 'gl-matrix';
import { XRInputData } from 'webgl-operate/lib/framedata';
import { XRHandedness } from 'webgl-operate/lib/webxr';
import { Asset } from '../gltf/asset';
import { Node } from '../gltf/node';

/**
 * Visual representation for an XRInputSource with targetRayMode `tracked-pointer`,
 * i.e. a 3DOF/6DOF motion controller
 */
export class InputDevice {
    hand: XRHandedness;
    model: Asset;

    node: Node;

    constructor(hand: XRHandedness) {
        this.hand = hand;
    }

    update(inputData: XRInputData) {
        const pose = inputData.pose;
        if (pose && pose.gripMatrix) {
            this.node.matrix = pose.gripMatrix as mat4;
            this.node.updateTransform();
        } else {
            // just keep current position (usual reason: tracking temporarily lost)
        }
    }
}
