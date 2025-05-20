// CodeEditor.jsx - Interactive code editing component
import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import useThemeContext from '@theme/hooks/useThemeContext';
import styles from './CodeEditor.module.css';

const CodeEditor = ({ id, initialCode, solution, mode = 'jsx', scope = {} }) => {
  const [code, setCode] = useState(initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { isDarkTheme } = useThemeContext();

  // Function to check if student code is correct (simplified example)
  const checkCode = () => {
    // In a real implementation, you'd want more sophisticated code checking
    const studentCode = code.replace(/\s+/g, '');
    const solutionCode = solution.replace(/\s+/g, '');
    return studentCode.includes(solutionCode);
  };

  return (
    <div className={styles.codeEditorContainer}>
      <LiveProvider code={code} noInline={mode === 'jsx' ? false : true} scope={scope}>
        <div className={styles.codeEditorHeader}>
          <span>Code Editor</span>
          <div className={styles.codeEditorActions}>
            <button
              className={styles.actionButton}
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button
              className={styles.actionButton}
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            <button
              className={styles.checkButton}
              onClick={() => {
                const isCorrect = checkCode();
                alert(isCorrect ?
                  '🎉 Correct! Your code works!' :
                  '❌ Not quite right. Keep trying or check the hint!'
                );
              }}
            >
              Check Code
            </button>
          </div>
        </div>

        <div className={styles.editorWrapper}>
          <LiveEditor
            onChange={setCode}
            language={mode}
            theme={isDarkTheme ? 'dracula' : 'github'}
            className={styles.liveEditor}
          />
        </div>

        <LiveError className={styles.liveError} />

        {showHint && (
          <div className={styles.hint}>
            <h4>💡 Hint</h4>
            <p>Look at how we've used loops before. You'll need to iterate through all cells and use the random() function to decide if each cell should be alive.</p>
          </div>
        )}

        {showSolution && (
          <div className={styles.solution}>
            <h4>Solution</h4>
            <pre className={styles.solutionCode}>{solution}</pre>
          </div>
        )}
      </LiveProvider>
    </div>
  );
};

export default CodeEditor;

