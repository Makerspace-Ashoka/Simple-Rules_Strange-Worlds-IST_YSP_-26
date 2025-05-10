## Rule Reference Card

```
ELEMENTARY CELLULAR AUTOMATA: RULE REFERENCE

HOW RULES WORK:
Each rule number (0-255) defines a different pattern evolution.
The rule number can be converted to binary (8 digits),
which specifies the output for each possible 3-cell pattern.

RULE NUMBERING SYSTEM:
Convert the rule number to binary (8 digits):

Rule 30 = 00011110 in binary

Each digit determines the output for a specific neighborhood:

| Pattern:   | 111 | 110 | 101 | 100 | 011 | 010 | 001 | 000 |
| Binary idx:|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
| Rule 30:   |  0  |  0  |  0  |  1  |  1  |  1  |  1  |  0  |

NOTABLE RULES:

RULE 30 ◆◆◆◆◆
Pattern: Random-looking, chaotic
Binary: 00011110
Note: Used by Wolfram to generate random numbers

RULE 90 ◆◆◆◆
Pattern: Sierpinski triangle fractal
Binary: 01011010
Note: XOR rule - each new cell is XOR of left and right neighbors

RULE 110 ◆◆◆◆◆
Pattern: Complex mix of order and chaos
Binary: 01101110
Note: Proven to be Turing complete (can compute anything)

RULE 184 ◆◆◆
Pattern: Directed motion of particles
Binary: 10111000
Note: Models traffic flow, with "cars" moving from left to right

RULE 60 ◆◆◆
Pattern: Asymmetric triangular structures
Binary: 00111100

RULE 150 ◆◆◆◆
Pattern: Nested, fractal-like patterns
Binary: 10010110
Note: Related to Rule 90 but with center cell included

RULE 225 ◆◆
Pattern: Majority rule
Binary: 11100001
Note: New cell is 1 if majority of neighbors are 1

RULE 22 ◆◆◆
Pattern: Complex, aperiodic structures
Binary: 00010110
```

