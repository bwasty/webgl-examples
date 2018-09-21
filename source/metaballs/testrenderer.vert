
precision lowp float;

@import ../shaders/facade.vert;


#if __VERSION__ == 100
    attribute vec2 a_vertex;
#else 
    layout(location = 0) in vec2 a_vertex;
#endif

uniform vec2 u_ndcOffset;

varying vec2 v_uv;


void main(void)
{
    v_uv = a_vertex.xy * 0.5 + 0.5;

    vec4 vertex = vec4(a_vertex, 0.0, 1.0);
    vertex.xy = u_ndcOffset * vec2(vertex.w) + vertex.xy;

    gl_Position = vertex;
}
