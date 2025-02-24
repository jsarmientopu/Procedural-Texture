let feedSlider,
  killSlider,
  diffASlider,
  diffBSlider,
  tilingSlider,
  colorPicker,
  rSlider,
  gSlider,
  bSlider;

let reactionDiffusion,
  varTexture,
  tempTexture,
  diffRateA,
  diffRateB,
  laplacianMatrices,
  currentLaplacianIndex,
  laplacian,
  laplacianButton,
  feed,
  kill,
  obj,
  phongShader,
  alpha = 8,
  lightColor = [1.0, 1.0, 1.0],
  tileFactor = 3.0;

laplacianMatrices = [
  [
    // Default
    0.05, 0.2, 0.05, 0.2, -1.0, 0.2, 0.05, 0.2, 0.05,
  ],
  [
    // Suave
    0.1, 0.2, 0.1, 0.2, -1.2, 0.2, 0.1, 0.2, 0.1,
  ],
  [
    // Difusión fuerte
    0.2, 0.4, 0.2, 0.4, -1.5, 0.4, 0.2, 0.4, 0.2,
  ],
  [
    // Alto contraste
    0.0, 1.0, 0.0, 1.0, -4.0, 1.0, 0.0, 1.0, 0.0,
  ],
];

currentLaplacianIndex = 0;

function preload() {
  // Parámetros
  feed = 0.055;
  kill = 0.062;
  diffRateA = 1.0;
  diffRateB = 0.5;
  laplacian = laplacianMatrices[currentLaplacianIndex];

  // Shaders
  reactionDiffusion = loadShader("shader.vert", "reactionDiffusion.frag");
  phongShader = loadShader("phongShader.vert", "phongShader.frag");

  // Modelo a dibujar
  obj = loadModel("bunny.obj", true);
}

function setup() {
  createCanvas(windowHeight / 1.3, windowHeight / 1.3, WEBGL);
  noStroke();

  // Textura que implementa el modelo de difusión de Turing
  varTexture = createFramebuffer({
    format: FLOAT,
    width: 100,
    height: 100,
    filter: NEAREST,
  });

  // Textura para guardar textura en el tiempo t-1
  tempTexture = createFramebuffer({
    format: FLOAT,
    width: 100,
    height: 100,
    filter: NEAREST,
  });

  createSliders();

  createStyledButtons();
}

// Reiniciar simulación
function reset() {
  frameCount = 1;
}

function draw() {
  clear();

  orbitControl();

  // Obtener parámetros
  feed = feedSlider.value();
  kill = killSlider.value();
  diffRateA = diffASlider.value();
  diffRateB = diffBSlider.value();
  tileFactor = tilingSlider.value();
  lightColor = [rSlider.value(), gSlider.value(), bSlider.value()];

  updateSlidersText();

  // Pasar shader a textura temporal
  shaderPass(varTexture, tempTexture, reactionDiffusion);

  // Cambiar textura usada por temporal
  let swap = varTexture;
  varTexture = tempTexture;
  tempTexture = swap;

  // Definir shader de modelo de difusión de Turing
  shader(reactionDiffusion);
  reactionDiffusion.setUniform("uTex", varTexture.color);
  reactionDiffusion.setUniform("uResolution", [width / 2, height]);
  reactionDiffusion.setUniform("uFeed", feed);
  reactionDiffusion.setUniform("uKill", kill);
  reactionDiffusion.setUniform("uDiffA", diffRateA);
  reactionDiffusion.setUniform("uDiffB", diffRateB);
  reactionDiffusion.setUniform("uLaplacian", laplacian);

  // Pintar el modelo
  push();
  translate(-width / 4, 0, 0);

  //Aplicar iluminación de Phong
  shader(phongShader);

  phongShader.setUniform("uLightDir", [
    map(mouseX, 0, width, -1, 1),
    map(mouseY, 0, height, -1, 1),
    1.0,
  ]);
  phongShader.setUniform("uAlpha", alpha);
  phongShader.setUniform("uCd", lightColor);
  phongShader.setUniform("sTex", varTexture.color);
  phongShader.setUniform("uTileFactor", tileFactor);
  scale(2, -2, -2);
  model(obj);
  pop();

  // Mostrar textura que implementa el modelo de difusión
  push();
  translate(-width / 4, 0, 0);
  rect(0, 0, 0, 0);
  pop();
}

function keyPressed() {
  if (key === "+") {
    alpha *= 2;
  } else if (key === "-") {
    alpha /= 2;
  }
}

// Intercambiar texturas
function shaderPass(inputTexture, outputTexture, effect) {
  outputTexture.begin();
  shader(effect);

  effect.setUniform("uTex", inputTexture.color);
  effect.setUniform("uResolution", [width / 2, height]);
  effect.setUniform("uTime", frameCount * 0.01);
  effect.setUniform("uFeed", feed);
  effect.setUniform("uKill", kill);
  effect.setUniform("uDiffA", diffRateA);
  effect.setUniform("uDiffB", diffRateB);
  effect.setUniform("uLaplacian", laplacian);

  drawFullscreenQuad();

  outputTexture.end();
}

function drawFullscreenQuad() {
  beginShape();
  vertex(-1, -1, 0, 0, 1);
  vertex(1, -1, 0, 1, 1);
  vertex(1, 1, 0, 1, 0);
  vertex(-1, 1, 0, 0, 0);
  endShape(CLOSE);
}
