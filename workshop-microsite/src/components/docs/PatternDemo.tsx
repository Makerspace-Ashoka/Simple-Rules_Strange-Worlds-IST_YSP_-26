import React, { useState, useEffect, useRef } from 'react';
import styles from './PatternDemo.module.css';

type PatternType = 'blinker' | 'glider' | 'pulsar' | 'checkerboard' | 'random' | string;

interface PatternDemoProps {
  pattern: PatternType;
  steps?: number;
  speed?: number;
  size?: number;
  cellSize?: number;
  caption?: string;
  autoPlay?: boolean;
}

/**
 * A component that demonstrates Conway's Game of Life patterns
 *
 * @param pattern - The pattern to demonstrate
 * @param steps - Number of generations to pre-compute
 * @param speed - Animation speed (frames per second)
 * @param size - Size of the grid (number of cells)
 * @param cellSize - Size of each cell in pixels
 * @param caption - Optional caption for the demonstration
 * @param autoPlay - Whether to automatically play the animation
 */
const PatternDemo: React.FC<PatternDemoProps> = ({
  pattern,
  steps = 10,
  speed = 2,
  size = 20,
  cellSize = 12,
  caption,
  autoPlay = true
}) => {
  const [grid, setGrid] = useState<number[][][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const animationRef = useRef<number>(0);
  const lastUpdateTime = useRef(0);

  // Initialize the grid with the selected pattern
  useEffect(() => {
    // Create initial grid based on pattern
    const initialGrid = createInitialGrid(pattern, size);

    if (initialGrid) {
      // Pre-compute all steps to show in the animation
      const allSteps = [initialGrid];
      let currentGrid = initialGrid;

      for (let i = 1; i < steps; i++) {
        currentGrid = computeNextGeneration(currentGrid);
        allSteps.push(currentGrid);
      }

      setGrid(allSteps);
      setCurrentStep(0);
      setIsPlaying(autoPlay);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pattern, steps, size, autoPlay]);

  // Animation loop
  useEffect(() => {
    if (!grid.length) return;

    const animate = (timestamp: number) => {
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
  }, [isPlaying, steps, speed, grid.length]);

  // Create initial grid based on pattern name
  const createInitialGrid = (patternName: PatternType, gridSize: number): number[][] => {
    const grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    const center = Math.floor(gridSize / 2);

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

        // Offset to center
        const offset = center - 8;
        positions.forEach(([i, j]) => {
          const row = i + offset;
          const col = j + offset;
          if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            grid[row][col] = 1;
          }
        });
        break;

      case 'checkerboard':
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            grid[i][j] = (i + j) % 2;
          }
        }
        break;

      case 'random':
      default:
        // Random pattern with 30% live cells
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            grid[i][j] = Math.random() < 0.3 ? 1 : 0;
          }
        }
    }

    return grid;
  };

  // Compute next generation of cells (Game of Life rules)
  const computeNextGeneration = (currentGrid: number[][]): number[][] => {
    const rows = currentGrid.length;
    const cols = currentGrid[0].length;
    const newGrid = Array(rows).fill(0).map(() => Array(cols).fill(0));

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

        // Apply Conway's rules
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
              gridTemplateRows: `repeat(${grid[currentStep].length}, ${cellSize}px)`,
              gridTemplateColumns: `repeat(${grid[currentStep][0].length}, ${cellSize}px)`
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
            if (isPlaying) setIsPlaying(false);
          }}
          className={styles.slider}
        />

        <div className={styles.generationLabel}>
          Generation: {currentStep}
        </div>
      </div>

      {caption && (
        <div className={styles.caption}>{caption}</div>
      )}
    </div>
  );
};

export default PatternDemo;

