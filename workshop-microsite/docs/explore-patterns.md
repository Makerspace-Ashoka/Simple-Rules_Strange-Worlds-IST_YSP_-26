---
sidebar_position: 3
sidebar_label: "2D Automata"
---

# Discovering Cellular Automata through Conway's Game of Life

## Welcome to Your Game of Life Adventure!

You're about to embark on an exploration of Conway's Game of Life - a world where simple rules create astonishingly complex behaviors. Unlike typical games, this "zero-player game" invented by mathematician John Conway in 1970 evolves on its own once you set up the initial conditions.

:::tip Fun Fact
Conway initially offered a $50 prize to anyone who could create a pattern that would grow indefinitely. The prize was claimed within months!
:::

## The Discovery Approach

This isn't a typical worksheet where we tell you what to do step by step. Instead, we're inviting you to be a **pattern researcher** - observing, experimenting, making predictions, and discovering the amazing world of cellular automata yourself!

## The Living Grid

Before jumping into pre-made patterns, spend some time exploring on your own:

1. **Create random patterns** (use the "Random" button)
2. **Watch what happens** over multiple generations
3. **Click on individual cells** to create your own starting patterns
4. **Start developing your own classification system** for behaviors you observe

**Group Activity**: With a partner, create 5 different small patterns (3-6 cells each). Compare what happens to each and discuss any patterns you notice in how they evolve.

## Your Research Journal

Scientists document their discoveries. Use this journal format to record yours:

```
PATTERN RESEARCH JOURNAL

PATTERN NAME: ________________
(Give your discovery a creative name!)

INITIAL CONFIGURATION:
[Draw or describe the pattern here]

OBSERVED BEHAVIOR:
□ Disappeared completely after ___ generations
□ Stabilized into still pattern(s) after ___ generations
□ Repeats in a cycle every ___ generations
□ Moves across the grid
□ Grows indefinitely
□ Other: ___________________

MY ANALYSIS:
Why does this pattern behave this way? What's happening with the neighbors of each cell?

CONNECTION TO CODE:
How does this behavior connect to the rules in gameLogic.js?

REAL-WORLD PARALLEL:
Does this pattern or behavior remind you of anything in nature or society?
```

## Look Under the Hood: Code Connections

Our Game of Life simulation is built from several JavaScript files. As you explore patterns, look at how they're implemented:

**Key Coding Concept**:
The essence of Conway's Game of Life is counting neighbors and applying rules. When we code this simulation, we'll need to:

1. Count how many live neighbors each cell has
2. Apply the four rules to determine each cell's next state
3. Update all cells simultaneously

**Thinking Algorithmically**:
Without seeing the code yet, can you sketch a flowchart or pseudocode for how you would implement the four Game of Life rules?

```
PSEUDOCODE CHALLENGE:

For each cell in grid:
   1. Count live neighbors
   2. Apply these rules:
      - ?
      - ?
      - ?
      - ?
   3. Store the result in next_grid (don't update the original grid yet!)

After checking all cells, update original grid with next_grid values
```

Fill in the missing rules in your pseudocode. In the second half of the workshop, you'll implement these rules in actual code!

## Emergent Behaviors: Discovering Pattern Types

As you explore, you'll likely notice patterns fall into categories. See if you can discover these classifications before reading the descriptions below!

### Pattern Gallery: Reference When You Need It

#### Still Lifes
Patterns that don't change from generation to generation. Can you figure out why they remain stable?

**Block:**
```
XX
XX
```
:::tip Fun Fact
Block is one of the first patterns discovered in 1970 during Conway's early explorations
:::

**Beehive:**
```
··XX·
X··X
·XX·
```
:::tip Fun Fact
Beehive was discovered in 1970, and is one of the most common naturally occurring patterns
:::

**Loaf:**
```
··XX
X··X
·X·X
··X·
```

**Boat:**
```
·XX
X·X
·X·
```

**Code Connection**: During your exploration, notice how the patterns in `patterns.js` are defined as 2D arrays:

```javascript
// This is how a glider pattern is defined in code:
const gliderPattern = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
];
```

**Investigation Question**: How does this array representation map to the visual pattern of a glider? Draw it out to see the connection.

#### Oscillators
Patterns that repeat in cycles. Try creating one before looking at examples!

**Blinker** (Period 2):
```
···
XXX
···
```

**Toad** (Period 2):
```
·XXX
XXX·
```

**Beacon** (Period 2):
```
XX··
XX··
··XX
··XX
```

**Group Investigation**: With a partner, analyze a still life. Count the neighbors for every live cell and every dead cell adjacent to the pattern. How do the rules maintain its stability?

#### Spaceships
The most fascinating discovery - patterns that move across the grid!

