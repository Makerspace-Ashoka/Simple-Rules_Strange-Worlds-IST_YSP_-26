---
sidebar_position: 8
sidebar_label: "Challenge 08: Multiple Colonies"
---

# Challenge 08: Multiple Colonies

**Difficulty: Expert**

**Objective:** Implement multiple colonies with different colours that interact according to specific rules.

**Instructions:**
1. Modify the grid to store values beyond 0 and 1 (e.g., 0=dead, 1=colony A, 2=colony B)
2. Update `countNeighbors()` to count neighbours of each type separately
3. Create rules for how different colony types interact
4. Update the visualisation to show different colours for each colony

**Hints:**
- You'll need multiple counters in `countNeighbors()`
- Consider rules like: "Colony A cells are born if surrounded by exactly 3 Colony A cells, but die if touched by any Colony B cells"
- Use different colours to visualise the different colonies

**Extension:** Create a competitive mode where colonies fight for territory, with a scoreboard showing which colony is winning.

