import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ForestFireSimulation from '@site/src/components/ForestFireSimulation';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.title}>
          {siteConfig.title}
        </Heading>
        <p className={styles.subtitle}>{siteConfig.tagline}</p>

        <div className={styles.visualization}>
          <ForestFireSimulation />
        </div>

        <div className={styles.buttons}>
          <Link
            className={clsx('button', styles.buttonPrimary)}
            to="/docs/intro">
            Start Workshop
          </Link>
          <Link
            className={clsx('button', styles.buttonSecondary)}
            to="/docs/category/programming-fundamentals">
            Learn JavaScript
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
      <div className={styles.pageShell}>
        <HomepageHeader />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.workshopInfo}>
              <div className={styles.infoBlock}>
                <h2 className={styles.infoHeading}>About This Workshop</h2>
                <p>Learn programming by playing.</p>
                <p>
                  In this workshop, students will explore how simple rules can create surprisingly
                  complex worlds. We start with movement, patterns, games, and visual simulations,
                  then code.
                </p>
              </div>

              <div className={styles.infoBlock}>
                <h2 className={styles.infoHeading}>Requirements</h2>
                <ul className={styles.infoList}>
                  <li>A computer</li>
                  <li>Eagerness to learn ( a.k.a Yourself!!!)</li>
                </ul>
                <p className={styles.infoEmphasis}>
                  <strong>
                    <em>No prior coding experience needed.</em>
                  </strong>
                </p>
              </div>

              <div className={styles.infoBlock}>
                <h2 className={styles.infoHeading}>What We&apos;ll Do</h2>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div>
                      <span>Cellular Automata</span>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div>
                      <span>Build intuition through games</span>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div>
                      <span>See Real-World Applications</span>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div>
                      <span>Code Your Own Simulation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
