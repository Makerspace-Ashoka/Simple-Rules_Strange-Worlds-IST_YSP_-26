import React, { useEffect, useMemo, useState, type FormEvent } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  loadAdminDashboard,
  updateProjectHidden,
  updateStartStateHidden,
  type AdminProjectSubmission,
  type AdminStartStateSubmission,
} from '@site/src/components/startStateGallery/startStateStorage';
import styles from './admin.module.css';

const ADMIN_PASSWORD_KEY = 'ca-workshop:admin-password';

function formatSubmittedDate(submittedAt: string) {
  const parsed = new Date(submittedAt);

  if (Number.isNaN(parsed.getTime())) {
    return submittedAt;
  }

  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function readStoredPassword() {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return '';
  }

  return window.sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '';
}

function writeStoredPassword(password: string) {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return;
  }

  if (password) {
    window.sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
  } else {
    window.sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  }
}

function visibilityLabel(permissionToShowcase: boolean, isHidden: boolean) {
  if (!permissionToShowcase) {
    return 'Private By Consent';
  }

  return isHidden ? 'Hidden By Admin' : 'Public';
}

function replaceStartState(
  submissions: AdminStartStateSubmission[],
  updated: AdminStartStateSubmission,
) {
  return submissions.map((submission) => (submission.id === updated.id ? updated : submission));
}

function replaceProject(submissions: AdminProjectSubmission[], updated: AdminProjectSubmission) {
  return submissions.map((submission) => (submission.id === updated.id ? updated : submission));
}

