import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import SandpileGame from '@site/src/components/SandpileGame';
import styles from './sandpile-game.module.css';

export default function SandpileGamePage() {
  return (
    <Layout
      title="Sandpile Avalanche"
      description="Play an interactive Abelian sandpile game and explore how local toppling rules create avalanches.">
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Interactive Cellular Automaton</p>
            <Heading as="h1" className={styles.title}>
              Sandpile Avalanche: Can one grain change everything?
            </Heading>
            <p className={styles.lead}>
              In 1987, three physicists, Bak, Tang, and Wiesenfeld, built a very simple model to
              ask a surprisingly deep question: how does complexity arise from repetition?
            </p>
            <p className={styles.lead}>
              Their answer was a grid.
            </p>
            <p className={styles.lead}>
              Each square on the grid holds a number: the amount of sand sitting on it. One grain
              drops at a time onto a cell. Most of the time, nothing dramatic happens. The number
              just goes up by one.
            </p>
            <p className={styles.lead}>That is the whole model. One threshold. One rule. Many tiny sand dramas.</p>

            <div className={styles.rulePanel}>
              <p className={styles.ruleEyebrow}>Before You Read Too Much</p>
              <p className={styles.ruleLine}>Try playing the game first, and see if you can derive the rules.</p>
              <ul className={styles.ruleList}>
                <li>The grid uses open boundaries, so grains can fall off the edge and disappear.</li>
                <li>This stops the system from filling up forever.</li>
                <li>Basically, the sandpile can make a mess. But can this mess be infinite?</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.gameSection}>
          <div className="container">
            <SandpileGame />
          </div>
        </section>

        <section className={styles.readingSection}>
          <div className="container">
            <div className={styles.infoGrid}>
              <article className={styles.infoCard}>
                <p className={styles.cardEyebrow}>Why Avalanches Matter</p>
                <Heading as="h2" className={styles.cardTitle}>
                  Self-Organised Criticality
                </Heading>
                <p className={styles.cardText}>
                  In many physical systems, reaching a critical state requires careful tuning.
                  Boiling water needs the right temperature. A magnet needs the right magnetic
                  field. The system has to be pushed to the edge from the outside.
                </p>
                <p className={styles.cardText}>
                  The sandpile does something stranger. Without anyone adjusting it, the system
                  naturally moves toward a critical state and stays there. This is called
                  self-organised criticality.
                </p>
                <p className={styles.cardText}>
                  It means the system organises itself to the edge of stability through its own
                  rules. Once it gets there, tiny events can cause tiny avalanches, or massive
                  ones.
                </p>
                <p className={styles.cardText}>
                  For more details, check the{' '}
                  <Link to="/docs/additional-readings">Additional Readings page</Link>.
                </p>
                <p className={styles.cardText}>
                  You can also explore this visualisation:{' '}
                  <a
                    href="https://www.veritasium.com/simulation3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Veritasium Sandpile Simulation
                  </a>
                  .
                </p>
              </article>

              <article className={styles.infoCard}>
                <p className={styles.cardEyebrow}>A Bigger Idea</p>
                <Heading as="h2" className={styles.cardTitle}>
                  Why This Matters
                </Heading>
                <p className={styles.cardText}>
                  This pattern appears far beyond sandpiles. We see similar behaviour in
                  earthquakes, forest fires, avalanches, and financial crashes.
                </p>
                <p className={styles.cardText}>
                  Small events happen often. Huge events happen rarely. But both come from the
                  same kind of system: one that slowly builds pressure and suddenly releases it
                  through local interactions.
                </p>
                <p className={styles.cardText}>
                  It shows how a system can quietly pile up tension until one tiny change causes a
                  much bigger reaction.
                </p>
                <p className={styles.cardText}>
                  In other words: sometimes, one grain really can change everything.
                </p>
                <p className={styles.cardText}>
                  The sandpile model is also a cellular automaton.
                </p>
                <Heading as="h3" className={styles.questionTitle}>
                  What is an avalanche?
                </Heading>
                <p className={styles.cardText}>
                  In this model, an avalanche is the whole chain reaction caused by one grain
                  addition. One cell topples, then its neighbours might topple, then their
                  neighbours might topple, until the board becomes stable again.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
