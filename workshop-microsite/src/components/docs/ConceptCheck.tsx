import React, { useState } from 'react';
import styles from './ConceptCheck.module.css';

interface ConceptCheckProps {
  question: React.ReactNode;
  answer: string;
}

/**
 * A simplified concept check component with direct props
 */
const ConceptCheck: React.FC<ConceptCheckProps> = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return;

    const correct = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
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
        <div className={styles.questionText}>{question}</div>
      </div>

      {!showAnswer ? (
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            className={styles.answerInput}
            onKeyDown={(e) => {
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
          <div className={styles.answerText}>{answer}</div>
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

export default ConceptCheck;

