// gameLogic.js - Core Game of Life logic
// Contains the functions that implement the cellular automaton rules

// Count live neighbors for a cell at position (x,y)
function countNeighbors(grid, x, y) {
  // Count the number of live neighbors around cell (x,y)
  let sum = 0;

  // Check all 8 surrounding cells
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // Skip the cell itself
      if (i === 0 && j === 0) continue;

      // Calculate neighbor coordinates with wrapping (toroidal world)
      // This creates a "wraparound effect" - cells at edges connect to opposite edge
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

      // Add the state of this neighbor to sum
      // Since we're using 1 for alive and 0 for dead, we can just add the values
      sum += grid[col][row];
    }
  }

  return sum;
}

// Apply Conway's Game of Life rules to determine next state
function applyRules(cellState, neighbors) {
  // Apply Conway's Game of Life rules:
  // 1. Any live cell with fewer than two live neighbors dies (underpopulation)
  // 2. Any live cell with two or three live neighbors survives
  // 3. Any live cell with more than three neighbors dies (overpopulation)
  // 4. Any dead cell with exactly three neighbors becomes alive (reproduction)

  if (cellState === 1) {
    // Cell is currently alive

    // Rule 1: Any live cell with fewer than two live neighbors dies (underpopulation)
    if (neighbors < 2) {
      return 0; // Cell dies
    }
    // Rule 2: Any live cell with two or three live neighbors survives
    else if (neighbors === 2 || neighbors === 3) {
      return 1; // Cell survives
    }
    // Rule 3: Any live cell with more than three neighbors dies (overpopulation)
    else {
      return 0; // Cell dies
    }
  } else {
    // Cell is currently dead

    // Rule 4: Any dead cell with exactly three neighbors becomes alive (reproduction)
    if (neighbors === 3) {
      return 1; // Cell becomes alive
    } else {
      return 0; // Cell stays dead
    }
  }
}

// Compute the next generation based on the current grid
function computeNextGeneration() {
  // Calculate the next state for each cell based on current state
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Get current cell state
      let state = grid[i][j];

      // Count live neighbors
      let neighbors = countNeighbors(grid, i, j);

      // Apply Conway's Game of Life rules
      nextGrid[i][j] = applyRules(state, neighbors);
    }
  }

  // Swap current and next grids
  // This is more efficient than copying every value
  [grid, nextGrid] = [nextGrid, grid];
}

