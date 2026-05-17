import React, { useEffect, useRef, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import CellularAutomataCanvas, { type CanvasCellEvent } from './CellularAutomataCanvas';
import PopulationGraph from './PopulationGraph';
import SimulationControls from './SimulationControls';
import {
  cappedHistory,
  chance,
  countNeighbours,
  countPopulation,
  createGrid,
  randomInt,
  stepGrid,
} from './caRules';
import styles from './styles.module.css';

const COLS = 78;
const ROWS = 54;
const FPS = 10;
const HISTORY_LIMIT = 200;

const EMPTY = 0;
const PREY = 1;
const PREDATOR = 2;
const CLEARED = 3;
const CLEARED_LIFETIME = 8;

type PredatorPreyParams = {
  preyGrowth: number;
  predatorKill: number;
  predatorSpread: number;
  predatorDeath: number;
};

type PredatorPreyPresetId =
  | 'predator-island'
  | 'battle-line'
  | 'random-ecosystem'
  | 'prey-refuge'
  | 'predator-overload';

type PredatorPreyHistoryEntry = {
  step: number;
  prey: number;
  predator: number;
  empty: number;
  cleared: number;
};

type PredatorPreyStepContext = {
  clearedAge: Int16Array;
  nextClearedAge: Int16Array;
  highlightMask: Uint8Array;
};

const DEFAULT_PARAMS: PredatorPreyParams = {
  preyGrowth: 0.18,
  predatorKill: 0.35,
  predatorSpread: 0.22,
  predatorDeath: 0.015,
};

const PRESET_OPTIONS: Array<{
  value: PredatorPreyPresetId;
  label: string;
}> = [
  { value: 'predator-island', label: 'Predator island' },
  { value: 'battle-line', label: 'Battle line' },
  { value: 'random-ecosystem', label: 'Random ecosystem' },
  { value: 'prey-refuge', label: 'Prey refuge' },
  { value: 'predator-overload', label: 'Predator overload' },
];

const GRAPH_SERIES = [
  { key: 'prey', label: 'Prey', color: '#42a55a' },
  { key: 'predator', label: 'Predator', color: '#d94b45' },
  { key: 'empty', label: 'Empty', color: '#8f8f8f' },
  { key: 'cleared', label: 'Cleared', color: '#b8b8b8' },
];

function populationSnapshot(grid: Uint8Array): PredatorPreyHistoryEntry {
  const counts = countPopulation(grid, [EMPTY, PREY, PREDATOR, CLEARED]);

  return {
    step: 0,
    prey: counts[PREY] ?? 0,
    predator: counts[PREDATOR] ?? 0,
    empty: counts[EMPTY] ?? 0,
    cleared: counts[CLEARED] ?? 0,
  };
}

function seedRandomEcosystem(initialPredatorDensity = 0.03, initialPreyDensity = 0.55) {
  return createGrid(COLS, ROWS, () => {
    if (chance(initialPredatorDensity)) {
      return PREDATOR;
    }

    if (chance(initialPreyDensity)) {
      return PREY;
    }

    return EMPTY;
  });
}

function createPredatorPreyBoard(preset: PredatorPreyPresetId, randomizeOnly = false) {
  const clearedAge = new Int16Array(COLS * ROWS);

  if (randomizeOnly || preset === 'random-ecosystem') {
    return {
      grid: seedRandomEcosystem(),
      clearedAge,
    };
  }

  if (preset === 'predator-overload') {
    return {
      grid: seedRandomEcosystem(0.12, 0.38),
      clearedAge,
    };
  }

  if (preset === 'predator-island') {
    const grid = seedRandomEcosystem(0, 0.62);
    const centerX = Math.floor(COLS / 2);
    const centerY = Math.floor(ROWS / 2);
    const radius = 6;

    for (let y = centerY - radius; y <= centerY + radius; y += 1) {
      for (let x = centerX - radius; x <= centerX + radius; x += 1) {
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
          continue;
        }

        const distance = Math.hypot(centerX - x, centerY - y);

        if (distance <= radius && chance(0.68)) {
          grid[y * COLS + x] = PREDATOR;
        }
      }
    }

    return { grid, clearedAge };
  }

  if (preset === 'battle-line') {
    const grid = createGrid(COLS, ROWS, (x, y) => {
      if (x < Math.floor(COLS * 0.45)) {
        return y % 2 === 0 || chance(0.78) ? PREY : EMPTY;
      }

      if (x > Math.floor(COLS * 0.55)) {
        return y % 3 === 0 || chance(0.18) ? PREDATOR : EMPTY;
      }

      return EMPTY;
    });

    return { grid, clearedAge };
  }

  const grid = createGrid(COLS, ROWS, () => EMPTY);

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const index = y * COLS + x;
      const cornerDistance = Math.min(
        Math.hypot(x - 10, y - 10),
        Math.hypot(x - (COLS - 11), y - 10),
        Math.hypot(x - 10, y - (ROWS - 11)),
        Math.hypot(x - (COLS - 11), y - (ROWS - 11)),
      );

      const centerDistance = Math.hypot(x - COLS / 2, y - ROWS / 2);

      if (cornerDistance < 9 && chance(0.75)) {
        grid[index] = PREY;
      } else if (centerDistance < 8 && chance(0.32)) {
        grid[index] = PREDATOR;
      } else if (chance(0.18)) {
        grid[index] = PREY;
      }
    }
  }

  return { grid, clearedAge };
}

