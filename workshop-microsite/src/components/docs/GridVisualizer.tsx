import React from 'react';
import styles from './GridVisualizer.module.css';

interface GridVisualizerProps {
  grid: number[][];
  caption?: string;
  showIndices?: boolean;
  highlightCell?: [number, number];
  highlightNeighbors?: boolean;
  aliveColor?: string;
  deadColor?: string;
  borderColor?: string;
  cellSize?: number;
}

/**
 * A component that visualizes a 2D grid array, specifically designed for Conway's Game of Life
 *
 * @param grid - The 2D array to visualize
 * @param caption - Optional caption text for the visualization
 * @param showIndices - Whether to show row and column indices
 * @param highlightCell - Coordinates [row, col] of a cell to highlight
 * @param highlightNeighbors - Whether to highlight the neighbors of the highlighted cell
 * @param aliveColor - Color for living cells (value 1)
 * @param deadColor - Color for dead cells (value 0)
 * @param borderColor - Color for cell borders
 * @param cellSize - Size of each cell in pixels
 */
const GridVisualizer: React.FC<GridVisualizerProps> = ({
  grid,
  caption,
  showIndices = false,
  highlightCell = null,
  highlightNeighbors = false,
  aliveColor = '#333',
  deadColor = '#fff',
  borderColor = '#ccc',
  cellSize = 30
}) => {
  if (!grid || grid.length === 0) {
    return <div className={styles.error}>No grid data provided</div>;
  }

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  if (cols === 0) {
    return <div className={styles.error}>Invalid grid structure</div>;
  }

  // Helper to check if a cell is a neighbor of the highlighted cell
  const isNeighbor = (r: number, c: number): boolean => {
    if (!highlightCell || !highlightNeighbors) return false;

    const [hr, hc] = highlightCell;
    const rowDiff = Math.abs(r - hr);
    const colDiff = Math.abs(c - hc);

    // Is adjacent (including diagonals) but not the cell itself
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  const isHighlighted = (r: number, c: number): boolean => {
    return !!(highlightCell && highlightCell[0] === r && highlightCell[1] === c);
  };

  return (
    <div className={styles.gridContainer}>
      {showIndices && (
        <div className={styles.colIndices} style={{ marginLeft: showIndices ? '2rem' : '0' }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={`col-${i}`}
              className={styles.indexCell}
              style={{ width: `${cellSize}px` }}
            >
              {i}
            </div>
          ))}
        </div>
      )}

      <div className={styles.gridWithRowIndices}>
        {showIndices && (
          <div className={styles.rowIndices}>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={`row-${i}`}
                className={styles.indexCell}
                style={{ height: `${cellSize}px` }}
              >
                {i}
              </div>
            ))}
          </div>
        )}

        <div
          className={styles.grid}
          style={{
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`
                  ${styles.cell}
                  ${cell ? styles.alive : styles.dead}
                  ${isHighlighted(r, c) ? styles.highlighted : ''}
                  ${isNeighbor(r, c) ? styles.neighbor : ''}
                `}
                style={{
                  backgroundColor: cell ? aliveColor : deadColor,
                  borderColor: borderColor
                }}
                title={`Row: ${r}, Col: ${c}, Value: ${cell}`}
              >
                {cell !== 0 && cell !== 1 ? cell : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  );
};

export default GridVisualizer;

