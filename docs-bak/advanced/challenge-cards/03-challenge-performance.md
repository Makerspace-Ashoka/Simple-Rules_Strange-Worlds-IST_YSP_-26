---
sidebar_position: 3
sidebar_label: "Challenge 03: Performance Optimisation"
---

# Challenge 03: Performance Optimisation

**Difficulty: Intermediate**

**Objective:** Optimise the Game of Life implementation to handle larger grids.

**Instructions:**
1. Modify the `computeNextGeneration()` function to only check cells that could potentially change
2. Track which areas of the grid are "active" (have live cells or neighbours)
3. Implement dynamic resolution adjustment based on grid activity
4. Add a counter for "births" and "deaths" per generation and display it

**Hints:**
- A cell can only change if it is alive or has at least one live neighbour
- Create a simple bounding box around active regions
- Use timers to measure and compare performance improvements

**Extension:** Add a control to adjust the grid size dynamically, with automatic resolution scaling to maintain performance.