**Glider:**
```
·X·
··X
XXX
```
:::tip Fun Fact
Discovered by Richard K. Guy in 1969 while tracking the R-pentomino's evolution
:::

**Light Weight Spaceship (LWSS):**
```
·XX··
XXXX·
XX·XX
·XXX·
```

**Heavy Weight Spaceship (HWSS):**
```
···XX··
·X····X
X······
X·····X
XXXXXX·
```

**Visualization Activity**: Create a step-by-step visualization of how a blinker transforms:
- For each live cell, count and note the number of neighbors
- For each dead cell adjacent to the pattern, count and note the number of neighbors
- Apply the four rules to determine each cell's next state
- Draw the resulting pattern, and repeat the process

## Pattern Interactions Lab

Patterns don't exist in isolation - they interact! Set up experiments to discover:

1. **Pattern Collisions**: What happens when a glider collides with a still life?
2. **Pattern Synthesis**: Can you create a specific pattern by colliding multiple patterns?
3. **Pattern Transmutation**: Can one pattern transform into another through interactions?

**Collaborative Research**: Form a research team of 3-4 people. Each person creates a different pattern on different parts of the grid, then run the simulation to see the complex interactions.

## Real-World Connections: Beyond the Grid

Cellular automata aren't just fascinating mathematical curiosities - they model real-world phenomena:

- **Biology**: Cell growth, bacterial colony formation, spread of forest fires
- **Physics**: Crystal formation, fluid dynamics, reaction-diffusion systems
- **Social Science**: Population distribution, urban development, spread of ideas

**Discussion Question**: What real-world process does the Game of Life remind you of? How is it similar and different?

## Modifying the Universe: Designing Your Own Rules

In the second half of our workshop, you'll be coding the Game of Life from scratch! You'll implement the counting of neighbors and the four rules that determine whether cells live or die.

**Prediction Exercise**: Before coding, think about how you would implement:
1. A function to count a cell's neighbors
2. A function to apply the Game of Life rules
3. What would happen if you changed the rules slightly?

**Design Your Own Rules**: Once you've implemented Conway's original rules, what creative variations might you try?
- What if cells needed 4 neighbors to be born instead of 3?
- What if cells with 4 neighbors survived instead of died?
- What if there were three cell states instead of two?

Record your predictions about how these rule changes would affect pattern behavior!

## Knowledge-Building Community

Constructing knowledge together is more powerful than working alone:

1. **Pattern Exchange**: Create a pattern and share it with a classmate. See if they can predict its behavior before running the simulation.

2. **Code Jam**: In pairs, one person describes a pattern behavior they want to create, and the other suggests initial configurations that might produce it.

3. **Gallery Walk**: Set up your most interesting pattern and let it run. Walk around to see what others have discovered.

4. **Research Conference**: At the end of the exploration, each team presents their most interesting discovery to the class.

## Beyond Conway: Advanced Extensions

If you're moving quickly, explore these advanced topics:

#### Methuselahs & Growth Patterns

- **Methuselahs**: Tiny patterns that evolve for many generations before stabilizing
  - Try the "R-pentomino": a small pattern that evolves for 1103 generations
  ```
  ·XX
  XX·
  ·X·
  ```
  :::tip Fun Fact
  Discovered early in Conway's research; its surprising longevity was one of the first hints at Life's complexity
  :::
  - "Diehard": A 7-cell pattern that disappears after 130 generations
  ```
  ······X·
  XX······
  ·X···XXX
  ```

- **Puffer Trains**: Patterns that move and leave behind debris

- **Guns**: Patterns that periodically emit spaceships
  - The "Gosper Glider Gun" was the first pattern proven to grow indefinitely
  :::tip Fun Fact
  Created by Bill Gosper in 1970 to disprove Conway's conjecture that no patterns could grow indefinitely; the first pattern with unbounded growth
  :::

- **Turing Completeness**: How patterns in the Game of Life can compute anything computable
  - Look up how logic gates (AND, OR, NOT) can be built using gliders

## Metacognition Corner: Reflect on Your Learning

Take a moment to think about your thinking:

1. What surprised you most during your exploration?
2. What strategies did you use to predict pattern behavior?
3. How did collaborating with others enhance your understanding?
4. What connections did you make between the code and the visual behavior?
5. How has this changed your understanding of how complex systems emerge from simple rules?

---

## The Nature of Discovery

Remember, in this exploration there are no "right" or "wrong" answers - only discoveries! The Game of Life mirrors the scientific process: observe, hypothesize, experiment, analyze, and share.

As mathematician Stanisław Ulam said about cellular automata: "Ask not what mathematics can do for biology, ask what biology can do for mathematics."

What will YOU discover today?

