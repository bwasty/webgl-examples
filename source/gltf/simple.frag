precision mediump float;

@import ../shaders/facade.frag;

#if __VERSION__ == 100
    #define fragColor gl_FragColor
#else
    layout(location = 0) out vec4 fragColor;
#endif


varying vec3 Normal;
// in vec4 Tangent;
// in vec2 TexCoords_0;
// in vec2 TexCoords_1;
// in vec3 Color;

// uniform sampler2D base_color_texture;
// uniform vec4 base_color_factor;

void main()
{
    // vec4 baseColor = texture(base_color_texture, TexCoords_0);
    // // TODO!: HACK
    // if (baseColor.x > 0.0 || baseColor.y > 0.0 || baseColor.z > 0.0) {
    //     fragColor = baseColor * base_color_factor;
    // }
    // else {
    //     fragColor = base_color_factor;
    // }

    // fragColor = vec4(1.0, 0.0, 0.0, 1.0);

    fragColor = vec4(Normal, 1.0);
    // fragColor = vec4(Tangent.xyz, 1.0);
    // fragColor = vec4(TexCoords_0, 0.0, 1.0);
    // fragColor = vec4(TexCoords_1, 0,0, 1.0);
    // fragColor = vec4(Color, 1.0);
}
