"use strict";

var canvas;
var gl;

window.onload = init;

var numPlaneVertices  = 6;
var numTriangleVertices = 98;

var triangleInstanceMatrix, cubeInstanceMatrix;
var projectionMatrix;
var cameraViewMatrix;
var lightProjectionMatrix;
var lightViewMatrix;

var vPosition;

// cube rotation flag

var flag = false;

var vBuffer, cBuffer;
var framebuffer, renderbuffer;
var texture1;
var buffer1, buffer2, buffer3;

var program1, program2;

var positionsArray = [];
var colorsArray = [];

// object vertex and color data

var cubeVertices = [
    vec4(-2, -0.5,2, 1.2),
    vec4(2, -0.5, 2, 1.2),
    vec4(-2, -0.5, -2, 1.2),
    vec4(2, -0.5, -2, 1.2)
];

var cubeColors = [
    vec4(1.0, 0.5, 0.0, 1.0)  // red
];

var triangleVertices = [
    vec4(-0.4,-0.415,0.2,1.2),
    vec4(-0.4,-0.415,0.4,1.2),
    vec4(-0.2,-0.415,0.4,1.2),
    vec4(-0.2,-0.415,0.2,1.2),
    vec4(-0.4,-0.3,0.2,1.2),
    vec4(-0.4,-0.3,0.4,1.2),
    vec4(-0.2,-0.3,0.4,1.2),
    vec4(-0.2,-0.3,0.2,1.2),

    vec4(-0.8,-0.35,0.6,1.2),
    vec4(-0.8,-0.35,0.8,1.2),
    vec4(-0.6,-0.35,0.8,1.2),
    vec4(-0.6,-0.35,0.6,1.2),
    vec4(-0.8,-0.31,0.6,1.2),
    vec4(-0.8,-0.31,0.8,1.2),
    vec4(-0.6,-0.31,0.8,1.2),
    vec4(-0.6,-0.31,0.6,1.2),

    vec4(-0.62,-0.38,0.4,1.2),
    vec4(-0.62,-0.38,0.6,1.2),
    vec4(-0.38,-0.38,0.6,1.2),
    vec4(-0.38,-0.38,0.4,1.2),
    vec4(-0.62,-0.37,0.4,1.2),
    vec4(-0.62,-0.37,0.6,1.2),
    vec4(-0.38,-0.37,0.6,1.2),
    vec4(-0.38,-0.37,0.4,1.2)
];

var triangleColor = vec4(1.0, 0.0, 0.0, 1.0);

// functions to generate buffer data for objects

init();

function quad(a, b, c, d) {
     positionsArray.push(cubeVertices[a]);
     colorsArray.push(cubeColors[0]);
     positionsArray.push(cubeVertices[b]);
     colorsArray.push(cubeColors[0]);
     positionsArray.push(cubeVertices[c]);
     colorsArray.push(cubeColors[0]);
     positionsArray.push(cubeVertices[a]);
     colorsArray.push(cubeColors[0]);
     positionsArray.push(cubeVertices[c]);
     colorsArray.push(cubeColors[0]);
     positionsArray.push(cubeVertices[d]);
     colorsArray.push(cubeColors[0]);
}

function colorPlane()
{
    quad(1, 0, 2, 3);
}

function quad1(a, b, c, d) {

     positionsArray.push(triangleVertices[a]);
     colorsArray.push(triangleColor);
     positionsArray.push(triangleVertices[b]);
     colorsArray.push(triangleColor);
     positionsArray.push(triangleVertices[c]);
     colorsArray.push(triangleColor);
     positionsArray.push(triangleVertices[a]);
     colorsArray.push(triangleColor);
     positionsArray.push(triangleVertices[c]);
     colorsArray.push(triangleColor);
     positionsArray.push(triangleVertices[d]);
     colorsArray.push(triangleColor);
}

function colorBlocks() {
    //block 1
    quad1(1, 0, 3, 2);
    quad1(2, 3, 7, 6);
    quad1(3, 0, 4, 7);
    quad1(6, 5, 1, 2);
    quad1(4, 5, 6, 7);
    quad1(5, 4, 0, 1);

    //block 2
    quad1(9, 8, 11, 10);
    quad1(10, 11, 15, 14);
    quad1(11, 8, 12, 15);
    quad1(14, 13, 9, 10);
    quad1(12, 13, 14, 15);
    quad1(13, 12, 8, 9);

    //block 3
    quad1(17, 16, 19, 18);
    quad1(18, 19, 23, 22);
    quad1(19, 16, 20, 23);
    quad1(22, 21, 17, 18);
    quad1(20, 21, 22, 23);
    quad1(21, 20, 16, 17);
}

