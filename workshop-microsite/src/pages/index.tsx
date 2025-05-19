import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// Simple cellular automata visualization component
function CellularAutomataCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Cell size
    const cellSize = 15;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    // Bauhaus-inspired colors
    const colors = ['#E53935', '#1E88E5', '#FDD835', '#000000'];

    // Initialize grid with random states
    let grid = Array(cols).fill().map(() =>
      Array(rows).fill().map(() =>
        Math.random() > 0.8 ? Math.floor(Math.random() * colors.length) : -1
      )
    );

    // Draw function
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw cells
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] >= 0) {
            ctx.fillStyle = colors[grid[i][j]];
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }

      // Update grid using a simple rule (horizontally expanding)
      const nextGrid = Array(cols).fill().map(() => Array(rows).fill(-1));

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] >= 0) {
            // Keep current cell
            nextGrid[i][j] = grid[i][j];

            // Maybe expand in one direction
            const expandDirection = Math.floor(Math.random() * 4);
            const newI = i + (expandDirection === 0 ? 1 : (expandDirection === 1 ? -1 : 0));
            const newJ = j + (expandDirection === 2 ? 1 : (expandDirection === 3 ? -1 : 0));

            if (newI >= 0 && newI < cols && newJ >= 0 && newJ < rows && grid[newI][newJ] === -1) {
              // 50% chance to spread with the same color
              if (Math.random() > 0.5) {
                nextGrid[newI][newJ] = grid[i][j];
              }
            }
          } else if (Math.random() < 0.001) {
            // Small chance for a new random cell to appear
            nextGrid[i][j] = Math.floor(Math.random() * colors.length);
          }
        }
      }

      grid = nextGrid;
      requestAnimationFrame(draw);
    }

    // Start animation
    draw();

    // Cleanup
    return () => {
      // Cancel animation frame if component unmounts
      cancelAnimationFrame(draw);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className={styles.canvas}
    />
  );
}

// Bauhaus-inspired decorative elements
function BauhausShapes() {
  return (
    <div className={styles.bauhausShapes}>
      <div className={styles.circle}></div>
      <div className={styles.square}></div>
      <div className={styles.triangle}></div>
      <div className={styles.rectangle}></div>
    </div>
  );
}

// Fun interactive floating pixels
function FloatingPixels() {
  return (
    <div className={styles.floatingPixels}>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={styles.pixel}
          style={{
            animationDelay: `${i * 0.7}s`,
            left: `${10 + (i * 5) % 80}%`,
            backgroundColor: ['#E53935', '#1E88E5', '#FDD835', '#000000'][i % 4]
          }}
        ></div>
      ))}
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <BauhausShapes />
        <FloatingPixels />
        <Heading as="h1" className={styles.title}>
          {siteConfig.title}
        </Heading>
        <p className={styles.subtitle}>{siteConfig.tagline}</p>

        <div className={styles.visualization}>
          <CellularAutomataCanvas />
        </div>

        <div className={styles.buttons}>
          <Link
            className={clsx("button", styles.buttonPrimary)}
            to="/docs/intro">
            Start Workshop
          </Link>
          <Link
            className={clsx("button", styles.buttonSecondary)}
            to="/docs/pattern-exploration-handout">
            Exploration Guide
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.workshopInfo}>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>About This Workshop</h2>
              <p>Explore the fascinating world of cellular automata through hands-on coding and pattern exploration. Learn how simple rules create complex emergent behaviors.</p>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>What You'll Need</h2>
              <ul className={styles.infoList}>
                <li>A laptop with a browser</li>
                <li>Curiosity about patterns and complexity</li>
                <li>No prior coding experience required</li>
              </ul>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>Workshop Timeline</h2>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <strong>Day 1</strong>: Pattern Exploration
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <strong>Day 2</strong>: Coding Implementation
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

