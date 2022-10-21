/*
    Jenna Waughen
    Hw 04
    10/21/2022
    Code taken from cube.js
*/

"use strict";

var canvas;
var gl;

var numPositions  = 144;

var positionsJ = [];
var colors = [];
var positionsC = [];
var sideColor = 1;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 1;
var theta = [0, 330, 0];
var thetaLoc;

var toggle = false;
var deltaT = 1.00;
var deltaTLoc;
var changeby;

var rotation = false;

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var jBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, jBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsJ), gl.STATIC_DRAW);


    var positionLocJ = gl.getAttribLocation(program, "jPosition");
    gl.vertexAttribPointer(positionLocJ, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocJ);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsC), gl.STATIC_DRAW);

    var positionLocC = gl.getAttribLocation(program, "cPosition");
    gl.vertexAttribPointer(positionLocC, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocC);

    deltaTLoc = gl.getUniformLocation( program, "t" );

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){rotation = !rotation;
    };
    document.getElementById("toggle").onclick = function(){toggle = !toggle;
    };

    render();
}

function colorCube()
{
    //block 1
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);

    //block 2
    quad(9, 8, 11, 10);
    quad(10, 11, 15, 14);
    quad(11, 8, 12, 15);
    quad(14, 13, 9, 10);
    quad(12, 13, 14, 15);
    quad(13, 12, 8, 9);

    //block 3
    quad(17, 16, 19, 18);
    quad(18, 19, 23, 22);
    quad(19, 16, 20, 23);
    quad(22, 21, 17, 18);
    quad(20, 21, 22, 23);
    quad(21, 20, 16, 17);

    //block 4
    quad(25, 24, 27, 26);
    quad(26, 27, 31, 30);
    quad(27, 24, 28, 31);
    quad(30, 29, 25, 26);
    quad(28, 29, 30, 31);
    quad(29, 28, 24, 25);    
}

function quad(a, b, c, d)
{
    var verticesJ = [
        //block 1
        vec4(-0.50, 0.40, 0.60, 1.00), 
        vec4(-0.50, 0.60, 0.60, 1.00),
        vec4(0.50, 0.60, 0.60, 1.00),
        vec4(0.50, 0.40, 0.60, 1.00),
        vec4(-0.50, 0.40, -0.60, 1.00), 
        vec4(-0.50, 0.60, -0.60, 1.00),
        vec4(0.50, 0.60, -0.60, 1.00),
        vec4(0.50, 0.40, -0.60, 1.00),

        //block 2
        vec4(-0.10, -0.40, 0.60, 1.00),
        vec4(-0.10, 0.40, 0.60, 1.00),
        vec4(0.10, 0.40, 0.60, 1.00),
        vec4(0.10, -0.40, 0.60, 1.00),
        vec4(-0.10, -0.40, -0.60, 1.00),
        vec4(-0.10, 0.40, -0.60, 1.00),
        vec4(0.10, 0.40, -0.60, 1.00),
        vec4(0.10, -0.40, -0.60, 1.00),

        //block 3
        vec4(-0.60, -0.60, 0.60, 1.00),
        vec4(-0.60, -0.40, 0.60, 1.00),
        vec4(0.10, -0.40, 0.60, 1.00),
        vec4(0.10, -0.60, 0.60, 1.00),
        vec4(-0.60, -0.60, -0.60, 1.00),
        vec4(-0.60, -0.40, -0.60, 1.00),
        vec4(0.10, -0.40, -0.60, 1.00),
        vec4(0.10, -0.60, -0.60, 1.00),

        //block 4
        vec4(-0.60, -0.40, 0.60, 1.00),
        vec4(-0.60, -0.30, 0.60, 1.00),
        vec4(-0.40, -0.30, 0.60, 1.00),
        vec4(-0.40, -0.40, 0.60, 1.00),
        vec4(-0.60, -0.40, -0.60, 1.00),
        vec4(-0.60, -0.30, -0.60, 1.00),
        vec4(-0.40, -0.30, -0.60, 1.00),
        vec4(-0.40, -0.40, -0.60, 1.00)
    ];

    var verticesC = [
        //block 1
        vec4(-0.60, 0.40, 0.60, 1.00), 
        vec4(-0.60, 0.60, 0.60, 1.00),
        vec4(0.60, 0.60, 0.60, 1.00),
        vec4(0.60, 0.40, 0.60, 1.00),
        vec4(-0.60, 0.40, -0.60, 1.00), 
        vec4(-0.60, 0.60, -0.60, 1.00),
        vec4(0.60, 0.60, -0.60, 1.00),
        vec4(0.60, 0.40, -0.60, 1.00),

        //block 2
        vec4(-0.10, -0.40, 0.60, 1.00),
        vec4(-0.10, -0.41, 0.60, 1.00),
        vec4(0.10, -0.40, 0.60, 1.00),
        vec4(0.10, -0.41, 0.60, 1.00),
        vec4(-0.10, -0.40, -0.60, 1.00),
        vec4(-0.10, -0.41, -0.60, 1.00),
        vec4(0.10, -0.40, -0.60, 1.00),
        vec4(0.10, -0.41, -0.60, 1.00),

        //block 3
        vec4(-0.60, -0.60, 0.60, 1.00),
        vec4(-0.60, -0.40, 0.60, 1.00),
        vec4(0.60, -0.40, 0.60, 1.00),
        vec4(0.60, -0.60, 0.60, 1.00),
        vec4(-0.60, -0.60, -0.60, 1.00),
        vec4(-0.60, -0.40, -0.60, 1.00),
        vec4(0.60, -0.40, -0.60, 1.00),
        vec4(0.60, -0.60, -0.60, 1.00),

        //block 4
        vec4(-0.60, -0.40, 0.60, 1.00),
        vec4(-0.60, 0.40, 0.60, 1.00),
        vec4(-0.40, 0.40, 0.60, 1.00),
        vec4(-0.40, -0.40, 0.60, 1.00),
        vec4(-0.60, -0.40, -0.60, 1.00),
        vec4(-0.60, 0.40, -0.60, 1.00),
        vec4(-0.40, 0.40, -0.60, 1.00),
        vec4(-0.40, -0.40, -0.60, 1.00)
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(0.83, 0.69, 0.22, 1.0),  // gold
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 1.0, 1.0)   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices


    var indices = [a, b, c, a, c, d];

    for ( var i = 0; i < indices.length; ++i ) {
        positionsJ.push( verticesJ[indices[i]] );
        positionsC.push( verticesC[indices[i]] );
        colors.push(vertexColors[sideColor]);
    }
    sideColor++;
    if (sideColor == 7) {
      sideColor = 1;
    }
}

function morph() {
    if (deltaT >= 1.00) {
      changeby = -0.01;
    }
    else if (deltaT <= 0.00) {
      changeby = 0.01;
    }
    if (toggle) {
      deltaT += changeby;
    }
  }

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    morph();
    if (rotation) theta[axis] += 2.0;
    gl.uniform1f(deltaTLoc, deltaT);
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}