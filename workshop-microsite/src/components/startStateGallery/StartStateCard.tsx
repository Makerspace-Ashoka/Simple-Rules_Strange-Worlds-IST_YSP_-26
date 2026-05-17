import React, { useEffect, useRef, useState } from 'react';
import GameOfLifeCanvas from './GameOfLifeCanvas';
import {
  cloneMatrix,
  countLiveCells,
  matrixToClipboardText,
  stepLife,
  type Matrix,
} from './gameOfLifeRules';
import type { StartStateSubmission } from './startStateStorage';
import styles from './styles.module.css';

const FPS = 8;

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

function fallbackCopy(text: string) {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

type StartStateCardProps = {
  submission: StartStateSubmission;
};

function formatCategory(category?: string) {
  const labels: Record<string, string> = {
    still_life: 'Still Life',
    oscillator: 'Oscillator',
    spaceship: 'Spaceship',
    methuselah: 'Methuselah',
    other: 'Other',
  };

  if (!category) {
    return null;
  }

  return labels[category] || category;
}

export default function StartStateCard({ submission }: StartStateCardProps) {
  const originalMatrixRef = useRef<Matrix>(cloneMatrix(submission.patternMatrix));
  const matrixRef = useRef<Matrix>(cloneMatrix(submission.patternMatrix));
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const copyFeedbackTimeoutRef = useRef<number | null>(null);
  const [generation, setGeneration] = useState(0);
  const [liveCells, setLiveCells] = useState(countLiveCells(submission.patternMatrix));
  const [isPlaying, setIsPlaying] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied' | 'failed'>('idle');

  function refreshFromMatrix(nextMatrix: Matrix, nextGeneration: number) {
    matrixRef.current = nextMatrix;
    setGeneration(nextGeneration);
    setLiveCells(countLiveCells(nextMatrix));
  }

  function handleStep() {
    const nextMatrix = stepLife(matrixRef.current);

    matrixRef.current = nextMatrix;
    setGeneration((value) => value + 1);
    setLiveCells(countLiveCells(nextMatrix));
  }

  function handleReset() {
    setIsPlaying(false);
    refreshFromMatrix(cloneMatrix(originalMatrixRef.current), 0);
  }

  async function handleCopyMatrix() {
    const text = matrixToClipboardText(matrixRef.current);
    let copied = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      copied = fallbackCopy(text);
    }

    setCopyFeedback(copied ? 'copied' : 'failed');

    if (typeof window !== 'undefined') {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }

      copyFeedbackTimeoutRef.current = window.setTimeout(() => {
        setCopyFeedback('idle');
      }, 1800);
    }
  }

  useEffect(() => {
    matrixRef.current = cloneMatrix(submission.patternMatrix);
    originalMatrixRef.current = cloneMatrix(submission.patternMatrix);
    setGeneration(0);
    setLiveCells(countLiveCells(submission.patternMatrix));
    setIsPlaying(false);
  }, [submission]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);

      return () => {
        mediaQuery.removeEventListener('change', updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);
    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleVisibility = () => {
      setPageVisible(document.visibilityState === 'visible');
    };

    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isPlaying || !pageVisible) {
      return;
    }

    const frameDuration = 1000 / (reducedMotion ? 5 : FPS);

    const tick = (time: number) => {
      if (time - lastFrameTimeRef.current >= frameDuration) {
        const nextMatrix = stepLife(matrixRef.current);
        matrixRef.current = nextMatrix;
        setGeneration((value) => value + 1);
        setLiveCells(countLiveCells(nextMatrix));
        lastFrameTimeRef.current = time;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, pageVisible, reducedMotion]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const matrix = matrixRef.current;
  const rowCount = matrix.length;
  const colCount = matrix[0]?.length ?? 0;
  const categoryLabel = formatCategory(submission.patternCategory);

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeading}>
          <p className={styles.cardEyebrow}>Student Submission</p>
          <h3 className={styles.cardTitle}>{submission.patternName}</h3>
          <p className={styles.cardMeta}>
            {submission.studentName} · {formatSubmittedDate(submission.submittedAt)}
          </p>
        </div>
        <span className={styles.ruleBadge}>Conway B3/S23</span>
      </div>

      <GameOfLifeCanvas
        matrix={matrix}
        ariaLabel={`${submission.patternName} start state Game of Life canvas`}
      />

      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Generation</span>
          <strong className={styles.statValue}>{generation}</strong>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Live Cells</span>
          <strong className={styles.statValue}>{liveCells}</strong>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Grid Size</span>
          <strong className={styles.statValue}>{rowCount}×{colCount}</strong>
        </div>
      </div>

      <div className={styles.metaList}>
        {categoryLabel ? (
          <p className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span>{categoryLabel}</span>
          </p>
        ) : null}

        {submission.projectUrl ? (
          <p className={styles.metaItem}>
            <span className={styles.metaLabel}>Project Link</span>
            <a
              className={styles.projectLink}
              href={submission.projectUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open project
            </a>
          </p>
        ) : null}
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

      {submission.interestingBehavior ? (
        <p className={styles.cardNote}>{submission.interestingBehavior}</p>
      ) : (
        <p className={styles.cardNote}>This start state is ready to evolve under Conway&apos;s rules.</p>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.controlButton} ${styles.controlPrimary}`}
          onClick={() => setIsPlaying((value) => !value)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStep}
          disabled={isPlaying}
        >
          Step
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className={`${styles.controlButton} ${styles.controlAccent}`}
          onClick={handleCopyMatrix}
        >
          Copy Matrix
        </button>
      </div>

      <p className={styles.copyFeedback} role="status" aria-live="polite">
        {copyFeedback === 'copied'
          ? 'Copied matrix.'
          : copyFeedback === 'failed'
            ? 'Copy failed.'
            : reducedMotion
              ? 'Reduced motion is on. Cards stay paused until you press Play.'
              : ' '}
      </p>
    </article>
  );
}
