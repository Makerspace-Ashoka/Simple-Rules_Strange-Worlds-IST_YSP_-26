// ChallengeBadge.jsx - Badge for challenge/difficulty level
import React from 'react';
import styles from './ChallengeBadge.module.css';

const ChallengeBadge = ({ level, concepts = [] }) => {
  const getBadgeColor = () => {
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
      <div className={`${styles.levelBadge} ${getBadgeColor()}`}>
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

