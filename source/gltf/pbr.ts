export enum ShaderFlags {
    // vertex shader + fragment shader
    HAS_NORMALS           = 1,
    HAS_TANGENTS          = 1 << 1,
    HAS_UV                = 1 << 2,
    HAS_COLORS            = 1 << 3,

    // fragment shader only
    USE_IBL               = 1 << 4,
    HAS_BASECOLORMAP      = 1 << 5,
    HAS_NORMALMAP         = 1 << 6,
    HAS_EMISSIVEMAP       = 1 << 7,
    HAS_METALROUGHNESSMAP = 1 << 8,
    HAS_OCCLUSIONMAP      = 1 << 9,
    USE_TEX_LOD           = 1 << 10,
}
