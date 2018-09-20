
import { mat4, vec3 } from 'gl-matrix';

import { Camera } from 'webgl-operate/lib/camera';
import { Context } from 'webgl-operate/lib/context';
import { MouseEventProvider } from 'webgl-operate/lib/mouseeventprovider';
import { Navigation } from 'webgl-operate/lib/navigation';
import { Program } from 'webgl-operate/lib/program';
import { Invalidate, Renderer } from 'webgl-operate/lib/renderer';
import { Shader } from 'webgl-operate/lib/shader';

import { Cube } from './cube';

export class CubeRenderer extends Renderer {
    // Camera and navigation
    protected _camera: Camera;
    protected _navigation: Navigation;

    // cube
    protected _cube: Cube;
    protected _cubeProgram: Program;
    protected _uViewProjection: WebGLUniformLocation;
    protected _uModel: WebGLUniformLocation;
    protected _aCubeVertex: GLuint;
    protected _cubeMatrix: mat4;

    protected onUpdate(): boolean {
        this._navigation.update();

        // Reset state
        const altered = this._altered.any || this._camera.altered;
        this._altered.reset();
        this._camera.altered = false;

        // If anything has changed, render a new frame
        return altered;
    }

    protected onPrepare(): void { }

    protected onFrame(frameNumber: number): void {
        const gl = this._context.gl;

        // Set viewport
        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);

        // // Prepare rendering cubes
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);

        this._cube.bind();
        this._cubeProgram.bind();
        gl.uniformMatrix4fv(this._uViewProjection, gl.GL_FALSE, this._camera.viewProjection);

        // Render cubes
        gl.uniformMatrix4fv(this._uModel, gl.GL_FALSE, this._cubeMatrix);
        this._cube.draw();

        // Done rendering cubes
        this._cubeProgram.unbind();
        this._cube.unbind();

    }

    protected onSwap(): void {
        this.invalidate();
    }

    protected onInitialize(context: Context, callback: Invalidate, mouseEventProvider: MouseEventProvider): boolean {
        const gl = this._context.gl;

        // Initialize program
        const vert = new Shader(this._context, gl.VERTEX_SHADER, 'cube.vert');
        vert.initialize(require('./cube.vert'));
        const frag = new Shader(this._context, gl.FRAGMENT_SHADER, 'cube.frag');
        frag.initialize(require('./cube.frag'));
        this._cubeProgram = new Program(this._context, 'CubeProgram');
        this._cubeProgram.initialize([vert, frag]);
        this._uViewProjection = this._cubeProgram.uniform('u_viewProjection');
        this._uModel = this._cubeProgram.uniform('u_model');

        // Initialize cube geometry
        this._cube = new Cube(this._context, 'cube');
        this._cube.initialize(this._aCubeVertex);
        this._aCubeVertex = this._cubeProgram.attribute('a_vertex', 0);

        const scaleLarge = mat4.fromScaling(mat4.create(), vec3.fromValues(0.4, 0.4, 0.4));

        const translate0 = mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, 0.0, 0.0));
        this._cubeMatrix = mat4.multiply(mat4.create(), translate0, scaleLarge);

        // Initialize camera
        this._camera = new Camera();
        this._camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this._camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._camera.eye = vec3.fromValues(0.0, 0.0, 2.0);
        this._camera.near = 0.1;
        this._camera.far = 8.0;

        // Initialize navigation
        this._navigation = new Navigation(callback, mouseEventProvider);
        this._navigation.camera = this._camera;

        return true;
    }

    protected onUninitialize(): void {
        this._cube.uninitialize();
    }

}

