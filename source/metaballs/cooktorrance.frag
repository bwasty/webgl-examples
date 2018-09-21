precision mediump float;

const float EPSILON  = 1e-6;

// Schlick's Approximation of the Fresnel Factor
float fresnel(in float VdotH, in float r)
{
	// r: reflectance
	return pow(1.0 - VdotH, 5.0) * (1.0 - r) + r;
}

// Beckmann's distribution for roughness
float roughness(in float NdotH, in float r)
{
	// r: roughness

	float r2 = r * r;
	float a = 1.0f / (4.0f * r2  * pow(NdotH, 4.0));
	float b = NdotH * NdotH - 1.0;
	float c = r2 * NdotH * NdotH;

	return a * exp(b / c);
}

// Geometric attenuation accounts for the shadowing and
// self masking of one microfacet by another.
float geom(in float NdotH, in float NdotV, in float VdotH, in float NdotL)
{
	float geo_numerator   = 2.0 * NdotH;
    float geo_denominator = 1.0 / VdotH;

    float a = (geo_numerator * NdotV) * geo_denominator;
    float b = (geo_numerator * NdotL) * geo_denominator;
    return min(1.0, min(a, b));
}

vec3 CookTorrance(in vec3 V, in vec3 N, in vec3 L, in Material m, in vec3 R, in vec3 ambient)
{
	vec3 H = normalize(L + V);

	float VdotH = clamp(dot(V, H), 0.0, 1.0);
	float NdotV = clamp(dot(N, V), 0.0, 1.0);
	float NdotH = clamp(dot(N, H), 0.0, 1.0);
	float NdotL = clamp(dot(N, L), 0.0, 1.0);

	float Rs = clamp(geom(NdotH, NdotV, VdotH, NdotL) * fresnel(VdotH, m.dr.w) * roughness(NdotH, m.sr.w), 0.0, 1.0);
	Rs /= clamp(NdotV * NdotL, EPSILON, 1.0);

	float r2 = m.sr.w * m.sr.w;

	vec3 c = mix(m.sr.xyz * Rs + m.dr.xyz, R, r2);

	return mix(mix(ambient, R, r2) * c, c, NdotL);
}
