import React, { useState, useEffect } from 'react';
// Try alternative import approach
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './AnimatedCode.module.css';

interface CodeHighlight {
  line: number;
  elements?: Array<{
    start: number;
    end: number;
  }>;
  explanation?: string;
}

interface AnimatedCodeProps {
  code: string;
  highlights?: CodeHighlight[];
  language?: string;
  autoPlay?: boolean;
  interval?: number;
}

/**
 * A component that displays animated code with highlighted sections that change over time
 * Optimized for static sites like GitHub Pages
 *
 * @param code - The code to display
 * @param highlights - An array of highlight configurations
 * @param language - The programming language for syntax highlighting
 * @param autoPlay - Whether to automatically cycle through highlights
 * @param interval - The time (in ms) between highlight changes
 */
const AnimatedCode: React.FC<AnimatedCodeProps> = ({
  code,
  highlights = [],
  language = 'javascript',
  autoPlay = true,
  interval = 2000,
}) => {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [highlightedLines, setHighlightedLines] = useState<Record<number, boolean>>({});
  const [highlightedElements, setHighlightedElements] = useState<Array<{ line: number, start: number, end: number }>>([]);
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get theme when mounted (client-side only)
  const isDarkTheme = mounted ? document.documentElement.getAttribute('data-theme') === 'dark' : false;

  // Cycle through highlights when playing
  useEffect(() => {
    if (highlights.length === 0 || !mounted) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      timeoutId = setTimeout(() => {
        setCurrentHighlight((prev) => (prev + 1) % highlights.length);
      }, interval);
    }

    return () => clearTimeout(timeoutId);
  }, [isPlaying, highlights.length, interval, currentHighlight, mounted]);

  // Update highlighted sections when current highlight changes
  useEffect(() => {
    if (highlights.length === 0) return;

    const current = highlights[currentHighlight];
    const newHighlightedLines: Record<number, boolean> = {};
    const newHighlightedElements: Array<{ line: number, start: number, end: number }> = [];

    if (current.line !== undefined) {
      newHighlightedLines[current.line] = true;

      if (current.elements) {
        current.elements.forEach(element => {
          newHighlightedElements.push({
            line: current.line,
            start: element.start,
            end: element.end
          });
        });
      }
    }

    setHighlightedLines(newHighlightedLines);
    setHighlightedElements(newHighlightedElements);
  }, [currentHighlight, highlights]);

  // Split code into lines for custom rendering
  const codeLines = code.split('\n');

  // Function to determine line style based on highlighting
  const getLineStyle = (lineIndex: number): React.CSSProperties => {
    const lineNumber = lineIndex + 1;
    return highlightedLines[lineNumber]
      ? { backgroundColor: 'rgba(62, 185, 152, 0.2)', display: 'block' }
      : { display: 'block' };
  };

  // Custom renderer to add inline highlighting
  const getTokenProps = (lineIndex: number, tokenIndex: number, tokens: any[]): any => {
    const lineNumber = lineIndex + 1;
    const token = tokens[tokenIndex];

    // Basic props
    const props = {
      key: tokenIndex,
      className: '',
      children: token.content,
      style: { ...token.style }
    };

    // Check if this token should be highlighted
    const relevantHighlights = highlightedElements.filter(h => h.line === lineNumber);
    if (relevantHighlights.length === 0) return props;

    // Calculate token position in the line
    let position = 0;
    for (let i = 0; i < tokenIndex; i++) {
      position += tokens[i].content.length;
    }

    // Check if any part of this token is highlighted
    for (const highlight of relevantHighlights) {
      const tokenStart = position;
      const tokenEnd = position + token.content.length;

      // Skip if no overlap
      if (tokenEnd <= highlight.start || tokenStart >= highlight.end) continue;

      // Token is at least partially highlighted
      props.className += ' highlighted-token';
      props.style = {
        ...props.style,
        backgroundColor: 'rgba(255, 207, 0, 0.3)',
        borderRadius: '2px',
        padding: '1px 0'
      };
      break;
    }

    return props;
  };

  // For static site, show nothing until client-side hydration
  if (!mounted) {
    return <div className={styles.animatedCodeContainer}></div>;
  }

  return (
    <div className={styles.animatedCodeContainer}>
      <div className={styles.codeHeader}>
        <span className={styles.codeTitle}>Code Example</span>
        {highlights.length > 0 && (
          <button
            className={styles.playButton}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        )}
      </div>

      <div className={styles.codeWrapper}>
        <SyntaxHighlighter
          language={language}
          style={isDarkTheme ? vscDarkPlus : prism}
          wrapLines={true}
          lineProps={(lineNumber) => ({
            style: getLineStyle(lineNumber - 1),
            className: highlightedLines[lineNumber] ? styles.highlightedLine : '',
          })}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {highlights.length > 0 && highlights[currentHighlight].explanation && (
        <div className={styles.highlightExplanation}>
          {highlights[currentHighlight].explanation}
        </div>
      )}

      {highlights.length > 0 && (
        <div className={styles.highlightControls}>
          <button
            className={styles.prevButton}
            onClick={() => setCurrentHighlight((prev) => (prev - 1 + highlights.length) % highlights.length)}
            disabled={isPlaying}
          >
            ◀ Previous
          </button>

          <div className={styles.stepIndicator}>
            {highlights.map((_, index) => (
              <div
                key={index}
                className={`${styles.stepDot} ${index === currentHighlight ? styles.activeDot : ''}`}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentHighlight(index);
                }}
              />
            ))}
          </div>

          <button
            className={styles.nextButton}
            onClick={() => setCurrentHighlight((prev) => (prev + 1) % highlights.length)}
            disabled={isPlaying}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimatedCode;

