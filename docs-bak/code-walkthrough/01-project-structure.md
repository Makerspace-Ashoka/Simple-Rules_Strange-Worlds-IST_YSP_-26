---
sidebar_position: 1
sidebar_label: '01: Project Structure'
---

# Part 1: Understanding the Project Structure

### Exploring the Codebase
**Activity 1.1:** Before diving into specific code, take 5 minutes to browse through all the files. As you look, jot down:
- What seems to be the purpose of each file?
- How do you think the files might be connected?
- What patterns do you notice in how the code is organised?

**Reflection 1.2:** After exploring, what do you think is the relationship between these files?
- `sketch.js`
- `gameLogic.js`
- `grid.js`

<details>
<summary>Discussion Points</summary>
<ul>
<li><code>sketch.js</code> contains the main p5.js functions (<code>setup()</code> and <code>draw()</code>) that control the program flow</li>
<li><code>gameLogic.js</code> implements Conway's Game of Life rules and handles calculating state changes</li>
<li><code>grid.js</code> manages the grid data structure and operations on it</li>
<li>This separation of concerns is a key software design principle that makes code more maintainable</li>
</ul>
</details>

**Activity 1.3:** In `index.html`, find where the JavaScript files are loaded. What happens if you change the order of these script tags? Make a prediction, then try it.

<details>
<summary>Insight</summary>
The order matters because files loaded later can use functions defined in files loaded earlier. If a file tries to use a function that hasn't been loaded yet, you'll get an error.
</details>

