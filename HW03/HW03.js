/*
    Jenna Waughen
    Hw 03
    10/5/2022
    Code taken from Lab 07
*/
"use strict";

var gl; 
var verticesJ;
var verticesC;

var deltaT = 1.00;
var deltaTLoc;
var changeby;

var color;
var colorJ = vec4(0.0, 0.0, 1.0, 1.0);
var colorC = vec4(0.83, 0.69, 0.22, 1.0)
var colorLoc;

var delay = 100;
var toggle = true;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    var verticesJ = [
      vec2(-0.80,0.80),
      vec2(0.80,0.80),
      vec2(0.80,0.40),
      vec2(0.20,0.40),
      vec2(0.20,-0.80),
      vec2(-0.80,-0.80),
      vec2(-0.80,-0.20),
      vec2(-0.40,-0.20),
      vec2(-0.40,-0.40),
      vec2(-0.20,-0.40),
      vec2(-0.20,0.40),
      vec2(-0.80,0.40)
  ];

  var verticesC = [
      vec2(-0.80,0.80),
      vec2(0.80,0.80),
      vec2(0.80,0.40),
      vec2(0.40,0.40),
      vec2(0.40,0.60),
      vec2(-0.40,0.60),
      vec2(-0.40,-0.60),
      vec2(0.40,-0.60),
      vec2(0.40,-0.40),
      vec2(0.80,-0.40),
      vec2(0.80,-0.80),
      vec2(-0.80,-0.80)
  ];

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the J data into the GPU

    var bufferIdJ = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdJ );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesJ), gl.STATIC_DRAW );

    // Associate out shader J variable with our data buffer

    var positionLocJ = gl.getAttribLocation( program, "jPosition" );
    gl.vertexAttribPointer( positionLocJ , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLocJ );

    // Load the C data into the GPU

    var bufferIdC = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesC), gl.STATIC_DRAW );

    // Associate out shader C variable with our data buffer

    var positionLocC = gl.getAttribLocation( program, "cPosition" );
    gl.vertexAttribPointer( positionLocC , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLocC );

    deltaTLoc = gl.getUniformLocation( program, "t" );

    //define the uniform variable in the shader, aColor
    colorLoc = gl.getUniformLocation( program, "aColor" );

    document.getElementById("toggle").addEventListener("click", function(){
      toggle = !toggle;
    });

    render();
  }    

function morph() {
  if (deltaT >= 1.00) {
    changeby = -0.10;
  }
  else if (deltaT <= 0.00) {
    changeby = 0.10;
  }
  if (toggle) {
    deltaT += changeby;
  }
}

function render()
{
  gl.clear( gl.COLOR_BUFFER_BIT );
  morph();
  gl.uniform1f(deltaTLoc, deltaT);
  color = mix(colorC, colorJ, deltaT);
  gl.uniform4fv(colorLoc, color);
  gl.drawArrays( gl.LINE_LOOP, 0, 12 );

  setTimeout(
    function (){requestAnimationFrame(render);}, delay
);
}
