import React, { useState, ReactNode } from 'react';
import styles from './ConceptCheck.module.css';

interface ConceptCheckProps {
  children: ReactNode;
}

interface AnswerProps {
  children: ReactNode;
}

/**
 * A component for quick knowledge checks with immediate feedback
 */
const ConceptCheck: React.FC<ConceptCheckProps> = ({ children }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Extract the question and answer elements
  const childrenArray = React.Children.toArray(children);

  // Get the question text (all string/number children)
  const questionText = childrenArray
    .filter(child => typeof child === 'string' || typeof child === 'number')
    .join('');

  // Find the answer element
  const answerElement = childrenArray.find(
    child => React.isValidElement(child) &&
      (child.type as any).displayName === 'Answer'
  ) as React.ReactElement<AnswerProps> | undefined;

  // Extract answer text
  const answerText = answerElement
    ? React.Children.toArray(answerElement.props.children)
      .filter(child => typeof child === 'string' || typeof child === 'number')
      .join('')
    : '';

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return;

    const correct = userAnswer.toLowerCase().trim() === answerText.toLowerCase().trim();
    setIsCorrect(correct);

    // Auto-reset status after delay if incorrect
    if (!correct) {
      setTimeout(() => setIsCorrect(null), 3000);
    }
  };

  return (
    <div className={styles.conceptCheckContainer}>
      <div className={styles.questionContainer}>
        <div className={styles.conceptIcon}>💡</div>
        <div className={styles.questionText}>{questionText}</div>
      </div>

      {!showAnswer ? (
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            className={styles.answerInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleCheckAnswer();
            }}
          />
          <button
            className={styles.checkButton}
            onClick={handleCheckAnswer}
          >
            Check
          </button>
          <button
            className={styles.revealButton}
            onClick={() => setShowAnswer(true)}
          >
            Reveal Answer
          </button>
        </div>
      ) : (
        <div className={styles.answerContainer}>
          <div className={styles.answerLabel}>Answer:</div>
          <div className={styles.answerText}>{answerText}</div>
          <button
            className={styles.hideButton}
            onClick={() => setShowAnswer(false)}
          >
            Hide Answer
          </button>
        </div>
      )}

      {isCorrect !== null && (
        <div className={`${styles.feedback} ${isCorrect ? styles.correctFeedback : styles.incorrectFeedback}`}>
          {isCorrect ? 'Correct! ✅' : 'Try again 🔄'}
        </div>
      )}
    </div>
  );
};

/**
 * A component to hold the correct answer for a ConceptCheck
 */
const Answer: React.FC<AnswerProps> = ({ children }) => {
  // This component doesn't render anything
  return null;
};

// Set displayName to allow for filtering in ConceptCheck component
Answer.displayName = 'Answer';

// Export both components
export { ConceptCheck, Answer };

// Create a namespace object for easier imports
const ConceptCheckComponents = {
  ConceptCheck,
  Answer
};

export default ConceptCheckComponents;

