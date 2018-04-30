import { auxiliaries, Buffer, Context, VertexArray } from 'webgl-operate';
const assert = auxiliaries.assert;

import { vec3 } from 'gl-matrix';
import { GltfAsset } from 'gltf-loader-ts';
import { gltf as GLTF } from 'gltf-loader-ts';
import { Aabb3 } from './aabb3';
import { Material } from './material';
import { ATTRIB_LOCATIONS, PbrShader, ShaderFlags } from './pbrshader';
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

/** Data needed for `gl.vertexAttribPointer` */
class VertexAttribute {
    static fromGltf(accessor: GLTF.Accessor, bufferView: GLTF.BufferView, buffer: Buffer) {
        return new VertexAttribute(
            buffer,
            GLTF_ELEMENTS_PER_TYPE[accessor.type],
            accessor.componentType,
            accessor.normalized || false,
            bufferView.byteStride || 0,
            accessor.byteOffset || 0,
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

// TODO!: Initializable, Bindable not exported...
export class Primitive /*extends Initializable implements Bindable*/ {
    private identifier: string;
    private vertexArray: VertexArray;
    /** Vertex attributes. Keys match the attribute semantic property names from glTF. */
    private attributes: { [semantic: string]: VertexAttribute } = {};
    private numVertices: number;

    private indexBuffer: Buffer;
    private numIndices: number;
    private indexType: GLenum;
    private indexByteOffset: number;

    /** POINTS / LINES / TRIANGLES etc. */
    private mode: GLenum;

    private material: Material;
    private shaderFlags: ShaderFlags;
    /** Currently active shader */
    private shader: PbrShader | undefined;

    private drawCall: () => void;

    public bounds: Aabb3;

    static async fromGltf(gPrimitive: GLTF.MeshPrimitive, asset: GltfAsset, context: Context,
        identifier?: string): Promise<Primitive> {
        const prim = new Primitive(context, identifier);
        prim.mode = gPrimitive.mode || 4; // TRIANGLES (= default in spec)

        const gl = prim.context.gl;
        const gltf = asset.gltf;
        assert(!!gPrimitive.attributes.POSITION, 'primitives must have the POSITION attribute');
        if (gltf.bufferViews === undefined) { throw new Error('invalid gltf'); }

        const buffersByView: {[bufferView: number]: Buffer} = {};
        for (const semantic in gPrimitive.attributes) {
            const accessor = prim.getAccessor(gltf, gPrimitive.attributes[semantic]);
            prim.numVertices = accessor.count;
            const bufferViewIndex = accessor.bufferView!; // TODO!: undefined case...

            let buffer;
            if (bufferViewIndex in buffersByView) {
                buffer = buffersByView[bufferViewIndex];
            } else {
                const bufferViewData = await asset.bufferViewData(bufferViewIndex);
                buffer = new Buffer(prim.context, `${prim.identifier}_VBO_${Object.keys(buffersByView).length}`);
                buffer.initialize(gl.ARRAY_BUFFER);
                buffer.data(bufferViewData, gl.STATIC_DRAW);
                buffersByView[bufferViewIndex] = buffer;
            }

            prim.attributes[semantic] = VertexAttribute.fromGltf(accessor, gltf.bufferViews[bufferViewIndex], buffer);
            if (semantic === 'POSITION') {
                prim.bounds = new Aabb3(
                    vec3.fromValues.apply(undefined, accessor.min!),
                    vec3.fromValues.apply(undefined, accessor.max!),
                );
            }
        }

        let shaderFlags: ShaderFlags = 0;
        if (gPrimitive.attributes.NORMALS) { shaderFlags |= ShaderFlags.HAS_NORMALS; }
        if (gPrimitive.attributes.TANGENT) { shaderFlags |= ShaderFlags.HAS_TANGENTS; }
        if (gPrimitive.attributes.TEXCOORD_0) { shaderFlags |= ShaderFlags.HAS_UV; }
        if (gPrimitive.attributes.COLOR_0) { shaderFlags |= ShaderFlags.HAS_COLORS; }

        if (gPrimitive.indices !== undefined) {
            const indexAccessor = prim.getAccessor(gltf, gPrimitive.indices);
            // TODO!: (undefined) When not defined, accessor must be initialized with zeros;
            // sparse property or extensions could override zeros with actual values.
            const indexBufferData = await asset.bufferViewData(indexAccessor.bufferView!);
            prim.indexBuffer = new Buffer(prim.context, `${prim.identifier}_EBO`);
            prim.numIndices = indexAccessor.count;
            prim.indexByteOffset = indexAccessor.byteOffset || 0;
            prim.indexType = indexAccessor.componentType;
            if (prim.indexType === gl.UNSIGNED_INT) {
                // TODO!: make sure OES_element_index_uint is active
                throw new Error('not yet supported: UNSIGNED_INT indices');
            }

            prim.indexBuffer.initialize(gl.ELEMENT_ARRAY_BUFFER);
            prim.indexBuffer.data(indexBufferData, gl.STATIC_DRAW);

            auxiliaries.assert(prim.indexBuffer !== undefined &&
                prim.indexBuffer.object instanceof WebGLBuffer,
                `expected valid WebGLBuffer`);
        } else {
            const valid = prim.initialize();
        }

        if (gPrimitive.material === undefined) {
            // The default material, used when a mesh does not specify a material,
            // is defined to be a material with no properties specified.
            // All the default values of material apply.
            prim.material = new Material();
            prim.material.name = 'DefaultMaterial';
        } else {
            prim.material = await Material.fromGltf(gPrimitive.material, asset, prim.context);
        }
        prim.shaderFlags = shaderFlags | prim.material.shaderFlags;

        prim.initialize();
        // TODO!!: do something with valid??
        return prim;
    }

    constructor(context: Context, identifier: string | undefined = 'Primitive') {
        // super();

        this.identifier = identifier;
        this.vertexArray = new VertexArray(context, identifier + '_VAO');
    }

    private getAccessor(gltf: GLTF.GlTf, accessorId: GLTF.GlTfId): GLTF.Accessor {
        if (gltf.accessors === undefined) { throw new Error('invalid gltf'); }
        const acc = gltf.accessors[accessorId];
        if (!!acc.sparse) { throw new Error('sparse accessors not implemented yet'); }
        return acc;
    }

    protected bindBuffers(): void {
        for (const semantic in this.attributes) {
            const location = this.shader!.attribLocations[semantic];
            if (location === undefined || location === -1) { continue; }
            this.attributes[semantic].enable(location);
        }

        if (this.numIndices) { this.indexBuffer.bind(); }
    }

    protected unbindBuffers(): void {
        for (const semantic in this.attributes) {
            const location = this.shader!.attribLocations[semantic];
            if (location === undefined || location === -1) { continue; }
            this.attributes[semantic].disable(location);
        }
        if (this.numIndices) { this.indexBuffer.unbind(); }
    }

    public initialize(...args: any[]): boolean {
        const gl = this.context.gl;
        if (this.numIndices) {
            this.drawCall = () => {
                gl.drawElements(this.mode, this.numIndices, this.indexType, this.indexByteOffset);
            };
        } else {
            this.drawCall = () => {
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

    draw(shader: PbrShader): void {
        this.shader = shader;
        this.vertexArray.bind();
        this.drawCall();
        this.vertexArray.unbind();
        this.shader = undefined;
    }

    get context(): Context {
        return this.vertexArray.context;
    }
}
