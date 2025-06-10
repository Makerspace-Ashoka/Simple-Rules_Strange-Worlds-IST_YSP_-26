---
sidebar_position: 1
sidebar_label: "Code Template"
---

# Conway's Game of Life: 9th-10th Grade Coding Templates

These code templates will help you build Conway's Game of Life during our workshop. Each file contains clear instructions and starter code so you can focus on implementing the core game logic. Follow the numbered steps in each file to complete your working simulation by the end of the session.

## gameLogic.js

```javascript
// gameLogic.js - Core Game of Life logic
// This file contains the functions that implement the cellular automaton rules

// Count live neighbors for a cell at position (x,y)
function countNeighbors(grid, x, y) {
  // Create a variable to store the count of live neighbors
  let sum = 0;

  // STEP 1: Check all 8 surrounding cells
  // Loop through the relative positions (-1, 0, 1) for both x and y axes
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // STEP 2: Skip the cell itself (when i=0 and j=0)
      if (i === 0 && j === 0) {
        continue; // Skip the cell itself
      }

      // STEP 3: Calculate neighbor coordinates with wrapping (toroidal world)
      // *** YOUR CODE HERE ***
      // Calculate col using wrap-around: (x + i + cols) % cols
      // Calculate row using wrap-around: (y + j + rows) % rows


      // STEP 4: Add this neighbor's state to our sum
      // *** YOUR CODE HERE ***
      // Add the state of the cell at grid[col][row] to our sum variable


    }
  }

  // Return the final count
  return sum;
}

// Apply Conway's Game of Life rules to determine next state
function applyRules(cellState, neighbors) {
  // STEP 1: Handle currently ALIVE cells (cellState === 1)
  if (cellState === 1) {
    // *** YOUR CODE HERE ***
    // If neighbors < 2, return 0 (dies from underpopulation)
    // If neighbors is 2 or 3, return 1 (survives)
    // Otherwise (neighbors > 3), return 0 (dies from overpopulation)


  }
  // STEP 2: Handle currently DEAD cells (cellState === 0)
  else {
    // *** YOUR CODE HERE ***
    // If neighbors is exactly 3, return 1 (becomes alive)
    // Otherwise, return 0 (stays dead)


  }
}

// Compute the next generation based on the current grid
function computeNextGeneration() {
  // STEP 1: Loop through every cell in the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // STEP 2: Get the current cell's state
      let state = grid[i][j];

      // STEP 3: Count this cell's neighbors
      // *** YOUR CODE HERE ***
      // Call countNeighbors to get the number of neighbors for this cell


      // STEP 4: Apply the rules to determine the next state
      // *** YOUR CODE HERE ***
      // Call applyRules with the current state and neighbor count
      // Store the result in nextGrid[i][j]


    }
  }

  // STEP 5: Swap current and next grids
  [grid, nextGrid] = [nextGrid, grid];
}
```

## grid.js

