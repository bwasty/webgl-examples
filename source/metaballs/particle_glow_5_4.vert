in vec2 a_vertex;

out vec2 v_uv;

void main()
{
	v_uv = a_vertex * 0.5 + 0.5;
	gl_Position = vec4(a_vertex, 1.0, 1.0);
}
