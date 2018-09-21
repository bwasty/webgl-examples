precision mediump float;

uniform sampler2D source;
uniform vec2 size;

in vec2 v_uv;
out vec4 fragColor;

const float sigma = 2.0;

void main()
{
	float u = v_uv.x;
	float v = v_uv.y;

	float t = 2.0 / size.y;

    float twoSigma2 = 2.0 * sigma * sigma;
    int halfWidth = int(ceil(2.0 * sigma));

    vec4 sum = texture(source, vec2(u, v));
    float norm = 1.0;
    for (int i = 1; i <= halfWidth; ++i)
	{
        float kernel = exp(float(-i * i) / twoSigma2);
        sum += kernel * (texture(source, vec2(u, v + float(i) * t)) + texture(source, vec2(u, v - float(i) * t)));
        norm += 2.0 * kernel;
    }
    sum /= norm;

    fragColor = sum;
}
