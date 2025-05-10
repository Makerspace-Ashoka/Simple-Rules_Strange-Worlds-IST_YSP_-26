/**
 * 1D Cellular Automaton - Basic Template
 * For Grades 9-10
 *
 * This template provides a scaffolded structure for creating
 * a 1D cellular automaton. You'll complete the rule application
 * function and customize the visualization.
 */

// Variables to keep track of our automaton
let cells = []; // Current generation (current row)
let nextGen = []; // Next generation (next row)
let cellSize = 5; // Size of each cell in pixels
let rows = 0; // Number of rows completed so far
let rule = 30; // Rule to apply (0-255)
let paused = false; // Whether animation is paused

function setup() {
  // Create a canvas with appropriate size
  createCanvas(800, 600);

  // Calculate how many cells will fit in the canvas width
  let numCells = floor(width / cellSize);

  // Initialize arrays for current and next generation
  cells = new Array(numCells).fill(0);
  nextGen = new Array(numCells).fill(0);

  // Start with a single cell in the middle
  cells[floor(numCells / 2)] = 1;

  // Set up the background and draw the first generation
  background(0);
  drawCells();

  // Create UI elements
  createButton("Reset").mousePressed(reset);
  createButton("Pause/Play").mousePressed(() => (paused = !paused));

  createSpan("   Rule: ");
  let ruleInput = createInput(rule.toString());
  ruleInput.input(function () {
    rule = int(this.value());
    reset();
  });

  // Slow down the animation to make it easier to follow
  frameRate(10);
}

function draw() {
  // Only proceed if not paused and we haven't filled the canvas yet
  if (!paused && rows * cellSize < height) {
    // Calculate the next generation
    calculateNextGen();

    // Draw the new cells
    drawCells();

    // Update the row counter
    rows++;
  }
}

/**
 * This function draws the current generation of cells
 */
function drawCells() {
  // Set color to white (you can change this for customization!)
  fill(255);
  noStroke();

  // Draw each cell in the current generation
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === 1) {
      // If the cell is "alive" (1), draw it as a rectangle
      rect(i * cellSize, rows * cellSize, cellSize, cellSize);
    }
  }
}

/**
 * This function calculates the next generation based on the current one
 */
function calculateNextGen() {
  // For each cell in the current generation
  for (let i = 0; i < cells.length; i++) {
    // Get the cell's left and right neighbors (wrap around edges)
    let left = cells[(i - 1 + cells.length) % cells.length];
    let center = cells[i];
    let right = cells[(i + 1) % cells.length];

    // Apply the rule to determine the next state
    nextGen[i] = applyRule(left, center, right, rule);
  }

  // Copy the new generation to the current one
  cells = nextGen.slice();
}

/**
 * TODO: COMPLETE THIS FUNCTION
 * This function applies the rule to determine the next state of a cell
 *
 * @param {number} left - State of the left neighbor (0 or 1)
 * @param {number} center - State of the current cell (0 or 1)
 * @param {number} right - State of the right neighbor (0 or 1)
 * @param {number} ruleNumber - The rule to apply (0-255)
 * @return {number} The new state of the cell (0 or 1)
 */
function applyRule(left, center, right, ruleNumber) {
  // STEP 1: Convert the three neighboring cells into a binary number (0-7)
  // For example: left=1, center=1, right=0 would be binary 110, which is decimal 6

  // HINT: Use binary operations to combine the three values
  // left shifted 2 positions, center shifted 1 position, right as is
  let idx = 0; // Replace with your code

  // STEP 2: Check if the bit at position idx in ruleNumber is 1 or 0
  // HINT: Shift right by idx positions and check the last bit
  let result = 0; // Replace with your code

  return result;
}

/**
 * This function resets the automaton to its initial state
 */
function reset() {
  // Reset the row counter
  rows = 0;

  // Re-initialize the cells array
  cells = new Array(floor(width / cellSize)).fill(0);

  // Set the middle cell to alive
  cells[floor(cells.length / 2)] = 1;

  // Clear the canvas
  background(0);

  // Draw the first generation
  drawCells();
}

// CHALLENGES TO TRY:
// 1. Change the colors based on row number
// 2. Try different starting patterns
// 3. Add a slider for rule selection
// 4. Add a control for cell size
