import { auxiliaries, Buffer, Context, VertexArray } from 'webgl-operate';
const assert = auxiliaries.assert;

import { GltfAsset } from 'gltf-loader-ts';
import { gltf as GLTF } from 'gltf-loader-ts';
import { Material } from './material';
import { ShaderFlags } from './pbr';
// import { Bindable } from 'webgl-operate/lib/bindable';
// import { Initializable } from 'webgl-operate/lib/initializable';

// tslint:disable:max-classes-per-file

// TODO!: move to gltf-loader-ts? GltfUtils?
/** Spec: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#accessor-element-size */
const GLTF_ELEMENTS_PER_TYPE: { [index: string]: number } = {
    SCALAR: 1,
    VEC2:   2,
    VEC3:   3,
    VEC4:   4,
    MAT2:   4,
    MAT3:   9,
    MAT4:  16,
};

/** Standard vertex attrib locations for all semantics in the spec */
const ATTRIB_LOCATIONS: { [semantic: string]: number } = {
    POSITION: 0,
    NORMAL: 1,
    TANGENT: 2,
    TEXCOORD_0: 3,
    TEXCOORD_1: 4,
    COLOR_0: 5,
    JOINTS_0: 6,
    WEIGHTS_0: 7,
};

/** Data needed for `gl.vertexAttribPointer` */
class VertexAttribute {
    static fromGltf(accessor: GLTF.Accessor, bufferView: GLTF.BufferView, buffer: Buffer) {
        return new VertexAttribute(
            buffer,
            GLTF_ELEMENTS_PER_TYPE[accessor.type],
            accessor.componentType,
            accessor.normalized || false,
            bufferView.byteStride || 0,
            bufferView.byteOffset || 0,
        );
    }

    constructor(
        public buffer: Buffer,
        private size: GLint,
        private type: GLenum,
        private normalized: boolean,
        private stride: GLsizei,
        private offset: GLintptr,
    ) {}

    enable(index: GLuint) {
        this.buffer.attribEnable(
            index,
            this.size,
            this.type,
            this.normalized,
            this.stride,
            this.offset,
            true, // TODO!: param?
            false,
        );
    }

    disable(index: GLuint) {
        this.buffer.attribDisable(index, true, true); // TODO!: param?
    }
}

// TODO!!: Initializable, Bindable not exported...
export class Primitive /*extends Initializable implements Bindable*/ {
    private vertexArray: VertexArray;
    /** Vertex attributes. Keys match the attribute semantic property names from glTF. */
    private attributes: { [semantic: string]: VertexAttribute } = {};
    private numVertices: number;

    private indexBuffer: Buffer;
    private numIndices: number;
    private indexType: GLenum;

    /** POINTS / LINES / TRIANGLES etc. */
    private mode: GLenum;

    private material: Material;
    private shaderFlags: ShaderFlags;

    constructor(context: Context, identifier?: string | undefined) {
        // super();

        identifier = identifier !== undefined && identifier !== `` ? identifier : this.constructor.name;
        this.vertexArray = new VertexArray(context, identifier + 'VAO');
    }

    private getAccessor(gltf: GLTF.GlTf, accessorId: GLTF.GlTfId): GLTF.Accessor {
        if (gltf.accessors === undefined) { throw new Error('invalid gltf'); }
        const acc = gltf.accessors[accessorId];
        if (!!acc.sparse) { throw new Error('sparse accessors not implemented yet'); }
        return acc;
    }

    protected bindBuffers(): void {
        // TODO!!!: WebGL1 support (location lookup)... also in unbind...
        for (const semantic in this.attributes) {
            const location = ATTRIB_LOCATIONS[semantic];
            if (location === undefined) {
                continue;
            }
            this.attributes[semantic].enable(location);
        }

        if (this.numIndices) {
            this.indexBuffer.bind();
        }
    }

    protected unbindBuffers(): void {
        for (const semantic in this.attributes) {
            const location = ATTRIB_LOCATIONS[semantic];
            if (location === undefined) {
                continue;
            }
            this.attributes[semantic].disable(location);
        }
        this.indexBuffer.unbind();
    }

    bind(target?: number | undefined): void {
        this.vertexArray.bind();
    }
    unbind(target?: number | undefined): void {
        this.vertexArray.unbind();
    }

