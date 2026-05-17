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

const COLS = 80;
const ROWS = 56;
const FPS = 10;
const HISTORY_LIMIT = 200;

const EMPTY = 0;
const SUSCEPTIBLE = 1;
const INFECTED = 2;
const RECOVERED = 3;
const BARRIER = 4;

type PandemicPresetId =
  | 'no-intervention'
  | 'quarantine-wall'
  | 'high-transmission'
  | 'low-transmission'
  | 'multiple-outbreaks';

type PandemicParams = {
  infectionRate: number;
  recoveryTime: number;
  populationDensity: number;
};

type PandemicHistoryEntry = {
  step: number;
  susceptible: number;
  infected: number;
  recovered: number;
};

type PandemicStepContext = {
  infectionAge: Int16Array;
  nextInfectionAge: Int16Array;
  highlightMask: Uint8Array;
};

const PRESET_OPTIONS: Array<{
  value: PandemicPresetId;
  label: string;
}> = [
  { value: 'no-intervention', label: 'No intervention' },
  { value: 'quarantine-wall', label: 'Quarantine wall' },
  { value: 'high-transmission', label: 'High transmission' },
  { value: 'low-transmission', label: 'Low transmission' },
  { value: 'multiple-outbreaks', label: 'Multiple outbreaks' },
];

const PRESET_DEFAULTS: Record<PandemicPresetId, PandemicParams> = {
  'no-intervention': {
    infectionRate: 0.25,
    recoveryTime: 20,
    populationDensity: 0.75,
  },
  'quarantine-wall': {
    infectionRate: 0.25,
    recoveryTime: 22,
    populationDensity: 0.78,
  },
  'high-transmission': {
    infectionRate: 0.55,
    recoveryTime: 26,
    populationDensity: 0.82,
  },
  'low-transmission': {
    infectionRate: 0.12,
    recoveryTime: 16,
    populationDensity: 0.7,
  },
  'multiple-outbreaks': {
    infectionRate: 0.3,
    recoveryTime: 24,
    populationDensity: 0.78,
  },
};

const GRAPH_SERIES = [
  { key: 'susceptible', label: 'Susceptible', color: '#4f83ff' },
  { key: 'infected', label: 'Infected', color: '#d94b45' },
  { key: 'recovered', label: 'Recovered', color: '#8a8a8a' },
];

function populationSnapshot(grid: Uint8Array): PandemicHistoryEntry {
  const counts = countPopulation(grid, [EMPTY, SUSCEPTIBLE, INFECTED, RECOVERED, BARRIER]);

  return {
    step: 0,
    susceptible: counts[SUSCEPTIBLE] ?? 0,
    infected: counts[INFECTED] ?? 0,
    recovered: counts[RECOVERED] ?? 0,
  };
}

function applyBarrierWall(grid: Uint8Array) {
  const wallX = Math.floor(COLS * 0.52);

  for (let y = 0; y < ROWS; y += 1) {
    const gate = y % 13 === 5 || y % 13 === 6;

    if (gate) {
      continue;
    }

    grid[y * COLS + wallX] = BARRIER;

    if (wallX + 1 < COLS && y % 6 !== 0) {
      grid[y * COLS + wallX + 1] = BARRIER;
    }
  }
}

function infectIndex(grid: Uint8Array, infectionAge: Int16Array, index: number) {
  if (grid[index] !== SUSCEPTIBLE) {
    return false;
  }

  grid[index] = INFECTED;
  infectionAge[index] = 0;
  return true;
}

function infectRandomSusceptible(
  grid: Uint8Array,
  infectionAge: Int16Array,
  count: number,
  predicate?: (index: number) => boolean,
) {
  const susceptibleIndices: number[] = [];

  for (let index = 0; index < grid.length; index += 1) {
    if (grid[index] === SUSCEPTIBLE && (!predicate || predicate(index))) {
      susceptibleIndices.push(index);
    }
  }

  for (let remaining = count; remaining > 0 && susceptibleIndices.length > 0; remaining -= 1) {
    const pick = randomInt(0, susceptibleIndices.length);
    const [index] = susceptibleIndices.splice(pick, 1);
    infectIndex(grid, infectionAge, index);
  }
}

function infectCluster(
  grid: Uint8Array,
  infectionAge: Int16Array,
  centerX: number,
  centerY: number,
  radius = 1,
) {
  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const x = centerX + offsetX;
      const y = centerY + offsetY;

      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
        continue;
      }

      infectIndex(grid, infectionAge, y * COLS + x);
    }
  }
}