```javascript
// grid.js - Grid management functionality
// This file contains functions for initialising and manipulating the grid

// Initialise an empty grid with all cells dead
function initializeGrid() {
  // STEP 1: Create arrays for the grid dimensions
  grid = new Array(cols);
  nextGrid = new Array(cols);

  // STEP 2: Initialise each column with rows
  for (let i = 0; i < cols; i++) {
    // *** YOUR CODE HERE ***
    // Create new arrays for grid[i] and nextGrid[i] with length 'rows'


    // STEP 3: Set all cells to dead (0)
    for (let j = 0; j < rows; j++) {
      // *** YOUR CODE HERE ***
      // Set grid[i][j] and nextGrid[i][j] to 0


    }
  }

  // STEP 4: Reset the generation counter
  generation = 0;
}

// Fill grid with random live/dead cells
function randomizeGrid() {
  // STEP 1: Loop through every cell in the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // STEP 2: Set each cell randomly
      // *** YOUR CODE HERE ***
      // Use random() < 0.25 to give a 25% chance of a cell being alive
      // If true, set grid[i][j] to 1, otherwise set it to 0


    }
  }

  // STEP 3: Reset the generation counter
  generation = 0;
}

// Set all cells to dead state
function clearGrid() {
  // STEP 1: Loop through all cells in the grid
  // *** YOUR CODE HERE ***
  // Create a nested for loop to go through all columns and rows


    // STEP 2: Set each cell to dead (0)
    // *** YOUR CODE HERE ***
    // Set grid[i][j] to 0



  // STEP 3: Reset generation counter
  generation = 0;
}

// Toggle the state of a cell at the given coordinates
function toggleCell(x, y) {
  // STEP 1: Convert mouse coordinates to grid coordinates
  // *** YOUR CODE HERE ***
  // Calculate i (column) as floor(x / resolution)
  // Calculate j (row) as floor(y / resolution)


  // STEP 2: Check if the coordinates are within the grid bounds
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    // STEP 3: Toggle the cell's state
    // *** YOUR CODE HERE ***
    // If the cell is 0, make it 1, otherwise make it 0
    // Use the ternary operator: grid[i][j] = grid[i][j] === 0 ? 1 : 0;


  }
}
```

## display.js

```javascript
// display.js - Visualisation functionality
// Contains functions for drawing the grid and displaying status information

// Draw the current grid
function drawGrid() {
  // STEP 1: Loop through every cell in the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // STEP 2: Calculate the pixel coordinates for this cell
      let x = i * resolution;
      let y = j * resolution;

      // STEP 3: Draw the cell based on its state
      if (grid[i][j] === 1) {
        // STEP 3a: Draw a living cell (black with gray border)
        // *** YOUR CODE HERE ***
        // Set fill color to black (0)
        // Set stroke color to gray (200)
        // Draw a rectangle at (x, y) with width and height equal to resolution


      } else {
        // STEP 3b: Draw a dead cell (white with gray border)
        // *** YOUR CODE HERE ***
        // Set fill color to white (255)
        // Set stroke color to gray (200)
        // Draw a rectangle at (x, y) with width and height equal to resolution


      }
    }
  }
}

function displayStatus() {
  // STEP 1: Find or create the status panel
  let statusPanel = select('.status-panel');
  if (!statusPanel) {
    statusPanel = createDiv('');
    statusPanel.class('status-panel');
    statusPanel.parent(select('.container'));
  }

  // STEP 2: Clear previous content
  statusPanel.html('');

  // STEP 3: Display generation count
  // *** YOUR CODE HERE ***
  // Create a span element showing the current generation
  // Add the 'generation-count' class to it
  // Append it to the status panel


  // STEP 4: Display simulation status (Running/Paused)
  // *** YOUR CODE HERE ***
  // Create a span showing "Status: Running" or "Status: Paused" based on isRunning
  // Add the 'simulation-status' class plus 'status-running' or 'status-paused'
  // Append it to the status panel


  // STEP 5: Display speed information
  let speedInfo = createSpan(`Speed: ${speedSlider.value()} fps`);
  speedInfo.parent(statusPanel);

  // STEP 6: Display grid dimensions
  let gridInfo = createSpan(`Grid: ${cols}×${rows} cells`);
  gridInfo.parent(statusPanel);
}
```

## ui.js

