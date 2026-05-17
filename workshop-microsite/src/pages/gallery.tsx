import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './gallery.module.css';

export default function GalleryPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Gallery | ${siteConfig.title}`}
      description="Browse the different student gallery spaces in the cellular automata workshop."
    >
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Gallery Hub</p>
            <Heading as="h1" className={styles.title}>
              Gallery
            </Heading>
            <p className={styles.subtitle}>
              Browse the different ways the workshop showcases student work. Start states live in their own
              interactive Conway gallery, while project submissions live in a separate public gallery with
              links back to each student&apos;s p5.js implementation.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.cardGrid}>
              <article className={styles.galleryCard}>
                <p className={styles.cardEyebrow}>Interactive Patterns</p>
                <h2 className={styles.cardTitle}>Start State Gallery</h2>
                <p className={styles.cardBody}>
                  Run student-submitted Conway&apos;s Game of Life patterns, track generations and live cells,
                  and copy the evolving matrix back out as a readable 2D array.
                </p>
                <Link className={styles.cardButton} to="/start-state-gallery">
                  Open Start State Gallery
                </Link>
              </article>

              <article className={styles.galleryCard}>
                <p className={styles.cardEyebrow}>Projects</p>
                <h2 className={styles.cardTitle}>Project Gallery</h2>
                <p className={styles.cardBody}>
                  Browse the public p5.js submissions collected through the workshop server, including each
                  student&apos;s description and any rule modifications they chose to share.
                </p>
                <Link className={styles.cardButtonSecondary} to="/project-gallery">
                  Open Project Gallery
                </Link>
              </article>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
