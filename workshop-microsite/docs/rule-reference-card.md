---
sidebar_position: 7
sidebar_label: '1D Automata | Rule Reference Card'
---

# 1D Cellular Automata: Rule Reference Card

## Understanding Rule Numbers

Every elementary cellular automaton is defined by a rule number between 0-255. This number encodes how each possible 3-cell neighborhood will evolve.

### How Rule Numbers Work:

```
1️⃣ Convert rule number to binary (8 digits)
   Example: Rule 30 = 00011110

2️⃣ Each binary digit determines the output for a specific 3-cell pattern:

   Neighborhood:  111  110  101  100  011  010  001  000
                   ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
   Rule 30:        0    0    0    1    1    1    1    0
                   ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
   Binary position: 7    6    5    4    3    2    1    0
```

### Implementation Process:

1. For each cell position, identify the 3-cell pattern above it
2. Find this pattern in the lookup table for your rule
3. Fill in the corresponding output value (0=white, 1=black)
4. For edge cells, assume cells beyond the edge are white (0)

---

## Rule Classification (Wolfram's Classes)

| Class | Behavior | Examples |
|-------|----------|----------|
| **Class 1** | Evolves to uniform state | Rules 0, 32, 160 |
| **Class 2** | Evolves to simple, stable patterns | Rules 4, 108, 218 |
| **Class 3** | Produces chaotic, random-like patterns | Rules 30, 45, 90 |
| **Class 4** | Creates complex, structured patterns | Rules 54, 110, 124 |

---

## Notable Rules (With Pattern Examples)

### RULE 30 (Class 3) ★★★★★
```
Binary: 00011110
         ·
        ···
       ··· ·
      ·· ····
     ·······
```
**Properties**: Chaotic, random-appearing pattern
**Used for**: Random number generation
**Implementation tip**: Pattern grows asymmetrically

### RULE 90 (Class 3) ★★★★
```
Binary: 01011010
         ·
        · ·
       ·   ·
      · · · ·
     ·       ·
```
**Properties**: Creates perfect Sierpinski triangle
**Mathematical basis**: XOR of left and right neighbors only
**Implementation tip**: Ignores center cell completely

### RULE 110 (Class 4) ★★★★★
```
Binary: 01101110
         ·
        ··
       ···
      ··
     ····
```
**Properties**: Complex mix of stable structures and chaos
**Significance**: Proven to be Turing complete (can compute anything)
**Implementation tip**: Look for persistent structures moving left-to-right

### RULE 184 (Class 2) ★★★
```
Binary: 10111000
        ······
        ·····
        ····
        ···
        ··
```
**Properties**: Particles move directionally
**Models**: Traffic flow systems
**Implementation tip**: Watch how "particles" merge and separate

### RULE 150 (Class 3) ★★★★
```
Binary: 10010110
         ·
        ···
       ·· ··
      ······
     ·      ·
```
**Properties**: Complex nested patterns
**Mathematical basis**: XOR of all three cells (left, center, right)
**Relationship**: Combination of Rules 90 and 60

### RULE 22 (Class 3) ★★★
```
Binary: 00010110
         ·
        ···
       ·· ··
      ·······
     ··     ··
```
**Properties**: Aperiodic, complex behavior
**Implementation tip**: Creates triangular structures that interact in complex ways

---

## Implementation Checklist

```md
□ Convert your rule number to 8-digit binary
□ Create a lookup table for all 8 possible patterns
□ Start with a single black cell in the middle of your first row
□ For each new row:
  □ Examine each 3-cell neighborhood in the previous row
  □ Apply the appropriate rule from your lookup table
  □ Fill in the corresponding cell in the current row
□ Continue for at least 20 generations to observe meaningful patterns
```

---

## Troubleshooting Tips

* **Problem**: Pattern looks incorrect or different from examples
  **Solution**: Double-check your binary conversion and lookup table

* **Problem**: Unsure how to handle edge cells
  **Solution**: Treat cells beyond the edge as white (0)

* **Problem**: Pattern hits edge of paper too quickly
  **Solution**: Start with smaller cells or use landscape orientation

* **Problem**: Hard to keep track of neighborhood patterns
  **Solution**: Create a small window template from paper to isolate each 3-cell group
