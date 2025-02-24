precision highp float;

uniform sampler2D sTex;
uniform vec3 uLightDir;
uniform vec3 uCd;
uniform float uAlpha;
uniform float uTileFactor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {



  vec3 ambient = vec3(0.2);
  
  vec3 cl = vec3(1.0);
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  
  vec3 diffuse = uCd * cl *
    max(0.0, dot(normal, lightDir));
  
  vec3 cs = vec3(0.8);
  vec3 eyeDir = normalize(-vPosition);
  vec3 reflected = reflect(-lightDir,
    normal);
  
  vec3 specular = cs * cl *
    pow( 
      max(0.0, dot(eyeDir, reflected)),
      uAlpha
    );
  
  vec2 tiledUV = vTexCoord * uTileFactor;

  vec4 texColor = texture2D(sTex, fract(tiledUV));

  float grayscale = step(0.5, texColor.r - texColor.g);
  
  vec3 color = 
    (ambient + diffuse + specular) * vec3(grayscale);
  gl_FragColor = vec4(color, 1.0);
}