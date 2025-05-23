---
sidebar_position: 7
sidebar_label: "Challenge 07: Custom Rules"
---

# Challenge 07: Rule Customisation

**Difficulty: Advanced**

**Objective:** Allow users to customise the Game of Life rules.

**Instructions:**
1. Create a UI panel with checkboxes or sliders for birth and survival rules
2. Modify the `applyRules()` function to use these custom rules
3. Add preset buttons for known cellular automaton rule sets like:
   - HighLife (B36/S23)
   - Day & Night (B3678/S34678)
   - Seeds (B2/S)

**Hints:**
- The standard Game of Life rule is B3/S23 (born with 3 neighbours, survives with 2 or 3)
- Create arrays to store which neighbour counts lead to birth or survival
- Use checkboxes for each possible neighbour count (0-8)

**Extension:** Add a rule explorer that randomly generates rules and allows users to rate and save interesting ones.