function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    gl.enable(gl.DEPTH_TEST);

// Create an empty texture

    texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


// generate cube and triangle data

    colorPlane();
    colorBlocks();

//  Load shaders and initialize attribute buffers

    program1 = initShaders(gl, "vertex-shader-1", "fragment-shader-1");
    program2 = initShaders(gl, "vertex-shader-2", "fragment-shader-2");


    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program1, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var shaderPositionLoc = gl.getAttribLocation(program2, "aPosition");
    gl.vertexAttribPointer(shaderPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderPositionLoc);

    var buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var shaderColorLoc = gl.getAttribLocation( program2, "aColor");
    gl.vertexAttribPointer(shaderColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderColorLoc);

    render();
}

function render() {

// First render the objects from the light's persepctive
// Render into texture so we can save the distances from camera

// Allocate a frame buffer object

    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = 1024;
    framebuffer.height = 1024;

    renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);

    // Attach color buffer

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    // check for completeness

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE) alert('Frame Buffer Not Complete');


    gl.useProgram(program1);

// light projection and modelview matrices

    var fovy = 45.0;
    var near = 3.0;
    var far = 10.0;
    var aspect = 1.0;

   lightProjectionMatrix = perspective(fovy, aspect, near, far);

    var lightPosition = vec3(-0.25, 0.5, 5.9);

    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    lightViewMatrix = lookAt(lightPosition, at, up);

    gl.uniformMatrix4fv(gl.getUniformLocation(program1,
            "uProjectionMatrix"), false, flatten(lightProjectionMatrix));

    gl.uniformMatrix4fv(gl.getUniformLocation(program1,
            "uModelViewMatrix"), false, flatten(lightViewMatrix));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// update cube rotation matrix (its instance transformation) then render cube

    cubeInstanceMatrix = mat4();
    cubeInstanceMatrix = mult(cubeInstanceMatrix, rotateX(0));
    cubeInstanceMatrix = mult(cubeInstanceMatrix, rotateY(0));
    cubeInstanceMatrix = mult(cubeInstanceMatrix, rotateZ(0));
    gl.uniformMatrix4fv( gl.getUniformLocation(program1,
            "uInstanceMatrix"), false, flatten(cubeInstanceMatrix) );

    gl.drawArrays(gl.TRIANGLES, 0, numPlaneVertices);

// don't rotate traingle and render it

    triangleInstanceMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation(program1,
            "uInstanceMatrix"), false, flatten(triangleInstanceMatrix));

    gl.drawArrays(gl.TRIANGLES, numPlaneVertices, numTriangleVertices);

// release buffers

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

//  second render from camera view pointsArray
// need matrices for both views so we can compare distances

    gl.useProgram(program2);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.uniform1i(gl.getUniformLocation(program2, "texture"), 0);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.viewport(0, 0, 1024, 1024);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(gl.getUniformLocation(program2,
            "uLightProjectionMatrix"), false, flatten(lightProjectionMatrix));

     gl.uniformMatrix4fv(gl.getUniformLocation(program2,
            "uLightViewMatrix"), false, flatten(lightViewMatrix));

// modelView and projection matrices for camera viewport

    projectionMatrix = ortho(-1, 1, -1, 1, -5, 5);

    gl.uniformMatrix4fv(gl.getUniformLocation(program2,
            "uProjectionMatrix"), false, flatten(projectionMatrix));

    cameraViewMatrix = mat4();

     var cameraLoc = vec3(0, 1, 1);
     var cameraAt = vec3(0, 0, 0);
     var cameraUp = vec3(0, 1, 0);

    cameraViewMatrix = lookAt(cameraLoc, cameraAt, cameraUp);

    gl.uniformMatrix4fv(gl.getUniformLocation(program2,
            "uModelViewMatrix"), false, flatten(cameraViewMatrix));

    gl.uniformMatrix4fv(gl.getUniformLocation(program2,
            "uInstanceMatrix"), false, flatten(cubeInstanceMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, numPlaneVertices);


    gl.uniformMatrix4fv(gl.getUniformLocation(program2,
            "uInstanceMatrix"), false, flatten(triangleInstanceMatrix));
    gl.drawArrays(gl.TRIANGLES, numPlaneVertices, numTriangleVertices);

    setInterval( requestAnimationFrame(render) , 500) ;

}