function createPandemicBoard(
  preset: PandemicPresetId,
  params: PandemicParams,
  randomizeOnly = false,
) {
  const grid = createGrid(COLS, ROWS, () => (chance(params.populationDensity) ? SUSCEPTIBLE : EMPTY));
  const infectionAge = new Int16Array(COLS * ROWS);

  if (preset === 'quarantine-wall' && !randomizeOnly) {
    applyBarrierWall(grid);
    infectRandomSusceptible(grid, infectionAge, 2, (index) => index % COLS < Math.floor(COLS * 0.45));
    infectRandomSusceptible(grid, infectionAge, 1, (index) => index % COLS > Math.floor(COLS * 0.58));
    return { grid, infectionAge };
  }

  if (preset === 'multiple-outbreaks' && !randomizeOnly) {
    const centers: Array<[number, number]> = [
      [Math.floor(COLS * 0.22), Math.floor(ROWS * 0.28)],
      [Math.floor(COLS * 0.73), Math.floor(ROWS * 0.34)],
      [Math.floor(COLS * 0.4), Math.floor(ROWS * 0.74)],
      [Math.floor(COLS * 0.76), Math.floor(ROWS * 0.7)],
    ];

    centers.forEach(([x, y]) => {
      infectCluster(grid, infectionAge, x, y, 1);
    });

    return { grid, infectionAge };
  }

  if (preset === 'high-transmission' && !randomizeOnly) {
    infectRandomSusceptible(grid, infectionAge, 5);
    return { grid, infectionAge };
  }

  if (preset === 'low-transmission' && !randomizeOnly) {
    infectRandomSusceptible(grid, infectionAge, 2);
    return { grid, infectionAge };
  }

  infectRandomSusceptible(grid, infectionAge, 3);
  return { grid, infectionAge };
}

