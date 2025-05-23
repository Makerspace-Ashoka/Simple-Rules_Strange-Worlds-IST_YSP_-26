---
sidebar_position: 4
sidebar_label: '04: User Interaction'
---

# Part 4: User Interaction

### UI Controls
**Question 4.1:** What user controls are available in the Game of Life simulation? Find where they're created in the code.

<details>
<summary>Available Controls</summary>
Controls are created in the <code>createButtons()</code> function in <code>ui.js</code> and include:
<ul>
<li>Play/Pause button: Toggles the simulation</li>
<li>Step button: Advances one generation</li>
<li>Clear button: Sets all cells to dead</li>
<li>Random button: Creates a random pattern</li>
<li>Speed slider: Controls animation speed</li>
<li>Pattern buttons: Places predefined patterns</li>
</ul>
</details>

**Think Deeper 4.2:** How does clicking the Play/Pause button affect the simulation? Trace the code execution from button click to simulation behaviour.

<details>
<summary>Control Flow</summary>
When the Play/Pause button is clicked:
<ol>
<li>The <code>mousePressed</code> event triggers the <code>toggleSimulation()</code> function</li>
<li><code>toggleSimulation()</code> flips the <code>isRunning</code> variable</li>
<li>In the <code>draw()</code> function, the <code>if (isRunning)</code> condition now evaluates differently</li>
<li>When <code>isRunning</code> is true, the simulation advances each frame; when false, it stays paused</li>
</ol>
</details>

### Pattern Creation
**Question 4.3:** Examine the `patterns.js` file. How are the predefined patterns structured?

<details>
<summary>Pattern Structure</summary>
Patterns are defined as 2D arrays where:
<ul>
<li>1 represents a live cell</li>
<li>0 represents a dead cell</li>
</ul>
For example, the glider pattern is:
<pre>
[
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1]
]
</pre>
</details>

**Activity 4.4:** Design your own pattern! Create a 5×5 grid on paper and draw a pattern. Then translate it into code format like the examples in `patterns.js`.

<details>
<summary>Pattern Implementation Tip</summary>
To add your pattern to the simulation:
<ol>
<li>Define your pattern as a 2D array in <code>patterns.js</code></li>
<li>Add a new button in the <code>createPatternButtons()</code> function</li>
<li>Set up the button to call <code>placePattern()</code> with your pattern</li>
</ol>
</details>

