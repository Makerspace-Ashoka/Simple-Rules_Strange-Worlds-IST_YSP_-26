---
sidebar_position: 2
sidebar_label: "Challenge 02: Interactive Grid"
---

# Challenge 02: Interactive Grid

**Difficulty: Beginner-Intermediate**

**Objective:** Complete the user interface functions to make the grid fully interactive.

**Instructions:**
1. Complete the `toggleCell()` function in `grid.js` to allow clicking on cells
2. Implement the `clearGrid()` function to clear all cells
3. Finish the speed slider implementation in `ui.js`
4. Add keyboard controls: spacebar to toggle play/pause, 'c' to clear, 'r' for random

**Hints:**
- Use `floor(x / resolution)` to convert mouse coordinates to grid positions
- Remember to check if coordinates are within grid bounds
- For keyboard controls, add a `keyPressed()` function in `sketch.js`

**Extension:** Add a "Drawing Mode" that lets users draw while the simulation is paused.