    public initialize(...args: any[]): boolean {
        const gl = this.context.gl;
        if (this.numIndices) {
            this.draw = function() {
                this.bind();
                gl.drawElements(this.mode, this.numIndices, this.indexType, 0);
            };
        } else {
            this.draw = function() {
                this.bind();
                gl.drawArrays(this.mode, 0, this.numVertices);
            };
        }

        this.vertexArray.initialize(() => this.bindBuffers(), () => this.unbindBuffers());
        return this.vertexArray.valid;
    }

    uninitialize(): void {
        this.vertexArray.uninitialize();
        for (const semantic in this.attributes) {
            this.attributes[semantic].buffer.uninitialize();
        }
        this.indexBuffer.uninitialize();
    }

    // TODO!!!: setFromGltf - make static
    async setFromGltf(gPrimitive: GLTF.MeshPrimitive, asset: GltfAsset) {
        this.mode = gPrimitive.mode || 4; // TRIANGLES (= default in spec)

        const gl = this.context.gl;
        const gltf = asset.gltf;
        assert(!!gPrimitive.attributes.POSITION, 'primitives must have the POSITION attribute');
        if (gltf.bufferViews === undefined) { throw new Error('invalid gltf'); }


        const buffersByView: {[bufferView: number]: Buffer} = {};
        for (const semantic in gPrimitive.attributes) {
            const accessor = this.getAccessor(gltf, gPrimitive.attributes[semantic]);
            this.numVertices = accessor.count;
            const bufferViewIndex = accessor.bufferView!; // TODO!: undefined case...

            let buffer;
            if (bufferViewIndex in buffersByView) {
                buffer = buffersByView[bufferViewIndex];
            } else {
                const bufferViewData = await asset.bufferViewData(bufferViewIndex);
                buffer = new Buffer(this.context); // TODO!? identifier
                buffer.initialize(gl.ARRAY_BUFFER);
                buffer.data(bufferViewData, gl.STATIC_DRAW);
                buffersByView[bufferViewIndex] = buffer;
            }

            this.attributes[semantic] = VertexAttribute.fromGltf(accessor, gltf.bufferViews[bufferViewIndex], buffer);
        }

        let shaderFlags: ShaderFlags = 0;
        if (gPrimitive.attributes.NORMALS) { shaderFlags |= ShaderFlags.HAS_NORMALS; }
        if (gPrimitive.attributes.TANGENT) { shaderFlags |= ShaderFlags.HAS_TANGENTS; }
        if (gPrimitive.attributes.TEXCOORD_0) { shaderFlags |= ShaderFlags.HAS_UV; }
        if (gPrimitive.attributes.COLOR_0) { shaderFlags |= ShaderFlags.HAS_COLORS; }

        // TODO!: bounds...

        if (gPrimitive.indices !== undefined) {
            const indexAccessor = this.getAccessor(gltf, gPrimitive.indices);
            // TODO!: (undefined) When not defined, accessor must be initialized with zeros;
            // sparse property or extensions could override zeros with actual values.
            const indexBufferData = await asset.bufferViewData(indexAccessor.bufferView!);
            this.indexBuffer = new Buffer(this.context); // TODO!? identifier
            this.numIndices = indexAccessor.count;
            this.indexType = indexAccessor.componentType;
            if (this.indexType === gl.UNSIGNED_INT) {
                // TODO!: make sure OES_element_index_uint is active
                throw new Error('not yet supported: UNSIGNED_INT indices');
            }

            this.indexBuffer.initialize(gl.ELEMENT_ARRAY_BUFFER);
            this.indexBuffer.data(indexBufferData, gl.STATIC_DRAW);

            auxiliaries.assert(this.indexBuffer !== undefined &&
                this.indexBuffer.object instanceof WebGLBuffer,
                `expected valid WebGLBuffer`);
        } else {
            const valid = this.initialize();
        }

        // TODO!!!: create default material...
        if (gPrimitive.material === undefined) {
            // The default material, used when a mesh does not specify a material,
            // is defined to be a material with no properties specified.
            // All the default values of material apply.
            this.material = new Material();
        } else {
            const mat = gltf.materials![gPrimitive.material];
            this.material = await Material.fromGltf(mat, asset, this.context);
        }
        this.shaderFlags = shaderFlags | this.material.shaderFlags;

        this.initialize();
        // TODO!!: do something with valid??
    }

    draw(): void {
        // overriden with optimized version in `initialize`
    }

    get context(): Context {
        return this.vertexArray.context;
    }
}
