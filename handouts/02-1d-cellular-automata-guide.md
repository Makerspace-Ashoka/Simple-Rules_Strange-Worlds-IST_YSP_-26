## 1D Cellular Automata Guide

### For 9-10th Grade Students

```
1D CELLULAR AUTOMATA GUIDE (Grades 9-10)
Name: _______________________

WHAT IS A 1D CELLULAR AUTOMATON?
A 1D cellular automaton uses a line of cells instead of a grid.
Each new generation forms a new row below the previous one.

HOW IT WORKS:
1. Start with a row of cells (usually just one cell is "on")
2. Each new cell's state depends on itself and its two neighbors from the row above
3. The pattern grows downward, one row at a time

RULE 30 EXPLAINED:
Rule 30 is a famous 1D cellular automaton that creates chaotic patterns.
The rule number (30) tells us exactly how cells evolve.

Converting 30 to binary: 00011110

This gives us a lookup table for all possible 3-cell patterns:
| Left | Center | Right | Pattern | Binary Value | New State |
|------|--------|-------|---------|--------------|-----------|
|  1   |   1    |   1   |   111   |       7      |     0     |
|  1   |   1    |   0   |   110   |       6      |     0     |
|  1   |   0    |   1   |   101   |       5      |     0     |
|  1   |   0    |   0   |   100   |       4      |     1     |
|  0   |   1    |   1   |   011   |       3      |     1     |
|  0   |   1    |   0   |   010   |       2      |     1     |
|  0   |   0    |   1   |   001   |       1      |     1     |
|  0   |   0    |   0   |   000   |       0      |     0     |

HANDS-ON ACTIVITY:
Let's implement Rule 30 by hand!

1. On your graph paper, mark a single black cell in the middle of the top row
2. For each new row:
   - Look at each group of 3 cells above
   - Use the lookup table to determine the new cell's state
   - Fill in the new cell accordingly

Example calculation:
If you see [empty][filled][empty] in the row above, that's pattern "010".
Looking at the table, this gives a new state of "1" (filled).

3. Complete at least 15 rows

OBSERVATIONS:
What patterns do you see? _______________
Is the pattern random or ordered? _______________
Does it look like anything in nature? _______________

TRY THIS:
What happens if you start with two black cells next to each other?
Draw your result below:
[Graph paper grid]
```

### For 11-12th Grade Students

```
1D CELLULAR AUTOMATA ANALYSIS (Grades 11-12)
Name: _______________________

ELEMENTARY CELLULAR AUTOMATA: THEORY & IMPLEMENTATION

CONCEPTUAL FRAMEWORK:
Elementary cellular automata (ECA) are the simplest class of 1D cellular automata,
operating on a 1D array of cells with two possible states and rules based on
nearest neighbors.

RULE FORMALIZATION:
For an ECA, there are 2³ = 8 possible neighborhood configurations and 2⁸ = 256
possible rule sets. Each rule can be represented as an 8-bit binary number.

For Rule 30 (binary 00011110):

| Configuration | 111 | 110 | 101 | 100 | 011 | 010 | 001 | 000 |
|---------------|-----|-----|-----|-----|-----|-----|-----|-----|
| New State     |  0  |  0  |  0  |  1  |  1  |  1  |  1  |  0  |

MATHEMATICAL EXPRESSION:
The new state of cell i at time t+1 can be expressed as:
s(i,t+1) = f(s(i-1,t), s(i,t), s(i+1,t))

Where f is the rule function mapping the 3-tuple of states to a new state.

IMPLEMENTATION EXERCISE:
1. On your graph paper, implement Rule 30 starting from a single "on" cell
2. Continue for at least 25 generations
3. Analyze the resulting pattern:
   - Identify regions of order and chaos
   - Note any repeating subpatterns
   - Calculate the pattern's approximate entropy

COMPUTATIONAL CLASSIFICATION:
Stephen Wolfram classified ECAs into four classes:
- Class 1: Evolution leads to a homogeneous state
- Class 2: Evolution leads to simple periodic patterns
- Class 3: Evolution leads to chaotic, aperiodic patterns
- Class 4: Evolution leads to complex patterns with long-lived structures

Which class does Rule 30 belong to? _______________
Provide evidence for your classification: _______________

ALTERNATIVE RULES ANALYSIS:
Implement Rule 90 (binary 01011010) for 20 generations.

What geometric pattern emerges? _______________
Can you express this pattern mathematically? _______________

Implement Rule 110 (binary 01101110) for 20 generations.

What significant property does Rule 110 possess? _______________
What evidence of this property can you observe? _______________

THEORETICAL EXTENSION:
Consider how 1D cellular automata relate to:
- Formal language theory: _______________
- Computational complexity: _______________
- Chaos theory: _______________
```

