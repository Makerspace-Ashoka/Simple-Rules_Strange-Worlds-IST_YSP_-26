// ConceptCheck.jsx - Quick knowledge check component
import React, { useState } from 'react';
import styles from './ConceptCheck.module.css';

const ConceptCheck = ({ children }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  // Extract the question and answer
  const childArray = React.Children.toArray(children);
  const question = childArray.filter(child => typeof child === 'string' || typeof child === 'number').join('');
  const answerElement = childArray.find(child => child.type && child.type.name === 'answer');
  const answer = answerElement ? answerElement.props.children : '';

  const handleCheckAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
    setIsCorrect(correct);
    if (!correct) {
      setTimeout(() => setIsCorrect(null), 2000);
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

// Answer component to hold the correct answer
const Answer = ({ children }) => {
  return null; // This component doesn't render anything
};

ConceptCheck.answer = Answer;

export default ConceptCheck;

