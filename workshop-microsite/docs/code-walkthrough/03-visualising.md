---
sidebar_position: 3
sidebar_label: '03: Visualising the Game'
---

# Part 3: Visualising the Game

### Drawing the Grid
**Question 3.1:** In `display.js`, what's the relationship between the grid coordinates (i,j) and pixel coordinates (x,y) in the `drawGrid()` function?

<details>
<summary>Coordinate Mapping</summary>
The grid coordinates (i,j) are multiplied by the resolution to get pixel coordinates:
<ul>
<li>x = i * resolution</li>
<li>y = j * resolution</li>
</ul>
This means each cell is drawn as a square that's resolution×resolution pixels in size.
</details>

**Think Deeper 3.2:** When a user clicks on the canvas, how does the program determine which cell was clicked? Look at the `toggleCell()` function in `grid.js`.

<details>
<summary>Reverse Mapping</summary>
The program converts from pixel coordinates to grid coordinates by dividing and flooring:
<ul>
<li>i = floor(x / resolution)</li>
<li>j = floor(y / resolution)</li>
</ul>
This is the inverse of the mapping used in drawing, ensuring clicks affect the correct cell.
</details>

### Animation Loop
**Question 3.3:** In p5.js, the `draw()` function is called repeatedly to create animation. Look at `sketch.js` - what sequence of actions happens in each animation frame?

<details>
<summary>Animation Sequence</summary>
Each frame:
<ol>
<li>Clear the background</li>
<li>Display status information</li>
<li>Draw the current grid</li>
<li>If the simulation is running:</li>
  <ul>
  <li>Adjust speed based on the slider</li>
  <li>Compute the next generation</li>
  <li>Increment the generation counter</li>
  </ul>
</ol>
</details>

**Activity 3.4:** What do you predict would happen if you placed the `computeNextGeneration()` call before `drawGrid()`? Test your prediction by modifying the code.

<details>
<summary>Effect Analysis</summary>
If <code>computeNextGeneration()</code> is called before <code>drawGrid()</code>, you would never see the initial grid state because it would be updated before drawing. This might make the visualisation less clear as generations would appear to "skip ahead."
</details>

