precision mediump float;

uniform sampler2D positions;
uniform sampler2D materials0;
uniform sampler2D materials1;
uniform samplerCube envmap;

uniform vec3 eye;

in vec2 v_uv;
in vec3 v_ray;
in vec3 v_sky;

out vec4 fragColor;

struct Sphere
{
	vec3 position;
	float radius;
};

struct Ray
{
	vec3 origin;
	vec3 direction;
};

struct Material
{
	vec4 sr; // vec3 specular, float reflectance
	vec4 dr; // vec3 diffuse, float roughness
};

const vec3 light = normalize(vec3(1.0, 0.0, -1.0));
const vec3 ambient = vec3(0.3725, 0.3686, 0.4314);


void cache(sampler2D positions, sampler2D materials0, sampler2D materials1);
bool trace(in Ray ray, out vec3 normal, out Material material, out float t);
vec3 CookTorrance(in vec3 V, in vec3 N, in vec3 L, in Material m, in vec3 R, in vec3 ambient);


void main()
{
	cache(positions, materials0, materials1); // cache blob and brdf texel fetches

	Ray ray[3];
	vec3 h[2];

	// initial ray
	ray[0].origin    = eye;
	ray[0].direction = normalize(v_sky);

	vec3 	 l = normalize(light); // -ray[0].direction;
	vec3     n[2];
	Material m[2];

	float t;
	vec3 c;

	float lum = 0.0;

	if(trace(ray[0], n[0], m[0], t))
	{
		vec3 v[2];

		ray[1].origin = ray[0].origin + ray[0].direction * t;
		ray[1].direction = reflect(ray[0].direction, n[0]);
		v[0] = -ray[0].direction;
		vec3 R;

		if(trace(ray[1], n[1], m[1], t))
		{
			ray[2].origin = ray[1].origin + ray[1].direction * t;
			ray[2].direction = reflect(ray[1].direction, n[1]);
			v[1] = -ray[1].direction;

			R = CookTorrance(v[1], n[1], l, m[1], texture(envmap, ray[2].direction).xyz, ambient);
		}
		else
			R = texture(envmap, ray[1].direction).xyz;

		c = CookTorrance(v[0], n[0], l, m[0], R, ambient);
	}
	else
	{
		c = texture(envmap, ray[0].direction).xyz;
		lum = (c.r * 11.0 + c.g * 16.0 + c.b * 5.0) / 32.0;
	}
	lum = (c.r * 11.0 + c.g * 16.0 + c.b * 5.0) / 32.0;
	fragColor = vec4(c, smoothstep(0.92, 1.0, lum * 1.0));
}
