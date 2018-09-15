!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("gloperate"));else if("function"==typeof define&&define.amd)define(["gloperate"],t);else{var i="object"==typeof exports?t(require("gloperate")):t(e.gloperate);for(var r in i)("object"==typeof exports?exports:e)[r]=i[r]}}(window,function(e){return function(e){var t={};function i(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=e,i.c=t,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=16)}([function(t,i){t.exports=e},,function(e,t,i){"use strict"},,,,,,,,,,,,,,function(e,t,i){i(2),e.exports=i(17)},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=i(0),n=i(18);function a(){const e=new r.Canvas("example-canvas"),t=e.context,i=new n.TestRenderer;e.renderer=i,e.element.addEventListener("click",()=>{r.viewer.Fullscreen.toggle(e.element)}),e.element.addEventListener("touchstart",()=>{r.viewer.Fullscreen.toggle(e.element)}),window.canvas=e,window.context=t,window.renderer=i}"complete"===window.document.readyState?a():window.onload=a},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=i(0);t.TestRenderer=class extends r.Renderer{constructor(){super(...arguments),this._extensions=!1}onUpdate(){this._testNavigation.update();const e=this._testNavigation.altered;return this._testNavigation.reset(),this._altered.any||e}onPrepare(){const e=this._context.gl,t=this._context.gl2facade;this._altered.multiFrameNumber&&(this._ndcOffsetKernel.width=this._multiFrameNumber),this._intermediateFBO.initialized?this._altered.frameSize&&this._intermediateFBO.resize(this._frameSize[0],this._frameSize[1]):(this._colorRenderTexture.initialize(this._frameSize[0],this._frameSize[1],this._context.isWebGL2?e.RGBA8:e.RGBA,e.RGBA,e.UNSIGNED_BYTE),this._depthRenderbuffer.initialize(this._frameSize[0],this._frameSize[1],e.DEPTH_COMPONENT16),this._intermediateFBO.initialize([[t.COLOR_ATTACHMENT0,this._colorRenderTexture],[e.DEPTH_ATTACHMENT,this._depthRenderbuffer]])),this._altered.clearColor&&this._intermediateFBO.clearColor(this._clearColor),this._accumulate.update(),this._altered.reset()}onFrame(e){const t=this._context.gl;t.viewport(0,0,this._frameSize[0],this._frameSize[1]),this._program.bind();const i=this._ndcOffsetKernel.get(e);i[0]=2*i[0]/this._frameSize[0],i[1]=2*i[1]/this._frameSize[1],t.uniform2fv(this._uNdcOffset,i),t.uniform1i(this._uFrameNumber,e),this._intermediateFBO.clear(t.COLOR_BUFFER_BIT,!0,!1),this._ndcTriangle.bind(),this._ndcTriangle.draw(),this._intermediateFBO.unbind(),this._accumulate.frame(e)}onSwap(){this._blit.framebuffer=this._accumulate.framebuffer?this._accumulate.framebuffer:this._blit.framebuffer=this._intermediateFBO,this._blit.frame()}onInitialize(e,t,n){const a=this._context.gl,s=this._context.gl2facade;!1===this._extensions&&this._context.isWebGL1&&(r.auxiliaries.assert(this._context.supportsStandardDerivatives,"expected OES_standard_derivatives support"),this._context.standardDerivatives,this._extensions=!0);const o=new r.Shader(this._context,a.VERTEX_SHADER,"testrenderer.vert");o.initialize(i(19));const u=new r.Shader(this._context,a.FRAGMENT_SHADER,"testrenderer.frag");u.initialize(i(20)),this._program=new r.Program(this._context),this._program.initialize([o,u]),this._uNdcOffset=this._program.uniform("u_ndcOffset"),this._uFrameNumber=this._program.uniform("u_frameNumber"),this._ndcTriangle=new r.NdcFillingTriangle(this._context);const _=this._program.attribute("a_vertex",0);return this._ndcTriangle.initialize(_),this._ndcOffsetKernel=new r.AntiAliasingKernel(this._multiFrameNumber),this._defaultFBO=new r.DefaultFramebuffer(this._context,"DefaultFBO"),this._defaultFBO.initialize(),this._colorRenderTexture=new r.Texture2(this._context,"ColorRenderTexture"),this._depthRenderbuffer=new r.Renderbuffer(this._context,"DepthRenderbuffer"),this._intermediateFBO=new r.Framebuffer(this._context,"IntermediateFBO"),this._accumulate=new r.AccumulatePass(this._context),this._accumulate.initialize(this._ndcTriangle),this._accumulate.precision=this._framePrecision,this._accumulate.texture=this._colorRenderTexture,this._blit=new r.BlitPass(this._context),this._blit.initialize(this._ndcTriangle),this._blit.readBuffer=s.COLOR_ATTACHMENT0,this._blit.drawBuffer=a.BACK,this._blit.target=this._defaultFBO,this._testNavigation=new r.debug.TestNavigation(()=>this.invalidate(),n),!0}onUninitialize(){this._uNdcOffset=-1,this._uFrameNumber=-1,this._program.uninitialize(),this._ndcTriangle.uninitialize(),this._intermediateFBO.uninitialize(),this._defaultFBO.uninitialize(),this._colorRenderTexture.uninitialize(),this._depthRenderbuffer.uninitialize(),this._blit.uninitialize()}}},function(e,t){e.exports="\r\nprecision lowp float;\r\n\r\n\r\n#if __VERSION__ == 100\r\n#else \r\n    #define varying out\r\n#endif\r\n\r\n\r\n\r\n#if __VERSION__ == 100\r\n    attribute vec2 a_vertex;\r\n#else \r\n    layout(location = 0) in vec2 a_vertex;\r\n#endif\r\n\r\nuniform vec2 u_ndcOffset;\r\n\r\nvarying vec2 v_uv;\r\n\r\n\r\nvoid main(void)\r\n{\r\n    v_uv = a_vertex.xy * 0.5 + 0.5;\r\n\r\n    vec4 vertex = vec4(a_vertex, 0.0, 1.0);\r\n    vertex.xy = u_ndcOffset * vec2(vertex.w) + vertex.xy;\r\n\r\n    gl_Position = vertex;\r\n}\r\n"},function(e,t){e.exports="\r\nprecision lowp float;\r\n\r\n\r\n#if __VERSION__ == 100\r\n    #define texture(sampler, coord) texture2D(sampler, coord)\r\n#else \r\n    #define varying in\r\n#endif\r\n\r\n\r\n\r\n#if __VERSION__ == 100\r\n    #define fragColor gl_FragColor\r\n    #extension GL_OES_standard_derivatives : enable\r\n#else \r\n    layout(location = 0) out vec4 fragColor;\r\n#endif\r\n\r\nuniform int u_frameNumber;\r\n\r\nvarying vec2 v_uv;\r\n\r\n\r\nvoid main(void)\r\n{\r\n    vec3 color = vec3(28.0 / 255.0, 117.0 / 255.0, 188.0 / 255.0);\r\n    color += (vec3(0.0, v_uv) - 0.5) * 0.125;\r\n\r\n    vec2 awidth = fwidth(v_uv) * (sin(float(u_frameNumber) * 0.1) * 7.0 + 8.0);\r\n    vec2 cstep = abs(step(awidth, v_uv) - step(awidth, 1.0 - v_uv));\r\n    if(!any(bvec2(cstep))) {\r\n        discard;\r\n    }\r\n    fragColor = vec4(color, 1.0); \r\n}\r\n"}])});
//# sourceMappingURL=test-renderer.js.map