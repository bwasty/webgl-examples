import { vec3, vec4 } from 'gl-matrix';
import { Texture2 } from 'webgl-operate';

export class Material {
    name: string;

    // pbr_metallic_roughness properties
    baseColorFactor: vec4;
    baseColorTexture: Texture2;
    metallicFactor: number;
    roughnessFactor: number;
    metallicRoughnessTexture: Texture2;

    normalTexture: Texture2;
    normalScale: number;

    occlusionTexture: Texture2;
    occlusionStrength: number;
    emissiveFactor: vec3;
    emissiveTexture: Texture2;

    alphaCutoff: number;
    alphaMode: 'OPAQUE' | 'MASK' | 'BLEND';

    doubleSided: boolean;
}
