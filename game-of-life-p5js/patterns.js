// patterns.js - Predefined patterns
// Contains functions and data for common Game of Life patterns

// Pattern definitions
// These are classic patterns from Conway's Game of Life
// Each pattern is a 2D array where 1 represents a live cell

// Glider - a pattern that moves diagonally across the grid
const gliderPattern = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
];

// Blinker - a pattern that oscillates between horizontal and vertical line
const blinkerPattern = [[1, 1, 1]];

// Block - a 2x2 square that remains static
const blockPattern = [
  [1, 1],
  [1, 1],
];

// Toad - a pattern that oscillates between two states
const toadPattern = [
  [0, 1, 1, 1],
  [1, 1, 1, 0],
];

// Pulsar - a more complex oscillator with period 3
const pulsarPattern = [
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
];

// Add a pattern to the grid at the specified position
function placePattern(pattern, startX, startY) {
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      // Calculate position with wraparound if necessary
      let x = (startX + j + cols) % cols;
      let y = (startY + i + rows) % rows;
      grid[x][y] = pattern[i][j];
    }
  }
}

// Add pattern buttons to the UI
function createPatternButtons() {
  let patternDiv = select(".pattern-panel");

  let patternLabel = createSpan("Patterns:");
  patternLabel.class("pattern-label");
  patternLabel.parent(patternDiv);

  // Glider
  let gliderButton = createButton("Glider");
  gliderButton.parent(patternDiv);
  gliderButton.class("pattern");
  gliderButton.mousePressed(function() {
    placePattern(gliderPattern, floor(cols / 2), floor(rows / 2));
  });

  // Blinker
  let blinkerButton = createButton("Blinker");
  blinkerButton.parent(patternDiv);
  blinkerButton.class("pattern");
  blinkerButton.mousePressed(function() {
    placePattern(blinkerPattern, floor(cols / 2), floor(rows / 2));
  });

  // Block
  let blockButton = createButton("Block");
  blockButton.parent(patternDiv);
  blockButton.class("pattern");
  blockButton.mousePressed(function() {
    placePattern(blockPattern, floor(cols / 2), floor(rows / 2));
  });

  // Toad
  let toadButton = createButton("Toad");
  toadButton.parent(patternDiv);
  toadButton.class("pattern");
  toadButton.mousePressed(function() {
    placePattern(toadPattern, floor(cols / 2), floor(rows / 2));
  });

  // Pulsar
  let pulsarButton = createButton("Pulsar");
  pulsarButton.parent(patternDiv);
  pulsarButton.class("pattern");
  pulsarButton.mousePressed(function() {
    placePattern(pulsarPattern, floor(cols / 2) - 6, floor(rows / 2) - 6);
  });
}

