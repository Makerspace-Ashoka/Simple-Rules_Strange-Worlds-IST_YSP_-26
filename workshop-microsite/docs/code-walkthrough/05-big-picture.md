---
sidebar_position: 5
sidebar_label: '05: The Big Picture'
---

# Part 5: The Big Picture

### System Integration
**Question 5.1:** How do the different files in this project work together? Draw a diagram showing the relationships between the main functions.

<details>
<summary>System Architecture</summary>
<ul>
<li><code>sketch.js</code> controls the main program flow and coordinates other components</li>
<li><code>globals.js</code> provides shared variables</li>
<li><code>grid.js</code> manages grid data</li>
<li><code>gameLogic.js</code> implements evolution rules</li>
<li><code>display.js</code> handles visualisation</li>
<li><code>ui.js</code> manages user controls</li>
<li><code>patterns.js</code> provides predefined patterns</li>
</ul>
This is an example of "separation of concerns" - a key software design principle.
</details>

**Think Deeper 5.2:** Conway's Game of Life is Turing complete, meaning it can theoretically compute anything that any computer can. What does this tell you about complex systems emerging from simple rules?

<details>
<summary>Emergent Complexity</summary>
The Turing completeness of Conway's Game of Life demonstrates that incredibly complex behaviours, even universal computation, can emerge from very simple rules. This relates to many natural systems where complexity emerges from simple interactions (like ant colonies, neural networks, or even life itself). The principle that "the whole is greater than the sum of its parts" is powerfully illustrated through cellular automata.
</details>

### Extending the System
**Question 5.3:** If you wanted to add a new feature to the Game of Life, what files would you need to modify? Consider these potential features:
- Adding a population counter
- Creating a "speed up" button
- Implementing a colour gradient for cell age

<details>
<summary>Feature Implementation</summary>
<ul>
<li><b>Population counter:</b> Modify <code>display.js</code> to add counting logic and UI display</li>
<li><b>Speed up button:</b> Add to <code>ui.js</code> to create the button and handler function</li>
<li><b>Colour gradient for cell age:</b> Add a new global array in <code>globals.js</code>, update ages in <code>gameLogic.js</code>, and modify <code>display.js</code> to visualise them</li>
</ul>
</details>

**Final Activity:** Choose one of the features from Question 5.3 and implement it! Share your implementation with a peer and explain how you integrated it into the existing codebase.

## Conclusion
You've now explored Conway's Game of Life from multiple perspectives - understanding the data structures, algorithms, visualisation techniques, and user interaction. This seemingly simple system demonstrates how complex behaviours can emerge from basic rules - a concept that extends far beyond this simulation to fields like biology, economics, and social sciences.

As you continue working on the challenges, remember that the power of this system comes from the emergent properties that arise from simple rules applied over many iterations. This is the essence of cellular automata and many complex systems in our world.
