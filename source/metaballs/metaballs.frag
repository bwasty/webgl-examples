precision mediump float;

const float INFINITY = 1e+4;

const int SIZE = 12;
const float TRESHOLD = 0.66;

struct Sphere
{
	vec3 position;
	float radius;
};

struct Material
{
	vec4 sr; // vec3 specular, float reflectance
	vec4 dr; // vec3 diffuse, float roughness
};

struct Ray
{
	vec3 origin;
	vec3 direction;
};


Sphere blobs[16];
Material materials[16];

void cache(
	sampler2D positions
,	sampler2D materials0
,	sampler2D materials1)
{
	for(int i = 0; i < SIZE; ++i)
	{
		ivec2 uv = ivec2(i % 4, i / 4);

		vec4 v = texelFetch(positions, uv, 0);

		Sphere blob;
		blob.position = v.xyz;
		blob.radius = v.w;

		blobs[i] = blob;

		Material mat;
		mat.sr = texelFetch(materials0, uv, 0);
		mat.dr = texelFetch(materials1, uv, 0);

		materials[i] = mat;
	}
}

// sphere intersection
bool intersect(
    const in Sphere blob
,   const in Ray ray // needs to be normalized!
,   out float t0
,   out float t1)
{
	vec3  d = ray.origin - blob.position;

	float b = 2 * dot(ray.direction, d);
	float c = dot(d, d) - blob.radius * blob.radius;

	float t = b * b - 4 * c;
	if(t > 0.0)
	{
		t0 = 0.5 * (-b - sqrt(t));
		t1 = 0.5 * (-b + sqrt(t));
		return true;
	}
	return false;
}

float sum(in vec3 pos)
{
	float s = 0.0;
	for(int i = 0; i < SIZE; ++i)
	{
		Sphere blob = blobs[i];
		s += smoothstep(blob.radius, 0.0, distance(pos, blob.position));
	}
	return s;
}

void interp(in vec3 pos, out vec3 N, out Material M)
{
	float 	 W = 0;
	N 		   = vec3(0.0);
	//M.KasdIOR  = vec4(0.0);
	M.sr       = vec4(0.0);
	M.dr       = vec4(0.0);

	for(int i = 0; i < SIZE; ++i)
	{
		Sphere blob = blobs[i];
		Material m  = materials[i];

		float w = smoothstep(blob.radius, 0.0, distance(pos, blob.position));

		N += normalize(pos - blob.position) * w;
		W += w;

		//M.KasdIOR += m.KasdIOR * w;
		M.sr 	  += m.sr * w;
		M.dr 	  += m.dr * w;
	}
	N = normalize(N);
	W = 1.0 / W;
	M.sr *= W;
	M.dr *= W;
}

bool rcast(in Ray ray, out vec3 normal, out Material material, out float t)
{
	// ToDo: Begin Task 5_1

	t =  INFINITY;

	for(int i = 0; i < SIZE; ++i)
	{
		float t0 = INFINITY;
		float t1 = INFINITY;

		if(intersect(blobs[i], ray, t0, t1) && t0 < t && t0 > 0.0)
		{
			t = t0;
			normal = normalize((ray.origin + ray.direction * t) - blobs[i].position);
			material = materials[i];
		}
	}
	return t > 0.0 && t < INFINITY;

	// ToDo: End Task 5_1
}

bool trace(in Ray ray, out vec3 normal, out Material material, out float t)
{
	float tmin =  INFINITY;
	float tmax = -INFINITY;

	for(int i = 0; i < SIZE; ++i)
	{
		float t0 = INFINITY;
		float t1 = INFINITY;

		if(intersect(blobs[i], ray, t0, t1))
		{
			tmin = min(t0, tmin);
			tmax = max(t1, tmax);
		}
	}
	t = max(tmin, 0.2);
	vec3 pos;
	float delta[2];
	delta[0] = 1.f;
	delta[1] = 1.f;

	int i = 0;

	while(t < tmax)
	{
		pos = ray.origin + ray.direction * t;
		float s = sum(pos);

		delta[1] = delta[0];
		delta[0] = TRESHOLD - s;

		if(++i > 64 || abs(delta[0]) < 0.02)
		{
			interp(pos, normal, material);
			return true;
		}

		t += delta[0] * 0.33;
	}
	return false;
}
