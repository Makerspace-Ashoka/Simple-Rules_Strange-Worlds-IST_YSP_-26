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
    let grid = Array(cols).fill(null).map(() =>
      Array(rows).fill(null).map(() =>
        Math.random() > 0.8 ? Math.floor(Math.random() * colors.length) : -1
      )
    );

    // Animation frame ID to properly cancel animation
    let animationFrameId: number;

    // Draw function
    function draw() {
      // Clear canvas with a slight fade effect for trails
      ctx.fillStyle = 'rgba(248, 248, 248, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw cells
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] >= 0) {
            ctx.fillStyle = colors[grid[i][j]];
            // Draw rounded cells for a more playful look
            ctx.beginPath();
            ctx.roundRect(i * cellSize, j * cellSize, cellSize, cellSize, 3);
            ctx.fill();
          }
        }
      }

      // Update grid using a Bauhaus-inspired rule
      const nextGrid = Array(cols).fill(null).map(() => Array(rows).fill(-1));

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] >= 0) {
            // Try to create geometric patterns with movement
            const neighbors = countActiveNeighbors(i, j);

            // Rules inspired by geometric patterns
            if (neighbors < 2 || neighbors > 3) {
              // Cell dies from isolation or overcrowding
              if (Math.random() > 0.7) {
                nextGrid[i][j] = -1;
              } else {
                nextGrid[i][j] = grid[i][j];
              }
            } else {
              // Cell survives
              nextGrid[i][j] = grid[i][j];

              // Sometimes change color for visual interest
              if (Math.random() > 0.95) {
                nextGrid[i][j] = (grid[i][j] + 1) % colors.length;
              }
            }
          } else {
            // Empty cell
            const neighbors = countActiveNeighbors(i, j);

            // Birth rule
            if (neighbors === 3) {
              // Find the most common color among neighbors
              nextGrid[i][j] = getMostCommonNeighborColor(i, j);
            } else if (Math.random() < 0.001) {
              // Small chance for a new random cell
              nextGrid[i][j] = Math.floor(Math.random() * colors.length);
            }
          }
        }
      }

      grid = nextGrid;
      animationFrameId = window.requestAnimationFrame(draw);
    }

    // Helper function to count active neighbors
    function countActiveNeighbors(x, y) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const ni = (x + i + cols) % cols;
          const nj = (y + j + rows) % rows;

          if (grid[ni][nj] >= 0) count++;
        }
      }
      return count;
    }

    // Helper function to get most common neighbor color
    function getMostCommonNeighborColor(x, y) {
      const colorCounts = [0, 0, 0, 0];

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const ni = (x + i + cols) % cols;
          const nj = (y + j + rows) % rows;

          if (grid[ni][nj] >= 0) {
            colorCounts[grid[ni][nj]]++;
          }
        }
      }

      let maxCount = 0;
      let maxColor = 0;

      for (let i = 0; i < colorCounts.length; i++) {
        if (colorCounts[i] > maxCount) {
          maxCount = colorCounts[i];
          maxColor = i;
        }
      }

      return maxColor;
    }

    // Start animation
    draw();

    // Cleanup
    return () => {
      // Cancel animation frame if component unmounts
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
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
            to="/docs/explore-patterns">
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

