import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ProjectGallery from '@site/src/components/projectGallery/ProjectGallery';
import styles from './start-state-gallery.module.css';

export default function ProjectGalleryPage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Project Gallery | ${siteConfig.title}`}
      description="Browse public p5.js project submissions from the cellular automata workshop."
    >
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Interactive Gallery</p>
            <Heading as="h1" className={styles.title}>
              Project Gallery
            </Heading>
            <p className={styles.subtitle}>
              Explore the public p5.js projects submitted through the workshop. Each card links back to the
              student&apos;s editor project and keeps any description or rule changes they chose to share.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <ProjectGallery showIntro={false} />
          </div>
        </section>
      </main>
    </Layout>
  );
}
