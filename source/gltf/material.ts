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

        // **Default Filtering Implementation Note:** When filtering options are defined,
        // runtime must use them. Otherwise, it is free to adapt filtering to performance or quality goals.
        const mag = sampler.magFilter || gl.LINEAR;
        const min = sampler.minFilter || gl.LINEAR_MIPMAP_LINEAR;
        tex2.filter(mag, min, false, false);

        tex2.data(image, false, false);

        // **Mipmapping Implementation Note**: When a sampler's minification filter (`minFilter`)
        // uses mipmapping (`NEAREST_MIPMAP_NEAREST`, `NEAREST_MIPMAP_LINEAR`, `LINEAR_MIPMAP_NEAREST`,
        // or `LINEAR_MIPMAP_LINEAR`), any texture referencing the sampler needs to have mipmaps,
        // e.g., by calling GL's `generateMipmap()` function.
        const mipMaps =
            min === gl.LINEAR_MIPMAP_LINEAR ||
            min === gl.LINEAR_MIPMAP_NEAREST ||
            min === gl.NEAREST_MIPMAP_LINEAR ||
            min === gl.NEAREST_MIPMAP_NEAREST;
        if (mipMaps) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        // TODO!!: NPOT handling:
        // **Non-Power-Of-Two Texture Implementation Note**: glTF does not guarantee that a texture's
        // dimensions are a power-of-two.  At runtime, if a texture's width or height is not a
        // power-of-two, the texture needs to be resized so its dimensions are powers-of-two if the
        // `sampler` the texture references
        // * Has a wrapping mode (either `wrapS` or `wrapT`) equal to `REPEAT` or `MIRRORED_REPEAT`, or
        // * Has a minification filter (`minFilter`) that uses mipmapping (`NEAREST_MIPMAP_NEAREST`, \\
        //   `NEAREST_MIPMAP_LINEAR`, `LINEAR_MIPMAP_NEAREST`, or `LINEAR_MIPMAP_LINEAR`).

        tex2.unbind();
        return tex2;
    }
}
