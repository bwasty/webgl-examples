!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("gloperate"));else if("function"==typeof define&&define.amd)define(["gloperate"],t);else{var i="object"==typeof exports?t(require("gloperate")):t(e.gloperate);for(var n in i)("object"==typeof exports?exports:e)[n]=i[n]}}(window,function(e){return function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=58)}({0:function(t,i){t.exports=e},2:function(e,t,i){"use strict"},54:function(e,t){e.exports="\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n    #define texture(sampler, coord) texture2D(sampler, coord)\n#else \n    #define varying in\n#endif\n\n\n\n#if __VERSION__ == 100\n    #define fragColor gl_FragColor\n    #extension GL_OES_standard_derivatives : enable\n#else \n    layout(location = 0) out vec4 fragColor;\n#endif\n\nuniform int u_frameNumber;\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    vec3 color = vec3(28.0 / 255.0, 117.0 / 255.0, 188.0 / 255.0);\n    color += (vec3(0.0, v_uv) - 0.5) * 0.125;\n\n    vec2 awidth = fwidth(v_uv) * (sin(float(u_frameNumber) * 0.1) * 7.0 + 8.0);\n    vec2 cstep = abs(step(awidth, v_uv) - step(awidth, 1.0 - v_uv));\n    if(!any(bvec2(cstep))) {\n        discard;\n    }\n    fragColor = vec4(color, 1.0); \n}\n"},55:function(e,t){e.exports="\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n#else \n    #define varying out\n#endif\n\n\n\n#if __VERSION__ == 100\n    attribute vec2 a_vertex;\n#else \n    layout(location = 0) in vec2 a_vertex;\n#endif\n\nuniform vec2 u_ndcOffset;\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    v_uv = a_vertex.xy * 0.5 + 0.5;\n\n    vec4 vertex = vec4(a_vertex, 0.0, 1.0);\n    vertex.xy = u_ndcOffset * vec2(vertex.w) + vertex.xy;\n\n    gl_Position = vertex;\n}\n"},56:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0);t.TestRenderer=class extends n.Renderer{constructor(){super(...arguments),this._extensions=!1}onUpdate(){this._testNavigation.update();const e=this._testNavigation.altered;return this._testNavigation.reset(),this._altered.any||e}onPrepare(){const e=this._context.gl,t=this._context.gl2facade;this._altered.multiFrameNumber&&(this._ndcOffsetKernel.width=this._multiFrameNumber),this._intermediateFBO.initialized?this._altered.frameSize&&this._intermediateFBO.resize(this._frameSize[0],this._frameSize[1]):(this._colorRenderTexture.initialize(this._frameSize[0],this._frameSize[1],this._context.isWebGL2?e.RGBA8:e.RGBA,e.RGBA,e.UNSIGNED_BYTE),this._depthRenderbuffer.initialize(this._frameSize[0],this._frameSize[1],e.DEPTH_COMPONENT16),this._intermediateFBO.initialize([[t.COLOR_ATTACHMENT0,this._colorRenderTexture],[e.DEPTH_ATTACHMENT,this._depthRenderbuffer]])),this._altered.clearColor&&this._intermediateFBO.clearColor(this._clearColor),this._accumulate.update(),this._altered.reset()}onFrame(e){const t=this._context.gl;t.viewport(0,0,this._frameSize[0],this._frameSize[1]),this._program.bind();const i=this._ndcOffsetKernel.get(e);i[0]=2*i[0]/this._frameSize[0],i[1]=2*i[1]/this._frameSize[1],t.uniform2fv(this._uNdcOffset,i),t.uniform1i(this._uFrameNumber,e),this._intermediateFBO.clear(t.COLOR_BUFFER_BIT,!0,!1),this._ndcTriangle.bind(),this._ndcTriangle.draw(),this._intermediateFBO.unbind(),this._accumulate.frame(e)}onSwap(){this._blit.framebuffer=this._accumulate.framebuffer?this._accumulate.framebuffer:this._blit.framebuffer=this._intermediateFBO,this._blit.frame()}onInitialize(e,t,r){const s=this._context.gl,a=this._context.gl2facade;!1===this._extensions&&this._context.isWebGL1&&(n.auxiliaries.assert(this._context.supportsStandardDerivatives,"expected OES_standard_derivatives support"),this._context.standardDerivatives,this._extensions=!0);const o=new n.Shader(this._context,s.VERTEX_SHADER,"testrenderer.vert");o.initialize(i(55));const _=new n.Shader(this._context,s.FRAGMENT_SHADER,"testrenderer.frag");_.initialize(i(54)),this._program=new n.Program(this._context),this._program.initialize([o,_]),this._uNdcOffset=this._program.uniform("u_ndcOffset"),this._uFrameNumber=this._program.uniform("u_frameNumber"),this._ndcTriangle=new n.NdcFillingTriangle(this._context);const u=this._program.attribute("a_vertex",0);return this._ndcTriangle.initialize(u),this._ndcOffsetKernel=new n.AntiAliasingKernel(this._multiFrameNumber),this._defaultFBO=new n.DefaultFramebuffer(this._context,"DefaultFBO"),this._defaultFBO.initialize(),this._colorRenderTexture=new n.Texture2(this._context,"ColorRenderTexture"),this._depthRenderbuffer=new n.Renderbuffer(this._context,"DepthRenderbuffer"),this._intermediateFBO=new n.Framebuffer(this._context,"IntermediateFBO"),this._accumulate=new n.AccumulatePass(this._context),this._accumulate.initialize(this._ndcTriangle),this._accumulate.precision=this._framePrecision,this._accumulate.texture=this._colorRenderTexture,this._blit=new n.BlitPass(this._context),this._blit.initialize(this._ndcTriangle),this._blit.readBuffer=a.COLOR_ATTACHMENT0,this._blit.drawBuffer=s.BACK,this._blit.target=this._defaultFBO,this._testNavigation=new n.debug.TestNavigation(()=>this.invalidate(),r),!0}onUninitialize(){this._uNdcOffset=-1,this._uFrameNumber=-1,this._program.uninitialize(),this._ndcTriangle.uninitialize(),this._intermediateFBO.uninitialize(),this._defaultFBO.uninitialize(),this._colorRenderTexture.uninitialize(),this._depthRenderbuffer.uninitialize(),this._blit.uninitialize()}}},57:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0),r=i(56);function s(){const e=new n.Canvas("example-canvas"),t=e.context,i=new r.TestRenderer;e.renderer=i,e.element.addEventListener("click",function(){n.viewer.Fullscreen.toggle(e.element)}),e.element.addEventListener("touchstart",function(){n.viewer.Fullscreen.toggle(e.element)}),window.canvas=e,window.context=t,window.renderer=i}"complete"===window.document.readyState?s():window.onload=s},58:function(e,t,i){i(2),e.exports=i(57)}})});
//# sourceMappingURL=test-renderer.js.map