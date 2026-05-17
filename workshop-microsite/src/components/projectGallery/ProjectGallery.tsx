import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { loadProjectSubmissions, type ProjectSubmission } from '@site/src/components/startStateGallery/startStateStorage';
import styles from './styles.module.css';

type ProjectGalleryProps = {
  showIntro?: boolean;
};

function formatSubmittedDate(submittedAt: string) {
  const parsed = new Date(submittedAt);

  if (Number.isNaN(parsed.getTime())) {
    return submittedAt;
  }

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProjectGallery({ showIntro = true }: ProjectGalleryProps) {
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const submissions = await loadProjectSubmissions();

        if (!cancelled) {
          setProjects(submissions);
          setError('');
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'The project gallery could not load right now.',
          );
          setProjects([]);
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
            <p className={styles.sectionEyebrow}>Workshop Projects</p>
            <h2 className={styles.sectionTitle}>Browse p5.js submissions from the workshop server</h2>
            <p className={styles.sectionBody}>
              These cards show the public project links shared through the submit form, along with optional
              descriptions and rule modifications.
            </p>
          </div>
          <div className={styles.rulePanel}>
            <p className={styles.ruleTitle}>Included</p>
            <p className={styles.ruleBody}>
              Only submissions where students granted showcase permission and the admin has not hidden the
              entry appear here.
            </p>
            <Link className={styles.actionLink} to="/submit?tab=project">
              Submit A Project
            </Link>
          </div>
        </section>
      ) : null}

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionEyebrow}>Public Showcase</p>
            <h2 className={styles.sectionTitle}>Project Gallery</h2>
          </div>
          <Link className={styles.actionLink} to="/submit?tab=project">
            Submit A Project
          </Link>
        </div>

        {loading ? (
          <div className={styles.messagePanel}>Loading public projects…</div>
        ) : error ? (
          <div className={styles.messagePanel}>
            Could not load the Project Gallery from the workshop server. {error}
          </div>
        ) : projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No public projects yet.</p>
            <Link className={styles.actionLink} to="/submit?tab=project">
              Go To Submit
            </Link>
          </div>
        ) : (
          <section className={styles.cardGrid} aria-label="Public project submission cards">
            {projects.map((project) => (
              <article className={styles.card} key={project.id}>
                <div className={styles.cardHeader}>
                  <div>
                    <p className={styles.cardEyebrow}>Project Submission</p>
                    <h3 className={styles.cardTitle}>{project.studentName}</h3>
                    <p className={styles.cardMeta}>{formatSubmittedDate(project.submittedAt)}</p>
                  </div>
                  <span className={styles.ruleBadge}>p5.js Web Editor</span>
                </div>

                {project.projectDescription ? (
                  <p className={styles.cardBody}>{project.projectDescription}</p>
                ) : (
                  <p className={styles.cardBody}>
                    This student shared a project link without a longer description.
                  </p>
                )}

                {project.ruleModifications ? (
                  <div className={styles.detailBlock}>
                    <p className={styles.metaLabel}>Rule Modifications</p>
                    <p className={styles.detailText}>{project.ruleModifications}</p>
                  </div>
                ) : null}

                <div className={styles.linkRow}>
                  <a
                    className={styles.primaryButton}
                    href={project.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Project
                  </a>
                  <Link className={styles.secondaryButton} to="/submit?tab=project">
                    Submit Another
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}
