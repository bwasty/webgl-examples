import './styles.css';

// import { Canvas } from 'webgl-operate/source/canvas';
import { Canvas } from 'webgl-operate';

const canvasEl = document.querySelector('canvas')!;
const canvas = new Canvas(canvasEl);
(window as any).canvas = canvas;
