import React, { useState, useEffect, useRef } from 'react';
import styles from './VisualDemo.module.css';

// Demo type enum for better type safety
export enum DemoType {
  GRID_CREATION = 'grid-creation',
  NESTED_LOOPS = 'nested-loops',
  RANDOM_DISTRIBUTION = 'random-distribution',
  ARRAY_MODIFICATION = 'array-modification',
  CREATE_2D_ARRAY = 'create-2d-array',
  GRID_WRAPPING = 'grid-wrapping',
  NESTED_LOOPS_GRID = 'nested-loops-grid',
  PATTERN = 'pattern',
  NEIGHBORS = 'neighbors'
}

// More specific types
export interface GridDimensions {
  rows: number;
  cols: number;
}

// Cell types for better readability
export enum CellState {
  EMPTY = 0,
  VISITED = 1,
  HIGHLIGHTED = 2,
  NOT_CREATED = null
}

// Define a specific type for array operation items
interface ArrayOperationItem {
  value: number;
  operation: string | null;
}

// Define different grid state types
type CellGrid = (CellState | number)[][];
type HistogramGrid = number[][];
type ArrayGrid = ArrayOperationItem[];

// Combined type for all possible grid states
type GridState = (CellGrid | HistogramGrid | ArrayGrid)[];

export interface VisualDemoProps {
  type: DemoType;
  width?: number;
  height?: number;
  resolution?: number;
  pattern?: string;
  grid?: GridDimensions;
  samples?: number;
  steps?: number;
  speed?: number;
  autoPlay?: boolean;
}

/**
 * A component for visualizing programming concepts through interactive demonstrations
 */
