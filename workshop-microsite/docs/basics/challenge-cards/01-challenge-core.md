---
sidebar_position: 1
sidebar_label: "Challenge 01: Core Game of Life"
---

# Challenge 01: Core Game of Life

**Difficulty: Beginner**

**Objective:** Implement the basic Game of Life rules and get the simulation running.

**Instructions:**
1. Complete the `countNeighbors()` function in `gameLogic.js`
2. Implement the `applyRules()` function to apply Conway's Game of Life rules
3. Fill in the `computeNextGeneration()` function to calculate the next state
4. Test your implementation by using the "Step" and "Play" buttons

**Hints:**
- Remember the rules: cells with 2-3 neighbours stay alive, cells with exactly 3 neighbours become alive, and the others die
- Make sure to count all 8 surrounding neighbours
- Make sure to handle the cell itself (when i=0 and j=0) in the neighbour counting loop
- Use the template comments to guide your implementation
- Don't forget to use the modulo

**Extension:** Try modifying the `randomizeGrid()` function to change the initial probability of live cells. What happens when you increase or decrease this value?

