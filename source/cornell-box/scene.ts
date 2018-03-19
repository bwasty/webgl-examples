
// http://www.graphics.cornell.edu/online/box/data.html

export let vertices = new Float32Array([
    // lights
    +0.233813, +1.000000, -0.188126, +0.233813, +1.000000, +0.187411,
    -0.233813, +1.000000, +0.187411, -0.233813, +1.000000, -0.188126,
    // room
    -1.000000, -1.000000, -1.000000, -1.000000, -1.000000, +1.000000,
    -1.000000, +1.000000, -1.000000, -1.000000, +1.000000, +1.000000,
    +0.988489, -1.000000, -1.000000, +0.976978, -1.000000, +1.000000,
    +1.000000, +1.000000, -1.000000, +1.000000, +1.000000, +1.000000,
    // short block
    +0.043165, -1.000000, -0.592275, +0.043165, -0.398688, -0.592275,
    -0.136691, -1.000000, -0.027182, -0.136691, -0.398688, -0.027182,
    -0.705036, -1.000000, -0.195279, -0.705036, -0.398688, -0.195279,
    -0.532374, -1.000000, -0.767525, -0.532374, -0.398688, -0.767525,
    // tall block
    +0.521583, -1.000000, -0.116595, +0.521583, +0.202624, -0.116595,
    +0.697842, -1.000000, +0.452074, +0.697842, +0.202624, +0.452074,
    +0.129496, -1.000000, +0.630901, +0.129496, +0.202624, +0.630901,
    -0.046763, -1.000000, +0.058655, -0.046763, +0.202624, +0.058655,
]);


/**
 * Indices per line: [ v0, v1, v2, color ]
 */
export let indices = new Uint8Array([
    // light
    0, 1, 2, 0,
    0, 2, 3, 0,
    // room ceiling
    10, 11, 7, 1,
    10, 7, 6, 1,
    // room floor
    8, 4, 5, 1,
    8, 5, 9, 1,
    // room front wall
    10, 6, 4, 1,
    10, 4, 8, 1,
    // room back wall
    9, 5, 7, 1,
    9, 7, 11, 1,
    // room right wall
    5, 4, 6, 3,
    5, 6, 7, 3,
    // room left wall
    8, 9, 11, 2,
    8, 11, 10, 2,
    // short block
    19, 17, 15, 1,
    19, 15, 13, 1,
    12, 13, 15, 1,
    12, 15, 14, 1,
    18, 19, 13, 1,
    18, 13, 12, 1,
    16, 17, 19, 1,
    16, 19, 18, 1,
    14, 15, 17, 1,
    14, 17, 16, 1,
    // tall block
    27, 25, 23, 1,
    27, 23, 21, 1,
    20, 21, 23, 1,
    20, 23, 22, 1,
    26, 27, 21, 1,
    26, 21, 20, 1,
    24, 25, 27, 1,
    24, 27, 26, 1,
    22, 23, 25, 1,
    22, 25, 24, 1,
]);


export let colors = new Float32Array([
    0.0, 0.0, 0.0, 1.0, // 0 black
    1.0, 1.0, 1.0, 1.0, // 1 white
    1.0, 0.0, 0.0, 1.0, // 2 red
    0.0, 1.0, 0.0, 1.0, // 3 green
]);
