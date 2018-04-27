import { vec3, vec4 } from 'gl-matrix';
import { gltf as GLTF, GltfAsset } from 'gltf-loader-ts';
import { Context, Texture2 } from 'webgl-operate';

export type AlphaMode = 'OPAQUE' | 'MASK' | 'BLEND';

export class Material {
    name: string;

    // NOTE: all defaults are from the spec

    // pbr_metallic_roughness properties
    baseColorFactor: vec4 = vec4.fromValues(1, 1, 1, 1);
    baseColorTexture: Texture2;
    metallicFactor = 1;
    roughnessFactor = 1;
    metallicRoughnessTexture: Texture2;

    normalTexture: Texture2;
    normalScale: number;

    occlusionTexture: Texture2;
    occlusionStrength: number;
    emissiveFactor: vec3 = vec3.fromValues(0, 0, 0);
    emissiveTexture: Texture2;

    alphaCutoff = 0.5;
    alphaMode: AlphaMode = 'OPAQUE';

    doubleSided = false;

    static async fromGltf(gMaterial: GLTF.Material, asset: GltfAsset, context: Context): Promise<Material> {
        const mat = new Material();
        mat.name = gMaterial.name;
        const pbr = gMaterial.pbrMetallicRoughness;
        const texPromises: { [key: string]: Promise<Texture2> | undefined } = {
            baseColorTexture: undefined,
            metallicRoghnessTexture: undefined,
            normalTexture: undefined,
            occlusionTexture: undefined,
            emissiveTexture: undefined,
        };
        if (pbr) {
            if (pbr.baseColorFactor) {
                mat.baseColorFactor = vec4.fromValues.apply(undefined, pbr.baseColorFactor);
            }
            if (pbr.baseColorTexture) {
                texPromises.baseColor = this.loadTexture(pbr.baseColorTexture, asset, context);
            }
            if (pbr.metallicFactor !== undefined) { mat.metallicFactor = pbr.metallicFactor; }
            if (pbr.roughnessFactor !== undefined) { mat.roughnessFactor = pbr.roughnessFactor; }
            if (pbr.metallicRoughnessTexture) {
                texPromises.metallicRoughnessTexture = this.loadTexture(pbr.metallicRoughnessTexture, asset, context);
            }
        }

        const normalTexInfo = gMaterial.normalTexture;
        if (normalTexInfo) {
            texPromises.normalTexture = this.loadTexture(normalTexInfo, asset, context);
            mat.normalScale = normalTexInfo.scale || 1;
        }

        const occTexInfo = gMaterial.occlusionTexture;
        if (occTexInfo) {
            texPromises.occlusionTexture = this.loadTexture(occTexInfo, asset, context);
            mat.occlusionStrength = occTexInfo.strength || 1;
        }

        if (gMaterial.emissiveTexture) {
            texPromises.emissiveTexture = this.loadTexture(gMaterial.emissiveTexture, asset, context);
        }
        if (gMaterial.emissiveFactor) {
            mat.emissiveFactor = vec3.fromValues.apply(undefined, gMaterial.emissiveFactor);
        }

        if (gMaterial.alphaCutoff !== undefined) { mat.alphaCutoff = gMaterial.alphaCutoff; }
        if (gMaterial.alphaMode) { mat.alphaMode = gMaterial.alphaMode as AlphaMode; }

        if (gMaterial.doubleSided !== undefined) { mat.doubleSided = gMaterial.doubleSided; }

        await Promise.all((Object as any).values(texPromises));
        for (const key in texPromises) {
            (mat as any)[key] = await texPromises[key]; // actually synchronous due to Promise.all above
        }

        return mat;
    }

    static async loadTexture(texInfo: GLTF.TextureInfo | GLTF.MaterialNormalTextureInfo,
            asset: GltfAsset, context: Context): Promise<Texture2> {
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
                wrapS: gl.REPEAT,
                wrapT: gl.REPEAT,
            };
        }

        const tex2 = new Texture2(context); // TODO: identifier?
        tex2.initialize(image.width, image.height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE); // TODO: internalFormat? type?
        tex2.wrap(sampler.wrapS || gl.REPEAT, sampler.wrapT || gl.REPEAT, true, false);
        tex2.filter(sampler.magFilter || gl.LINEAR, sampler.minFilter || gl.LINEAR, false, false);
        tex2.data(image, false, true);

        // TODO!!: NPOT, mipmap handling

        return tex2;
    }
}
