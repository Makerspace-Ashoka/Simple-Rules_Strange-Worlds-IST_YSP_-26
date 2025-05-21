import React, { useState, ReactNode } from 'react';
import styles from './Quiz.module.css';

interface QuestionProps {
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  children: ReactNode;
  answer: number | string;
  onAnswer?: (isCorrect: boolean) => void;
  answered?: boolean;
  correct?: boolean;
  explanation?: string;
}

interface OptionProps {
  children: ReactNode;
  correct?: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface QuizProps {
  children: ReactNode;
}

/**
 * A Question component for multiple choice, true/false, or fill-in-blank questions
 */
const Question: React.FC<QuestionProps> = ({
  type,
  children,
  answer,
  onAnswer,
  answered = false,
  correct = false,
  explanation
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  // Extract question text and options
  const childrenArray = React.Children.toArray(children);

  const questionText = childrenArray
    .filter(child => typeof child === 'string' || typeof child === 'number')
    .join('');

  const optionElements = childrenArray.filter(
    child => React.isValidElement(child) &&
      (child.type as any).displayName === 'Option'
  );

  const handleOptionClick = (index: number) => {
    if (answered) return;

    setSelected(index);
    if (onAnswer) {
      onAnswer(index === answer);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleTextInputSubmit = () => {
    if (answered) return;

    if (onAnswer) {
      const isCorrect = userAnswer.toLowerCase().trim() === (answer as string).toLowerCase().trim();
      onAnswer(isCorrect);
    }
  };

  return (
    <div className={styles.question}>
      <p className={styles.questionText}>{questionText}</p>

      {type === 'multiple-choice' && (
        <div className={styles.options}>
          {optionElements.map((option, index) =>
            React.cloneElement(option as React.ReactElement<OptionProps>, {
              key: index,
              onClick: () => handleOptionClick(index),
              selected: selected === index,
              disabled: answered,
              correct: answered && index === (answer as number)
            })
          )}
        </div>
      )}

      {type === 'true-false' && (
        <div className={styles.options}>
          <Option
            onClick={() => handleOptionClick(0)}
            selected={selected === 0}
            disabled={answered}
            correct={answered && 0 === (answer as number)}
          >
            True
          </Option>
          <Option
            onClick={() => handleOptionClick(1)}
            selected={selected === 1}
            disabled={answered}
            correct={answered && 1 === (answer as number)}
          >
            False
          </Option>
        </div>
      )}

      {type === 'fill-in-blank' && (
        <div className={styles.fillInBlank}>
          <input
            type="text"
            value={userAnswer}
            onChange={handleTextInputChange}
            placeholder="Type your answer"
            disabled={answered}
            className={styles.textInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleTextInputSubmit();
              }
            }}
          />
          <button
            onClick={handleTextInputSubmit}
            disabled={answered}
            className={styles.submitButton}
          >
            Submit
          </button>
        </div>
      )}

      {answered && explanation && (
        <div className={`${styles.explanation} ${correct ? styles.correctExplanation : styles.incorrectExplanation}`}>
          <strong>{correct ? 'Correct! ' : 'Incorrect. '}</strong>
          {explanation}
        </div>
      )}
    </div>
  );
};

/**
 * An Option component for multiple choice questions
 */
const Option: React.FC<OptionProps> = ({
  children,
  correct = false,
  selected = false,
  onClick,
  disabled = false
}) => {
  return (
    <div
      className={`
        ${styles.option}
        ${selected ? styles.selectedOption : ''}
        ${correct ? styles.correctOption : ''}
        ${selected && !correct && disabled ? styles.incorrectOption : ''}
        ${disabled ? styles.disabledOption : ''}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
};

// Set displayName to allow for filtering in Question component
Option.displayName = 'Option';

/**
 * A Quiz component that contains one or more questions
 */
const Quiz: React.FC<QuizProps> = ({ children }) => {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  // Extract questions from children
  const questions = React.Children.toArray(children).filter(
    child => React.isValidElement(child) &&
      (child.type as any).displayName === 'Question'
  );

  const handleAnswer = (isCorrect: boolean) => {
    setAnswered(true);
    setCorrect(isCorrect);
  };

  const handleRetry = () => {
    setAnswered(false);
    setCorrect(false);
  };

  return (
    <div className={styles.quizContainer}>
      {questions.map((question, index) =>
        React.cloneElement(question as React.ReactElement<QuestionProps>, {
          key: index,
          onAnswer: handleAnswer,
          answered,
          correct
        })
      )}

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
          onClick={handleRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Set displayName to allow for filtering in Quiz component
Question.displayName = 'Question';

// Create namespace object for easier imports
const QuizComponents = {
  Quiz,
  Question,
  Option
};

export default QuizComponents;
export { Quiz, Question, Option };

