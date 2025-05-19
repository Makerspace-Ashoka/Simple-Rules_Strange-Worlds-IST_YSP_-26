---
sidebar_position: 6
sidebar_label: "Challenge 06: Population Graph"
---

# Challenge 06: Population Graph

**Difficulty: Intermediate**

**Objective:** Create a simple graph that shows population changes over time.

**Instructions:**
1. Create a global array `populationHistory` to store population counts
2. Add a function `updatePopulation()` that:
   - Counts total number of live cells
   - Adds this count to `populationHistory`
3. Call this function in the `draw()` loop when the simulation is running
4. Add a function `drawPopulationGraph()` that:
   - Draws a simple line graph at the bottom of the canvas
   - Shows population changes over the last 50 generations

**Hints:**
- Use a fixed-size array and shift old values when it gets too long
- Use `line()` to draw the graph
- Scale the graph to fit the available space

**Extension:** Add buttons to show different statistics: population, births per generation, deaths per generation).

