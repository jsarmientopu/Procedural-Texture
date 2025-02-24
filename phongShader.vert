precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {
  
  vTexCoord = aTexCoord;
  vNormal = uNormalMatrix * aNormal;
  
  vec4 modelView = uModelViewMatrix *
    vec4(aPosition, 1.0);
  
  vPosition = modelView.xyz;
  
  gl_Position = uProjectionMatrix *
    modelView;
    
}