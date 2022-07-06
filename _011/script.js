
function main() {
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

if(gl === null) {
    alert("unable to init webgl");
    return;
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const vertexShaderSource = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0, 1);
}`;
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
const fragmentShaderSource = `
void main() {
    gl_FragColor = vec4(0,1,0,1);  // green
}`;
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram);

console.log(gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));

var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");

var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0]),
    gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6);

    };

main();