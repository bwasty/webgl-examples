@import ../shaders/facade.vert;

#if __VERSION__ == 100
    attribute vec3 a_vertex;
    // TODO! webgl1 support
#else
    layout (location = 0) in vec3 a_vertex;
    layout (location = 1) in vec3 a_normal;
    layout (location = 2) in vec4 a_tangent;
    layout (location = 3) in vec2 a_texCoords_0;
    layout (location = 4) in vec2 a_texCoords_1;
    layout (location = 5) in vec3 a_color;
#endif

out vec3 Normal;
// out vec4 Tangent;
// out vec2 TexCoords_0;
// out vec2 TexCoords_1;
// out vec3 Color;

uniform mat4 u_model;
uniform mat4 u_viewProjection;
// uniform mat4 u_modelViewProjection;

void main()
{
    Normal = a_normal; // TODO: transform
    // Tangent = a_tangent;
    // TexCoords_0 = a_texCoords_0;
    // TexCoords_1 = a_texCoords_1;
    // Color = a_color;
    gl_Position = u_viewProjection * u_model
        * vec4(a_vertex, 1.0);
}
