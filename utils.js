function createSliders() {
  let sliderFont = "font-family: 'Arial', sans-serif; font-size: 14px;";

  // Sliders de parámetros
  feedSlider = createSlider(0.01, 0.1, feed, 0.001);
  feedSlider.position(10, height);
  feedText = createDiv("Feed: " + feedSlider.value().toFixed(3));
  feedText.position(150, height);
  feedText.style(sliderFont);

  killSlider = createSlider(0.01, 0.1, kill, 0.001);
  killSlider.position(10, height + 20);
  killText = createDiv("Kill: " + killSlider.value().toFixed(3));
  killText.position(150, height + 20);
  killText.style(sliderFont);

  diffASlider = createSlider(0.1, 1.5, diffRateA, 0.01);
  diffASlider.position(10, height + 40);
  diffAText = createDiv("Diff A: " + diffASlider.value().toFixed(2));
  diffAText.position(150, height + 40);
  diffAText.style(sliderFont);

  diffBSlider = createSlider(0.1, 1.0, diffRateB, 0.01);
  diffBSlider.position(10, height + 60);
  diffBText = createDiv("Diff B: " + diffBSlider.value().toFixed(2));
  diffBText.position(150, height + 60);
  diffBText.style(sliderFont);

  tilingSlider = createSlider(1.0, 10.0, tileFactor, 1.0);
  tilingSlider.position(10, height + 80);
  tilingText = createDiv("Tiling: " + tilingSlider.value().toFixed(1));
  tilingText.position(150, height + 80);
  tilingText.style(sliderFont);

  rSlider = createSlider(0, 1, lightColor[0], 0.1);
  rSlider.position(10, 10);
  rText = createDiv("Red Light: " + rSlider.value().toFixed(1));
  rText.position(150, 10);
  rText.style(sliderFont);

  gSlider = createSlider(0, 1, lightColor[1], 0.1);
  gSlider.position(10, 30);
  gText = createDiv("Green Light: " + gSlider.value().toFixed(1));
  gText.position(150, 30);
  gText.style(sliderFont);

  bSlider = createSlider(0, 1, lightColor[2], 0.1);
  bSlider.position(10, 50);
  bText = createDiv("Blue Light: " + bSlider.value().toFixed(1));
  bText.position(150, 50);
  bText.style(sliderFont);

  alphaText = createDiv("Alpha (Press +/-): " + alpha);
  alphaText.position(10, 70);
  alphaText.style(sliderFont);

  laplacianText = createDiv("Laplacian Index: " + currentLaplacianIndex);
  laplacianText.position(width / 2 + 150, height + 25);
  laplacianText.style(sliderFont);
}

function createStyledButtons() {
  // Botón reinicio de el modelo
  button = createButton("Reset");
  button.position(width / 2, height + 50);
  styleButton(button);
  button.mousePressed(reset);

  // Botón cambio de matriz laplaciana
  laplacianButton = createButton("Change Laplacian");
  laplacianButton.position(width / 2, height + 10);
  styleButton(laplacianButton);
  laplacianButton.mousePressed(() => {
    currentLaplacianIndex =
      (currentLaplacianIndex + 1) % laplacianMatrices.length;
    console.log("Matriz laplaciana cambiada:", currentLaplacianIndex);
    laplacian = laplacianMatrices[currentLaplacianIndex];
    laplacianText.html("Laplacian Index: " + currentLaplacianIndex);
  });
}

function updateSlidersText() {
  feedText.html("Feed: " + feed.toFixed(3));
  killText.html("Kill: " + kill.toFixed(3));
  diffAText.html("Diff A: " + diffRateA.toFixed(2));
  diffBText.html("Diff B: " + diffRateB.toFixed(2));
  tilingText.html("Tiling: " + tileFactor.toFixed(1));
  rText.html("Red Light: " + rSlider.value().toFixed(1));
  gText.html("Green Light: " + gSlider.value().toFixed(1));
  bText.html("Blue Light: " + bSlider.value().toFixed(1));
  alphaText.html("Alpha (Press +/-): " + alpha);
  laplacianText.html("Laplacian Index: " + currentLaplacianIndex);
}

function styleButton(btn) {
  btn.style("background-color", "#007BFF");
  btn.style("color", "white");
  btn.style("border", "none");
  btn.style("padding", "10px 15px");
  btn.style("font-size", "14px");
  btn.style("cursor", "pointer");
  btn.style("border-radius", "5px");
  btn.style("margin-top", "5px");
}
