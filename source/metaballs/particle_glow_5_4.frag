precision mediump float;

uniform sampler2D color;
uniform sampler2D glow;

in vec2 v_uv;

out vec4 fragColor;

void main()
{
	vec4 c = texelFetch(color, ivec2(gl_FragCoord.xy), 0);
	vec4 g = texture(glow, v_uv, 0.0);

	fragColor = vec4(clamp(g.w * g.xyz * 2.0 + c.xyz, 0.0, 1.0), 1.0);
	fragColor = vec4(clamp(g.w * g.xyz * 2.0 + c.xyz, 0.0, 1.0), 1.0);
}
