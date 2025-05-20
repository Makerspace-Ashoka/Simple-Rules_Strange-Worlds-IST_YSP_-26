// Quiz.jsx - Interactive quiz component
import React, { useState } from 'react';
import styles from './Quiz.module.css';

const Quiz = ({ children }) => {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  // Extract questions from children
  const questions = React.Children.toArray(children).filter(
    child => child.type && child.type.name === 'question'
  );

  const handleAnswer = (isCorrect) => {
    setAnswered(true);
    setCorrect(isCorrect);
  };

  return (
    <div className={styles.quizContainer}>
      {questions.map((question, index) => (
        React.cloneElement(question, {
          key: index,
          onAnswer: handleAnswer,
          answered,
          correct
        })
      ))}

      {answered && (
        <div className={`${styles.feedback} ${correct ? styles.correct : styles.incorrect}`}>
          {correct
            ? '✅ Correct! Well done!'
            : '❌ Not quite right. Try again!'}
        </div>
      )}

      {answered && !correct && (
        <button
          className={styles.retryButton}
          onClick={() => setAnswered(false)}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Question component for multiple choice questions
const Question = ({ type, children, options, answer, onAnswer, answered, correct }) => {
  const [selected, setSelected] = useState(null);

  // Extract question text and options
  const questionText = React.Children.toArray(children).filter(
    child => typeof child === 'string' || typeof child === 'number'
  ).join('');

  const optionElements = React.Children.toArray(children).filter(
    child => child.type && child.type.name === 'option'
  );

  const handleOptionClick = (index) => {
    if (!answered) {
      setSelected(index);
      onAnswer(index === answer);
    }
  };

  return (
    <div className={styles.question}>
      <p className={styles.questionText}>{questionText}</p>

      <div className={styles.options}>
        {optionElements.map((option, index) => (
          <div
            key={index}
            className={`
              ${styles.option}
              ${answered && index === answer ? styles.correctOption : ''}
              ${answered && selected === index && index !== answer ? styles.incorrectOption : ''}
              ${selected === index ? styles.selectedOption : ''}
            `}
            onClick={() => handleOptionClick(index)}
          >
            {option.props.children}
          </div>
        ))}
      </div>
    </div>
  );
};

// Option component for multiple choice options
const Option = ({ children, correct }) => {
  return <>{children}</>;
};

Quiz.Question = Question;
Quiz.Option = Option;

export default Quiz;

