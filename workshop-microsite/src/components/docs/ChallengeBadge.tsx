import React from 'react';
import styles from './ChallengeBadge.module.css';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface ChallengeBadgeProps {
  level: DifficultyLevel;
  concepts?: string[];
}

/**
 * A component that displays a badge indicating difficulty level and concepts
 *
 * @param level - The difficulty level of the challenge
 * @param concepts - An array of concept tags related to the challenge
 */
const ChallengeBadge: React.FC<ChallengeBadgeProps> = ({
  level,
  concepts = []
}) => {
  const getBadgeColor = (level: DifficultyLevel): string => {
    switch (level) {
      case 'beginner':
        return styles.beginner;
      case 'intermediate':
        return styles.intermediate;
      case 'advanced':
        return styles.advanced;
      default:
        return styles.beginner;
    }
  };

  return (
    <div className={styles.badgeContainer}>
      <div className={`${styles.levelBadge} ${getBadgeColor(level)}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </div>

      {concepts.map((concept, index) => (
        <div key={index} className={styles.conceptBadge}>
          {concept}
        </div>
      ))}
    </div>
  );
};

export default ChallengeBadge;

