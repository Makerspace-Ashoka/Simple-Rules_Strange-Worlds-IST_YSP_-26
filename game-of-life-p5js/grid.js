// grid.js - Grid management functionality
// Contains functions for initializing and manipulating the grid

// Initialize an empty grid with all cells dead
function initializeGrid() {
  // Create empty 2D arrays for current and next grid states
  // We need two grids: one for the current state and one for calculating the next state
  grid = new Array(cols);
  nextGrid = new Array(cols);

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    nextGrid[i] = new Array(rows);

    // Initialize all cells as dead (0)
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }

  // Reset generation counter
  generation = 0;
}

// Fill grid with random live/dead cells
function randomizeGrid() {
  // Fill grid with random live/dead cells
  // This gives students a starting point to observe patterns
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // 25% chance of a cell being alive
      // Using a lower percentage creates more interesting initial states
      grid[i][j] = random() < 0.25 ? 1 : 0;
    }
  }

  // Reset generation counter
  generation = 0;
}

// Set all cells to dead state
function clearGrid() {
  // Set all cells to dead state (0)
  // This allows students to start from scratch
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }

  // Reset generation counter
  generation = 0;
}

// Toggle the state of a cell at the given coordinates
function toggleCell(x, y) {
  // Convert mouse coordinates to grid coordinates
  // Since each cell is 'resolution' pixels wide/high, we divide and floor
  let i = floor(x / resolution);
  let j = floor(y / resolution);

  // Toggle cell state if within grid bounds
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    // If cell is dead (0), make it alive (1), and vice versa
    grid[i][j] = grid[i][j] === 0 ? 1 : 0;
  }
}

