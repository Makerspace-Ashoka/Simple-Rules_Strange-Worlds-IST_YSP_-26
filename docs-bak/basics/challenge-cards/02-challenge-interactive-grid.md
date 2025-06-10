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



# Challenge 2.1 : Interactive Visualisation

**Difficulty: Intermediate**

**Objective:** Enhance the visualisation of the Game of Life with interactive features.

**Instructions:**
1. Implement cell colouring based on their "age" (how many generations they've been alive)
2. Add a "heat map" mode that shows recently changed cells in brighter colours
3. Create a toggle button to switch between normal and heat map views
4. Implement cell highlighting when the mouse hovers over cells

**Hints:**
- Create an additional 2D array to track cell ages
- Use colour gradients (HSB colour mode works well for this)
- Add a mode variable to track which visualisation is active

**Extension:** Add an option to show "ghost trails" where dead cells fade out gradually over several generations.

