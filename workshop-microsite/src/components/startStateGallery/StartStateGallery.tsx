import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import StartStateCard from './StartStateCard';
import { loadStartStateSubmissions, type StartStateSubmission } from './startStateStorage';
import styles from './styles.module.css';

type StartStateGalleryProps = {
  showIntro?: boolean;
};

export default function StartStateGallery({ showIntro = true }: StartStateGalleryProps) {
  const [startStates, setStartStates] = useState<StartStateSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const submissions = await loadStartStateSubmissions();

        if (!cancelled) {
          setStartStates(submissions);
          setError('');
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'The gallery could not load start states right now.',
          );
          setStartStates([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.galleryShell}>
      {showIntro ? (
        <section className={styles.introPanel}>
          <div>
            <p className={styles.sectionEyebrow}>Conway Start States</p>
            <h2 className={styles.sectionTitle}>Run each submitted pattern as its own simulation card</h2>
            <p className={styles.sectionBody}>
              Every card starts from the submitted matrix, evolves with Conway&apos;s Game of Life rules, and
              lets students pause, step, reset, or copy the current state as a readable matrix.
            </p>
          </div>
          <div className={styles.rulePanel}>
            <p className={styles.ruleTitle}>Rule</p>
            <p className={styles.ruleBody}>
              Live cells survive with 2 or 3 neighbours. Dead cells become alive with exactly 3 neighbours.
            </p>
            <Link className={styles.submitLink} to="/submit?tab=patterns">
              Submit A Start State
            </Link>
          </div>
        </section>
      ) : null}

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionEyebrow}>Student Submissions</p>
            <h2 className={styles.sectionTitle}>Start states saved from the workshop server</h2>
            <p className={styles.sectionBody}>
              These cards come from the live submission API and keep the original matrix available for reset
              and copy.
            </p>
          </div>
          <Link className={styles.submitLink} to="/submit?tab=patterns">
            Submit A Start State
          </Link>
        </div>

        {loading ? (
          <div className={styles.messagePanel}>Loading student start states…</div>
        ) : error ? (
          <div className={styles.messagePanel}>
            Could not load the Start State Gallery from the workshop server. {error}
          </div>
        ) : startStates.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No start states submitted yet.</p>
            <p className={styles.emptyBody}>
              Save a Conway matrix from the submit form to see it appear here as a playable simulation card.
            </p>
            <Link className={styles.submitLink} to="/submit?tab=patterns">
              Go To Submit
            </Link>
          </div>
        ) : (
          <section className={styles.cardGrid} aria-label="Student submitted start state cards">
            {startStates.map((submission) => (
              <StartStateCard key={submission.id} submission={submission} />
            ))}
          </section>
        )}
      </section>
    </div>
  );
}
