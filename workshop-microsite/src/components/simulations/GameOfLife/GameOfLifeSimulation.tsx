import React, { useEffect, useRef, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './gameOfLife.module.css';
import {
  createGameOfLifeSketch,
  GAME_OF_LIFE_PATTERNS,
  type GameOfLifeController,
  type GameOfLifeStats,
} from './gameOfLifeSketch';

const DEFAULT_STATS: GameOfLifeStats = {
  generation: 0,
  isRunning: false,
  speed: 10,
  cols: 80,
  rows: 60,
  liveCells: 0,
};

export default function GameOfLifeSimulation() {
  const { colorMode } = useColorMode();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<GameOfLifeController | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const [stats, setStats] = useState<GameOfLifeStats>(DEFAULT_STATS);
  const [ready, setReady] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const clearCopyFeedback = () => {
    if (typeof window !== 'undefined' && copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }
  };

  const showCopyFeedback = (state: 'copied' | 'failed') => {
    clearCopyFeedback();
    setCopyState(state);

    if (typeof window !== 'undefined') {
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopyState('idle');
        copyTimeoutRef.current = null;
      }, 1800);
    }
  };

  const copyStartState = async () => {
    const matrix = controllerRef.current?.getSeedMatrix();

    if (!matrix || typeof window === 'undefined') {
      showCopyFeedback('failed');
      return;
    }

    const text = JSON.stringify(matrix, null, 2);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', 'true');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      showCopyFeedback('copied');
    } catch {
      showCopyFeedback('failed');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current || !frameRef.current) {
      return;
    }

    let disposed = false;

    const theme =
      colorMode === 'dark'
        ? {
            background: '#0f0f10',
            dead: '#171719',
            alive: '#ffab00',
            stroke: 'rgba(245, 245, 245, 0.12)',
            hover: '#f5f5f5',
            shadow: 'rgba(255, 171, 0, 0.18)',
          }
        : {
            background: '#ffffff',
            dead: '#ffffff',
            alive: '#2c2c2c',
            stroke: 'rgba(44, 44, 44, 0.18)',
            hover: '#ffab00',
            shadow: 'rgba(44, 44, 44, 0.1)',
          };

    async function setupSketch() {
      const p5Module = await import('p5');

      if (disposed || !mountRef.current || !frameRef.current) {
        return;
      }

      const sketch = createGameOfLifeSketch({
        container: mountRef.current,
        theme,
        initialSpeed: stats.speed,
        onStatsChange: setStats,
        onReady: (controller) => {
          controllerRef.current = controller;
        },
      });

      const instance = new p5Module.default(sketch, mountRef.current);

      resizeObserverRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];

        if (!entry || !controllerRef.current) {
          return;
        }

        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        controllerRef.current.resize(width, height);
      });

      resizeObserverRef.current.observe(frameRef.current);
      const initialRect = frameRef.current.getBoundingClientRect();
      controllerRef.current?.resize(initialRect.width, initialRect.height);
      setReady(true);

      if (disposed) {
        instance.remove();
      }
    }

    setupSketch().catch(() => {
      setReady(false);
    });

    return () => {
      disposed = true;
      clearCopyFeedback();
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      controllerRef.current?.destroy();
      controllerRef.current = null;
      setReady(false);
    };
  }, [colorMode]);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Conway&apos;s Game of Life</h2>
        </div>

        <div className={styles.statusPanel}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Generation</span>
            <strong className={styles.statusValue}>{stats.generation}</strong>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Live Cells</span>
            <strong className={styles.statusValue}>{stats.liveCells}</strong>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status</span>
            <strong className={styles.statusValue}>{stats.isRunning ? 'Running' : 'Paused'}</strong>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Grid</span>
            <strong className={styles.statusValue}>
              {stats.cols}×{stats.rows}
            </strong>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.canvasColumn}>
          <div ref={frameRef} className={styles.canvasFrame}>
            <div ref={mountRef} className={styles.canvasMount} />
            {!ready ? <div className={styles.loadingState}>Loading p5 sketch…</div> : null}
          </div>
          <p className={styles.canvasHint}>
            Click to toggle a cell, or drag to draw a start state across the grid. The original
            sketch uses wraparound edges, so cells at one border still interact with the opposite
            side.
          </p>
        </div>

        <div className={styles.sidebar}>
          <section className={styles.panel}>
            <p className={styles.sectionTitle}>Controls</p>
            <div className={styles.buttonGrid}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={() => controllerRef.current?.toggleRunning()}
              >
                {stats.isRunning ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => controllerRef.current?.step()}
                disabled={stats.isRunning}
              >
                Step
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => controllerRef.current?.reset()}
              >
                Reset
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => controllerRef.current?.randomize()}
              >
                Randomize
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => controllerRef.current?.clear()}
              >
                Clear
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={copyStartState}
              >
                Copy Start State
              </button>
            </div>

            <div className={styles.sliderField}>
              <div className={styles.sliderHeader}>
                <span className={styles.sectionTitle}>Speed</span>
                <strong className={styles.sliderValue}>{stats.speed} fps</strong>
              </div>
              <input
                className={styles.slider}
                type="range"
                min="1"
                max="30"
                step="1"
                value={stats.speed}
                onChange={(event) => {
                  controllerRef.current?.setSpeed(Number(event.target.value));
                }}
              />
            </div>
          </section>

          <section className={styles.panel}>
            <p className={styles.sectionTitle}>Patterns</p>
            <div className={styles.patternGrid}>
              {GAME_OF_LIFE_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  className={`${styles.button} ${styles.patternButton}`}
                  onClick={() => controllerRef.current?.placePattern(pattern.id)}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.panel}>
            <p className={styles.sectionTitle}>What Students Are Seeing</p>
            <p className={styles.noteText}>
              The Game of Life is a deterministic cellular automaton. Each cell is either alive or
              dead, and the next generation is computed from the current neighbourhood around each
              cell.
            </p>
            <p className={styles.noteText}>
              This adaptation preserves the original sketch&apos;s toroidal behavior, so the grid wraps
              around instead of ending at the edge.
            </p>
            <p className={styles.noteText}>
              Use the mouse to draw a start state, then copy that saved seed when you want to
              submit it later.
            </p>
            {copyState !== 'idle' ? (
              <p className={copyState === 'copied' ? styles.copySuccess : styles.copyError}>
                {copyState === 'copied'
                  ? 'Start state copied as a 2D array.'
                  : 'Copy failed. Try again.'}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
