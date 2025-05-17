// sketch.js - Main entry point for Conway's Game of Life
// This file contains the p5.js setup and draw functions that control the game's main loop

function setup() {
  // Create canvas and container
  let container = select('.container');

  // Create control panel if not exists
  if (!select('.control-panel')) {
    let controlPanel = createDiv('');
    controlPanel.class('control-panel');
    controlPanel.parent(container);
  }

  // Create pattern panel if not exists
  if (!select('.pattern-panel')) {
    let patternPanel = createDiv('');
    patternPanel.class('pattern-panel');
    patternPanel.parent(container);
  }

  // Create canvas with proper sizing
  let canvas = createCanvas(800, 600);
  canvas.parent(container);

  // Create canvas based on window size
  createCanvas(800, 600);

  // Calculate grid dimensions based on canvas size and resolution
  // floor() ensures we get whole numbers of cells
  cols = floor(width / resolution);
  rows = floor(height / resolution);

  // Initialize the grid (function from grid.js)
  initializeGrid();

  // Create UI elements (function from ui.js)
  createButtons();

  // Create pattern buttons (function from patterns.js)
  createPatternButtons();

  // Start with a random pattern
  randomizeGrid();

  // Set initial frame rate
  frameRate(10);
}

function draw() {
  background(255); // White background

  // Display status information (function from display.js)
  displayStatus();

  // Draw the current grid (function from display.js)
  drawGrid();

  // If simulation is running, calculate next generation
  if (isRunning) {
    // Adjust speed based on slider
    let simulationSpeed = speedSlider.value();
    frameRate(simulationSpeed);

    // Calculate next generation (function from gameLogic.js)
    computeNextGeneration();
    generation++;
  }
}

function mousePressed() {
  // Ignore clicks on UI elements at the top
  if (mouseY > 50) {
    // Toggle cell state (function from grid.js)
    toggleCell(mouseX, mouseY);
  }
}

