import { Texture2 } from 'webgl-operate';

import { Material } from './material';
import { Mesh } from './mesh';

/** Base class holding references to shared entities */
export class Asset {
    materials: Material[];
    meshes: Mesh[];
    // nodes: Node[];
    textures: Texture2[];
}
