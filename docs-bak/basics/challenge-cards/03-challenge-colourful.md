---
sidebar_position: 3
sidebar_label: "Challenge 03: Colourful Life"
---

# Challenge 03: Colourful Life

**Difficulty: Beginner-Intermediate**

**Objective:** Enhance the visualization by adding colours to cells based on their state or neighbour count.

**Instructions:**
1. Modify the `drawGrid()` function in `display.js`
2. Instead of just black and white, use different colours based on:
   - For live cells: Different colours based on their neighbour count
   - For example: 1 neighbour = red, 2 = orange, 3 = yellow
3. Keep dead cells white or light gray

**Hints:**
- You'll need to count neighbours for each cell during drawing
- Use the `fill()` function with RGB values
- Try `colorMode(HSB)` at the beginning of your `drawGrid()` function

**Extension:** Add a toggle button to switch between normal and coloured views.

**Advanced Extension:** Make the colours transition smoothly based on how many generations a cell has been alive. You'll need to add a new 2D array to track this information.

