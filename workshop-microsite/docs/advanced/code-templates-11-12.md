---
sidebar_position: 1
sidebar_label: "Code Template"
---

# Conway's Game of Life: 11th-12th Grade Coding Templates

These code templates will help you build Conway's Game of Life during our workshop. Each file contains clear instructions and starter code so you can focus on implementing the core game logic. Follow the numbered steps in each file to complete your working simulation by the end of the session.

## gameLogic.js

```javascript
// gameLogic.js - Core Game of Life logic
// This file implements the cellular automaton rules

/*
 * Task: Implement the countNeighbors function
 * Count live neighbors for a cell at position (x,y)
 *
 * Parameters:
 * - grid: The 2D array representing the current state
 * - x, y: The coordinates of the cell to check
 *
 * Requirements:
 * 1. Count all 8 surrounding cells (horizontal, vertical, diagonal)
 * 2. Don't count the cell itself
 * 3. Handle grid edges by wrapping around (toroidal world)
 */
function countNeighbors(grid, x, y) {
  let sum = 0;

  // Loop through the neighboring cells (including diagonals)
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // Skip the cell itself
      if (i === 0 && j === 0) continue;

      // Calculate wrapped coordinates
      // YOUR CODE HERE - Calculate col and row with wrapping
      // Hint: Use modulo (%) to wrap around the edges

      // Add the state of this neighbor to sum
      // YOUR CODE HERE - Add the state of grid[col][row] to sum
    }
  }

  return sum;
}

/*
 * Task: Implement Conway's Game of Life rules
 *
 * Parameters:
 * - cellState: Current state of the cell (1 for alive, 0 for dead)
 * - neighbors: Number of live neighbors (0-8)
 *
 * Returns:
 * - The next state of the cell (1 for alive, 0 for dead)
 *
 * Rules to implement:
 * 1. Any live cell with fewer than two live neighbors dies (underpopulation)
 * 2. Any live cell with two or three live neighbors survives
 * 3. Any live cell with more than three neighbors dies (overpopulation)
 * 4. Any dead cell with exactly three neighbors becomes alive (reproduction)
 */
function applyRules(cellState, neighbors) {
  // YOUR CODE HERE
  // Implement the rules using if/else statements
  // Return the new state (0 or 1)
}

/*
 * Task: Implement the algorithm to compute the next generation
 *
 * This function should:
 * 1. Calculate the next state for each cell based on its neighbors
 * 2. Update the grid to the new generation
 *
 * Important: All cells must be evaluated based on the CURRENT generation
 * before any updates are made!
 */
function computeNextGeneration() {
  // Loop through each cell in the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Get current cell's state
      let state = grid[i][j];

      // YOUR CODE HERE
      // 1. Count neighbors for this cell
      // 2. Apply rules to determine new state
      // 3. Store the result in nextGrid[i][j]
    }
  }

  // Swap current and next grids
  [grid, nextGrid] = [nextGrid, grid];
}
```

## grid.js

```javascript
// grid.js - Grid management functionality
// This file contains functions for initialising and manipulating the grid

/*
 * Task: Implement the grid initialisation function
 *
 * This function should:
 * 1. Create two 2D arrays for the current grid and next grid
 * 2. Initialise all cells to dead (0)
 * 3. Reset the generation counter
 */
function initializeGrid() {
  // Create empty 2D arrays
  grid = new Array(cols);
  nextGrid = new Array(cols);

  // YOUR CODE HERE
  // Initialise all grid cells to 0 (dead)
  // Use nested loops to set each grid[i][j] and nextGrid[i][j] to 0

  // Reset generation counter
  generation = 0;
}

/*
 * Task: Implement a function to fill the grid with random live/dead cells
 */
function randomizeGrid() {
  // YOUR CODE HERE
  // Fill grid with random live/dead cells (25% chance of being alive)
  // Reset generation counter
}

/*
 * Task: Implement a function to clear the grid
 */
function clearGrid() {
  // YOUR CODE HERE
  // Set all cells in the grid to dead (0)
  // Reset generation counter
}
```

## display.js

```javascript
// display.js - Visualisation functionality
// Contains functions for drawing the grid and displaying status

/*
 * Task: Implement the function to draw the current grid
 */
function drawGrid() {
  // YOUR CODE HERE
  // Loop through all cells in the grid
  // Draw each cell based on its state:
  // - Live cells: Black fill (0) with gray stroke (200)
  // - Dead cells: White fill (255) with gray stroke (200)
}
```

## sketch.js

```javascript
// sketch.js - Main entry point for Conway's Game of Life
// This file contains the p5.js setup and draw functions

function setup() {
  // YOUR CODE HERE
  // 1. Find the container and set up control panels
  // 2. Create an 800x600 canvas
  // 3. Calculate grid dimensions based on resolution
  // 4. Initialise the grid
  // 5. Create UI elements
  // 6. Start with a random pattern
  // 7. Set initial frame rate
}

function draw() {
  // YOUR CODE HERE
  // 1. Set the background to white
  // 2. Display status information
  // 3. Draw the current grid
  // 4. If the simulation is running:
  //    - Update speed based on slider
  //    - Compute the next generation
  //    - Increment the generation counter
}

function mousePressed() {
  // YOUR CODE HERE
  // 1. Ignore clicks on UI elements (check if mouseY > 50)
  // 2. Toggle the cell state at the clicked position
}
```