export default function AdminPage() {
  const { siteConfig } = useDocusaurusContext();
  const [adminPassword, setAdminPassword] = useState('');
  const [startStates, setStartStates] = useState<AdminStartStateSubmission[]>([]);
  const [projects, setProjects] = useState<AdminProjectSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});

  const summary = useMemo(() => {
    const publicStartStates = startStates.filter(
      (submission) => submission.permissionToShowcase && !submission.isHidden,
    ).length;
    const hiddenStartStates = startStates.filter(
      (submission) => submission.permissionToShowcase && submission.isHidden,
    ).length;
    const privateStartStates = startStates.filter(
      (submission) => !submission.permissionToShowcase,
    ).length;

    const publicProjects = projects.filter(
      (submission) => submission.permissionToShowcase && !submission.isHidden,
    ).length;
    const hiddenProjects = projects.filter(
      (submission) => submission.permissionToShowcase && submission.isHidden,
    ).length;
    const privateProjects = projects.filter(
      (submission) => !submission.permissionToShowcase,
    ).length;

    return {
      publicStartStates,
      hiddenStartStates,
      privateStartStates,
      publicProjects,
      hiddenProjects,
      privateProjects,
    };
  }, [projects, startStates]);

  async function refreshDashboard(password: string) {
    setLoading(true);
    setError('');

    try {
      const dashboard = await loadAdminDashboard(password);
      setStartStates(dashboard.startStates);
      setProjects(dashboard.projects);
      setReady(true);
      setStatusMessage('');
      writeStoredPassword(password);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : 'The admin dashboard could not load right now.';
      setError(message);
      setReady(false);
      setStartStates([]);
      setProjects([]);

      if (message.toLowerCase().includes('authentication')) {
        writeStoredPassword('');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedPassword = readStoredPassword();

    if (storedPassword) {
      setAdminPassword(storedPassword);
      refreshDashboard(storedPassword);
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage('');
    await refreshDashboard(adminPassword);
  }

  function handleLogout() {
    writeStoredPassword('');
    setAdminPassword('');
    setStartStates([]);
    setProjects([]);
    setReady(false);
    setError('');
    setStatusMessage('');
  }

  async function handleToggleStartState(submission: AdminStartStateSubmission) {
    if (!submission.permissionToShowcase) {
      return;
    }

    setBusyIds((current) => ({ ...current, [submission.id]: true }));
    setError('');
    setStatusMessage('');

    try {
      const updated = await updateStartStateHidden(
        submission.id,
        !submission.isHidden,
        adminPassword,
      );
      setStartStates((current) => replaceStartState(current, updated));
      setStatusMessage(
        updated.isHidden
          ? `Hidden "${updated.patternName}" from the public Start State Gallery.`
          : `Published "${updated.patternName}" to the public Start State Gallery.`,
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Could not update the start state moderation right now.',
      );
    } finally {
      setBusyIds((current) => ({ ...current, [submission.id]: false }));
    }
  }

  async function handleToggleProject(submission: AdminProjectSubmission) {
    if (!submission.permissionToShowcase) {
      return;
    }

    setBusyIds((current) => ({ ...current, [submission.id]: true }));
    setError('');
    setStatusMessage('');

    try {
      const updated = await updateProjectHidden(submission.id, !submission.isHidden, adminPassword);
      setProjects((current) => replaceProject(current, updated));
      setStatusMessage(
        updated.isHidden
          ? `Hidden ${updated.studentName}'s project from the public Project Gallery.`
          : `Published ${updated.studentName}'s project to the public Project Gallery.`,
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Could not update the project moderation right now.',
      );
    } finally {
      setBusyIds((current) => ({ ...current, [submission.id]: false }));
    }
  }

  return (
    <Layout
      title={`Admin | ${siteConfig.title}`}
      description="Moderation dashboard for workshop submissions."
    >
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Restricted Route</p>
            <Heading as="h1" className={styles.title}>
              Submission Admin
            </Heading>
            <p className={styles.subtitle}>
              Review workshop submissions, keep private entries off the public galleries, and hide or restore
              public entries without touching the database directly.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.loginPanel}>
              <div>
                <p className={styles.panelEyebrow}>Authentication</p>
                <h2 className={styles.panelTitle}>Unlock the moderation dashboard</h2>
                <p className={styles.panelBody}>
                  Enter the admin password from the deployment environment file. The password is kept only in
                  browser session storage on this device.
                </p>
              </div>

              <form className={styles.loginForm} onSubmit={handleLogin}>
                <label className={styles.formLabel} htmlFor="admin-password">
                  Admin password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  className={styles.formInput}
                  autoComplete="current-password"
                />
                <div className={styles.loginActions}>
                  <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? 'Loading…' : ready ? 'Refresh Dashboard' : 'Unlock Dashboard'}
                  </button>
                  {ready ? (
                    <button type="button" className={styles.secondaryButton} onClick={handleLogout}>
                      Log Out
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            {error ? <div className={styles.messagePanel}>{error}</div> : null}
            {statusMessage ? <div className={styles.successPanel}>{statusMessage}</div> : null}

            {ready ? (
              <>
                <section className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Start States Public</p>
                    <strong className={styles.summaryValue}>{summary.publicStartStates}</strong>
                    <p className={styles.summaryMeta}>
                      {summary.hiddenStartStates} hidden · {summary.privateStartStates} private by consent
                    </p>
                  </div>
                  <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Projects Public</p>
                    <strong className={styles.summaryValue}>{summary.publicProjects}</strong>
                    <p className={styles.summaryMeta}>
                      {summary.hiddenProjects} hidden · {summary.privateProjects} private by consent
                    </p>
                  </div>
                  <div className={styles.summaryCard}>
                    <p className={styles.summaryLabel}>Public Routes</p>
                    <div className={styles.summaryLinks}>
                      <Link className={styles.summaryLink} to="/start-state-gallery">
                        Start State Gallery
                      </Link>
                      <Link className={styles.summaryLink} to="/project-gallery">
                        Project Gallery
                      </Link>
                    </div>
                  </div>
                </section>

                <section className={styles.adminSection}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <p className={styles.panelEyebrow}>Conway Start States</p>
                      <h2 className={styles.panelTitle}>Moderate start-state submissions</h2>
                    </div>
                  </div>

                  {startStates.length === 0 ? (
                    <div className={styles.messagePanel}>No start-state submissions have been received yet.</div>
                  ) : (
                    <div className={styles.cardGrid}>
                      {startStates.map((submission) => {
                        const rowCount = submission.patternMatrix.length;
                        const colCount = submission.patternMatrix[0]?.length ?? 0;
                        const busy = Boolean(busyIds[submission.id]);

                        return (
                          <article className={styles.adminCard} key={submission.id}>
                            <div className={styles.cardHeader}>
                              <div>
                                <p className={styles.panelEyebrow}>Start State</p>
                                <h3 className={styles.cardTitle}>{submission.patternName}</h3>
                                <p className={styles.cardMeta}>
                                  {submission.studentName} · {submission.email}
                                </p>
                              </div>
                              <span className={styles.statusBadge}>
                                {visibilityLabel(submission.permissionToShowcase, submission.isHidden)}
                              </span>
                            </div>

                            <div className={styles.metaGrid}>
                              <p className={styles.metaItem}>
                                <span className={styles.metaLabel}>Submitted</span>
                                <span>{formatSubmittedDate(submission.submittedAt)}</span>
                              </p>
                              <p className={styles.metaItem}>
                                <span className={styles.metaLabel}>Grid Size</span>
                                <span>
                                  {rowCount}×{colCount}
                                </span>
                              </p>
                              <p className={styles.metaItem}>
                                <span className={styles.metaLabel}>Category</span>
                                <span>{submission.patternCategory || 'Uncategorised'}</span>
                              </p>
                              <p className={styles.metaItem}>
                                <span className={styles.metaLabel}>Showcase Permission</span>
                                <span>{submission.permissionToShowcase ? 'Granted' : 'Not granted'}</span>
                              </p>
                            </div>

                            {submission.interestingBehavior ? (
                              <div className={styles.detailBlock}>
                                <p className={styles.metaLabel}>Interesting Behavior</p>
                                <p className={styles.detailText}>{submission.interestingBehavior}</p>
                              </div>
                            ) : null}

                            {submission.projectDescription ? (
                              <div className={styles.detailBlock}>
                                <p className={styles.metaLabel}>Project Description</p>
                                <p className={styles.detailText}>{submission.projectDescription}</p>
                              </div>
                            ) : null}

                            {submission.ruleModifications ? (
                              <div className={styles.detailBlock}>
                                <p className={styles.metaLabel}>Rule Modifications</p>
                                <p className={styles.detailText}>{submission.ruleModifications}</p>
                              </div>
                            ) : null}

                            <div className={styles.cardActions}>
                              <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={() => handleToggleStartState(submission)}
                                disabled={busy || !submission.permissionToShowcase}
                              >
                                {!submission.permissionToShowcase
                                  ? 'Permission Required'
                                  : busy
                                    ? 'Saving…'
                                    : submission.isHidden
                                      ? 'Publish To Gallery'
                                      : 'Hide From Gallery'}
                              </button>
                              {submission.projectUrl ? (
                                <a
                                  className={styles.secondaryButton}
                                  href={submission.projectUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Open Project
                                </a>
                              ) : null}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className={styles.adminSection}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <p className={styles.panelEyebrow}>p5.js Projects</p>
                      <h2 className={styles.panelTitle}>Moderate project submissions</h2>
                    </div>
                  </div>

                  {projects.length === 0 ? (
                    <div className={styles.messagePanel}>No project submissions have been received yet.</div>
                  ) : (
                    <div className={styles.cardGrid}>
                      {projects.map((submission) => {
                        const busy = Boolean(busyIds[submission.id]);

                        return (
                          <article className={styles.adminCard} key={submission.id}>
                            <div className={styles.cardHeader}>
                              <div>
                                <p className={styles.panelEyebrow}>Project Link</p>
                                <h3 className={styles.cardTitle}>{submission.studentName}</h3>
                                <p className={styles.cardMeta}>{submission.email}</p>
                              </div>
                              <span className={styles.statusBadge}>
                                {visibilityLabel(submission.permissionToShowcase, submission.isHidden)}
                              </span>
                            </div>

                            <div className={styles.metaGrid}>
                              <p className={styles.metaItem}>
                                <span className={styles.metaLabel}>Submitted</span>
                                <span>{formatSubmittedDate(submission.submittedAt)}</span>
                              </p>
                              <p className={styles.metaItem}>
                                <span className={styles.metaLabel}>Showcase Permission</span>
                                <span>{submission.permissionToShowcase ? 'Granted' : 'Not granted'}</span>
                              </p>
                            </div>

                            {submission.projectDescription ? (
                              <div className={styles.detailBlock}>
                                <p className={styles.metaLabel}>Project Description</p>
                                <p className={styles.detailText}>{submission.projectDescription}</p>
                              </div>
                            ) : null}

                            {submission.ruleModifications ? (
                              <div className={styles.detailBlock}>
                                <p className={styles.metaLabel}>Rule Modifications</p>
                                <p className={styles.detailText}>{submission.ruleModifications}</p>
                              </div>
                            ) : null}

                            <div className={styles.cardActions}>
                              <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={() => handleToggleProject(submission)}
                                disabled={busy || !submission.permissionToShowcase}
                              >
                                {!submission.permissionToShowcase
                                  ? 'Permission Required'
                                  : busy
                                    ? 'Saving…'
                                    : submission.isHidden
                                      ? 'Publish To Gallery'
                                      : 'Hide From Gallery'}
                              </button>
                              <a
                                className={styles.secondaryButton}
                                href={submission.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open Project
                              </a>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            ) : null}
          </div>
        </section>
      </main>
    </Layout>
  );
}
