import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import GameOfLifeSimulation from '@site/src/components/simulations/GameOfLife/GameOfLifeSimulation';
import styles from './game-of-life.module.css';

export default function GameOfLifePage() {
  return (
    <Layout
      title="Game of Life"
      description="Explore an interactive p5.js adaptation of Conway's Game of Life inside the workshop site.">
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Interactive Cellular Automaton</p>
            <Heading as="h1" className={styles.title}>
              Game of Life
            </Heading>
            <p className={styles.subtitle}>
              Conway&apos;s Game of Life is a deterministic cellular automaton where every cell checks
              its neighbours, updates at the same time, and helps generate larger moving patterns
              from simple local rules.
            </p>
          </div>
        </section>

        <section className={styles.simulationSection}>
          <div className="container">
            <div className={styles.simulationPanel}>
              <GameOfLifeSimulation />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
