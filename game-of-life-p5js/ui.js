// ui.js - User interface elements
// Contains functions for creating and managing UI controls

// Create all UI elements (buttons, sliders, etc.)
function createButtons() {
  // Create container for UI elements
  let uiContainer = select('.control-panel');

  // Play/Pause button
  let playButton = createButton('Play/Pause');
  playButton.parent(uiContainer);
  playButton.class('play-pause');
  playButton.mousePressed(toggleSimulation);

  // Step button
  let stepButton = createButton('Step');
  stepButton.parent(uiContainer);
  stepButton.class('step');
  stepButton.mousePressed(stepSimulation);

  // Clear button
  let clearButton = createButton('Clear');
  clearButton.parent(uiContainer);
  clearButton.class('clear');
  clearButton.mousePressed(clearGrid);

  // Random button
  let randomButton = createButton('Random');
  randomButton.parent(uiContainer);
  randomButton.class('random');
  randomButton.mousePressed(randomizeGrid);

  // Speed slider
  let speedControl = createDiv('');
  speedControl.class('speed-control');
  speedControl.parent(uiContainer);

  let speedLabel = createSpan('Speed:');
  speedLabel.class('speed-label');
  speedLabel.parent(speedControl);

  speedSlider = createSlider(1, 30, 10);
  speedSlider.parent(speedControl);
}

// Toggle between running and paused states
function toggleSimulation() {
  isRunning = !isRunning; // Flip the state
}

// Advance one generation
function stepSimulation() {
  // Calculate one generation without toggling isRunning
  // This is useful for stepping through the simulation manually
  computeNextGeneration();
  generation++;
}

