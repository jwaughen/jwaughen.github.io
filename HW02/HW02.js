/*
  Jenna Waughen
  9/19/2022
  HW02
  Code acquired from gasket 5
*/
var canvas;
var gl;

//variables
var positions;
var numOfMountains = 0;
var bufferId;

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW);



    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

        document.getElementById("slider").onchange = function(event) {
        numOfMountains = parseInt(event.target.value);
        render();
    };

    render();
};

//functions to push one or two vectors onto the positions array
function mountain(x)
{
    positions.push(x);
}
function initialMountain(a,b)
{
    positions.push(a,b);
}

function divideLine(a, b, count)
{
    //variable holding the x and y coordinate of the point of the triangle
    var c =  vec2(0.00,0.00);

    // check for end of recursion
    if (count > 0) {
        //bisect the sides and calculate the top point of the triangle
        var ls = mix(a, b, 0.33);
        var rs = mix(a, b, 0.66);
        var len = rs[0]-ls[0];
        c[0] = (rs[0]+ls[0])/2; // x value of c
        c[1] = len * Math.sqrt(3)/2; // y value of c
        --count;

        // two new lines
        divideLine(a, ls, count);
        mountain(c); //pushing the point of the triangle on the positions array
        divideLine(rs, b, count);
    }
    else {
        initialMountain(a,b);
    }
}

function render()
{
    var vertices = [
        vec2(-1.00,0.00),
        vec2(1.00,0.00)
    ];
    positions = [];
    divideLine( vertices[0], vertices[1], numOfMountains);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(positions));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, positions.length );
    positions = [];
}
