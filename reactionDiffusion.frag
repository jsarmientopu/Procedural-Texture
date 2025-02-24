precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTex;
uniform vec2 uResolution;
uniform float uTime;

// Reaction-Diffusion Parameters
uniform float uFeed;
uniform float uKill;
uniform float uDiffA;
uniform float uDiffB;
uniform float uLaplacian[9];

vec2 laplacian(vec2 uv) {
    vec2 lap = vec2(0.0);
    
    vec2 texel = (1.0 / uResolution); // Texture pixel size
  
    lap += texture2D(uTex, uv + vec2(-texel.x, -texel.y)).rg * uLaplacian[0];
    lap += texture2D(uTex, uv + vec2(0.0, -texel.y)).rg * uLaplacian[1];
    lap += texture2D(uTex, uv + vec2(texel.x, -texel.y)).rg * uLaplacian[2];

    lap += texture2D(uTex, uv + vec2(-texel.x, 0.0)).rg * uLaplacian[3];
    lap += texture2D(uTex, uv).rg * uLaplacian[4]; // Center pixel
    lap += texture2D(uTex, uv + vec2(texel.x, 0.0)).rg * uLaplacian[5];

    lap += texture2D(uTex, uv + vec2(-texel.x, texel.y)).rg * uLaplacian[6];
    lap += texture2D(uTex, uv + vec2(0.0, texel.y)).rg * uLaplacian[7];
    lap += texture2D(uTex, uv + vec2(texel.x, texel.y)).rg * uLaplacian[8];

    return lap;
}

void main() {
	vec2 uv = vTexCoord;
  
    if(uTime == 0.1){
      vec2 center = vec2(0.5, 0.5);
      if(distance(uv, center)<0.2){
          gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      }else{
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    }else{
  
	  vec4 texColor = texture2D(uTex, uv);

      vec2 lap = laplacian(uv);
    
      float A = texColor.r;
      float B = texColor.g;

      float dA_dt = uDiffA * lap.r - (A * B * B) + uFeed * (1.0 - A);
      float dB_dt = uDiffB * lap.g + (A * B * B) - (uKill + uFeed) * B;

      A += dA_dt;
      B += dB_dt;
      
      
	  gl_FragColor = vec4(A, B, 0.0, 1.0);
    }
}