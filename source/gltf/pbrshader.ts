import { Context, Program, Shader } from 'webgl-operate';

/** Standard vertex attrib locations for all semantics in the spec (for WebGL2) */
export const ATTRIB_LOCATIONS: { [semantic: string]: number } = {
    POSITION: 0,
    NORMAL: 1,
    TANGENT: 2,
    TEXCOORD_0: 3,
    TEXCOORD_1: 4,
    COLOR_0: 5,
    JOINTS_0: 6,
    WEIGHTS_0: 7,
};

/**
 * Converts a GLTF attribute semantic to the corresponding attribute
 * in the shader
 */
export function attribName(semantic: string): string {
    return `a_${semantic.toLowerCase()}`;
}

export enum ShaderFlags {
    // vertex shader + fragment shader
    HAS_NORMALS = 1,
    HAS_TANGENTS = 1 << 1,
    HAS_UV = 1 << 2,
    HAS_COLORS = 1 << 3,

    // fragment shader only
    USE_IBL = 1 << 4,
    HAS_BASECOLORMAP = 1 << 5,
    HAS_NORMALMAP = 1 << 6,
    HAS_EMISSIVEMAP = 1 << 7,
    HAS_METALROUGHNESSMAP = 1 << 8,
    HAS_OCCLUSIONMAP = 1 << 9,
    USE_TEX_LOD = 1 << 10,
}

// tslint:disable:variable-name
// tslint:disable:no-null-keyword
class PbrUniformLocations {
    u_ViewProjection: WebGLUniformLocation | null = null;
    u_ModelMatrix: WebGLUniformLocation | null = null;
    u_NormalMatrix: WebGLUniformLocation | null = null;
    u_Camera: WebGLUniformLocation | null = null;

    u_LightDirection: WebGLUniformLocation | null = null;
    u_LightColor: WebGLUniformLocation | null = null;

    // TODO!?: ambient light
    // u_AmbientLightColor: WebGLUniformLocation | null = null;
    // u_AmbientLightIntensity: WebGLUniformLocation | null = null;

    // TODO!: set when integrating IBL (unused now)
    // u_DiffuseEnvSampler: WebGLUniformLocation | null = null;
    // u_SpecularEnvSampler: WebGLUniformLocation | null = null;
    // u_brdfLUT: WebGLUniformLocation | null = null;

    ///

    u_BaseColorSampler: WebGLUniformLocation | null = null;
    u_BaseColorTexCoord: WebGLUniformLocation | null = null;
    u_BaseColorFactor: WebGLUniformLocation | null = null;

    u_NormalSampler: WebGLUniformLocation | null = null;
    u_NormalTexCoord: WebGLUniformLocation | null = null;
    u_NormalScale: WebGLUniformLocation | null = null;

    u_EmissiveSampler: WebGLUniformLocation | null = null;
    u_EmissiveTexCoord: WebGLUniformLocation | null = null;
    u_EmissiveFactor: WebGLUniformLocation | null = null;

    u_MetallicRoughnessSampler: WebGLUniformLocation | null = null;
    u_MetallicRoughnessTexCoord: WebGLUniformLocation | null = null;
    u_MetallicRoughnessValues: WebGLUniformLocation | null = null;

    u_OcclusionSampler: WebGLUniformLocation | null = null;
    u_OcclusionTexCoord: WebGLUniformLocation | null = null;
    u_OcclusionStrength: WebGLUniformLocation | null = null;

    u_AlphaBlend: WebGLUniformLocation | null = null;
    u_AlphaCutoff: WebGLUniformLocation | null = null;

    u_PbrFlags: WebGLUniformLocation | null = null;

    // TODO!: use/remove debugging uniforms
    // debugging flags used for shader output of intermediate PBR variables
    // u_ScaleDiffBaseMR: WebGLUniformLocation | null = null;
    // u_ScaleFGDSpec: WebGLUniformLocation | null = null;
    // u_ScaleIBLAmbient: WebGLUniformLocation | null = null;

    constructor(program: Program) {
        for (const uniform in this) {
            (this as any)[uniform] = program.uniform(uniform);
            if (this[uniform] === null && !uniform.endsWith('Sampler')) {
                console.warn('Failed to get uniform location for ' + uniform);
            }
        }

        program.bind();
        const gl = program.context.gl;
        // TODO!: chrome warnings 'there is no texture bound to the unit 1' mostly disappear without the uniform calls..
        gl.uniform1i(this.u_BaseColorSampler, 0);
        gl.uniform1i(this.u_NormalSampler, 1);
        gl.uniform1i(this.u_EmissiveSampler, 2);
        gl.uniform1i(this.u_MetallicRoughnessSampler, 3);
        gl.uniform1i(this.u_OcclusionSampler, 4);

        gl.uniform3f(this.u_LightColor, 4.0, 4.0, 4.0);
        gl.uniform3f(this.u_LightDirection, 0.0, 0.5, 0.5);

        // gl.uniform3f(this.u_AmbientLightColor, 1.0, 1.0, 1.0);
        // gl.uniformf(this.u_AmbientLightIntensity, 0.2);
    }
}

// tslint:disable:max-classes-per-file
export class PbrShader {
    program: Program;
    /**
     * WebGL Attrib locations. Equal to `ATTRIB_LOCATIONS` for WebGL2.
     */
    attribLocations: { [attr: string]: number } = {};

    uniforms: PbrUniformLocations;

    constructor(context: Context) {
        const gl = context.gl;

        if (context.isWebGL1) {
            if (context.supportsShaderTextureLOD) {
                const _ = context.shaderTextureLOD;
            } else {
                throw new Error(`PBR shader needs unsupported extension GL_EXT_shader_texture_lod`);
            }
            if (context.supportsStandardDerivatives) {
                const _ = context.standardDerivatives;
            } else {
                throw new Error(`PBR shader needs unsupported extension GL_OES_standard_derivatives`);
            }
        }

        const vert = new Shader(context, gl.VERTEX_SHADER, 'pbr-vert.glsl');
        vert.initialize(require('./shaders/pbr-vert.glsl'));
        const frag = new Shader(context, gl.FRAGMENT_SHADER, 'pbr-frag.glsl');
        frag.initialize(require('./shaders/pbr-frag.glsl'));
        this.program = new Program(context);
        this.program.initialize([vert, frag]);

        if (context.isWebGL2) {
            Object.assign(this.attribLocations, ATTRIB_LOCATIONS);
        } else { // WebGL1
            for (const semantic of Object.keys(ATTRIB_LOCATIONS)) {
                const attrib = attribName(semantic);
                this.attribLocations[semantic] = this.program.attribute(attrib);
            }
        }

        this.uniforms = new PbrUniformLocations(this.program);
    }

    bind() {
        this.program.bind();
    }
    unbind() {
        this.program.unbind();
    }

    uninitialize() {
        this.program.uninitialize();
    }
}
