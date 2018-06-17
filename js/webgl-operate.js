(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs/ReplaySubject"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs/ReplaySubject"], factory);
	else if(typeof exports === 'object')
		exports["gloperate"] = factory(require("rxjs/ReplaySubject"));
	else
		root["gloperate"] = factory(root["Rx"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_rxjs_ReplaySubject__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/decode-uri-component/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/decode-uri-component/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix.js":
/*!**************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.2
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER

exports.glMatrix = __webpack_require__(/*! ./gl-matrix/common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");
exports.mat2 = __webpack_require__(/*! ./gl-matrix/mat2.js */ "../node_modules/gl-matrix/src/gl-matrix/mat2.js");
exports.mat2d = __webpack_require__(/*! ./gl-matrix/mat2d.js */ "../node_modules/gl-matrix/src/gl-matrix/mat2d.js");
exports.mat3 = __webpack_require__(/*! ./gl-matrix/mat3.js */ "../node_modules/gl-matrix/src/gl-matrix/mat3.js");
exports.mat4 = __webpack_require__(/*! ./gl-matrix/mat4.js */ "../node_modules/gl-matrix/src/gl-matrix/mat4.js");
exports.quat = __webpack_require__(/*! ./gl-matrix/quat.js */ "../node_modules/gl-matrix/src/gl-matrix/quat.js");
exports.vec2 = __webpack_require__(/*! ./gl-matrix/vec2.js */ "../node_modules/gl-matrix/src/gl-matrix/vec2.js");
exports.vec3 = __webpack_require__(/*! ./gl-matrix/vec3.js */ "../node_modules/gl-matrix/src/gl-matrix/vec3.js");
exports.vec4 = __webpack_require__(/*! ./gl-matrix/vec4.js */ "../node_modules/gl-matrix/src/gl-matrix/vec4.js");

/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/common.js":
/*!*********************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/common.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Configuration Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;
glMatrix.ENABLE_SIMD = false;

// Capability detection
glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    glMatrix.ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less 
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 * 
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
glMatrix.equals = function(a, b) {
	return Math.abs(a - b) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}

module.exports = glMatrix;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/mat2.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/mat2.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
mat2.fromValues = function(m00, m01, m10, m11) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
};

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
mat2.set = function(out, m00, m01, m10, m11) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
};


/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link mat2.subtract}
 * @function
 */
mat2.sub = mat2.subtract;

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
mat2.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
mat2.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

module.exports = mat2;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/mat2d.js":
/*!********************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/mat2d.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */
mat2d.fromValues = function(a, b, c, d, tx, ty) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
mat2d.set = function(out, a, b, c, d, tx, ty) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
mat2d.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
mat2d.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    return out;
};

/**
 * Alias for {@link mat2d.subtract}
 * @function
 */
mat2d.sub = mat2d.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */
mat2d.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    return out;
};

/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */
mat2d.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2d.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2d.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
};

module.exports = mat2d;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/mat3.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/mat3.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 3x3 Matrix
 * @name mat3
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
mat3.fromValues = function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
};

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
mat3.set = function(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    return out;
};

/**
 * Alias for {@link mat3.subtract}
 * @function
 */
mat3.sub = mat3.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
mat3.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    return out;
};

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
mat3.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    out[6] = a[6] + (b[6] * scale);
    out[7] = a[7] + (b[7] * scale);
    out[8] = a[8] + (b[8] * scale);
    return out;
};

/*
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && 
           a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
           a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = a[6], b7 = b[7], b8 = b[8];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
};


module.exports = mat3;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/mat4.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/mat4.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 4x4 Matrix
 * @name mat4
 */
var mat4 = {
  scalar: {},
  SIMD: {},
};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
mat4.fromValues = function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
};

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
mat4.set = function(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
};


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }

    return out;
};

/**
 * Transpose the values of a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.transpose = function(out, a) {
    var a0, a1, a2, a3,
        tmp01, tmp23,
        out0, out1, out2, out3;

    a0 = SIMD.Float32x4.load(a, 0);
    a1 = SIMD.Float32x4.load(a, 4);
    a2 = SIMD.Float32x4.load(a, 8);
    a3 = SIMD.Float32x4.load(a, 12);

    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
    out0  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    out1  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    SIMD.Float32x4.store(out, 0,  out0);
    SIMD.Float32x4.store(out, 4,  out1);

    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
    out2  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    out3  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    SIMD.Float32x4.store(out, 8,  out2);
    SIMD.Float32x4.store(out, 12, out3);

    return out;
};

/**
 * Transpse a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = glMatrix.USE_SIMD ? mat4.SIMD.transpose : mat4.scalar.transpose;

/**
 * Inverts a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Inverts a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.invert = function(out, a) {
  var row0, row1, row2, row3,
      tmp1,
      minor0, minor1, minor2, minor3,
      det,
      a0 = SIMD.Float32x4.load(a, 0),
      a1 = SIMD.Float32x4.load(a, 4),
      a2 = SIMD.Float32x4.load(a, 8),
      a3 = SIMD.Float32x4.load(a, 12);

  // Compute matrix adjugate
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

  tmp1   = SIMD.Float32x4.mul(row2, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.mul(row1, tmp1);
  minor1 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row1, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
  minor3 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
  minor2 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row0, row1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

  // Compute matrix determinant
  det   = SIMD.Float32x4.mul(row0, minor0);
  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 2, 3, 0, 1), det);
  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 1, 0, 3, 2), det);
  tmp1  = SIMD.Float32x4.reciprocalApproximation(det);
  det   = SIMD.Float32x4.sub(
               SIMD.Float32x4.add(tmp1, tmp1),
               SIMD.Float32x4.mul(det, SIMD.Float32x4.mul(tmp1, tmp1)));
  det   = SIMD.Float32x4.swizzle(det, 0, 0, 0, 0);
  if (!det) {
      return null;
  }

  // Compute matrix inverse
  SIMD.Float32x4.store(out, 0,  SIMD.Float32x4.mul(det, minor0));
  SIMD.Float32x4.store(out, 4,  SIMD.Float32x4.mul(det, minor1));
  SIMD.Float32x4.store(out, 8,  SIMD.Float32x4.mul(det, minor2));
  SIMD.Float32x4.store(out, 12, SIMD.Float32x4.mul(det, minor3));
  return out;
}

/**
 * Inverts a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = glMatrix.USE_SIMD ? mat4.SIMD.invert : mat4.scalar.invert;

/**
 * Calculates the adjugate of a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the adjugate of a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.adjoint = function(out, a) {
  var a0, a1, a2, a3;
  var row0, row1, row2, row3;
  var tmp1;
  var minor0, minor1, minor2, minor3;

  var a0 = SIMD.Float32x4.load(a, 0);
  var a1 = SIMD.Float32x4.load(a, 4);
  var a2 = SIMD.Float32x4.load(a, 8);
  var a3 = SIMD.Float32x4.load(a, 12);

  // Transpose the source matrix.  Sort of.  Not a true transpose operation
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);

  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

  tmp1   = SIMD.Float32x4.mul(row2, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.mul(row1, tmp1);
  minor1 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row1, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
  minor3 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
  minor2 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row0, row1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

  SIMD.Float32x4.store(out, 0,  minor0);
  SIMD.Float32x4.store(out, 4,  minor1);
  SIMD.Float32x4.store(out, 8,  minor2);
  SIMD.Float32x4.store(out, 12, minor3);
  return out;
};

/**
 * Calculates the adjugate of a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
 mat4.adjoint = glMatrix.USE_SIMD ? mat4.SIMD.adjoint : mat4.scalar.adjoint;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's explicitly using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand, must be a Float32Array
 * @param {mat4} b the second operand, must be a Float32Array
 * @returns {mat4} out
 */
mat4.SIMD.multiply = function (out, a, b) {
    var a0 = SIMD.Float32x4.load(a, 0);
    var a1 = SIMD.Float32x4.load(a, 4);
    var a2 = SIMD.Float32x4.load(a, 8);
    var a3 = SIMD.Float32x4.load(a, 12);

    var b0 = SIMD.Float32x4.load(b, 0);
    var out0 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 0, out0);

    var b1 = SIMD.Float32x4.load(b, 4);
    var out1 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 4, out1);

    var b2 = SIMD.Float32x4.load(b, 8);
    var out2 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 8, out2);

    var b3 = SIMD.Float32x4.load(b, 12);
    var out3 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                        SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                        SIMD.Float32x4.add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 12, out3);

    return out;
};

/**
 * Multiplies two mat4's explicitly not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.scalar.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Multiplies two mat4's using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply;

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.scalar.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Translates a mat4 by the given vector using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.SIMD.translate = function (out, a, v) {
    var a0 = SIMD.Float32x4.load(a, 0),
        a1 = SIMD.Float32x4.load(a, 4),
        a2 = SIMD.Float32x4.load(a, 8),
        a3 = SIMD.Float32x4.load(a, 12),
        vec = SIMD.Float32x4(v[0], v[1], v[2] , 0);

    if (a !== out) {
        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
        out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
        out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
    }

    a0 = SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0));
    a1 = SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1));
    a2 = SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2));

    var t0 = SIMD.Float32x4.add(a0, SIMD.Float32x4.add(a1, SIMD.Float32x4.add(a2, a3)));
    SIMD.Float32x4.store(out, 12, t0);

    return out;
};

/**
 * Translates a mat4 by the given vector using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = glMatrix.USE_SIMD ? mat4.SIMD.translate : mat4.scalar.translate;

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scalar.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3 using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.SIMD.scale = function(out, a, v) {
    var a0, a1, a2;
    var vec = SIMD.Float32x4(v[0], v[1], v[2], 0);

    a0 = SIMD.Float32x4.load(a, 0);
    SIMD.Float32x4.store(
        out, 0, SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0)));

    a1 = SIMD.Float32x4.load(a, 4);
    SIMD.Float32x4.store(
        out, 4, SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1)));

    a2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(
        out, 8, SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2)));

    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 */
mat4.scale = glMatrix.USE_SIMD ? mat4.SIMD.scale : mat4.scalar.scale;

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateX = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      out[0]  = a[0];
      out[1]  = a[1];
      out[2]  = a[2];
      out[3]  = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_1 = SIMD.Float32x4.load(a, 4);
    var a_2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(out, 4,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_2, s)));
    SIMD.Float32x4.store(out, 8,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_2, c), SIMD.Float32x4.mul(a_1, s)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis using SIMD if availabe and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = glMatrix.USE_SIMD ? mat4.SIMD.rotateX : mat4.scalar.rotateX;

/**
 * Rotates a matrix by the given angle around the Y axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateY = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_0 = SIMD.Float32x4.load(a, 0);
    var a_2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(out, 0,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_2, s)));
    SIMD.Float32x4.store(out, 8,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, s), SIMD.Float32x4.mul(a_2, c)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis if SIMD available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
 mat4.rotateY = glMatrix.USE_SIMD ? mat4.SIMD.rotateY : mat4.scalar.rotateY;

/**
 * Rotates a matrix by the given angle around the Z axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateZ = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_0 = SIMD.Float32x4.load(a, 0);
    var a_1 = SIMD.Float32x4.load(a, 4);
    SIMD.Float32x4.store(out, 0,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_1, s)));
    SIMD.Float32x4.store(out, 4,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_0, s)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis if SIMD available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
 mat4.rotateZ = glMatrix.USE_SIMD ? mat4.SIMD.rotateZ : mat4.scalar.rotateZ;

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = 1;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = 0;
    out[2]  = -s;
    out[3]  = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = s;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
mat4.getTranslation = function (out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
};

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
mat4.getRotation = function (out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  var trace = mat[0] + mat[5] + mat[10];
  var S = 0;

  if (trace > 0) { 
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S; 
    out[2] = (mat[1] - mat[4]) / S; 
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) { 
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S; 
    out[2] = (mat[8] + mat[2]) / S; 
  } else if (mat[5] > mat[10]) { 
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S; 
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S; 
  } else { 
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q[0], y = q[1], z = q[2], w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,

      sx = s[0],
      sy = s[1],
      sz = s[2],

      ox = o[0],
      oy = o[1],
      oz = o[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;

  return out;
};

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
};

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
mat4.sub = mat4.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
mat4.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
};

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
mat4.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    out[6] = a[6] + (b[6] * scale);
    out[7] = a[7] + (b[7] * scale);
    out[8] = a[8] + (b[8] * scale);
    out[9] = a[9] + (b[9] * scale);
    out[10] = a[10] + (b[10] * scale);
    out[11] = a[11] + (b[11] * scale);
    out[12] = a[12] + (b[12] * scale);
    out[13] = a[13] + (b[13] * scale);
    out[14] = a[14] + (b[14] * scale);
    out[15] = a[15] + (b[15] * scale);
    return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && 
           a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && 
           a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
           a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.equals = function (a, b) {
    var a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3],
        a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7], 
        a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11], 
        a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

    var b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3],
        b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7], 
        b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11], 
        b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
            Math.abs(a9 - b9) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
            Math.abs(a10 - b10) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
            Math.abs(a11 - b11) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
            Math.abs(a12 - b12) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
            Math.abs(a13 - b13) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
            Math.abs(a14 - b14) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
            Math.abs(a15 - b15) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
};



module.exports = mat4;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/quat.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/quat.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");
var mat3 = __webpack_require__(/*! ./mat3.js */ "../node_modules/gl-matrix/src/gl-matrix/mat3.js");
var vec3 = __webpack_require__(/*! ./vec3.js */ "../node_modules/gl-matrix/src/gl-matrix/vec3.js");
var vec4 = __webpack_require__(/*! ./vec4.js */ "../node_modules/gl-matrix/src/gl-matrix/vec4.js");

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
quat.getAxisAngle = function(out_axis, q) {
    var rad = Math.acos(q[3]) * 2.0;
    var s = Math.sin(rad / 2.0);
    if (s != 0.0) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
    } else {
        // If s is zero, return any axis (no rotation - axis does not matter)
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
    }
    return rad;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.exactEquals = vec4.exactEquals;

/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.equals = vec4.equals;

module.exports = quat;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/vec2.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/vec2.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
vec2.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
vec2.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
vec2.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.equals = function (a, b) {
    var a0 = a[0], a1 = a[1];
    var b0 = b[0], b1 = b[1];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
};

module.exports = vec2;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/vec3.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/vec3.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
vec3.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
};

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
vec3.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
};

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
vec3.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = function(a, b) {
   
    var tempA = vec3.fromValues(a[0], a[1], a[2]);
    var tempB = vec3.fromValues(b[0], b[1], b[2]);
 
    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);
 
    var cosine = vec3.dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};

module.exports = vec3;


/***/ }),

/***/ "../node_modules/gl-matrix/src/gl-matrix/vec4.js":
/*!*******************************************************!*\
  !*** ../node_modules/gl-matrix/src/gl-matrix/vec4.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(/*! ./common.js */ "../node_modules/gl-matrix/src/gl-matrix/common.js");

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
vec4.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    out[3] = Math.ceil(a[3]);
    return out;
};

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
vec4.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
};

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
vec4.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    out[3] = Math.round(a[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = glMatrix.RANDOM();
    out[1] = glMatrix.RANDOM();
    out[2] = glMatrix.RANDOM();
    out[3] = glMatrix.RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

module.exports = vec4;


/***/ }),

/***/ "../node_modules/jsonschema/lib/attribute.js":
/*!***************************************************!*\
  !*** ../node_modules/jsonschema/lib/attribute.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var helpers = __webpack_require__(/*! ./helpers */ "../node_modules/jsonschema/lib/helpers.js");

/** @type ValidatorResult */
var ValidatorResult = helpers.ValidatorResult;
/** @type SchemaError */
var SchemaError = helpers.SchemaError;

var attribute = {};

attribute.ignoreProperties = {
  // informative properties
  'id': true,
  'default': true,
  'description': true,
  'title': true,
  // arguments to other properties
  'exclusiveMinimum': true,
  'exclusiveMaximum': true,
  'additionalItems': true,
  // special-handled properties
  '$schema': true,
  '$ref': true,
  'extends': true
};

/**
 * @name validators
 */
var validators = attribute.validators = {};

/**
 * Validates whether the instance if of a certain type
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {ValidatorResult|null}
 */
validators.type = function validateType (instance, schema, options, ctx) {
  // Ignore undefined instances
  if (instance === undefined) {
    return null;
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  var types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (!types.some(this.testType.bind(this, instance, schema, options, ctx))) {
    var list = types.map(function (v) {
      return v.id && ('<' + v.id + '>') || (v+'');
    });
    result.addError({
      name: 'type',
      argument: list,
      message: "is not of a type(s) " + list,
    });
  }
  return result;
};

function testSchemaNoThrow(instance, options, ctx, callback, schema){
  var throwError = options.throwError;
  options.throwError = false;
  var res = this.validateSchema(instance, schema, options, ctx);
  options.throwError = throwError;

  if (! res.valid && callback instanceof Function) {
    callback(res);
  }
  return res.valid;
}

/**
 * Validates whether the instance matches some of the given schemas
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {ValidatorResult|null}
 */
validators.anyOf = function validateAnyOf (instance, schema, options, ctx) {
  // Ignore undefined instances
  if (instance === undefined) {
    return null;
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  var inner = new ValidatorResult(instance, schema, options, ctx);
  if (!Array.isArray(schema.anyOf)){
    throw new SchemaError("anyOf must be an array");
  }
  if (!schema.anyOf.some(
    testSchemaNoThrow.bind(
      this, instance, options, ctx, function(res){inner.importErrors(res);}
      ))) {
    var list = schema.anyOf.map(function (v, i) {
      return (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
    });
    if (options.nestedErrors) {
      result.importErrors(inner);
    }
    result.addError({
      name: 'anyOf',
      argument: list,
      message: "is not any of " + list.join(','),
    });
  }
  return result;
};

/**
 * Validates whether the instance matches every given schema
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null}
 */
validators.allOf = function validateAllOf (instance, schema, options, ctx) {
  // Ignore undefined instances
  if (instance === undefined) {
    return null;
  }
  if (!Array.isArray(schema.allOf)){
    throw new SchemaError("allOf must be an array");
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  var self = this;
  schema.allOf.forEach(function(v, i){
    var valid = self.validateSchema(instance, v, options, ctx);
    if(!valid.valid){
      var msg = (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
      result.addError({
        name: 'allOf',
        argument: { id: msg, length: valid.errors.length, valid: valid },
        message: 'does not match allOf schema ' + msg + ' with ' + valid.errors.length + ' error[s]:',
      });
      result.importErrors(valid);
    }
  });
  return result;
};

/**
 * Validates whether the instance matches exactly one of the given schemas
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null}
 */
validators.oneOf = function validateOneOf (instance, schema, options, ctx) {
  // Ignore undefined instances
  if (instance === undefined) {
    return null;
  }
  if (!Array.isArray(schema.oneOf)){
    throw new SchemaError("oneOf must be an array");
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  var inner = new ValidatorResult(instance, schema, options, ctx);
  var count = schema.oneOf.filter(
    testSchemaNoThrow.bind(
      this, instance, options, ctx, function(res) {inner.importErrors(res);}
      ) ).length;
  var list = schema.oneOf.map(function (v, i) {
    return (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
  });
  if (count!==1) {
    if (options.nestedErrors) {
      result.importErrors(inner);
    }
    result.addError({
      name: 'oneOf',
      argument: list,
      message: "is not exactly one from " + list.join(','),
    });
  }
  return result;
};

/**
 * Validates properties
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null|ValidatorResult}
 */
validators.properties = function validateProperties (instance, schema, options, ctx) {
  if(!this.types.object(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var properties = schema.properties || {};
  for (var property in properties) {
    if (typeof options.preValidateProperty == 'function') {
      options.preValidateProperty(instance, property, properties[property], options, ctx);
    }

    var prop = Object.hasOwnProperty.call(instance, property) ? instance[property] : undefined;
    var res = this.validateSchema(prop, properties[property], options, ctx.makeChild(properties[property], property));
    if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
    result.importErrors(res);
  }
  return result;
};

/**
 * Test a specific property within in instance against the additionalProperties schema attribute
 * This ignores properties with definitions in the properties schema attribute, but no other attributes.
 * If too many more types of property-existance tests pop up they may need their own class of tests (like `type` has)
 * @private
 * @return {boolean}
 */
function testAdditionalProperty (instance, schema, options, ctx, property, result) {
  if(!this.types.object(instance)) return;
  if (schema.properties && schema.properties[property] !== undefined) {
    return;
  }
  if (schema.additionalProperties === false) {
    result.addError({
      name: 'additionalProperties',
      argument: property,
      message: "additionalProperty " + JSON.stringify(property) + " exists in instance when not allowed",
    });
  } else {
    var additionalProperties = schema.additionalProperties || {};

    if (typeof options.preValidateProperty == 'function') {
      options.preValidateProperty(instance, property, additionalProperties, options, ctx);
    }

    var res = this.validateSchema(instance[property], additionalProperties, options, ctx.makeChild(additionalProperties, property));
    if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
    result.importErrors(res);
  }
}

/**
 * Validates patternProperties
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null|ValidatorResult}
 */
validators.patternProperties = function validatePatternProperties (instance, schema, options, ctx) {
  if(!this.types.object(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var patternProperties = schema.patternProperties || {};

  for (var property in instance) {
    var test = true;
    for (var pattern in patternProperties) {
      var expr = new RegExp(pattern);
      if (!expr.test(property)) {
        continue;
      }
      test = false;

      if (typeof options.preValidateProperty == 'function') {
        options.preValidateProperty(instance, property, patternProperties[pattern], options, ctx);
      }

      var res = this.validateSchema(instance[property], patternProperties[pattern], options, ctx.makeChild(patternProperties[pattern], property));
      if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
      result.importErrors(res);
    }
    if (test) {
      testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
    }
  }

  return result;
};

/**
 * Validates additionalProperties
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null|ValidatorResult}
 */
validators.additionalProperties = function validateAdditionalProperties (instance, schema, options, ctx) {
  if(!this.types.object(instance)) return;
  // if patternProperties is defined then we'll test when that one is called instead
  if (schema.patternProperties) {
    return null;
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  for (var property in instance) {
    testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
  }
  return result;
};

/**
 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.minProperties = function validateMinProperties (instance, schema, options, ctx) {
  if (!this.types.object(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var keys = Object.keys(instance);
  if (!(keys.length >= schema.minProperties)) {
    result.addError({
      name: 'minProperties',
      argument: schema.minProperties,
      message: "does not meet minimum property length of " + schema.minProperties,
    })
  }
  return result;
};

/**
 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.maxProperties = function validateMaxProperties (instance, schema, options, ctx) {
  if (!this.types.object(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var keys = Object.keys(instance);
  if (!(keys.length <= schema.maxProperties)) {
    result.addError({
      name: 'maxProperties',
      argument: schema.maxProperties,
      message: "does not meet maximum property length of " + schema.maxProperties,
    });
  }
  return result;
};

/**
 * Validates items when instance is an array
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null|ValidatorResult}
 */
validators.items = function validateItems (instance, schema, options, ctx) {
  var self = this;
  if (!this.types.array(instance)) return;
  if (!schema.items) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  instance.every(function (value, i) {
    var items = Array.isArray(schema.items) ? (schema.items[i] || schema.additionalItems) : schema.items;
    if (items === undefined) {
      return true;
    }
    if (items === false) {
      result.addError({
        name: 'items',
        message: "additionalItems not permitted",
      });
      return false;
    }
    var res = self.validateSchema(value, items, options, ctx.makeChild(items, i));
    if(res.instance !== result.instance[i]) result.instance[i] = res.instance;
    result.importErrors(res);
    return true;
  });
  return result;
};

/**
 * Validates minimum and exclusiveMinimum when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.minimum = function validateMinimum (instance, schema, options, ctx) {
  if (!this.types.number(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var valid = true;
  if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
    valid = instance > schema.minimum;
  } else {
    valid = instance >= schema.minimum;
  }
  if (!valid) {
    result.addError({
      name: 'minimum',
      argument: schema.minimum,
      message: "must have a minimum value of " + schema.minimum,
    });
  }
  return result;
};

/**
 * Validates maximum and exclusiveMaximum when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.maximum = function validateMaximum (instance, schema, options, ctx) {
  if (!this.types.number(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var valid;
  if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
    valid = instance < schema.maximum;
  } else {
    valid = instance <= schema.maximum;
  }
  if (!valid) {
    result.addError({
      name: 'maximum',
      argument: schema.maximum,
      message: "must have a maximum value of " + schema.maximum,
    });
  }
  return result;
};

/**
 * Perform validation for multipleOf and divisibleBy, which are essentially the same.
 * @param instance
 * @param schema
 * @param validationType
 * @param errorMessage
 * @returns {String|null}
 */
var validateMultipleOfOrDivisbleBy = function validateMultipleOfOrDivisbleBy (instance, schema, options, ctx, validationType, errorMessage) {
  if (!this.types.number(instance)) return;

  var validationArgument = schema[validationType];
  if (validationArgument == 0) {
    throw new SchemaError(validationType + " cannot be zero");
  }

  var result = new ValidatorResult(instance, schema, options, ctx);

  var instanceDecimals = helpers.getDecimalPlaces(instance);
  var divisorDecimals = helpers.getDecimalPlaces(validationArgument);

  var maxDecimals = Math.max(instanceDecimals , divisorDecimals);
  var multiplier = Math.pow(10, maxDecimals);

  if (Math.round(instance * multiplier) % Math.round(validationArgument * multiplier) !== 0) {
    result.addError({
      name: validationType,
      argument:  validationArgument,
      message: errorMessage + JSON.stringify(validationArgument)
    });
  }

  return result;
};

/**
 * Validates divisibleBy when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.multipleOf = function validateMultipleOf (instance, schema, options, ctx) {
 return validateMultipleOfOrDivisbleBy.call(this, instance, schema, options, ctx, "multipleOf", "is not a multiple of (divisible by) ");
};

/**
 * Validates multipleOf when the type of the instance value is a number.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.divisibleBy = function validateDivisibleBy (instance, schema, options, ctx) {
  return validateMultipleOfOrDivisbleBy.call(this, instance, schema, options, ctx, "divisibleBy", "is not divisible by (multiple of) ");
};

/**
 * Validates whether the instance value is present.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.required = function validateRequired (instance, schema, options, ctx) {
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (instance === undefined && schema.required === true) {
    // A boolean form is implemented for reverse-compatability with schemas written against older drafts
    result.addError({
      name: 'required',
      message: "is required"
    });
  } else if (this.types.object(instance) && Array.isArray(schema.required)) {
    schema.required.forEach(function(n){
      if(instance[n]===undefined){
        result.addError({
          name: 'required',
          argument: n,
          message: "requires property " + JSON.stringify(n),
        });
      }
    });
  }
  return result;
};

/**
 * Validates whether the instance value matches the regular expression, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.pattern = function validatePattern (instance, schema, options, ctx) {
  if (!this.types.string(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!instance.match(schema.pattern)) {
    result.addError({
      name: 'pattern',
      argument: schema.pattern,
      message: "does not match pattern " + JSON.stringify(schema.pattern),
    });
  }
  return result;
};

/**
 * Validates whether the instance value is of a certain defined format or a custom
 * format.
 * The following formats are supported for string types:
 *   - date-time
 *   - date
 *   - time
 *   - ip-address
 *   - ipv6
 *   - uri
 *   - color
 *   - host-name
 *   - alpha
 *   - alpha-numeric
 *   - utc-millisec
 * @param instance
 * @param schema
 * @param [options]
 * @param [ctx]
 * @return {String|null}
 */
validators.format = function validateFormat (instance, schema, options, ctx) {
  if (instance===undefined) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!result.disableFormat && !helpers.isFormat(instance, schema.format, this)) {
    result.addError({
      name: 'format',
      argument: schema.format,
      message: "does not conform to the " + JSON.stringify(schema.format) + " format",
    });
  }
  return result;
};

/**
 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.minLength = function validateMinLength (instance, schema, options, ctx) {
  if (!this.types.string(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var hsp = instance.match(/[\uDC00-\uDFFF]/g);
  var length = instance.length - (hsp ? hsp.length : 0);
  if (!(length >= schema.minLength)) {
    result.addError({
      name: 'minLength',
      argument: schema.minLength,
      message: "does not meet minimum length of " + schema.minLength,
    });
  }
  return result;
};

/**
 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.maxLength = function validateMaxLength (instance, schema, options, ctx) {
  if (!this.types.string(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  // TODO if this was already computed in "minLength", use that value instead of re-computing
  var hsp = instance.match(/[\uDC00-\uDFFF]/g);
  var length = instance.length - (hsp ? hsp.length : 0);
  if (!(length <= schema.maxLength)) {
    result.addError({
      name: 'maxLength',
      argument: schema.maxLength,
      message: "does not meet maximum length of " + schema.maxLength,
    });
  }
  return result;
};

/**
 * Validates whether instance contains at least a minimum number of items, when the instance is an Array.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.minItems = function validateMinItems (instance, schema, options, ctx) {
  if (!this.types.array(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!(instance.length >= schema.minItems)) {
    result.addError({
      name: 'minItems',
      argument: schema.minItems,
      message: "does not meet minimum length of " + schema.minItems,
    });
  }
  return result;
};

/**
 * Validates whether instance contains no more than a maximum number of items, when the instance is an Array.
 * @param instance
 * @param schema
 * @return {String|null}
 */
validators.maxItems = function validateMaxItems (instance, schema, options, ctx) {
  if (!this.types.array(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!(instance.length <= schema.maxItems)) {
    result.addError({
      name: 'maxItems',
      argument: schema.maxItems,
      message: "does not meet maximum length of " + schema.maxItems,
    });
  }
  return result;
};

/**
 * Validates that every item in an instance array is unique, when instance is an array
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {String|null|ValidatorResult}
 */
validators.uniqueItems = function validateUniqueItems (instance, schema, options, ctx) {
  if (!this.types.array(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  function testArrays (v, i, a) {
    for (var j = i + 1; j < a.length; j++) if (helpers.deepCompareStrict(v, a[j])) {
      return false;
    }
    return true;
  }
  if (!instance.every(testArrays)) {
    result.addError({
      name: 'uniqueItems',
      message: "contains duplicate item",
    });
  }
  return result;
};

/**
 * Deep compares arrays for duplicates
 * @param v
 * @param i
 * @param a
 * @private
 * @return {boolean}
 */
function testArrays (v, i, a) {
  var j, len = a.length;
  for (j = i + 1, len; j < len; j++) {
    if (helpers.deepCompareStrict(v, a[j])) {
      return false;
    }
  }
  return true;
}

/**
 * Validates whether there are no duplicates, when the instance is an Array.
 * @param instance
 * @return {String|null}
 */
validators.uniqueItems = function validateUniqueItems (instance, schema, options, ctx) {
  if (!this.types.array(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!instance.every(testArrays)) {
    result.addError({
      name: 'uniqueItems',
      message: "contains duplicate item",
    });
  }
  return result;
};

/**
 * Validate for the presence of dependency properties, if the instance is an object.
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {null|ValidatorResult}
 */
validators.dependencies = function validateDependencies (instance, schema, options, ctx) {
  if (!this.types.object(instance)) return;
  var result = new ValidatorResult(instance, schema, options, ctx);
  for (var property in schema.dependencies) {
    if (instance[property] === undefined) {
      continue;
    }
    var dep = schema.dependencies[property];
    var childContext = ctx.makeChild(dep, property);
    if (typeof dep == 'string') {
      dep = [dep];
    }
    if (Array.isArray(dep)) {
      dep.forEach(function (prop) {
        if (instance[prop] === undefined) {
          result.addError({
            // FIXME there's two different "dependencies" errors here with slightly different outputs
            // Can we make these the same? Or should we create different error types?
            name: 'dependencies',
            argument: childContext.propertyPath,
            message: "property " + prop + " not found, required by " + childContext.propertyPath,
          });
        }
      });
    } else {
      var res = this.validateSchema(instance, dep, options, childContext);
      if(result.instance !== res.instance) result.instance = res.instance;
      if (res && res.errors.length) {
        result.addError({
          name: 'dependencies',
          argument: childContext.propertyPath,
          message: "does not meet dependency required by " + childContext.propertyPath,
        });
        result.importErrors(res);
      }
    }
  }
  return result;
};

/**
 * Validates whether the instance value is one of the enumerated values.
 *
 * @param instance
 * @param schema
 * @return {ValidatorResult|null}
 */
validators['enum'] = function validateEnum (instance, schema, options, ctx) {
  if (instance === undefined) {
    return null;
  }
  if (!Array.isArray(schema['enum'])) {
    throw new SchemaError("enum expects an array", schema);
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!schema['enum'].some(helpers.deepCompareStrict.bind(null, instance))) {
    result.addError({
      name: 'enum',
      argument: schema['enum'],
      message: "is not one of enum values: " + schema['enum'].map(String).join(','),
    });
  }
  return result;
};

/**
 * Validates whether the instance exactly matches a given value
 *
 * @param instance
 * @param schema
 * @return {ValidatorResult|null}
 */
validators['const'] = function validateEnum (instance, schema, options, ctx) {
  if (instance === undefined) {
    return null;
  }
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (!helpers.deepCompareStrict(schema['const'], instance)) {
    result.addError({
      name: 'const',
      argument: schema['const'],
      message: "does not exactly match expected constant: " + schema['const'],
    });
  }
  return result;
};

/**
 * Validates whether the instance if of a prohibited type.
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @return {null|ValidatorResult}
 */
validators.not = validators.disallow = function validateNot (instance, schema, options, ctx) {
  var self = this;
  if(instance===undefined) return null;
  var result = new ValidatorResult(instance, schema, options, ctx);
  var notTypes = schema.not || schema.disallow;
  if(!notTypes) return null;
  if(!Array.isArray(notTypes)) notTypes=[notTypes];
  notTypes.forEach(function (type) {
    if (self.testType(instance, schema, options, ctx, type)) {
      var schemaId = type && type.id && ('<' + type.id + '>') || type;
      result.addError({
        name: 'not',
        argument: schemaId,
        message: "is of prohibited type " + schemaId,
      });
    }
  });
  return result;
};

module.exports = attribute;


/***/ }),

/***/ "../node_modules/jsonschema/lib/helpers.js":
/*!*************************************************!*\
  !*** ../node_modules/jsonschema/lib/helpers.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var uri = __webpack_require__(/*! url */ "../node_modules/url/url.js");

var ValidationError = exports.ValidationError = function ValidationError (message, instance, schema, propertyPath, name, argument) {
  if (propertyPath) {
    this.property = propertyPath;
  }
  if (message) {
    this.message = message;
  }
  if (schema) {
    if (schema.id) {
      this.schema = schema.id;
    } else {
      this.schema = schema;
    }
  }
  if (instance) {
    this.instance = instance;
  }
  this.name = name;
  this.argument = argument;
  this.stack = this.toString();
};

ValidationError.prototype.toString = function toString() {
  return this.property + ' ' + this.message;
};

var ValidatorResult = exports.ValidatorResult = function ValidatorResult(instance, schema, options, ctx) {
  this.instance = instance;
  this.schema = schema;
  this.propertyPath = ctx.propertyPath;
  this.errors = [];
  this.throwError = options && options.throwError;
  this.disableFormat = options && options.disableFormat === true;
};

ValidatorResult.prototype.addError = function addError(detail) {
  var err;
  if (typeof detail == 'string') {
    err = new ValidationError(detail, this.instance, this.schema, this.propertyPath);
  } else {
    if (!detail) throw new Error('Missing error detail');
    if (!detail.message) throw new Error('Missing error message');
    if (!detail.name) throw new Error('Missing validator type');
    err = new ValidationError(detail.message, this.instance, this.schema, this.propertyPath, detail.name, detail.argument);
  }

  if (this.throwError) {
    throw err;
  }
  this.errors.push(err);
  return err;
};

ValidatorResult.prototype.importErrors = function importErrors(res) {
  if (typeof res == 'string' || (res && res.validatorType)) {
    this.addError(res);
  } else if (res && res.errors) {
    Array.prototype.push.apply(this.errors, res.errors);
  }
};

function stringizer (v,i){
  return i+': '+v.toString()+'\n';
}
ValidatorResult.prototype.toString = function toString(res) {
  return this.errors.map(stringizer).join('');
};

Object.defineProperty(ValidatorResult.prototype, "valid", { get: function() {
  return !this.errors.length;
} });

/**
 * Describes a problem with a Schema which prevents validation of an instance
 * @name SchemaError
 * @constructor
 */
var SchemaError = exports.SchemaError = function SchemaError (msg, schema) {
  this.message = msg;
  this.schema = schema;
  Error.call(this, msg);
  Error.captureStackTrace(this, SchemaError);
};
SchemaError.prototype = Object.create(Error.prototype,
  { constructor: {value: SchemaError, enumerable: false}
  , name: {value: 'SchemaError', enumerable: false}
  });

var SchemaContext = exports.SchemaContext = function SchemaContext (schema, options, propertyPath, base, schemas) {
  this.schema = schema;
  this.options = options;
  this.propertyPath = propertyPath;
  this.base = base;
  this.schemas = schemas;
};

SchemaContext.prototype.resolve = function resolve (target) {
  return uri.resolve(this.base, target);
};

SchemaContext.prototype.makeChild = function makeChild(schema, propertyName){
  var propertyPath = (propertyName===undefined) ? this.propertyPath : this.propertyPath+makeSuffix(propertyName);
  var base = uri.resolve(this.base, schema.id||'');
  var ctx = new SchemaContext(schema, this.options, propertyPath, base, Object.create(this.schemas));
  if(schema.id && !ctx.schemas[base]){
    ctx.schemas[base] = schema;
  }
  return ctx;
}

var FORMAT_REGEXPS = exports.FORMAT_REGEXPS = {
  'date-time': /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
  'date': /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
  'time': /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,

  'email': /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
  'ip-address': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  'ipv6': /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
  'uri': /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,

  'color': /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,

  // hostname regex from: http://stackoverflow.com/a/1420225/5628
  'hostname': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
  'host-name': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,

  'alpha': /^[a-zA-Z]+$/,
  'alphanumeric': /^[a-zA-Z0-9]+$/,
  'utc-millisec': function (input) {
    return (typeof input === 'string') && parseFloat(input) === parseInt(input, 10) && !isNaN(input);
  },
  'regex': function (input) {
    var result = true;
    try {
      new RegExp(input);
    } catch (e) {
      result = false;
    }
    return result;
  },
  'style': /\s*(.+?):\s*([^;]+);?/g,
  'phone': /^\+(?:[0-9] ?){6,14}[0-9]$/
};

FORMAT_REGEXPS.regexp = FORMAT_REGEXPS.regex;
FORMAT_REGEXPS.pattern = FORMAT_REGEXPS.regex;
FORMAT_REGEXPS.ipv4 = FORMAT_REGEXPS['ip-address'];

exports.isFormat = function isFormat (input, format, validator) {
  if (typeof input === 'string' && FORMAT_REGEXPS[format] !== undefined) {
    if (FORMAT_REGEXPS[format] instanceof RegExp) {
      return FORMAT_REGEXPS[format].test(input);
    }
    if (typeof FORMAT_REGEXPS[format] === 'function') {
      return FORMAT_REGEXPS[format](input);
    }
  } else if (validator && validator.customFormats &&
      typeof validator.customFormats[format] === 'function') {
    return validator.customFormats[format](input);
  }
  return true;
};

var makeSuffix = exports.makeSuffix = function makeSuffix (key) {
  key = key.toString();
  // This function could be capable of outputting valid a ECMAScript string, but the
  // resulting code for testing which form to use would be tens of thousands of characters long
  // That means this will use the name form for some illegal forms
  if (!key.match(/[.\s\[\]]/) && !key.match(/^[\d]/)) {
    return '.' + key;
  }
  if (key.match(/^\d+$/)) {
    return '[' + key + ']';
  }
  return '[' + JSON.stringify(key) + ']';
};

exports.deepCompareStrict = function deepCompareStrict (a, b) {
  if (typeof a !== typeof b) {
    return false;
  }
  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    return a.every(function (v, i) {
      return deepCompareStrict(a[i], b[i]);
    });
  }
  if (typeof a === 'object') {
    if (!a || !b) {
      return a === b;
    }
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    return aKeys.every(function (v) {
      return deepCompareStrict(a[v], b[v]);
    });
  }
  return a === b;
};

function deepMerger (target, dst, e, i) {
  if (typeof e === 'object') {
    dst[i] = deepMerge(target[i], e)
  } else {
    if (target.indexOf(e) === -1) {
      dst.push(e)
    }
  }
}

function copyist (src, dst, key) {
  dst[key] = src[key];
}

function copyistWithDeepMerge (target, src, dst, key) {
  if (typeof src[key] !== 'object' || !src[key]) {
    dst[key] = src[key];
  }
  else {
    if (!target[key]) {
      dst[key] = src[key];
    } else {
      dst[key] = deepMerge(target[key], src[key])
    }
  }
}

function deepMerge (target, src) {
  var array = Array.isArray(src);
  var dst = array && [] || {};

  if (array) {
    target = target || [];
    dst = dst.concat(target);
    src.forEach(deepMerger.bind(null, target, dst));
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(copyist.bind(null, target, dst));
    }
    Object.keys(src).forEach(copyistWithDeepMerge.bind(null, target, src, dst));
  }

  return dst;
};

module.exports.deepMerge = deepMerge;

/**
 * Validates instance against the provided schema
 * Implements URI+JSON Pointer encoding, e.g. "%7e"="~0"=>"~", "~1"="%2f"=>"/"
 * @param o
 * @param s The path to walk o along
 * @return any
 */
exports.objectGetPath = function objectGetPath(o, s) {
  var parts = s.split('/').slice(1);
  var k;
  while (typeof (k=parts.shift()) == 'string') {
    var n = decodeURIComponent(k.replace(/~0/,'~').replace(/~1/g,'/'));
    if (!(n in o)) return;
    o = o[n];
  }
  return o;
};

function pathEncoder (v) {
  return '/'+encodeURIComponent(v).replace(/~/g,'%7E');
}
/**
 * Accept an Array of property names and return a JSON Pointer URI fragment
 * @param Array a
 * @return {String}
 */
exports.encodePath = function encodePointer(a){
	// ~ must be encoded explicitly because hacks
	// the slash is encoded by encodeURIComponent
	return a.map(pathEncoder).join('');
};


/**
 * Calculate the number of decimal places a number uses
 * We need this to get correct results out of multipleOf and divisibleBy
 * when either figure is has decimal places, due to IEEE-754 float issues.
 * @param number
 * @returns {number}
 */
exports.getDecimalPlaces = function getDecimalPlaces(number) {

  var decimalPlaces = 0;
  if (isNaN(number)) return decimalPlaces;

  if (typeof number !== 'number') {
    number = Number(number);
  }

  var parts = number.toString().split('e');
  if (parts.length === 2) {
    if (parts[1][0] !== '-') {
      return decimalPlaces;
    } else {
      decimalPlaces = Number(parts[1].slice(1));
    }
  }

  var decimalParts = parts[0].split('.');
  if (decimalParts.length === 2) {
    decimalPlaces += decimalParts[1].length;
  }

  return decimalPlaces;
};



/***/ }),

/***/ "../node_modules/jsonschema/lib/index.js":
/*!***********************************************!*\
  !*** ../node_modules/jsonschema/lib/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Validator = module.exports.Validator = __webpack_require__(/*! ./validator */ "../node_modules/jsonschema/lib/validator.js");

module.exports.ValidatorResult = __webpack_require__(/*! ./helpers */ "../node_modules/jsonschema/lib/helpers.js").ValidatorResult;
module.exports.ValidationError = __webpack_require__(/*! ./helpers */ "../node_modules/jsonschema/lib/helpers.js").ValidationError;
module.exports.SchemaError = __webpack_require__(/*! ./helpers */ "../node_modules/jsonschema/lib/helpers.js").SchemaError;
module.exports.SchemaScanResult = __webpack_require__(/*! ./scan */ "../node_modules/jsonschema/lib/scan.js").SchemaScanResult;
module.exports.scan = __webpack_require__(/*! ./scan */ "../node_modules/jsonschema/lib/scan.js").scan;

module.exports.validate = function (instance, schema, options) {
  var v = new Validator();
  return v.validate(instance, schema, options);
};


/***/ }),

/***/ "../node_modules/jsonschema/lib/scan.js":
/*!**********************************************!*\
  !*** ../node_modules/jsonschema/lib/scan.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var urilib = __webpack_require__(/*! url */ "../node_modules/url/url.js");
var helpers = __webpack_require__(/*! ./helpers */ "../node_modules/jsonschema/lib/helpers.js");

module.exports.SchemaScanResult = SchemaScanResult;
function SchemaScanResult(found, ref){
  this.id = found;
  this.ref = ref;
}

/**
 * Adds a schema with a certain urn to the Validator instance.
 * @param string uri
 * @param object schema
 * @return {Object}
 */
module.exports.scan = function scan(base, schema){
  function scanSchema(baseuri, schema){
    if(!schema || typeof schema!='object') return;
    // Mark all referenced schemas so we can tell later which schemas are referred to, but never defined
    if(schema.$ref){
      var resolvedUri = urilib.resolve(baseuri, schema.$ref);
      ref[resolvedUri] = ref[resolvedUri] ? ref[resolvedUri]+1 : 0;
      return;
    }
    var ourBase = schema.id ? urilib.resolve(baseuri, schema.id) : baseuri;
    if (ourBase) {
      // If there's no fragment, append an empty one
      if(ourBase.indexOf('#')<0) ourBase += '#';
      if(found[ourBase]){
        if(!helpers.deepCompareStrict(found[ourBase], schema)){
          throw new Error('Schema <'+schema+'> already exists with different definition');
        }
        return found[ourBase];
      }
      found[ourBase] = schema;
      // strip trailing fragment
      if(ourBase[ourBase.length-1]=='#'){
        found[ourBase.substring(0, ourBase.length-1)] = schema;
      }
    }
    scanArray(ourBase+'/items', ((schema.items instanceof Array)?schema.items:[schema.items]));
    scanArray(ourBase+'/extends', ((schema.extends instanceof Array)?schema.extends:[schema.extends]));
    scanSchema(ourBase+'/additionalItems', schema.additionalItems);
    scanObject(ourBase+'/properties', schema.properties);
    scanSchema(ourBase+'/additionalProperties', schema.additionalProperties);
    scanObject(ourBase+'/definitions', schema.definitions);
    scanObject(ourBase+'/patternProperties', schema.patternProperties);
    scanObject(ourBase+'/dependencies', schema.dependencies);
    scanArray(ourBase+'/disallow', schema.disallow);
    scanArray(ourBase+'/allOf', schema.allOf);
    scanArray(ourBase+'/anyOf', schema.anyOf);
    scanArray(ourBase+'/oneOf', schema.oneOf);
    scanSchema(ourBase+'/not', schema.not);
  }
  function scanArray(baseuri, schemas){
    if(!(schemas instanceof Array)) return;
    for(var i=0; i<schemas.length; i++){
      scanSchema(baseuri+'/'+i, schemas[i]);
    }
  }
  function scanObject(baseuri, schemas){
    if(!schemas || typeof schemas!='object') return;
    for(var p in schemas){
      scanSchema(baseuri+'/'+p, schemas[p]);
    }
  }

  var found = {};
  var ref = {};
  var schemaUri = base;
  scanSchema(base, schema);
  return new SchemaScanResult(found, ref);
}


/***/ }),

/***/ "../node_modules/jsonschema/lib/validator.js":
/*!***************************************************!*\
  !*** ../node_modules/jsonschema/lib/validator.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var urilib = __webpack_require__(/*! url */ "../node_modules/url/url.js");

var attribute = __webpack_require__(/*! ./attribute */ "../node_modules/jsonschema/lib/attribute.js");
var helpers = __webpack_require__(/*! ./helpers */ "../node_modules/jsonschema/lib/helpers.js");
var scanSchema = __webpack_require__(/*! ./scan */ "../node_modules/jsonschema/lib/scan.js").scan;
var ValidatorResult = helpers.ValidatorResult;
var SchemaError = helpers.SchemaError;
var SchemaContext = helpers.SchemaContext;
//var anonymousBase = 'vnd.jsonschema:///';
var anonymousBase = '/';

/**
 * Creates a new Validator object
 * @name Validator
 * @constructor
 */
var Validator = function Validator () {
  // Allow a validator instance to override global custom formats or to have their
  // own custom formats.
  this.customFormats = Object.create(Validator.prototype.customFormats);
  this.schemas = {};
  this.unresolvedRefs = [];

  // Use Object.create to make this extensible without Validator instances stepping on each other's toes.
  this.types = Object.create(types);
  this.attributes = Object.create(attribute.validators);
};

// Allow formats to be registered globally.
Validator.prototype.customFormats = {};

// Hint at the presence of a property
Validator.prototype.schemas = null;
Validator.prototype.types = null;
Validator.prototype.attributes = null;
Validator.prototype.unresolvedRefs = null;

/**
 * Adds a schema with a certain urn to the Validator instance.
 * @param schema
 * @param urn
 * @return {Object}
 */
Validator.prototype.addSchema = function addSchema (schema, base) {
  var self = this;
  if (!schema) {
    return null;
  }
  var scan = scanSchema(base||anonymousBase, schema);
  var ourUri = base || schema.id;
  for(var uri in scan.id){
    this.schemas[uri] = scan.id[uri];
  }
  for(var uri in scan.ref){
    this.unresolvedRefs.push(uri);
  }
  this.unresolvedRefs = this.unresolvedRefs.filter(function(uri){
    return typeof self.schemas[uri]==='undefined';
  });
  return this.schemas[ourUri];
};

Validator.prototype.addSubSchemaArray = function addSubSchemaArray(baseuri, schemas) {
  if(!(schemas instanceof Array)) return;
  for(var i=0; i<schemas.length; i++){
    this.addSubSchema(baseuri, schemas[i]);
  }
};

Validator.prototype.addSubSchemaObject = function addSubSchemaArray(baseuri, schemas) {
  if(!schemas || typeof schemas!='object') return;
  for(var p in schemas){
    this.addSubSchema(baseuri, schemas[p]);
  }
};



/**
 * Sets all the schemas of the Validator instance.
 * @param schemas
 */
Validator.prototype.setSchemas = function setSchemas (schemas) {
  this.schemas = schemas;
};

/**
 * Returns the schema of a certain urn
 * @param urn
 */
Validator.prototype.getSchema = function getSchema (urn) {
  return this.schemas[urn];
};

/**
 * Validates instance against the provided schema
 * @param instance
 * @param schema
 * @param [options]
 * @param [ctx]
 * @return {Array}
 */
Validator.prototype.validate = function validate (instance, schema, options, ctx) {
  if (!options) {
    options = {};
  }
  var propertyName = options.propertyName || 'instance';
  // This will work so long as the function at uri.resolve() will resolve a relative URI to a relative URI
  var base = urilib.resolve(options.base||anonymousBase, schema.id||'');
  if(!ctx){
    ctx = new SchemaContext(schema, options, propertyName, base, Object.create(this.schemas));
    if (!ctx.schemas[base]) {
      ctx.schemas[base] = schema;
    }
    var found = scanSchema(base, schema);
    for(var n in found.id){
      var sch = found.id[n];
      ctx.schemas[n] = sch;
    }
  }
  if (schema) {
    var result = this.validateSchema(instance, schema, options, ctx);
    if (!result) {
      throw new Error('Result undefined');
    }
    return result;
  }
  throw new SchemaError('no schema specified', schema);
};

/**
* @param Object schema
* @return mixed schema uri or false
*/
function shouldResolve(schema) {
  var ref = (typeof schema === 'string') ? schema : schema.$ref;
  if (typeof ref=='string') return ref;
  return false;
}

/**
 * Validates an instance against the schema (the actual work horse)
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @private
 * @return {ValidatorResult}
 */
Validator.prototype.validateSchema = function validateSchema (instance, schema, options, ctx) {
  var result = new ValidatorResult(instance, schema, options, ctx);

    // Support for the true/false schemas
  if(typeof schema==='boolean') {
    if(schema===true){
      // `true` is always valid
      schema = {};
    }else if(schema===false){
      // `false` is always invalid
      schema = {type: []};
    }
  }else if(!schema){
    // This might be a string
    throw new Error("schema is undefined");
  }

  if (schema['extends']) {
    if (schema['extends'] instanceof Array) {
      var schemaobj = {schema: schema, ctx: ctx};
      schema['extends'].forEach(this.schemaTraverser.bind(this, schemaobj));
      schema = schemaobj.schema;
      schemaobj.schema = null;
      schemaobj.ctx = null;
      schemaobj = null;
    } else {
      schema = helpers.deepMerge(schema, this.superResolve(schema['extends'], ctx));
    }
  }

  // If passed a string argument, load that schema URI
  var switchSchema;
  if (switchSchema = shouldResolve(schema)) {
    var resolved = this.resolve(schema, switchSchema, ctx);
    var subctx = new SchemaContext(resolved.subschema, options, ctx.propertyPath, resolved.switchSchema, ctx.schemas);
    return this.validateSchema(instance, resolved.subschema, options, subctx);
  }

  var skipAttributes = options && options.skipAttributes || [];
  // Validate each schema attribute against the instance
  for (var key in schema) {
    if (!attribute.ignoreProperties[key] && skipAttributes.indexOf(key) < 0) {
      var validatorErr = null;
      var validator = this.attributes[key];
      if (validator) {
        validatorErr = validator.call(this, instance, schema, options, ctx);
      } else if (options.allowUnknownAttributes === false) {
        // This represents an error with the schema itself, not an invalid instance
        throw new SchemaError("Unsupported attribute: " + key, schema);
      }
      if (validatorErr) {
        result.importErrors(validatorErr);
      }
    }
  }

  if (typeof options.rewrite == 'function') {
    var value = options.rewrite.call(this, instance, schema, options, ctx);
    result.instance = value;
  }
  return result;
};

/**
* @private
* @param Object schema
* @param SchemaContext ctx
* @returns Object schema or resolved schema
*/
Validator.prototype.schemaTraverser = function schemaTraverser (schemaobj, s) {
  schemaobj.schema = helpers.deepMerge(schemaobj.schema, this.superResolve(s, schemaobj.ctx));
}

/**
* @private
* @param Object schema
* @param SchemaContext ctx
* @returns Object schema or resolved schema
*/
Validator.prototype.superResolve = function superResolve (schema, ctx) {
  var ref;
  if(ref = shouldResolve(schema)) {
    return this.resolve(schema, ref, ctx).subschema;
  }
  return schema;
}

/**
* @private
* @param Object schema
* @param Object switchSchema
* @param SchemaContext ctx
* @return Object resolved schemas {subschema:String, switchSchema: String}
* @throws SchemaError
*/
Validator.prototype.resolve = function resolve (schema, switchSchema, ctx) {
  switchSchema = ctx.resolve(switchSchema);
  // First see if the schema exists under the provided URI
  if (ctx.schemas[switchSchema]) {
    return {subschema: ctx.schemas[switchSchema], switchSchema: switchSchema};
  }
  // Else try walking the property pointer
  var parsed = urilib.parse(switchSchema);
  var fragment = parsed && parsed.hash;
  var document = fragment && fragment.length && switchSchema.substr(0, switchSchema.length - fragment.length);
  if (!document || !ctx.schemas[document]) {
    throw new SchemaError("no such schema <" + switchSchema + ">", schema);
  }
  var subschema = helpers.objectGetPath(ctx.schemas[document], fragment.substr(1));
  if(subschema===undefined){
    throw new SchemaError("no such schema " + fragment + " located in <" + document + ">", schema);
  }
  return {subschema: subschema, switchSchema: switchSchema};
};

/**
 * Tests whether the instance if of a certain type.
 * @private
 * @param instance
 * @param schema
 * @param options
 * @param ctx
 * @param type
 * @return {boolean}
 */
Validator.prototype.testType = function validateType (instance, schema, options, ctx, type) {
  if (typeof this.types[type] == 'function') {
    return this.types[type].call(this, instance);
  }
  if (type && typeof type == 'object') {
    var res = this.validateSchema(instance, type, options, ctx);
    return res === undefined || !(res && res.errors.length);
  }
  // Undefined or properties not on the list are acceptable, same as not being defined
  return true;
};

var types = Validator.prototype.types = {};
types.string = function testString (instance) {
  return typeof instance == 'string';
};
types.number = function testNumber (instance) {
  // isFinite returns false for NaN, Infinity, and -Infinity
  return typeof instance == 'number' && isFinite(instance);
};
types.integer = function testInteger (instance) {
  return (typeof instance == 'number') && instance % 1 === 0;
};
types.boolean = function testBoolean (instance) {
  return typeof instance == 'boolean';
};
types.array = function testArray (instance) {
  return Array.isArray(instance);
};
types['null'] = function testNull (instance) {
  return instance === null;
};
types.date = function testDate (instance) {
  return instance instanceof Date;
};
types.any = function testAny (instance) {
  return true;
};
types.object = function testObject (instance) {
  // TODO: fix this - see #15
  return instance && (typeof instance) === 'object' && !(instance instanceof Array) && !(instance instanceof Date);
};

module.exports = Validator;


/***/ }),

/***/ "../node_modules/object-assign/index.js":
/*!**********************************************!*\
  !*** ../node_modules/object-assign/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "../node_modules/punycode/punycode.js":
/*!********************************************!*\
  !*** ../node_modules/punycode/punycode.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(this));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "../node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../webpack/buildin/global.js */ "../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/query-string/index.js":
/*!*********************************************!*\
  !*** ../node_modules/query-string/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(/*! strict-uri-encode */ "../node_modules/strict-uri-encode/index.js");
var objectAssign = __webpack_require__(/*! object-assign */ "../node_modules/object-assign/index.js");
var decodeComponent = __webpack_require__(/*! decode-uri-component */ "../node_modules/decode-uri-component/index.js");

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

function extract(str) {
	var queryStart = str.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return str.slice(queryStart + 1);
}

function parse(str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^[?#&]/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeComponent(val);

		formatter(decodeComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	if (opts.sort === false) {
		opts.sort = function () {};
	}

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort(opts.sort).map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

exports.parseUrl = function (str, opts) {
	return {
		url: str.split('?')[0] || '',
		query: parse(extract(str), opts)
	};
};


/***/ }),

/***/ "../node_modules/querystring-es3/decode.js":
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/decode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "../node_modules/querystring-es3/encode.js":
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/encode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "../node_modules/querystring-es3/index.js":
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "../node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "../node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "../node_modules/strict-uri-encode/index.js":
/*!**************************************************!*\
  !*** ../node_modules/strict-uri-encode/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),

/***/ "../node_modules/url/url.js":
/*!**********************************!*\
  !*** ../node_modules/url/url.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(/*! punycode */ "../node_modules/punycode/punycode.js");
var util = __webpack_require__(/*! ./util */ "../node_modules/url/util.js");

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(/*! querystring */ "../node_modules/querystring-es3/index.js");

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),

/***/ "../node_modules/url/util.js":
/*!***********************************!*\
  !*** ../node_modules/url/util.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../node_modules/webpack/buildin/module.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/module.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./accumulatepass.ts":
/*!***************************!*\
  !*** ./accumulatepass.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var changelookup_1 = __webpack_require__(/*! ./changelookup */ "./changelookup.ts");
var framebuffer_1 = __webpack_require__(/*! ./framebuffer */ "./framebuffer.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var ndcfillingtriangle_1 = __webpack_require__(/*! ./ndcfillingtriangle */ "./ndcfillingtriangle.ts");
var program_1 = __webpack_require__(/*! ./program */ "./program.ts");
var shader_1 = __webpack_require__(/*! ./shader */ "./shader.ts");
var texture2_1 = __webpack_require__(/*! ./texture2 */ "./texture2.ts");
var wizard_1 = __webpack_require__(/*! ./wizard */ "./wizard.ts");
var AccumulatePass = (function (_super) {
    __extends(AccumulatePass, _super);
    function AccumulatePass(context) {
        var _this = _super.call(this) || this;
        _this._altered = Object.assign(new changelookup_1.ChangeLookup(), {
            any: false, texture: false, precision: false, passThrough: false,
        });
        _this._precision = wizard_1.Wizard.Precision.half;
        _this._write = 0;
        _this._ndcTriangleShared = false;
        _this._context = context;
        return _this;
    }
    AccumulatePass.prototype.initialize = function (ndcTriangle) {
        var gl = this._context.gl;
        this._accumulationFBOs = [
            new framebuffer_1.Framebuffer(this._context, 'AccumPingFBO'),
            new framebuffer_1.Framebuffer(this._context, 'AccumPongFBO')
        ];
        this._accumulationTextures = [
            new texture2_1.Texture2(this._context, 'AccumPingTexture'),
            new texture2_1.Texture2(this._context, 'AccumPongTexture')
        ];
        var vert = new shader_1.Shader(this._context, gl.VERTEX_SHADER, 'ndcvertices.vert (accumulate)');
        vert.initialize(__webpack_require__(/*! ./shaders/ndcvertices.vert */ "./shaders/ndcvertices.vert"));
        var frag = new shader_1.Shader(this._context, gl.FRAGMENT_SHADER, 'accumulate.frag');
        frag.initialize(__webpack_require__(/*! ./shaders/accumulate.frag */ "./shaders/accumulate.frag"));
        this._program = new program_1.Program(this._context, 'AccumulateProgram');
        this._program.initialize([vert, frag]);
        this._uWeight = this._program.uniform('u_weight');
        this._program.bind();
        gl.uniform1f(this._uWeight, 0.0);
        gl.uniform1i(this._program.uniform('u_accumulationTexture'), 0);
        gl.uniform1i(this._program.uniform('u_currentFrameTexture'), 1);
        this._program.unbind();
        if (ndcTriangle === undefined) {
            this._ndcTriangle = new ndcfillingtriangle_1.NdcFillingTriangle(this._context);
        }
        else {
            this._ndcTriangle = ndcTriangle;
            this._ndcTriangleShared = true;
        }
        if (!this._ndcTriangle.initialized) {
            var aVertex = this._program.attribute('a_vertex', 0);
            this._ndcTriangle.initialize(aVertex);
        }
        else {
            this._program.attribute('a_vertex', this._ndcTriangle.aVertex);
        }
        return true;
    };
    AccumulatePass.prototype.uninitialize = function () {
        if (!this._ndcTriangleShared && this._ndcTriangle.initialized) {
            this._ndcTriangle.uninitialize();
        }
        this._program.uninitialize();
        this._accumulationFBOs[0].uninitialize();
        this._accumulationFBOs[1].uninitialize();
        this._accumulationTextures[0].uninitialize();
        this._accumulationTextures[1].uninitialize();
        this._write = 0;
    };
    AccumulatePass.prototype.update = function () {
        if (!this._texture || !this._texture.valid) {
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "valid texture for accumulation update expected, given " + this._texture);
            return;
        }
        if (this._passThrough) {
            return;
        }
        var sizeAltered = this._altered.texture || this._accumulationTextures[0].width !== this._texture.width ||
            this._accumulationTextures[0].height !== this._texture.height;
        if (!this._altered.any && !sizeAltered) {
            auxiliaries_1.assert(this._accumulationFBOs[0].valid && this._accumulationFBOs[1].valid, "valid accumulation framebuffers expected");
            return;
        }
        var gl = this._context.gl;
        var gl2facade = this._context.gl2facade;
        var textureSize = this._texture.size;
        if (!this._accumulationTextures[0].initialized) {
            var internalFormat = wizard_1.Wizard.queryInternalTextureFormat(this._context, gl.RGBA, this._precision);
            this._accumulationTextures[0].initialize(textureSize[0], textureSize[1], internalFormat[0], gl.RGBA, internalFormat[1]);
            this._accumulationTextures[1].initialize(textureSize[0], textureSize[1], internalFormat[0], gl.RGBA, internalFormat[1]);
        }
        else {
            if (this._altered.texture || sizeAltered) {
                this._accumulationTextures[0].resize(this._texture.width, this._texture.height);
                this._accumulationTextures[1].resize(this._texture.width, this._texture.height);
            }
            if (this._altered.precision) {
                var internalFormat = wizard_1.Wizard.queryInternalTextureFormat(this._context, gl.RGBA, this._precision);
                this._accumulationTextures[0].reformat(internalFormat[0], gl.RGBA, internalFormat[1]);
                this._accumulationTextures[1].reformat(internalFormat[0], gl.RGBA, internalFormat[1]);
            }
        }
        if (!this._accumulationFBOs[0].initialized) {
            this._accumulationFBOs[0].initialize([[gl2facade.COLOR_ATTACHMENT0, this._accumulationTextures[0]]]);
            this._accumulationFBOs[1].initialize([[gl2facade.COLOR_ATTACHMENT0, this._accumulationTextures[1]]]);
        }
        auxiliaries_1.assert(this._accumulationFBOs[0].valid && this._accumulationFBOs[1].valid, "valid accumulation framebuffers expected");
        this._altered.reset();
    };
    AccumulatePass.prototype.frame = function (frameNumber, viewport) {
        auxiliaries_1.assert(this._accumulationFBOs[0].valid && this._accumulationFBOs[1].valid, "valid framebuffer objects for accumulation expected (initialize or update was probably not be called");
        if (this._passThrough || this._texture === undefined) {
            return;
        }
        auxiliaries_1.logIf(!this._texture || !this._texture.valid, auxiliaries_1.LogLevel.Dev, "valid texture for accumulation frame expected, given " + this._texture);
        var gl = this._context.gl;
        if (viewport !== undefined) {
            gl.viewport(0, 0, viewport[0], viewport[1]);
        }
        var readIndex = frameNumber % 2;
        var writeIndex = this._write = 1 - readIndex;
        var accumTexture = this._accumulationTextures[readIndex];
        var frameTexture = this._texture;
        accumTexture.bind(gl.TEXTURE0);
        frameTexture.bind(gl.TEXTURE1);
        this._program.bind();
        gl.uniform1f(this._uWeight, 1.0 / (frameNumber + 1));
        this._accumulationFBOs[writeIndex].bind(gl.DRAW_FRAMEBUFFER);
        this._ndcTriangle.bind();
        this._ndcTriangle.draw();
        this._ndcTriangle.unbind();
        this._accumulationFBOs[writeIndex].unbind(gl.DRAW_FRAMEBUFFER);
        accumTexture.unbind(gl.TEXTURE0);
        frameTexture.unbind(gl.TEXTURE1);
    };
    Object.defineProperty(AccumulatePass.prototype, "texture", {
        set: function (texture) {
            this.assertInitialized();
            if (this._texture !== texture) {
                this._texture = texture;
                this._altered.alter('texture');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccumulatePass.prototype, "precision", {
        set: function (precision) {
            this.assertInitialized();
            if (this._precision !== precision) {
                this._precision = precision;
                this._altered.alter('precision');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccumulatePass.prototype, "passThrough", {
        set: function (passThrough) {
            this.assertInitialized();
            if (this._passThrough === passThrough) {
                return;
            }
            if (this._passThrough && this._accumulationTextures[0].initialized) {
                this._accumulationTextures[0].uninitialize();
                this._accumulationTextures[1].uninitialize();
            }
            if (this._passThrough && this._accumulationFBOs[0].initialized) {
                this._accumulationFBOs[0].uninitialize();
                this._accumulationFBOs[1].uninitialize();
            }
            this._passThrough = passThrough;
            this._altered.alter('passThrough');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccumulatePass.prototype, "framebuffer", {
        get: function () {
            return this._passThrough ? undefined : this._accumulationFBOs[this._write];
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        initializable_1.Initializable.initialize()
    ], AccumulatePass.prototype, "initialize", null);
    __decorate([
        initializable_1.Initializable.uninitialize()
    ], AccumulatePass.prototype, "uninitialize", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], AccumulatePass.prototype, "update", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], AccumulatePass.prototype, "frame", null);
    return AccumulatePass;
}(initializable_1.Initializable));
exports.AccumulatePass = AccumulatePass;


/***/ }),

/***/ "./allocationregister.ts":
/*!*******************************!*\
  !*** ./allocationregister.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = __webpack_require__(/*! rxjs/ReplaySubject */ "rxjs/ReplaySubject");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var AllocationRegister = (function () {
    function AllocationRegister() {
        this._bytesByIdentifier = new Map();
        this._bytes = 0;
        this._bytesSubject = new ReplaySubject_1.ReplaySubject(1);
    }
    AllocationRegister.prototype.bytesNext = function () {
        this._bytesSubject.next([this._bytes, this.bytesToString()]);
    };
    AllocationRegister.prototype.assertIdentifier = function (identifier) {
        auxiliaries_1.assert(this._bytesByIdentifier.has(identifier), "allocation identifier unknown");
    };
    AllocationRegister.prototype.createUniqueIdentifier = function (identifier) {
        var uniqueIdentifier = identifier;
        var unificationSuffix = 2;
        while (this._bytesByIdentifier.has(uniqueIdentifier)) {
            uniqueIdentifier = identifier + "-" + unificationSuffix;
            ++unificationSuffix;
        }
        this._bytesByIdentifier.set(uniqueIdentifier, 0);
        return uniqueIdentifier;
    };
    AllocationRegister.prototype.deleteUniqueIdentifier = function (identifier) {
        auxiliaries_1.assert(this._bytesByIdentifier.has(identifier), "identifier expected to be known for allocation registration");
        this._bytesByIdentifier.delete(identifier);
    };
    AllocationRegister.prototype.allocate = function (identifier, allocate) {
        this.assertIdentifier(identifier);
        auxiliaries_1.assert(allocate >= 0, "positive number of bytes expected for allocation, given " + allocate);
        if (allocate === 0) {
            return;
        }
        var bytes = (this._bytesByIdentifier.get(identifier)) + allocate;
        this._bytesByIdentifier.set(identifier, bytes);
        this._bytes = this._bytes + allocate;
        this.bytesNext();
    };
    AllocationRegister.prototype.deallocate = function (identifier, deallocate) {
        this.assertIdentifier(identifier);
        var bytes = this._bytesByIdentifier.get(identifier);
        auxiliaries_1.assert(deallocate >= 0, "positive number of bytes expected for deallocation, given " + deallocate);
        auxiliaries_1.assert(deallocate <= bytes, "deallocation cannot exceed previous allocations of " + bytes + ", given " + deallocate);
        if (deallocate === 0) {
            return;
        }
        this._bytesByIdentifier.set(identifier, bytes - deallocate);
        this._bytes = this._bytes - deallocate;
        this.bytesNext();
    };
    AllocationRegister.prototype.reallocate = function (identifier, reallocate) {
        this.assertIdentifier(identifier);
        auxiliaries_1.assert(reallocate >= 0, "positive number of bytes expected for reallocation, given " + reallocate);
        var previousBytes = this._bytesByIdentifier.get(identifier);
        if (previousBytes === reallocate) {
            return;
        }
        this._bytes = this._bytes - previousBytes;
        this._bytesByIdentifier.set(identifier, reallocate);
        this._bytes = this._bytes + reallocate;
        this.bytesNext();
    };
    AllocationRegister.prototype.allocated = function (identifier) {
        if (identifier === undefined) {
            return this._bytes;
        }
        this.assertIdentifier(identifier);
        return this._bytesByIdentifier.get(identifier);
    };
    AllocationRegister.prototype.toString = function () {
        var output = new Array();
        this._bytesByIdentifier.forEach(function (bytes, identifier) {
            output.push(identifier + ": " + auxiliaries_1.prettyPrintBytes(bytes));
        });
        return output.join(', ');
    };
    AllocationRegister.prototype.bytesToString = function (identifier) {
        return auxiliaries_1.prettyPrintBytes(this.allocated(identifier));
    };
    Object.defineProperty(AllocationRegister.prototype, "bytes", {
        get: function () {
            return this._bytes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AllocationRegister.prototype, "bytesObservable", {
        get: function () {
            return this._bytesSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    return AllocationRegister;
}());
exports.AllocationRegister = AllocationRegister;


/***/ }),

/***/ "./antialiasingkernel.ts":
/*!*******************************!*\
  !*** ./antialiasingkernel.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var randomsquarekernel_1 = __webpack_require__(/*! ./randomsquarekernel */ "./randomsquarekernel.ts");
var AntiAliasingKernel = (function (_super) {
    __extends(AntiAliasingKernel, _super);
    function AntiAliasingKernel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AntiAliasingKernel.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (width) {
            if (this._width === width) {
                return;
            }
            this._width = width;
            switch (this._width) {
                case 8:
                    this.fromJSON(__webpack_require__(/*! ./data/goldenset08.json */ "./data/goldenset08.json"));
                    break;
                case 64:
                    this.fromJSON(__webpack_require__(/*! ./data/goldenset64.json */ "./data/goldenset64.json"));
                    break;
                default:
                    this.resize();
                    this.generate();
            }
        },
        enumerable: true,
        configurable: true
    });
    return AntiAliasingKernel;
}(randomsquarekernel_1.RandomSquareKernel));
exports.AntiAliasingKernel = AntiAliasingKernel;


/***/ }),

/***/ "./auxiliaries.ts":
/*!************************!*\
  !*** ./auxiliaries.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var query_string_1 = __webpack_require__(/*! query-string */ "../node_modules/query-string/index.js");
var auxiliaries;
(function (auxiliaries) {
    var disableAssertions;
    try {
        disableAssertions = false;
    }
    catch (error) {
        disableAssertions = false;
    }
    var logVerbosityThreshold;
    try {
        logVerbosityThreshold = 2;
    }
    catch (error) {
        logVerbosityThreshold = 2;
    }
    function logVerbosity(verbosity) {
        if (verbosity !== undefined) {
            logVerbosityThreshold = Math.max(-1, verbosity);
        }
        return logVerbosityThreshold;
    }
    auxiliaries.logVerbosity = logVerbosity;
    function assertions(enable) {
        if (enable) {
            disableAssertions = !enable;
        }
        return disableAssertions;
    }
    auxiliaries.assertions = assertions;
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["User"] = 0] = "User";
        LogLevel[LogLevel["Dev"] = 1] = "Dev";
        LogLevel[LogLevel["ModuleDev"] = 2] = "ModuleDev";
    })(LogLevel = auxiliaries.LogLevel || (auxiliaries.LogLevel = {}));
    function assert(expression, message) {
        if (disableAssertions || expression) {
            return;
        }
        throw new EvalError(message);
    }
    auxiliaries.assert = assert;
    function log(verbosity, message) {
        if (verbosity > logVerbosityThreshold) {
            return;
        }
        console.log("[" + verbosity + "] " + message);
    }
    auxiliaries.log = log;
    function logIf(expression, verbosity, message) {
        if (!expression) {
            return;
        }
        log(verbosity, message);
    }
    auxiliaries.logIf = logIf;
    function rand(min, max) {
        if (min === void 0) { min = 0.0; }
        if (max === void 0) { max = 1.0; }
        return Math.random() * (max - min) + min;
    }
    auxiliaries.rand = rand;
    var prefixes = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi'];
    function prettyPrintBytes(bytes) {
        var prefix = bytes > 0 ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;
        var prefixedBytes = bytes / Math.pow(1024, prefix);
        return "" + (prefix > 0 ? prefixedBytes.toFixed(3) : prefixedBytes) + prefixes[prefix] + "B";
    }
    auxiliaries.prettyPrintBytes = prettyPrintBytes;
    function bitInBitfield(flags, flag) {
        if (flag === undefined) {
            return false;
        }
        return (flags & flag) === flag;
    }
    auxiliaries.bitInBitfield = bitInBitfield;
    auxiliaries.RAD2DEG = 57.295779513082320;
    auxiliaries.DEG2RAD = 0.017453292519943295;
    function GETsearch() {
        return window.location.search;
    }
    auxiliaries.GETsearch = GETsearch;
    function GETparameter(parameter) {
        var params = query_string_1.parse(GETsearch());
        return params[parameter];
    }
    auxiliaries.GETparameter = GETparameter;
})(auxiliaries || (auxiliaries = {}));
module.exports = auxiliaries;


/***/ }),

/***/ "./blitpass.ts":
/*!*********************!*\
  !*** ./blitpass.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var ndcfillingtriangle_1 = __webpack_require__(/*! ./ndcfillingtriangle */ "./ndcfillingtriangle.ts");
var program_1 = __webpack_require__(/*! ./program */ "./program.ts");
var shader_1 = __webpack_require__(/*! ./shader */ "./shader.ts");
var BlitPass = (function (_super) {
    __extends(BlitPass, _super);
    function BlitPass(context) {
        var _this = _super.call(this) || this;
        _this._ndcTriangleShared = false;
        _this._context = context;
        return _this;
    }
    BlitPass.prototype.functionBlit = function () {
        var gl = this._context.gl;
        this._target.bind(gl.DRAW_FRAMEBUFFER);
        this._framebuffer.bind(gl.READ_FRAMEBUFFER);
        gl.readBuffer(this._readBuffer);
        gl.drawBuffers([this._drawBuffer]);
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);
        gl.blitFramebuffer(0, 0, this._framebuffer.width, this._framebuffer.height, 0, 0, this._target.width, this._target.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        this._framebuffer.unbind(gl.READ_FRAMEBUFFER);
        this._target.unbind(gl.DRAW_FRAMEBUFFER);
    };
    BlitPass.prototype.programBlit = function () {
        auxiliaries_1.assert(this._ndcTriangle && this._ndcTriangle.initialized, "expected an initialized ndc triangle");
        var gl = this._context.gl;
        gl.viewport(0, 0, this._target.width, this._target.height);
        this._program.bind();
        var texture = this._framebuffer.texture(this._readBuffer);
        texture.bind(gl.TEXTURE0);
        var target = this._context.isWebGL2 ? gl.DRAW_FRAMEBUFFER : gl.FRAMEBUFFER;
        this._target.bind(target);
        this._ndcTriangle.bind();
        this._ndcTriangle.draw();
        this._ndcTriangle.unbind();
        this._target.unbind(target);
        texture.unbind();
    };
    BlitPass.prototype.initialize = function (ndcTriangle) {
        var gl = this._context.gl;
        var vert = new shader_1.Shader(this._context, gl.VERTEX_SHADER, 'ndcvertices.vert (blit)');
        vert.initialize(__webpack_require__(/*! ./shaders/ndcvertices.vert */ "./shaders/ndcvertices.vert"));
        var frag = new shader_1.Shader(this._context, gl.FRAGMENT_SHADER, 'blit.frag');
        frag.initialize(__webpack_require__(/*! ./shaders/blit.frag */ "./shaders/blit.frag"));
        this._program = new program_1.Program(this._context, 'BlitProgram');
        this._program.initialize([vert, frag]);
        this._program.bind();
        gl.uniform1i(this._program.uniform('u_texture'), 0);
        this._program.unbind();
        if (ndcTriangle === undefined) {
            this._ndcTriangle = new ndcfillingtriangle_1.NdcFillingTriangle(this._context);
        }
        else {
            this._ndcTriangle = ndcTriangle;
            this._ndcTriangleShared = true;
        }
        if (!this._ndcTriangle.initialized) {
            var aVertex = this._program.attribute('a_vertex', 0);
            this._ndcTriangle.initialize(aVertex);
        }
        else {
            this._program.attribute('a_vertex', this._ndcTriangle.aVertex);
        }
        return true;
    };
    BlitPass.prototype.uninitialize = function () {
        if (!this._ndcTriangleShared && this._ndcTriangle.initialized) {
            this._ndcTriangle.uninitialize();
        }
        this._program.uninitialize();
    };
    BlitPass.prototype.frame = function () {
        auxiliaries_1.logIf(!this._target || !this._target.valid, auxiliaries_1.LogLevel.Dev, "valid target expected, given " + this._target);
        auxiliaries_1.logIf(!this._framebuffer || !this._framebuffer.valid, auxiliaries_1.LogLevel.Dev, "valid framebuffer for blitting from expected, given " + this._framebuffer);
        var gl = this._context.gl;
        switch (this._readBuffer) {
            case gl.DEPTH_ATTACHMENT:
            case gl.STENCIL_ATTACHMENT:
            case gl.DEPTH_STENCIL_ATTACHMENT:
                return this.programBlit();
            default:
                break;
        }
        if (this._context.supportsBlitFramebuffer) {
            return this.functionBlit();
        }
        this.programBlit();
    };
    Object.defineProperty(BlitPass.prototype, "framebuffer", {
        set: function (framebuffer) {
            this.assertInitialized();
            this._framebuffer = framebuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlitPass.prototype, "readBuffer", {
        set: function (readBuffer) {
            this.assertInitialized();
            this._readBuffer = readBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlitPass.prototype, "drawBuffer", {
        set: function (drawBuffer) {
            this.assertInitialized();
            this._drawBuffer = drawBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlitPass.prototype, "target", {
        set: function (target) {
            this.assertInitialized();
            this._target = target;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        initializable_1.Initializable.initialize()
    ], BlitPass.prototype, "initialize", null);
    __decorate([
        initializable_1.Initializable.uninitialize()
    ], BlitPass.prototype, "uninitialize", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], BlitPass.prototype, "frame", null);
    return BlitPass;
}(initializable_1.Initializable));
exports.BlitPass = BlitPass;


/***/ }),

/***/ "./buffer.ts":
/*!*******************!*\
  !*** ./buffer.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var Buffer = (function (_super) {
    __extends(Buffer, _super);
    function Buffer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._target = Buffer.DEFAULT_BUFFER;
        return _this;
    }
    Buffer.prototype.create = function (target) {
        var gl = this._context.gl;
        this._object = gl.createBuffer();
        this._valid = this._object instanceof WebGLBuffer;
        if (this._valid) {
            auxiliaries_1.assert(target === gl.ARRAY_BUFFER || target === gl.ELEMENT_ARRAY_BUFFER, "either ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER expected as buffer target");
            this._target = target;
        }
        return this._object;
    };
    Buffer.prototype.delete = function () {
        auxiliaries_1.assert(this._object instanceof WebGLBuffer, "expected WebGLBuffer object");
        this._context.gl.deleteBuffer(this._object);
        this._object = undefined;
        this._valid = false;
        this._target = Buffer.DEFAULT_BUFFER;
    };
    Buffer.prototype.bind = function () {
        auxiliaries_1.assert(this._target === this._context.gl.ARRAY_BUFFER || this._target === this._context.gl.ELEMENT_ARRAY_BUFFER, "expected either ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER as buffer target");
        this._context.gl.bindBuffer(this._target, this._object);
    };
    Buffer.prototype.unbind = function () {
        this.context.gl.bindBuffer(this._target, Buffer.DEFAULT_BUFFER);
    };
    Buffer.prototype.data = function (data, usage, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.bufferData(this._target, data, usage);
        if (unbind) {
            this.unbind();
        }
        this._valid = gl.isBuffer(this._object) && gl.getError() === gl.NO_ERROR;
        var bytes = this._valid ? data.byteLength : 0;
        this.context.allocationRegister.reallocate(this._identifier, bytes);
    };
    Buffer.prototype.attribEnable = function (index, size, type, normalized, stride, offset, bind, unbind) {
        if (normalized === void 0) { normalized = false; }
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
        gl.enableVertexAttribArray(index);
        if (unbind) {
            this.unbind();
        }
    };
    Buffer.prototype.attribDisable = function (index, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.disableVertexAttribArray(index);
        if (unbind) {
            this.unbind();
        }
    };
    Object.defineProperty(Buffer.prototype, "bytes", {
        get: function () {
            this.assertInitialized();
            return this.context.allocationRegister.allocated(this._identifier);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "target", {
        get: function () {
            this.assertInitialized();
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Buffer.DEFAULT_BUFFER = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Buffer.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Buffer.prototype, "unbind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Buffer.prototype, "data", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Buffer.prototype, "attribEnable", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Buffer.prototype, "attribDisable", null);
    return Buffer;
}(object_1.AbstractObject));
exports.Buffer = Buffer;


/***/ }),

/***/ "./camera.ts":
/*!*******************!*\
  !*** ./camera.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var Camera = (function () {
    function Camera(eye, center, up) {
        this._fovy = Camera.DEFAULT_FOVY;
        this._near = Camera.DEFAULT_NEAR;
        this._far = Camera.DEFAULT_FAR;
        this._viewport = [1, 1];
        this._aspect = 1.0;
        this._altered = false;
        this._eye = eye ? gl_matrix_1.vec3.clone(eye) : gl_matrix_1.vec3.clone(Camera.DEFAULT_EYE);
        this._center = center ? gl_matrix_1.vec3.clone(center) : gl_matrix_1.vec3.clone(Camera.DEFAULT_CENTER);
        this._up = up ? gl_matrix_1.vec3.clone(up) : gl_matrix_1.vec3.clone(Camera.DEFAULT_UP);
    }
    Camera.calculateFovY = function (elementDisplayHeight, eyeToDisplayDistance) {
        return Math.atan(elementDisplayHeight * 0.5 / eyeToDisplayDistance) * 2.0;
    };
    Camera.prototype.invalidate = function (invalidateView, invalidateProjection) {
        if (invalidateView) {
            this._view = undefined;
            this._viewInverse = undefined;
        }
        if (invalidateProjection) {
            this._projection = undefined;
            this._projectionInverse = undefined;
        }
        if (invalidateView || invalidateProjection) {
            this._viewProjection = undefined;
            this._viewProjectionInverse = undefined;
        }
        this._altered = true;
    };
    Object.defineProperty(Camera.prototype, "eye", {
        get: function () {
            return this._eye;
        },
        set: function (eye) {
            if (gl_matrix_1.vec3.equals(this._eye, eye)) {
                return;
            }
            this._eye = gl_matrix_1.vec3.clone(eye);
            this.invalidate(true, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "center", {
        get: function () {
            return this._center;
        },
        set: function (center) {
            if (gl_matrix_1.vec3.equals(this._center, center)) {
                return;
            }
            this._center = gl_matrix_1.vec3.clone(center);
            this.invalidate(true, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "up", {
        get: function () {
            return this._up;
        },
        set: function (up) {
            if (gl_matrix_1.vec3.equals(this._up, up)) {
                return;
            }
            this._up = gl_matrix_1.vec3.clone(up);
            this.invalidate(true, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "fovy", {
        get: function () {
            return this._fovy;
        },
        set: function (fovy) {
            if (this._fovy === fovy) {
                return;
            }
            this._fovy = fovy;
            this.invalidate(false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "near", {
        get: function () {
            return this._near;
        },
        set: function (near) {
            if (this._near === near) {
                return;
            }
            if (this._near >= this._far) {
                auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "near expected to be smaller than far (" + this._far + "), given " + near);
                return;
            }
            this._near = near;
            this.invalidate(false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "far", {
        get: function () {
            return this._far;
        },
        set: function (far) {
            if (this._far === far) {
                return;
            }
            if (this._near >= this._far) {
                auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "far expected to be greater than near (" + this._near + "), given " + far);
                return;
            }
            this._far = far;
            this.invalidate(false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "viewport", {
        get: function () {
            return this._viewport;
        },
        set: function (size) {
            if (this._viewport[0] === size[0] && this._viewport[1] === size[1]) {
                return;
            }
            this._viewport = size;
            this.invalidate(false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "width", {
        get: function () {
            return this._viewport[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "height", {
        get: function () {
            return this._viewport[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "aspect", {
        get: function () {
            return this._aspect;
        },
        set: function (aspect) {
            if (this._aspect === aspect) {
                return;
            }
            this._aspect = aspect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "view", {
        get: function () {
            if (this._view) {
                return this._view;
            }
            this._view = gl_matrix_1.mat4.lookAt(gl_matrix_extensions_1.m4(), this._eye, this._center, this._up);
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "viewInverse", {
        get: function () {
            if (this._viewInverse !== undefined) {
                return this._viewInverse;
            }
            this._viewInverse = gl_matrix_1.mat4.invert(gl_matrix_extensions_1.m4(), this.view);
            return this._viewInverse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "projection", {
        get: function () {
            if (this._projection) {
                return this._projection;
            }
            this._projection = gl_matrix_1.mat4.perspective(gl_matrix_extensions_1.m4(), this.fovy * auxiliaries_1.DEG2RAD, this.aspect, this.near, this.far);
            return this._projection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "projectionInverse", {
        get: function () {
            if (this._projectionInverse !== undefined) {
                return this._projectionInverse;
            }
            this._projectionInverse = gl_matrix_1.mat4.invert(gl_matrix_extensions_1.m4(), this.projection);
            return this._projectionInverse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "viewProjection", {
        get: function () {
            if (this._viewProjection) {
                return this._viewProjection;
            }
            this._viewProjection = gl_matrix_1.mat4.multiply(gl_matrix_extensions_1.m4(), this.projection, this.view);
            return this._viewProjection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "viewProjectionInverse", {
        get: function () {
            if (this._viewProjectionInverse !== undefined) {
                return this._viewProjectionInverse;
            }
            this._viewProjectionInverse = gl_matrix_1.mat4.invert(gl_matrix_extensions_1.m4(), this.viewProjection);
            return this._viewProjectionInverse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "altered", {
        get: function () {
            return this._altered;
        },
        set: function (status) {
            this._altered = status;
        },
        enumerable: true,
        configurable: true
    });
    Camera.DEFAULT_EYE = gl_matrix_1.vec3.fromValues(0.0, 0.0, 1.0);
    Camera.DEFAULT_CENTER = gl_matrix_1.vec3.fromValues(0.0, 0.0, 0.0);
    Camera.DEFAULT_UP = gl_matrix_1.vec3.fromValues(0.0, 1.0, 0.0);
    Camera.DEFAULT_FOVY = 45.0;
    Camera.DEFAULT_NEAR = 2.0;
    Camera.DEFAULT_FAR = 8.0;
    return Camera;
}());
exports.Camera = Camera;


/***/ }),

/***/ "./cameramodifier.ts":
/*!***************************!*\
  !*** ./cameramodifier.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var camera_1 = __webpack_require__(/*! ./camera */ "./camera.ts");
var CameraModifier = (function () {
    function CameraModifier() {
        this._camera = undefined;
        this._reference = new camera_1.Camera();
    }
    Object.defineProperty(CameraModifier.prototype, "camera", {
        set: function (camera) {
            if (this._camera === camera) {
                return;
            }
            this._camera = camera;
            if (camera === undefined) {
                return;
            }
            Object.assign(this._reference, camera);
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    return CameraModifier;
}());
exports.CameraModifier = CameraModifier;


/***/ }),

/***/ "./canvas.ts":
/*!*******************!*\
  !*** ./canvas.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = __webpack_require__(/*! rxjs/ReplaySubject */ "rxjs/ReplaySubject");
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var tuples_1 = __webpack_require__(/*! ./tuples */ "./tuples.ts");
var color_1 = __webpack_require__(/*! ./color */ "./color.ts");
var context_1 = __webpack_require__(/*! ./context */ "./context.ts");
var controller_1 = __webpack_require__(/*! ./controller */ "./controller.ts");
var mouseeventprovider_1 = __webpack_require__(/*! ./mouseeventprovider */ "./mouseeventprovider.ts");
var resizable_1 = __webpack_require__(/*! ./resizable */ "./resizable.ts");
var wizard_1 = __webpack_require__(/*! ./wizard */ "./wizard.ts");
var Canvas = (function (_super) {
    __extends(Canvas, _super);
    function Canvas(element, contextAttributes) {
        var _this = _super.call(this) || this;
        _this._framePrecisionSubject = new ReplaySubject_1.ReplaySubject(1);
        _this._size = [1, 1];
        _this._sizeSubject = new ReplaySubject_1.ReplaySubject(1);
        _this._frameScaleSubject = new ReplaySubject_1.ReplaySubject(1);
        _this._frameSizeSubject = new ReplaySubject_1.ReplaySubject(1);
        _this._element = element instanceof HTMLCanvasElement ? element :
            document.getElementById(element);
        _this._mouseEventProvider = new mouseeventprovider_1.MouseEventProvider(_this._element, 200);
        var dataset = _this._element.dataset;
        _this._context = context_1.Context.request(_this._element, contextAttributes);
        _this.configureController(dataset);
        _this.configureSizeAndScale(dataset);
        var dataClearColor;
        if (dataset.clearColor) {
            dataClearColor = gl_matrix_extensions_1.parseVec4(dataset.clearColor);
            auxiliaries_1.logIf(dataClearColor === undefined, auxiliaries_1.LogLevel.Dev, "data-clear-color could not be parsed, given '" + dataset.clearColor + "'");
        }
        _this._clearColor = dataClearColor ? new color_1.Color(tuples_1.tuple4(dataClearColor)) : Canvas.DEFAULT_CLEAR_COLOR;
        var dataFramePrecision = dataset.accumulationFormat ?
            dataset.accumulationFormat : Canvas.DEFAULT_FRAME_PRECISION;
        if (!(dataFramePrecision in wizard_1.Wizard.Precision)) {
            dataFramePrecision = Canvas.DEFAULT_FRAME_PRECISION;
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "unknown frame precision '" + dataset.accumulationFormat + "' changed to '" + dataFramePrecision + "'");
        }
        _this._framePrecision = dataFramePrecision;
        _this.framePrecisionNext();
        return _this;
    }
    Canvas.prototype.configureController = function (dataset) {
        this._controller = new controller_1.Controller();
        this._controller.block();
        var dataMFNum;
        if (dataset.multiFrameNumber) {
            dataMFNum = parseInt(dataset.multiFrameNumber, 10);
            auxiliaries_1.logIf(isNaN(dataMFNum), auxiliaries_1.LogLevel.Dev, "data-multi-frame-number could not be parsed, given '" + dataset.multiFrameNumber + "'");
        }
        var dataDFNum;
        if (dataset.debugFrameNumber) {
            dataDFNum = parseInt(dataset.debugFrameNumber, 10);
            auxiliaries_1.logIf(isNaN(dataDFNum), auxiliaries_1.LogLevel.Dev, "data-debug-frame-number could not be parsed, given '" + dataset.debugFrameNumber + "'");
        }
        this._controller.multiFrameNumber = dataMFNum ? dataMFNum : Canvas.DEFAULT_MULTI_FRAME_NUMBER;
        this._controller.debugFrameNumber = dataDFNum ? dataDFNum : 0;
        var mfNumChanged = dataMFNum ? dataMFNum !== this._controller.multiFrameNumber : false;
        auxiliaries_1.logIf(mfNumChanged, auxiliaries_1.LogLevel.Dev, "data-multi-frame-number changed to "
            + (this._controller.multiFrameNumber + ", given '" + dataset.multiFrameNumber + "'"));
        var dfNumChanged = dataDFNum ? dataDFNum !== this._controller.debugFrameNumber : false;
        auxiliaries_1.logIf(dfNumChanged, auxiliaries_1.LogLevel.Dev, "data-debug-frame-number changed to "
            + (this._controller.debugFrameNumber + ", given '" + dataset.debugFrameNumber + "'"));
    };
    Canvas.prototype.configureSizeAndScale = function (dataset) {
        var dataFrameScale;
        if (dataset.frameScale) {
            dataFrameScale = gl_matrix_extensions_1.parseVec2(dataset.frameScale);
            auxiliaries_1.logIf(dataset.frameScale !== undefined && dataFrameScale === undefined, auxiliaries_1.LogLevel.Dev, "data-frame-scale could not be parsed, given '" + dataset.frameScale + "'");
        }
        this._frameScale = dataFrameScale ? tuples_1.tuple2(dataFrameScale) : [1.0, 1.0];
        var dataFrameSize;
        if (dataset.frameSize) {
            dataFrameSize = gl_matrix_extensions_1.parseVec2(dataset.frameSize);
            auxiliaries_1.logIf(dataset.frameSize !== undefined && dataFrameSize === undefined, auxiliaries_1.LogLevel.Dev, "data-frame-size could not be parsed, given '" + dataset.frameSize + "'");
        }
        this._favorSizeOverScale = dataFrameSize !== undefined;
        this._frameSize = dataFrameSize ? tuples_1.tuple2(dataFrameSize) : [this._size[0], this._size[1]];
        this.onResize();
    };
    Canvas.prototype.retrieveSize = function () {
        var size = resizable_1.Resizable.elementSize(this._element);
        this._size = [size[0], size[1]];
        this.sizeNext();
    };
    Canvas.prototype.onResize = function () {
        this.retrieveSize();
        this._element.width = this._size[0];
        this._element.height = this._size[1];
        if (this._renderer) {
            this._controller.block();
        }
        if (this._favorSizeOverScale) {
            this.frameSize = this._frameSize;
        }
        else {
            this.frameScale = this._frameScale;
        }
        if (this._renderer) {
            this._controller.unblock();
        }
    };
    Canvas.prototype.framePrecisionNext = function () {
        this._framePrecisionSubject.next(this._framePrecision);
    };
    Canvas.prototype.sizeNext = function () {
        this._sizeSubject.next(this._size);
    };
    Canvas.prototype.frameScaleNext = function () {
        this._frameScaleSubject.next(this._frameScale);
    };
    Canvas.prototype.frameSizeNext = function () {
        this._frameSizeSubject.next(this._frameSize);
    };
    Canvas.prototype.bind = function (renderer) {
        var _this = this;
        if (this._renderer === renderer) {
            return;
        }
        this.unbind();
        if (renderer === undefined) {
            return;
        }
        auxiliaries_1.assert(this._controller.blocked, "expected controller to be blocked");
        this._renderer = renderer;
        this._renderer.initialize(this.context, function (force) { return _this._controller.update(force); }, this._mouseEventProvider);
        this._renderer.frameSize = this._frameSize;
        this._renderer.clearColor = this._clearColor.rgba;
        this._renderer.framePrecision = this._framePrecision;
        this._renderer.debugTexture = -1;
        this._controller.controllable = this._renderer;
        this._controller.unblock();
    };
    Canvas.prototype.unbind = function () {
        if (this._renderer === undefined) {
            return;
        }
        this._controller.block();
        this._controller.controllable = undefined;
        this._renderer = undefined;
    };
    Canvas.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._renderer) {
            this._renderer.uninitialize();
            this.unbind();
        }
    };
    Canvas.prototype.resize = function () {
        this.onResize();
    };
    Object.defineProperty(Canvas.prototype, "controller", {
        get: function () {
            return this._controller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        set: function (renderer) {
            this.bind(renderer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "frameScale", {
        get: function () {
            return this._frameScale;
        },
        set: function (frameScale) {
            auxiliaries_1.logIf(frameScale[0] < 0.0 || frameScale[0] > 1.0, auxiliaries_1.LogLevel.Dev, "frame width scale clamped to [0.0,1.0], given " + frameScale[0]);
            auxiliaries_1.logIf(frameScale[1] < 0.0 || frameScale[1] > 1.0, auxiliaries_1.LogLevel.Dev, "frame height scale clamped to [0.0,1.0], given " + frameScale[0]);
            var scale = gl_matrix_1.vec2.create();
            gl_matrix_extensions_1.clamp2(scale, frameScale, [0.0, 0.0], [1.0, 1.0]);
            var size = gl_matrix_1.vec2.create();
            gl_matrix_1.vec2.mul(size, this._size, scale);
            gl_matrix_1.vec2.max(size, [1, 1], size);
            gl_matrix_1.vec2.round(size, size);
            gl_matrix_1.vec2.div(scale, size, this._size);
            auxiliaries_1.logIf(!gl_matrix_1.vec2.exactEquals(scale, frameScale), 2, "frame scale was adjusted to " + scale.toString() + ", given " + frameScale.toString());
            this._frameScale = tuples_1.tuple2(scale);
            this._frameSize = tuples_1.tuple2(size);
            this._favorSizeOverScale = false;
            this.frameScaleNext();
            this.frameSizeNext();
            if (this._renderer) {
                this._renderer.frameSize = this._frameSize;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "frameScaleObservable", {
        get: function () {
            return this._frameScaleSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "frameSize", {
        get: function () {
            return this._frameSize;
        },
        set: function (frameSize) {
            auxiliaries_1.logIf(frameSize[0] < 1 || frameSize[0] > this._size[0], auxiliaries_1.LogLevel.Dev, "frame width scale clamped to [1," + this._size[0] + "], given " + frameSize[0]);
            auxiliaries_1.logIf(frameSize[1] < 1 || frameSize[1] > this._size[1], auxiliaries_1.LogLevel.Dev, "frame height scale clamped to [1, " + this._size[1] + "], given " + frameSize[1]);
            var size = gl_matrix_1.vec2.create();
            gl_matrix_extensions_1.clamp2(size, frameSize, [1.0, 1.0], this._size);
            gl_matrix_1.vec2.round(size, size);
            auxiliaries_1.logIf(!gl_matrix_1.vec2.exactEquals(size, frameSize), auxiliaries_1.LogLevel.ModuleDev, "frame size was adjusted to " + size.toString() + ", given " + frameSize.toString());
            var scale = gl_matrix_1.vec2.create();
            gl_matrix_1.vec2.div(scale, size, this._size);
            this._frameScale = tuples_1.tuple2(scale);
            this._frameSize = tuples_1.tuple2(size);
            this._favorSizeOverScale = !gl_matrix_1.vec2.exactEquals(this._frameSize, this._size);
            this.frameScaleNext();
            this.frameSizeNext();
            if (this._renderer) {
                this._renderer.frameSize = this._frameSize;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "frameSizeObservable", {
        get: function () {
            return this._frameSizeSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "clearColor", {
        get: function () {
            return this._clearColor;
        },
        set: function (clearColor) {
            this._clearColor = clearColor;
            if (this._renderer) {
                this._renderer.clearColor = this._clearColor.rgba;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "framePrecision", {
        get: function () {
            return this._framePrecision;
        },
        set: function (precision) {
            this._framePrecision = precision;
            if (this._renderer) {
                this._renderer.framePrecision = this._framePrecision;
                this._framePrecision = this._renderer.framePrecision;
            }
            this.framePrecisionNext();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "framePrecisionObservable", {
        get: function () {
            return this._framePrecisionSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "backend", {
        get: function () {
            return this._context.backendString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "sizeObservable", {
        get: function () {
            return this._sizeSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "width", {
        get: function () {
            return this._size[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "height", {
        get: function () {
            return this._size[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "mouseEventProvider", {
        get: function () {
            return this._mouseEventProvider;
        },
        enumerable: true,
        configurable: true
    });
    Canvas.DEFAULT_CLEAR_COLOR = new color_1.Color([0.203, 0.227, 0.250, 1.0]);
    Canvas.DEFAULT_FRAME_PRECISION = wizard_1.Wizard.Precision.auto;
    Canvas.DEFAULT_MULTI_FRAME_NUMBER = 0;
    return Canvas;
}(resizable_1.Resizable));
exports.Canvas = Canvas;


/***/ }),

/***/ "./changelookup.ts":
/*!*************************!*\
  !*** ./changelookup.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var ChangeLookup = (function () {
    function ChangeLookup() {
    }
    ChangeLookup.alter = function (path, property) {
        auxiliaries_1.assert(property.hasOwnProperty('any'), "expected alterable object to provide 'any' key");
        property.any = true;
        var names = path.split('.');
        var name = names.shift();
        auxiliaries_1.assert(name === '' || property.hasOwnProperty(name), "expected object to have key '" + name + "' in order to capture alterations");
        if (name !== '' && typeof property[name] !== 'object') {
            property[name] = true;
            return;
        }
        if (name !== '' && names.length > 0) {
            ChangeLookup.alter(names.join('.'), property[name]);
            return;
        }
        var parent = name !== '' ? property[name] : property;
        for (var _i = 0, _a = Object.getOwnPropertyNames(parent); _i < _a.length; _i++) {
            var child = _a[_i];
            if (child === 'any') {
                continue;
            }
            ChangeLookup.alter(child, parent);
        }
    };
    ChangeLookup.reset = function (property) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(property); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (typeof property[name_1] === 'object') {
                ChangeLookup.reset(property[name_1]);
                continue;
            }
            property[name_1] = false;
        }
    };
    ChangeLookup.prototype.alter = function (path) {
        return ChangeLookup.alter(path, this);
    };
    ChangeLookup.prototype.reset = function () {
        return ChangeLookup.reset(this);
    };
    return ChangeLookup;
}());
exports.ChangeLookup = ChangeLookup;


/***/ }),

/***/ "./color.ts":
/*!******************!*\
  !*** ./color.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var tuples_1 = __webpack_require__(/*! ./tuples */ "./tuples.ts");
var Color = (function () {
    function Color(rgba, alpha) {
        this._rgba = [0.0, 0.0, 0.0, Color.DEFAULT_ALPHA];
        this._altered = false;
        if (rgba === undefined) {
            return;
        }
        if (rgba.length === 3 && alpha !== undefined) {
            this.fromF32(rgba[0], rgba[1], rgba[2], alpha);
        }
        else if (rgba.length === 4) {
            this.fromF32(rgba[0], rgba[1], rgba[2], rgba[3]);
            auxiliaries_1.assert(alpha === undefined, "expected alpha to be undefined when given an 4-tuple in RGBA");
        }
        else {
            this.fromF32(rgba[0], rgba[1], rgba[2]);
        }
    }
    Color.hue2rgb = function (p, q, t) {
        auxiliaries_1.assert(t >= -1.0 && t <= 2.0, "t is expected to be between -1 and 2");
        if (t < 0.0) {
            t += 1.0;
        }
        else if (t > 1.0) {
            t -= 1.0;
        }
        if ((6.0 * t) < 1.0) {
            return p + (q - p) * 6.0 * t;
        }
        if ((2.0 * t) < 1.0) {
            return q;
        }
        if ((3.0 * t) < 2.0) {
            return p + (q - p) * 6.0 * (2.0 / 3.0 - t);
        }
        return p;
    };
    Color.to2CharHexCode = function (value) {
        return (value < 15.5 / 255.0 ? '0' : '') + Math.round(value * 255.0).toString(16);
    };
    Color.hsl2rgb = function (hsl) {
        var hslF = tuples_1.clampf3(hsl, 'HSL input');
        if (hslF[1] === 0.0) {
            return [hslF[2], hslF[2], hslF[2]];
        }
        var q = hslF[2] < 0.5 ? hslF[2] * (1.0 + hslF[1]) : (hslF[2] + hslF[1]) - (hslF[1] * hslF[2]);
        var p = 2.0 * hslF[2] - q;
        return [Color.hue2rgb(p, q, hslF[0] + (1.0 / 3.0)),
            Color.hue2rgb(p, q, hslF[0]), Color.hue2rgb(p, q, hslF[0] - (1.0 / 3.0))];
    };
    Color.rgb2hsl = function (rgb) {
        var rgbF = tuples_1.clampf3(rgb, 'RGB input');
        var hsl = [0.0, 0.0, 0.0];
        var min = Math.min(rgbF[0], rgbF[1], rgbF[2]);
        var max = Math.max(rgbF[0], rgbF[1], rgbF[2]);
        var delta = max - min;
        hsl[2] = (max + min) * 0.5;
        if (delta === 0.0) {
            return hsl;
        }
        hsl[1] = hsl[2] < 0.5 ? delta / (max + min) : delta / (2.0 - max - min);
        var deltaR = (((max - rgbF[0]) / 6.0) + (delta / 2.0)) / delta;
        var deltaG = (((max - rgbF[1]) / 6.0) + (delta / 2.0)) / delta;
        var deltaB = (((max - rgbF[2]) / 6.0) + (delta / 2.0)) / delta;
        if (rgbF[0] === max) {
            hsl[0] = deltaB - deltaG;
        }
        else if (rgbF[1] === max) {
            hsl[0] = deltaR - deltaB + (1.0 / 3.0);
        }
        else {
            hsl[0] = deltaG - deltaR + (2.0 / 3.0);
        }
        return hsl;
    };
    Color.lab2xyz = function (lab) {
        var labF = tuples_1.clampf3(lab, 'LAB input');
        var yr = (labF[0] * 100.0 + 16.0) / 116.0;
        var xr = labF[1] * 100 / 500.0 + yr;
        var zr = yr - labF[2] * 100 / 200.0;
        var yr3 = yr * yr * yr;
        var xr3 = xr * xr * xr;
        var zr3 = zr * zr * zr;
        var y = 1.00000 * (yr3 > 0.008856 ? yr3 : (yr - 16.0 / 116.0) / 7.787);
        var x = 0.95047 * (xr3 > 0.008856 ? xr3 : (xr - 16.0 / 116.0) / 7.787);
        var z = 1.08883 * (zr3 > 0.008856 ? zr3 : (zr - 16.0 / 116.0) / 7.787);
        return [x, y, z];
    };
    Color.xyz2lab = function (xyz) {
        var xyzF = [xyz[0] / 0.95047, xyz[1] * 1.00000, xyz[2] / 1.08883];
        var x = xyzF[0] > 0.008856 ? Math.pow(xyzF[0], 1.0 / 3.0) : (7.787 * xyzF[0]) + (16.0 / 116.0);
        var y = xyzF[1] > 0.008856 ? Math.pow(xyzF[1], 1.0 / 3.0) : (7.787 * xyzF[1]) + (16.0 / 116.0);
        var z = xyzF[2] > 0.008856 ? Math.pow(xyzF[2], 1.0 / 3.0) : (7.787 * xyzF[2]) + (16.0 / 116.0);
        return tuples_1.clampf3([
            0.01 * (116.0 * y - 16.0),
            0.01 * (500.0 * (x - y)),
            0.01 * (200.0 * (y - z))
        ]);
    };
    Color.xyz2rgb = function (xyz) {
        var r = xyz[0] * +2.04159 + xyz[1] * -0.56501 + xyz[2] * -0.34473;
        var g = xyz[0] * -0.96924 + xyz[1] * +1.87597 + xyz[2] * +0.04156;
        var b = xyz[0] * +0.01344 + xyz[1] * -0.11836 + xyz[2] * +1.01517;
        return tuples_1.clampf3([
            Math.pow(r, 1.0 / 2.19921875),
            Math.pow(g, 1.0 / 2.19921875),
            Math.pow(b, 1.0 / 2.19921875)
        ]);
    };
    Color.rgb2xyz = function (rgb) {
        var rgbF = tuples_1.clampf3(rgb, 'RGB input');
        var r = Math.pow(rgbF[0], 2.19921875);
        var g = Math.pow(rgbF[1], 2.19921875);
        var b = Math.pow(rgbF[2], 2.19921875);
        var x = r * 0.57667 + g * 0.18556 + b * 0.18823;
        var y = r * 0.29734 + g * 0.62736 + b * 0.07529;
        var z = r * 0.02703 + g * 0.07069 + b * 0.99134;
        return [x, y, z];
    };
    Color.lab2rgb = function (lab) {
        return Color.xyz2rgb(Color.lab2xyz(lab));
    };
    Color.rgb2lab = function (rgb) {
        return Color.xyz2lab(Color.rgb2xyz(rgb));
    };
    Color.cmyk2rgb = function (cmyk) {
        var cmykF = tuples_1.clampf4(cmyk, 'CMYK input');
        var k = 1.0 - cmykF[3];
        return [(1.0 - cmykF[0]) * k, (1.0 - cmykF[1]) * k, (1.0 - cmykF[2]) * k];
    };
    Color.rgb2cmyk = function (rgb) {
        var rgbF = tuples_1.clampf3(rgb, 'RGB input');
        var k1 = 1.0 - Math.max(rgbF[0], rgbF[1], rgbF[2]);
        var k2 = 1.0 - k1;
        var k3 = k2 === 0.0 ? 0.0 : 1.0 / k2;
        return [(k2 - rgbF[0]) * k3, (k2 - rgbF[1]) * k3, (k2 - rgbF[2]) * k3, k1];
    };
    Color.hex2rgba = function (hex) {
        var rgba = [0.0, 0.0, 0.0, Color.DEFAULT_ALPHA];
        if (!Color.HEX_FORMAT_REGEX.test(hex)) {
            auxiliaries_1.log(auxiliaries_1.LogLevel.User, "hexadecimal RGBA color string must conform to either '0x0000', '#0000', '0000', '0x00000000', '#00000000', or '00000000', given '" + hex + "'");
            return rgba;
        }
        var offset = hex.startsWith('0x') ? 2 : hex.startsWith('#') ? 1 : 0;
        var length = Math.floor((hex.length - offset) / 3);
        var stride = length - 1;
        rgba[0] = parseInt(hex[offset + 0 * length] + hex[offset + 0 * length + stride], 16) / 255.0;
        rgba[1] = parseInt(hex[offset + 1 * length] + hex[offset + 1 * length + stride], 16) / 255.0;
        rgba[2] = parseInt(hex[offset + 2 * length] + hex[offset + 2 * length + stride], 16) / 255.0;
        if ((hex.length - offset) === 4 || (hex.length - offset) === 8) {
            rgba[3] = parseInt(hex[offset + 3 * length] + hex[offset + 3 * length + stride], 16) / 255.0;
        }
        auxiliaries_1.assert(!isNaN(rgba[0]) && !isNaN(rgba[1]) && !isNaN(rgba[2]) && !isNaN(rgba[3]), "expected well formated hexadecimal RGBA string, given '" + hex + "'");
        return rgba;
    };
    Color.rgb2hex = function (rgb) {
        var rgbF = tuples_1.clampf3(rgb, 'RGB input');
        var r = Color.to2CharHexCode(rgbF[0]);
        var g = Color.to2CharHexCode(rgbF[1]);
        var b = Color.to2CharHexCode(rgbF[2]);
        return '#' + r + g + b;
    };
    Color.rgba2hex = function (rgba) {
        var rgbaF = tuples_1.clampf4(rgba, 'RGBA input');
        var r = Color.to2CharHexCode(rgbaF[0]);
        var g = Color.to2CharHexCode(rgbaF[1]);
        var b = Color.to2CharHexCode(rgbaF[2]);
        var a = Color.to2CharHexCode(rgbaF[3]);
        return '#' + r + g + b + a;
    };
    Color.prototype.equals = function (other) {
        return tuples_1.equals4(this._rgba, other._rgba);
    };
    Color.prototype.fromF32 = function (red, green, blue, alpha) {
        if (alpha === void 0) { alpha = Color.DEFAULT_ALPHA; }
        var previous = tuples_1.duplicate4(this._rgba);
        this._rgba[0] = tuples_1.clampf(red, "red value");
        this._rgba[1] = tuples_1.clampf(green, "green value");
        this._rgba[2] = tuples_1.clampf(blue, "blue value");
        this._rgba[3] = tuples_1.clampf(alpha, "alpha value");
        this._altered = !tuples_1.equals4(this._rgba, previous);
        return this;
    };
    Color.prototype.fromUI8 = function (red, green, blue, alpha) {
        if (alpha === void 0) { alpha = Math.floor(Color.DEFAULT_ALPHA * 255); }
        var previous = tuples_1.duplicate4(this._rgba);
        this._rgba[0] = gl_matrix_extensions_1.clamp(red, 0, 255) / 255.0;
        this._rgba[1] = gl_matrix_extensions_1.clamp(green, 0, 255) / 255.0;
        this._rgba[2] = gl_matrix_extensions_1.clamp(blue, 0, 255) / 255.0;
        this._rgba[3] = gl_matrix_extensions_1.clamp(alpha, 0, 255) / 255.0;
        this._altered = !tuples_1.equals4(this._rgba, previous);
        return this;
    };
    Color.prototype.fromHSL = function (hue, saturation, lightness, alpha) {
        if (alpha === void 0) { alpha = Color.DEFAULT_ALPHA; }
        var previous = tuples_1.duplicate4(this._rgba);
        var rgb = Color.hsl2rgb([hue, saturation, lightness]);
        var alphaf = tuples_1.clampf(alpha, 'ALPHA input');
        this._rgba = [rgb[0], rgb[1], rgb[2], alphaf];
        this._altered = !tuples_1.equals4(this._rgba, previous);
        return this;
    };
    Color.prototype.fromLAB = function (lightness, greenRed, blueYellow, alpha) {
        if (alpha === void 0) { alpha = Color.DEFAULT_ALPHA; }
        var previous = tuples_1.duplicate4(this._rgba);
        var rgb = Color.lab2rgb([lightness, greenRed, blueYellow]);
        var alphaf = tuples_1.clampf(alpha, 'ALPHA input');
        this._rgba = [rgb[0], rgb[1], rgb[2], alphaf];
        this._altered = !tuples_1.equals4(this._rgba, previous);
        return this;
    };
    Color.prototype.fromCMYK = function (cyan, magenta, yellow, key, alpha) {
        if (alpha === void 0) { alpha = Color.DEFAULT_ALPHA; }
        var previous = tuples_1.duplicate4(this._rgba);
        var rgb = Color.cmyk2rgb([cyan, magenta, yellow, key]);
        var alphaf = tuples_1.clampf(alpha, 'ALPHA input');
        this._rgba = [rgb[0], rgb[1], rgb[2], alphaf];
        this._altered = !tuples_1.equals4(this._rgba, previous);
        return this;
    };
    Color.prototype.fromHex = function (hex) {
        var previous = tuples_1.duplicate4(this._rgba);
        this._rgba = Color.hex2rgba(hex);
        this._altered = !tuples_1.equals4(this._rgba, previous);
        return this;
    };
    Color.prototype.gray = function (algorithm) {
        if (algorithm === void 0) { algorithm = Color.GrayscaleAlgorithm.LinearLuminance; }
        switch (algorithm) {
            case Color.GrayscaleAlgorithm.Average:
                return (this._rgba[0] + this._rgba[1] + this._rgba[2]) / 3.0;
            case Color.GrayscaleAlgorithm.LeastSaturatedVariant:
                return (Math.max(this._rgba[0], this._rgba[1], this._rgba[2])
                    - Math.min(this._rgba[0], this._rgba[1], this._rgba[2])) * 0.5;
            case Color.GrayscaleAlgorithm.MinimumDecomposition:
                return Math.min(this._rgba[0], this._rgba[1], this._rgba[2]);
            case Color.GrayscaleAlgorithm.MaximumDecomposition:
                return Math.max(this._rgba[0], this._rgba[1], this._rgba[2]);
            case Color.GrayscaleAlgorithm.LinearLuminance:
            default:
                return this._rgba[0] * 0.2126 + this._rgba[1] * 0.7152 + this._rgba[2] * 0.0722;
        }
    };
    Object.defineProperty(Color.prototype, "rgb", {
        get: function () {
            return [this._rgba[0], this._rgba[1], this._rgba[2]];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgbUI8", {
        get: function () {
            var ui8Array = new Uint8Array(3);
            ui8Array[0] = Math.round(this._rgba[0] * 255.0);
            ui8Array[1] = Math.round(this._rgba[1] * 255.0);
            ui8Array[2] = Math.round(this._rgba[2] * 255.0);
            return ui8Array;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgbF32", {
        get: function () {
            var f32Array = new Float32Array(3);
            f32Array[0] = this._rgba[0];
            f32Array[1] = this._rgba[1];
            f32Array[2] = this._rgba[2];
            return f32Array;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgba", {
        get: function () {
            return this._rgba;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgbaUI8", {
        get: function () {
            var ui8Array = new Uint8Array(4);
            ui8Array[0] = Math.round(this._rgba[0] * 255.0);
            ui8Array[1] = Math.round(this._rgba[1] * 255.0);
            ui8Array[2] = Math.round(this._rgba[2] * 255.0);
            ui8Array[3] = Math.round(this._rgba[3] * 255.0);
            return ui8Array;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgbaF32", {
        get: function () {
            return new Float32Array(this._rgba);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "r", {
        get: function () {
            return this._rgba[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "g", {
        get: function () {
            return this._rgba[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "b", {
        get: function () {
            return this._rgba[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "a", {
        get: function () {
            return this._rgba[3];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hexRGB", {
        get: function () {
            return Color.rgb2hex(this.rgb);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hexRGBA", {
        get: function () {
            return Color.rgba2hex(this._rgba);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hsl", {
        get: function () {
            return Color.rgb2hsl(this.rgb);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hsla", {
        get: function () {
            var hsl = Color.rgb2hsl(this.rgb);
            return [hsl[0], hsl[1], hsl[2], this._rgba[3]];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "lab", {
        get: function () {
            return Color.rgb2lab(this.rgb);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "laba", {
        get: function () {
            var lab = Color.rgb2lab(this.rgb);
            return [lab[0], lab[1], lab[2], this._rgba[3]];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "cmyk", {
        get: function () {
            return Color.rgb2cmyk(this.rgb);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "cmyka", {
        get: function () {
            var cmyk = Color.rgb2cmyk(this.rgb);
            return [cmyk[0], cmyk[1], cmyk[2], cmyk[3], this._rgba[3]];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "altered", {
        get: function () {
            return this._altered;
        },
        set: function (status) {
            this._altered = status;
        },
        enumerable: true,
        configurable: true
    });
    Color.DEFAULT_ALPHA = 1.0;
    Color.HEX_FORMAT_REGEX = new RegExp(/^(#|0x)?(([0-9a-f]{3}){1,2}|([0-9a-f]{4}){1,2})$/i);
    return Color;
}());
exports.Color = Color;
(function (Color) {
    var GrayscaleAlgorithm;
    (function (GrayscaleAlgorithm) {
        GrayscaleAlgorithm[GrayscaleAlgorithm["Average"] = 0] = "Average";
        GrayscaleAlgorithm[GrayscaleAlgorithm["LinearLuminance"] = 1] = "LinearLuminance";
        GrayscaleAlgorithm[GrayscaleAlgorithm["LeastSaturatedVariant"] = 2] = "LeastSaturatedVariant";
        GrayscaleAlgorithm[GrayscaleAlgorithm["MinimumDecomposition"] = 3] = "MinimumDecomposition";
        GrayscaleAlgorithm[GrayscaleAlgorithm["MaximumDecomposition"] = 4] = "MaximumDecomposition";
    })(GrayscaleAlgorithm = Color.GrayscaleAlgorithm || (Color.GrayscaleAlgorithm = {}));
})(Color = exports.Color || (exports.Color = {}));
exports.Color = Color;


/***/ }),

/***/ "./colorgradient.ts":
/*!**************************!*\
  !*** ./colorgradient.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ColorGradient = (function () {
    function ColorGradient() {
        this._lerpSpace = ColorGradient.LerpSpace.RGB;
    }
    Object.defineProperty(ColorGradient.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorGradient.prototype, "lerpSpace", {
        get: function () {
            return this._lerpSpace;
        },
        set: function (space) {
            this._lerpSpace = space;
        },
        enumerable: true,
        configurable: true
    });
    return ColorGradient;
}());
exports.ColorGradient = ColorGradient;
(function (ColorGradient) {
    var Type;
    (function (Type) {
        Type["Linear"] = "linear";
        Type["Nearest"] = "nearest";
    })(Type = ColorGradient.Type || (ColorGradient.Type = {}));
    var LerpSpace;
    (function (LerpSpace) {
        LerpSpace[LerpSpace["RGB"] = 0] = "RGB";
        LerpSpace[LerpSpace["HSL"] = 1] = "HSL";
        LerpSpace[LerpSpace["LAB"] = 2] = "LAB";
        LerpSpace[LerpSpace["CMYK"] = 3] = "CMYK";
    })(LerpSpace = ColorGradient.LerpSpace || (ColorGradient.LerpSpace = {}));
})(ColorGradient = exports.ColorGradient || (exports.ColorGradient = {}));
exports.ColorGradient = ColorGradient;


/***/ }),

/***/ "./context.ts":
/*!********************!*\
  !*** ./context.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var allocationregister_1 = __webpack_require__(/*! ./allocationregister */ "./allocationregister.ts");
var contextmasquerade_1 = __webpack_require__(/*! ./contextmasquerade */ "./contextmasquerade.ts");
var extensions_1 = __webpack_require__(/*! ./extensions */ "./extensions.ts");
var extensionshash_1 = __webpack_require__(/*! ./extensionshash */ "./extensionshash.ts");
var gl2facade_1 = __webpack_require__(/*! ./gl2facade */ "./gl2facade.ts");
var Context = (function () {
    function Context(context, mask) {
        this._extensions = new Array();
        this._allocationRegister = new allocationregister_1.AllocationRegister();
        this._context = context;
        this._mask = mask;
        var contextString = context.toString();
        {
            var webgl1 = /WebGLRenderingContext/.test(contextString) ||
                /CaptureContext/.test(contextString);
            var webgl2 = /WebGL2RenderingContext/.test(contextString);
            this._backend = webgl1 ? Context.BackendType.WebGL1 : webgl2 ? Context.BackendType.WebGL2 : undefined;
        }
        auxiliaries_1.assert(this._backend !== undefined && this._backend.valueOf() !== Context.BackendType.Invalid.valueOf(), "context is neither webgl nor webgl2, given " + contextString);
        this.queryExtensionSupport();
        if (this._mask && this._mask.functionsUndefine) {
            for (var func in this._mask.functionsUndefine) {
                this._context[func] = undefined;
            }
        }
        this._gl2 = new gl2facade_1.GL2Facade(this);
    }
    Context.createMasqueradeFromGETorDataAttribute = function (dataset) {
        var mask = contextmasquerade_1.ContextMasquerade.fromGET();
        if (mask) {
            return mask;
        }
        if (dataset.msqrdH) {
            return contextmasquerade_1.ContextMasquerade.fromHash(dataset.msqrdH);
        }
        if (dataset.msqrdP) {
            return contextmasquerade_1.ContextMasquerade.fromPreset(dataset.msqrdP);
        }
        return undefined;
    };
    Context.request = function (element, attributes) {
        if (attributes === void 0) { attributes = Context.CONTEXT_ATTRIBUTES; }
        var dataset = element.dataset;
        var mask = Context.createMasqueradeFromGETorDataAttribute(dataset);
        var request = mask ? mask.backend :
            dataset.backend ? dataset.backend.toLowerCase() : 'auto';
        if (!(request in Context.BackendRequestType)) {
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "unknown backend '" + dataset.backend + "' changed to '" + Context.BackendRequestType.auto + "'");
            request = 'auto';
        }
        switch (request) {
            case Context.BackendRequestType.webgl:
                break;
            case Context.BackendRequestType.experimental:
            case Context.BackendRequestType.webgl1:
            case Context.BackendRequestType.experimental1:
                request = Context.BackendRequestType.webgl;
                break;
            case Context.BackendRequestType.webgl2:
            case Context.BackendRequestType.experimental2:
                request = Context.BackendRequestType.webgl2;
                break;
            default:
                request = Context.BackendRequestType.auto;
        }
        var context;
        if (request !== Context.BackendRequestType.webgl) {
            context = this.requestWebGL2(element, attributes);
        }
        if (!context) {
            context = this.requestWebGL1(element, attributes);
            auxiliaries_1.logIf(context !== undefined && request === Context.BackendRequestType.webgl2, auxiliaries_1.LogLevel.Dev, "backend changed to '" + Context.BackendRequestType.webgl + "', given '" + request + "'");
        }
        auxiliaries_1.assert(!!context, "creating a context failed");
        return new Context(context, mask);
    };
    Context.requestWebGL1 = function (element, attributes) {
        var context = element.getContext(Context.BackendRequestType.webgl, attributes);
        if (context) {
            return context;
        }
        context = element.getContext(Context.BackendRequestType.experimental, attributes);
        return context;
    };
    Context.requestWebGL2 = function (element, attributes) {
        var context = element.getContext(Context.BackendRequestType.webgl2, attributes);
        if (context) {
            return context;
        }
        context = element.getContext(Context.BackendRequestType.experimental2, attributes);
        return context;
    };
    Object.defineProperty(Context.prototype, "alpha", {
        get: function () {
            return this._context.getContextAttributes().alpha;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "antialias", {
        get: function () {
            return this._context.getContextAttributes().antialias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "depth", {
        get: function () {
            return this._context.getContextAttributes().depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "failIfMajorPerformanceCaveat", {
        get: function () {
            return this._context.getContextAttributes().failIfMajorPerformanceCaveat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "premultipliedAlpha", {
        get: function () {
            return this._context.getContextAttributes().premultipliedAlpha;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "preserveDrawingBuffer", {
        get: function () {
            return this._context.getContextAttributes().preserveDrawingBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "stencil", {
        get: function () {
            return this._context.getContextAttributes().stencil;
        },
        enumerable: true,
        configurable: true
    });
    Context.prototype.supports = function (extension) {
        if (this._mask && this._mask.extensionsConceal.indexOf(extension) > -1) {
            return false;
        }
        switch (this._backend) {
            case Context.BackendType.WebGL1:
                auxiliaries_1.assert(extensions_1.WEBGL1_EXTENSIONS.indexOf(extension) > -1, "extension " + extension + " not available to WebGL1");
                break;
            case Context.BackendType.WebGL2:
                auxiliaries_1.assert(extensions_1.WEBGL2_DEFAULT_EXTENSIONS.indexOf(extension) === -1, "extension " + extension + " supported by default in WebGL2");
                auxiliaries_1.assert(extensions_1.WEBGL2_EXTENSIONS.indexOf(extension) > -1, "extension " + extension + " not available to WebGL2");
                break;
            default:
                break;
        }
        return this._extensions.indexOf(extension) > -1;
    };
    Context.prototype.queryExtensionSupport = function () {
        this._extensions = this._context.getSupportedExtensions();
        if (this._backend === Context.BackendType.WebGL1) {
            this.ANGLE_instanced_arrays_supported = this.supports('ANGLE_instanced_arrays');
            this.EXT_blend_minmax_supported = this.supports('EXT_blend_minmax');
            this.EXT_color_buffer_half_float_supported = this.supports('EXT_color_buffer_half_float');
            this.EXT_disjoint_timer_query_supported = this.supports('EXT_disjoint_timer_query');
            this.EXT_frag_depth_supported = this.supports('EXT_frag_depth');
            this.EXT_sRGB_supported = this.supports('EXT_sRGB');
            this.EXT_shader_texture_lod_supported = this.supports('EXT_shader_texture_lod');
            this.OES_element_index_uint_supported = this.supports('OES_element_index_uint');
            this.OES_standard_derivatives_supported = this.supports('OES_standard_derivatives');
            this.OES_texture_float_supported = this.supports('OES_texture_float');
            this.OES_texture_half_float_supported = this.supports('OES_texture_half_float');
            this.OES_vertex_array_object_supported = this.supports('OES_vertex_array_object');
            this.WEBGL_color_buffer_float_supported = this.supports('WEBGL_color_buffer_float');
            this.WEBGL_depth_texture_supported = this.supports('WEBGL_depth_texture');
            this.WEBGL_draw_buffers_supported = this.supports('WEBGL_draw_buffers');
        }
        if (this._backend === Context.BackendType.WebGL2) {
            this.EXT_color_buffer_float_supported = this.supports('EXT_color_buffer_float');
            this.EXT_disjoint_timer_query_webgl2_supported = this.supports('EXT_disjoint_timer_query_webgl2');
        }
        this.EXT_texture_filter_anisotropic_supported = this.supports('EXT_texture_filter_anisotropic');
        this.OES_texture_float_linear_supported = this.supports('OES_texture_float_linear');
        this.OES_texture_half_float_linear_supported = this.supports('OES_texture_half_float_linear');
        this.WEBGL_compressed_texture_astc_supported = this.supports('WEBGL_compressed_texture_astc');
        this.WEBGL_compressed_texture_atc_supported = this.supports('WEBGL_compressed_texture_atc');
        this.WEBGL_compressed_texture_etc_supported = this.supports('WEBGL_compressed_texture_etc');
        this.WEBGL_compressed_texture_etc1_supported = this.supports('WEBGL_compressed_texture_etc1');
        this.WEBGL_compressed_texture_pvrtc_supported = this.supports('WEBGL_compressed_texture_pvrtc');
        this.WEBGL_compressed_texture_s3tc_supported = this.supports('WEBGL_compressed_texture_s3tc');
        this.WEBGL_compressed_texture_s3tc_srgb_supported = this.supports('WEBGL_compressed_texture_s3tc_srgb');
        this.WEBGL_debug_renderer_info_supported = this.supports('WEBGL_debug_renderer_info');
        this.WEBGL_debug_shaders_supported = this.supports('WEBGL_debug_shaders');
        this.WEBGL_lose_context_supported = this.supports('WEBGL_lose_context');
    };
    Context.prototype.extension = function (out, extension) {
        if (out === undefined) {
            auxiliaries_1.assert(this.supports(extension), "extension " + extension + " expected to be supported");
            out = this._context.getExtension(extension);
        }
        return out;
    };
    Object.defineProperty(Context.prototype, "allocationRegister", {
        get: function () {
            return this._allocationRegister;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "backend", {
        get: function () {
            return this._backend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "backendString", {
        get: function () {
            switch (this._backend) {
                case Context.BackendType.WebGL1:
                    return 'WebGL';
                case Context.BackendType.WebGL2:
                    return 'WebGL2';
                default:
                    return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "extensions", {
        get: function () {
            return this._extensions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "mask", {
        get: function () {
            return this._mask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "gl", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "gl2facade", {
        get: function () {
            return this._gl2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "isWebGL1", {
        get: function () {
            return this._backend === Context.BackendType.WebGL1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "isWebGL2", {
        get: function () {
            return this._backend === Context.BackendType.WebGL2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsInstancedArrays", {
        get: function () {
            return this.ANGLE_instanced_arrays_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "instancedArrays", {
        get: function () {
            return this.extension(this.ANGLE_instanced_arrays, 'ANGLE_instanced_arrays');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsBlendMinmax", {
        get: function () {
            return this.EXT_blend_minmax_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "blendMinmax", {
        get: function () {
            return this.extension(this.EXT_blend_minmax, 'EXT_blend_minmax');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsColorBufferHalfFloat", {
        get: function () {
            return this.EXT_color_buffer_half_float_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "colorBufferHalfFloat", {
        get: function () {
            return this.extension(this.EXT_color_buffer_half_float, 'EXT_color_buffer_half_float');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsDisjointTimerQuery", {
        get: function () {
            return this.EXT_disjoint_timer_query_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "disjointTimerQuery", {
        get: function () {
            return this.extension(this.EXT_disjoint_timer_query, 'EXT_disjoint_timer_query');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsDisjointTimerQueryWebGL2", {
        get: function () {
            return this.EXT_disjoint_timer_query_webgl2_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "disjointTimerQueryWebGL2", {
        get: function () {
            return this.extension(this.EXT_disjoint_timer_query_webgl2, 'EXT_disjoint_timer_query_webgl2');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsFragDepth", {
        get: function () {
            return this.EXT_frag_depth_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "fragDepth", {
        get: function () {
            return this.extension(this.EXT_frag_depth, 'EXT_frag_depth');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsSRGB", {
        get: function () {
            return this.EXT_sRGB_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "sRGB", {
        get: function () {
            return this.extension(this.EXT_sRGB, 'EXT_sRGB');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsShaderTextureLOD", {
        get: function () {
            return this.EXT_shader_texture_lod_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "shaderTextureLOD", {
        get: function () {
            return this.extension(this.EXT_shader_texture_lod, 'EXT_shader_texture_lod');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsTextureFilterAnisotropic", {
        get: function () {
            return this.EXT_texture_filter_anisotropic_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "textureFilterAnisotropic", {
        get: function () {
            return this.extension(this.EXT_texture_filter_anisotropic, 'EXT_texture_filter_anisotropic');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsElementIndexUint", {
        get: function () {
            return this.OES_element_index_uint_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "elementIndexUint", {
        get: function () {
            return this.extension(this.OES_element_index_uint, 'OES_element_index_uint');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsStandardDerivatives", {
        get: function () {
            return this.OES_standard_derivatives_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "standardDerivatives", {
        get: function () {
            return this.extension(this.OES_standard_derivatives, 'OES_standard_derivatives');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsTextureFloat", {
        get: function () {
            return this.OES_texture_float_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "textureFloat", {
        get: function () {
            return this.extension(this.OES_texture_float, 'OES_texture_float');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsTextureFloatLinear", {
        get: function () {
            return this.OES_texture_float_linear_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "textureFloatLinear", {
        get: function () {
            return this.extension(this.OES_texture_float_linear, 'OES_texture_float_linear');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsTextureHalfFloat", {
        get: function () {
            return this.OES_texture_half_float_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "textureHalfFloat", {
        get: function () {
            return this.extension(this.OES_texture_half_float, 'OES_texture_half_float');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsTextureHalfFloatLinear", {
        get: function () {
            return this.OES_texture_half_float_linear_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "textureHalfFloatLinear", {
        get: function () {
            return this.extension(this.OES_texture_half_float_linear, 'OES_texture_half_float_linear');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsVertexArrayObject", {
        get: function () {
            return this.OES_vertex_array_object_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "vertexArrayObject", {
        get: function () {
            return this.extension(this.OES_vertex_array_object, 'OES_vertex_array_object');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsColorBufferFloat", {
        get: function () {
            switch (this._backend) {
                case Context.BackendType.WebGL1:
                    return this.WEBGL_color_buffer_float_supported;
                case Context.BackendType.WebGL2:
                    return this.EXT_color_buffer_float_supported;
                default:
                    return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "colorBufferFloat", {
        get: function () {
            switch (this._backend) {
                case Context.BackendType.WebGL1:
                    return this.extension(this.WEBGL_color_buffer_float, 'WEBGL_color_buffer_float');
                case Context.BackendType.WebGL2:
                    return this.extension(this.EXT_color_buffer_float, 'EXT_color_buffer_float');
                default:
                    return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTextureASTC", {
        get: function () {
            return this.WEBGL_compressed_texture_astc_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTextureASTC", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_astc, 'WEBGL_compressed_texture_astc');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTextureATC", {
        get: function () {
            return this.WEBGL_compressed_texture_atc_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTextureATC", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_atc, 'WEBGL_compressed_texture_atc');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTextureETC", {
        get: function () {
            return this.WEBGL_compressed_texture_etc_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTextureETC", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_etc, 'WEBGL_compressed_texture_etc');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTextureETC1", {
        get: function () {
            return this.WEBGL_compressed_texture_etc1_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTextureETC1", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_etc1, 'WEBGL_compressed_texture_etc1');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTexturePVRTC", {
        get: function () {
            return this.WEBGL_compressed_texture_pvrtc_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTexturePVRTC", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_pvrtc, 'WEBGL_compressed_texture_pvrtc');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTextureS3TC", {
        get: function () {
            return this.WEBGL_compressed_texture_s3tc_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTextureS3TC", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_s3tc, 'WEBGL_compressed_texture_s3tc');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsCompressedTextureS3TCSRGB", {
        get: function () {
            return this.WEBGL_compressed_texture_s3tc_srgb_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "compressedTextureS3TCSRGB", {
        get: function () {
            return this.extension(this.WEBGL_compressed_texture_s3tc_srgb, 'WEBGL_compressed_texture_s3tc_srgb');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsDebugRendererInfo", {
        get: function () {
            return this.WEBGL_debug_renderer_info_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "debugRendererInfo", {
        get: function () {
            return this.extension(this.WEBGL_debug_renderer_info, 'WEBGL_debug_renderer_info');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsDebugShaders", {
        get: function () {
            return this.WEBGL_debug_shaders_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "debugShaders", {
        get: function () {
            return this.extension(this.WEBGL_debug_shaders, 'WEBGL_debug_shaders');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsDepthTexture", {
        get: function () {
            return this.WEBGL_depth_texture_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "depthTexture", {
        get: function () {
            return this.extension(this.WEBGL_depth_texture, 'WEBGL_depth_texture');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsDrawBuffers", {
        get: function () {
            return this.WEBGL_draw_buffers_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "drawBuffers", {
        get: function () {
            return this.extension(this.WEBGL_draw_buffers, 'WEBGL_draw_buffers');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsLoseContext", {
        get: function () {
            return this.WEBGL_lose_context_supported;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "loseContext", {
        get: function () {
            return this.extension(this.WEBGL_lose_context, 'WEBGL_lose_context');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsBlitFramebuffer", {
        get: function () {
            return this._context.blitFramebuffer !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "supportsReadBuffer", {
        get: function () {
            return this._context.readBuffer !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Context.prototype.hash = function () {
        return extensionshash_1.ExtensionsHash.encode(this._backend, this._extensions);
    };
    Context.prototype.about = function () {
        if (this._backend === Context.BackendType.Invalid) {
            return new Array();
        }
        var pNamesAndValues = new Array();
        pNamesAndValues.push(['RENDERER',
            this._context.getParameter(this._context.RENDERER)]);
        pNamesAndValues.push(['VENDOR',
            this._context.getParameter(this._context.VENDOR)]);
        pNamesAndValues.push(['VERSION',
            this._context.getParameter(this._context.VERSION)]);
        pNamesAndValues.push(['SHADING_LANGUAGE_VERSION',
            this._context.getParameter(this._context.SHADING_LANGUAGE_VERSION)]);
        pNamesAndValues.push(['BACKEND (GLOPERATE)', this.backend]);
        pNamesAndValues.push(['CONTEXT_HASH (GLOPERATE)', this.hash()]);
        pNamesAndValues.push(['MAX_COMBINED_TEXTURE_IMAGE_UNITS',
            this._context.getParameter(this._context.MAX_COMBINED_TEXTURE_IMAGE_UNITS)]);
        pNamesAndValues.push(['MAX_CUBE_MAP_TEXTURE_SIZE',
            this._context.getParameter(this._context.MAX_CUBE_MAP_TEXTURE_SIZE)]);
        pNamesAndValues.push(['MAX_FRAGMENT_UNIFORM_VECTORS',
            this._context.getParameter(this._context.MAX_FRAGMENT_UNIFORM_VECTORS)]);
        pNamesAndValues.push(['MAX_RENDERBUFFER_SIZE',
            this._context.getParameter(this._context.MAX_RENDERBUFFER_SIZE)]);
        pNamesAndValues.push(['MAX_TEXTURE_IMAGE_UNITS',
            this._context.getParameter(this._context.MAX_TEXTURE_IMAGE_UNITS)]);
        pNamesAndValues.push(['MAX_TEXTURE_SIZE',
            this._context.getParameter(this._context.MAX_TEXTURE_SIZE)]);
        pNamesAndValues.push(['MAX_VARYING_VECTORS',
            this._context.getParameter(this._context.MAX_VARYING_VECTORS)]);
        pNamesAndValues.push(['MAX_VERTEX_ATTRIBS',
            this._context.getParameter(this._context.MAX_VERTEX_ATTRIBS)]);
        pNamesAndValues.push(['MAX_VERTEX_TEXTURE_IMAGE_UNITS',
            this._context.getParameter(this._context.MAX_VERTEX_TEXTURE_IMAGE_UNITS)]);
        pNamesAndValues.push(['MAX_VERTEX_UNIFORM_VECTORS',
            this._context.getParameter(this._context.MAX_VERTEX_UNIFORM_VECTORS)]);
        var MAX_VIEWPORT_DIMS = this._context.getParameter(this._context.MAX_VIEWPORT_DIMS);
        pNamesAndValues.push(['MAX_VIEWPORT_DIMS (WIDTH)', MAX_VIEWPORT_DIMS[0]]);
        pNamesAndValues.push(['MAX_VIEWPORT_DIMS (HEIGHT)', MAX_VIEWPORT_DIMS[1]]);
        if (this.isWebGL2) {
            pNamesAndValues.push(['MAX_3D_TEXTURE_SIZE',
                this._context.getParameter(this._context.MAX_3D_TEXTURE_SIZE)]);
            pNamesAndValues.push(['MAX_ARRAY_TEXTURE_LAYERS',
                this._context.getParameter(this._context.MAX_ARRAY_TEXTURE_LAYERS)]);
            pNamesAndValues.push(['MAX_CLIENT_WAIT_TIMEOUT_WEBGL',
                this._context.getParameter(this._context.MAX_CLIENT_WAIT_TIMEOUT_WEBGL)]);
            pNamesAndValues.push(['MAX_COLOR_ATTACHMENTS',
                this._context.getParameter(this._context.MAX_COLOR_ATTACHMENTS)]);
            pNamesAndValues.push(['MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS',
                this._context.getParameter(this._context.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS)]);
            pNamesAndValues.push(['MAX_COMBINED_UNIFORM_BLOCKS',
                this._context.getParameter(this._context.MAX_COMBINED_UNIFORM_BLOCKS)]);
            pNamesAndValues.push(['MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS',
                this._context.getParameter(this._context.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS)]);
            pNamesAndValues.push(['MAX_DRAW_BUFFERS',
                this._context.getParameter(this._context.MAX_DRAW_BUFFERS)]);
            pNamesAndValues.push(['MAX_ELEMENT_INDEX',
                this._context.getParameter(this._context.MAX_ELEMENT_INDEX)]);
            pNamesAndValues.push(['MAX_ELEMENTS_INDICES',
                this._context.getParameter(this._context.MAX_ELEMENTS_INDICES)]);
            pNamesAndValues.push(['MAX_ELEMENTS_VERTICES',
                this._context.getParameter(this._context.MAX_ELEMENTS_VERTICES)]);
            pNamesAndValues.push(['MAX_FRAGMENT_INPUT_COMPONENTS',
                this._context.getParameter(this._context.MAX_FRAGMENT_INPUT_COMPONENTS)]);
            pNamesAndValues.push(['MAX_FRAGMENT_UNIFORM_BLOCKS',
                this._context.getParameter(this._context.MAX_FRAGMENT_UNIFORM_BLOCKS)]);
            pNamesAndValues.push(['MAX_FRAGMENT_UNIFORM_COMPONENTS',
                this._context.getParameter(this._context.MAX_FRAGMENT_UNIFORM_COMPONENTS)]);
            pNamesAndValues.push(['MAX_PROGRAM_TEXEL_OFFSET',
                this._context.getParameter(this._context.MAX_PROGRAM_TEXEL_OFFSET)]);
            pNamesAndValues.push(['MAX_SAMPLES',
                this._context.getParameter(this._context.MAX_SAMPLES)]);
            pNamesAndValues.push(['MAX_SERVER_WAIT_TIMEOUT',
                this._context.getParameter(this._context.MAX_SERVER_WAIT_TIMEOUT)]);
            pNamesAndValues.push(['MAX_TEXTURE_LOD_BIAS',
                this._context.getParameter(this._context.MAX_TEXTURE_LOD_BIAS)]);
            pNamesAndValues.push(['MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS',
                this._context.getParameter(this._context.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS)]);
            pNamesAndValues.push(['MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS',
                this._context.getParameter(this._context.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)]);
            pNamesAndValues.push(['MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS',
                this._context.getParameter(this._context.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS)]);
            pNamesAndValues.push(['MAX_UNIFORM_BLOCK_SIZE',
                this._context.getParameter(this._context.MAX_UNIFORM_BLOCK_SIZE)]);
            pNamesAndValues.push(['MAX_UNIFORM_BUFFER_BINDINGS',
                this._context.getParameter(this._context.MAX_UNIFORM_BUFFER_BINDINGS)]);
            pNamesAndValues.push(['MAX_VARYING_COMPONENTS',
                this._context.getParameter(this._context.MAX_VARYING_COMPONENTS)]);
            pNamesAndValues.push(['MAX_VERTEX_OUTPUT_COMPONENTS',
                this._context.getParameter(this._context.MAX_VERTEX_OUTPUT_COMPONENTS)]);
            pNamesAndValues.push(['MAX_VERTEX_UNIFORM_BLOCKS',
                this._context.getParameter(this._context.MAX_VERTEX_UNIFORM_BLOCKS)]);
            pNamesAndValues.push(['MAX_VERTEX_UNIFORM_COMPONENTS',
                this._context.getParameter(this._context.MAX_VERTEX_UNIFORM_COMPONENTS)]);
            pNamesAndValues.push(['MIN_PROGRAM_TEXEL_OFFSET',
                this._context.getParameter(this._context.MIN_PROGRAM_TEXEL_OFFSET)]);
        }
        if (this.isWebGL1) {
            for (var _i = 0, WEBGL1_EXTENSIONS_1 = extensions_1.WEBGL1_EXTENSIONS; _i < WEBGL1_EXTENSIONS_1.length; _i++) {
                var extension = WEBGL1_EXTENSIONS_1[_i];
                pNamesAndValues.push([extension, this.supports(extension) ? 'ok' : '']);
            }
        }
        else if (this.isWebGL2) {
            for (var _a = 0, WEBGL2_DEFAULT_EXTENSIONS_1 = extensions_1.WEBGL2_DEFAULT_EXTENSIONS; _a < WEBGL2_DEFAULT_EXTENSIONS_1.length; _a++) {
                var extension = WEBGL2_DEFAULT_EXTENSIONS_1[_a];
                pNamesAndValues.push([extension + " (default)", 'ok']);
            }
            for (var _b = 0, WEBGL2_EXTENSIONS_1 = extensions_1.WEBGL2_EXTENSIONS; _b < WEBGL2_EXTENSIONS_1.length; _b++) {
                var extension = WEBGL2_EXTENSIONS_1[_b];
                pNamesAndValues.push([extension, this.supports(extension) ? 'ok' : '']);
            }
        }
        return pNamesAndValues;
    };
    Context.prototype.logAbout = function (verbosity) {
        if (verbosity === void 0) { verbosity = auxiliaries_1.LogLevel.Dev; }
        var about = this.about();
        var maxPNameLength = 0;
        for (var _i = 0, about_1 = about; _i < about_1.length; _i++) {
            var tuple = about_1[_i];
            maxPNameLength = Math.max(tuple[0].length, maxPNameLength);
        }
        var index = 0;
        var message = "about\n\n";
        var extensionSeparator = this.isWebGL2 ? 46 + extensions_1.WEBGL2_DEFAULT_EXTENSIONS.length : -1;
        for (var _a = 0, about_2 = about; _a < about_2.length; _a++) {
            var tuple = about_2[_a];
            switch (index) {
                case 4:
                case 6:
                case 18:
                case 46:
                case extensionSeparator:
                    message += "\n";
                    break;
                default:
                    break;
            }
            message += "  " + tuple[0] + " " + '-'.repeat(maxPNameLength - tuple[0].length) + "-- " + tuple[1] + "\n";
            ++index;
        }
        message += "\n";
        auxiliaries_1.log(verbosity, message);
    };
    Context.CONTEXT_ATTRIBUTES = {
        alpha: true,
        antialias: false,
        depth: false,
        failIfMajorPerformanceCaveat: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: false,
    };
    return Context;
}());
exports.Context = Context;
(function (Context) {
    var BackendType;
    (function (BackendType) {
        BackendType["Invalid"] = "invalid";
        BackendType["WebGL1"] = "webgl1";
        BackendType["WebGL2"] = "webgl2";
    })(BackendType = Context.BackendType || (Context.BackendType = {}));
    var BackendRequestType;
    (function (BackendRequestType) {
        BackendRequestType["auto"] = "auto";
        BackendRequestType["webgl"] = "webgl";
        BackendRequestType["experimental"] = "experimental-webgl";
        BackendRequestType["webgl1"] = "webgl1";
        BackendRequestType["experimental1"] = "experimental-webgl1";
        BackendRequestType["webgl2"] = "webgl2";
        BackendRequestType["experimental2"] = "experimental-webgl2";
    })(BackendRequestType = Context.BackendRequestType || (Context.BackendRequestType = {}));
})(Context = exports.Context || (exports.Context = {}));
exports.Context = Context;


/***/ }),

/***/ "./contextmasquerade.ts":
/*!******************************!*\
  !*** ./contextmasquerade.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var extensionshash_1 = __webpack_require__(/*! ./extensionshash */ "./extensionshash.ts");
var ContextMasquerade = (function () {
    function ContextMasquerade() {
        this._extensionsStrive = new Array();
        this._extensionsConceal = new Array();
        this._functionsUndefine = new Array();
    }
    ContextMasquerade.fromHash = function (hash) {
        var mask = new ContextMasquerade();
        var tuple = extensionshash_1.ExtensionsHash.decode(hash);
        mask._backend = tuple[0];
        mask._extensionsStrive = tuple[1];
        mask._extensionsConceal = extensionshash_1.ExtensionsHash.complement(mask._backend, mask._extensionsStrive);
        return mask;
    };
    ContextMasquerade.fromPreset = function (identifier) {
        var mask = new ContextMasquerade();
        var identifiers = new Array();
        var preset;
        for (var _i = 0, _a = ContextMasquerade.presets(); _i < _a.length; _i++) {
            var p = _a[_i];
            identifiers.push(p.identifier);
            if (p.identifier !== identifier) {
                continue;
            }
            preset = p;
            break;
        }
        if (preset === undefined) {
            auxiliaries_1.assert(false, "expected valid identifier, available ['" + identifiers.join('\', \'') + "'], given '" + identifier + "'");
            return mask;
        }
        preset = preset;
        if (preset.extensions_hash !== undefined) {
            var tuple = extensionshash_1.ExtensionsHash.decode(preset.extensions_hash);
            mask._backend = tuple[0];
            mask._extensionsStrive = tuple[1];
        }
        else {
            mask._backend = preset.backend;
            mask._extensionsConceal = preset.extensions_conceal;
            mask._extensionsStrive = preset.extensions_strive;
        }
        mask._functionsUndefine = preset.functions_undefine;
        auxiliaries_1.assert(mask._backend !== undefined, 'expected backend to be included in preset');
        if (mask._extensionsStrive === undefined) {
            mask._extensionsStrive = [];
        }
        else {
            mask._extensionsConceal = extensionshash_1.ExtensionsHash.complement(mask._backend, mask._extensionsStrive);
        }
        if (mask._extensionsConceal === undefined) {
            mask._extensionsConceal = [];
        }
        if (mask._functionsUndefine === undefined) {
            mask._functionsUndefine = [];
        }
        return mask;
    };
    ContextMasquerade.fromGET = function () {
        var msqrdHash = auxiliaries_1.GETparameter('msqrd_h');
        if (msqrdHash !== undefined) {
            return ContextMasquerade.fromHash(msqrdHash);
        }
        var msqrdPreset = auxiliaries_1.GETparameter('msqrd_p');
        if (msqrdPreset !== undefined) {
            return ContextMasquerade.fromPreset(msqrdPreset);
        }
        return undefined;
    };
    ContextMasquerade.presets = function () {
        return this.MASQUERADE_JSON.presets;
    };
    Object.defineProperty(ContextMasquerade.prototype, "backend", {
        get: function () {
            return this._backend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMasquerade.prototype, "extensionsStrive", {
        get: function () {
            return this._extensionsStrive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMasquerade.prototype, "extensionsConceal", {
        get: function () {
            return this._extensionsConceal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMasquerade.prototype, "functionsUndefine", {
        get: function () {
            return this._functionsUndefine;
        },
        enumerable: true,
        configurable: true
    });
    ContextMasquerade.MASQUERADE_JSON = __webpack_require__(/*! ./data/masquerade.json */ "./data/masquerade.json");
    return ContextMasquerade;
}());
exports.ContextMasquerade = ContextMasquerade;


/***/ }),

/***/ "./controller.ts":
/*!***********************!*\
  !*** ./controller.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = __webpack_require__(/*! rxjs/ReplaySubject */ "rxjs/ReplaySubject");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var Controller = (function () {
    function Controller() {
        this._batchSize = 1;
        this._debug = false;
        this._multiFrameNumber = 1;
        this._multiFrameNumberSubject = new ReplaySubject_1.ReplaySubject(1);
        this._debugFrameNumber = 0;
        this._debugFrameNumberSubject = new ReplaySubject_1.ReplaySubject(1);
        this._frameNumber = 0;
        this._frameNumberSubject = new ReplaySubject_1.ReplaySubject(1);
        this._pendingRequest = 0;
        this._pause = false;
        this._block = false;
        this._blockedUpdates = 0;
        this._intermediateFrameCount = 0;
        this._multiFrameCount = 0;
        this._intermediateFrameTimes = new Array(2);
        this._multiTime = [0.0, 0.0];
    }
    Object.defineProperty(Controller.prototype, "batch", {
        set: function (size) {
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "(adaptive) batch multi-frame rendering is experimental for now");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "debug", {
        set: function (value) {
            this._debug = value;
        },
        enumerable: true,
        configurable: true
    });
    Controller.prototype.request = function (type) {
        var _this = this;
        if (this._pendingRequest !== 0) {
            auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c request (ignored) | pending: '" + this._pendingRequest + "'");
            return;
        }
        if (this._pause || !this._controllable) {
            auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c request (ignored) | pending: '" + this._pendingRequest + "'");
            return;
        }
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c request           | intermediates: #" + this._frameNumber);
        var dfnum = this._debugFrameNumber;
        var mfnum = this._multiFrameNumber;
        auxiliaries_1.assert(dfnum <= mfnum, "debug-frame number exceeds multi-frame number");
        auxiliaries_1.assert(this._pendingRequest === 0, "another request is pending, cannot invoke multiple requests");
        if (dfnum > 0 && this._frameNumber >= dfnum) {
            this.pause();
        }
        var numRemainingIntermediates = Math.max((dfnum > 0 ? dfnum : mfnum) - this._frameNumber, 0);
        if (type !== undefined) {
            this._pendingRequest = window.requestAnimationFrame(function () { return _this.invoke(type); });
        }
        else if (numRemainingIntermediates > 0) {
            this._pendingRequest = window.requestAnimationFrame(function () { return _this.invoke(Controller.RequestType.Frame); });
        }
        else if (dfnum === mfnum || dfnum === 0) {
            ++this._multiFrameCount;
        }
    };
    Controller.prototype.reset = function () {
        var block = this._block || (this._frameNumber === 0 && this._pendingRequest);
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c update  " + (block ? '(blocked) ' : '          ') + "| " +
            ("pending: '" + this._pendingRequest + "', intermediates: #" + this._frameNumber));
        if (block) {
            ++this._blockedUpdates;
            return true;
        }
        this.cancel();
        return false;
    };
    Controller.prototype.cancel = function () {
        if (this._pendingRequest === 0) {
            auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c cancel  (ignored) |");
            return;
        }
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c cancel            | pending: '" + this._pendingRequest + "'");
        window.cancelAnimationFrame(this._pendingRequest);
        this._pendingRequest = 0;
    };
    Controller.prototype.invoke = function (type) {
        auxiliaries_1.assert(this._pendingRequest !== 0, "manual/explicit invocation not anticipated");
        auxiliaries_1.assert(this._controllable !== undefined, "expected valid controllable for invocation");
        this._pendingRequest = 0;
        switch (type) {
            case Controller.RequestType.Update:
                this.invokeUpdate(false);
                break;
            case Controller.RequestType.NonOptionalUpdate:
                this.invokeUpdate(true);
                break;
            case Controller.RequestType.Prepare:
                this.invokePrepare();
                break;
            case Controller.RequestType.Frame:
                this.invokeFrame();
                break;
        }
    };
    Controller.prototype.invokeUpdate = function (force) {
        if (force === void 0) { force = false; }
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c invoke update     | " +
            ("pending: '" + this._pendingRequest + "', mfnum: " + this._multiFrameNumber));
        this.unblock();
        auxiliaries_1.assert(!this._pause, "updates should not be invoked when paused");
        var redraw = this._controllable.update(this._multiFrameNumber);
        if (force || redraw) {
            this.invokePrepare();
            return;
        }
        this.invokeFrame();
    };
    Controller.prototype.invokePrepare = function () {
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c invoke prepare    |");
        this._frameNumber = 0;
        this._pause = false;
        this._pauseTime = undefined;
        this._multiFrameTime = 0.0;
        this._intermediateFrameTimes[0] = Number.MAX_VALUE;
        this._intermediateFrameTimes[1] = Number.MIN_VALUE;
        this._multiTime[0] = performance.now();
        this._controllable.prepare();
        this._multiTime[1] = performance.now();
        var updateDuration = this._multiTime[1] - this._multiTime[0];
        this._multiFrameTime = updateDuration;
        this._updateFrameTime = updateDuration;
        this.invokeFrame();
    };
    Controller.prototype.invokeFrame = function () {
        auxiliaries_1.assert(!this._pause, "frames should not be invoked when paused");
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c invoke frame      | pending: '" + this._pendingRequest + "'");
        var dfnum = this._debugFrameNumber;
        var mfnum = this._multiFrameNumber;
        if (this._frameNumber === mfnum) {
            return;
        }
        var debug = dfnum > 0;
        auxiliaries_1.assert(!debug || this._frameNumber < dfnum, "frame number about to exceed debug-frame number");
        auxiliaries_1.assert(this._controllable !== undefined, "update invoked without controllable set");
        var t0 = performance.now();
        var batchEnd = Math.min(this._multiFrameNumber, this._frameNumber + this._batchSize);
        if (this._debugFrameNumber > 0) {
            batchEnd = Math.min(batchEnd, this._debugFrameNumber);
        }
        for (; this._frameNumber < batchEnd; ++this._frameNumber) {
            auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c -> frame          | frame: " + this._frameNumber);
            this._controllable.frame(this._frameNumber);
            ++this._intermediateFrameCount;
        }
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c -> swap           |");
        this._controllable.swap();
        this._multiTime[1] = performance.now();
        var frameDuration = this._multiTime[1] - t0;
        this._multiFrameTime += frameDuration;
        this._intermediateFrameTimes[0] = Math.min(this._intermediateFrameTimes[0], frameDuration);
        this._intermediateFrameTimes[1] = Math.max(this._intermediateFrameTimes[1], frameDuration);
        this.frameNumberNext();
        this.request();
    };
    Controller.prototype.multiFrameNumberNext = function () {
        this._multiFrameNumberSubject.next(this._multiFrameNumber);
    };
    Controller.prototype.debugFrameNumberNext = function () {
        this._debugFrameNumberSubject.next(this._debugFrameNumber);
    };
    Controller.prototype.frameNumberNext = function () {
        this._frameNumberSubject.next(this._frameNumber);
    };
    Controller.prototype.pause = function () {
        var ignore = this._pause;
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c pause   " + (ignore ? '(ignored)' : ''));
        if (this._pause) {
            return;
        }
        this._pause = true;
        this._pauseTime = performance.now();
        this.cancel();
    };
    Controller.prototype.unpause = function () {
        var ignore = !this._pause;
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c unpause " + (ignore ? '(ignored)' : ''));
        if (ignore) {
            return;
        }
        this._pause = false;
        if (this._pauseTime !== undefined && !isNaN(this._pauseTime)) {
            var pauseDelay = performance.now() - this._pauseTime;
            this._multiTime[0] += pauseDelay;
            this._multiTime[1] += pauseDelay;
        }
        this.request();
    };
    Controller.prototype.update = function (force) {
        if (force === void 0) { force = false; }
        if (this.reset()) {
            return;
        }
        this.request(force ? Controller.RequestType.NonOptionalUpdate : Controller.RequestType.Update);
    };
    Controller.prototype.prepare = function () {
        if (this.reset()) {
            return;
        }
        this.request(Controller.RequestType.Prepare);
    };
    Controller.prototype.block = function () {
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c block   " + (this._block ? '(ignored) ' : '          ') + "|");
        if (this._block) {
            return;
        }
        this._block = true;
    };
    Controller.prototype.unblock = function () {
        auxiliaries_1.logIf(this._debug, auxiliaries_1.LogLevel.ModuleDev, "c unblock " + (!this._block ? '(ignored) ' : '          ') +
            ("| blocked: #" + this._blockedUpdates));
        if (!this._block) {
            return;
        }
        this._block = false;
        if (this._blockedUpdates > 0) {
            this._blockedUpdates = 0;
            this.update();
        }
    };
    Object.defineProperty(Controller.prototype, "paused", {
        get: function () {
            return this._pause;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "blocked", {
        get: function () {
            return this._block;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "controllable", {
        set: function (controllable) {
            if (controllable === this._controllable) {
                return;
            }
            this._controllable = controllable;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "multiFrameNumber", {
        get: function () {
            return this._multiFrameNumber;
        },
        set: function (multiFrameNumber) {
            var value = Math.max(1, isNaN(multiFrameNumber) ? 1 : multiFrameNumber);
            if (value === this._multiFrameNumber) {
                return;
            }
            this._multiFrameNumber = value;
            this.multiFrameNumberNext();
            auxiliaries_1.logIf(value !== multiFrameNumber, auxiliaries_1.LogLevel.ModuleDev, "multi-frame number adjusted to " + value + ", given " + multiFrameNumber);
            if (this.debugFrameNumber > this.multiFrameNumber) {
                this.debugFrameNumber = this.multiFrameNumber;
            }
            else {
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "multiFrameNumberObservable", {
        get: function () {
            return this._multiFrameNumberSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "debugFrameNumber", {
        get: function () {
            return this._debugFrameNumber;
        },
        set: function (debugFrameNumber) {
            var value = gl_matrix_extensions_1.clamp(isNaN(debugFrameNumber) ? 0 : debugFrameNumber, 0, this.multiFrameNumber);
            if (value === this._debugFrameNumber) {
                return;
            }
            this._debugFrameNumber = value;
            this.debugFrameNumberNext();
            auxiliaries_1.logIf(value !== debugFrameNumber, auxiliaries_1.LogLevel.ModuleDev, "debug-frame number adjusted to " + value + ", given " + debugFrameNumber);
            if (this._block) {
                return;
            }
            if (this.debugFrameNumber < this._frameNumber) {
                this.prepare();
            }
            else if (!this._pendingRequest) {
                this.unpause();
                this.request();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "debugFrameNumberObservable", {
        get: function () {
            return this._debugFrameNumberSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "frameNumber", {
        get: function () {
            return this._frameNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "frameNumberObservable", {
        get: function () {
            return this._frameNumberSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "intermediateFrameCount", {
        get: function () {
            return this._intermediateFrameCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "multiFrameCount", {
        get: function () {
            return this._multiFrameCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "averageFrameTime", {
        get: function () {
            return this._frameNumber === 0 ? 0.0 : this._multiFrameTime / this._frameNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "updateFrameTime", {
        get: function () {
            return this._updateFrameTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "minimumFrameTime", {
        get: function () {
            return this._intermediateFrameTimes[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "maximumFrameTime", {
        get: function () {
            return this._intermediateFrameTimes[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "multiFrameTime", {
        get: function () {
            return this._frameNumber === 0 ? 0.0 : this._multiTime[1] - this._multiTime[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "framesPerSecond", {
        get: function () {
            return this._frameNumber === 0 ? 0.0 : 1000.0 / (this.multiFrameTime / this._frameNumber);
        },
        enumerable: true,
        configurable: true
    });
    return Controller;
}());
exports.Controller = Controller;
(function (Controller) {
    var RequestType;
    (function (RequestType) {
        RequestType[RequestType["Update"] = 0] = "Update";
        RequestType[RequestType["NonOptionalUpdate"] = 1] = "NonOptionalUpdate";
        RequestType[RequestType["Prepare"] = 2] = "Prepare";
        RequestType[RequestType["Frame"] = 3] = "Frame";
    })(RequestType = Controller.RequestType || (Controller.RequestType = {}));
})(Controller = exports.Controller || (exports.Controller = {}));
exports.Controller = Controller;


/***/ }),

/***/ "./data/goldenset08.json":
/*!*******************************!*\
  !*** ./data/goldenset08.json ***!
  \*******************************/
/*! exports provided: kernel, size, default */
/***/ (function(module) {

module.exports = {"kernel":[[[[-0.41692,-0.0735727],[0.201114,0.0165974],[-0.0906823,-0.219471],[0.437182,0.252665],[-0.180852,0.162495],[0.291284,-0.365369],[0.0552157,0.398563],[-0.32675,-0.455539]]]],"size":{"depth":1,"height":1,"width":8}};

/***/ }),

/***/ "./data/goldenset64.json":
/*!*******************************!*\
  !*** ./data/goldenset64.json ***!
  \*******************************/
/*! exports provided: kernel, size, default */
/***/ (function(module) {

module.exports = {"kernel":[[[[-0.49667,0.0980561],[-0.0589763,0.0210422],[0.370588,-0.29204],[0.259132,0.381722],[0.447602,-0.20187],[-0.449072,-0.0478419],[0.0656358,-0.0346857],[-0.31633,-0.485536],[0.13452,0.43745],[0.301704,0.235824],[0.190248,-0.0904137],[0.245976,-0.236312],[-0.247446,-0.0133998],[0.100078,0.201382],[-0.350772,0.278396],[-0.0245342,0.25711],[0.357432,0.0899264],[0.31486,-0.146142],[0.168962,-0.326482],[-0.358902,-0.339638],[-0.4065,-0.19374],[0.482044,0.0341984],[0.121364,-0.180584],[0.22469,0.145654],[-0.427786,0.188226],[-0.22616,-0.395366],[0.336146,0.471892],[-0.157276,-0.305196],[0.0311937,-0.270754],[-0.191718,0.458736],[0.155806,0.0554843],[0.211534,-0.47238],[-0.011378,-0.124856],[0.078792,-0.416652],[-0.260602,0.368566],[-0.337616,-0.10357],[-0.0458201,-0.360924],[-0.213004,0.222668],[-0.0802622,-0.215026],[-0.204874,-0.159298],[-0.101548,0.16694],[-0.393344,0.424294],[0.426316,0.180096],[-0.170432,0.0767702],[-0.372058,0.0423281],[-0.483514,-0.28391],[-0.114704,-0.451094],[-0.122834,-0.0691278],[-0.067106,0.403008],[-0.13599,0.312838],[-0.303174,0.132498],[0.177092,0.291552],[-0.462228,0.334124],[0.460758,0.416164],[-0.281888,-0.249468],[0.267262,-0.000243664],[0.00990784,0.493178],[0.0443499,0.34728],[0.41316,-0.437938],[0.40503,-0.0559716],[0.391874,0.325994],[-0.440942,-0.429808],[0.023064,0.111212],[0.280418,-0.38221]]]],"size":{"depth":1,"height":1,"width":64}};

/***/ }),

/***/ "./data/masquerade.json":
/*!******************************!*\
  !*** ./data/masquerade.json ***!
  \******************************/
/*! exports provided: presets, default */
/***/ (function(module) {

module.exports = {"presets":[{"identifier":"chrome-63","backend":"webgl2","extensions_strive":["EXT_color_buffer_float","EXT_disjoint_timer_query_webgl2","EXT_texture_filter_anisotropic","OES_texture_float_linear","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_debug_renderer_info","WEBGL_debug_shaders","WEBGL_lose_context"]},{"identifier":"edge-41","backend":"webgl1","extensions_strive":["ANGLE_instanced_arrays","EXT_frag_depth","EXT_texture_filter_anisotropic","OES_texture_float","OES_texture_float_linear","OES_standard_derivatives","OES_element_index_uint","OES_texture_half_float","OES_texture_half_float_linear","WEBGL_compressed_texture_s3tc","WEBGL_debug_renderer_info","WEBGL_depth_texture"]},{"identifier":"ie-11","backend":"webgl1","extensions_strive":["ANGLE_instanced_arrays","EXT_texture_filter_anisotropic","OES_texture_float","OES_texture_float_linear","OES_standard_derivatives","OES_element_index_uint","WEBGL_compressed_texture_s3tc","WEBGL_debug_renderer_info"]},{"identifier":"firefox-57","backend":"webgl2","extensions_strive":["EXT_color_buffer_float","EXT_texture_filter_anisotropic","EXT_disjoint_timer_query","OES_texture_float_linear","WEBGL_compressed_texture_s3tc","WEBGL_debug_renderer_info","WEBGL_debug_shaders","WEBGL_lose_context","MOZ_WEBGL_lose_context","MOZ_WEBGL_compressed_texture_s3tc"]},{"identifier":"safari-10.1","backend":"webgl1","extensions_strive":["compressed_texture_pvrtc","compressed_texture_s3tc","debug_renderer_info","disjoint_timer_query","draw_buffers","element_index_uint","frag_depth","instanced_arrays","lose_context","sRGB","shader_texture_lod","standard_derivatives","texture_filter_anisotropic","texture_float","texture_float_linear","texture_half_float","texture_half_float_linear","vertex_array_object"],"functions_undefine":["readBuffer"]},{"identifier":"no-WEBGL_draw_buffers","backend":"webgl1","extensions_conceal":["WEBGL_draw_buffers"]},{"identifier":"no-readBuffer","extensions_hash":"100000","functions_undefine":["readBuffer"]},{"identifier":"webgl1","extensions_hash":"1+++++"},{"identifier":"webgl2","extensions_hash":"2+++++"}]};

/***/ }),

/***/ "./debug/testnavigation.ts":
/*!*********************************!*\
  !*** ./debug/testnavigation.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var eventhandler_1 = __webpack_require__(/*! ../eventhandler */ "./eventhandler.ts");
var TestNavigation = (function () {
    function TestNavigation(invalidate, mouseEventProvider) {
        var _this = this;
        this._altered = false;
        this._eventHandler = new eventhandler_1.EventHandler(invalidate, mouseEventProvider);
        this._eventHandler.pushMouseEnterHandler(function (latests, previous) {
            return _this.onMouseEnter(latests, previous);
        });
        this._eventHandler.pushMouseLeaveHandler(function (latests, previous) {
            return _this.onMouseLeave(latests, previous);
        });
    }
    TestNavigation.prototype.onMouseEnter = function (latests, previous) {
        this._altered = false;
    };
    TestNavigation.prototype.onMouseLeave = function (latests, previous) {
        this._altered = true;
    };
    TestNavigation.prototype.update = function () {
        this._eventHandler.update();
    };
    TestNavigation.prototype.reset = function () {
        this._altered = false;
    };
    Object.defineProperty(TestNavigation.prototype, "altered", {
        get: function () {
            return this._altered;
        },
        enumerable: true,
        configurable: true
    });
    return TestNavigation;
}());
exports.TestNavigation = TestNavigation;


/***/ }),

/***/ "./debug/testrenderer.frag":
/*!*********************************!*\
  !*** ./debug/testrenderer.frag ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n    #define texture(sampler, coord) texture2D(sampler, coord)\n#else \n    #define varying in\n#endif\n\n\n\n#if __VERSION__ == 100\n    #define fragColor gl_FragColor\n    #extension GL_OES_standard_derivatives : enable\n#else \n    layout(location = 0) out vec4 fragColor;\n#endif\n\nuniform int u_frameNumber;\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    vec3 color = vec3(28.0 / 255.0, 117.0 / 255.0, 188.0 / 255.0);\n    color += (vec3(0.0, v_uv) - 0.5) * 0.125;\n\n    vec2 awidth = fwidth(v_uv) * (sin(float(u_frameNumber) * 0.1) * 7.0 + 8.0);\n    vec2 cstep = abs(step(awidth, v_uv) - step(awidth, 1.0 - v_uv));\n    if(!any(bvec2(cstep))) {\n        discard;\n    }\n    fragColor = vec4(color, 1.0); \n}\n"

/***/ }),

/***/ "./debug/testrenderer.ts":
/*!*******************************!*\
  !*** ./debug/testrenderer.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var auxiliaries_1 = __webpack_require__(/*! ../auxiliaries */ "./auxiliaries.ts");
var accumulatepass_1 = __webpack_require__(/*! ../accumulatepass */ "./accumulatepass.ts");
var antialiasingkernel_1 = __webpack_require__(/*! ../antialiasingkernel */ "./antialiasingkernel.ts");
var blitpass_1 = __webpack_require__(/*! ../blitpass */ "./blitpass.ts");
var defaultframebuffer_1 = __webpack_require__(/*! ../defaultframebuffer */ "./defaultframebuffer.ts");
var framebuffer_1 = __webpack_require__(/*! ../framebuffer */ "./framebuffer.ts");
var ndcfillingtriangle_1 = __webpack_require__(/*! ../ndcfillingtriangle */ "./ndcfillingtriangle.ts");
var program_1 = __webpack_require__(/*! ../program */ "./program.ts");
var renderbuffer_1 = __webpack_require__(/*! ../renderbuffer */ "./renderbuffer.ts");
var renderer_1 = __webpack_require__(/*! ../renderer */ "./renderer.ts");
var shader_1 = __webpack_require__(/*! ../shader */ "./shader.ts");
var texture2_1 = __webpack_require__(/*! ../texture2 */ "./texture2.ts");
var testnavigation_1 = __webpack_require__(/*! ./testnavigation */ "./debug/testnavigation.ts");
var debug;
(function (debug) {
    var TestRenderer = (function (_super) {
        __extends(TestRenderer, _super);
        function TestRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._extensions = false;
            return _this;
        }
        TestRenderer.prototype.onInitialize = function (context, callback, mouseEventProvider) {
            var _this = this;
            var gl = this._context.gl;
            var gl2facade = this._context.gl2facade;
            if (this._extensions === false && this._context.isWebGL1) {
                auxiliaries_1.assert(this._context.supportsStandardDerivatives, "expected OES_standard_derivatives support");
                this._context.standardDerivatives;
                this._extensions = true;
            }
            var vert = new shader_1.Shader(this._context, gl.VERTEX_SHADER, 'testrenderer.vert');
            vert.initialize(__webpack_require__(/*! ./testrenderer.vert */ "./debug/testrenderer.vert"));
            var frag = new shader_1.Shader(this._context, gl.FRAGMENT_SHADER, 'testrenderer.frag');
            frag.initialize(__webpack_require__(/*! ./testrenderer.frag */ "./debug/testrenderer.frag"));
            this._program = new program_1.Program(this._context);
            this._program.initialize([vert, frag]);
            this._uNdcOffset = this._program.uniform('u_ndcOffset');
            this._uFrameNumber = this._program.uniform('u_frameNumber');
            this._ndcTriangle = new ndcfillingtriangle_1.NdcFillingTriangle(this._context);
            var aVertex = this._program.attribute('a_vertex', 0);
            this._ndcTriangle.initialize(aVertex);
            this._ndcOffsetKernel = new antialiasingkernel_1.AntiAliasingKernel(this._multiFrameNumber);
            this._defaultFBO = new defaultframebuffer_1.DefaultFramebuffer(this._context, 'DefaultFBO');
            this._defaultFBO.initialize();
            this._colorRenderTexture = new texture2_1.Texture2(this._context, 'ColorRenderTexture');
            this._depthRenderbuffer = new renderbuffer_1.Renderbuffer(this._context, 'DepthRenderbuffer');
            this._intermediateFBO = new framebuffer_1.Framebuffer(this._context, 'IntermediateFBO');
            this._accumulate = new accumulatepass_1.AccumulatePass(this._context);
            this._accumulate.initialize(this._ndcTriangle);
            this._accumulate.precision = this._framePrecision;
            this._accumulate.texture = this._colorRenderTexture;
            this._blit = new blitpass_1.BlitPass(this._context);
            this._blit.initialize(this._ndcTriangle);
            this._blit.readBuffer = gl2facade.COLOR_ATTACHMENT0;
            this._blit.drawBuffer = gl.BACK;
            this._blit.target = this._defaultFBO;
            this._testNavigation = new testnavigation_1.TestNavigation(function () { return _this.invalidate(); }, mouseEventProvider);
            return true;
        };
        TestRenderer.prototype.onUninitialize = function () {
            _super.prototype.uninitialize.call(this);
            this._uNdcOffset = -1;
            this._uFrameNumber = -1;
            this._program.uninitialize();
            this._ndcTriangle.uninitialize();
            this._intermediateFBO.uninitialize();
            this._defaultFBO.uninitialize();
            this._colorRenderTexture.uninitialize();
            this._depthRenderbuffer.uninitialize();
            this._blit.uninitialize();
        };
        TestRenderer.prototype.onUpdate = function () {
            this._testNavigation.update();
            var redraw = this._testNavigation.altered;
            this._testNavigation.reset();
            if (!redraw && !this._altered.any) {
                return false;
            }
            if (this._altered.multiFrameNumber) {
                this._ndcOffsetKernel.width = this._multiFrameNumber;
            }
            return redraw;
        };
        TestRenderer.prototype.onPrepare = function () {
            var gl = this._context.gl;
            var gl2facade = this._context.gl2facade;
            if (!this._intermediateFBO.initialized) {
                this._colorRenderTexture.initialize(this._frameSize[0], this._frameSize[1], this._context.isWebGL2 ? gl.RGBA8 : gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
                this._depthRenderbuffer.initialize(this._frameSize[0], this._frameSize[1], gl.DEPTH_COMPONENT16);
                this._intermediateFBO.initialize([[gl2facade.COLOR_ATTACHMENT0, this._colorRenderTexture],
                    [gl.DEPTH_ATTACHMENT, this._depthRenderbuffer]]);
            }
            else if (this._altered.frameSize) {
                this._intermediateFBO.resize(this._frameSize[0], this._frameSize[1]);
            }
            if (this._altered.clearColor) {
                this._intermediateFBO.clearColor(this._clearColor);
            }
            this._accumulate.update();
            this._altered.reset();
        };
        TestRenderer.prototype.onFrame = function (frameNumber) {
            var gl = this._context.gl;
            gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
            this._program.bind();
            var ndcOffset = this._ndcOffsetKernel.get(frameNumber);
            ndcOffset[0] = 2.0 * ndcOffset[0] / this._frameSize[0];
            ndcOffset[1] = 2.0 * ndcOffset[1] / this._frameSize[1];
            gl.uniform2fv(this._uNdcOffset, ndcOffset);
            gl.uniform1i(this._uFrameNumber, frameNumber);
            this._intermediateFBO.clear(gl.COLOR_BUFFER_BIT, true, false);
            this._ndcTriangle.bind();
            this._ndcTriangle.draw();
            this._intermediateFBO.unbind();
            this._accumulate.frame(frameNumber);
        };
        TestRenderer.prototype.onSwap = function () {
            this._blit.framebuffer = this._accumulate.framebuffer ?
                this._accumulate.framebuffer : this._blit.framebuffer = this._intermediateFBO;
            this._blit.frame();
        };
        return TestRenderer;
    }(renderer_1.Renderer));
    debug.TestRenderer = TestRenderer;
})(debug || (debug = {}));
module.exports = debug;


/***/ }),

/***/ "./debug/testrenderer.vert":
/*!*********************************!*\
  !*** ./debug/testrenderer.vert ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n#else \n    #define varying out\n#endif\n\n\nvoid ndcOffset(inout vec4 vertex, in vec2 offset) {\n    vertex.xy = offset * vec2(vertex.w) + vertex.xy;\n}\n\n\n\n#if __VERSION__ == 100\n    attribute vec2 a_vertex;\n#else \n    layout(location = 0) in vec2 a_vertex;\n#endif\n\nuniform vec2 u_ndcOffset;\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    v_uv = a_vertex.xy * 0.5 + 0.5;\n\n    vec4 vertex = vec4(a_vertex, 0.0, 1.0);\n    ndcOffset(vertex, u_ndcOffset);\n\n    gl_Position = vertex;\n}\n"

/***/ }),

/***/ "./defaultframebuffer.ts":
/*!*******************************!*\
  !*** ./defaultframebuffer.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var framebuffer_1 = __webpack_require__(/*! ./framebuffer */ "./framebuffer.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var DefaultFramebuffer = (function (_super) {
    __extends(DefaultFramebuffer, _super);
    function DefaultFramebuffer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultFramebuffer.prototype.create = function () {
        this._object = framebuffer_1.Framebuffer.DEFAULT_FRAMEBUFFER;
        this._valid = true;
        this._clearColors = new Array(1);
        this._clearDepth = 1.0;
        this._clearStencil = 0;
        this.clear = this.es2Clear;
        return this._object;
    };
    DefaultFramebuffer.prototype.delete = function () {
        this._object = undefined;
        this._valid = false;
    };
    DefaultFramebuffer.prototype.hasAttachment = function (attachment) {
        return false;
    };
    DefaultFramebuffer.prototype.bind = function (target) {
        if (target === void 0) { target = this.context.gl.FRAMEBUFFER; }
        this.context.gl.bindFramebuffer(target, this._object);
    };
    DefaultFramebuffer.prototype.clearColor = function (color) {
        _super.prototype.clearColor.call(this, color);
    };
    DefaultFramebuffer.prototype.resize = function () {
        auxiliaries_1.assert(false, "the default framebuffer cannot be resized directly");
    };
    Object.defineProperty(DefaultFramebuffer.prototype, "width", {
        get: function () {
            return this.context.gl.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultFramebuffer.prototype, "height", {
        get: function () {
            return this.context.gl.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], DefaultFramebuffer.prototype, "bind", null);
    return DefaultFramebuffer;
}(framebuffer_1.Framebuffer));
exports.DefaultFramebuffer = DefaultFramebuffer;


/***/ }),

/***/ "./eventhandler.ts":
/*!*************************!*\
  !*** ./eventhandler.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var mouseeventprovider_1 = __webpack_require__(/*! ./mouseeventprovider */ "./mouseeventprovider.ts");
var EventHandler = (function () {
    function EventHandler(invalidate, mouseEventProvider) {
        this._subscriptions = new Array();
        this._latestMouseEventsByType = new Map();
        this._previousMouseEventsByType = new Map();
        this._mouseEventHandlerByType = new Map();
        this._invalidate = invalidate;
        this._mouseEventProvider = mouseEventProvider;
    }
    EventHandler.prototype.invalidate = function (force) {
        if (force === void 0) { force = false; }
        if (this._invalidate) {
            this._invalidate(force);
        }
    };
    EventHandler.prototype.pushMouseEventHandler = function (type, handler) {
        var _this = this;
        if (!this._mouseEventHandlerByType.has(type)) {
            this._mouseEventHandlerByType.set(type, new Array());
            this._previousMouseEventsByType.set(type, new Array());
            var latest_1 = new Array();
            this._latestMouseEventsByType.set(type, latest_1);
            auxiliaries_1.assert(this._mouseEventProvider !== undefined, "expected valid mouse event provider");
            var observable = this._mouseEventProvider.observable(type);
            switch (type) {
                case mouseeventprovider_1.MouseEventProvider.Type.Wheel:
                    this._subscriptions.push(observable.subscribe(function (event) { latest_1.push(event); _this.invalidate(); }));
                    break;
                default:
                    this._subscriptions.push(observable.subscribe(function (event) { latest_1.push(event); _this.invalidate(); }));
                    break;
            }
        }
        this._mouseEventHandlerByType.get(type).push(handler);
    };
    EventHandler.prototype.invokeMouseEventHandler = function (type) {
        var handlers = this._mouseEventHandlerByType.get(type);
        if (handlers === undefined || handlers.length === 0) {
            return;
        }
        var latest = this._latestMouseEventsByType.get(type);
        if (latest.length === 0) {
            return;
        }
        var previous = this._previousMouseEventsByType.get(type);
        handlers.forEach(function (handler) { return handler(latest, previous); });
        Object.assign(previous, latest);
        latest.length = 0;
    };
    EventHandler.prototype.dispose = function () {
        this._latestMouseEventsByType.forEach(function (value) { return value.length = 0; });
        this._previousMouseEventsByType.forEach(function (value) { return value.length = 0; });
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var subscription = _a[_i];
            subscription.unsubscribe();
        }
    };
    EventHandler.prototype.update = function () {
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Click);
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Enter);
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Leave);
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Down);
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Up);
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Move);
        this.invokeMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Wheel);
    };
    EventHandler.prototype.offsets = function (event, normalize) {
        if (normalize === void 0) { normalize = true; }
        var offsets = new Array();
        if (event instanceof MouseEvent) {
            var e = event;
            offsets.push(gl_matrix_1.vec2.fromValues(e.clientX, e.clientY));
        }
        else if (event instanceof WheelEvent) {
            var e = event;
            offsets.push(gl_matrix_1.vec2.fromValues(e.clientX, e.clientY));
        }
        else if (event instanceof TouchEvent) {
            var e = event;
            for (var i = 0; i < e.touches.length; ++i) {
                var touch = e.touches[i];
                offsets.push(gl_matrix_1.vec2.fromValues(touch.clientX, touch.clientY));
            }
        }
        var target = event.target || event.currentTarget || event.srcElement;
        var rect = target.getBoundingClientRect();
        for (var _i = 0, offsets_1 = offsets; _i < offsets_1.length; _i++) {
            var offset = offsets_1[_i];
            offset[0] = Math.floor(offset[0] - rect.left);
            offset[1] = Math.floor(offset[1] - rect.top);
            if (normalize) {
                gl_matrix_1.vec2.scale(offset, offset, window.devicePixelRatio);
            }
        }
        return offsets;
    };
    EventHandler.prototype.pushClickHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Click, handler);
    };
    EventHandler.prototype.pushMouseEnterHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Enter, handler);
    };
    EventHandler.prototype.pushMouseLeaveHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Leave, handler);
    };
    EventHandler.prototype.pushMouseDownHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Down, handler);
    };
    EventHandler.prototype.pushMouseUpHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Up, handler);
    };
    EventHandler.prototype.pushMouseMoveHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Move, handler);
    };
    EventHandler.prototype.pushMouseWheelHandler = function (handler) {
        this.pushMouseEventHandler(mouseeventprovider_1.MouseEventProvider.Type.Wheel, handler);
    };
    EventHandler.prototype.requestPointerLock = function () {
        if (this._mouseEventProvider) {
            this._mouseEventProvider.pointerLock = true;
        }
    };
    EventHandler.prototype.exitPointerLock = function () {
        if (this._mouseEventProvider) {
            this._mouseEventProvider.pointerLock = false;
        }
    };
    return EventHandler;
}());
exports.EventHandler = EventHandler;


/***/ }),

/***/ "./extensions.ts":
/*!***********************!*\
  !*** ./extensions.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var extensions;
(function (extensions) {
    extensions.WEBGL1_EXTENSIONS = [
        'ANGLE_instanced_arrays',
        'EXT_blend_minmax',
        'EXT_color_buffer_half_float',
        'EXT_disjoint_timer_query',
        'EXT_frag_depth',
        'EXT_sRGB',
        'EXT_shader_texture_lod',
        'EXT_texture_filter_anisotropic',
        'OES_element_index_uint',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_float_linear',
        'OES_texture_half_float',
        'OES_texture_half_float_linear',
        'OES_vertex_array_object',
        'WEBGL_color_buffer_float',
        'WEBGL_compressed_texture_astc',
        'WEBGL_compressed_texture_atc',
        'WEBGL_compressed_texture_etc',
        'WEBGL_compressed_texture_etc1',
        'WEBGL_compressed_texture_pvrtc',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_s3tc_srgb',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
        'WEBGL_lose_context',
    ];
    extensions.WEBGL2_EXTENSIONS = [
        'EXT_color_buffer_float',
        'EXT_disjoint_timer_query_webgl2',
        'EXT_texture_filter_anisotropic',
        'OES_texture_float_linear',
        'OES_texture_half_float_linear',
        'WEBGL_compressed_texture_astc',
        'WEBGL_compressed_texture_atc',
        'WEBGL_compressed_texture_etc',
        'WEBGL_compressed_texture_etc1',
        'WEBGL_compressed_texture_pvrtc',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_s3tc_srgb',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_lose_context',
    ];
    extensions.WEBGL2_DEFAULT_EXTENSIONS = [
        'ANGLE_instanced_arrays',
        'EXT_blend_minmax',
        'EXT_frag_depth',
        'EXT_sRGB',
        'EXT_shader_texture_lod',
        'OES_element_index_uint',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_half_float',
        'OES_vertex_array_object',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
    ];
})(extensions || (extensions = {}));
module.exports = extensions;


/***/ }),

/***/ "./extensionshash.ts":
/*!***************************!*\
  !*** ./extensionshash.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var extensions_1 = __webpack_require__(/*! ./extensions */ "./extensions.ts");
var ExtensionsHash = (function () {
    function ExtensionsHash() {
    }
    ExtensionsHash.encode64 = function (bitfield) {
        auxiliaries_1.assert(bitfield >= 0 && bitfield <= 63, "expected bitfield in range [ 0b000000, 0b111111 ], given " + bitfield);
        return ExtensionsHash.BASE64_ALPHABET[bitfield];
    };
    ExtensionsHash.decode64 = function (base64) {
        auxiliaries_1.assert(base64.length === 1, "expected single base64 character, given '" + base64 + "'");
        var bitfield = ExtensionsHash.BASE64_ALPHABET.indexOf(base64);
        auxiliaries_1.assert(bitfield > -1, "unknown base64 character, given '" + base64 + "'");
        return bitfield;
    };
    ExtensionsHash.encode = function (backend, supported) {
        var version = ExtensionsHash.LATEST_VERSION;
        var extensions = ExtensionsHash.EXTENSIONS_BY_VERSION.get(version);
        var backendIndex = ExtensionsHash.WEBGL_BACKENDS.indexOf(backend);
        auxiliaries_1.assert(backendIndex > -1, "expected valid backend " + ExtensionsHash.WEBGL_BACKENDS + ", given " + backend + " ");
        var hash = ExtensionsHash.encode64((version << 3) | (backendIndex + 1));
        if (supported.length === 0) {
            return hash;
        }
        var support = 0;
        for (var i = 0; i < extensions.length; ++i) {
            support |= (supported.indexOf(extensions[i]) > -1 ? 32 >> (i % 6) : 0);
            if (i % 6 < 5 && i < extensions.length - 1) {
                continue;
            }
            hash += ExtensionsHash.encode64(support);
            support = 0;
        }
        return hash;
    };
    ExtensionsHash.decode = function (hash) {
        var hashHead = ExtensionsHash.decode64(hash[0]);
        var version = hashHead >> 3;
        var backendIndex = (hashHead & 7) - 1;
        auxiliaries_1.assert(backendIndex < ExtensionsHash.WEBGL_BACKENDS.length, "expected valid backend index, given " + backendIndex);
        var backend = ExtensionsHash.WEBGL_BACKENDS[backendIndex];
        auxiliaries_1.assert(ExtensionsHash.EXTENSIONS_BY_VERSION.has(version), "expected valid hash version, given " + version);
        var extensions = ExtensionsHash.EXTENSIONS_BY_VERSION.get(version);
        var expectedHashLength = Math.ceil(extensions.length / 6) + 1;
        auxiliaries_1.assert(hash.length === expectedHashLength, "expected hash of version " + version + " to have a length of " + expectedHashLength + ", given " + hash);
        var supported = new Array();
        for (var i = 1; i < hash.length; ++i) {
            var bitfield = ExtensionsHash.decode64(hash[i]);
            var offset = (i - 1) * 6;
            if (bitfield & 32) {
                supported.push(extensions[offset + 0]);
            }
            if (bitfield & 16) {
                supported.push(extensions[offset + 1]);
            }
            if (bitfield & 8) {
                supported.push(extensions[offset + 2]);
            }
            if (bitfield & 4) {
                supported.push(extensions[offset + 3]);
            }
            if (bitfield & 2) {
                supported.push(extensions[offset + 4]);
            }
            if (bitfield & 1) {
                supported.push(extensions[offset + 5]);
            }
        }
        return [backend, supported];
    };
    ExtensionsHash.complement = function (backend, extensions) {
        var backendIndex = ExtensionsHash.WEBGL_BACKENDS.indexOf(backend);
        auxiliaries_1.assert(backendIndex > -1, "expected valid backend " + ExtensionsHash.WEBGL_BACKENDS + ", given " + backend + " ");
        var webglExtensions = ExtensionsHash.WEBGL_EXTENSIONS_BY_BACKEND.get(backendIndex);
        return webglExtensions.filter(function (ext) { return extensions.indexOf(ext) < 0; });
    };
    ExtensionsHash.WEBGL_BACKENDS = ['webgl1', 'webgl2'];
    ExtensionsHash.WEBGL_EXTENSIONS_BY_BACKEND = new Map([
        [0, extensions_1.WEBGL1_EXTENSIONS],
        [1, extensions_1.WEBGL2_EXTENSIONS],
    ]);
    ExtensionsHash.EXTENSIONS_BY_VERSION = new Map([[
            0, [
                'ANGLE_instanced_arrays',
                'EXT_blend_minmax',
                'EXT_color_buffer_float',
                'EXT_color_buffer_half_float',
                'EXT_disjoint_timer_query',
                'EXT_disjoint_timer_query_webgl2',
                'EXT_frag_depth',
                'EXT_shader_texture_lod',
                'EXT_sRGB',
                'EXT_texture_filter_anisotropic',
                'OES_element_index_uint',
                'OES_standard_derivatives',
                'OES_texture_float',
                'OES_texture_float_linear',
                'OES_texture_half_float',
                'OES_texture_half_float_linear',
                'OES_vertex_array_object',
                'WEBGL_color_buffer_float',
                'WEBGL_compressed_texture_astc',
                'WEBGL_compressed_texture_atc',
                'WEBGL_compressed_texture_etc',
                'WEBGL_compressed_texture_etc1',
                'WEBGL_compressed_texture_pvrtc',
                'WEBGL_compressed_texture_s3tc',
                'WEBGL_compressed_texture_s3tc_srgb',
                'WEBGL_debug_renderer_info',
                'WEBGL_debug_shaders',
                'WEBGL_depth_texture',
                'WEBGL_draw_buffers',
                'WEBGL_lose_context',
            ]
        ],
    ]);
    ExtensionsHash.LATEST_VERSION = 0;
    ExtensionsHash.BASE64_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+';
    return ExtensionsHash;
}());
exports.ExtensionsHash = ExtensionsHash;


/***/ }),

/***/ "./firstpersonmodifier.ts":
/*!********************************!*\
  !*** ./firstpersonmodifier.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var cameramodifier_1 = __webpack_require__(/*! ./cameramodifier */ "./cameramodifier.ts");
var FirstPersonModifier = (function (_super) {
    __extends(FirstPersonModifier, _super);
    function FirstPersonModifier() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._rotation = gl_matrix_1.mat4.create();
        _this._sensitivity = FirstPersonModifier.DEFAULT_SENSITIVITY;
        return _this;
    }
    FirstPersonModifier.prototype.initiate = function (point) {
        Object.assign(this._reference, this._camera);
        this._initialPoint = point;
    };
    FirstPersonModifier.prototype.process = function (point, movement) {
        this._currentPoint = point;
        var magnitudes = gl_matrix_1.vec2.create();
        if (movement === undefined) {
            gl_matrix_1.vec2.subtract(magnitudes, this._initialPoint, this._currentPoint);
        }
        else {
            gl_matrix_1.vec2.copy(magnitudes, movement);
        }
        gl_matrix_1.vec2.scale(magnitudes, magnitudes, window.devicePixelRatio * this._sensitivity);
        gl_matrix_1.vec2.copy(this._initialPoint, this._currentPoint);
        var centerToEye = gl_matrix_1.vec3.sub(gl_matrix_extensions_1.v3(), this._reference.eye, this._reference.center);
        gl_matrix_1.vec3.normalize(centerToEye, centerToEye);
        var strafe = gl_matrix_1.vec3.cross(gl_matrix_extensions_1.v3(), centerToEye, this._reference.up);
        var yaw = gl_matrix_1.mat4.fromRotation(gl_matrix_extensions_1.m4(), -magnitudes[0], this._reference.up);
        var pitch = gl_matrix_1.mat4.fromRotation(gl_matrix_extensions_1.m4(), magnitudes[1], strafe);
        gl_matrix_1.mat4.mul(this._rotation, pitch, yaw);
        this.update();
    };
    FirstPersonModifier.prototype.update = function () {
        if (this._camera === undefined) {
            return;
        }
        var T = gl_matrix_1.mat4.fromTranslation(gl_matrix_extensions_1.m4(), this._reference.eye);
        gl_matrix_1.mat4.multiply(T, T, this._rotation);
        gl_matrix_1.mat4.translate(T, T, gl_matrix_1.vec3.negate(gl_matrix_extensions_1.v3(), this._reference.eye));
        var center = gl_matrix_1.vec3.transformMat4(gl_matrix_extensions_1.v3(), this._reference.center, T);
        this._camera.center = center;
        Object.assign(this._reference, this._camera);
    };
    Object.defineProperty(FirstPersonModifier.prototype, "sensitivity", {
        get: function () {
            return this._sensitivity;
        },
        set: function (sensitivity) {
            this._sensitivity = sensitivity;
        },
        enumerable: true,
        configurable: true
    });
    FirstPersonModifier.DEFAULT_SENSITIVITY = 0.0008;
    return FirstPersonModifier;
}(cameramodifier_1.CameraModifier));
exports.FirstPersonModifier = FirstPersonModifier;


/***/ }),

/***/ "./formatbytesizes.ts":
/*!****************************!*\
  !*** ./formatbytesizes.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
function byteSizeOfFormat(context, format) {
    var gl = context.gl;
    var gl2facade = context.gl2facade;
    var UNSIGNED_INT_24_8_WEBGL = context.supportsDepthTexture ?
        context.depthTexture.UNSIGNED_INT_24_8_WEBGL : undefined;
    switch (format) {
        case undefined:
            break;
        default:
            break;
        case gl.UNSIGNED_BYTE:
        case gl.UNSIGNED_SHORT_5_6_5:
        case gl.UNSIGNED_SHORT_4_4_4_4:
        case gl.UNSIGNED_SHORT_5_5_5_1:
        case gl.UNSIGNED_SHORT:
        case gl.UNSIGNED_INT:
        case UNSIGNED_INT_24_8_WEBGL:
        case gl.FLOAT:
        case gl2facade.HALF_FLOAT:
        case gl.BYTE:
        case gl.UNSIGNED_SHORT:
        case gl.SHORT:
        case gl.UNSIGNED_INT:
        case gl.INT:
        case gl.HALF_FLOAT:
        case gl.FLOAT:
        case gl.UNSIGNED_INT_2_10_10_10_REV:
        case gl.UNSIGNED_INT_10F_11F_11F_REV:
        case gl.UNSIGNED_INT_5_9_9_9_REV:
        case gl.UNSIGNED_INT_24_8:
        case gl.FLOAT_32_UNSIGNED_INT_24_8_REV:
            auxiliaries_1.assert(false, "expected format instead of type " + format);
            return 0;
    }
    var SRGB8_ALPHA8_EXT = context.supportsSRGB ? context.sRGB.SRGB8_ALPHA8_EXT : undefined;
    var SRGB_EXT = context.supportsSRGB ? context.sRGB.SRGB_EXT : undefined;
    var SRGB_ALPHA_EXT = context.supportsSRGB ? context.sRGB.SRGB_ALPHA_EXT : undefined;
    var RGB32F_EXT = context.supportsColorBufferFloat ? context.colorBufferFloat.RGB32F_EXT : undefined;
    var RGBA32F_EXT = context.supportsColorBufferFloat ? context.colorBufferFloat.RGBA32F_EXT : undefined;
    switch (format) {
        case undefined:
        default:
            auxiliaries_1.assert(false, "size of format " + format + " is unknown");
            return 0;
        case gl.ALPHA:
        case gl.LUMINANCE:
        case gl.R8:
        case gl.R8I:
        case gl.R8UI:
        case gl.STENCIL_INDEX8:
            return 1;
        case gl.DEPTH_COMPONENT16:
        case gl.LUMINANCE_ALPHA:
        case gl.R16F:
        case gl.R16I:
        case gl.R16UI:
        case gl.RG8:
        case gl.RG8I:
        case gl.RG8UI:
        case gl.RGB565:
        case gl.RGB5_A1:
        case gl.RGBA4:
            return 2;
        case gl.DEPTH_COMPONENT24:
        case gl.RGB:
        case gl.RGB8:
        case gl.RGB8UI:
        case gl.SRGB:
        case SRGB_EXT:
        case gl.SRGB8:
            return 3;
        case gl.DEPTH_STENCIL:
        case gl.DEPTH24_STENCIL8:
        case gl.DEPTH_COMPONENT32F:
        case gl.R11F_G11F_B10F:
        case gl.R32F:
        case gl.R32I:
        case gl.R32UI:
        case gl.RG16F:
        case gl.RG16I:
        case gl.RG16UI:
        case gl.RGB10_A2:
        case gl.RGB10_A2UI:
        case gl.RGB9_E5:
        case gl.RGBA:
        case gl.RGBA8:
        case gl.RGBA8I:
        case gl.RGBA8UI:
        case gl.SRGB8_ALPHA8:
        case SRGB8_ALPHA8_EXT:
        case gl.SRGB_ALPHA:
        case SRGB_ALPHA_EXT:
        case gl.SRGB_ALPHA8:
        case gl.SRGB_APLHA8:
            return 4;
        case gl.DEPTH32F_STENCIL8:
            return 5;
        case gl.RGB16F:
            return 6;
        case gl.RG32F:
        case gl.RG32I:
        case gl.RG32UI:
        case gl.RGBA16F:
        case gl.RGBA16I:
        case gl.RGBA16UI:
            return 8;
        case gl.RGB32F:
        case gl.RGB32F:
        case RGB32F_EXT:
            return 12;
        case gl.RGBA32F:
        case RGBA32F_EXT:
        case gl.RGBA32I:
        case gl.RGBA32UI:
            return 16;
        case gl.DEPTH_COMPONENT:
        case gl.DEPTH_STENCIL:
            auxiliaries_1.assert(false, "byte size of DEPTH_COMPONENT or DEPTH_STENCIL formats depends on active render buffer");
            return 0;
    }
}
exports.byteSizeOfFormat = byteSizeOfFormat;


/***/ }),

/***/ "./framebuffer.ts":
/*!************************!*\
  !*** ./framebuffer.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var renderbuffer_1 = __webpack_require__(/*! ./renderbuffer */ "./renderbuffer.ts");
var texture2_1 = __webpack_require__(/*! ./texture2 */ "./texture2.ts");
var Framebuffer = (function (_super) {
    __extends(Framebuffer, _super);
    function Framebuffer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._buffersByAttachment = new Map();
        _this._texturesByAttachment = new Map();
        _this._colorClearQueue = new Array();
        _this._drawBuffers = new Array();
        _this._drawBuffersChanged = false;
        return _this;
    }
    Framebuffer.statusString = function (context, status) {
        var gl = context.gl;
        switch (status) {
            case gl.FRAMEBUFFER_COMPLETE:
                return 'the framebuffer is ready to display (COMPLETE)';
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                return 'the attachment types are mismatched or not all framebuffer attachment points are ' +
                    'framebuffer attachment complete (INCOMPLETE_ATTACHMENT)';
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                return 'there is no attachment (INCOMPLETE_MISSING_ATTACHMENT)';
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                return 'height and width of the attachment are not the same (INCOMPLETE_DIMENSIONS)';
            case gl.FRAMEBUFFER_UNSUPPORTED:
                return 'the format of the attachment is not supported or if depth and stencil attachments are not ' +
                    'the same renderbuffer (UNSUPPORTED)';
            case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                return 'the values of gl.RENDERBUFFER_SAMPLES are different among attached renderbuffers, or are ' +
                    'non-zero if the attached images are a mix of renderbuffers and textures (INCOMPLETE_MULTISAMPLE)';
            default:
                auxiliaries_1.assert(false, "expected known framebuffer status, given " + status);
                return '';
        }
    };
    Framebuffer.prototype.create = function (attachments) {
        var gl = this._context.gl;
        var gl2facade = this.context.gl2facade;
        this._object = gl.createFramebuffer();
        this._clearColors = new Array(gl2facade.COLOR_ATTACHMENT_MAX - gl2facade.COLOR_ATTACHMENT0);
        this._clearDepth = 1.0;
        this._clearStencil = 0;
        this.clear = this.context.isWebGL1 ? this.es2Clear : this.es3Clear;
        for (var _i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
            var tuple = attachments_1[_i];
            var attachment = tuple[0];
            var bufferOrTexture = tuple[1];
            if (bufferOrTexture instanceof renderbuffer_1.Renderbuffer) {
                this._buffersByAttachment.set(attachment, bufferOrTexture);
            }
            else if (bufferOrTexture instanceof texture2_1.Texture2) {
                this._texturesByAttachment.set(attachment, bufferOrTexture);
            }
            if (attachment < gl2facade.COLOR_ATTACHMENT_MIN || attachment > gl2facade.COLOR_ATTACHMENT_MAX) {
                continue;
            }
            this._drawBuffers.push(attachment);
            var index = attachment - gl.COLOR_ATTACHMENT0;
            this._colorClearQueue.push(index);
            this._clearColors[index] = [0.0, 0.0, 0.0, 0.0];
        }
        this._drawBuffersChanged = true;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._object);
        this._buffersByAttachment.forEach(function (buffer, attachment) {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, buffer.object);
        });
        this._texturesByAttachment.forEach(function (texture, attachment) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture.object, 0);
        });
        if (gl2facade.drawBuffers) {
            gl2facade.drawBuffers(this._drawBuffers);
        }
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        this._valid = gl.isFramebuffer(this._object) && (status === gl.FRAMEBUFFER_COMPLETE);
        auxiliaries_1.logIf(!this._valid, auxiliaries_1.LogLevel.Dev, Framebuffer.statusString(this.context, status));
        gl.bindFramebuffer(gl.FRAMEBUFFER, Framebuffer.DEFAULT_FRAMEBUFFER);
        return this._object;
    };
    Framebuffer.prototype.delete = function () {
        auxiliaries_1.assert(this._object instanceof WebGLFramebuffer, "expected WebGLFramebuffer object");
        this.context.gl.deleteFramebuffer(this._object);
        this._object = undefined;
        this._valid = false;
    };
    Framebuffer.prototype.es2Clear = function (mask, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        var clearDepth = auxiliaries_1.bitInBitfield(mask, gl.DEPTH_BUFFER_BIT);
        var clearStencil = auxiliaries_1.bitInBitfield(mask, gl.STENCIL_BUFFER_BIT);
        var clearColor = auxiliaries_1.bitInBitfield(mask, gl.COLOR_BUFFER_BIT);
        if (!clearColor && !clearDepth && !clearStencil) {
            return;
        }
        if (bind) {
            this.bind();
        }
        if (clearColor && this._clearColors[0] !== undefined) {
            var color = this._clearColors[0];
            gl.clearColor(color[0], color[1], color[2], color[3]);
        }
        if (clearDepth && this._clearDepth !== undefined) {
            gl.clearDepth(this._clearDepth);
        }
        if (clearStencil && this._clearStencil !== undefined) {
            gl.clearStencil(this._clearStencil);
        }
        gl.clear(mask);
        if (unbind) {
            this.unbind();
        }
    };
    Framebuffer.prototype.es3Clear = function (mask, bind, unbind, colorClearQueue) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        var clearDepth = auxiliaries_1.bitInBitfield(mask, gl.DEPTH_BUFFER_BIT);
        var clearStencil = auxiliaries_1.bitInBitfield(mask, gl.STENCIL_BUFFER_BIT);
        var clearColor = auxiliaries_1.bitInBitfield(mask, gl.COLOR_BUFFER_BIT);
        if (!clearColor && !clearDepth && !clearStencil) {
            return;
        }
        if (bind) {
            this.bind();
        }
        if (clearColor) {
            for (var _i = 0, _a = colorClearQueue ? colorClearQueue : this._colorClearQueue; _i < _a.length; _i++) {
                var drawBuffer = _a[_i];
                gl.clearBufferfv(gl.COLOR, drawBuffer, this._clearColors[drawBuffer]);
            }
        }
        if (clearDepth && clearStencil) {
            gl.clearStencil(this._clearStencil);
            gl.clearDepth(this._clearDepth);
            gl.clear(gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        else if (clearDepth) {
            gl.clearBufferfv(gl.DEPTH, 0, [this._clearDepth]);
        }
        else if (clearStencil) {
            gl.clearStencil(this._clearStencil);
            gl.clear(gl.STENCIL_BUFFER_BIT);
        }
        if (unbind) {
            this.unbind();
        }
    };
    Framebuffer.prototype.hasAttachment = function (attachment) {
        return this._texturesByAttachment.has(attachment) || this._buffersByAttachment.has(attachment);
    };
    Framebuffer.prototype.bind = function (target) {
        if (target === void 0) { target = this.context.gl.FRAMEBUFFER; }
        this.context.gl.bindFramebuffer(target, this._object);
        if (this._drawBuffersChanged && this.context.gl2facade.drawBuffers) {
            this.context.gl2facade.drawBuffers(this._drawBuffers);
            this._drawBuffersChanged = false;
        }
    };
    Framebuffer.prototype.unbind = function (target) {
        if (target === void 0) { target = this.context.gl.FRAMEBUFFER; }
        this.context.gl.bindFramebuffer(target, Framebuffer.DEFAULT_FRAMEBUFFER);
    };
    Framebuffer.prototype.clearColor = function (color, drawBuffer) {
        auxiliaries_1.assert(drawBuffer === undefined || drawBuffer === 0 || this.context.isWebGL2 ||
            this.context.supportsDrawBuffers, "WebGL2 context expected for clearing multiple color attachments.");
        var alphaIssue = color[3] < 1.0 && !this.context.alpha;
        auxiliaries_1.logIf(alphaIssue, auxiliaries_1.LogLevel.Dev, "context has alpha disabled, clear color alpha is ignored");
        var color2 = [color[0], color[1], color[2], alphaIssue ? 1.0 : color[3]];
        if (this.context.premultipliedAlpha && !alphaIssue) {
            color2[0] *= color2[3];
            color2[1] *= color2[3];
            color2[2] *= color2[3];
        }
        if (drawBuffer) {
            this._clearColors[drawBuffer] = color2;
        }
        else {
            for (var i = 0; i < this._clearColors.length; ++i) {
                this._clearColors[i] = color2;
            }
        }
    };
    Framebuffer.prototype.clearDepth = function (depth) {
        this._clearDepth = depth;
    };
    Framebuffer.prototype.clearStencil = function (stencil) {
        this._clearStencil = stencil;
    };
    Framebuffer.prototype.texture = function (attachment) {
        return this._texturesByAttachment.get(attachment);
    };
    Framebuffer.prototype.resize = function (width, height, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        this._buffersByAttachment.forEach(function (buffer) {
            buffer.resize(width, height, bind, unbind);
        });
        this._texturesByAttachment.forEach(function (texture) {
            texture.resize(width, height, bind, unbind);
        });
    };
    Object.defineProperty(Framebuffer.prototype, "width", {
        get: function () {
            this.assertInitialized();
            var width = NaN;
            this._buffersByAttachment.forEach(function (buffer) {
                if (isNaN(width) || buffer.width < width) {
                    width = buffer.width;
                }
            });
            this._texturesByAttachment.forEach(function (texture) {
                if (isNaN(width) || texture.width < width) {
                    width = texture.width;
                }
            });
            return width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framebuffer.prototype, "height", {
        get: function () {
            this.assertInitialized();
            var height = NaN;
            this._buffersByAttachment.forEach(function (buffer) {
                if (isNaN(height) || buffer.height < height) {
                    height = buffer.height;
                }
            });
            this._texturesByAttachment.forEach(function (texture) {
                if (isNaN(height) || texture.height < height) {
                    height = texture.height;
                }
            });
            return height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framebuffer.prototype, "size", {
        get: function () {
            return [this.width, this.height];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Framebuffer.prototype, "drawBuffers", {
        get: function () {
            this.assertInitialized();
            return this._drawBuffers;
        },
        set: function (attachments) {
            this.assertInitialized();
            var gl2facade = this.context.gl2facade;
            for (var _i = 0, attachments_2 = attachments; _i < attachments_2.length; _i++) {
                var attachment = attachments_2[_i];
                auxiliaries_1.assert(this.hasAttachment(attachment), "valid attachment expected for draw buffer, given " + attachment);
                auxiliaries_1.assert(attachment >= gl2facade.COLOR_ATTACHMENT_MIN && attachment <= gl2facade.COLOR_ATTACHMENT_MAX, "color attachment expected for draw buffer, given " + attachment);
                this._drawBuffersChanged = this._drawBuffersChanged || this._drawBuffers.indexOf(attachment) === -1;
            }
            this._drawBuffersChanged = this._drawBuffersChanged || attachments.length !== this._drawBuffers.length;
            if (this._drawBuffersChanged) {
                this._drawBuffers = attachments;
            }
        },
        enumerable: true,
        configurable: true
    });
    Framebuffer.DEFAULT_FRAMEBUFFER = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "es2Clear", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "es3Clear", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "unbind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "clearColor", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "clearDepth", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "clearStencil", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "texture", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Framebuffer.prototype, "resize", null);
    return Framebuffer;
}(object_1.AbstractObject));
exports.Framebuffer = Framebuffer;


/***/ }),

/***/ "./geometry.ts":
/*!*********************!*\
  !*** ./geometry.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var vertexarray_1 = __webpack_require__(/*! ./vertexarray */ "./vertexarray.ts");
var Geometry = (function (_super) {
    __extends(Geometry, _super);
    function Geometry(context, identifier) {
        var _this = _super.call(this) || this;
        _this._buffers = new Array();
        identifier = identifier !== undefined && identifier !== "" ? identifier : _this.constructor.name;
        _this._vertexArray = new vertexarray_1.VertexArray(context, identifier + 'VAO');
        return _this;
    }
    Geometry.prototype.initialize = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var targets = args[0];
        var indices = args[1];
        var valid = true;
        for (var i = 0; i < this._buffers.length; ++i) {
            valid = this._buffers[i].initialize(targets[i]) && valid;
        }
        this._vertexArray.initialize(function () { return _this.bindBuffers(indices); }, function () { return _this.unbindBuffers(indices); });
        return this._vertexArray.valid && valid;
    };
    Geometry.prototype.uninitialize = function () {
        this._vertexArray.uninitialize();
        this._buffers.forEach(function (buffer) { return buffer.uninitialize(); });
        for (var _i = 0, _a = this._buffers; _i < _a.length; _i++) {
            var buffer = _a[_i];
            buffer.uninitialize();
        }
    };
    Geometry.prototype.bind = function () {
        this._vertexArray.bind();
    };
    Geometry.prototype.unbind = function () {
        this._vertexArray.unbind();
    };
    Object.defineProperty(Geometry.prototype, "buffers", {
        get: function () {
            return this._buffers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometry.prototype, "context", {
        get: function () {
            return this._vertexArray.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometry.prototype, "vertexArray", {
        get: function () {
            return this._vertexArray;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        initializable_1.Initializable.initialize()
    ], Geometry.prototype, "initialize", null);
    __decorate([
        initializable_1.Initializable.uninitialize()
    ], Geometry.prototype, "uninitialize", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Geometry.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Geometry.prototype, "unbind", null);
    return Geometry;
}(initializable_1.Initializable));
exports.Geometry = Geometry;


/***/ }),

/***/ "./gl-matrix-extensions.ts":
/*!*********************************!*\
  !*** ./gl-matrix-extensions.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions;
(function (gl_matrix_extensions) {
    function sign(x) {
        return x > 0.0 ? 1.0 : x < 0.0 ? -1.0 : 0.0;
    }
    gl_matrix_extensions.sign = sign;
    function clamp(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }
    gl_matrix_extensions.clamp = clamp;
    function fract(x) {
        return x > 0 ? x - Math.floor(x) : x - Math.ceil(x);
    }
    gl_matrix_extensions.fract = fract;
    function v2() {
        return gl_matrix_1.vec2.create();
    }
    gl_matrix_extensions.v2 = v2;
    function clamp2(out, x, min, max) {
        out[0] = Math.max(min[0], Math.min(max[0], x[0]));
        out[1] = Math.max(min[1], Math.min(max[1], x[1]));
        return out;
    }
    gl_matrix_extensions.clamp2 = clamp2;
    function abs2(out, x) {
        out[0] = Math.abs(x[0]);
        out[1] = Math.abs(x[1]);
        return out;
    }
    gl_matrix_extensions.abs2 = abs2;
    function v3() {
        return gl_matrix_1.vec3.create();
    }
    gl_matrix_extensions.v3 = v3;
    function clamp3(out, x, min, max) {
        out[0] = Math.max(min[0], Math.min(max[0], x[0]));
        out[1] = Math.max(min[1], Math.min(max[1], x[1]));
        out[2] = Math.max(min[2], Math.min(max[2], x[2]));
        return out;
    }
    gl_matrix_extensions.clamp3 = clamp3;
    function abs3(out, x) {
        out[0] = Math.abs(x[0]);
        out[1] = Math.abs(x[1]);
        out[2] = Math.abs(x[2]);
        return out;
    }
    gl_matrix_extensions.abs3 = abs3;
    var one256ths = 1.0 / 256.0;
    function encode_float24x1_to_uint8x3(out, x) {
        out[0] = Math.floor(x * 256.0);
        out[1] = Math.floor(fract(x * 256.0) * 256.0);
        out[2] = Math.floor(fract(x * 65536.0) * 256.0);
        return out;
    }
    gl_matrix_extensions.encode_float24x1_to_uint8x3 = encode_float24x1_to_uint8x3;
    function decode_float24x1_from_uint8x3(x) {
        return (x[0] + (x[1] + x[2] * one256ths) * one256ths) * one256ths;
    }
    gl_matrix_extensions.decode_float24x1_from_uint8x3 = decode_float24x1_from_uint8x3;
    function encode_uint24_to_rgb8(out, x) {
        out[0] = (x >> 0) & 0xFF;
        out[1] = (x >> 8) & 0xFF;
        out[2] = (x >> 16) & 0xFF;
        return out;
    }
    gl_matrix_extensions.encode_uint24_to_rgb8 = encode_uint24_to_rgb8;
    function encode_uint32_to_rgba8(out, x) {
        out[0] = (x >> 0) & 0xFF;
        out[1] = (x >> 8) & 0xFF;
        out[2] = (x >> 16) & 0xFF;
        out[3] = (x >> 24) & 0xFF;
        return out;
    }
    gl_matrix_extensions.encode_uint32_to_rgba8 = encode_uint32_to_rgba8;
    function decode_uint24_from_rgb8(x) {
        return x[0] + (x[1] << 8) + (x[2] << 16);
    }
    gl_matrix_extensions.decode_uint24_from_rgb8 = decode_uint24_from_rgb8;
    function decode_uint32_from_rgba8(x) {
        return x[0] + (x[1] << 8) + (x[2] << 16) + (x[3] << 24);
    }
    gl_matrix_extensions.decode_uint32_from_rgba8 = decode_uint32_from_rgba8;
    function fromVec4(x) {
        return gl_matrix_1.vec3.fromValues(x[0] / x[3], x[1] / x[3], x[2] / x[3]);
    }
    gl_matrix_extensions.fromVec4 = fromVec4;
    function v4() {
        return gl_matrix_1.vec4.create();
    }
    gl_matrix_extensions.v4 = v4;
    function clamp4(out, x, min, max) {
        out[0] = Math.max(min[0], Math.min(max[0], x[0]));
        out[1] = Math.max(min[1], Math.min(max[1], x[1]));
        out[2] = Math.max(min[2], Math.min(max[2], x[2]));
        out[3] = Math.max(min[3], Math.min(max[3], x[3]));
        return out;
    }
    gl_matrix_extensions.clamp4 = clamp4;
    function abs4(out, x) {
        out[0] = Math.abs(x[0]);
        out[1] = Math.abs(x[1]);
        out[2] = Math.abs(x[2]);
        out[3] = Math.abs(x[3]);
        return out;
    }
    gl_matrix_extensions.abs4 = abs4;
    function fromVec3(x) {
        return gl_matrix_1.vec4.fromValues(x[0], x[1], x[2], 1.0);
    }
    gl_matrix_extensions.fromVec3 = fromVec3;
    function parseVec2(v2str) {
        if (v2str === undefined || v2str === '') {
            return undefined;
        }
        var numbers = [];
        try {
            numbers = JSON.parse("[" + v2str + "]");
        }
        catch (error) {
            return undefined;
        }
        return numbers.length !== 2 || isNaN(numbers[0]) || isNaN(numbers[1]) ?
            undefined : gl_matrix_1.vec2.clone(numbers);
    }
    gl_matrix_extensions.parseVec2 = parseVec2;
    function parseVec3(v3str) {
        if (v3str === undefined || v3str === '') {
            return undefined;
        }
        var numbers = [];
        try {
            numbers = JSON.parse("[" + v3str + "]");
        }
        catch (error) {
            return undefined;
        }
        return numbers.length !== 3 || isNaN(numbers[0]) || isNaN(numbers[1]) || isNaN(numbers[2]) ?
            undefined : gl_matrix_1.vec3.clone(numbers);
    }
    gl_matrix_extensions.parseVec3 = parseVec3;
    function parseVec4(v4str) {
        if (v4str === undefined || v4str === '') {
            return undefined;
        }
        var numbers = [];
        try {
            numbers = JSON.parse("[" + v4str + "]");
        }
        catch (error) {
            return undefined;
        }
        return numbers.length !== 4 || isNaN(numbers[0]) || isNaN(numbers[1]) ||
            isNaN(numbers[2]) || isNaN(numbers[3]) ?
            undefined : gl_matrix_1.vec4.clone(numbers);
    }
    gl_matrix_extensions.parseVec4 = parseVec4;
    function mix(value1, value2, interpolation) {
        return value1 * (1.0 - interpolation) + value2 * interpolation;
    }
    gl_matrix_extensions.mix = mix;
    function m2() {
        return gl_matrix_1.mat2.create();
    }
    gl_matrix_extensions.m2 = m2;
    function m3() {
        return gl_matrix_1.mat3.create();
    }
    gl_matrix_extensions.m3 = m3;
    function m4() {
        return gl_matrix_1.mat4.create();
    }
    gl_matrix_extensions.m4 = m4;
})(gl_matrix_extensions || (gl_matrix_extensions = {}));
module.exports = gl_matrix_extensions;


/***/ }),

/***/ "./gl2facade.ts":
/*!**********************!*\
  !*** ./gl2facade.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var context_1 = __webpack_require__(/*! ./context */ "./context.ts");
var GL2Facade = (function () {
    function GL2Facade(context) {
        this.drawBuffers = undefined;
        auxiliaries_1.assert(context !== undefined, "gl2 facade expects a valid WebGL context");
        this.queryHalfFloatSupport(context);
        this.queryColorAttachments(context);
        this.queryInstancedArraySupport(context);
        this.queryDrawBuffersSupport(context);
        this.queryVertexArrayObjectSupport(context);
        this.queryMaxUniformVec3Components(context);
        this.queryTexImageInterface(context);
    }
    Object.defineProperty(GL2Facade.prototype, "HALF_FLOAT", {
        get: function () {
            return this._halfFloat;
        },
        enumerable: true,
        configurable: true
    });
    GL2Facade.prototype.queryHalfFloatSupport = function (context) {
        switch (context.backend) {
            case context_1.Context.BackendType.WebGL1:
                this._halfFloat = context.supportsTextureHalfFloat && context.textureHalfFloat ?
                    context.textureHalfFloat.HALF_FLOAT_OES : undefined;
                break;
            case context_1.Context.BackendType.WebGL2:
            default:
                this._halfFloat = context.gl.HALF_FLOAT;
                break;
        }
    };
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT_MIN", {
        get: function () {
            return this._colorAttachmentMin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT_MAX", {
        get: function () {
            return this._colorAttachmentMax;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT0", {
        get: function () {
            return this._colorAttachments[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT1", {
        get: function () {
            return this._colorAttachments[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT2", {
        get: function () {
            return this._colorAttachments[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT3", {
        get: function () {
            return this._colorAttachments[3];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT4", {
        get: function () {
            return this._colorAttachments[4];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT5", {
        get: function () {
            return this._colorAttachments[5];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT6", {
        get: function () {
            return this._colorAttachments[6];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT7", {
        get: function () {
            return this._colorAttachments[7];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT8", {
        get: function () {
            return this._colorAttachments[8];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT9", {
        get: function () {
            return this._colorAttachments[9];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT10", {
        get: function () {
            return this._colorAttachments[10];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT11", {
        get: function () {
            return this._colorAttachments[11];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT12", {
        get: function () {
            return this._colorAttachments[12];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT13", {
        get: function () {
            return this._colorAttachments[13];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT14", {
        get: function () {
            return this._colorAttachments[14];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL2Facade.prototype, "COLOR_ATTACHMENT15", {
        get: function () {
            return this._colorAttachments[15];
        },
        enumerable: true,
        configurable: true
    });
    GL2Facade.prototype.queryColorAttachments = function (context) {
        var gl = context.gl;
        this._colorAttachments = new Array(16);
        this._colorAttachments[0] = gl.COLOR_ATTACHMENT0;
        switch (context.backend) {
            case context_1.Context.BackendType.WebGL1:
                var drawBuffers = context.supportsDrawBuffers ? context.drawBuffers : undefined;
                this._colorAttachmentMin = this._colorAttachments[0];
                this._colorAttachmentMax = this._colorAttachmentMin + (drawBuffers ?
                    gl.getParameter(drawBuffers.MAX_COLOR_ATTACHMENTS_WEBGL) : 0);
                this._colorAttachments[0] = drawBuffers ? drawBuffers.COLOR_ATTACHMENT0_WEBGL : gl.COLOR_ATTACHMENT0;
                if (!drawBuffers) {
                    break;
                }
                for (var i = 1; i < 16; ++i) {
                    this._colorAttachments[i] = drawBuffers.COLOR_ATTACHMENT0_WEBGL + i;
                }
                break;
            case context_1.Context.BackendType.WebGL2:
            default:
                this._colorAttachmentMin = context.gl.COLOR_ATTACHMENT0;
                this._colorAttachmentMax = context.gl.COLOR_ATTACHMENT0
                    + gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);
                for (var i = 0; i < 16; ++i) {
                    this._colorAttachments[i] = gl.COLOR_ATTACHMENT0 + i;
                }
                break;
        }
    };
    GL2Facade.prototype.queryInstancedArraySupport = function (context) {
        if (!context.isWebGL2 && !context.supportsInstancedArrays) {
            return;
        }
        this.drawArraysInstanced = context.isWebGL2 ?
            function (mode, first, count, instanceCount) {
                return context.gl.drawArraysInstanced(mode, first, count, instanceCount);
            } :
            function (mode, first, count, instanceCount) {
                return context.instancedArrays.drawArraysInstancedANGLE(mode, first, count, instanceCount);
            };
        this.drawElementsInstanced = context.isWebGL2 ?
            function (mode, count, type, offset, primcount) {
                return context.gl.drawElementsInstanced(mode, count, type, offset, primcount);
            } :
            function (mode, count, type, offset, primcount) {
                return context.instancedArrays.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
            };
        this.vertexAttribDivisor = context.isWebGL2 ?
            function (index, divisor) { return context.gl.vertexAttribDivisor(index, divisor); } :
            function (index, divisor) { return context.instancedArrays.vertexAttribDivisorANGLE(index, divisor); };
    };
    GL2Facade.prototype.queryDrawBuffersSupport = function (context) {
        if (!context.isWebGL2 && !context.supportsDrawBuffers) {
            return;
        }
        this.drawBuffers = context.isWebGL2 ?
            function (buffers) { return context.gl.drawBuffers(buffers); } :
            function (buffers) { return context.drawBuffers.drawBuffersWEBGL(buffers); };
    };
    GL2Facade.prototype.queryVertexArrayObjectSupport = function (context) {
        if (!context.isWebGL2 && !context.supportsVertexArrayObject) {
            return;
        }
        this.createVertexArray = context.isWebGL2 ?
            function () { return context.gl.createVertexArray(); } :
            function () { return context.vertexArrayObject.createVertexArrayOES(); };
        this.deleteVertexArray = context.isWebGL2 ?
            function (arrayObject) { return context.gl.deleteVertexArray(arrayObject); } :
            function (arrayObject) { return context.vertexArrayObject.deleteVertexArrayOES(arrayObject); };
        this.isVertexArray = context.isWebGL2 ?
            function (arrayObject) { return context.gl.isVertexArray(arrayObject); } :
            function (arrayObject) { return context.vertexArrayObject.isVertexArrayOES(arrayObject); };
        this.bindVertexArray = context.isWebGL2 ?
            function (arrayObject) { return context.gl.bindVertexArray(arrayObject); } :
            function (arrayObject) { return context.vertexArrayObject.bindVertexArrayOES(arrayObject); };
    };
    Object.defineProperty(GL2Facade.prototype, "maxUniformVec3Components", {
        get: function () {
            return this._maxUniformVec3Components;
        },
        enumerable: true,
        configurable: true
    });
    GL2Facade.prototype.queryMaxUniformVec3Components = function (context) {
        var gl = context.gl;
        this._maxUniformVec3Components = context.isWebGL2
            ? gl.getParameter(gl.MAX_VERTEX_UNIFORM_COMPONENTS)
            : gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) * 3;
    };
    GL2Facade.prototype.queryTexImageInterface = function (context) {
        var gl = context.gl;
        if (context.isWebGL2) {
            this.texImage2D = function (target, level, internalformat, width, height, border, format, type, source, offset) {
                if (source instanceof ArrayBuffer) {
                    return gl.texImage2D(target, level, internalformat, width, height, border, format, type, source === undefined ? null : source, offset);
                }
                auxiliaries_1.assert(offset === undefined, "offset expected to be undefined for non ArrayBuffer source");
                return gl.texImage2D(target, level, internalformat, width, height, border, format, type, source === undefined ? null : source);
            };
        }
        else {
            this.texImage2D = function (target, level, internalformat, width, height, border, format, type, source, offset) {
                if (source === undefined) {
                    return gl.texImage2D(target, level, internalformat, width, height, border, format, type, null);
                }
                if (source instanceof Int8Array
                    || source instanceof Uint8Array
                    || source instanceof Uint8ClampedArray
                    || source instanceof Int16Array
                    || source instanceof Uint16Array
                    || source instanceof Int32Array
                    || source instanceof Uint32Array
                    || source instanceof Float32Array
                    || source instanceof Float64Array
                    || source instanceof DataView) {
                    return gl.texImage2D(target, level, internalformat, width, height, border, format, type, source);
                }
                return gl.texImage2D(target, level, internalformat, format, type, source);
            };
        }
    };
    return GL2Facade;
}());
exports.GL2Facade = GL2Facade;


/***/ }),

/***/ "./initializable.ts":
/*!**************************!*\
  !*** ./initializable.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var Initializable = (function () {
    function Initializable() {
        var _this = this;
        this._initialized = false;
        this.assertInitialized = function () { return Initializable.assertInitializedFalse(_this); };
        this.assertUninitialized = function () { return undefined; };
    }
    Initializable.initialize = function () {
        return function (target, propertyKey, descriptor) {
            var initialize = descriptor.value;
            descriptor.value = function () {
                var _this = this;
                auxiliaries_1.assert(this._initialized === false, "re-initialization of initialized object not anticipated");
                this._initialized = initialize.apply(this, arguments);
                if (this._initialized) {
                    this.assertInitialized = function () { return undefined; };
                    this.assertUninitialized = function () { return Initializable.assertUninitializedFalse(_this); };
                }
                else {
                    this.assertUninitialized = function () { return undefined; };
                    this.assertInitialized = function () { return Initializable.assertInitializedFalse(_this); };
                }
                return this._initialized;
            };
            return descriptor;
        };
    };
    Initializable.uninitialize = function () {
        return function (target, propertyKey, descriptor) {
            var uninitialize = descriptor.value;
            descriptor.value = function () {
                var _this = this;
                auxiliaries_1.assert(this._initialized === true, "expected object to be initialized in order to uninitialize");
                uninitialize.apply(this);
                this._initialized = false;
                this.assertUninitialized = function () { return undefined; };
                this.assertInitialized = function () { return Initializable.assertInitializedFalse(_this); };
            };
            return descriptor;
        };
    };
    Initializable.assert_initialized = function () {
        return function (target, propertyKey, descriptor) {
            var initialize = descriptor.value;
            descriptor.value = function () {
                this.assertInitialized();
                return initialize.apply(this, arguments);
            };
            return descriptor;
        };
    };
    Initializable.assert_uninitialized = function () {
        return function (target, propertyKey, descriptor) {
            var initialize = descriptor.value;
            descriptor.value = function () {
                this.assertUninitialized();
                initialize.apply(this, arguments);
            };
            return descriptor;
        };
    };
    Object.defineProperty(Initializable.prototype, "initialized", {
        get: function () {
            return this._initialized;
        },
        enumerable: true,
        configurable: true
    });
    Initializable.assertInitializedFalse = function (object) {
        return auxiliaries_1.assert(false, "instance of " + object.constructor.name + " expected to be initialized");
    };
    Initializable.assertUninitializedFalse = function (object) {
        return auxiliaries_1.assert(false, "instance of " + object.constructor.name + " not expected to be initialized");
    };
    return Initializable;
}());
exports.Initializable = Initializable;


/***/ }),

/***/ "./kernel.ts":
/*!*******************!*\
  !*** ./kernel.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var AbstractKernel = (function () {
    function AbstractKernel(components, width, height, depth) {
        if (height === void 0) { height = 1; }
        if (depth === void 0) { depth = 1; }
        this._components = components;
        this._width = Math.max(1, width);
        this._height = Math.max(1, height);
        this._depth = Math.max(1, depth);
        this.resize();
    }
    AbstractKernel.prototype.get = function (xPosOrIndex, yPos, zPos) {
        var i;
        if (yPos === undefined && zPos === undefined) {
            i = this._components * xPosOrIndex;
        }
        else {
            i = this.index(xPosOrIndex, yPos, zPos ? zPos : 0);
        }
        auxiliaries_1.logIf(i >= this.length, auxiliaries_1.LogLevel.Dev, "index out of range [0, " + this.length + "], given " + i);
        switch (this._components) {
            case 1:
                return [this._samples[i]];
            case 2:
                return [this._samples[i], this._samples[i + 1]];
            case 3:
                return [this._samples[i], this._samples[i + 1], this._samples[i + 2]];
            case 4:
                return [this._samples[i], this._samples[i + 1], this._samples[i + 2], this._samples[i + 3]];
        }
    };
    AbstractKernel.prototype.set = function (sample, xPosOrIndex, yPos, zPos) {
        auxiliaries_1.logIf(sample.length !== this._components, auxiliaries_1.LogLevel.Dev, "number of components expected to be " + this._components + ", given " + sample.length);
        var i;
        if (yPos === undefined && zPos === undefined) {
            i = this._components * Math.min(this.elements, Math.max(0, xPosOrIndex));
        }
        else {
            i = this._components * this.index(xPosOrIndex, yPos, zPos ? zPos : 0);
        }
        auxiliaries_1.logIf(i >= this.length, auxiliaries_1.LogLevel.Dev, "index out of range [0, " + this.length + "], given " + i);
        switch (this._components) {
            case 4:
                this._samples[i + 3] = sample[3];
            case 3:
                this._samples[i + 2] = sample[2];
            case 2:
                this._samples[i + 1] = sample[1];
            case 1:
                this._samples[i + 0] = sample[0];
                break;
        }
    };
    AbstractKernel.prototype.fromJSON = function (json) {
        auxiliaries_1.assert(json.size && json.size.width !== undefined && json.size.height !== undefined &&
            json.size.depth !== undefined, "expected kernel width, height, and depth to be set, given '" + json.size + "'");
        var flatten = function (array) { return array.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []); };
        this._width = Math.max(1, json.size.width);
        this._height = Math.max(1, json.size.height);
        this._depth = Math.max(1, json.size.depth);
        var array = flatten(json.kernel);
        this._components = Math.floor(array.length / this.elements);
        this.resize();
        this.fromArray(array);
    };
    AbstractKernel.prototype.index = function (xPos, yPos, zPos) {
        if (yPos === void 0) { yPos = 0; }
        if (zPos === void 0) { zPos = 0; }
        return this._width * (this._height * Math.min(this._depth, Math.max(0, zPos))
            + Math.min(this._height, Math.max(0, yPos))) + Math.min(this._width, Math.max(0, xPos));
    };
    AbstractKernel.prototype.position = function (index) {
        var clamped = Math.min(this.elements, Math.max(0, index));
        var zPos = Math.floor(clamped / (this._width * this._height));
        clamped -= zPos * this._width * this._height;
        var yPos = Math.floor(clamped / this._width);
        clamped -= yPos * this._width;
        var xPos = clamped;
        return [xPos, yPos, zPos];
    };
    Object.defineProperty(AbstractKernel.prototype, "samples", {
        get: function () {
            return this._samples;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "length", {
        get: function () {
            return this._width * this._height * this._depth * this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "elements", {
        get: function () {
            return this._width * this._height * this._depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "components", {
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "depth", {
        get: function () {
            return this._depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "xStride", {
        get: function () {
            return this.bytesPerComponent * this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "yStride", {
        get: function () {
            return this.bytesPerComponent * this._components * this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "zStride", {
        get: function () {
            return this.bytesPerComponent * this._components * this._width * this._depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractKernel.prototype, "bytesLength", {
        get: function () {
            return this.bytesPerComponent * this._components * this._width * this._height * this._depth;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractKernel;
}());
exports.AbstractKernel = AbstractKernel;
var KernelF32 = (function (_super) {
    __extends(KernelF32, _super);
    function KernelF32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KernelF32.prototype.resize = function () {
        this._samples = new Float32Array(this.length);
    };
    KernelF32.prototype.fromArray = function (samples) {
        auxiliaries_1.assert(samples.length === this.length, "expected samples length to match this kernel's length");
        this._samples.set(new Float32Array(samples));
    };
    Object.defineProperty(KernelF32.prototype, "bytesPerComponent", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    return KernelF32;
}(AbstractKernel));
exports.KernelF32 = KernelF32;
var KernelUI32 = (function (_super) {
    __extends(KernelUI32, _super);
    function KernelUI32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KernelUI32.prototype.resize = function () {
        this._samples = new Uint32Array(this.length);
    };
    KernelUI32.prototype.fromArray = function (samples) {
        auxiliaries_1.assert(samples.length === this.length, "expected samples length to match this kernel's length");
        this._samples.set(new Uint32Array(samples));
    };
    Object.defineProperty(KernelUI32.prototype, "bytesPerComponent", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    return KernelUI32;
}(AbstractKernel));
exports.KernelUI32 = KernelUI32;
var KernelI32 = (function (_super) {
    __extends(KernelI32, _super);
    function KernelI32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KernelI32.prototype.resize = function () {
        this._samples = new Int32Array(this.length);
    };
    KernelI32.prototype.fromArray = function (samples) {
        auxiliaries_1.assert(samples.length === this.length, "expected samples length to match this kernel's length");
        this._samples.set(new Int32Array(samples));
    };
    Object.defineProperty(KernelI32.prototype, "bytesPerComponent", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    return KernelI32;
}(AbstractKernel));
exports.KernelI32 = KernelI32;
var KernelUI8 = (function (_super) {
    __extends(KernelUI8, _super);
    function KernelUI8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KernelUI8.prototype.resize = function () {
        this._samples = new Uint8Array(this.length);
    };
    KernelUI8.prototype.fromArray = function (samples) {
        auxiliaries_1.assert(samples.length === this.length, "expected samples length to match this kernel's length");
        this._samples.set(new Uint8Array(samples));
    };
    Object.defineProperty(KernelUI8.prototype, "bytesPerComponent", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    return KernelUI8;
}(AbstractKernel));
exports.KernelUI8 = KernelUI8;
var KernelI8 = (function (_super) {
    __extends(KernelI8, _super);
    function KernelI8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KernelI8.prototype.resize = function () {
        this._samples = new Int8Array(this.length);
    };
    KernelI8.prototype.fromArray = function (samples) {
        auxiliaries_1.assert(samples.length === this.length, "expected samples length to match this kernel's length");
        this._samples.set(new Int8Array(samples));
    };
    Object.defineProperty(KernelI8.prototype, "bytesPerComponent", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    return KernelI8;
}(AbstractKernel));
exports.KernelI8 = KernelI8;


/***/ }),

/***/ "./mouseeventprovider.ts":
/*!*******************************!*\
  !*** ./mouseeventprovider.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = __webpack_require__(/*! rxjs/ReplaySubject */ "rxjs/ReplaySubject");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var pointerlock_1 = __webpack_require__(/*! ./pointerlock */ "./pointerlock.ts");
var MouseEventProvider = (function () {
    function MouseEventProvider(element, timeframe) {
        var _this = this;
        this._pointerLockRequestPending = false;
        auxiliaries_1.assert(element !== undefined, "expected valid canvas element on initialization, given " + element);
        this._element = element;
        this._timeframe = timeframe;
        this._element.addEventListener('click', function () { return _this.processPointerLockRequests(); });
    }
    MouseEventProvider.prototype.processPointerLockRequests = function () {
        if (!this._pointerLockRequestPending) {
            return;
        }
        pointerlock_1.PointerLock.request(this._element);
    };
    MouseEventProvider.prototype.observable = function (type) {
        switch (type) {
            case MouseEventProvider.Type.Click:
                return this.clickObservable;
            case MouseEventProvider.Type.Enter:
                return this.enterObservable;
            case MouseEventProvider.Type.Leave:
                return this.leaveObservable;
            case MouseEventProvider.Type.Down:
                return this.downObservable;
            case MouseEventProvider.Type.Up:
                return this.upObservable;
            case MouseEventProvider.Type.Move:
                return this.moveObservable;
            case MouseEventProvider.Type.Wheel:
                return this.wheelObservable;
        }
    };
    Object.defineProperty(MouseEventProvider.prototype, "pointerLock", {
        get: function () {
            return pointerlock_1.PointerLock.active(this._element);
        },
        set: function (lock) {
            this._pointerLockRequestPending = lock;
            if (lock === false) {
                this._pointerLockRequestPending = false;
                pointerlock_1.PointerLock.exit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "clickObservable", {
        get: function () {
            var _this = this;
            if (this._clickSubject === undefined) {
                this._clickSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._clickListener = function (event) { return _this._clickSubject.next(event); };
                this._element.onclick = this._clickListener;
            }
            return this._clickSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "enterObservable", {
        get: function () {
            var _this = this;
            if (this._enterSubject === undefined) {
                this._enterSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._enterListener = function (event) { return _this._enterSubject.next(event); };
                this._element.onmouseenter = this._enterListener;
            }
            return this._enterSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "leaveObservable", {
        get: function () {
            var _this = this;
            if (this._leaveSubject === undefined) {
                this._leaveSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._leaveListener = function (event) { return _this._leaveSubject.next(event); };
                this._element.onmouseleave = this._leaveListener;
            }
            return this._leaveSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "downObservable", {
        get: function () {
            var _this = this;
            if (this._downSubject === undefined) {
                this._downSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._downListener = function (event) { return _this._downSubject.next(event); };
                this._element.onmousedown = this._downListener;
            }
            return this._downSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "upObservable", {
        get: function () {
            var _this = this;
            if (this._upSubject === undefined) {
                this._upSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._upListener = function (event) { return _this._upSubject.next(event); };
                this._element.onmouseup = this._upListener;
            }
            return this._upSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "moveObservable", {
        get: function () {
            var _this = this;
            if (this._moveSubject === undefined) {
                this._moveSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._moveListener = function (event) { return _this._moveSubject.next(event); };
                this._element.onmousemove = this._moveListener;
            }
            return this._moveSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEventProvider.prototype, "wheelObservable", {
        get: function () {
            var _this = this;
            if (this._wheelSubject === undefined) {
                this._wheelSubject = new ReplaySubject_1.ReplaySubject(undefined, this._timeframe);
                this._wheelListener = function (event) { return _this._wheelSubject.next(event); };
                this._element.onwheel = this._wheelListener;
            }
            return this._wheelSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    return MouseEventProvider;
}());
exports.MouseEventProvider = MouseEventProvider;
(function (MouseEventProvider) {
    var Type;
    (function (Type) {
        Type[Type["Click"] = 0] = "Click";
        Type[Type["Enter"] = 1] = "Enter";
        Type[Type["Leave"] = 2] = "Leave";
        Type[Type["Down"] = 3] = "Down";
        Type[Type["Up"] = 4] = "Up";
        Type[Type["Move"] = 5] = "Move";
        Type[Type["Wheel"] = 6] = "Wheel";
    })(Type = MouseEventProvider.Type || (MouseEventProvider.Type = {}));
})(MouseEventProvider = exports.MouseEventProvider || (exports.MouseEventProvider = {}));
exports.MouseEventProvider = MouseEventProvider;


/***/ }),

/***/ "./navigation.ts":
/*!***********************!*\
  !*** ./navigation.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var eventhandler_1 = __webpack_require__(/*! ./eventhandler */ "./eventhandler.ts");
var pointerlock_1 = __webpack_require__(/*! ./pointerlock */ "./pointerlock.ts");
var firstpersonmodifier_1 = __webpack_require__(/*! ./firstpersonmodifier */ "./firstpersonmodifier.ts");
var trackballmodifier_1 = __webpack_require__(/*! ./trackballmodifier */ "./trackballmodifier.ts");
var turntablemodifier_1 = __webpack_require__(/*! ./turntablemodifier */ "./turntablemodifier.ts");
var Navigation = (function () {
    function Navigation(invalidate, mouseEventProvider) {
        var _this = this;
        this._alwaysRotateOnMove = false;
        this._invalidate = invalidate;
        this._eventHandler = new eventhandler_1.EventHandler(invalidate, mouseEventProvider);
        this._eventHandler.pushMouseDownHandler(function (latests, previous) {
            return _this.onMouseDown(latests, previous);
        });
        this._eventHandler.pushMouseUpHandler(function (latests, previous) {
            return _this.onMouseUp(latests, previous);
        });
        this._eventHandler.pushMouseMoveHandler(function (latests, previous) {
            return _this.onMouseMove(latests, previous);
        });
        this._eventHandler.pushClickHandler(function (latests, previous) {
            return _this.onClick(latests, previous);
        });
        this.metaphor = Navigation.Metaphor.Turntable;
    }
    Navigation.prototype.mode = function (event) {
        var isPrimaryButtonDown = event.buttons & 1;
        var isMouseDown = event.type === 'mousedown';
        var isMouseMove = event.type === 'mousemove';
        var isPointerLockedRotate = pointerlock_1.PointerLock.active() && this._alwaysRotateOnMove;
        if (isPointerLockedRotate || ((isMouseDown || isMouseMove) && isPrimaryButtonDown)) {
            return Navigation.Modes.Rotate;
        }
        return undefined;
    };
    Navigation.prototype.rotate = function (event, start) {
        var point = this._eventHandler.offsets(event)[0];
        switch (this._metaphor) {
            case Navigation.Metaphor.FirstPerson:
                var firstPerson = this._firstPerson;
                var movement = void 0;
                if (pointerlock_1.PointerLock.active() && event instanceof MouseEvent) {
                    movement = gl_matrix_1.vec2.fromValues(event.movementX, event.movementY);
                }
                start ? firstPerson.initiate(point) : firstPerson.process(point, movement);
                event.preventDefault();
                break;
            case Navigation.Metaphor.Trackball:
                var trackball = this._trackball;
                start ? trackball.initiate(point) : trackball.process(point);
                event.preventDefault();
                break;
            case Navigation.Metaphor.Turntable:
                var turntable = this._turntable;
                start ? turntable.initiate(point) : turntable.process(point);
                event.preventDefault();
                break;
            default:
                break;
        }
    };
    Navigation.prototype.onMouseDown = function (latests, previous) {
        var event = latests[latests.length - 1];
        this._mode = this.mode(event);
        switch (this._mode) {
            case Navigation.Modes.Zoom:
                break;
            case Navigation.Modes.Rotate:
                this.rotate(event, true);
                break;
            default:
                break;
        }
    };
    Navigation.prototype.onMouseUp = function (latests, previous) {
        var event = latests[latests.length - 1];
        if (undefined === this._mode) {
            return;
        }
        event.preventDefault();
    };
    Navigation.prototype.onMouseMove = function (latests, previous) {
        var event = latests[latests.length - 1];
        var modeWasUndefined = (this._mode === undefined);
        this._mode = this.mode(event);
        switch (this._mode) {
            case Navigation.Modes.Rotate:
                this.rotate(event, modeWasUndefined);
                break;
            default:
                break;
        }
    };
    Navigation.prototype.onClick = function (latests, previous) {
    };
    Navigation.prototype.update = function () {
        this._eventHandler.update();
    };
    Object.defineProperty(Navigation.prototype, "camera", {
        set: function (camera) {
            this._camera = camera;
            if (this._firstPerson) {
                this._firstPerson.camera = camera;
            }
            if (this._trackball) {
                this._trackball.camera = camera;
            }
            if (this._turntable) {
                this._turntable.camera = camera;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "metaphor", {
        get: function () {
            return this._metaphor;
        },
        set: function (metaphor) {
            if (this._metaphor === metaphor) {
                return;
            }
            this._firstPerson = undefined;
            this._trackball = undefined;
            this._turntable = undefined;
            this._eventHandler.exitPointerLock();
            this._alwaysRotateOnMove = false;
            this._metaphor = metaphor;
            switch (this._metaphor) {
                case Navigation.Metaphor.FirstPerson:
                    this._eventHandler.requestPointerLock();
                    this._alwaysRotateOnMove = true;
                    this._firstPerson = new firstpersonmodifier_1.FirstPersonModifier();
                    this._firstPerson.camera = this._camera;
                    break;
                case Navigation.Metaphor.Trackball:
                    this._trackball = new trackballmodifier_1.TrackballModifier();
                    this._trackball.camera = this._camera;
                    break;
                case Navigation.Metaphor.Turntable:
                    this._turntable = new turntablemodifier_1.TurntableModifier();
                    this._turntable.camera = this._camera;
                    break;
                default:
                    break;
            }
            this._invalidate(true);
        },
        enumerable: true,
        configurable: true
    });
    return Navigation;
}());
exports.Navigation = Navigation;
(function (Navigation) {
    var Modes;
    (function (Modes) {
        Modes[Modes["Move"] = 0] = "Move";
        Modes[Modes["Pan"] = 1] = "Pan";
        Modes[Modes["Rotate"] = 2] = "Rotate";
        Modes[Modes["Zoom"] = 3] = "Zoom";
        Modes[Modes["ZoomStep"] = 4] = "ZoomStep";
    })(Modes = Navigation.Modes || (Navigation.Modes = {}));
    var Metaphor;
    (function (Metaphor) {
        Metaphor["FirstPerson"] = "firstperson";
        Metaphor["Flight"] = "flight";
        Metaphor["Trackball"] = "trackball";
        Metaphor["Turntable"] = "turntable";
    })(Metaphor = Navigation.Metaphor || (Navigation.Metaphor = {}));
})(Navigation = exports.Navigation || (exports.Navigation = {}));
exports.Navigation = Navigation;


/***/ }),

/***/ "./ndcfillingrectangle.ts":
/*!********************************!*\
  !*** ./ndcfillingrectangle.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var buffer_1 = __webpack_require__(/*! ./buffer */ "./buffer.ts");
var geometry_1 = __webpack_require__(/*! ./geometry */ "./geometry.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var NdcFillingRectangle = (function (_super) {
    __extends(NdcFillingRectangle, _super);
    function NdcFillingRectangle(context, identifier) {
        var _this = _super.call(this, context, identifier) || this;
        identifier = identifier !== undefined && identifier !== "" ? identifier : _this.constructor.name;
        var vertexVBO = new buffer_1.Buffer(context, identifier + 'VBO');
        _this._buffers.push(vertexVBO);
        return _this;
    }
    NdcFillingRectangle.prototype.bindBuffers = function (indices) {
        this._buffers[0].attribEnable(indices[0], 2, this.context.gl.FLOAT, false, 0, 0, true, false);
    };
    NdcFillingRectangle.prototype.unbindBuffers = function (indices) {
        this._buffers[0].attribDisable(indices[0], true, true);
    };
    NdcFillingRectangle.prototype.initialize = function (aVertex) {
        var gl = this.context.gl;
        var valid = _super.prototype.initialize.call(this, [gl.ARRAY_BUFFER], [aVertex]);
        auxiliaries_1.assert(this._buffers[0] !== undefined && this._buffers[0].object instanceof WebGLBuffer, "expected valid WebGLBuffer");
        this._buffers[0].data(NdcFillingRectangle.VERTICES, gl.STATIC_DRAW);
        return valid;
    };
    NdcFillingRectangle.prototype.draw = function () {
        var gl = this.context.gl;
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    NdcFillingRectangle.VERTICES = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], NdcFillingRectangle.prototype, "draw", null);
    return NdcFillingRectangle;
}(geometry_1.Geometry));
exports.NdcFillingRectangle = NdcFillingRectangle;


/***/ }),

/***/ "./ndcfillingtriangle.ts":
/*!*******************************!*\
  !*** ./ndcfillingtriangle.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var buffer_1 = __webpack_require__(/*! ./buffer */ "./buffer.ts");
var geometry_1 = __webpack_require__(/*! ./geometry */ "./geometry.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var NdcFillingTriangle = (function (_super) {
    __extends(NdcFillingTriangle, _super);
    function NdcFillingTriangle(context, identifier) {
        var _this = _super.call(this, context, identifier) || this;
        identifier = identifier !== undefined && identifier !== "" ? identifier : _this.constructor.name;
        var vertexVBO = new buffer_1.Buffer(context, identifier + 'VBO');
        _this._buffers.push(vertexVBO);
        return _this;
    }
    NdcFillingTriangle.prototype.bindBuffers = function (indices) {
        this._buffers[0].attribEnable(indices[0], 2, this.context.gl.FLOAT, false, 0, 0, true, false);
        this._aVertex = indices[0];
    };
    NdcFillingTriangle.prototype.unbindBuffers = function (indices) {
        this._buffers[0].attribDisable(indices[0], true, true);
    };
    NdcFillingTriangle.prototype.initialize = function (aVertex) {
        var gl = this.context.gl;
        var valid = _super.prototype.initialize.call(this, [gl.ARRAY_BUFFER], [aVertex]);
        auxiliaries_1.assert(this._buffers[0] !== undefined && this._buffers[0].object instanceof WebGLBuffer, "expected valid WebGLBuffer");
        this._buffers[0].data(NdcFillingTriangle.VERTICES, gl.STATIC_DRAW);
        return valid;
    };
    NdcFillingTriangle.prototype.draw = function () {
        var gl = this.context.gl;
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    Object.defineProperty(NdcFillingTriangle.prototype, "aVertex", {
        get: function () {
            return this._aVertex;
        },
        enumerable: true,
        configurable: true
    });
    NdcFillingTriangle.VERTICES = new Float32Array([-1.0, -3.0, 3.0, 1.0, -1.0, 1.0]);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], NdcFillingTriangle.prototype, "draw", null);
    return NdcFillingTriangle;
}(geometry_1.Geometry));
exports.NdcFillingTriangle = NdcFillingTriangle;


/***/ }),

/***/ "./object.ts":
/*!*******************!*\
  !*** ./object.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var AbstractObject = (function (_super) {
    __extends(AbstractObject, _super);
    function AbstractObject(context, identifier) {
        var _this = _super.call(this) || this;
        _this._valid = false;
        _this._referenceCount = 0;
        _this._context = context;
        _this._identifier = identifier !== undefined && identifier !== "" ? identifier : _this.constructor.name;
        return _this;
    }
    AbstractObject.prototype.initialize = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._identifier = this._context.allocationRegister.createUniqueIdentifier(this._identifier);
        this.create.apply(this, args);
        if (!this._valid) {
            this._context.allocationRegister.deleteUniqueIdentifier(this._identifier);
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "initialization of '" + this._identifier + "' failed");
        }
        return this._valid;
    };
    AbstractObject.prototype.uninitialize = function () {
        this._context.allocationRegister.reallocate(this._identifier, 0);
        this._context.allocationRegister.deleteUniqueIdentifier(this._identifier);
        this.delete();
        auxiliaries_1.assert(this._object === undefined, "expected object '" + this._identifier + "' to be undefined after delete");
        auxiliaries_1.assert(this._valid === false, "expected object '" + this._identifier + "' to be invalid after delete");
    };
    Object.defineProperty(AbstractObject.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractObject.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractObject.prototype, "object", {
        get: function () {
            auxiliaries_1.assert(this._object !== undefined, "access to undefined object");
            return this._object;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractObject.prototype, "valid", {
        get: function () {
            return this._valid;
        },
        enumerable: true,
        configurable: true
    });
    AbstractObject.prototype.ref = function () {
        auxiliaries_1.assert(this.initialized, "expected object to be initialized in order to be referenced");
        ++this._referenceCount;
    };
    AbstractObject.prototype.unref = function () {
        auxiliaries_1.assert(this._referenceCount > 0, "expected object to be referenced in order to decrease its reference count");
        --this._referenceCount;
    };
    __decorate([
        initializable_1.Initializable.initialize()
    ], AbstractObject.prototype, "initialize", null);
    __decorate([
        initializable_1.Initializable.uninitialize()
    ], AbstractObject.prototype, "uninitialize", null);
    return AbstractObject;
}(initializable_1.Initializable));
exports.AbstractObject = AbstractObject;


/***/ }),

/***/ "./panmodifier.ts":
/*!************************!*\
  !*** ./panmodifier.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cameramodifier_1 = __webpack_require__(/*! ./cameramodifier */ "./cameramodifier.ts");
var PanModifier = (function (_super) {
    __extends(PanModifier, _super);
    function PanModifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PanModifier.prototype.update = function () {
    };
    return PanModifier;
}(cameramodifier_1.CameraModifier));
exports.PanModifier = PanModifier;


/***/ }),

/***/ "./pointerlock.ts":
/*!************************!*\
  !*** ./pointerlock.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var PointerLock = (function () {
    function PointerLock() {
    }
    PointerLock.queryAndCacheAPI = function () {
        if (PointerLock._exit !== undefined) {
            return;
        }
        var document = window.document;
        var exits = [
            document.exitPointerLock,
            document.mozExitPointerLock,
            document.webkitExitPointerLock,
            undefined
        ];
        var api = 0;
        for (; api < exits.length; ++api) {
            if (exits[api] === undefined) {
                continue;
            }
            break;
        }
        switch (api) {
            case 0:
                PointerLock._exit = function () { return document.exitPointerLock(); };
                PointerLock._request = function (element) { return element.requestPointerLock(); };
                PointerLock._element = function () { return document.pointerLockElement; };
                break;
            case 1:
                PointerLock._exit = function () { return document.mozCancelPointerLock(); };
                PointerLock._request = function (element) { return element.mozRequestPointerLock(); };
                PointerLock._element = function () { return document.mozPointerLockElement; };
                break;
            case 2:
                PointerLock._exit = function () { return document.webkitExitPointerLock(); };
                PointerLock._request = function (element) { return element.webkitRequestPointerLock(); };
                PointerLock._element = function () { return document.webkitPointerLockElement; };
                break;
            default:
                auxiliaries_1.assert(false, "none of the following pointer lock apis was found: native, moz, or webkit");
        }
    };
    PointerLock.active = function (element) {
        if (this._element === undefined) {
            return false;
        }
        return (element !== undefined && PointerLock._element() === element) || (element === undefined &&
            PointerLock._element() !== undefined && PointerLock._element() !== null);
    };
    PointerLock.request = function (element, callback) {
        if (element === undefined) {
            return;
        }
        PointerLock.queryAndCacheAPI();
        if (PointerLock.active() && PointerLock._element() !== element) {
            PointerLock._exit();
        }
        if (!PointerLock.active()) {
            PointerLock._request(element);
        }
    };
    PointerLock.exit = function () {
        if (PointerLock._exit) {
            PointerLock._exit();
        }
    };
    return PointerLock;
}());
exports.PointerLock = PointerLock;


/***/ }),

/***/ "./polyfill.ts":
/*!*********************!*\
  !*** ./polyfill.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _this = this;
if (String.prototype.startsWith === undefined) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return _this.indexOf(searchString, position) === position;
    };
}
if (Array.prototype.forEach === undefined) {
    Array.prototype.forEach = function (action, that) {
        var n = _this.length;
        for (var i = 0; i < n; i++) {
            if (i in _this) {
                action.call(that, _this[i], i, _this);
            }
        }
    };
}
if (Math.log10 === undefined) {
    Math.log10 = function (x) { return Math.log(x) * Math.LOG10E; };
}
if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
}


/***/ }),

/***/ "./program.ts":
/*!********************!*\
  !*** ./program.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var Program = (function (_super) {
    __extends(Program, _super);
    function Program() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Program.prototype.attach = function (shaders) {
        auxiliaries_1.assert(this._object !== undefined, "expected a WebGLProgram object");
        var gl = this._context.gl;
        for (var _i = 0, shaders_1 = shaders; _i < shaders_1.length; _i++) {
            var shader = shaders_1[_i];
            if (!shader.initialized) {
                auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "shader '" + shader.identifier + "' not initialized.");
                continue;
            }
            gl.attachShader(this._object, shader.object);
            shader.ref();
        }
        return true;
    };
    Program.prototype.link = function () {
        auxiliaries_1.assert(this._object !== undefined, "expected WebGLProgram object");
        var gl = this._context.gl;
        gl.linkProgram(this._object);
        if (!gl.getProgramParameter(this._object, gl.LINK_STATUS)) {
            var infoLog = gl.getProgramInfoLog(this._object);
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "linking of program '" + this._identifier + "' failed: '" + infoLog + "'");
            return false;
        }
        return true;
    };
    Program.prototype.detach = function (shaders) {
        auxiliaries_1.assert(this._object !== undefined, "expected WebGLProgram object");
        var gl = this._context.gl;
        for (var _i = 0, shaders_2 = shaders; _i < shaders_2.length; _i++) {
            var shader = shaders_2[_i];
            auxiliaries_1.assert(shader.initialized, "expected shader '" + shader.identifier + "' to be initialized");
            gl.detachShader(this._object, shader.object);
            shader.unref();
        }
    };
    Program.prototype.create = function (shaders) {
        var gl = this._context.gl;
        var numVertShaders = 0;
        var numFragShaders = 0;
        for (var _i = 0, shaders_3 = shaders; _i < shaders_3.length; _i++) {
            var shader = shaders_3[_i];
            switch (shader.type) {
                case gl.VERTEX_SHADER:
                    ++numVertShaders;
                    break;
                case gl.FRAGMENT_SHADER:
                    ++numFragShaders;
                    break;
                default:
                    auxiliaries_1.assert(false, "Unknown shader type detected.");
                    break;
            }
        }
        auxiliaries_1.logIf(numVertShaders < 1, auxiliaries_1.LogLevel.Dev, "at least one vertex shader is expected");
        auxiliaries_1.logIf(numFragShaders < 1, auxiliaries_1.LogLevel.Dev, "at least one fragment shader is expected");
        if (numVertShaders < 1 || numFragShaders < 1) {
            return undefined;
        }
        this._object = gl.createProgram();
        auxiliaries_1.assert(this._object instanceof WebGLProgram, "expected WebGLProgram object to be created");
        if (!this.attach(shaders) || !this.link()) {
            this.delete();
            return undefined;
        }
        this.detach(shaders);
        this._valid = gl.isProgram(this._object);
        return this._object;
    };
    Program.prototype.delete = function () {
        auxiliaries_1.assert(this._object !== undefined, "expected WebGLProgram object");
        this._context.gl.deleteProgram(this._object);
        this._object = undefined;
        this._valid = false;
    };
    Program.prototype.bind = function () {
        this._context.gl.useProgram(this._object);
    };
    Program.prototype.unbind = function () {
        this._context.gl.useProgram(Program.DEFAULT_PROGRAM);
    };
    Program.prototype.uniform = function (uniform) {
        return this._context.gl.getUniformLocation(this._object, uniform);
    };
    Program.prototype.attribute = function (attribute, location) {
        if (this._context.isWebGL2 && location !== undefined) {
            this._context.gl.bindAttribLocation(this._object, location, attribute);
            return location;
        }
        else {
            return this._context.gl.getAttribLocation(this._object, attribute);
        }
    };
    Program.DEFAULT_PROGRAM = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Program.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Program.prototype, "unbind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Program.prototype, "uniform", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Program.prototype, "attribute", null);
    return Program;
}(object_1.AbstractObject));
exports.Program = Program;


/***/ }),

/***/ "./properties.ts":
/*!***********************!*\
  !*** ./properties.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var jsonschema_1 = __webpack_require__(/*! jsonschema */ "../node_modules/jsonschema/lib/index.js");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var properties;
(function (properties_1) {
    function validate(instance, schema, references) {
        var validator = new jsonschema_1.Validator();
        if (references !== undefined) {
            for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
                var reference = references_1[_i];
                validator.addSchema(reference[0], reference[1]);
            }
        }
        var result = validator.validate(instance, schema);
        auxiliaries_1.logIf(!result.valid, auxiliaries_1.LogLevel.Dev, "schema conformance issue (setter ignored):\n" + result.toString());
        return result.valid;
    }
    properties_1.validate = validate;
    function complement(instance, schema) {
        if (instance === undefined) {
            return;
        }
        auxiliaries_1.assert((schema.hasOwnProperty('properties') && schema['type'] === 'object') ||
            (schema.hasOwnProperty('items') && schema['type'] === 'array'), "expected schema to have 'properties' or 'items', given " + schema);
        switch (schema['type']) {
            case 'object':
                var propertiesSchema = schema['properties'];
                var properties_3 = Object.getOwnPropertyNames(propertiesSchema);
                for (var _i = 0, properties_2 = properties_3; _i < properties_2.length; _i++) {
                    var key = properties_2[_i];
                    var propertySchema = propertiesSchema[key];
                    var type = propertySchema['type'];
                    var isObject = type === 'object';
                    var isDefined = instance.hasOwnProperty(key);
                    var hasProperties = propertySchema.hasOwnProperty('properties');
                    var hasDefault = propertySchema.hasOwnProperty('default');
                    auxiliaries_1.assert((hasProperties && isObject) || (!hasProperties && !isObject), "expected property '" + key + "' to be of type 'object', given '" + propertySchema['type'] + "'");
                    if (isDefined && hasProperties) {
                        complement(instance[key], propertySchema);
                    }
                    else if (hasProperties) {
                        Object.defineProperty(instance, key, { value: {} });
                        complement(instance[key], propertySchema);
                    }
                    else if (!isDefined && hasDefault) {
                        Object.defineProperty(instance, key, { value: propertySchema['default'] });
                    }
                }
                break;
            case 'array':
                var itemsSchema = schema['items'];
                if (itemsSchema['type'] !== 'object') {
                    break;
                }
                for (var _a = 0, _b = Object.getOwnPropertyNames(instance); _a < _b.length; _a++) {
                    var name_1 = _b[_a];
                    if (name_1 === 'length') {
                        continue;
                    }
                    complement(instance[name_1], itemsSchema);
                }
                break;
        }
    }
    properties_1.complement = complement;
    function compare(objectL, objectR, tracker, path) {
        if (path === void 0) { path = ''; }
        var track = tracker !== undefined;
        auxiliaries_1.assert(!track || tracker.hasOwnProperty('any'), "expected allocation lookup object to have 'any' key");
        if ((objectL === undefined && objectR !== undefined) || (objectL !== undefined && objectR === undefined)) {
            if (track) {
                tracker.alter(path);
            }
            return true;
        }
        var equals = true;
        var types = [typeof objectL, typeof objectR];
        var isArray = [objectL instanceof Array, objectR instanceof Array];
        if ((!isArray[0] || !isArray[1]) && (types[0] !== 'object' || types[1] !== 'object')) {
            equals = objectL === objectR;
            if (!equals && track) {
                tracker.alter("" + path);
            }
            return !equals;
        }
        var names = Array.from(new Set(Array().concat(Object.getOwnPropertyNames(objectL), Object.getOwnPropertyNames(objectR))).values());
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_2 = names_1[_i];
            if (name_2 === 'length') {
                continue;
            }
            var values = [objectL[name_2], objectR[name_2]];
            types = [typeof values[0], typeof values[1]];
            var propertyPath = "" + path + (path.length > 0 && !isArray[0] ? '.' : '') + (!isArray[0] ? name_2 : '');
            if ((values[0] instanceof Array && values[1] instanceof Array) ||
                (types[0] === 'object' && types[1] === 'object')) {
                equals = equals && !compare(values[0], values[1], tracker, propertyPath);
            }
            else {
                if (types[0] === types[1] && values[0] === values[1]) {
                    continue;
                }
                equals = false;
                if (track) {
                    tracker.alter(propertyPath);
                }
            }
        }
        return !equals;
    }
    properties_1.compare = compare;
})(properties || (properties = {}));
module.exports = properties;


/***/ }),

/***/ "./randomsquarekernel.ts":
/*!*******************************!*\
  !*** ./randomsquarekernel.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var kernel_1 = __webpack_require__(/*! ./kernel */ "./kernel.ts");
var RandomSquareKernel = (function (_super) {
    __extends(RandomSquareKernel, _super);
    function RandomSquareKernel(width) {
        var _this = _super.call(this, 2, width) || this;
        _this.generate();
        return _this;
    }
    RandomSquareKernel.prototype.generate = function () {
        if (this.width > 0) {
            this.set([0.0, 0.0], 0);
        }
        for (var i = 1; i < this.width; ++i) {
            this.set([auxiliaries_1.rand(-0.5, +0.5), auxiliaries_1.rand(-0.5, +0.5)], i);
        }
    };
    Object.defineProperty(RandomSquareKernel.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (width) {
            if (this._width === width) {
                return;
            }
            this._width = width;
            this.resize();
            this.generate();
        },
        enumerable: true,
        configurable: true
    });
    return RandomSquareKernel;
}(kernel_1.KernelF32));
exports.RandomSquareKernel = RandomSquareKernel;


/***/ }),

/***/ "./raymath.ts":
/*!********************!*\
  !*** ./raymath.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var ray_math;
(function (ray_math) {
    function rayCircleIntersection(ray0, ray1, radius) {
        if (radius === void 0) { radius = 1.0; }
        var ray_direction = gl_matrix_1.vec2.subtract(gl_matrix_extensions_1.v2(), ray1, ray0);
        if (gl_matrix_1.vec2.equals(ray_direction, gl_matrix_1.vec2.fromValues(0.0, 0.0))) {
            return undefined;
        }
        var a = gl_matrix_1.vec2.squaredLength(ray_direction);
        var b = 2.0 * gl_matrix_1.vec2.dot(ray_direction, ray0);
        var c = gl_matrix_1.vec2.squaredLength(ray0) - radius * radius;
        var delta = b * b - 4.0 * a * c;
        if (delta < 0.0) {
            return undefined;
        }
        var s = Math.sqrt(delta);
        var t = Math.min((-b + s) / (2.0 * a), (-b - s) / (2.0 * a));
        var intersection = gl_matrix_1.vec2.scale(gl_matrix_extensions_1.v2(), ray_direction, t);
        return gl_matrix_1.vec2.add(intersection, intersection, ray0);
    }
    ray_math.rayCircleIntersection = rayCircleIntersection;
    function pointSquareIntersection(point, edgeLength) {
        if (edgeLength === void 0) { edgeLength = 1.0; }
        var a = gl_matrix_extensions_1.abs2(gl_matrix_extensions_1.v2(), point);
        if (a[0] >= a[1]) {
            return gl_matrix_1.vec2.fromValues(gl_matrix_extensions_1.sign(point[0]) * edgeLength, point[1] / a[0] * edgeLength);
        }
        return gl_matrix_1.vec2.fromValues(point[0] / a[1] * edgeLength, gl_matrix_extensions_1.sign(point[1]) * edgeLength);
    }
    ray_math.pointSquareIntersection = pointSquareIntersection;
    function raySquareIntersection(ray0, ray1, halfLength) {
        if (halfLength === void 0) { halfLength = 1.0; }
        var vertices = [gl_matrix_1.vec2.fromValues(-halfLength, +halfLength), gl_matrix_1.vec2.fromValues(-halfLength, -halfLength),
            gl_matrix_1.vec2.fromValues(+halfLength, -halfLength), gl_matrix_1.vec2.fromValues(+halfLength, +halfLength)];
        var intersections = new Array();
        for (var i = 0; i < 4; ++i) {
            var intersection = rayLineIntersection(ray0, ray1, vertices[i], vertices[(i + 1) % 4]);
            if (intersection) {
                intersections.push(intersection[1]);
            }
        }
        return intersections;
    }
    ray_math.raySquareIntersection = raySquareIntersection;
    function rayLineIntersection(ray0, ray1, line0, line1) {
        var p = ray0;
        var r = gl_matrix_1.vec2.sub(gl_matrix_extensions_1.v2(), ray1, ray0);
        var q = line0;
        var s = gl_matrix_1.vec2.sub(gl_matrix_extensions_1.v2(), line1, line0);
        var cross_rs = gl_matrix_1.vec2.cross(gl_matrix_extensions_1.v3(), r, s)[2];
        if (cross_rs === 0.0) {
            return undefined;
        }
        var qp = gl_matrix_1.vec2.sub(gl_matrix_extensions_1.v2(), q, p);
        var u = gl_matrix_1.vec2.cross(gl_matrix_extensions_1.v3(), qp, gl_matrix_1.vec2.scale(gl_matrix_extensions_1.v2(), r, 1.0 / cross_rs))[2];
        var t = gl_matrix_1.vec2.cross(gl_matrix_extensions_1.v3(), qp, gl_matrix_1.vec2.scale(gl_matrix_extensions_1.v2(), s, 1.0 / cross_rs))[2];
        if (u < 0.0 || u > 1.0 || t < 0.0) {
            return undefined;
        }
        return [gl_matrix_1.vec2.add(gl_matrix_extensions_1.v2(), q, gl_matrix_1.vec2.scale(gl_matrix_extensions_1.v2(), s, u)), t];
    }
    ray_math.rayLineIntersection = rayLineIntersection;
    function rayPlaneIntersection(ray0, ray1, origin, normal) {
        if (origin === void 0) { origin = [0.0, 0.0, 0.0]; }
        if (normal === void 0) { normal = [0.0, 1.0, 0.0]; }
        var ray_direction = gl_matrix_1.vec3.normalize(gl_matrix_extensions_1.v3(), gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), ray1, ray0));
        var rdDotN = gl_matrix_1.vec3.dot(ray_direction, normal);
        if (gl_matrix_1.vec3.equals(ray_direction, [0, 0, 0]) || rdDotN >= 0.0) {
            return undefined;
        }
        var t = gl_matrix_1.vec3.dot(gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), origin, ray0), normal) / rdDotN;
        return gl_matrix_1.vec3.add(gl_matrix_extensions_1.v3(), gl_matrix_1.vec3.scale(gl_matrix_extensions_1.v3(), ray_direction, t), ray0);
    }
    ray_math.rayPlaneIntersection = rayPlaneIntersection;
    function raySphereIntersection(ray0, ray1, origin, radius) {
        if (origin === void 0) { origin = gl_matrix_1.vec3.fromValues(0.0, 0.0, 0.0); }
        if (radius === void 0) { radius = 1.0; }
        var rayOriginToSphereCenter = gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), ray0, origin);
        var ray_direction = gl_matrix_1.vec3.normalize(gl_matrix_extensions_1.v3(), gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), ray1, ray0));
        var dot_term = gl_matrix_1.vec3.dot(ray_direction, rayOriginToSphereCenter);
        var t = dot_term * dot_term - gl_matrix_1.vec3.squaredLength(rayOriginToSphereCenter) + radius * radius;
        if (t <= 0.0) {
            return undefined;
        }
        return gl_matrix_1.vec3.add(gl_matrix_extensions_1.v3(), ray0, gl_matrix_1.vec3.scale(gl_matrix_extensions_1.v3(), ray_direction, -dot_term - Math.sqrt(t)));
    }
    ray_math.raySphereIntersection = raySphereIntersection;
    function rayPlaneIntersection_tube(ray0, ray1, radius) {
        if (radius === void 0) { radius = 1.0; }
        var intersection = rayPlaneIntersection(ray0, ray1);
        if (intersection !== undefined && gl_matrix_1.vec3.length(intersection) < radius) {
            return intersection;
        }
        var ray0_xz = gl_matrix_1.vec2.fromValues(ray0[0], ray0[2]);
        var ray1_xz = gl_matrix_1.vec2.fromValues(ray1[0], ray1[2]);
        var intersection2 = rayCircleIntersection(ray0_xz, ray1_xz, radius);
        return intersection2 ? gl_matrix_1.vec3.fromValues(intersection2[0], 0.0, intersection2[1]) : undefined;
    }
    ray_math.rayPlaneIntersection_tube = rayPlaneIntersection_tube;
    function isPointWithinSquare(point, halfLength) {
        if (halfLength === void 0) { halfLength = 1.0; }
        var p_abs = gl_matrix_extensions_1.abs2(gl_matrix_extensions_1.v2(), point);
        return p_abs[0] <= halfLength && p_abs[1] <= halfLength;
    }
    ray_math.isPointWithinSquare = isPointWithinSquare;
    function isPointWithinNDC(viewProjection, point) {
        var p_transformed = gl_matrix_1.vec3.transformMat4(gl_matrix_extensions_1.v3(), point, viewProjection);
        var p_abs = gl_matrix_extensions_1.abs3(gl_matrix_extensions_1.v3(), p_transformed);
        return p_abs[0] <= 1.0 && p_abs[1] <= 1.0 && p_transformed[2] >= 0.0 && p_transformed[2] <= 1.0;
    }
    ray_math.isPointWithinNDC = isPointWithinNDC;
    function distancePointToRay(ray0, ray1, point) {
        var ray_direction = gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), ray1, ray0);
        var ray_length = gl_matrix_1.vec3.squaredLength(ray_direction);
        if (ray_length === 0.0) {
            return 0.0;
        }
        var eyeToPoint = gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), point, ray0);
        var theta = gl_matrix_1.vec3.dot(eyeToPoint, ray_direction);
        return theta / ray_length;
    }
    ray_math.distancePointToRay = distancePointToRay;
    function eyeWithPointInView(camera, point) {
        var ray_direction = gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), camera.center, camera.eye);
        var ray_normalized = gl_matrix_1.vec3.normalize(gl_matrix_extensions_1.v3(), ray_direction);
        var ortho_v = gl_matrix_1.vec3.normalize(gl_matrix_extensions_1.v3(), gl_matrix_1.vec3.cross(gl_matrix_extensions_1.v3(), ray_normalized, camera.up));
        var ortho_u = gl_matrix_1.vec3.normalize(gl_matrix_extensions_1.v3(), gl_matrix_1.vec3.cross(gl_matrix_extensions_1.v3(), ortho_v, ray_normalized));
        var distance = distancePointToRay(camera.eye, camera.center, point);
        var closest = gl_matrix_1.vec3.add(gl_matrix_extensions_1.v3(), camera.eye, gl_matrix_1.vec3.scale(gl_matrix_extensions_1.v3(), ray_direction, distance));
        var t = gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), point, closest);
        var part_v = Math.abs(gl_matrix_1.vec3.dot(t, ortho_v)) / camera.aspect;
        var part_u = Math.abs(gl_matrix_1.vec3.dot(t, ortho_u));
        var part_max = Math.max(part_v, part_u);
        var a = part_max / Math.tan(camera.fovy * auxiliaries_1.DEG2RAD * 0.5);
        return gl_matrix_1.vec3.subtract(gl_matrix_extensions_1.v3(), closest, gl_matrix_1.vec3.scale(gl_matrix_extensions_1.v3(), ray_normalized, a));
    }
    ray_math.eyeWithPointInView = eyeWithPointInView;
})(ray_math || (ray_math = {}));
module.exports = ray_math;


/***/ }),

/***/ "./readbackpass.ts":
/*!*************************!*\
  !*** ./readbackpass.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var framebuffer_1 = __webpack_require__(/*! ./framebuffer */ "./framebuffer.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var ndcfillingtriangle_1 = __webpack_require__(/*! ./ndcfillingtriangle */ "./ndcfillingtriangle.ts");
var program_1 = __webpack_require__(/*! ./program */ "./program.ts");
var shader_1 = __webpack_require__(/*! ./shader */ "./shader.ts");
var texture2_1 = __webpack_require__(/*! ./texture2 */ "./texture2.ts");
var ReadbackPass = (function (_super) {
    __extends(ReadbackPass, _super);
    function ReadbackPass(context) {
        var _this = _super.call(this) || this;
        _this._cache = false;
        _this._depthAttachment = 0;
        _this._cachedDepths = new Map();
        _this._cachedIDs = new Map();
        _this._buffer = new Uint8Array(4);
        _this._ndcTriangleShared = false;
        _this._context = context;
        return _this;
    }
    ReadbackPass.prototype.onFrame = function () {
        this._cachedDepths.clear();
        this._cachedIDs.clear();
    };
    ReadbackPass.prototype.hash = function (x, y) {
        return 0xffff * y + x;
    };
    ReadbackPass.prototype.directReadDepthAt = function (x, y) {
        var hash = this.hash(x, y);
        if (this._cache && this._cachedDepths.has(hash)) {
            return this._cachedDepths.get(hash);
        }
        auxiliaries_1.assert(this._depthFBO !== undefined && this._depthFBO.valid, "valid depth FBO expected for reading back depth");
        var texture = this._depthFBO.texture(this._depthAttachment);
        var gl = this._context.gl;
        var size = texture.size;
        this._depthFBO.bind();
        if (this._context.isWebGL2 || this._context.supportsDrawBuffers) {
            gl.readBuffer(this._depthAttachment);
        }
        gl.readPixels(x, size[1] - (y + 0.5), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this._buffer);
        var depth = gl_matrix_extensions_1.decode_float24x1_from_uint8x3(gl_matrix_1.vec3.fromValues(this._buffer[0], this._buffer[1], this._buffer[2]));
        depth = depth > 0.996 ? undefined : depth;
        if (this._cache) {
            this._cachedDepths.set(hash, depth);
        }
        return depth;
    };
    ReadbackPass.prototype.renderThenReadDepthAt = function (x, y) {
        var hash = this.hash(x, y);
        if (this._cache && this._cachedDepths.has(hash)) {
            return this._cachedDepths.get(hash);
        }
        auxiliaries_1.assert(this._depthFBO !== undefined && this._depthFBO.valid, "valid depth FBO expected for reading back depth");
        var texture = this._depthFBO.texture(this._depthAttachment);
        var gl = this._context.gl;
        var size = texture.size;
        gl.viewport(0, 0, 1, 1);
        this._program.bind();
        gl.uniform2f(this._uOffset, x / size[0], (size[1] - y) / size[1]);
        gl.uniform2f(this._uScale, 1.0 / size[0], 1.0 / size[1]);
        texture.bind(gl.TEXTURE0);
        this._framebuffer.bind();
        this._ndcTriangle.bind();
        this._ndcTriangle.draw();
        this._ndcTriangle.unbind();
        texture.unbind();
        if ((this._context.isWebGL2 || this._context.supportsDrawBuffers) && gl.readBuffer) {
            gl.readBuffer(gl.COLOR_ATTACHMENT0);
        }
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this._buffer);
        this._framebuffer.unbind();
        var depth = gl_matrix_extensions_1.decode_float24x1_from_uint8x3(gl_matrix_1.vec3.fromValues(this._buffer[0], this._buffer[1], this._buffer[2]));
        depth = depth > 0.996 ? undefined : depth;
        if (this._cache) {
            this._cachedDepths.set(hash, depth);
        }
        return depth;
    };
    ReadbackPass.prototype.initialize = function (ndcTriangle) {
        var gl = this._context.gl;
        var gl2facade = this._context.gl2facade;
        if (this._context.isWebGL1 && !this._context.supportsDepthTexture) {
            this.depthAt = this.directReadDepthAt;
            return true;
        }
        this.depthAt = this.renderThenReadDepthAt;
        var vert = new shader_1.Shader(this._context, gl.VERTEX_SHADER, 'ndcvertices.vert (readback)');
        vert.initialize(__webpack_require__(/*! ./shaders/ndcvertices.vert */ "./shaders/ndcvertices.vert"));
        var frag = new shader_1.Shader(this._context, gl.FRAGMENT_SHADER, 'readbackdepth.frag');
        frag.initialize(__webpack_require__(/*! ./shaders/readbackdepth.frag */ "./shaders/readbackdepth.frag"));
        this._program = new program_1.Program(this._context, 'ReadbackDepthProgram');
        this._program.initialize([vert, frag]);
        this._uOffset = this._program.uniform('u_offset');
        this._program.bind();
        gl.uniform1i(this._program.uniform('u_texture'), 0);
        this._program.unbind();
        this._texture = new texture2_1.Texture2(this._context, 'ReadbackRenderTexture');
        this._texture.initialize(1, 1, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        this._framebuffer = new framebuffer_1.Framebuffer(this._context, 'ReadbackFBO');
        this._framebuffer.initialize([[gl2facade.COLOR_ATTACHMENT0, this._texture]]);
        if (ndcTriangle === undefined) {
            this._ndcTriangle = new ndcfillingtriangle_1.NdcFillingTriangle(this._context);
        }
        else {
            this._ndcTriangle = ndcTriangle;
            this._ndcTriangleShared = true;
        }
        if (!this._ndcTriangle.initialized) {
            var aVertex = this._program.attribute('a_vertex', 0);
            this._ndcTriangle.initialize(aVertex);
        }
        else {
            this._program.attribute('a_vertex', this._ndcTriangle.aVertex);
        }
        return true;
    };
    ReadbackPass.prototype.uninitialize = function () {
        if (this._context.isWebGL1 && !this._context.supportsDepthTexture) {
            return;
        }
        if (!this._ndcTriangleShared && this._ndcTriangle.initialized) {
            this._ndcTriangle.uninitialize();
        }
        this._program.uninitialize();
        this._texture.uninitialize();
        this._framebuffer.uninitialize();
    };
    ReadbackPass.prototype.coordsAt = function (x, y, zInNDC, viewProjectionInverse) {
        var size = this._depthFBO.texture(this._depthAttachment).size;
        var depth = zInNDC === undefined ? this.depthAt(x, y) : zInNDC;
        if (depth === undefined) {
            return undefined;
        }
        var p = gl_matrix_1.vec3.fromValues(x * 2.0 / size[0] - 1.0, 1.0 - y * 2.0 / size[1], depth * 2.0 - 1.0);
        return gl_matrix_1.vec3.transformMat4(gl_matrix_1.vec3.create(), p, viewProjectionInverse);
    };
    ReadbackPass.prototype.idAt = function (x, y) {
        var hash = this.hash(x, y);
        if (this._cache && this._cachedIDs.has(hash)) {
            return this._cachedIDs.get(hash);
        }
        var gl = this._context.gl;
        var size = this._idFBO.texture(this._idAttachment).size;
        this._idFBO.bind();
        if ((this._context.isWebGL2 || this._context.supportsDrawBuffers)
            && gl.readBuffer) {
            gl.readBuffer(this._idAttachment);
        }
        gl.readPixels(x, size[1] - (y + 0.5), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this._buffer);
        var id = gl_matrix_extensions_1.decode_uint32_from_rgba8(gl_matrix_1.vec4.fromValues(this._buffer[0], this._buffer[1], this._buffer[2], this._buffer[3]));
        if (this._cache) {
            this._cachedIDs.set(hash, id);
        }
        return id;
    };
    Object.defineProperty(ReadbackPass.prototype, "cache", {
        set: function (value) {
            this._cache = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadbackPass.prototype, "depthFBO", {
        set: function (framebuffer) {
            this._depthFBO = framebuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadbackPass.prototype, "depthAttachment", {
        set: function (attachment) {
            this._depthAttachment = attachment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadbackPass.prototype, "idFBO", {
        set: function (framebuffer) {
            this._idFBO = framebuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReadbackPass.prototype, "idAttachment", {
        set: function (attachment) {
            this._idAttachment = attachment;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], ReadbackPass.prototype, "directReadDepthAt", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], ReadbackPass.prototype, "renderThenReadDepthAt", null);
    __decorate([
        initializable_1.Initializable.initialize()
    ], ReadbackPass.prototype, "initialize", null);
    __decorate([
        initializable_1.Initializable.uninitialize()
    ], ReadbackPass.prototype, "uninitialize", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], ReadbackPass.prototype, "coordsAt", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], ReadbackPass.prototype, "idAt", null);
    return ReadbackPass;
}(initializable_1.Initializable));
exports.ReadbackPass = ReadbackPass;


/***/ }),

/***/ "./renderbuffer.ts":
/*!*************************!*\
  !*** ./renderbuffer.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var formatbytesizes_1 = __webpack_require__(/*! ./formatbytesizes */ "./formatbytesizes.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var Renderbuffer = (function (_super) {
    __extends(Renderbuffer, _super);
    function Renderbuffer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._internalFormat = undefined;
        return _this;
    }
    Renderbuffer.prototype.create = function (width, height, internalFormat) {
        auxiliaries_1.assert(width > 0 && height > 0, "renderbuffer object requires valid width and height greater than zero");
        var gl = this.context.gl;
        this._object = gl.createRenderbuffer();
        this._width = width;
        this._height = height;
        this._internalFormat = internalFormat;
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._object);
        gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height);
        this._valid = gl.isRenderbuffer(this._object);
        gl.bindRenderbuffer(gl.RENDERBUFFER, Renderbuffer.DEFAULT_RENDER_BUFFER);
        var bytes = width * height * formatbytesizes_1.byteSizeOfFormat(this.context, internalFormat);
        this.context.allocationRegister.reallocate(this._identifier, bytes);
        return this._object;
    };
    Renderbuffer.prototype.delete = function () {
        auxiliaries_1.assert(this._object instanceof WebGLRenderbuffer, "expected WebGLRenderbuffer object");
        this.context.gl.deleteRenderbuffer(this._object);
        this._object = undefined;
        this._valid = false;
        this._internalFormat = undefined;
        this._width = 0;
        this._height = 0;
    };
    Renderbuffer.prototype.bind = function () {
        this.context.gl.bindRenderbuffer(this.context.gl.RENDERBUFFER, this._object);
    };
    Renderbuffer.prototype.unbind = function () {
        this.context.gl.bindRenderbuffer(this.context.gl.RENDERBUFFER, Renderbuffer.DEFAULT_RENDER_BUFFER);
    };
    Renderbuffer.prototype.resize = function (width, height, bind, unbind) {
        if (bind === void 0) { bind = false; }
        if (unbind === void 0) { unbind = false; }
        if (width === this._width && height === this._height) {
            return;
        }
        this._width = width;
        this._height = height;
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.renderbufferStorage(gl.RENDERBUFFER, this._internalFormat, width, height);
        if (unbind) {
            this.unbind();
        }
        var bytes = width * height * formatbytesizes_1.byteSizeOfFormat(this.context, this._internalFormat);
        this.context.allocationRegister.reallocate(this._identifier, bytes);
    };
    Object.defineProperty(Renderbuffer.prototype, "bytes", {
        get: function () {
            this.assertInitialized();
            return this.context.allocationRegister.allocated(this._identifier);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderbuffer.prototype, "internalFormat", {
        get: function () {
            this.assertInitialized();
            return this._internalFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderbuffer.prototype, "width", {
        get: function () {
            this.assertInitialized();
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderbuffer.prototype, "height", {
        get: function () {
            this.assertInitialized();
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderbuffer.prototype, "size", {
        get: function () {
            return [this.width, this.height];
        },
        enumerable: true,
        configurable: true
    });
    Renderbuffer.DEFAULT_RENDER_BUFFER = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderbuffer.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderbuffer.prototype, "unbind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderbuffer.prototype, "resize", null);
    return Renderbuffer;
}(object_1.AbstractObject));
exports.Renderbuffer = Renderbuffer;


/***/ }),

/***/ "./renderer.ts":
/*!*********************!*\
  !*** ./renderer.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = __webpack_require__(/*! rxjs/ReplaySubject */ "rxjs/ReplaySubject");
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var changelookup_1 = __webpack_require__(/*! ./changelookup */ "./changelookup.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var tuples_1 = __webpack_require__(/*! ./tuples */ "./tuples.ts");
var wizard_1 = __webpack_require__(/*! ./wizard */ "./wizard.ts");
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._altered = Object.assign(new changelookup_1.ChangeLookup(), {
            any: false, multiFrameNumber: false, frameSize: false, canvasSize: false, framePrecision: false,
            clearColor: false, debugTexture: false,
        });
        _this._frameSize = [0, 0];
        _this._canvasSize = [0, 0];
        _this._framePrecision = wizard_1.Wizard.Precision.half;
        _this._clearColor = [0.0, 0.0, 0.0, 1.0];
        _this._debugTextures = new Array();
        _this._debugTextureSubject = new ReplaySubject_1.ReplaySubject(1);
        return _this;
    }
    Renderer.prototype.invalidate = function (force) {
        if (force === void 0) { force = false; }
        this._invalidate(force);
    };
    Renderer.prototype.debugTextureNext = function () {
        this._debugTextureSubject.next(this._debugTexture);
    };
    Object.defineProperty(Renderer.prototype, "context", {
        get: function () {
            this.assertInitialized();
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "canvasSize", {
        get: function () {
            this.assertInitialized();
            return this._canvasSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "altered", {
        get: function () {
            return this._altered.any;
        },
        enumerable: true,
        configurable: true
    });
    Renderer.prototype.initialize = function (context, callback, mouseEventProvider) {
        auxiliaries_1.assert(context !== undefined, "valid webgl context required");
        this._context = context;
        auxiliaries_1.assert(callback !== undefined, "valid multi-frame update callback required");
        this._invalidate = callback;
        return this.onInitialize(context, callback, mouseEventProvider);
    };
    Renderer.prototype.uninitialize = function () {
        this.onUninitialize();
    };
    Renderer.prototype.update = function (multiFrameNumber) {
        if (this._canvasSize[0] !== this._context.gl.canvas.width ||
            this._canvasSize[1] !== this._context.gl.canvas.height) {
            this._canvasSize[0] = this._context.gl.canvas.width;
            this._canvasSize[1] = this._context.gl.canvas.height;
            this._altered.alter('canvasSize');
        }
        if (this._multiFrameNumber !== multiFrameNumber) {
            this._multiFrameNumber = multiFrameNumber;
            this._altered.alter('multiFrameNumber');
        }
        return this.onUpdate() || this._altered.any;
    };
    Renderer.prototype.prepare = function () {
        this.onPrepare();
    };
    Renderer.prototype.frame = function (frameNumber, renderViews) {
        this.onFrame(frameNumber, renderViews);
    };
    Renderer.prototype.swap = function () {
        this.onSwap();
    };
    Renderer.prototype.frameCoords = function (x, y) {
        var position = gl_matrix_1.vec2.divide(gl_matrix_extensions_1.v2(), this._frameSize, this.canvasSize);
        gl_matrix_1.vec2.floor(position, gl_matrix_1.vec2.multiply(position, [x + 0.5, y + 0.5], position));
        gl_matrix_1.vec2.add(position, position, [0.5, 0.5]);
        return tuples_1.tuple2(position);
    };
    Object.defineProperty(Renderer.prototype, "frameSize", {
        set: function (size) {
            this.assertInitialized();
            if (gl_matrix_1.vec2.equals(this._frameSize, size)) {
                return;
            }
            Object.assign(this._frameSize, size);
            this._altered.alter('frameSize');
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "framePrecision", {
        set: function (precision) {
            this.assertInitialized();
            if (this._framePrecision === precision) {
                return;
            }
            this._framePrecision = precision;
            this._altered.alter('framePrecision');
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "clearColor", {
        set: function (color) {
            this.assertInitialized();
            if (gl_matrix_1.vec4.equals(this._clearColor, color)) {
                return;
            }
            Object.assign(this._clearColor, color);
            this._altered.alter('clearColor');
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "debugTextures", {
        get: function () {
            this.assertInitialized();
            return this._debugTextures;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "debugTexture", {
        get: function () {
            this.assertInitialized();
            return this._debugTexture;
        },
        set: function (index) {
            this.assertInitialized();
            if (this._debugTexture === index) {
                return;
            }
            auxiliaries_1.logIf(index >= this._debugTextures.length, auxiliaries_1.LogLevel.Dev, "invalid texture index, " +
                ("debug texture disabled (index set to -1) | " + index + " not in [-1,+" + (this._debugTextures.length - 1) + "]"));
            this._debugTexture = index < this._debugTextures.length ?
                gl_matrix_extensions_1.clamp(index, -1, this._debugTextures.length - 1) : -1;
            this._altered.alter('debugTexture');
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "debugTextureObservable", {
        get: function () {
            return this._debugTextureSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderer.prototype, "invalidate", null);
    __decorate([
        initializable_1.Initializable.initialize()
    ], Renderer.prototype, "initialize", null);
    __decorate([
        initializable_1.Initializable.uninitialize()
    ], Renderer.prototype, "uninitialize", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderer.prototype, "update", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderer.prototype, "prepare", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderer.prototype, "frame", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Renderer.prototype, "swap", null);
    return Renderer;
}(initializable_1.Initializable));
exports.Renderer = Renderer;


/***/ }),

/***/ "./require.ts":
/*!********************!*\
  !*** ./require.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/***/ }),

/***/ "./resizable.ts":
/*!**********************!*\
  !*** ./resizable.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var Resizable = (function () {
    function Resizable() {
        this._resizeEventListener = function () { return Resizable.resize(); };
        if (Resizable.instances.length === 0) {
            var event_1 = "on" + Resizable.EVENT_IDENTIFIER;
            Resizable.eventSupported = document && (event_1 in document.documentElement || event_1 in document.body);
            auxiliaries_1.logIf(!Resizable.eventSupported, auxiliaries_1.LogLevel.Dev, "resize event not supported");
        }
        if (Resizable.instances.length === 0 && Resizable.eventSupported) {
            window.addEventListener(Resizable.EVENT_IDENTIFIER, this._resizeEventListener);
        }
        Resizable.instances.push(this);
    }
    Resizable.resize = function () {
        auxiliaries_1.assert(Resizable.instances.length > 0, "resize event received without a single resizable registered");
        Resizable.instances.forEach(function (item) { return item.onResize(); });
    };
    Resizable.elementSize = function (element) {
        if (element === undefined || window === undefined || typeof window.devicePixelRatio !== 'number') {
            return [0, 0];
        }
        var scale = window.devicePixelRatio;
        var style = getComputedStyle(element);
        var size = [parseInt(style.width, 10), parseInt(style.height, 10)];
        size[0] = Math.round(size[0] * scale);
        size[1] = Math.round(size[1] * scale);
        return size;
    };
    Resizable.prototype.dispose = function () {
        var i = Resizable.instances.indexOf(this);
        auxiliaries_1.assert(i !== -1, "invalid reference counting of resizable instances");
        Resizable.instances.splice(i, 1);
        if (Resizable.instances.length === 0 && Resizable.eventSupported) {
            window.removeEventListener(Resizable.EVENT_IDENTIFIER, this._resizeEventListener);
        }
    };
    Resizable.EVENT_IDENTIFIER = 'resize';
    Resizable.instances = [];
    Resizable.eventSupported = false;
    return Resizable;
}());
exports.Resizable = Resizable;


/***/ }),

/***/ "./shader.ts":
/*!*******************!*\
  !*** ./shader.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var Shader = (function (_super) {
    __extends(Shader, _super);
    function Shader(context, type, identifier) {
        var _this = this;
        var gl = context.gl;
        if (identifier === undefined) {
            switch (type) {
                case context.gl.FRAGMENT_SHADER:
                    identifier = 'FragmentShader';
                    break;
                case context.gl.VERTEX_SHADER:
                    identifier = 'VertexShader';
                    break;
                default:
                    auxiliaries_1.assert(false, "expected either a FRAGMENT_SHADER (" + gl.FRAGMENT_SHADER + ") " +
                        ("or a VERTEX_SHADER (" + gl.VERTEX_SHADER + "), given " + type));
            }
        }
        _this = _super.call(this, context, identifier) || this;
        _this._type = type;
        return _this;
    }
    Shader.prototype.create = function (source) {
        var gl = this._context.gl;
        this._object = gl.createShader(this._type);
        auxiliaries_1.assert(this._object instanceof WebGLShader, "expected WebGLShader object to be created");
        if (this._context.isWebGL2) {
            source = '#version 300 es\n' + source;
        }
        gl.shaderSource(this._object, source);
        gl.compileShader(this._object);
        if (!gl.getShaderParameter(this._object, gl.COMPILE_STATUS)) {
            var infoLog = gl.getShaderInfoLog(this._object);
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "compilation of shader '" + this._identifier + "' failed: " + infoLog);
            this.delete();
            return undefined;
        }
        this._valid = gl.isShader(this._object);
        return this._object;
    };
    Shader.prototype.delete = function () {
        auxiliaries_1.assert(this._object !== undefined, "expected WebGLShader object");
        this._context.gl.deleteShader(this._object);
        this._object = undefined;
        this._valid = false;
    };
    Object.defineProperty(Shader.prototype, "type", {
        get: function () {
            this.assertInitialized();
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return Shader;
}(object_1.AbstractObject));
exports.Shader = Shader;


/***/ }),

/***/ "./shaders/accumulate.frag":
/*!*********************************!*\
  !*** ./shaders/accumulate.frag ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n    #define texture(sampler, coord) texture2D(sampler, coord)\n#else \n    #define varying in\n#endif\n\n\n\n#if __VERSION__ == 100\n    #define fragColor gl_FragColor\n#else\n    layout(location = 0) out vec4 fragColor;\n#endif\n\n\nuniform float u_weight;\nuniform sampler2D u_accumulationTexture;\nuniform sampler2D u_currentFrameTexture;\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    vec4 accumulationColor = texture(u_accumulationTexture, v_uv);\n    vec4 currentFrameColor = texture(u_currentFrameTexture, v_uv);\n    fragColor = mix(accumulationColor, currentFrameColor, u_weight);\n}\n"

/***/ }),

/***/ "./shaders/blit.frag":
/*!***************************!*\
  !*** ./shaders/blit.frag ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n    #define texture(sampler, coord) texture2D(sampler, coord)\n#else \n    #define varying in\n#endif\n\n\n\n#if __VERSION__ == 100\n    #define fragColor gl_FragColor\n#else \n    layout(location = 0) out vec4 fragColor;\n#endif\n\n\nuniform sampler2D u_texture;\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    fragColor = texture(u_texture, v_uv);\n}\n"

/***/ }),

/***/ "./shaders/ndcvertices.vert":
/*!**********************************!*\
  !*** ./shaders/ndcvertices.vert ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\nprecision lowp float;\n\n\n#if __VERSION__ == 100\n#else \n    #define varying out\n#endif\n\n\n\n#if __VERSION__ == 100\n    attribute vec2 a_vertex;\n#else \n    in vec2 a_vertex;\n#endif\n\n\nvarying vec2 v_uv;\n\n\nvoid main(void)\n{\n    v_uv = a_vertex * 0.5 + 0.5;\n    gl_Position = vec4(a_vertex, 0.0, 1.0);\n}\n"

/***/ }),

/***/ "./shaders/readbackdepth.frag":
/*!************************************!*\
  !*** ./shaders/readbackdepth.frag ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\nprecision highp float;\n\n\n#if __VERSION__ == 100\n    #define texture(sampler, coord) texture2D(sampler, coord)\n#else \n    #define varying in\n#endif\n\n\nconst float one255ths = 1.0 / 255.0;\n\nvec3 float24x1_to_uint8x3(const in float f) {\n    vec3 uint8x3 = vec3(f, fract(f * 256.0), fract(f * 65536.0));\n    return floor(uint8x3 * 256.0) * one255ths;\n}\n\nvec4 float24x1_to_uint8x4(const in float f) {\n    vec4 uint8x4 = vec4(f, fract(f * 256.0), fract(f * 65536.0), fract(f * 16777216.0));\n    return floor(uint8x4 * 256.0) * one255ths;\n}\n\nconst vec3 premultUint8x3 = vec3(255.0 / 256.0, 255.0 / 65536.0, 255.0 / 16777216.0);\nfloat uint8x3_to_float24x1(const in vec3 v) {\n    return dot(v, premultUint8x3); // a1 * b1 + a2 * b2 + a3 * b3  ;)\n}\n\nconst vec4 premultUint8x4 = vec4(255.0 / 256.0, 255.0 / 65536.0, 255.0 / 16777216.0, 255.0 / 4294967296.0);\nfloat uint8x4_to_float24x1(const in vec4 v) {\n    return dot(v, premultUint8x4); // a1 * b1 + a2 * b2 + a3 * b3 + a4 * b4  ;)\n}\n\n\n\n#if __VERSION__ == 100\n    #define fragDepth gl_FragColor\n#else \n    layout(location = 0) out vec4 fragDepth;\n#endif\n\n\nuniform sampler2D u_texture;\nuniform vec2 u_offset;\nuniform vec2 u_scale;\n\nvarying vec2 v_uv;\n\n\n\nvoid main(void)\n{\n    vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y) * u_scale + u_offset;\n    float depth = texture(u_texture, uv).r;\n\n    fragDepth = vec4(float24x1_to_uint8x3(depth), 1.0);\n}\n"

/***/ }),

/***/ "./texture2.ts":
/*!*********************!*\
  !*** ./texture2.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var formatbytesizes_1 = __webpack_require__(/*! ./formatbytesizes */ "./formatbytesizes.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var Texture2 = (function (_super) {
    __extends(Texture2, _super);
    function Texture2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._width = 0;
        _this._height = 0;
        _this._internalFormat = 0;
        _this._format = 0;
        _this._type = 0;
        return _this;
    }
    Texture2.prototype.create = function (width, height, internalFormat, format, type) {
        auxiliaries_1.assert(width > 0 && height > 0, "texture requires valid width and height of greater than zero");
        var gl = this._context.gl;
        var gl2facade = this._context.gl2facade;
        this._object = gl.createTexture();
        this._width = width;
        this._height = height;
        this._internalFormat = internalFormat;
        this._format = format;
        this._type = type;
        gl.bindTexture(gl.TEXTURE_2D, this._object);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl2facade.texImage2D(gl.TEXTURE_2D, 0, this._internalFormat, this._width, this._height, 0, this._format, this._type);
        gl.bindTexture(gl.TEXTURE_2D, Texture2.DEFAULT_TEXTURE);
        this._valid = gl.isTexture(this._object);
        this.context.allocationRegister.reallocate(this._identifier, 0);
        return this._object;
    };
    Texture2.prototype.delete = function () {
        auxiliaries_1.assert(this._object instanceof WebGLTexture, "expected WebGLTexture object");
        this._context.gl.deleteTexture(this._object);
        this._object = undefined;
        this._valid = false;
        this._internalFormat = 0;
        this._format = 0;
        this._type = 0;
        this._width = 0;
        this._height = 0;
    };
    Texture2.prototype.bind = function (unit) {
        var gl = this.context.gl;
        if (unit) {
            gl.activeTexture(unit);
        }
        gl.bindTexture(gl.TEXTURE_2D, this._object);
    };
    Texture2.prototype.unbind = function (unit) {
        var gl = this.context.gl;
        if (unit) {
            gl.activeTexture(unit);
        }
        gl.bindTexture(gl.TEXTURE_2D, Texture2.DEFAULT_TEXTURE);
    };
    Texture2.prototype.load = function (uri, crossOrigin) {
        var _this = this;
        if (crossOrigin === void 0) { crossOrigin = false; }
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.onerror = function () { return reject(); };
            image.onload = function () {
                _this.resize(image.width, image.height);
                _this.data(image);
                resolve();
            };
            if (crossOrigin) {
                image.crossOrigin = 'anonymous';
            }
            image.src = uri;
        });
    };
    Texture2.prototype.data = function (data, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        var gl2facade = this._context.gl2facade;
        if (bind) {
            this.bind();
        }
        gl2facade.texImage2D(gl.TEXTURE_2D, 0, this._internalFormat, this._width, this._height, 0, this._format, this._type, data);
        if (unbind) {
            this.unbind();
        }
        var bytes = 0;
        if (data !== undefined) {
            bytes = this._width * this._height * formatbytesizes_1.byteSizeOfFormat(this.context, this._internalFormat);
            if (this._type === this.context.gl2facade.HALF_FLOAT && this._internalFormat !== this.context.gl.RGBA16F) {
                bytes *= 2;
            }
            else if (this._type === this.context.gl.FLOAT && this._internalFormat !== this.context.gl.RGBA16F) {
                bytes *= 4;
            }
        }
        this.context.allocationRegister.reallocate(this._identifier, bytes);
    };
    Texture2.prototype.filter = function (mag, min, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
        if (unbind) {
            this.unbind();
        }
    };
    Texture2.prototype.wrap = function (wrap_s, wrap_t, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap_s);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap_t);
        if (unbind) {
            this.unbind();
        }
    };
    Texture2.prototype.reformat = function (internalFormat, format, type, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        if (internalFormat === this._internalFormat
            && (format === undefined || format === this._format)
            && (type === undefined || type === this._type)) {
            return;
        }
        auxiliaries_1.assert(internalFormat !== undefined, "valid internal format expected");
        this._internalFormat = internalFormat;
        if (format) {
            this._format = format;
        }
        if (type) {
            this._type = type;
        }
        this.data(undefined, bind, unbind);
    };
    Texture2.prototype.resize = function (width, height, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        if (width === this._width && height === this._height) {
            return;
        }
        this._width = width;
        this._height = height;
        this.data(undefined, bind, unbind);
    };
    Object.defineProperty(Texture2.prototype, "bytes", {
        get: function () {
            this.assertInitialized();
            return this.context.allocationRegister.allocated(this._identifier);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2.prototype, "internalFormat", {
        get: function () {
            this.assertInitialized();
            return this._internalFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2.prototype, "format", {
        get: function () {
            this.assertInitialized();
            return this._format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2.prototype, "type", {
        get: function () {
            this.assertInitialized();
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2.prototype, "width", {
        get: function () {
            this.assertInitialized();
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2.prototype, "height", {
        get: function () {
            this.assertInitialized();
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2.prototype, "size", {
        get: function () {
            return [this.width, this.height];
        },
        enumerable: true,
        configurable: true
    });
    Texture2.DEFAULT_TEXTURE = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "unbind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "load", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "data", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "filter", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "wrap", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "reformat", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], Texture2.prototype, "resize", null);
    return Texture2;
}(object_1.AbstractObject));
exports.Texture2 = Texture2;


/***/ }),

/***/ "./texturecube.ts":
/*!************************!*\
  !*** ./texturecube.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var formatbytesizes_1 = __webpack_require__(/*! ./formatbytesizes */ "./formatbytesizes.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var TextureCube = (function (_super) {
    __extends(TextureCube, _super);
    function TextureCube() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._size = 0;
        _this._internalFormat = 0;
        _this._format = 0;
        _this._type = 0;
        _this._bytes = [0, 0, 0, 0, 0, 0];
        return _this;
    }
    TextureCube.prototype.faceID = function (face) {
        var gl = this._context.gl;
        switch (face) {
            case gl.TEXTURE_CUBE_MAP_POSITIVE_X:
                return 0;
            case gl.TEXTURE_CUBE_MAP_NEGATIVE_X:
                return 1;
            case gl.TEXTURE_CUBE_MAP_POSITIVE_Y:
                return 2;
            case gl.TEXTURE_CUBE_MAP_NEGATIVE_Y:
                return 3;
            case gl.TEXTURE_CUBE_MAP_POSITIVE_Z:
                return 4;
            case gl.TEXTURE_CUBE_MAP_NEGATIVE_Z:
                return 5;
            default:
                auxiliaries_1.assert(false, "expected texture cube map identifier (" + gl.TEXTURE_CUBE_MAP_POSITIVE_X + ", " +
                    (gl.TEXTURE_CUBE_MAP_NEGATIVE_X + ", " + gl.TEXTURE_CUBE_MAP_POSITIVE_Y + ", ") +
                    (gl.TEXTURE_CUBE_MAP_NEGATIVE_Y + ", " + gl.TEXTURE_CUBE_MAP_POSITIVE_Z + ", or") +
                    (gl.TEXTURE_CUBE_MAP_NEGATIVE_Z + "), given " + face));
                return -1;
        }
    };
    TextureCube.prototype.create = function (size, internalFormat, format, type) {
        auxiliaries_1.assert(size > 0, "texture cube requires valid size (width/height) of greater than zero");
        var gl = this._context.gl;
        var gl2facade = this._context.gl2facade;
        this._object = gl.createTexture();
        this._size = size;
        this._internalFormat = internalFormat;
        this._format = format;
        this._type = type;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._object);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type);
        gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type);
        gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type);
        gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type);
        gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type);
        gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, TextureCube.DEFAULT_TEXTURE);
        this._valid = gl.isTexture(this._object);
        this.context.allocationRegister.reallocate(this._identifier, 0);
        return this._object;
    };
    TextureCube.prototype.delete = function () {
        auxiliaries_1.assert(this._object instanceof WebGLTexture, "expected WebGLTexture object");
        this._context.gl.deleteTexture(this._object);
        this._object = undefined;
        this._valid = false;
        this._internalFormat = 0;
        this._format = 0;
        this._type = 0;
        this._size = 0;
    };
    TextureCube.prototype.bind = function (unit) {
        var gl = this.context.gl;
        if (unit) {
            gl.activeTexture(unit);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._object);
    };
    TextureCube.prototype.unbind = function (unit) {
        var gl = this.context.gl;
        if (unit) {
            gl.activeTexture(unit);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, TextureCube.DEFAULT_TEXTURE);
    };
    TextureCube.prototype.load = function (urisByFace, crossOrigin) {
        var _this = this;
        if (crossOrigin === void 0) { crossOrigin = false; }
        var gl = this.context.gl;
        return new Promise(function (resolve, reject) {
            var images = new Array();
            if (urisByFace.positiveX) {
                images.push([gl.TEXTURE_CUBE_MAP_POSITIVE_X, urisByFace.positiveX]);
            }
            if (urisByFace.negativeX) {
                images.push([gl.TEXTURE_CUBE_MAP_NEGATIVE_X, urisByFace.negativeX]);
            }
            if (urisByFace.positiveY) {
                images.push([gl.TEXTURE_CUBE_MAP_POSITIVE_Y, urisByFace.positiveY]);
            }
            if (urisByFace.negativeY) {
                images.push([gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, urisByFace.negativeY]);
            }
            if (urisByFace.positiveZ) {
                images.push([gl.TEXTURE_CUBE_MAP_POSITIVE_Z, urisByFace.positiveZ]);
            }
            if (urisByFace.negativeZ) {
                images.push([gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, urisByFace.negativeZ]);
            }
            var waiting = images.length;
            var _loop_1 = function (tuple) {
                var image = new Image();
                image.onerror = function () { return reject(); };
                image.onload = function () {
                    if (image.width !== image.height) {
                        auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "image ignored, width and height expected to be equal (square image)");
                        return;
                    }
                    if (image.width !== _this._size) {
                        auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "image ignored, width and height expected to match " +
                            ("this texture's size " + _this._size + ", given " + image.width));
                        return;
                    }
                    _this.data([tuple[0], image]);
                    waiting = waiting - 1;
                    if (waiting === 0) {
                        resolve();
                    }
                };
                if (crossOrigin) {
                    image.crossOrigin = 'anonymous';
                }
                image.src = tuple[1];
            };
            for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                var tuple = images_1[_i];
                _loop_1(tuple);
            }
        });
    };
    TextureCube.prototype.data = function (data, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        var gl2facade = this.context.gl2facade;
        var bytesPerFace = this._size * this._size * formatbytesizes_1.byteSizeOfFormat(this.context, this._internalFormat);
        if (this._type === this.context.gl2facade.HALF_FLOAT && this._internalFormat !== this.context.gl.RGBA16F) {
            bytesPerFace *= 2;
        }
        else if (this._type === this.context.gl.FLOAT && this._internalFormat !== this.context.gl.RGBA16F) {
            bytesPerFace *= 4;
        }
        if (bind) {
            this.bind();
        }
        if (data instanceof Array && data.length === 2) {
            gl2facade.texImage2D(data[0], 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, data[1]);
            var id = this.faceID(data[0]);
            this.context.allocationRegister.deallocate(this._identifier, this._bytes[id]);
            this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
            this._bytes[id] = bytesPerFace;
        }
        else {
            var perFaceData = data;
            if (perFaceData.positiveX !== undefined) {
                gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, perFaceData.positiveX);
                this.context.allocationRegister.deallocate(this._identifier, this._bytes[0]);
                this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
                this._bytes[0] = bytesPerFace;
            }
            if (perFaceData.negativeX !== undefined) {
                gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, perFaceData.negativeX);
                this.context.allocationRegister.deallocate(this._identifier, this._bytes[1]);
                this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
                this._bytes[1] = bytesPerFace;
            }
            if (perFaceData.positiveY !== undefined) {
                gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, perFaceData.positiveY);
                this.context.allocationRegister.deallocate(this._identifier, this._bytes[2]);
                this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
                this._bytes[2] = bytesPerFace;
            }
            if (perFaceData.negativeY !== undefined) {
                gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, perFaceData.negativeY);
                this.context.allocationRegister.deallocate(this._identifier, this._bytes[3]);
                this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
                this._bytes[3] = bytesPerFace;
            }
            if (perFaceData.positiveZ !== undefined) {
                gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, perFaceData.positiveZ);
                this.context.allocationRegister.deallocate(this._identifier, this._bytes[4]);
                this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
                this._bytes[4] = bytesPerFace;
            }
            if (perFaceData.negativeZ !== undefined) {
                gl2facade.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this._internalFormat, this._size, this._size, 0, this._format, this._type, perFaceData.negativeZ);
                this.context.allocationRegister.deallocate(this._identifier, this._bytes[5]);
                this.context.allocationRegister.allocate(this._identifier, bytesPerFace);
                this._bytes[5] = bytesPerFace;
            }
        }
        if (unbind) {
            this.unbind();
        }
    };
    TextureCube.prototype.filter = function (mag, min, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, mag);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, min);
        if (unbind) {
            this.unbind();
        }
    };
    TextureCube.prototype.wrap = function (wrap_s, wrap_t, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        var gl = this.context.gl;
        if (bind) {
            this.bind();
        }
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, wrap_s);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, wrap_t);
        if (unbind) {
            this.unbind();
        }
    };
    TextureCube.prototype.reformat = function (internalFormat, format, type, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        if (internalFormat === this._internalFormat
            && (format === undefined || format === this._format)
            && (type === undefined || type === this._type)) {
            return;
        }
        auxiliaries_1.assert(internalFormat !== undefined, "valid internal format expected");
        this._internalFormat = internalFormat;
        if (format) {
            this._format = format;
        }
        if (type) {
            this._type = type;
        }
        this.data({ clearOnUndefined: true }, bind, unbind);
    };
    TextureCube.prototype.resize = function (size, bind, unbind) {
        if (bind === void 0) { bind = true; }
        if (unbind === void 0) { unbind = true; }
        if (size === this._size) {
            return;
        }
        this._size = size;
        this.data({ clearOnUndefined: true }, bind, unbind);
    };
    Object.defineProperty(TextureCube.prototype, "bytes", {
        get: function () {
            this.assertInitialized();
            return this.context.allocationRegister.allocated(this._identifier);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureCube.prototype, "internalFormat", {
        get: function () {
            this.assertInitialized();
            return this._internalFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureCube.prototype, "format", {
        get: function () {
            this.assertInitialized();
            return this._format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureCube.prototype, "type", {
        get: function () {
            this.assertInitialized();
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureCube.prototype, "size", {
        get: function () {
            this.assertInitialized();
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    TextureCube.DEFAULT_TEXTURE = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "unbind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "load", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "data", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "filter", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "wrap", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "reformat", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], TextureCube.prototype, "resize", null);
    return TextureCube;
}(object_1.AbstractObject));
exports.TextureCube = TextureCube;


/***/ }),

/***/ "./trackballmodifier.ts":
/*!******************************!*\
  !*** ./trackballmodifier.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var cameramodifier_1 = __webpack_require__(/*! ./cameramodifier */ "./cameramodifier.ts");
var TrackballModifier = (function (_super) {
    __extends(TrackballModifier, _super);
    function TrackballModifier() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._rotation = gl_matrix_1.mat4.create();
        _this._sensitivity = TrackballModifier.DEFAULT_SENSITIVITY;
        return _this;
    }
    TrackballModifier.prototype.initiate = function (point) {
        this._initialPoint = point;
    };
    TrackballModifier.prototype.process = function (point) {
        this._currentPoint = point;
        var magnitudes = gl_matrix_1.vec2.subtract(gl_matrix_extensions_1.v2(), this._initialPoint, this._currentPoint);
        gl_matrix_1.vec2.scale(magnitudes, magnitudes, window.devicePixelRatio * this._sensitivity);
        gl_matrix_1.vec2.copy(this._initialPoint, this._currentPoint);
        var centerToEye = gl_matrix_1.vec3.sub(gl_matrix_extensions_1.v3(), this._reference.eye, this._reference.center);
        gl_matrix_1.vec3.normalize(centerToEye, centerToEye);
        var up = gl_matrix_1.vec3.normalize(gl_matrix_extensions_1.v3(), this._reference.up);
        var ortho = gl_matrix_1.vec3.cross(gl_matrix_extensions_1.v3(), centerToEye, up);
        gl_matrix_1.vec3.scale(up, up, magnitudes[1]);
        gl_matrix_1.vec3.scale(ortho, ortho, magnitudes[0]);
        var axis = gl_matrix_1.vec3.cross(gl_matrix_extensions_1.v3(), gl_matrix_1.vec3.add(gl_matrix_extensions_1.v3(), up, ortho), centerToEye);
        gl_matrix_1.vec3.normalize(axis, axis);
        var q = gl_matrix_1.quat.setAxisAngle(gl_matrix_1.quat.create(), axis, gl_matrix_1.vec2.len(magnitudes));
        gl_matrix_1.mat4.multiply(this._rotation, this._rotation, gl_matrix_1.mat4.fromQuat(gl_matrix_extensions_1.m4(), q));
        this.update();
    };
    TrackballModifier.prototype.update = function () {
        if (this._camera === undefined) {
            return;
        }
        var T = gl_matrix_1.mat4.fromTranslation(gl_matrix_extensions_1.m4(), this._reference.center);
        gl_matrix_1.mat4.multiply(T, T, this._rotation);
        gl_matrix_1.mat4.translate(T, T, gl_matrix_1.vec3.negate(gl_matrix_extensions_1.v3(), this._reference.center));
        var up = gl_matrix_1.vec3.transformMat4(gl_matrix_extensions_1.v3(), [0.0, 1.0, 0.0], this._rotation);
        var eye = gl_matrix_1.vec3.transformMat4(gl_matrix_extensions_1.v3(), this._reference.eye, T);
        this._camera.up = up;
        this._camera.eye = eye;
    };
    Object.defineProperty(TrackballModifier.prototype, "sensitivity", {
        get: function () {
            return this._sensitivity;
        },
        set: function (sensitivity) {
            this._sensitivity = sensitivity;
        },
        enumerable: true,
        configurable: true
    });
    TrackballModifier.DEFAULT_SENSITIVITY = 0.002;
    return TrackballModifier;
}(cameramodifier_1.CameraModifier));
exports.TrackballModifier = TrackballModifier;


/***/ }),

/***/ "./tuples.ts":
/*!*******************!*\
  !*** ./tuples.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var tuples;
(function (tuples) {
    function tuple2(buffer) {
        auxiliaries_1.assert(buffer.length === 2, "expected length of buffer to be 2, given " + buffer.length);
        return [buffer[0], buffer[1]];
    }
    tuples.tuple2 = tuple2;
    function tuple3(buffer) {
        auxiliaries_1.assert(buffer.length === 3, "expected length of buffer to be 3, given " + buffer.length);
        return [buffer[0], buffer[1], buffer[2]];
    }
    tuples.tuple3 = tuple3;
    function tuple4(buffer) {
        auxiliaries_1.assert(buffer.length === 4, "expected length of buffer to be 4, given " + buffer.length);
        return [buffer[0], buffer[1], buffer[2], buffer[3]];
    }
    tuples.tuple4 = tuple4;
    function clampf(value, semantic) {
        var valueV1 = gl_matrix_extensions_1.clamp(value, 0.0, 1.0);
        auxiliaries_1.logIf(semantic !== undefined && value < 0.0 || value > 1.0, auxiliaries_1.LogLevel.User, semantic + " clamped to [" + valueV1 + "], given [" + value + "]");
        return valueV1;
    }
    tuples.clampf = clampf;
    function clampf2(tuple, semantic) {
        var tupleV2 = gl_matrix_1.vec2.fromValues(tuple[0], tuple[1]);
        if (tuple[0] < 0.0 || tuple[0] > 1.0 || tuple[1] < 0.0 || tuple[1] > 1.0) {
            gl_matrix_extensions_1.clamp2(tupleV2, tupleV2, gl_matrix_1.vec2.fromValues(0.0, 0.0), gl_matrix_1.vec2.fromValues(1.0, 1.0));
            auxiliaries_1.logIf(semantic !== undefined, auxiliaries_1.LogLevel.User, semantic + " clamped to [" + tupleV2 + "], given [" + tuple + "]");
        }
        return tuple2(tupleV2);
    }
    tuples.clampf2 = clampf2;
    function clampf3(tuple, semantic) {
        var tupleV3 = gl_matrix_1.vec3.fromValues(tuple[0], tuple[1], tuple[2]);
        if (tuple[0] < 0.0 || tuple[0] > 1.0 || tuple[1] < 0.0 || tuple[1] > 1.0 || tuple[2] < 0.0 || tuple[2] > 1.0) {
            gl_matrix_extensions_1.clamp3(tupleV3, tupleV3, gl_matrix_1.vec3.fromValues(0.0, 0.0, 0.0), gl_matrix_1.vec3.fromValues(1.0, 1.0, 1.0));
            auxiliaries_1.logIf(semantic !== undefined, auxiliaries_1.LogLevel.User, semantic + " clamped to [" + tupleV3 + "], given [" + tuple + "]");
        }
        return tuple3(tupleV3);
    }
    tuples.clampf3 = clampf3;
    function clampf4(tuple, semantic) {
        var tupleV4 = gl_matrix_1.vec4.fromValues(tuple[0], tuple[1], tuple[2], tuple[3]);
        if (tuple[0] < 0.0 || tuple[0] > 1.0 || tuple[1] < 0.0 || tuple[1] > 1.0 ||
            tuple[2] < 0.0 || tuple[2] > 1.0 || tuple[3] < 0.0 || tuple[3] > 1.0) {
            gl_matrix_extensions_1.clamp4(tupleV4, tupleV4, gl_matrix_1.vec4.fromValues(0.0, 0.0, 0.0, 0.0), gl_matrix_1.vec4.fromValues(1.0, 1.0, 1.0, 1.0));
            auxiliaries_1.logIf(semantic !== undefined, auxiliaries_1.LogLevel.User, semantic + " clamped to [" + tupleV4 + "], given [" + tuple + "]");
        }
        return tuple4(tupleV4);
    }
    tuples.clampf4 = clampf4;
    function duplicate2(tuple) {
        return [tuple[0], tuple[1]];
    }
    tuples.duplicate2 = duplicate2;
    function duplicate3(tuple) {
        return [tuple[0], tuple[1], tuple[2]];
    }
    tuples.duplicate3 = duplicate3;
    function duplicate4(tuple) {
        return [tuple[0], tuple[1], tuple[2], tuple[3]];
    }
    tuples.duplicate4 = duplicate4;
    function equals2(t0, t1) {
        return t0[0] === t1[0] && t0[1] === t1[1];
    }
    tuples.equals2 = equals2;
    function equals3(t0, t1) {
        return t0[0] === t1[0] && t0[1] === t1[1] && t0[2] === t1[2];
    }
    tuples.equals3 = equals3;
    function equals4(t0, t1) {
        return t0[0] === t1[0] && t0[1] === t1[1] && t0[2] === t1[2] && t0[3] === t1[3];
    }
    tuples.equals4 = equals4;
})(tuples || (tuples = {}));
module.exports = tuples;


/***/ }),

/***/ "./turntablemodifier.ts":
/*!******************************!*\
  !*** ./turntablemodifier.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
var gl_matrix_extensions_1 = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
var cameramodifier_1 = __webpack_require__(/*! ./cameramodifier */ "./cameramodifier.ts");
var TurntableModifier = (function (_super) {
    __extends(TurntableModifier, _super);
    function TurntableModifier() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._rotation = gl_matrix_extensions_1.m4();
        _this._maxAzimuth = +Math.PI * 0.5 - 1e-4;
        _this._minAzimuth = -Math.PI * 0.5 + 1e-4;
        _this._xAxisScreenSpace = gl_matrix_extensions_1.v3();
        _this._sensitivity = TurntableModifier.DEFAULT_SENSITIVITY;
        return _this;
    }
    TurntableModifier.prototype.initiate = function (point) {
        Object.assign(this._reference, this._camera);
        this._initialPoint = point;
        var centerToEye = gl_matrix_1.vec3.sub(gl_matrix_extensions_1.v3(), this._reference.eye, this._reference.center);
        gl_matrix_1.vec3.normalize(centerToEye, centerToEye);
        this._xAxisScreenSpace = gl_matrix_1.vec3.cross(gl_matrix_extensions_1.v3(), [0.0, 1.0, 0.0], centerToEye);
        this._azimuth = Math.acos(gl_matrix_1.vec3.dot(centerToEye, [0.0, 1.0, 0.0]));
        this._azimuth = Math.PI * 0.5 - this._azimuth;
    };
    TurntableModifier.prototype.process = function (point) {
        this._currentPoint = point;
        var magnitudes = gl_matrix_1.vec2.subtract(gl_matrix_extensions_1.v2(), this._initialPoint, this._currentPoint);
        gl_matrix_1.vec2.scale(magnitudes, magnitudes, window.devicePixelRatio * this._sensitivity);
        if (this._minAzimuth) {
            magnitudes[1] = Math.min(this._azimuth - this._minAzimuth, magnitudes[1]);
        }
        if (this._maxAzimuth) {
            magnitudes[1] = Math.max(this._azimuth - this._maxAzimuth, magnitudes[1]);
        }
        gl_matrix_1.mat4.rotateY(this._rotation, gl_matrix_extensions_1.m4(), magnitudes[0]);
        gl_matrix_1.mat4.rotate(this._rotation, this._rotation, magnitudes[1], this._xAxisScreenSpace);
        this.update();
    };
    TurntableModifier.prototype.update = function () {
        if (this._camera === undefined) {
            return;
        }
        var T = gl_matrix_1.mat4.fromTranslation(gl_matrix_extensions_1.m4(), this._reference.center);
        gl_matrix_1.mat4.multiply(T, T, this._rotation);
        gl_matrix_1.mat4.translate(T, T, gl_matrix_1.vec3.negate(gl_matrix_extensions_1.v3(), this._reference.center));
        var up = gl_matrix_1.vec3.transformMat4(gl_matrix_extensions_1.v3(), [0.0, 1.0, 0.0], this._rotation);
        var eye = gl_matrix_1.vec3.transformMat4(gl_matrix_extensions_1.v3(), this._reference.eye, T);
        this._camera.up = up;
        this._camera.eye = eye;
    };
    Object.defineProperty(TurntableModifier.prototype, "sensitivity", {
        get: function () {
            return this._sensitivity;
        },
        set: function (sensitivity) {
            this._sensitivity = sensitivity;
        },
        enumerable: true,
        configurable: true
    });
    TurntableModifier.DEFAULT_SENSITIVITY = 0.002;
    return TurntableModifier;
}(cameramodifier_1.CameraModifier));
exports.TurntableModifier = TurntableModifier;


/***/ }),

/***/ "./vertexarray.ts":
/*!************************!*\
  !*** ./vertexarray.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var initializable_1 = __webpack_require__(/*! ./initializable */ "./initializable.ts");
var object_1 = __webpack_require__(/*! ./object */ "./object.ts");
var VertexArray = (function (_super) {
    __extends(VertexArray, _super);
    function VertexArray() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._buffersBound = false;
        return _this;
    }
    VertexArray.prototype.create = function (bindBOs, unbindBOs) {
        var _this = this;
        if (this.context.isWebGL2 || this.context.supportsVertexArrayObject) {
            var gl2facade_1 = this.context.gl2facade;
            this._object = gl2facade_1.createVertexArray();
            this._valid = this._object !== undefined;
            this._bind = function () {
                gl2facade_1.bindVertexArray(_this.object);
                if (_this._buffersBound) {
                    return;
                }
                bindBOs();
                _this._buffersBound = true;
            };
            this._unbind = function () { return gl2facade_1.bindVertexArray(VertexArray.DEFAULT_VERTEX_ARRAY); };
        }
        else {
            this._bind = function () { return bindBOs(); };
            this._unbind = function () { return unbindBOs(); };
            this._valid = true;
        }
        return this._object;
    };
    VertexArray.prototype.delete = function () {
        if (!this.context.isWebGL2 && !this.context.supportsVertexArrayObject) {
            this._valid = false;
            return;
        }
        auxiliaries_1.assert(this._object !== undefined, "expected WebGLVertexArrayObject object");
        this._context.gl2facade.deleteVertexArray(this._object);
        this._object = undefined;
        this._valid = false;
        this._buffersBound = false;
    };
    VertexArray.prototype.bind = function () {
        this._bind();
    };
    VertexArray.prototype.unbind = function () {
        this._unbind();
    };
    VertexArray.DEFAULT_VERTEX_ARRAY = undefined;
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], VertexArray.prototype, "bind", null);
    __decorate([
        initializable_1.Initializable.assert_initialized()
    ], VertexArray.prototype, "unbind", null);
    return VertexArray;
}(object_1.AbstractObject));
exports.VertexArray = VertexArray;


/***/ }),

/***/ "./viewer/eventblocker.ts":
/*!********************************!*\
  !*** ./viewer/eventblocker.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var viewer;
(function (viewer) {
    var EventBlocker = (function () {
        function EventBlocker(element, events) {
            this._blockListenerByEvent = new Map();
            this._element = element;
            if (events === undefined) {
                return;
            }
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var event_1 = events_1[_i];
                this.block(event_1);
            }
        }
        EventBlocker.prototype.block = function (eventIdentifier) {
            if (this._blockListenerByEvent.has(eventIdentifier)) {
                return;
            }
            this._blockListenerByEvent.set(eventIdentifier, function (event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
            this._element.addEventListener(eventIdentifier, this._blockListenerByEvent.get(eventIdentifier));
        };
        EventBlocker.prototype.unblock = function (eventIdentifier) {
            if (!this._blockListenerByEvent.has(eventIdentifier)) {
                return;
            }
            this._element.removeEventListener(eventIdentifier, this._blockListenerByEvent.get(eventIdentifier));
            this._blockListenerByEvent.delete(eventIdentifier);
        };
        return EventBlocker;
    }());
    viewer.EventBlocker = EventBlocker;
})(viewer || (viewer = {}));
module.exports = viewer;


/***/ }),

/***/ "./viewer/fullscreen.ts":
/*!******************************!*\
  !*** ./viewer/fullscreen.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var auxiliaries_1 = __webpack_require__(/*! ../auxiliaries */ "./auxiliaries.ts");
var viewer;
(function (viewer) {
    var Fullscreen = (function () {
        function Fullscreen() {
        }
        Fullscreen.queryAndCacheAPI = function () {
            if (Fullscreen._exit !== undefined) {
                return;
            }
            var document = window.document;
            var exits = [
                document.exitFullScreen,
                document.msExitFullscreen,
                document.mozCancelFullScreen,
                document.webkitExitFullscreen,
                undefined
            ];
            var api = 0;
            for (; api < exits.length; ++api) {
                if (exits[api] === undefined) {
                    continue;
                }
                break;
            }
            switch (api) {
                case 0:
                    Fullscreen._exit = function () { return document.exitFullScreen(); };
                    Fullscreen._request = function (element) { return element.requestFullscreen(); };
                    Fullscreen._element = function () { return document.fullscreenElement; };
                    Fullscreen._event = 'fullscreenchange';
                    break;
                case 1:
                    Fullscreen._exit = function () { return document.msExitFullscreen(); };
                    Fullscreen._request = function (element) { return element.msRequestFullscreen(); };
                    Fullscreen._element = function () { return document.msFullscreenElement; };
                    Fullscreen._event = 'msfullscreenchange';
                    break;
                case 2:
                    Fullscreen._exit = function () { return document.mozCancelFullScreen(); };
                    Fullscreen._request = function (element) { return element.mozRequestFullScreen(); };
                    Fullscreen._element = function () { return document.mozFullScreenElement; };
                    Fullscreen._event = 'mozfullscreenchange';
                    break;
                case 3:
                    Fullscreen._exit = function () { return document.webkitExitFullscreen(); };
                    Fullscreen._request = function (element) { return element.webkitRequestFullscreen(); };
                    Fullscreen._element = function () { return document.webkitFullscreenElement; };
                    Fullscreen._event = 'webkitfullscreenchange';
                    break;
                default:
                    auxiliaries_1.assert(false, "none of the following fullscreen apis was found: native, ms, moz, or webkit");
            }
        };
        Fullscreen.active = function () {
            return Fullscreen._element() !== undefined && Fullscreen._element() !== null;
        };
        Fullscreen.toggle = function (element, callback) {
            if (element === undefined) {
                return;
            }
            Fullscreen.queryAndCacheAPI();
            var isFullscreen = Fullscreen.active();
            if (!isFullscreen) {
                var style = getComputedStyle(element);
                Fullscreen._size[0] = style.width;
                Fullscreen._size[1] = style.height;
            }
            if (callback) {
                callback();
            }
            if (!isFullscreen) {
                Fullscreen._callback = callback;
                window.addEventListener(Fullscreen._event, Fullscreen.addEventListener);
            }
            else {
                Fullscreen._callback = undefined;
                window.removeEventListener(Fullscreen._event, Fullscreen.removeEventListener);
                element.style.width = Fullscreen._size[0];
                element.style.height = Fullscreen._size[1];
            }
            isFullscreen ? Fullscreen._exit() : Fullscreen._request(element);
        };
        Fullscreen._size = ['0', '0'];
        Fullscreen.addEventListener = function () {
            window.removeEventListener(Fullscreen._event, Fullscreen.addEventListener);
            window.addEventListener(Fullscreen._event, Fullscreen.removeEventListener);
        };
        Fullscreen.removeEventListener = function () {
            if (Fullscreen._callback) {
                Fullscreen._callback();
                Fullscreen._callback = undefined;
            }
            window.removeEventListener(Fullscreen._event, Fullscreen.removeEventListener);
        };
        return Fullscreen;
    }());
    viewer.Fullscreen = Fullscreen;
})(viewer || (viewer = {}));
module.exports = viewer;


/***/ }),

/***/ "./webgl-operate.slim.ts":
/*!*******************************!*\
  !*** ./webgl-operate.slim.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var context_1 = __webpack_require__(/*! ./context */ "./context.ts");
exports.Context = context_1.Context;
var canvas_1 = __webpack_require__(/*! ./canvas */ "./canvas.ts");
exports.Canvas = canvas_1.Canvas;
var controller_1 = __webpack_require__(/*! ./controller */ "./controller.ts");
exports.Controller = controller_1.Controller;
var contextmasquerade_1 = __webpack_require__(/*! ./contextmasquerade */ "./contextmasquerade.ts");
exports.ContextMasquerade = contextmasquerade_1.ContextMasquerade;
var extensionshash_1 = __webpack_require__(/*! ./extensionshash */ "./extensionshash.ts");
exports.ExtensionsHash = extensionshash_1.ExtensionsHash;
var changelookup_1 = __webpack_require__(/*! ./changelookup */ "./changelookup.ts");
exports.ChangeLookup = changelookup_1.ChangeLookup;
var mouseeventprovider_1 = __webpack_require__(/*! ./mouseeventprovider */ "./mouseeventprovider.ts");
exports.MouseEventProvider = mouseeventprovider_1.MouseEventProvider;
var eventhandler_1 = __webpack_require__(/*! ./eventhandler */ "./eventhandler.ts");
exports.EventHandler = eventhandler_1.EventHandler;
var buffer_1 = __webpack_require__(/*! ./buffer */ "./buffer.ts");
exports.Buffer = buffer_1.Buffer;
var color_1 = __webpack_require__(/*! ./color */ "./color.ts");
exports.Color = color_1.Color;
var colorgradient_1 = __webpack_require__(/*! ./colorgradient */ "./colorgradient.ts");
exports.ColorGradient = colorgradient_1.ColorGradient;
var defaultframebuffer_1 = __webpack_require__(/*! ./defaultframebuffer */ "./defaultframebuffer.ts");
exports.DefaultFramebuffer = defaultframebuffer_1.DefaultFramebuffer;
var framebuffer_1 = __webpack_require__(/*! ./framebuffer */ "./framebuffer.ts");
exports.Framebuffer = framebuffer_1.Framebuffer;
var geometry_1 = __webpack_require__(/*! ./geometry */ "./geometry.ts");
exports.Geometry = geometry_1.Geometry;
var program_1 = __webpack_require__(/*! ./program */ "./program.ts");
exports.Program = program_1.Program;
var renderbuffer_1 = __webpack_require__(/*! ./renderbuffer */ "./renderbuffer.ts");
exports.Renderbuffer = renderbuffer_1.Renderbuffer;
var renderer_1 = __webpack_require__(/*! ./renderer */ "./renderer.ts");
exports.Renderer = renderer_1.Renderer;
var shader_1 = __webpack_require__(/*! ./shader */ "./shader.ts");
exports.Shader = shader_1.Shader;
var texture2_1 = __webpack_require__(/*! ./texture2 */ "./texture2.ts");
exports.Texture2 = texture2_1.Texture2;
var texturecube_1 = __webpack_require__(/*! ./texturecube */ "./texturecube.ts");
exports.TextureCube = texturecube_1.TextureCube;
var vertexarray_1 = __webpack_require__(/*! ./vertexarray */ "./vertexarray.ts");
exports.VertexArray = vertexarray_1.VertexArray;
var wizard_1 = __webpack_require__(/*! ./wizard */ "./wizard.ts");
exports.Wizard = wizard_1.Wizard;
var camera_1 = __webpack_require__(/*! ./camera */ "./camera.ts");
exports.Camera = camera_1.Camera;
var cameramodifier_1 = __webpack_require__(/*! ./cameramodifier */ "./cameramodifier.ts");
exports.CameraModifier = cameramodifier_1.CameraModifier;
var navigation_1 = __webpack_require__(/*! ./navigation */ "./navigation.ts");
exports.Navigation = navigation_1.Navigation;
var firstpersonmodifier_1 = __webpack_require__(/*! ./firstpersonmodifier */ "./firstpersonmodifier.ts");
exports.FirstPersonModifier = firstpersonmodifier_1.FirstPersonModifier;
var panmodifier_1 = __webpack_require__(/*! ./panmodifier */ "./panmodifier.ts");
exports.PanModifier = panmodifier_1.PanModifier;
var pointerlock_1 = __webpack_require__(/*! ./pointerlock */ "./pointerlock.ts");
exports.PointerLock = pointerlock_1.PointerLock;
var trackballmodifier_1 = __webpack_require__(/*! ./trackballmodifier */ "./trackballmodifier.ts");
exports.TrackballModifier = trackballmodifier_1.TrackballModifier;
var turntablemodifier_1 = __webpack_require__(/*! ./turntablemodifier */ "./turntablemodifier.ts");
exports.TurntableModifier = turntablemodifier_1.TurntableModifier;
var zoommodifier_1 = __webpack_require__(/*! ./zoommodifier */ "./zoommodifier.ts");
exports.ZoomModifier = zoommodifier_1.ZoomModifier;
var ndcfillingrectangle_1 = __webpack_require__(/*! ./ndcfillingrectangle */ "./ndcfillingrectangle.ts");
exports.NdcFillingRectangle = ndcfillingrectangle_1.NdcFillingRectangle;
var ndcfillingtriangle_1 = __webpack_require__(/*! ./ndcfillingtriangle */ "./ndcfillingtriangle.ts");
exports.NdcFillingTriangle = ndcfillingtriangle_1.NdcFillingTriangle;
var antialiasingkernel_1 = __webpack_require__(/*! ./antialiasingkernel */ "./antialiasingkernel.ts");
exports.AntiAliasingKernel = antialiasingkernel_1.AntiAliasingKernel;
var randomsquarekernel_1 = __webpack_require__(/*! ./randomsquarekernel */ "./randomsquarekernel.ts");
exports.RandomSquareKernel = randomsquarekernel_1.RandomSquareKernel;
var kernel_1 = __webpack_require__(/*! ./kernel */ "./kernel.ts");
exports.KernelF32 = kernel_1.KernelF32;
exports.KernelI32 = kernel_1.KernelI32;
exports.KernelI8 = kernel_1.KernelI8;
exports.KernelUI32 = kernel_1.KernelUI32;
exports.KernelUI8 = kernel_1.KernelUI8;
var accumulatepass_1 = __webpack_require__(/*! ./accumulatepass */ "./accumulatepass.ts");
exports.AccumulatePass = accumulatepass_1.AccumulatePass;
var blitpass_1 = __webpack_require__(/*! ./blitpass */ "./blitpass.ts");
exports.BlitPass = blitpass_1.BlitPass;
var readbackpass_1 = __webpack_require__(/*! ./readbackpass */ "./readbackpass.ts");
exports.ReadbackPass = readbackpass_1.ReadbackPass;
var root_auxiliaries = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
exports.auxiliaries = root_auxiliaries;
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
exports.vec2 = gl_matrix_1.vec2;
exports.vec3 = gl_matrix_1.vec3;
exports.vec4 = gl_matrix_1.vec4;
var gl_matrix_2 = __webpack_require__(/*! gl-matrix */ "../node_modules/gl-matrix/src/gl-matrix.js");
exports.mat2 = gl_matrix_2.mat2;
exports.mat3 = gl_matrix_2.mat3;
exports.mat4 = gl_matrix_2.mat4;
var root_gl_matrix_extensions = __webpack_require__(/*! ./gl-matrix-extensions */ "./gl-matrix-extensions.ts");
exports.gl_matrix_extensions = root_gl_matrix_extensions;
var root_raymath = __webpack_require__(/*! ./raymath */ "./raymath.ts");
exports.ray_math = root_raymath;
var root_tuples = __webpack_require__(/*! ./tuples */ "./tuples.ts");
exports.tuples = root_tuples;
var xrcontroller_1 = __webpack_require__(/*! ./xrcontroller */ "./xrcontroller.ts");
exports.supportsXR = xrcontroller_1.supportsXR;
exports.RenderView = xrcontroller_1.RenderView;
exports.XRController = xrcontroller_1.XRController;


/***/ }),

/***/ "./webgl-operate.ts":
/*!**************************!*\
  !*** ./webgl-operate.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./webgl-operate.slim */ "./webgl-operate.slim.ts"));
var root_properties = __webpack_require__(/*! ./properties */ "./properties.ts");
exports.properties = root_properties;
var debug_TestNavigation = __webpack_require__(/*! ./debug/testnavigation */ "./debug/testnavigation.ts");
var debug_TestRenderer = __webpack_require__(/*! ./debug/testrenderer */ "./debug/testrenderer.ts");
var debug;
(function (debug) {
    debug.TestRenderer = debug_TestRenderer.TestRenderer;
    debug.TestNavigation = debug_TestNavigation.TestNavigation;
})(debug = exports.debug || (exports.debug = {}));
var viewer_EventBlocker = __webpack_require__(/*! ./viewer/eventblocker */ "./viewer/eventblocker.ts");
var viewer_Fullscreen = __webpack_require__(/*! ./viewer/fullscreen */ "./viewer/fullscreen.ts");
var viewer;
(function (viewer) {
    viewer.EventBlocker = viewer_EventBlocker.EventBlocker;
    viewer.Fullscreen = viewer_Fullscreen.Fullscreen;
})(viewer = exports.viewer || (exports.viewer = {}));


/***/ }),

/***/ "./wizard.ts":
/*!*******************!*\
  !*** ./wizard.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var Wizard = (function () {
    function Wizard() {
    }
    Wizard.queryInternalTextureFormat = function (context, target, precision) {
        var gl = context.gl;
        var gl2facade = context.gl2facade;
        var floatWriteSupport = (context.isWebGL1 && context.supportsTextureFloat) ||
            (context.isWebGL2 && context.supportsColorBufferFloat);
        var halfWriteSupport = (context.isWebGL1 && context.supportsTextureHalfFloat) ||
            (context.isWebGL2 && context.supportsColorBufferFloat);
        if (precision === undefined) {
            precision = Wizard.Precision.auto;
        }
        var query = precision === undefined ? Wizard.Precision.auto : precision;
        if (!(precision in Wizard.Precision)) {
            auxiliaries_1.log(auxiliaries_1.LogLevel.Dev, "unknown precision '" + query + "' changed to '" + Wizard.Precision.auto + "'");
            precision = Wizard.Precision.auto;
        }
        if (precision === Wizard.Precision.auto) {
            query = floatWriteSupport ? Wizard.Precision.float : halfWriteSupport ?
                Wizard.Precision.half : Wizard.Precision.byte;
        }
        var type;
        var internalFormatIndex;
        if (query === Wizard.Precision.half && halfWriteSupport) {
            context.isWebGL2 ? context.colorBufferFloat : context.textureHalfFloat;
            type = gl2facade.HALF_FLOAT;
            internalFormatIndex = 1;
        }
        else if ((query === Wizard.Precision.float || query === Wizard.Precision.half)
            && floatWriteSupport) {
            context.isWebGL2 ? context.colorBufferFloat : context.textureFloat;
            type = gl.FLOAT;
            internalFormatIndex = 0;
        }
        else {
            type = gl.UNSIGNED_BYTE;
            internalFormatIndex = 2;
        }
        if (context.isWebGL1) {
            return [target, type, query];
        }
        switch (target) {
            case gl.RGBA:
                return [[gl.RGBA32F, gl.RGBA16F, gl.RGBA8][internalFormatIndex], type, query];
            case gl.RGB:
                return [[gl.RGB32F, gl.RGB16F, gl.RGB8][internalFormatIndex], type, query];
            default:
                auxiliaries_1.assert(false, "internal format querying is not yet supported for formats other than RGBA, RGB");
        }
        return [gl.NONE, gl.NONE, query];
    };
    return Wizard;
}());
exports.Wizard = Wizard;
(function (Wizard) {
    var Precision;
    (function (Precision) {
        Precision["float"] = "float";
        Precision["half"] = "half";
        Precision["byte"] = "byte";
        Precision["auto"] = "auto";
    })(Precision = Wizard.Precision || (Wizard.Precision = {}));
})(Wizard = exports.Wizard || (exports.Wizard = {}));
exports.Wizard = Wizard;


/***/ }),

/***/ "./xrcontroller.ts":
/*!*************************!*\
  !*** ./xrcontroller.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var auxiliaries_1 = __webpack_require__(/*! ./auxiliaries */ "./auxiliaries.ts");
var canvas_1 = __webpack_require__(/*! ./canvas */ "./canvas.ts");
function supportsXR() {
    return navigator.xr !== undefined;
}
exports.supportsXR = supportsXR;
var RenderView = (function () {
    function RenderView(projectionMatrix, viewMatrix, viewport) {
        this.projectionMatrix = projectionMatrix;
        this.viewMatrix = viewMatrix;
        this.viewport = viewport;
    }
    return RenderView;
}());
exports.RenderView = RenderView;
var XRController = (function () {
    function XRController(sessionOpts) {
        this.contextAttributes = {};
        this.frameOfRefType = 'eye-level';
        this.sessionCreationOptions = sessionOpts;
    }
    XRController.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        auxiliaries_1.assert(supportsXR(), 'WebXR not supported by browser');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4, navigator.xr.requestDevice()];
                    case 2:
                        _a.device = _b.sent();
                        this.contextAttributes.compatibleXRDevice = this.device;
                        return [3, 4];
                    case 3:
                        e_1 = _b.sent();
                        auxiliaries_1.log(auxiliaries_1.LogLevel.ModuleDev, "Failed to request XR device: " + e_1);
                        return [2, false];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4, this.device.supportsSession(this.sessionCreationOptions)];
                    case 5:
                        if (_b.sent()) {
                            return [2, true];
                        }
                        return [3, 7];
                    case 6:
                        e_2 = _b.sent();
                        auxiliaries_1.log(auxiliaries_1.LogLevel.ModuleDev, "XR session with options " + this.sessionCreationOptions + " not supported");
                        return [2, false];
                    case 7: return [2, false];
                }
            });
        });
    };
    XRController.prototype.requestSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, canvasEl, canvas, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4, this.device.requestSession(this.sessionCreationOptions)];
                    case 1:
                        _a.session = _c.sent();
                        canvasEl = document.createElement('canvas');
                        canvas = new canvas_1.Canvas(canvasEl, this.contextAttributes);
                        this.gl = canvas.context.gl;
                        this.session.baseLayer = new XRWebGLLayer(this.session, this.gl, this.webGLLayerInit);
                        _b = this;
                        return [4, this.session.requestFrameOfReference(this.frameOfRefType, this.frameOfRefOptions)];
                    case 2:
                        _b.frameOfRef = _c.sent();
                        this.session.requestAnimationFrame(function () { return _this.onXRFrame; });
                        return [2];
                }
            });
        });
    };
    XRController.prototype.onXRFrame = function (time, frame) {
        var _this = this;
        this.session.requestAnimationFrame(function () { return _this.onXRFrame; });
        var gl = this.gl;
        var pose = frame.getDevicePose(this.frameOfRef);
        if (pose) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.session.baseLayer.framebuffer);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            var renderViews = [];
            for (var _i = 0, _a = frame.views; _i < _a.length; _i++) {
                var view = _a[_i];
                renderViews.push(new RenderView(view.projectionMatrix, pose.getViewMatrix(view), this.session.baseLayer.getViewport(view)));
            }
            this.renderer.frame(0, renderViews);
        }
        else {
        }
    };
    return XRController;
}());
exports.XRController = XRController;


/***/ }),

/***/ "./zoommodifier.ts":
/*!*************************!*\
  !*** ./zoommodifier.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cameramodifier_1 = __webpack_require__(/*! ./cameramodifier */ "./cameramodifier.ts");
var ZoomModifier = (function (_super) {
    __extends(ZoomModifier, _super);
    function ZoomModifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomModifier.prototype.update = function () {
    };
    return ZoomModifier;
}(cameramodifier_1.CameraModifier));
exports.ZoomModifier = ZoomModifier;


/***/ }),

/***/ 0:
/*!*****************************************************!*\
  !*** multi require.ts polyfill.ts webgl-operate.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! require.ts */"./require.ts");
__webpack_require__(/*! polyfill.ts */"./polyfill.ts");
module.exports = __webpack_require__(/*! webgl-operate.ts */"./webgl-operate.ts");


/***/ }),

/***/ "rxjs/ReplaySubject":
/*!**************************************************************************************************************************!*\
  !*** external {"root":"Rx","commonjs":"rxjs/ReplaySubject","commonjs2":"rxjs/ReplaySubject","amd":"rxjs/ReplaySubject"} ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_ReplaySubject__;

/***/ })

/******/ });
});
//# sourceMappingURL=webgl-operate.js.map