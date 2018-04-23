import { mat4, quat, vec3 } from 'gl-matrix';
import { Mesh } from './mesh';

export class Node {
    children: Node[];
    matrix: mat4;
    mesh: Mesh;
    rotation: quat;
    scale: vec3;
    translation: vec3;
    // TODO: weights
    // camera: Camera;
    name: string;

    finalTransform: mat4;
    // bounds: Bounds;
}