export default function PandemicSimulation() {
  const { colorMode } = useColorMode();
  const gridRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const infectionAgeRef = useRef<Int16Array>(new Int16Array(COLS * ROWS));
  const highlightMaskRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const historyStepRef = useRef(0);
  const paramsRef = useRef<PandemicParams>(PRESET_DEFAULTS['no-intervention']);
  const pendingCellRef = useRef<number | null>(null);
  const isDraggingBarrierRef = useRef(false);
  const dragChangedRef = useRef(false);
  const [preset, setPreset] = useState<PandemicPresetId>('no-intervention');
  const [params, setParams] = useState<PandemicParams>(PRESET_DEFAULTS['no-intervention']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [revision, setRevision] = useState(0);
  const [history, setHistory] = useState<PandemicHistoryEntry[]>([]);

  paramsRef.current = params;

  const palette = colorMode === 'dark'
    ? {
        [EMPTY]: { fill: '#171719' },
        [SUSCEPTIBLE]: { fill: '#4f83ff' },
        [INFECTED]: { fill: '#d94b45' },
        [RECOVERED]: { fill: '#8a8a8a' },
        [BARRIER]: { fill: '#050505' },
      }
    : {
        [EMPTY]: { fill: '#e8e8e8' },
        [SUSCEPTIBLE]: { fill: '#4f83ff' },
        [INFECTED]: { fill: '#d94b45' },
        [RECOVERED]: { fill: '#8a8a8a' },
        [BARRIER]: { fill: '#111111' },
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

  function initializeBoard(nextPreset: PandemicPresetId, nextParams: PandemicParams, randomizeOnly = false) {
    const { grid, infectionAge } = createPandemicBoard(nextPreset, nextParams, randomizeOnly);

    gridRef.current = grid;
    infectionAgeRef.current = infectionAge;
    highlightMaskRef.current = new Uint8Array(COLS * ROWS);
    replaceHistoryWithCurrentGrid();
    setRevision((value) => value + 1);
  }

  function stepSimulation() {
    const paramsSnapshot = paramsRef.current;
    const nextInfectionAge = new Int16Array(COLS * ROWS);
    const nextHighlightMask = new Uint8Array(COLS * ROWS);

    const nextGrid = stepGrid(
      gridRef.current,
      COLS,
      ROWS,
      (grid, nextGridState, x, y, index, ruleParams, context: PandemicStepContext) => {
        const state = grid[index];

        if (state === EMPTY || state === BARRIER || state === RECOVERED) {
          nextGridState[index] = state;
          return;
        }

        if (state === INFECTED) {
          const age = context.infectionAge[index] + 1;

          if (age >= ruleParams.recoveryTime) {
            nextGridState[index] = RECOVERED;
            context.highlightMask[index] = 1;
            return;
          }

          nextGridState[index] = INFECTED;
          context.nextInfectionAge[index] = age;
          return;
        }

        const infectedNeighbours = countNeighbours(grid, COLS, ROWS, x, y, INFECTED, 'Moore');

        if (infectedNeighbours === 0) {
          nextGridState[index] = SUSCEPTIBLE;
          return;
        }

        const infectionProbability = 1 - (1 - ruleParams.infectionRate) ** infectedNeighbours;

        if (chance(infectionProbability)) {
          nextGridState[index] = INFECTED;
          context.nextInfectionAge[index] = 0;
          context.highlightMask[index] = 1;
          return;
        }

        nextGridState[index] = SUSCEPTIBLE;
      },
      paramsSnapshot,
      {
        infectionAge: infectionAgeRef.current,
        nextInfectionAge,
        highlightMask: nextHighlightMask,
      },
    );

    gridRef.current = nextGrid;
    infectionAgeRef.current = nextInfectionAge;
    highlightMaskRef.current = nextHighlightMask;
    refreshRender(true);
  }

  function clearGrid() {
    gridRef.current = new Uint8Array(COLS * ROWS);
    infectionAgeRef.current = new Int16Array(COLS * ROWS);
    highlightMaskRef.current = new Uint8Array(COLS * ROWS);
    replaceHistoryWithCurrentGrid();
    setRevision((value) => value + 1);
  }

  function randomizeBoard() {
    initializeBoard(preset, paramsRef.current, true);
  }

  function addOutbreak() {
    infectRandomSusceptible(gridRef.current, infectionAgeRef.current, 3);
    highlightMaskRef.current = new Uint8Array(COLS * ROWS);
    refreshRender(true);
  }

  function clearBarriers() {
    for (let index = 0; index < gridRef.current.length; index += 1) {
      if (gridRef.current[index] === BARRIER) {
        gridRef.current[index] = chance(paramsRef.current.populationDensity) ? SUSCEPTIBLE : EMPTY;
        infectionAgeRef.current[index] = 0;
      }
    }

    highlightMaskRef.current = new Uint8Array(COLS * ROWS);
    refreshRender(true);
  }

  function applyBarrier(index: number) {
    if (gridRef.current[index] === BARRIER) {
      return false;
    }

    gridRef.current[index] = BARRIER;
    infectionAgeRef.current[index] = 0;
    highlightMaskRef.current[index] = 1;
    return true;
  }

  function handlePointerDown(cell: CanvasCellEvent) {
    pendingCellRef.current = cell.index;
    isDraggingBarrierRef.current = false;
    dragChangedRef.current = false;
  }

  function handlePointerDrag(cell: CanvasCellEvent) {
    if (!isDraggingBarrierRef.current) {
      isDraggingBarrierRef.current = true;

      if (pendingCellRef.current !== null && applyBarrier(pendingCellRef.current)) {
        dragChangedRef.current = true;
      }
    }

    if (applyBarrier(cell.index)) {
      dragChangedRef.current = true;
      setRevision((value) => value + 1);
    }
  }

  function handlePointerUp(cell: CanvasCellEvent | null) {
    if (isDraggingBarrierRef.current) {
      if (dragChangedRef.current) {
        refreshRender(true);
      }
    } else if (pendingCellRef.current !== null) {
      const targetIndex = cell?.index ?? pendingCellRef.current;

      if (infectIndex(gridRef.current, infectionAgeRef.current, targetIndex)) {
        highlightMaskRef.current = new Uint8Array(COLS * ROWS);
        highlightMaskRef.current[targetIndex] = 1;
        refreshRender(true);
      }
    }

    pendingCellRef.current = null;
    isDraggingBarrierRef.current = false;
    dragChangedRef.current = false;
  }

  useEffect(() => {
    initializeBoard('no-intervention', PRESET_DEFAULTS['no-intervention']);
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
    susceptible: 0,
    infected: 0,
    recovered: 0,
  };

  return (
    <div className={styles.simulationShell}>
      <div className={styles.simulationHeader}>
        <div>
          <p className={styles.eyebrow}>Pandemic Spread</p>
          <h2 className={styles.simulationTitle}>The Host-Pathogen Model</h2>
          <p className={styles.simulationLead}>
            When a pathogen enters a host population, it does not spread everywhere at once. It
            spreads locally: one infected host affects nearby hosts, then those hosts affect their
            neighbours. Very rude, but very CA.
          </p>
          <p className={styles.simulationLead}>
            The host-pathogen model turns this into a grid where local rules create the bigger
            spatial story: where infection spreads, where hosts survive, how the front moves, and
            what patterns appear after many interactions.
          </p>
        </div>
        <span className={styles.statusBadge}>
          {isPlaying ? 'Playing' : 'Paused'} • S {latestCounts.susceptible} • I {latestCounts.infected}
        </span>
      </div>

      <div className={styles.simulationLayout}>
        <div className={styles.canvasColumn}>
          <CellularAutomataCanvas
            ariaLabel="Pandemic spread cellular automata grid"
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
            onCellPointerDown={handlePointerDown}
            onCellPointerDrag={handlePointerDrag}
            onCellPointerUp={handlePointerUp}
          />
          <p className={styles.canvasHint}>
            Click a healthy host to infect it. Drag across the board to draw quarantine barriers.
            Use “Add outbreak” to introduce new infection clusters.
          </p>

          <section className={styles.panel}>
            <p className={styles.sectionTitle}>Infection as a Cellular Automaton</p>
            <p className={styles.noteText}>
              The rules here are stochastic, meaning chance is involved. An empty cell can become
              healthy if healthy neighbours are nearby. A healthy host can become infected if
              infected neighbours are nearby. An infected host eventually dies and becomes empty
              again.
            </p>
            <p className={styles.noteText}>
              This is similar to what happens when a bacteriophage infects <em>E. coli</em>: the
              phage attaches, infects, hijacks the cell, makes copies of itself, bursts the cell
              open, and spreads to nearby bacteria.
            </p>
            <p className={styles.noteText}>
              The CA does not model every tiny molecular detail. It models the bigger spatial
              story.
            </p>
            <p className={styles.questionText}>
              Healthy cells grow. Infected cells spread. Dead cells clear. The grid becomes a tiny
              infection soap opera.
            </p>
          </section>

          <section className={styles.legendPanel} aria-label="Pandemic legend">
            <p className={styles.sectionTitle}>Cell Legend</p>
            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: colorMode === 'dark' ? '#171719' : '#e8e8e8' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Empty</span>
                  <span className={styles.legendHint}>No host, cleared space</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#4f83ff' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Healthy host</span>
                  <span className={styles.legendHint}>Living, uninfected, and available for trouble</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#d94b45' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Infected host</span>
                  <span className={styles.legendHint}>Carrying the pathogen and spreading the drama</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#8a8a8a' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Recovered / removed</span>
                  <span className={styles.legendHint}>No longer spreading infection</span>
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#111111' }} />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>Barrier</span>
                  <span className={styles.legendHint}>Blocks movement and spread</span>
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
                onClick: () => initializeBoard(preset, paramsRef.current),
              },
              {
                id: 'randomize',
                label: 'Randomize',
                onClick: randomizeBoard,
                tone: 'secondary',
              },
              {
                id: 'clear',
                label: 'Clear',
                onClick: clearGrid,
                tone: 'secondary',
              },
              {
                id: 'outbreak',
                label: 'Add outbreak',
                onClick: addOutbreak,
              },
              {
                id: 'barriers',
                label: 'Clear barriers',
                onClick: clearBarriers,
                tone: 'secondary',
              },
            ]}
            selects={[
              {
                id: 'pandemic-preset',
                label: 'Preset',
                value: preset,
                options: PRESET_OPTIONS,
                onChange: (value) => {
                  const nextPreset = value as PandemicPresetId;
                  const nextParams = PRESET_DEFAULTS[nextPreset];
                  setPreset(nextPreset);
                  setParams(nextParams);
                  paramsRef.current = nextParams;
                  initializeBoard(nextPreset, nextParams);
                },
              },
            ]}
            sliders={[
              {
                id: 'pandemic-beta',
                label: 'Infection rate',
                min: 0,
                max: 1,
                step: 0.01,
                value: params.infectionRate,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    infectionRate: value,
                  }));
                },
                formatValue: (value) => value.toFixed(2),
              },
              {
                id: 'pandemic-recovery',
                label: 'Recovery time',
                min: 5,
                max: 60,
                step: 1,
                value: params.recoveryTime,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    recoveryTime: value,
                  }));
                },
                formatValue: (value) => `${Math.round(value)} steps`,
              },
              {
                id: 'pandemic-density',
                label: 'Population density',
                min: 0.1,
                max: 1,
                step: 0.01,
                value: params.populationDensity,
                onChange: (value) => {
                  setParams((previous) => ({
                    ...previous,
                    populationDensity: value,
                  }));
                },
                formatValue: (value) => `${Math.round(value * 100)}%`,
              },
            ]}
          />

          <PopulationGraph
            title="Population over time"
            ariaLabel="Pandemic population graph"
            history={history}
            series={GRAPH_SERIES}
          />

          <section className={styles.notePanel}>
            <p className={styles.sectionTitle}>Student Question</p>
            <p className={styles.noteText}>
              How does changing infection rate, recovery time, or barriers affect the outbreak?
            </p>
            <p className={styles.questionText}>
              Try slowing transmission, then compare that to a fast-spreading outbreak with no
              barriers. What changes in the way the infection front moves across the grid?
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
