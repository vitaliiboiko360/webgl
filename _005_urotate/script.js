main();

var squareRotation = 0.0;
var counter = 0;
function main() {
    animateSquare();

    const canvas = document.getElementById("glCanvas");
    // canvas.onclick = function(){
    //     console.log("clicked " + counter++);
    // };
    // canvas.ondrag = function(){
    //     console.log("draged");
    // };

    let moved;
    let pressed;
    let pointMouseInfo = {
        x : 0,
        y : 0,
        xd : 0,
        yd : 0
    };
    let downListener = (mouseEvent) => {
        moved = false;
        pointMouseInfo.x = mouseEvent.clientX;
        pointMouseInfo.y = mouseEvent.clientY;
        pressed = true;
    };
    window.addEventListener('mousedown', downListener)

    let moveListener = (mouseEvent) => { 
        moved = true;
        
        if (pressed)
        {
            squareRotation = pointMouseInfo.x - mouseEvent.clientX;
        }
    };
    window.addEventListener('mousemove', moveListener)

    let upListener = (mouseEvent) => {
        if (moved) {
            console.log('moved');
            console.log("x was moved by " + (pointMouseInfo.x - mouseEvent.clientX));
            console.log("y was moved by " + (pointMouseInfo.y - mouseEvent.clientY));
           
        } else {
            console.log('not moved');
        };
        pointMouseInfo.x = 0;
        pointMouseInfo.y = 0;
        pressed = false;
    };
    window.addEventListener('mouseup', upListener);

    // // release memory
    // canvas.removeEventListener('mousedown', downListener);
    // canvas.removeEventListener('mousemove', moveListener);
    // canvas.removeEventListener('mouseup', upListener);
}

// init animation
function animateSquare()
{
    const canvas = document.getElementById("glCanvas");

    const gl = canvas.getContext("webgl");

    if(gl === null) {
        alert("unable to init webgl");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
    `;
    
    const fsSource = `
    varying lowp vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);

    var then = 0;
    // draw the scene repeatedly
    function render(now) {
        now *= 0.0005;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function initBuffers(gl) {
    // positions:
    //
    // create a buffer for figure's positions
    const positionBuffer = gl.createBuffer();
    // select positionBuffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // now create an array of possitions for the square
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);
    
    // colors:
    //
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colors = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
    };
}

function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // clear
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    
    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0]);

    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        squareRotation,
        [0, 0, 1]);
    
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

    squareRotation += deltaTime;
}

// init a shader program for webgl to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('unable to init the shader program' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // send source to shader object
    gl.shaderSource(shader, source);

    // compile the shader program
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('an error occured compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
