## Challenge Cards

### For 9-10th Grade Students

╔══════════════════════════════════╗
║  CHALLENGE CARD: COLOR EXPLORER  ║
║  (Grades 9-10)                   ║
╚══════════════════════════════════╝

Make your automaton colorful by changing
the drawCells() function!

STEP 1: Create a color based on the row number
```javascript
// Inside drawCells() function
// Replace: fill(255);
// With:
fill(255, rows % 255, 150);
```

STEP 2: Try other color variations
```javascript
// Try this for a rainbow effect:
fill((i * 10) % 255, 150, 255);
```

STEP 3: Create a gradient effect
```javascript
// Try this for row-based gradient:
let brightness = map(rows, 0, height/cellSize, 100, 255);
fill(brightness, 100, 200);
```

CHALLENGE: Can you make a color pattern that
changes based on the rule number?

Share your creation!
```

```
╔══════════════════════════════════╗
║  CHALLENGE CARD: PATTERN MAKER   ║
║  (Grades 9-10)                   ║
╚══════════════════════════════════╝

Create interesting starting patterns instead
of just one cell!

STEP 1: Create a line pattern
```javascript
// In setup(), replace the single cell code with:
// Start with a line of cells
for (let i = cells.length/3; i < cells.length*2/3; i++) {
  cells[i] = 1;
}
```

STEP 2: Create a random pattern
```javascript
// Try this for random starting cells:
for (let i = 0; i < cells.length; i++) {
  cells[i] = random() > 0.8 ? 1 : 0;
}
```

STEP 3: Create an alternating pattern
```javascript
// Try this for alternating cells:
for (let i = 0; i < cells.length; i++) {
  cells[i] = i % 2;
}
```

CHALLENGE: Can you create a starting pattern
that spells your initials?

Share your creation!
```

```
╔══════════════════════════════════╗
║  CHALLENGE CARD: RULE EXPLORER   ║
║  (Grades 9-10)                   ║
╚══════════════════════════════════╝

Experiment with different rules to see
what patterns they create!

STEP 1: Add a rule slider
```javascript
// In setup(), add this code:
createSpan('  Rule: ');
let ruleSlider = createSlider(0, 255, 30, 1);
ruleSlider.input(function() {
  rule = ruleSlider.value();
  reset();
});
```

STEP 2: Try these famous rules:
- Rule 30: Creates random-looking patterns
- Rule 90: Creates a triangle fractal pattern
- Rule 110: Creates complex, Turing-complete patterns
- Rule 184: Creates a "traffic flow" simulation

STEP 3: Try your own rule numbers

CHALLENGE: Can you find a rule that creates
a pattern you really like? Can you explain
why it creates that pattern?

Rule number: _______
Pattern description: _______

### For 11-12th Grade Students

╔══════════════════════════════════════════╗
║  ADVANCED CHALLENGE: RULE VISUALIZER     ║
║  (Grades 11-12)                          ║
╚══════════════════════════════════════════╝

Create a visual representation of the current
rule to help users understand how it works.

IMPLEMENTATION GUIDE:

STEP 1: Create a rule visualization function
```javascript
function drawRuleTable() {
  // Constants for the table
  const cellSize = 15;
  const tableX = 20;
  const tableY = 20;

  // For each possible 3-cell pattern (0-7)
  for (let i = 0; i < 8; i++) {
    // Draw the pattern
    for (let j = 0; j < 3; j++) {
      // Determine if this cell is on in pattern i
      let isOn = (i & (1 << (2-j))) !== 0;

      // Set fill color
      fill(isOn ? 255 : 0);

      // Draw cell
      rect(tableX + (j * cellSize),
           tableY + (i * cellSize * 2),
           cellSize, cellSize);
    }

    // Draw the result
    let result = (rule >> i) & 1;
    fill(result ? 255 : 0);
    rect(tableX + (4 * cellSize),
         tableY + (i * cellSize * 2),
         cellSize, cellSize);
  }
}
```

STEP 2: Call the function in your draw loop
```javascript
// Add this at the end of your draw function
drawRuleTable();
```

STEP 3: Add explanatory text
```javascript
// Add this to your drawRuleTable function
fill(255);
textSize(12);
text("Rule " + rule, tableX, tableY - 5);
text("Pattern", tableX, tableY - 20);
text("Result", tableX + (4 * cellSize), tableY - 20);
```

