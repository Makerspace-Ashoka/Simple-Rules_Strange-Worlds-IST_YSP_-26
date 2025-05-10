## Code Walkthrough Guide

### For 9-10th Grade Students

CODE WALKTHROUGH GUIDE (Grades 9-10)
Name: _______________________

UNDERSTANDING 1D CELLULAR AUTOMATA CODE

This guide will help you understand how cellular automata work in code.
Add your notes in the spaces provided.

DATA STRUCTURES:
```javascript
let cells = [];      // Current generation (current row)
let nextGen = [];    // Next generation (next row)
let cellSize = 5;    // Size of each cell in pixels
let rows = 0;        // Number of rows completed
let rule = 30;       // Rule to apply (0-255)
```

What does each variable do? Add your notes:
cells: _______________
nextGen: _______________
cellSize: _______________
rows: _______________
rule: _______________

SETUP FUNCTION:
```javascript
function setup() {
  createCanvas(600, 400);
  // Calculate number of cells that fit in the canvas
  let numCells = floor(width / cellSize);

  // Initialize arrays
  cells = new Array(numCells).fill(0);
  nextGen = new Array(numCells).fill(0);

  // Start with a single cell in the middle
  cells[floor(numCells/2)] = 1;

  // Draw the first generation
  background(0);
  drawCells();
}
```

What happens in the setup function? Add your notes:
1. _______________
2. _______________
3. _______________
4. _______________

DRAWING FUNCTION:
```javascript
function draw() {
  // Stop if we've filled the canvas
  if (rows * cellSize >= height) return;

  // Calculate the next generation
  calculateNextGen();

  // Draw the new cells
  drawCells();

  // Update the row counter
  rows++;
}
```

What happens in each frame? Add your notes:
1. _______________
2. _______________
3. _______________
4. _______________

DISPLAYING CELLS:
```javascript
function drawCells() {
  // Set color to white
  fill(255);
  noStroke();

  // Draw each cell in the current generation
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === 1) {
      rect(i * cellSize, rows * cellSize, cellSize, cellSize);
    }
  }
}
```

How does this function draw the cells? Add your notes:
1. _______________
2. _______________
3. _______________

CALCULATING NEXT GENERATION:
```javascript
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
```

How does this function calculate the next row? Add your notes:
1. _______________
2. _______________
3. _______________
4. _______________

APPLYING THE RULE:
```javascript
function applyRule(left, center, right, ruleNumber) {
  // Convert the three neighboring cells into a binary number (0-7)
  let idx = (left << 2) | (center << 1) | right;

  // Check if the bit at position idx in ruleNumber is 1 or 0
  return (ruleNumber >> idx) & 1;
}
```

This is the function you'll complete. What does it need to do?
1. _______________
2. _______________
3. _______________

CONNECTING TO PAPER ACTIVITY:
Think about the paper exercise we did:
- How does the code implement the same process? _______________
- What does the computer do differently? _______________
- What's the advantage of using code? _______________

### For 11-12th Grade Students

CODE ANALYSIS & IMPLEMENTATION GUIDE (Grades 11-12)
Name: _______________________

CELLULAR AUTOMATA IMPLEMENTATION ARCHITECTURE

This guide will help you analyze and implement a 1D cellular automaton.
Your task is to develop a complete, efficient implementation.

PROGRAM STRUCTURE ANALYSIS:

Core Components:
1. Data representation: 1D arrays for current and next generation
2. Initial state configuration
3. Rule application logic
4. Generation update mechanism
5. Visualization system
6. User interface for interaction

CONCEPTUAL IMPLEMENTATION:

For each component, outline your implementation approach:

DATA REPRESENTATION:
- What data structure will you use? _______________
- How will you handle edge cases? _______________
- Are there optimization opportunities? _______________

RULE APPLICATION:
- How will you convert neighborhood to index? _______________
- What's the most efficient way to apply the rule? _______________
- Can you use bitwise operations? How? _______________

GENERATION UPDATE:
- How will you update generations without race conditions? _______________
- Will you use a double buffer approach? Why? _______________
- Are there memory optimizations possible? _______________

VISUALIZATION:
- What visual representation will you use? _______________
- How will you handle growth beyond canvas boundaries? _______________
- What visual enhancements will you add? _______________

USER INTERFACE:
- What controls will you implement? _______________
- How will you make rule selection intuitive? _______________
- What features will enhance user experience? _______________

CODE ARCHITECTURE DESIGN:

Sketch the architecture of your implementation:
[Space for diagram]

List key functions with their purpose:
- _______________: _______________
- _______________: _______________
- _______________: _______________
- _______________: _______________
- _______________: _______________

IMPLEMENTATION PSEUDOCODE:

Write pseudocode for critical functions:

Initialize():
```
[Space for pseudocode]
```

ApplyRule():
```
[Space for pseudocode]
```

UpdateGeneration():
```
[Space for pseudocode]
```

ADVANCED CONSIDERATIONS:

Performance Analysis:
- Time complexity: _______________
- Space complexity: _______________
- Bottlenecks: _______________
- Optimization strategies: _______________

Extension Points:
- How could you extend to 2D automata? _______________
- How could multiple rules interact? _______________
- How might you add interactivity? _______________

