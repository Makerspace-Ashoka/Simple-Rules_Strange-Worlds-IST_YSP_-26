/**
 * 1D Cellular Automaton - Advanced Template
 * For Grades 11-12
 *
 * This template provides a starting structure, but you'll need to
 * implement the core functionality yourself. This advanced template
 * encourages efficient implementation and creative extensions.
 */

// TODO: Declare necessary variables to manage:
// - Current and next generation of cells
// - Cell display size
// - Current row position
// - Rule number
// - Animation state
// - Any other variables you need

/**
 * Initialize your simulation
 */
function setup() {
  // TODO: Initialize the canvas and variables
  // - Create a canvas of appropriate size
  // - Initialize cell arrays
  // - Set up initial pattern
  // - Create UI elements for control
  // HINT: You'll need to create:
  // - Reset button
  // - Pause/play button
  // - Rule selector
  // - Optional: Color controls, speed control, etc.
}

/**
 * Main animation loop
 */
function draw() {
  // TODO: Implement the main animation loop
  // - Check if animation should continue (not paused, not filled canvas)
  // - Calculate next generation
  // - Draw the current cells
  // - Update row counter
  // HINT: Think about efficient ways to update the display
  // without redrawing everything each frame
}

/**
 * Draw the current generation
 */
function drawCells() {
  // TODO: Implement a function to draw the current generation
  // - Decide on a color scheme
  // - Draw each cell that is "alive" (state = 1)
  // HINT: Consider visual enhancements like:
  // - Color gradients based on rule or position
  // - Anti-aliasing or smoothing for better visuals
  // - Different shapes or sizes for cells
}

/**
 * Calculate the next generation based on the current one
 */
function calculateNextGen() {
  // TODO: Implement the cellular automaton rules
  // - Process each cell in the current generation
  // - Apply rules to determine next state
  // - Handle edge cases
  // HINT: Think about efficient ways to handle array updates
  // without creating unnecessary copies
}

/**
 * Apply the rule to determine the next state of a cell
 *
 * @param {number} left - State of the left neighbor (0 or 1)
 * @param {number} center - State of the current cell (0 or 1)
 * @param {number} right - State of the right neighbor (0 or 1)
 * @param {number} ruleNumber - The rule to apply (0-255)
 * @return {number} The new state of the cell (0 or 1)
 */
function applyRule(left, center, right, ruleNumber) {
  // TODO: Implement the rule application
  // - Convert the three neighboring cells to an index (0-7)
  // - Use the rule number to determine the output state
  // - Return 0 or 1 as the new state
  // HINT: Think about how bitwise operations can simplify this
}

/**
 * Reset the simulation to its initial state
 */
function reset() {
  // TODO: Implement the reset functionality
  // - Reset row counter
  // - Reinitialize cell arrays
  // - Set initial pattern
  // - Clear canvas
}

/**
 * You can add additional functions as needed
 * Some ideas:
 * - Rule visualization
 * - Pattern generation
 * - Data export
 * - Interactive controls
 */

// EXTENSION CHALLENGES:
// 1. Implement multiple rule sets that can be switched between
// 2. Add visualization of the rule itself (show all 8 possible patterns)
// 3. Optimize performance to handle larger grids
// 4. Add interactive features (mouse drawing, etc.)
// 5. Create a 2D cellular automaton variant
