precision mediump float;

uniform sampler2D source;
uniform vec2 size;

in vec2 v_uv;
out vec4 fragColor;

const float sigma = 4.0;

void main()
{
	float u = v_uv.x * 4.0;
	float v = v_uv.y * 4.0;

	float t = 4.0 / size.x;

    float twoSigma2 = 2.0 * sigma * sigma;
    int halfWidth = int(ceil(2.0 * sigma));

    vec4 sum = texture(source, vec2(u, v));
    float norm = 1.0;
    for (int i = 1; i <= halfWidth; ++i)
	{
        float kernel = exp(float(-i * i) / twoSigma2);
        sum += kernel * (texture(source, vec2(u + float(i) * t, v)) + texture(source, vec2(u - float(i) * t, v)));
        norm += 2.0 * kernel;
    }
    sum /= norm;

    fragColor = sum;
}