export default function PredatorPreySimulation() {
  const { colorMode } = useColorMode();
  const gridRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const clearedAgeRef = useRef<Int16Array>(new Int16Array(COLS * ROWS));
  const highlightMaskRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const interactionChangedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const historyStepRef = useRef(0);
  const paramsRef = useRef<PredatorPreyParams>(DEFAULT_PARAMS);
  const [preset, setPreset] = useState<PredatorPreyPresetId>('random-ecosystem');
  const [params, setParams] = useState<PredatorPreyParams>(DEFAULT_PARAMS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [revision, setRevision] = useState(0);
  const [history, setHistory] = useState<PredatorPreyHistoryEntry[]>([]);

  paramsRef.current = params;

  const palette = colorMode === 'dark'
    ? {
        [EMPTY]: { fill: '#111113' },
        [PREY]: { fill: '#42a55a' },
        [PREDATOR]: { fill: '#d94b45' },
        [CLEARED]: { fill: '#8f8f8f' },
      }
    : {
        [EMPTY]: { fill: '#ededed' },
        [PREY]: { fill: '#42a55a' },
        [PREDATOR]: { fill: '#d94b45' },
        [CLEARED]: { fill: '#b3b3b3' },
      };

  function replaceHistoryWithCurrentGrid() {
    historyStepRef.current = 0;
    setHistory([{ ...populationSnapshot(gridRef.current), step: 0 }]);
  }

  function pushHistorySnapshot() {
    historyStepRef.current += 1;
    const nextEntry = {
      ...populationSnapshot(gridRef.current),
      step: historyStepRef.current,
    };

    setHistory((previous) => cappedHistory(previous, nextEntry, HISTORY_LIMIT));
  }

  function refreshRender(pushHistory = false) {
    if (pushHistory) {
      pushHistorySnapshot();
    }

    setRevision((value) => value + 1);
  }

  function initializeBoard(nextPreset: PredatorPreyPresetId, randomizeOnly = false) {
    const { grid, clearedAge } = createPredatorPreyBoard(nextPreset, randomizeOnly);

    gridRef.current = grid;
    clearedAgeRef.current = clearedAge;
    highlightMaskRef.current = new Uint8Array(COLS * ROWS);
    replaceHistoryWithCurrentGrid();
    setRevision((value) => value + 1);
  }

  function stepSimulation() {
    const nextClearedAge = new Int16Array(COLS * ROWS);
    const nextHighlightMask = new Uint8Array(COLS * ROWS);
    const paramsSnapshot = paramsRef.current;

    const nextGrid = stepGrid(
      gridRef.current,
      COLS,
      ROWS,
      (grid, nextGridState, x, y, index, ruleParams, context: PredatorPreyStepContext) => {
        const state = grid[index];
        const preyNeighbours = countNeighbours(grid, COLS, ROWS, x, y, PREY, 'Moore');
        const predatorNeighbours = countNeighbours(grid, COLS, ROWS, x, y, PREDATOR, 'Moore');

        if (state === EMPTY) {
          const predatorSpreadChance = predatorNeighbours > 0
            ? 1 - (1 - ruleParams.predatorSpread) ** predatorNeighbours
            : 0;
          const preyGrowthChance = preyNeighbours > 0
            ? 1 - (1 - ruleParams.preyGrowth) ** preyNeighbours
            : 0;

          if (predatorNeighbours > 0 && chance(predatorSpreadChance)) {
            nextGridState[index] = PREDATOR;
            context.highlightMask[index] = 1;
            return;
          }

          if (preyNeighbours > 0 && chance(preyGrowthChance)) {
            nextGridState[index] = PREY;
            context.highlightMask[index] = 1;
            return;
          }

          nextGridState[index] = EMPTY;
          return;
        }

        if (state === PREY) {
          const killProbability = predatorNeighbours > 0
            ? 1 - (1 - ruleParams.predatorKill) ** predatorNeighbours
            : 0;

          if (predatorNeighbours > 0 && chance(killProbability)) {
            nextGridState[index] = CLEARED;
            context.nextClearedAge[index] = CLEARED_LIFETIME;
            context.highlightMask[index] = 1;
            return;
          }

          nextGridState[index] = PREY;
          return;
        }

        if (state === PREDATOR) {
          if (chance(ruleParams.predatorDeath)) {
            nextGridState[index] = EMPTY;
            context.highlightMask[index] = 1;
            return;
          }

          nextGridState[index] = PREDATOR;
          return;
        }

        const predatorSpreadChance = predatorNeighbours > 0
          ? 1 - (1 - ruleParams.predatorSpread) ** predatorNeighbours
          : 0;

        if (predatorNeighbours > 0 && chance(predatorSpreadChance)) {
          nextGridState[index] = PREDATOR;
          context.highlightMask[index] = 1;
          return;
        }

        const nextAge = context.clearedAge[index] - 1;

        if (nextAge > 0) {
          nextGridState[index] = CLEARED;
          context.nextClearedAge[index] = nextAge;
          return;
        }

        nextGridState[index] = EMPTY;
      },
      paramsSnapshot,
      {
        clearedAge: clearedAgeRef.current,
        nextClearedAge,
        highlightMask: nextHighlightMask,
      },
    );

    gridRef.current = nextGrid;
    clearedAgeRef.current = nextClearedAge;
    highlightMaskRef.current = nextHighlightMask;
    refreshRender(true);
  }

  function paintCell(index: number, shiftKey: boolean) {
    const nextState = shiftKey ? PREY : PREDATOR;

    if (gridRef.current[index] === nextState) {
      return false;
    }

    gridRef.current[index] = nextState;
    clearedAgeRef.current[index] = 0;
    highlightMaskRef.current[index] = 1;
    return true;
  }

  function clearGrid() {
    gridRef.current = new Uint8Array(COLS * ROWS);
    clearedAgeRef.current = new Int16Array(COLS * ROWS);
    highlightMaskRef.current = new Uint8Array(COLS * ROWS);
    replaceHistoryWithCurrentGrid();
    setRevision((value) => value + 1);
  }

  useEffect(() => {
    initializeBoard('random-ecosystem');
  }, []);

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
    if (reducedMotion) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isPlaying || !pageVisible || reducedMotion) {
      return;
    }

    const frameDuration = 1000 / FPS;

    const tick = (time: number) => {
      if (time - lastFrameTimeRef.current >= frameDuration) {
        stepSimulation();
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

  const latestCounts = history[history.length - 1] ?? {
    step: 0,
    prey: 0,
    predator: 0,
    empty: 0,
    cleared: 0,
  };

  return (
    <div className={styles.simulationShell}>
      <div className={styles.simulationHeader}>
        <div>
          <p className={styles.eyebrow}>Predator–Prey</p>
          <h2 className={styles.simulationTitle}>Competition, waves, and coexistence</h2>
          <p className={styles.simulationLead}>
            This model shows how local competition can create waves, patches, extinction, or coexistence. Each cell only follows simple rules, but the whole system can produce complex ecological behaviour.
          </p>
        </div>
        <span className={styles.statusBadge}>
          {isPlaying ? 'Playing' : 'Paused'} • Prey {latestCounts.prey} • Predator {latestCounts.predator}
        </span>
      </div>

      <div className={styles.simulationLayout}>
        <div className={styles.canvasColumn}>
          <CellularAutomataCanvas
            ariaLabel="Predator prey cellular automata grid"
            cols={COLS}
            rows={ROWS}
            grid={gridRef.current}
            revision={revision}
            palette={palette}
            backgroundColor={colorMode === 'dark' ? '#0f0f10' : '#ffffff'}
            borderColor={colorMode === 'dark' ? '#f5f5f5' : '#2c2c2c'}
            gridColor={colorMode === 'dark' ? 'rgba(245, 245, 245, 0.08)' : 'rgba(44, 44, 44, 0.08)'}
            highlightMask={highlightMaskRef.current}
            targetColor="#ffab00"
            onCellPointerDown={(cell) => {
              interactionChangedRef.current = false;

              if (paintCell(cell.index, cell.shiftKey)) {
                interactionChangedRef.current = true;
                setRevision((value) => value + 1);
              }
            }}
            onCellPointerDrag={(cell) => {
              if (paintCell(cell.index, cell.shiftKey)) {
                interactionChangedRef.current = true;
                setRevision((value) => value + 1);
              }
            }}
            onCellPointerUp={() => {
              if (interactionChangedRef.current) {
                refreshRender(true);
              }

              interactionChangedRef.current = false;
            }}
          />
          <p className={styles.canvasHint}>
            Click to add a predator. Hold Shift while clicking or dragging to paint prey. Try changing the rule sliders to see when the ecosystem collapses or stabilizes.
          </p>

          <section className={styles.legendPanel} aria-label="Predator prey legend">
            <p className={styles.sectionTitle}>Cell Legend</p>
            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#42a55a' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Prey</span>
                  <span className={styles.legendHint}>Spreads into nearby empty space</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#d94b45' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Predator</span>
                  <span className={styles.legendHint}>Kills prey and can spread</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#b3b3b3' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Cleared</span>
                  <span className={styles.legendHint}>Recently killed territory</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: colorMode === 'dark' ? '#111113' : '#ededed' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Empty</span>
                  <span className={styles.legendHint}>Available habitat</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <SimulationControls
            actions={[
              {
                id: 'play',
                label: isPlaying ? 'Pause' : 'Play',
                onClick: () => setIsPlaying((value) => !value),
                tone: 'primary',
              },
              {
                id: 'step',
                label: 'Step',
                onClick: stepSimulation,
                disabled: isPlaying,
                tone: 'secondary',
              },
              {
                id: 'reset',
                label: 'Reset',
                onClick: () => initializeBoard(preset),
              },
              {
                id: 'randomize',
                label: 'Randomize',
                onClick: () => initializeBoard('random-ecosystem', true),
                tone: 'secondary',
              },
              {
                id: 'clear',
                label: 'Clear',
                onClick: clearGrid,
                tone: 'secondary',
              },
              {
                id: 'seed',
                label: 'Seed pattern',
                onClick: () => initializeBoard(preset),
              },
            ]}
            selects={[
              {
                id: 'predator-prey-preset',
                label: 'Seed pattern',
                value: preset,
                options: PRESET_OPTIONS,
                onChange: (value) => {
                  setPreset(value as PredatorPreyPresetId);
                },
              },
            ]}
            sliders={[
              {
                id: 'prey-growth',
                label: 'Prey growth',
                min: 0,
                max: 1,
                step: 0.01,
                value: params.preyGrowth,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    preyGrowth: value,
                  }));
                },
                formatValue: (value) => value.toFixed(2),
              },
              {
                id: 'predator-kill',
                label: 'Predator kill',
                min: 0,
                max: 1,
                step: 0.01,
                value: params.predatorKill,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    predatorKill: value,
                  }));
                },
                formatValue: (value) => value.toFixed(2),
              },
              {
                id: 'predator-spread',
                label: 'Predator spread',
                min: 0,
                max: 1,
                step: 0.01,
                value: params.predatorSpread,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    predatorSpread: value,
                  }));
                },
                formatValue: (value) => value.toFixed(2),
              },
              {
                id: 'predator-death',
                label: 'Predator death',
                min: 0,
                max: 0.1,
                step: 0.001,
                value: params.predatorDeath,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    predatorDeath: value,
                  }));
                },
                formatValue: (value) => value.toFixed(3),
              },
            ]}
          />

          <PopulationGraph
            title="Population over time"
            ariaLabel="Predator prey population graph"
            history={history}
            series={GRAPH_SERIES}
          />

          <section className={styles.notePanel}>
            <p className={styles.sectionTitle}>Student Question</p>
            <p className={styles.noteText}>
              Can predator and prey coexist, or does one always eliminate the other?
            </p>
            <p className={styles.questionText}>
              Try increasing predator death, then compare it with a higher predator spread to see when waves collapse.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
