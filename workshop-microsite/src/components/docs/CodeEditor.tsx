import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import styles from './CodeEditor.module.css';

// Supported language modes for syntax highlighting
type EditorLanguage = 'javascript' | 'jsx' | 'typescript' | 'tsx';

interface CodeEditorProps {
  id: string;
  initialCode: string;
  solution?: string;
  mode?: EditorLanguage;
  scope?: Record<string, unknown>;
  noInline?: boolean;
  showPreview?: boolean;
  previewBackground?: string;
  hint?: string | React.ReactNode;
}

/**
 * An interactive code editor component with syntax highlighting,
 * live preview, and solution display functionality
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  id,
  initialCode,
  solution,
  mode = 'javascript',
  scope = {},
  noInline = true,
  showPreview = false,
  previewBackground = '#f9f9f9',
  hint,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';

  // Reset states when id changes
  useEffect(() => {
    setCode(initialCode);
    setShowSolution(false);
    setShowHint(false);
    setIsCorrect(null);
  }, [id, initialCode]);

  // Create lightweight simulation of student code correctness
  const checkCode = (): boolean => {
    if (!solution) return true;

    // Basic check: remove whitespace and see if key parts exist
    // (this is a simplified approach, real implementation would be more thorough)
    const normalizedStudentCode = code.replace(/\s+/g, '').toLowerCase();
    const normalizedSolutionCode = solution.replace(/\s+/g, '').toLowerCase();

    // Check if student code contains key parts of solution
    // This is a very simple check and would need to be much more sophisticated
    // for real-world use, potentially using AST comparison
    const keyParts = normalizedSolutionCode
      .replace(/\/\/.*/g, '') // Remove comments
      .match(/[a-z0-9]+(?:[=<>!]==?|[=<>!+\-*/%&|^]=?|&&|\|\|)[a-z0-9]+/g) || [];

    if (keyParts.length === 0) return true;

    const missingParts = keyParts.filter(part => !normalizedStudentCode.includes(part));
    return missingParts.length <= keyParts.length * 0.3; // Allow 30% of key parts to be missing
  };

  const handleCheckCode = () => {
    const result = checkCode();
    setIsCorrect(result);

    // Auto-clear status after a delay if incorrect
    if (!result) {
      setTimeout(() => setIsCorrect(null), 3000);
    }
  };

  return (
    <div className={styles.codeEditorContainer} data-testid={`code-editor-${id}`}>
      <LiveProvider
        code={showSolution ? solution || code : code}
        scope={scope}
        noInline={noInline}
        language={mode}
      >
        <div className={styles.codeEditorHeader}>
          <span className={styles.codeEditorTitle}>Code Editor</span>
          <div className={styles.codeEditorActions}>
            {hint && (
              <button
                className={styles.actionButton}
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}

            {solution && (
              <button
                className={styles.actionButton}
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            )}

            <button
              className={styles.checkButton}
              onClick={handleCheckCode}
            >
              Check Code
            </button>
          </div>
        </div>

        <div
          className={`${styles.editorWrapper} ${isDarkTheme ? styles.darkTheme : ''}`}
        >
          <LiveEditor
            onChange={setCode}
            className={styles.liveEditor}
          />
        </div>

        <LiveError className={styles.liveError} />

        {showPreview && (
          <div
            className={styles.previewContainer}
            style={{ backgroundColor: previewBackground }}
          >
            <div className={styles.previewHeader}>Preview</div>
            <div className={styles.previewContent}>
              <LivePreview />
            </div>
          </div>
        )}

        {isCorrect !== null && (
          <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.incorrect}`}>
            {isCorrect ?
              '✅ Correct! Great job!' :
              '❌ Not quite right. Check your code and try again!'
            }
          </div>
        )}

        {showHint && hint && (
          <div className={styles.hint}>
            <h4>💡 Hint</h4>
            {typeof hint === 'string' ? <p>{hint}</p> : hint}
          </div>
        )}
      </LiveProvider>
    </div>
  );
};

export default CodeEditor;

