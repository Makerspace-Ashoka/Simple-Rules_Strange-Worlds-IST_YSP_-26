---
sidebar_position: 4
sidebar_label: "Challenge 04: Cell Age Tracking"
---

# Challenge 04: Cell Age Tracking

**Difficulty: Intermediate**

**Objective:** Track how long cells have been alive and visualise this information.

**Instructions:**
1. Add a new global 2D array called `cellAge` in `globals.js`
2. Initialise it in `initializeGrid()` with zeros (initialised like `grid`)
3. Modify `computeNextGeneration()` to:
   - When a cell becomes alive, set its age to 1
   - When a cell stays alive, increment its age
   - When a cell dies, reset its age to 0
4. Modify `drawGrid()` to visualise age:
   - Young cells: bright green
   - Older cells: gradually changing to deep blue

**Hints:**
- Only update age for living cells (`initializeGrid()` ??)
- Use `map()` to convert age values to colour values
- Cap the maximum age (e.g., at 10 or 20) for visualisation purposes
- Use [coolors.co](https://coolors.co) for colour suggestions. Remember HSB?

**Extension:** Add a "heat map" view toggle button that switches between normal view and age visualisation.

**Advanced Extension:** Create a "Time Machine" feature that lets users step backward through previous generations.

