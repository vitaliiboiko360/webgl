main();

var cubeRotation = 0.0;

function main() {

    const canvas = document.getElementById("glCanvas");

    // var win = window,
    // doc = document,
    // docElem = doc.documentElement,
    // body = doc.getElementsByTagName('body')[0],
    // width = win.innerWidth || docElem.clientWidth || body.clientWidth,
    // height = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    canvas.width = width;
    canvas.height = height;
    console.log(width + ", " + height);
    console.log(canvas.width + ', ' + canvas.height);

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
    
    setupMouseControl();
}

function setupMouseControl() {
    var isMouseDown = false;
    var isMouseUp = false;

    var mousePositionInfo = {
        x : 0,
        y : 0,
    };

    document.onmousedown = function(mouseEvent) {
        isMouseDown = true;
        mousePositionInfo.x = mouseEvent.clientX;
        mousePositionInfo.y = mouseEvent.clientY; 
        console.log('mousedown');
    };
    document.onmouseup = function(mouseEvent) {
        if (isMouseDown) {
            console.log('we started at x=', mousePositionInfo.x + ',y=' + mousePositionInfo.y);
            console.log('ended at x=', mouseEvent.clientX + ',y=' + mouseEvent.clientY);
            const deltaY = mousePositionInfo.y - mouseEvent.clientY;
            const path = Math.sqrt(Math.pow(Math.abs(mousePositionInfo.x - mouseEvent.clientX),2) + 
            Math.pow(Math.abs(deltaY),2));
            console.log('path=' + path);
            console.log('angle(slope)=' + (deltaY/path));
        }
        isMouseDown = false;
        console.log('mouseup');
    };
    document.onmousemove = function(mouseEvent) {
        if(isMouseDown) {
            //console.log("we're moving");
        }
    };

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
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);
    
    // colors:
    //
    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple    
    ];

    var colors = [];

    for (var j=0; j<faceColors.length; ++j)
    {
        const c = faceColors[j];
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
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
        cubeRotation * .7,
        [0, 1, 1]);
    
    {
        const numComponents = 3;
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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

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
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    cubeRotation += deltaTime;
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
  
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}