// display.js - Visualization functionality
// Contains functions for drawing the grid and displaying status information

// Draw the current grid
function drawGrid() {
  // Draw each cell based on its state
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;

      if (grid[i][j] === 1) {
        // Live cell - black fill with gray stroke
        fill(0);
        stroke(200);
        rect(x, y, resolution, resolution);
      } else {
        // Dead cell - white fill with gray stroke
        fill(255);
        stroke(200);
        rect(x, y, resolution, resolution);
      }
    }
  }
}


function displayStatus() {
  // Find or create the status panel
  let statusPanel = select('.status-panel');
  if (!statusPanel) {
    statusPanel = createDiv('');
    statusPanel.class('status-panel');
    statusPanel.parent(select('.container'));
  }

  // Clear previous content
  statusPanel.html('');

  // Display generation count
  let genCount = createSpan(`Generation: ${generation}`);
  genCount.class('generation-count');
  genCount.parent(statusPanel);

  // Display simulation status
  let statusText = isRunning ? "Running" : "Paused";
  let statusClass = isRunning ? "status-running" : "status-paused";
  let simStatus = createSpan(`Status: ${statusText}`);
  simStatus.class('simulation-status ' + statusClass);
  simStatus.parent(statusPanel);

  // Display speed
  let speedInfo = createSpan(`Speed: ${speedSlider.value()} fps`);
  speedInfo.parent(statusPanel);

  // Display grid dimensions
  let gridInfo = createSpan(`Grid: ${cols}×${rows} cells`);
  gridInfo.parent(statusPanel);
}

// Optional: Add highlighted cell feature to show which cell the mouse is over
function highlightCell(x, y) {
  // Calculate grid coordinates from mouse position
  let i = floor(x / resolution);
  let j = floor(y / resolution);

  // Highlight cell under mouse if within grid
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    let cellX = i * resolution;
    let cellY = j * resolution;

    // Draw highlighted border
    stroke(255, 0, 0, 150); // Semi-transparent red
    strokeWeight(2);
    noFill();
    rect(cellX, y, resolution, resolution);
    strokeWeight(1); // Reset for rest of the drawing
  }
}