const VisualDemo: React.FC<VisualDemoProps> = ({
  type,
  width = 300,
  height = 200,
  resolution = 20,
  pattern = null,
  grid = null,
  samples = 50,
  steps = 20,
  speed = 1,
  autoPlay = true
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);
  const [gridState, setGridState] = useState<GridState>([]);
  const animationRef = useRef<number>(0);
  const lastUpdateTime = useRef(0);

  // Setup the initial state based on demo type
  useEffect(() => {
    setupDemo();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, width, height, resolution, pattern, grid, samples, steps]);

  // Animation loop
  useEffect(() => {
    if (!gridState.length || !isPlaying) return;

    const animate = (timestamp: number) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;

      const elapsed = timestamp - lastUpdateTime.current;
      const frameInterval = 1000 / (speed * 2); // Control animation speed

      if (elapsed > frameInterval) {
        lastUpdateTime.current = timestamp;
        setCurrentStep(prev => (prev + 1) % steps);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, steps, speed, gridState.length]);

  // Unified setup function
  const setupDemo = () => {
    let newGridState: GridState = [];

    switch (type) {
      case DemoType.GRID_CREATION:
        newGridState = createGridCreationState();
        break;
      case DemoType.NESTED_LOOPS:
        newGridState = createNestedLoopsState();
        break;
      case DemoType.RANDOM_DISTRIBUTION:
        newGridState = createRandomDistributionState();
        break;
      case DemoType.ARRAY_MODIFICATION:
        newGridState = createArrayModificationState();
        break;
      case DemoType.CREATE_2D_ARRAY:
        newGridState = createCreate2DArrayState();
        break;
      case DemoType.GRID_WRAPPING:
        newGridState = createGridWrappingState();
        break;
      case DemoType.NESTED_LOOPS_GRID:
        newGridState = createNestedLoopsGridState();
        break;
      case DemoType.NEIGHBORS:
        newGridState = createNeighborsState();
        break;
      case DemoType.PATTERN:
        // Pattern demo has no state initialization
        newGridState = [];
        break;
    }

    setGridState(newGridState);
  };

  // Individual state generators (moved out for clarity)
  const createGridCreationState = (): CellGrid[] => {
    const cols = Math.floor(width / resolution);
    const rows = Math.floor(height / resolution);

    return Array(steps).fill(0).map((_, step) => {
      const grid: (CellState)[][] = Array(cols).fill(0).map(() =>
        Array(rows).fill(CellState.NOT_CREATED)
      );
      const completionRatio = (step + 1) / steps;

      const colsToShow = Math.floor(cols * completionRatio);
      const rowsToShow = Math.floor(rows * completionRatio);

      for (let i = 0; i < colsToShow; i++) {
        for (let j = 0; j < rowsToShow; j++) {
          grid[i][j] = CellState.EMPTY;
        }
      }

      return grid;
    });
  };

  const createNestedLoopsState = (): CellGrid[] => {
    const { rows = 5, cols = 5 } = grid || {};
    const totalCells = rows * cols;
    const cellsPerStep = Math.max(1, Math.ceil(totalCells / steps));

    return Array(steps).fill(0).map((_, step) => {
      const visitedCells = Math.min(totalCells, (step + 1) * cellsPerStep);
      const grid = Array(cols).fill(0).map(() => Array(rows).fill(CellState.EMPTY));

      for (let idx = 0; idx < visitedCells; idx++) {
        const i = Math.floor(idx / rows);
        const j = idx % rows;
        if (i < cols && j < rows) {
          grid[i][j] = CellState.VISITED;
        }
      }

      return grid;
    });
  };

  const createNestedLoopsGridState = (): CellGrid[] => {
    const { rows = 5, cols = 5 } = grid || {};

    return Array(steps).fill(0).map((_, step) => {
      const grid = Array(cols).fill(0).map(() => Array(rows).fill(CellState.EMPTY));
      const stepsPerRow = Math.ceil(steps / rows);
      const currentRow = Math.floor(step / stepsPerRow);
      const cellsInCurrentRow = (step % stepsPerRow) * Math.ceil(cols / stepsPerRow);

      // Fill complete rows
      for (let i = 0; i < currentRow; i++) {
        for (let j = 0; j < cols; j++) {
          grid[j][i] = CellState.VISITED;
        }
      }

      // Fill cells in current row
      for (let j = 0; j < cellsInCurrentRow; j++) {
        if (j < cols) {
          grid[j][currentRow] = CellState.VISITED;
        }
      }

      return grid;
    });
  };

  const createRandomDistributionState = (): HistogramGrid[] => {
    return Array(steps).fill(0).map((_, step) => {
      const grid = Array(10).fill(0).map(() => Array(10).fill(0));
      const sampleCount = Math.ceil(((step + 1) / steps) * samples);

      // Generate random samples
      for (let i = 0; i < sampleCount; i++) {
        const randomVal = Math.random();
        const col = Math.min(9, Math.floor(randomVal * 10));
        grid[col][0] = (grid[col][0] || 0) + 1;
      }

      return grid;
    });
  };

  const createArrayModificationState = (): ArrayGrid[] => {
    const initialArray = [10, 20, 30, 40, 50];
    const operations = [
      { type: 'initial', array: [...initialArray] },
      { type: 'change', array: [10, 25, 30, 40, 50], index: 1 },
      { type: 'add', array: [10, 25, 30, 40, 50, 60], index: 5 },
      { type: 'remove', array: [10, 25, 30, 50, 60], index: 3 },
      { type: 'insert', array: [10, 25, 35, 30, 50, 60], index: 2 }
    ];

    const stepsPerOperation = Math.floor(steps / operations.length);

    return Array(steps).fill(0).map((_, step) => {
      const opIndex = Math.min(operations.length - 1, Math.floor(step / stepsPerOperation));
      const { array, type, index } = operations[opIndex];

      // Create array to represent the operation - with proper typing
      return array.map((value, i) => ({
        value,
        operation: i === index ? type : null
      }));
    });
  };

  const createCreate2DArrayState = (): CellGrid[] => {
    const { rows = 3, cols = 4 } = grid || {};

    return Array(steps).fill(0).map((_, step) => {
      const completionRatio = (step + 1) / steps;
      const grid: (CellState)[][] = Array(cols).fill(0).map(() =>
        Array(rows).fill(CellState.NOT_CREATED)
      );

      // Phase 1: Create the outer array
      if (completionRatio < 0.2) {
        return grid;
      }

      // Phase 2: Create each row array
      const rowsToCreate = Math.floor(cols * Math.min(1, (completionRatio - 0.2) / 0.4));
      for (let i = 0; i < rowsToCreate; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = CellState.NOT_CREATED;
        }
      }

      // Phase 3: Fill with values
      if (completionRatio >= 0.6) {
        const cellsToFill = Math.floor(rows * cols * ((completionRatio - 0.6) / 0.4));
        let filled = 0;

        for (let i = 0; i < cols && filled < cellsToFill; i++) {
          for (let j = 0; j < rows && filled < cellsToFill; j++) {
            grid[i][j] = CellState.EMPTY;
            filled++;
          }
        }
      }

      return grid;
    });
  };

  const createGridWrappingState = (): CellGrid[] => {
    const gridSize = 7;
    const center = Math.floor(gridSize / 2);

    return Array(steps).fill(0).map((_, step) => {
      const grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(CellState.EMPTY));

      // Highlight a cell moving past the edge and wrapping around
      const progress = step / (steps - 1);
      let x, y;

      if (progress < 0.25) {
        // Move right
        x = Math.floor(center + (gridSize - center) * (progress * 4));
        y = center;
      } else if (progress < 0.5) {
        // Move down
        x = (gridSize - 1);
        y = Math.floor(center + (gridSize - center) * ((progress - 0.25) * 4));
      } else if (progress < 0.75) {
        // Move left
        x = Math.floor((gridSize - 1) - (gridSize - 1) * ((progress - 0.5) * 4));
        y = (gridSize - 1);
      } else {
        // Move up
        x = 0;
        y = Math.floor((gridSize - 1) - (gridSize - 1) * ((progress - 0.75) * 4));
      }

      // Wrap coordinates
      x = (x + gridSize) % gridSize;
      y = (y + gridSize) % gridSize;

      grid[x][y] = CellState.VISITED;

      // Show the wrapped coordinates
      if (x === 0) grid[gridSize - 1][y] = CellState.HIGHLIGHTED;
      if (x === gridSize - 1) grid[0][y] = CellState.HIGHLIGHTED;
      if (y === 0) grid[x][gridSize - 1] = CellState.HIGHLIGHTED;
      if (y === gridSize - 1) grid[x][0] = CellState.HIGHLIGHTED;

      return grid;
    });
  };

  const createNeighborsState = (): CellGrid[] => {
    const gridSize = 5;
    const center = Math.floor(gridSize / 2);

    return Array(steps).fill(0).map((_, step) => {
      const grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(CellState.EMPTY));

      // Place a cell in the center
      grid[center][center] = CellState.VISITED;

      // Highlight neighbors one by one
      if (step > 0) {
        const neighborPositions = [
          [center - 1, center - 1], [center - 1, center], [center - 1, center + 1],
          [center, center - 1], /* center */[center, center + 1],
          [center + 1, center - 1], [center + 1, center], [center + 1, center + 1]
        ];

        const highlightIndex = Math.min(neighborPositions.length - 1, step - 1);
        const [nx, ny] = neighborPositions[highlightIndex];
        grid[nx][ny] = CellState.HIGHLIGHTED;
      }

      return grid;
    });
  };

  // Component renderers
  const renderGridDemo = () => {
    if (!gridState.length || !gridState[currentStep]) {
      return <div className={styles.loading}>Loading visualization...</div>;
    }

    const currentGrid = gridState[currentStep] as CellGrid;

    return (
      <div className={styles.gridDemo}>
        <div
          className={styles.grid}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            gridTemplateColumns: `repeat(${currentGrid.length}, 1fr)`
          }}
        >
          {currentGrid.map((col, i) =>
            col.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  ${styles.cell}
                  ${cell === CellState.VISITED ? styles.visited : ''}
                  ${cell === CellState.HIGHLIGHTED ? styles.highlighted : ''}
                  ${cell === CellState.EMPTY ? styles.empty : ''}
                  ${cell === CellState.NOT_CREATED ? styles.notCreated : ''}
                `}
              />
            ))
          )}
        </div>

        <DemoControls
          currentStep={currentStep}
          steps={steps}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onStepChange={(step) => {
            setCurrentStep(step);
            if (isPlaying) setIsPlaying(false);
          }}
        />
      </div>
    );
  };

  const renderRandomDistribution = () => {
    if (!gridState.length || !gridState[currentStep]) {
      return <div className={styles.loading}>Loading visualization...</div>;
    }

    const currentGrid = gridState[currentStep] as HistogramGrid;
    const maxValue = Math.max(...currentGrid.map(col => Math.max(...col)));

    return (
      <div className={styles.distributionDemo}>
        <div className={styles.histogram}>
          {currentGrid.map((col, i) => {
            const height = col[0] ? (col[0] / maxValue) * 100 : 0;
            return (
              <div key={i} className={styles.histogramColumn}>
                <div
                  className={styles.histogramBar}
                  style={{ height: `${height}%` }}
                />
                <div className={styles.histogramLabel}>
                  {(i / 10).toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.distributionLabel}>
          random() value distribution ({Math.ceil(((currentStep + 1) / steps) * samples)} samples)
        </div>

        <DemoControls
          currentStep={currentStep}
          steps={steps}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onStepChange={(step) => {
            setCurrentStep(step);
            if (isPlaying) setIsPlaying(false);
          }}
          showStepLabel={false}
        />
      </div>
    );
  };

  const renderArrayModification = () => {
    if (!gridState.length || !gridState[currentStep]) {
      return <div className={styles.loading}>Loading visualization...</div>;
    }

    const currentGrid = gridState[currentStep] as ArrayGrid;

    return (
      <div className={styles.arrayDemo}>
        <div className={styles.arrayContainer}>
          {currentGrid.map((item, i) => (
            <div
              key={i}
              className={`
                ${styles.arrayCell}
                ${item.operation === 'change' ? styles.changed : ''}
                ${item.operation === 'add' ? styles.added : ''}
                ${item.operation === 'remove' ? styles.removed : ''}
                ${item.operation === 'insert' ? styles.inserted : ''}
              `}
            >
              {item.value}
            </div>
          ))}
        </div>

        <DemoControls
          currentStep={currentStep}
          steps={steps}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onStepChange={(step) => {
            setCurrentStep(step);
            if (isPlaying) setIsPlaying(false);
          }}
          showStepLabel={false}
        />
      </div>
    );
  };

  // Reusable controls component
  interface DemoControlsProps {
    currentStep: number;
    steps: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onStepChange: (step: number) => void;
    showStepLabel?: boolean;
  }

  const DemoControls: React.FC<DemoControlsProps> = ({
    currentStep,
    steps,
    isPlaying,
    onPlayPause,
    onStepChange,
    showStepLabel = true
  }) => (
    <div className={styles.controls}>
      <button
        className={styles.playButton}
        onClick={onPlayPause}
      >
        {isPlaying ? '⏸ Pause' : '▶️ Play'}
      </button>

      <input
        type="range"
        min="0"
        max={steps - 1}
        value={currentStep}
        onChange={(e) => onStepChange(parseInt(e.target.value))}
        className={styles.slider}
      />

      {showStepLabel && (
        <div className={styles.stepLabel}>
          Step: {currentStep + 1} of {steps}
        </div>
      )}
    </div>
  );

  // Main render logic
  const renderDemo = () => {
    switch (type) {
      case DemoType.GRID_CREATION:
      case DemoType.NESTED_LOOPS:
      case DemoType.NESTED_LOOPS_GRID:
      case DemoType.GRID_WRAPPING:
      case DemoType.CREATE_2D_ARRAY:
      case DemoType.NEIGHBORS:
        return renderGridDemo();
      case DemoType.RANDOM_DISTRIBUTION:
        return renderRandomDistribution();
      case DemoType.ARRAY_MODIFICATION:
        return renderArrayModification();
      case DemoType.PATTERN:
        return (
          <div className={styles.fallback}>
            Pattern visualization. For actual implementation, use PatternDemo component.
          </div>
        );
      default:
        return (
          <div className={styles.fallback}>
            Visualization type "{type}" not implemented
          </div>
        );
    }
  };

  return (
    <div className={styles.visualDemoContainer}>
      {renderDemo()}
    </div>
  );
};

export default VisualDemo;