```javascript
// ui.js - User interface elements
// Contains functions for creating and managing UI controls

// Create all UI elements (buttons, sliders, etc.)
function createButtons() {
  // STEP 1: Get the UI container
  let uiContainer = select('.control-panel');

  // STEP 2: Create the Play/Pause button
  // *** YOUR CODE HERE ***
  // Create a button with the text 'Play/Pause'
  // Set its parent to uiContainer
  // Add the 'play-pause' class to it
  // Set its mousePressed event to call toggleSimulation


  // STEP 3: Create the Step button
  // *** YOUR CODE HERE ***
  // Create a button with the text 'Step'
  // Set its parent to uiContainer
  // Add the 'step' class to it
  // Set its mousePressed event to call stepSimulation


  // STEP 4: Create the Clear button
  let clearButton = createButton('Clear');
  clearButton.parent(uiContainer);
  clearButton.class('clear');
  clearButton.mousePressed(clearGrid);

  // STEP 5: Create the Random button
  let randomButton = createButton('Random');
  randomButton.parent(uiContainer);
  randomButton.class('random');
  randomButton.mousePressed(randomizeGrid);

  // STEP 6: Create the speed slider
  // STEP 6a: Create a div for the speed control
  let speedControl = createDiv('');
  speedControl.class('speed-control');
  speedControl.parent(uiContainer);

  // STEP 6b: Create the speed label
  let speedLabel = createSpan('Speed:');
  speedLabel.class('speed-label');
  speedLabel.parent(speedControl);

  // STEP 6c: Create the slider
  // *** YOUR CODE HERE ***
  // Create a slider with min value 1, max value 30, and starting value 10
  // Set its parent to speedControl
  // Store it in the global speedSlider variable


}

// Toggle between running and paused states
function toggleSimulation() {
  // STEP 1: Toggle the running state
  // *** YOUR CODE HERE ***
  // Flip the isRunning variable to its opposite value


}

// Advance one generation
function stepSimulation() {
  // STEP 1: Calculate one generation
  // *** YOUR CODE HERE ***
  // Call the computeNextGeneration function


  // STEP 2: Increment the generation counter
  // *** YOUR CODE HERE ***
  // Add 1 to the generation variable


}
```

## sketch.js

```javascript
// sketch.js - Main entry point for Conway's Game of Life
// This file contains the p5.js setup and draw functions

function setup() {
  // STEP 1: Find the container element
  let container = select('.container');

  // STEP 2: Create control panels if they don't exist
  if (!select('.control-panel')) {
    let controlPanel = createDiv('');
    controlPanel.class('control-panel');
    controlPanel.parent(container);
  }

  if (!select('.pattern-panel')) {
    let patternPanel = createDiv('');
    patternPanel.class('pattern-panel');
    patternPanel.parent(container);
  }

  // STEP 3: Create the canvas
  // *** YOUR CODE HERE ***
  // Create an 800x600 canvas
  // Set its parent to the container


  // STEP 4: Calculate grid dimensions
  // *** YOUR CODE HERE ***
  // Calculate cols as floor(width / resolution)
  // Calculate rows as floor(height / resolution)


  // STEP 5: Initialise the grid
  // *** YOUR CODE HERE ***
  // Call the initializeGrid function


  // STEP 6: Create UI elements
  // *** YOUR CODE HERE ***
  // Call the createButtons function
  // Call the createPatternButtons function


  // STEP 7: Start with a random pattern
  // *** YOUR CODE HERE ***
  // Call the randomizeGrid function


  // STEP 8: Set initial frame rate
  frameRate(10);
}

function draw() {
  // STEP 1: Set the background color
  background(255);

  // STEP 2: Display status information
  // *** YOUR CODE HERE ***
  // Call the displayStatus function


  // STEP 3: Draw the current grid
  // *** YOUR CODE HERE ***
  // Call the drawGrid function


  // STEP 4: Update the simulation if it's running
  if (isRunning) {
    // STEP 4a: Adjust speed based on slider
    // *** YOUR CODE HERE ***
    // Get the value from the speed slider
    // Set the frame rate to this value


    // STEP 4b: Calculate the next generation
    // *** YOUR CODE HERE ***
    // Call the computeNextGeneration function
    // Increment the generation counter


  }
}

function mousePressed() {
  // Check if the click was on the grid (not on UI elements)
  if (mouseY > 50) {
    // Toggle the cell state
    // *** YOUR CODE HERE ***
    // Call the toggleCell function with mouseX and mouseY


  }
}
```
```
