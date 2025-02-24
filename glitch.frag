#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUV;

uniform sampler2D texture;
uniform float noise;

void main() {
  vec2 uv = vUV;
  uv.y = 1.0 - uv.y;
  
  vec2 offset = vec2( noise * 0.05, noise * 0.5);
  
  vec4 col;
  col.r = texture2D(texture, uv + offset).r;
  col.g = texture2D(texture, uv).g;
  col.b = texture2D(texture, uv - offset).b;
  col.a = texture2D(texture, uv).a;
  
  gl_FragColor = vec4(col);
}