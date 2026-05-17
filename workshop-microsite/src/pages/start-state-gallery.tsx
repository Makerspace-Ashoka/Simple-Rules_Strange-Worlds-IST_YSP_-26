import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import StartStateGallery from '@site/src/components/startStateGallery/StartStateGallery';
import styles from './start-state-gallery.module.css';

export default function StartStateGalleryPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Start State Gallery | ${siteConfig.title}`}
      description="Explore student-submitted Conway's Game of Life starting patterns."
    >
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Interactive Gallery</p>
            <Heading as="h1" className={styles.title}>
              Start State Gallery
            </Heading>
            <p className={styles.subtitle}>
              Explore student-submitted Conway&apos;s Game of Life starting patterns. Each card keeps the
              original matrix, runs the B3/S23 rule, and lets you play, step, reset, or copy the current
              grid back out as a readable matrix.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <StartStateGallery showIntro={false} />
          </div>
        </section>
      </main>
    </Layout>
  );
}
