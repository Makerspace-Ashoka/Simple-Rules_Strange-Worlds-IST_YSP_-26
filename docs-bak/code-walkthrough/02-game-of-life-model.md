---
sidebar_position: 2
sidebar_label: '02: Game of Life Model'
---

# Part 2: The Game of Life Model

### The Grid System
**Question 2.1:** Look at the code in `globals.js`. What different types of data are being stored?

<details>
<summary>Key Information</summary>
<ul>
<li>Grid data (<code>grid</code> and <code>nextGrid</code>)</li>
<li>Grid dimensions (<code>cols</code>, <code>rows</code>, <code>resolution</code>)</li>
<li>Simulation state (<code>generation</code>, <code>isRunning</code>)</li>
<li>UI elements (<code>speedSlider</code>)</li>
</ul>
</details>

**Think Deeper 2.2:** Why do we need both `grid` and `nextGrid`? What might happen if we used only one grid array?

<details>
<summary>Conceptual Understanding</summary>
Using only one grid would create a problem: as we update cells based on neighbour counts, we'd be changing the grid while still counting neighbours for other cells. This would mean some cells would be evaluated based on already-updated neighbours, creating inconsistent results. Having two grids keeps the current state separate from the next state being calculated.
</details>

**Activity 2.3:** In `grid.js`, find the `initializeGrid()` function. Draw a diagram of how this creates the grid as a 2D array. If the grid is 5×5, what would the array structure look like?

<details>
<summary>Visualisation</summary>
A 5×5 grid would create a data structure like:<br/>
<pre>
grid = [
  [0, 0, 0, 0, 0],  // Column 0
  [0, 0, 0, 0, 0],  // Column 1
  [0, 0, 0, 0, 0],  // Column 2
  [0, 0, 0, 0, 0],  // Column 3
  [0, 0, 0, 0, 0]   // Column 4
]
</pre>
Where each inner array represents a column, and each value represents a cell (0=dead, 1=alive).
</details>

### Game Rules
**Question 2.4:** Examine the `applyRules()` function in `gameLogic.js`. What are the rules of Conway's Game of Life in your own words?

<details>
<summary>Rules Summary</summary>
<ol>
<li>A living cell with fewer than 2 living neighbours dies (underpopulation)</li>
<li>A living cell with 2 or 3 living neighbours stays alive</li>
<li>A living cell with more than 3 living neighbours dies (overpopulation)</li>
<li>A dead cell with exactly 3 living neighbours becomes alive (reproduction)</li>
</ol>
</details>

**Think Deeper 2.5:** Conway's Game of Life is called a "cellular automaton." Based on what you've seen, what do you think defines a cellular automaton?

<details>
<summary>Key Concept</summary>
A cellular automaton is a system where:
<ul>
<li>Space is divided into cells (often a grid)</li>
<li>Each cell has a state (in the simplest case, alive or dead)</li>
<li>Cells change state based on rules that depend on their neighbours</li>
<li>All cells update simultaneously in discrete time steps</li>
<li>Simple rules can lead to complex, emergent behaviour</li>
</ul>
</details>

**Activity 2.6:** Look at the `countneighbours()` function in `gameLogic.js`. Focus on these lines:
```javascript
let col = (x + i + cols) % cols;
let row = (y + j + rows) % rows;
```
What's happening here? Try calculating this manually for a 5×5 grid when:
- x=0, y=0, i=-1, j=-1
- x=4, y=4, i=1, j=1

<details>
<summary>Understanding Wraparound</summary>
These calculations create a "toroidal" (donut-shaped) world where the edges wrap around:
<ul>
<li>For x=0, y=0, i=-1, j=-1: col=(0-1+5)%5=4, row=(0-1+5)%5=4</li>
<li>For x=4, y=4, i=1, j=1: col=(4+1+5)%5=0, row=(4+1+5)%5=0</li>
</ul>
This means the top edge connects to the bottom, and the left edge connects to the right, creating an infinite-seeming grid.
</details>

