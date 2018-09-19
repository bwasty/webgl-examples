
precision lowp float;

#if __VERSION__ == 100
    #define texture(sampler, coord) texture2D(sampler, coord)
#else
    #define varying in
#endif

#if __VERSION__ == 100
    #define fragColor gl_FragColor
#else
    layout(location = 0) out vec4 fragColor;
#endif


varying vec3 v_vertex;


void main(void)
{
    fragColor = vec4(v_vertex * 0.5 + 0.5, 1.0);
}
