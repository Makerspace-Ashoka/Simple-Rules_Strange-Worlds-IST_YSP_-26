// VisualDemo.jsx - Interactive demonstrations for various concepts
import React, { useState, useEffect, useRef } from 'react';
import styles from './VisualDemo.module.css';

const VisualDemo = ({
  type,
  width = 300,
  height = 200,
  resolution = 20,
  pattern = null,
  grid = null,
  samples = 50,
  steps = 10,
  speed = 1
}) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [gridState, setGridState] = useState([]);

  // Setup function for different demo types
  useEffect(() => {
    const setupDemo = () => {
      switch (type) {
        case 'grid-creation':
          return setupGridCreation();
        case 'nested-loops':
          return setupNestedLoops();
        case 'random-distribution':
          return setupRandomDistribution();
        case 'array-modification':
          return setupArrayModification();
        case 'create-2d-array':
          return setupCreate2DArray();
        case 'grid-wrapping':
          return setupGridWrapping();
        case 'nested-loops-grid':
          return setupNestedLoopsGrid();
        case 'pattern':
          return setupPattern();
        case 'neighbors':
          return setupNeighbors();
        default:
          return null;
      }
    };

    setupDemo();

    // Animation loop for dynamic visualizations
    let animationId;
    if (isPlaying) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [type, isPlaying, currentStep]);

  // Animation function
  const animate = () => {
    // Animation logic would go here based on demo type
    // For example, stepping through grid creation or looping visualization
    setCurrentStep(prev => (prev + 1) % steps);
  };

  // Setup functions for different demos
  const setupGridCreation = () => {
    // Visual demonstration of creating a 2D grid
    const cols = Math.floor(width / resolution);
    const rows = Math.floor(height / resolution);
    const newGridState = Array(steps).fill().map((_, step) => {
      // For each step, show a different stage of grid creation
      const grid = [];
      for (let i = 0; i < cols; i++) {
        if (i <= (step * cols / steps)) {
          grid[i] = Array(rows).fill().map((_, j) => {
            if (j <= (step * rows / steps)) return 0;
            return null; // Not yet created
          });
        }
      }
      return grid;
    });
    setGridState(newGridState);
  };

  const setupNestedLoops = () => {
    // Visual demonstration of nested loops iteration
    const { rows, cols } = grid || { rows: 5, cols: 5 };
    const totalCells = rows * cols;
    const stepsPerCell = steps / totalCells;

    const newGridState = Array(steps).fill().map((_, step) => {
      const grid = Array(cols).fill().map(() => Array(rows).fill(0));
      const visitedCells = Math.floor(step / stepsPerCell);

      for (let idx = 0; idx <= visitedCells; idx++) {
        const i = Math.floor(idx / rows);
        const j = idx % rows;
        if (i < cols && j < rows) {
          grid[i][j] = 1; // Visited
        }
      }
      return grid;
    });
    setGridState(newGridState);
  };

  // Render function based on demo type
  const renderDemo = () => {
    switch (type) {
      case 'grid-creation':
      case 'nested-loops':
      case 'nested-loops-grid':
      case 'grid-wrapping':
        return renderGridDemo();
      case 'random-distribution':
        return renderRandomDistribution();
      case 'array-modification':
        return renderArrayModification();
      case 'create-2d-array':
        return renderCreate2DArray();
      case 'pattern':
        return renderPattern();
      case 'neighbors':
        return renderNeighbors();
      default:
        return <div>Unknown demo type</div>;
    }
  };

  // Render a grid-based demo
  const renderGridDemo = () => {
    const currentGrid = gridState[currentStep] || [];

    return (
      <div className={styles.demoContainer}>
        <div className={styles.grid}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            gridTemplateColumns: `repeat(${currentGrid.length}, 1fr)`
          }}>
          {currentGrid.map((col, i) =>
            col.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  ${styles.cell}
                  ${cell === 1 ? styles.visited : ''}
                  ${cell === 0 ? styles.empty : ''}
                  ${cell === null ? styles.notCreated : ''}
                `}
              />
            ))
          )}
        </div>

        <div className={styles.controls}>
          <button
            className={styles.playButton}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸ Pause' : '▶️ Play'}
          </button>

          <input
            type="range"
            min="0"
            max={steps - 1}
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>
    );
  };

  // Simplified render for other demo types
  const renderRandomDistribution = () => {
    // A visualization showing random distribution
    return <div>Random Distribution Demo (implementation simplified for example)</div>;
  };

  const renderArrayModification = () => {
    // A visualization showing array modification
    return <div>Array Modification Demo (implementation simplified for example)</div>;
  };

  const renderCreate2DArray = () => {
    // A visualization showing 2D array creation
    return <div>2D Array Creation Demo (implementation simplified for example)</div>;
  };

  const renderPattern = () => {
    // A visualization showing a specific pattern
    return <div>Pattern Demo: {pattern} (implementation simplified for example)</div>;
  };

  const renderNeighbors = () => {
    // A visualization showing cell neighbors
    return <div>Cell Neighbors Demo (implementation simplified for example)</div>;
  };

  return (
    <div className={styles.visualDemoContainer}>
      {renderDemo()}
    </div>
  );
};

export default VisualDemo;


