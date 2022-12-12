"use strict";

var canvas;
var gl;

var numPositions  = 42;
var program;
var positions = [];
var colors = [];

var vBuffer, cBuffer;
var framebuffer, renderbuffer;
var texture1;
var buffer1, buffer2, buffer3;

var projectionMatrix;
var lightProjectionMatrix;
var lightViewMatrix;

var backgroundVertices = [
    vec4(-0.9, -0.9,  0.0, 1.0),
    vec4(-0.9,  0.9,  0.0, 1.0),
    vec4(0.9,  0.9,  0.0, 1.0),
    vec4(0.9, -0.9,  0.0, 1.0)
];

var cubeVertices = [
    //box 1
    vec4(-0.4,0.-0.4,0.2,1.0),
    vec4(-0.4,-0.4,0.8,1.0),
    vec4(-0.2,-0.4,0.8,1.0),
    vec4(-0.2,-0.4,0.2,1.0),
    vec4(-0.4,0.-0.2,0.2,1.0),
    vec4(-0.4,-0.2,0.8,1.0),
    vec4(-0.2,-0.2,0.8,1.0),
    vec4(-0.2,-0.2,0.2,1.0)

];

var backgroundColor = [
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0,0.0,0.0,1.0)   // red
];

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    colorPlane();
    colorBoxes();

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    render();
}

function colorPlane()
{
    quad(1, 0, 3, 2); 
}

function quad(a, b, c, d)
{
    positions.push(backgroundVertices[a]);
    colors.push(backgroundColor[0]);
    positions.push(backgroundVertices[b]);
    colors.push(backgroundColor[0]);
    positions.push(backgroundVertices[c]);
    colors.push(backgroundColor[0]);
    positions.push(backgroundVertices[a]);
    colors.push(backgroundColor[0]);
    positions.push(backgroundVertices[c]);
    colors.push(backgroundColor[0]);
    positions.push(backgroundVertices[d]);
    colors.push(backgroundColor[0]);
}

function colorBoxes() {
    quad1(1, 0, 3, 2);
    quad1(2, 3, 7, 6);
    quad1(3, 0, 4, 7);
    quad1(6, 5, 1, 2);
    quad1(4, 5, 6, 7);
    quad1(5, 4, 0, 1);
}

function quad1(a, b, c, d) {
    positions.push(cubeVertices[a]);
    colors.push(backgroundColor[1]);
    positions.push(cubeVertices[b]);
    colors.push(backgroundColor[1]);
    positions.push(cubeVertices[c]);
    colors.push(backgroundColor[1]);
    positions.push(cubeVertices[a]);
    colors.push(backgroundColor[1]);
    positions.push(cubeVertices[c]);
    colors.push(backgroundColor[1]);
    positions.push(cubeVertices[d]);
    colors.push(backgroundColor[1]);
}

function render()
{
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

    gl.useProgram(program);

    var fovy = 45.0;
    var near = 3.0;
    var far = 10.0;
    var aspect = 1.0;

   lightProjectionMatrix = perspective(fovy, aspect, near, far);

    var lightPosition = vec3(0.0, 0.0, 3.2);

    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    lightViewMatrix = lookAt(lightPosition, at, up);

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "uProjectionMatrix"), false, flatten(lightProjectionMatrix));

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "uModelViewMatrix"), false, flatten(lightViewMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    var triangleInstanceMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
                    "uInstanceMatrix"), false, flatten(triangleInstanceMatrix));
        
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    setInterval( requestAnimationFrame(render) , 500) ;
}
