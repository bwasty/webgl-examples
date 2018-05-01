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

export class PbrShader {
    program: Program;
    /**
     * WebGL Attrib locations. Equal to `ATTRIB_LOCATIONS` for WebGL2.
     */
    attribLocations: {[attr: string]: number} = {};

    uViewProjection: WebGLUniformLocation;
    uModel: WebGLUniformLocation;

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

        // const vert = new Shader(context, gl.VERTEX_SHADER, 'simple.vert');
        // vert.initialize(require('./simple.vert'));
        // const frag = new Shader(context, gl.FRAGMENT_SHADER, 'simple.frag');
        // frag.initialize(require('./simple.frag'));
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

        this.uViewProjection = this.program.uniform('u_ViewProjection');
        this.uModel = this.program.uniform('u_ModelMatrix');
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
