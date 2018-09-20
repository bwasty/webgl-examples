import './styles.css';

import { Canvas } from 'webgl-operate/lib/canvas';
import { CubeRenderer } from './cuberenderer';

const canvasEl = document.querySelector('canvas')!;
const canvas = new Canvas(canvasEl);
const renderer = new CubeRenderer();
canvas.renderer = renderer;

(window as any).canvas = canvas;
