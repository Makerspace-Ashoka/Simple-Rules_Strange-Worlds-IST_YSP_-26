// GridVisualizer.jsx - Visualization of a 2D grid
import React from 'react';
import styles from './GridVisualizer.module.css';

const GridVisualizer = ({
  grid,
  caption,
  showIndices = false,
  highlightCell = null,
  highlightNeighbors = false,
  aliveColor = '#333',
  deadColor = '#fff',
  borderColor = '#ccc'
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Helper to check if a cell is a neighbor of the highlighted cell
  const isNeighbor = (r, c) => {
    if (!highlightCell || !highlightNeighbors) return false;
    const [hr, hc] = highlightCell;
    const rowDiff = Math.abs(r - hr);
    const colDiff = Math.abs(c - hc);
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  return (
    <div className={styles.gridContainer}>
      {showIndices && (
        <div className={styles.colIndices}>
          {Array(cols).fill(0).map((_, i) => (
            <div key={`col-${i}`} className={styles.indexCell}>{i}</div>
          ))}
        </div>
      )}

      <div className={styles.gridWithRowIndices}>
        {showIndices && (
          <div className={styles.rowIndices}>
            {Array(rows).fill(0).map((_, i) => (
              <div key={`row-${i}`} className={styles.indexCell}>{i}</div>
            ))}
          </div>
        )}

        <div
          className={styles.grid}
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`
                  ${styles.cell}
                  ${cell ? styles.alive : styles.dead}
                  ${highlightCell && highlightCell[0] === r && highlightCell[1] === c ? styles.highlighted : ''}
                  ${isNeighbor(r, c) ? styles.neighbor : ''}
                `}
                style={{
                  backgroundColor: cell ? aliveColor : deadColor,
                  borderColor: borderColor
                }}
              >
                {cell}
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
