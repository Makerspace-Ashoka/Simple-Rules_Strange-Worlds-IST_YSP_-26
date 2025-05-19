---
sidebar_position: 4
sidebar_label: "Challenge 04: Rule Customisation"
---

# Challenge 04: Rule Customisation

**Difficulty: Intermediate**

**Objective:** Allow users to customise the cellular automaton rules.

**Instructions:**
1. Modify the `applyRules()` function to accept custom birth and survival rules
2. Add UI controls to set which neighbour counts cause birth or survival
3. Implement preset buttons for common rule variations like:
   - HighLife (B36/S23)
   - Day & Night (B3678/S34678)
   - Seeds (B2/S)

**Hints:**
- Use arrays to store which neighbour counts lead to birth or survival
- Create a simple UI with checkboxes for each possible neighbour count (0-8)
- Display the current rule set in standard notation (B3/S23 for normal Game of Life)

**Extension:** Create a visualisation that shows how different rules affect the same initial pattern.

