import React from 'react';
import styles from './ArrayVisualizer.module.css';

interface ArrayVisualizerProps {
  array: any[];
  caption?: string;
  highlightIndices?: boolean;
  highlightIndex?: number;
  showIndices?: boolean;
}

/**
 * A component that visualizes a one-dimensional array
 *
 * @param array - The array to visualize
 * @param caption - Optional caption text for the visualization
 * @param highlightIndices - Whether to highlight the indices of the array
 * @param highlightIndex - A specific index to highlight
 * @param showIndices - Whether to show indices above the array elements
 */
const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array,
  caption,
  highlightIndices = false,
  highlightIndex,
  showIndices = true,
}) => {
  if (!array || array.length === 0) {
    return <div className={styles.error}>No array data provided</div>;
  }

  return (
    <div className={styles.arrayVisualizerContainer}>
      {showIndices && (
        <div className={styles.indices}>
          {array.map((_, index) => (
            <div
              key={`index-${index}`}
              className={`
                ${styles.indexCell}
                ${highlightIndices ? styles.highlightedIndices : ''}
                ${highlightIndex === index ? styles.highlightedIndex : ''}
              `}
            >
              {index}
            </div>
          ))}
        </div>
      )}

      <div className={styles.array}>
        {array.map((value, index) => (
          <div
            key={`value-${index}`}
            className={`
              ${styles.arrayItem}
              ${highlightIndex === index ? styles.highlight : ''}
            `}
          >
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </div>
        ))}
      </div>

      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  );
};

export default ArrayVisualizer;

