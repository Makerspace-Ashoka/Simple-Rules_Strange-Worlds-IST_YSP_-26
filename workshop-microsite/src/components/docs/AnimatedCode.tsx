// AnimatedCode.jsx - Code highlighting with animation
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './AnimatedCode.module.css';

const AnimatedCode = ({ code, highlights = [], language = 'javascript' }) => {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [highlightedLines, setHighlightedLines] = useState({});

  useEffect(() => {
    if (highlights.length === 0) return;

    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentHighlight((prev) => (prev + 1) % highlights.length);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, highlights.length]);

  useEffect(() => {
    if (highlights.length === 0) return;

    const current = highlights[currentHighlight];
    const newHighlightedLines = {};

    if (current.line !== undefined) {
      newHighlightedLines[current.line] = true;
    }

    setHighlightedLines(newHighlightedLines);
  }, [currentHighlight, highlights]);

  // Split code into lines for custom rendering
  const codeLines = code.split('\n');

  const getLineStyle = (lineIndex) => {
    const lineNumber = lineIndex + 1;
    return highlightedLines[lineNumber]
      ? { backgroundColor: 'rgba(62, 185, 152, 0.2)', display: 'block' }
      : { display: 'block' };
  };

  return (
    <div className={styles.animatedCodeContainer}>
      <div className={styles.codeHeader}>
        <span>Code Example</span>
        <button
          className={styles.playButton}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        wrapLines={true}
        lineProps={(lineNumber) => ({
          style: getLineStyle(lineNumber - 1),
          className: highlightedLines[lineNumber] ? styles.highlightedLine : '',
        })}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>

      {highlights.length > 0 && (
        <div className={styles.highlightExplanation}>
          {highlights[currentHighlight].explanation || 'Observe the highlighted code'}
        </div>
      )}
    </div>
  );
};

export default AnimatedCode;

