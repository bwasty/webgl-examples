import { vec3, vec4 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context, Texture2 } from 'webgl-operate';

export class Material {
    name: string;

    // pbr_metallic_roughness properties (defaults from spec)
    baseColorFactor: vec4 = vec4.fromValues(1, 1, 1, 1);
    baseColorTexture: Texture2;
    metallicFactor = 1;
    roughnessFactor = 1;
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

    static fromGltf(gMaterial: GLTF.Material, asset: GltfAsset, context: Context): Material {
        const mat = new Material();
        mat.name = gMaterial.name;
        if (gMaterial.pbrMetallicRoughness) {
            const pbr = gMaterial.pbrMetallicRoughness;
            if (pbr.baseColorFactor) {
                mat.baseColorFactor = vec4.fromValues.apply(undefined, pbr.baseColorFactor);
                // mat.baseColorTexture =
                // pbr.
            }
        }
        // TODO!!!

        return mat;
    }

    static async loadTexture(texInfo: GLTF.TextureInfo, asset: GltfAsset, context: Context): Promise<Texture2> {
        const gl = context.gl;
        const gltf = asset.gltf;
        const texCoord = texInfo.texCoord || 0; // TODO!: use/handle
        const texture = gltf.textures![texInfo.index];
        // NOTE: spec allows texture.source to be undefined, unclear why
        const image = await asset.imageData.get(texture.source!);
        let sampler: GLTF.Sampler;
        if (texture.sampler) {
            sampler = gltf.samplers![texture.sampler];
        } else {
            // spec: when undefined, a sampler with repeat wrapping and auto filtering should be used.
            sampler = {
                wrapS: 10497, // repeat
                wrapT: 10497,
            };
        }

        const tex2 = new Texture2(context); // TODO: identifier?
        tex2.initialize(image.width, image.height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE); // TODO!: internalFormat? type?
        // TODO!!: bind/unbind?
        tex2.wrap(sampler.wrapS, sampler.wrapT);
        tex2.filter(sampler.magFilter, sampler.minFilter);
        tex2.data(image);
    }
}