ADVANCED CHALLENGE: Modify the rule display
to be interactive, allowing users to click
on result cells to change the rule.
```

```
╔═══════════════════════════════════════════╗
║  ADVANCED CHALLENGE: MULTI-RULE SYSTEM    ║
║  (Grades 11-12)                           ║
╚═══════════════════════════════════════════╝

Create a system where different regions of the
automaton use different rules, creating complex
pattern interactions.

IMPLEMENTATION GUIDE:

STEP 1: Modify your rule application function
```javascript
function applyRule(left, center, right, x) {
  // Convert the three cells to a binary number (0-7)
  let idx = (left << 2) | (center << 1) | right;

  // Determine which rule to use based on position
  let localRule;

  if (x < cells.length / 3) {
    // Left third uses Rule 30
    localRule = 30;
  } else if (x < cells.length * 2/3) {
    // Middle third uses Rule 90
    localRule = 90;
  } else {
    // Right third uses Rule 110
    localRule = 110;
  }

  // Apply the selected rule
  return (localRule >> idx) & 1;
}
```

STEP 2: Add a visualization of the rule regions
```javascript
// Add this to your drawCells function
// to visualize different rule regions
noStroke();
fill(255, 100, 100, 50);  // Transparent red
rect(0, 0, width/3, height);
fill(100, 255, 100, 50);  // Transparent green
rect(width/3, 0, width/3, height);
fill(100, 100, 255, 50);  // Transparent blue
rect(width*2/3, 0, width/3, height);
```

STEP 3: Make the rule regions dynamic
```javascript
// Create variables for rule region boundaries
let boundary1 = cells.length / 3;
let boundary2 = cells.length * 2/3;

// Make them shift over time
function updateBoundaries() {
  // Make boundaries shift using sine wave
  let cycle = frameCount / 100;
  boundary1 = cells.length/3 + sin(cycle) * cells.length/10;
  boundary2 = cells.length*2/3 + cos(cycle) * cells.length/10;
}
```

ADVANCED CHALLENGE: Create a system where the
rules interact at the boundaries, creating
emergent patterns from the interaction.
```

```
╔═════════════════════════════════════════╗
║  ADVANCED CHALLENGE: 2D EXTENSION        ║
║  (Grades 11-12)                          ║
╚═════════════════════════════════════════╝

Extend your 1D cellular automaton implementation
to create a 2D automaton like Conway's Game of Life.

IMPLEMENTATION GUIDE:

STEP 1: Create 2D grid data structures
```javascript
// Replace your 1D arrays with 2D grids
let grid;
let nextGrid;
const cols = 100;
const rows = 100;

function setup() {
  createCanvas(600, 600);
  cellSize = width / cols;

  // Initialize 2D grids
  grid = create2DArray(cols, rows);
  nextGrid = create2DArray(cols, rows);

  // Initialize with random values
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = random() > 0.8 ? 1 : 0;
    }
  }
}

function create2DArray(w, h) {
  let arr = new Array(w);
  for (let i = 0; i < w; i++) {
    arr[i] = new Array(h).fill(0);
  }
  return arr;
}
```

STEP 2: Implement Game of Life rules
```javascript
function updateGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Count neighbors
      let neighbors = countNeighbors(grid, i, j);

      // Apply Game of Life rules
      if (grid[i][j] === 1) {
        // Cell is alive
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0; // Dies
        } else {
          nextGrid[i][j] = 1; // Survives
        }
      } else {
        // Cell is dead
        if (neighbors === 3) {
          nextGrid[i][j] = 1; // Becomes alive
        } else {
          nextGrid[i][j] = 0; // Stays dead
        }
      }
    }
  }

  // Swap grids
  [grid, nextGrid] = [nextGrid, grid];
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip self

      // Wrap around edges (toroidal grid)
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;

      sum += grid[col][row];
    }
  }
  return sum;
}
```

STEP 3: Draw the 2D grid
```javascript
function draw() {
  background(0);

  // Draw grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellSize;
      let y = j * cellSize;
      if (grid[i][j] === 1) {
        fill(255);
        stroke(0);
        rect(x, y, cellSize, cellSize);
      }
    }
  }

  // Update grid for next frame
  updateGrid();
}
```

ADVANCED CHALLENGE: Implement a custom 2D automaton
with different rules or more cell states.

