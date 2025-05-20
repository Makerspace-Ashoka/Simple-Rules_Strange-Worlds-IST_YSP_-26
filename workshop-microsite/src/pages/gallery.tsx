import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './gallery.module.css';

// Define TypeScript interfaces for our data
interface PatternData {
  id: string;
  patternName: string;
  studentName: string;
  category: PatternCategory;
  representation: number[][];
  behavior: string;
  submissionDate: string;
}

type PatternCategory = 'still_life' | 'oscillator' | 'spaceship' | 'methuselah' | 'other';

// For development purposes - in production this would come from an API/database
const SAMPLE_PATTERNS: PatternData[] = [
  {
    id: '1',
    patternName: 'Glider',
    studentName: 'Aishwarya Kumar',
    category: 'spaceship',
    representation: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ],
    behavior: 'Moves diagonally across the grid while maintaining its shape.',
    submissionDate: '2025-03-15'
  },
  {
    id: '2',
    patternName: 'Blinker',
    studentName: 'Rahul Sharma',
    category: 'oscillator',
    representation: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    behavior: 'Alternates between horizontal and vertical line every generation.',
    submissionDate: '2025-03-16'
  },
  {
    id: '3',
    patternName: 'Block',
    studentName: 'Priya Patel',
    category: 'still_life',
    representation: [
      [1, 1],
      [1, 1]
    ],
    behavior: 'Remains stable with no changes between generations.',
    submissionDate: '2025-03-14'
  },
  {
    id: '4',
    patternName: 'R-pentomino',
    studentName: 'Dev Singh',
    category: 'methuselah',
    representation: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ],
    behavior: 'Evolves for over 1000 generations before stabilizing with multiple patterns.',
    submissionDate: '2025-03-17'
  },
  {
    id: '5',
    patternName: 'Beacon',
    studentName: 'Nisha Reddy',
    category: 'oscillator',
    representation: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    ],
    behavior: 'Oscillates between two states with corners "flashing".',
    submissionDate: '2025-03-18'
  },
  {
    id: '6',
    patternName: 'Toad',
    studentName: 'Arjun Mehta',
    category: 'oscillator',
    representation: [
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ],
    behavior: 'Period 2 oscillator that appears to hop from side to side.',
    submissionDate: '2025-03-19'
  },
  {
    id: '7',
    patternName: 'Loaf',
    studentName: 'Meera Kapoor',
    category: 'still_life',
    representation: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0]
    ],
    behavior: 'Stable pattern resembling a loaf of bread.',
    submissionDate: '2025-03-15'
  },
  {
    id: '8',
    patternName: 'Lightweight Spaceship',
    studentName: 'Vikram Choudhury',
    category: 'spaceship',
    representation: [
      [0, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0]
    ],
    behavior: 'Moves horizontally across the grid while maintaining its shape.',
    submissionDate: '2025-03-20'
  }
];

// Helper function to get category display name
const getCategoryDisplayName = (category: PatternCategory): string => {
  const displayNames = {
    still_life: 'Still Life',
    oscillator: 'Oscillator',
    spaceship: 'Spaceship',
    methuselah: 'Methuselah',
    other: 'Other'
  };
  return displayNames[category];
};

// Helper function to get category color class
const getCategoryColorClass = (category: PatternCategory): string => {
  const colorClasses = {
    still_life: styles.categoryStillLife,
    oscillator: styles.categoryOscillator,
    spaceship: styles.categorySpaceship,
    methuselah: styles.categoryMethuselah,
    other: styles.categoryOther
  };
  return colorClasses[category];
};

// Pattern Grid Visualization Component
const PatternGrid: React.FC<{ pattern: number[][] }> = ({ pattern }) => {
  // Ensure the pattern has content
  if (!pattern || pattern.length === 0) {
    return <div className={styles.patternError}>Invalid pattern data</div>;
  }

  return (
    <div className={styles.patternGrid}>
      {pattern.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.patternRow}>
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`${styles.patternCell} ${cell === 1 ? styles.patternCellAlive : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Pattern Card Component
const PatternCard: React.FC<{ pattern: PatternData }> = ({ pattern }) => {
  return (
    <div className={styles.patternCard}>
      <div className={`${styles.patternCategory} ${getCategoryColorClass(pattern.category)}`}>
        {getCategoryDisplayName(pattern.category)}
      </div>

      <h3 className={styles.patternName}>{pattern.patternName}</h3>

      <div className={styles.patternVisualization}>
        <PatternGrid pattern={pattern.representation} />
      </div>

      <div className={styles.patternInfo}>
        <p className={styles.patternBehavior}>{pattern.behavior}</p>
        <div className={styles.patternMeta}>
          <span className={styles.studentName}>By {pattern.studentName}</span>
          <span className={styles.submissionDate}>
            {new Date(pattern.submissionDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Gallery Component
const GalleryPage: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // In a real application, you would fetch data from an API here
  useEffect(() => {
    // Simulating data fetch
    setPatterns(SAMPLE_PATTERNS);
  }, []);

  // Filter patterns by category
  const filteredPatterns = activeCategory === 'all'
    ? patterns
    : patterns.filter(pattern => pattern.category === activeCategory);

  // Sort patterns based on current sort selection
  const sortedPatterns = [...filteredPatterns].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
    } else if (sortBy === 'name') {
      return a.patternName.localeCompare(b.patternName);
    } else if (sortBy === 'student') {
      return a.studentName.localeCompare(b.studentName);
    }
    return 0;
  });

  // Available categories for filtering
  const categories: { value: string, label: string }[] = [
    { value: 'all', label: 'All Patterns' },
    { value: 'still_life', label: 'Still Life' },
    { value: 'oscillator', label: 'Oscillator' },
    { value: 'spaceship', label: 'Spaceship' },
    { value: 'methuselah', label: 'Methuselah' },
    { value: 'other', label: 'Other' }
  ];

  // Sort options
  const sortOptions: { value: string, label: string }[] = [
    { value: 'date', label: 'Newest First' },
    { value: 'name', label: 'Pattern Name' },
    { value: 'student', label: 'Student Name' }
  ];

  return (
    <Layout
      title={`Pattern Gallery | ${siteConfig.title}`}
      description="Gallery of student-submitted cellular automata patterns">

      <header className={styles.galleryHeader}>
        <div className={styles.decorativeElements}>
          <div className={styles.redSquare}></div>
          <div className={styles.blueCircle}></div>
          <div className={styles.yellowTriangle}></div>
          <div className={styles.blackRectangle}></div>
        </div>

        <div className="container">
          <h1 className={styles.galleryTitle}>Pattern Gallery</h1>
          <p className={styles.galleryDescription}>
            Explore patterns created by workshop participants. Each pattern represents an
            initial state for Conway's Game of Life or other cellular automata rules.
          </p>
        </div>
      </header>

      <main className={styles.galleryContainer}>
        <div className={styles.galleryControls}>
          <div className={styles.filterContainer}>
            <label className={styles.filterLabel}>Filter by:</label>
            <div className={styles.filterButtons}>
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`${styles.filterButton} ${activeCategory === category.value ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortContainer}>
            <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.galleryGrid}>
          {sortedPatterns.length > 0 ? (
            sortedPatterns.map(pattern => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No patterns found in this category.</p>
            </div>
          )}
        </div>

        <div className={styles.submissionCta}>
          <h2>Created an interesting pattern?</h2>
          <p>Share your discoveries with the community!</p>
          <a href="/submit" className={styles.submissionButton}>
            Submit Your Pattern
          </a>
        </div>
      </main>
    </Layout>
  );
};

export default GalleryPage;
