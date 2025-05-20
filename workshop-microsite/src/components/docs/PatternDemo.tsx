// PatternDemo.jsx - Game of Life pattern demonstration
import React, { useState, useEffect, useRef } from 'react';
import styles from './PatternDemo.module.css';

const PatternDemo = ({ pattern, steps = 5, speed = 1 }) => {
  const [grid, setGrid] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationRef = useRef();
  const lastUpdateTime = useRef(0);

  // Initialize the grid with the selected pattern
  useEffect(() => {
    const initialGrid = createInitialGrid(pattern);
    if (initialGrid) {
      // Pre-compute all steps to show in the animation
      const allSteps = [initialGrid];
      let currentGrid = initialGrid;

      for (let i = 1; i < steps; i++) {
        currentGrid = computeNextGeneration(currentGrid);
        allSteps.push(currentGrid);
      }

      setGrid(allSteps);
    }
  }, [pattern, steps]);

  // Animation loop
  useEffect(() => {
    const animate = (timestamp) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;

      const elapsed = timestamp - lastUpdateTime.current;
      const frameInterval = 1000 / (speed * 2); // Control animation speed

      if (elapsed > frameInterval) {
        lastUpdateTime.current = timestamp;
        if (isPlaying) {
          setCurrentStep((prevStep) => (prevStep + 1) % steps);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, steps, speed]);

  // Create initial grid based on pattern name
  const createInitialGrid = (patternName) => {
    const size = 20; // Default grid size
    const grid = Array(size).fill().map(() => Array(size).fill(0));
    const center = Math.floor(size / 2);

    // Add cells based on pattern
    switch (patternName) {
      case 'blinker':
        grid[center][center - 1] = 1;
        grid[center][center] = 1;
        grid[center][center + 1] = 1;
        break;
      case 'glider':
        grid[center - 1][center] = 1;
        grid[center][center + 1] = 1;
        grid[center + 1][center - 1] = 1;
        grid[center + 1][center] = 1;
        grid[center + 1][center + 1] = 1;
        break;
      case 'pulsar':
        // Pulsar pattern (period 3 oscillator)
        const positions = [
          [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12],
          [4, 2], [4, 7], [4, 9], [4, 14],
          [5, 2], [5, 7], [5, 9], [5, 14],
          [6, 2], [6, 7], [6, 9], [6, 14],
          [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12],
          [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12],
          [10, 2], [10, 7], [10, 9], [10, 14],
          [11, 2], [11, 7], [11, 9], [11, 14],
          [12, 2], [12, 7], [12, 9], [12, 14],
          [14, 4], [14, 5], [14, 6], [14, 10], [14, 11], [14, 12]
        ];
        positions.forEach(([i, j]) => {
          grid[i][j] = 1;
        });
        break;
      case 'checkerboard':
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            grid[i][j] = (i + j) % 2;
          }
        }
        break;
      case 'vertical-stripes':
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            grid[i][j] = i % 3 === 0 ? 1 : 0;
          }
        }
        break;
      case 'horizontal-stripes':
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            grid[i][j] = j % 3 === 0 ? 1 : 0;
          }
        }
        break;
      default:
        // Random pattern
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            grid[i][j] = Math.random() < 0.3 ? 1 : 0;
          }
        }
    }

    return grid;
  };

  // Compute next generation of cells (Game of Life rules)
  const computeNextGeneration = (currentGrid) => {
    const rows = currentGrid.length;
    const cols = currentGrid[0].length;
    const newGrid = Array(rows).fill().map(() => Array(cols).fill(0));

    // Apply Game of Life rules
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const state = currentGrid[i][j];
        let neighbors = 0;

        // Count neighbors (including wrapping)
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;

            const ni = (i + di + rows) % rows;
            const nj = (j + dj + cols) % cols;

            neighbors += currentGrid[ni][nj];
          }
        }

        // Apply rules
        if (state === 1) {
          newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          newGrid[i][j] = neighbors === 3 ? 1 : 0;
        }
      }
    }

    return newGrid;
  };

  return (
    <div className={styles.patternDemoContainer}>
      <div className={styles.gridContainer}>
        {grid.length > 0 && grid[currentStep] && (
          <div
            className={styles.grid}
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${grid[currentStep].length}, 12px)`,
              gridTemplateColumns: `repeat(${grid[currentStep][0].length}, 12px)`
            }}
          >
            {grid[currentStep].map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`${styles.cell} ${cell ? styles.alive : styles.dead}`}
                />
              ))
            )}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.playButton}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>

        <input
          type="range"
          min="0"
          max={steps - 1}
          value={currentStep}
          onChange={(e) => {
            setCurrentStep(parseInt(e.target.value));
            if (!isPlaying) setIsPlaying(true);
          }}
          className={styles.slider}
        />

        <div className={styles.generationLabel}>
          Generation: {currentStep}
        </div>
      </div>
    </div>
  );
};

export default PatternDemo;
