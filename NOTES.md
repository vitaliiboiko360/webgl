  
#### GLSL Variables  
3 kinds of 'variables' in GLSL  
(GLSL OpenGL Shading Language)  
(extra link - https://www.khronos.org/opengl/wiki/Data_Type_(GLSL))  
__attributes__ - available to vertex shader (as variables) and JS code  
typically used to store :  
    color info  
    texture coordinates  
    any other data calculated or retrieved that needs to be shared beetween the JS code and the vertex shader  
__varyings__ - are variables declared by the vertex shader and used to pass data from vertex shader to fragment shader. commonly used to share a vertex's normal vector after is has been computed by the vertex shader.  
<< need to add: how to use >>  
__uniforms__ - set by JS code and are available to both the vertex and fragment shaders.  
used to provides values that will be the same for everything drawn in the frame, such as lighting, positions, and magnitudes, global transformation and perspective details, ...  

#### Buffers  

#### Textures  

