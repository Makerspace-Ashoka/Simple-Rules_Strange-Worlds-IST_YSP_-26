import React, { useEffect, useRef, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

type Point = [number, number];

type ObjectiveConfig =
  | {
      type: 'avalancheSize';
      target: number;
    }
  | {
      type: 'overflowLimit';
      target: number;
      overflowLimit: number;
    }
  | {
      type: 'activateTargets';
      target: number;
    };

type LevelConfig = {
  id: number;
  name: string;
  rows: number;
  cols: number;
  blockedCells: Point[];
  targetCells: Point[];
  objective: ObjectiveConfig;
  randomGrainInterval?: number;
  maxClicks?: number;
};

type LevelRuntimeState = {
  clicksUsed: number;
  lastAvalancheSize: number;
  comboLabel: string;
  lastOverflow: number;
  lastBlockedLoss: number;
  bestAvalanche: number;
  activatedTargets: number;
  objectiveComplete: boolean;
  objectiveFailed: boolean;
};

type TurnContext = {
  clicksUsed: number;
  activatedTargets: Set<number>;
};

type TurnStats = {
  topples: number;
  overflow: number;
  blockedLoss: number;
};

type RenderMetrics = {
  width: number;
  height: number;
};

type Palette = {
  frame: string;
  board: string;
  empty: string;
  grain1: string;
  grain2: string;
  grain3: string;
  unstable: string;
  unstableGlow: string;
  blocked: string;
  blockedStroke: string;
  target: string;
  targetActive: string;
  wave: string;
  waveFill: string;
  border: string;
  marker: string;
  markerStrong: string;
  grid: string;
};

type ToneConfig = {
  frequency: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
  when?: number;
  endFrequency?: number;
};

const CELL_TOPPLE_THRESHOLD = 4;
const LIGHT_PALETTE: Palette = {
  frame: '#f5f5f5',
  board: '#ffffff',
  empty: '#e6e6e6',
  grain1: '#f4ddb0',
  grain2: '#ffcf6b',
  grain3: '#6b1e2a',
  unstable: '#ffab00',
  unstableGlow: 'rgba(255, 171, 0, 0.22)',
  blocked: '#6a6a6a',
  blockedStroke: '#2c2c2c',
  target: '#6b1e2a',
  targetActive: '#ffab00',
  wave: '#ffab00',
  waveFill: 'rgba(255, 171, 0, 0.16)',
  border: '#2c2c2c',
  marker: '#2c2c2c',
  markerStrong: '#ffffff',
  grid: 'rgba(44, 44, 44, 0.12)',
};

const DARK_PALETTE: Palette = {
  frame: '#161617',
  board: '#0f0f10',
  empty: '#2a2a2a',
  grain1: '#5a4a22',
  grain2: '#a66a00',
  grain3: '#ffab00',
  unstable: '#ffcf4d',
  unstableGlow: 'rgba(255, 171, 0, 0.18)',
  blocked: '#3a3a3c',
  blockedStroke: '#bdbdbd',
  target: '#bdbdbd',
  targetActive: '#ffab00',
  wave: '#ffab00',
  waveFill: 'rgba(255, 171, 0, 0.18)',
  border: '#f5f5f5',
  marker: '#f5f5f5',
  markerStrong: '#0f0f10',
  grid: 'rgba(245, 245, 245, 0.12)',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function comboLabelFor(size: number) {
  if (size === 0) {
    return 'No avalanche';
  }

  if (size <= 4) {
    return 'Small shift';
  }

  if (size <= 19) {
    return 'Chain reaction';
  }

  if (size <= 49) {
    return 'Big avalanche';
  }

  return 'Critical cascade';
}

function createLevelTwoBlocked(): Point[] {
  const cells: Point[] = [];

  for (let x = 3; x <= 16; x += 1) {
    if (x !== 9 && x !== 10) {
      cells.push([x, 6]);
    }

    if (x !== 5 && x !== 14) {
      cells.push([x, 13]);
    }
  }

  for (let y = 4; y <= 15; y += 1) {
    if (y !== 8 && y !== 11) {
      cells.push([6, y]);
    }

    if (y !== 5 && y !== 14) {
      cells.push([13, y]);
    }
  }

  return cells;
}

function createLevelFiveTargets(): Point[] {
  return [
    [5, 6],
    [14, 8],
    [10, 14],
  ];
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Critical Grid',
    rows: 20,
    cols: 20,
    blockedCells: [],
    targetCells: [],
    objective: {
      type: 'avalancheSize',
      target: 10,
    },
  },
  {
    id: 2,
    name: 'Broken Paths',
    rows: 20,
    cols: 20,
    blockedCells: createLevelTwoBlocked(),
    targetCells: [],
    objective: {
      type: 'avalancheSize',
      target: 15,
    },
  },
  {
    id: 3,
    name: 'Restless Field',
    rows: 20,
    cols: 20,
    blockedCells: [],
    targetCells: [],
    randomGrainInterval: 2400,
    objective: {
      type: 'avalancheSize',
      target: 20,
    },
  },
  {
    id: 4,
    name: 'Edge Pressure',
    rows: 16,
    cols: 16,
    blockedCells: [],
    targetCells: [],
    objective: {
      type: 'overflowLimit',
      target: 20,
      overflowLimit: 12,
    },
  },
  {
    id: 5,
    name: 'Signal Targets',
    rows: 20,
    cols: 20,
    blockedCells: [],
    targetCells: createLevelFiveTargets(),
    maxClicks: 5,
    objective: {
      type: 'activateTargets',
      target: 3,
    },
  },
];

function buildMask(rows: number, cols: number, cells: Point[]) {
  const mask = new Uint8Array(rows * cols);

  cells.forEach(([x, y]) => {
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      mask[y * cols + x] = 1;
    }
  });

  return mask;
}

function createInitialRuntimeState(): LevelRuntimeState {
  return {
    clicksUsed: 0,
    lastAvalancheSize: 0,
    comboLabel: comboLabelFor(0),
    lastOverflow: 0,
    lastBlockedLoss: 0,
    bestAvalanche: 0,
    activatedTargets: 0,
    objectiveComplete: false,
    objectiveFailed: false,
  };
}

function seedBoard(level: LevelConfig, blockedMask: Uint8Array, targetMask: Uint8Array) {
  const board = new Int16Array(level.rows * level.cols);

  for (let y = 0; y < level.rows; y += 1) {
    for (let x = 0; x < level.cols; x += 1) {
      const index = y * level.cols + x;

      if (blockedMask[index] === 1) {
        continue;
      }

      const edgeDistance = Math.min(x, y, level.cols - 1 - x, level.rows - 1 - y);
      const roll = Math.random();
      let grains = 0;

      if (roll < 0.14) {
        grains = 0;
      } else if (roll < 0.42) {
        grains = 1;
      } else if (roll < 0.74) {
        grains = 2;
      } else {
        grains = 3;
      }

      if (edgeDistance > 3 && Math.random() < 0.24) {
        grains = Math.min(3, grains + 1);
      }

      if (level.id === 4 && edgeDistance < 2 && Math.random() < 0.32) {
        grains = Math.max(grains, 2);
      }

      if (targetMask[index] === 1) {
        grains = Math.max(grains, 2);
      }

      board[index] = grains;
    }
  }

  const clusterCount = clamp(Math.floor((level.rows * level.cols) / 90), 3, 8);

  for (let cluster = 0; cluster < clusterCount; cluster += 1) {
    const centerX = 2 + Math.floor(Math.random() * Math.max(1, level.cols - 4));
    const centerY = 2 + Math.floor(Math.random() * Math.max(1, level.rows - 4));

    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        const targetX = centerX + offsetX;
        const targetY = centerY + offsetY;

        if (targetX < 0 || targetX >= level.cols || targetY < 0 || targetY >= level.rows) {
          continue;
        }

        const index = targetY * level.cols + targetX;

        if (blockedMask[index] === 1) {
          continue;
        }

        if (Math.random() < 0.68) {
          board[index] = Math.max(board[index], Math.random() < 0.55 ? 3 : 2);
        }
      }
    }
  }

  level.targetCells.forEach(([x, y]) => {
    const neighbors: Point[] = [
      [x, y],
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    neighbors.forEach(([neighborX, neighborY]) => {
      if (
        neighborX < 0 ||
        neighborX >= level.cols ||
        neighborY < 0 ||
        neighborY >= level.rows
      ) {
        return;
      }

      const index = neighborY * level.cols + neighborX;

      if (blockedMask[index] === 0) {
        board[index] = Math.max(board[index], neighborX === x && neighborY === y ? 1 : 2);
      }
    });
  });

  return board;
}

function collectUnstable(board: Int16Array, blockedMask: Uint8Array) {
  const unstable: number[] = [];

  for (let index = 0; index < board.length; index += 1) {
    if (blockedMask[index] === 0 && board[index] >= CELL_TOPPLE_THRESHOLD) {
      unstable.push(index);
    }
  }

  return unstable;
}

function getObjectiveText(level: LevelConfig) {
  if (level.objective.type === 'avalancheSize') {
    return `Create an avalanche of size ${level.objective.target}+`;
  }

  if (level.objective.type === 'overflowLimit') {
    return `Create an avalanche of size ${level.objective.target}+ while keeping overflow at ${level.objective.overflowLimit} or less`;
  }

  return `Activate all ${level.objective.target} target cells${level.maxClicks ? ` within ${level.maxClicks} clicks` : ''}`;
}

function getObjectiveProgress(level: LevelConfig, runtime: LevelRuntimeState) {
  if (runtime.objectiveComplete) {
    return 'Objective cleared. Next level unlocked.';
  }

  if (runtime.objectiveFailed) {
    return 'Click limit spent. Reset the level to try again.';
  }

  if (level.objective.type === 'avalancheSize') {
    return `Best avalanche so far: ${runtime.bestAvalanche}/${level.objective.target}`;
  }

  if (level.objective.type === 'overflowLimit') {
    return `Last attempt: ${runtime.lastAvalancheSize} topples, ${runtime.lastOverflow} overflow`;
  }

  const clickText = level.maxClicks ? `Clicks left: ${Math.max(0, level.maxClicks - runtime.clicksUsed)}` : 'No click limit';
  return `Targets activated: ${runtime.activatedTargets}/${level.objective.target}. ${clickText}`;
}

function drawMarkerPattern(
  context: CanvasRenderingContext2D,
  left: number,
  top: number,
  size: number,
  grains: number,
  color: string,
) {
  const dotRadius = Math.max(1.2, size * 0.08);
  const patterns: Record<number, Array<[number, number]>> = {
    1: [[0.5, 0.5]],
    2: [[0.34, 0.5], [0.66, 0.5]],
    3: [[0.5, 0.3], [0.34, 0.68], [0.66, 0.68]],
    4: [[0.34, 0.34], [0.66, 0.34], [0.34, 0.66], [0.66, 0.66]],
  };

  const markers = patterns[Math.min(4, grains)];

  if (!markers) {
    return;
  }

  context.fillStyle = color;

  markers.forEach(([x, y]) => {
    context.beginPath();
    context.arc(left + size * x, top + size * y, dotRadius, 0, Math.PI * 2);
    context.fill();
  });
}

function playTone(context: AudioContext, config: ToneConfig) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const start = config.when ?? context.currentTime;
  const end = start + config.duration;

  oscillator.type = config.type ?? 'sine';
  oscillator.frequency.setValueAtTime(config.frequency, start);

  if (config.endFrequency) {
    oscillator.frequency.linearRampToValueAtTime(config.endFrequency, end);
  }

  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.linearRampToValueAtTime(config.gain, start + config.duration * 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

function checkObjective(level: LevelConfig, runtime: LevelRuntimeState) {
  if (level.objective.type === 'avalancheSize') {
    return runtime.bestAvalanche >= level.objective.target;
  }

  if (level.objective.type === 'overflowLimit') {
    return (
      runtime.lastAvalancheSize >= level.objective.target &&
      runtime.lastOverflow <= level.objective.overflowLimit
    );
  }

  return runtime.activatedTargets >= level.objective.target;
}

export default function SandpileGame() {
  const { colorMode } = useColorMode();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const boardRef = useRef<Int16Array>(new Int16Array(0));
  const blockedRef = useRef<Uint8Array>(new Uint8Array(0));
  const targetRef = useRef<Uint8Array>(new Uint8Array(0));
  const activatedTargetsRef = useRef<Uint8Array>(new Uint8Array(0));
  const activatedTargetCountRef = useRef(0);
  const highlightRef = useRef<Set<number>>(new Set());
  const renderMetricsRef = useRef<RenderMetrics>({
    width: 0,
    height: 0,
  });
  const waveTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isResolvingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const runtimeRef = useRef<LevelRuntimeState>(createInitialRuntimeState());
  const scoreRef = useRef(0);
  const currentLevelIndexRef = useRef(0);
  const soundEnabledRef = useRef(false);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isResolving, setIsResolving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [runtime, setRuntime] = useState<LevelRuntimeState>(createInitialRuntimeState());

  currentLevelIndexRef.current = currentLevelIndex;
  soundEnabledRef.current = soundEnabled;

  const currentLevel = LEVELS[currentLevelIndex];
  const palette = colorMode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

  function drawBoard() {
    const canvas = canvasRef.current;
    const level = LEVELS[currentLevelIndexRef.current];

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const { width, height } = renderMetricsRef.current;

    if (!width || !height) {
      return;
    }

    context.clearRect(0, 0, width, height);
    context.fillStyle = palette.frame;
    context.fillRect(0, 0, width, height);

    const board = boardRef.current;
    const blocked = blockedRef.current;
    const targets = targetRef.current;
    const activatedTargets = activatedTargetsRef.current;
    const cellSize = Math.min(width / level.cols, height / level.rows);
    const gridWidth = cellSize * level.cols;
    const gridHeight = cellSize * level.rows;
    const offsetX = (width - gridWidth) / 2;
    const offsetY = (height - gridHeight) / 2;
    const gap = Math.max(1, cellSize * 0.08);
    const innerSize = Math.max(1.6, cellSize - gap * 2);

    context.fillStyle = palette.board;
    context.fillRect(offsetX, offsetY, gridWidth, gridHeight);

    for (let y = 0; y < level.rows; y += 1) {
      for (let x = 0; x < level.cols; x += 1) {
        const index = y * level.cols + x;
        const left = offsetX + x * cellSize + gap;
        const top = offsetY + y * cellSize + gap;
        const grains = board[index];

        if (blocked[index] === 1) {
          context.fillStyle = palette.blocked;
          context.fillRect(left, top, innerSize, innerSize);
          context.strokeStyle = palette.blockedStroke;
          context.lineWidth = Math.max(1.1, cellSize * 0.06);
          context.beginPath();
          context.moveTo(left + innerSize * 0.24, top + innerSize * 0.24);
          context.lineTo(left + innerSize * 0.76, top + innerSize * 0.76);
          context.moveTo(left + innerSize * 0.76, top + innerSize * 0.24);
          context.lineTo(left + innerSize * 0.24, top + innerSize * 0.76);
          context.stroke();
          continue;
        }

        let fill = palette.empty;

        if (grains === 1) {
          fill = palette.grain1;
        } else if (grains === 2) {
          fill = palette.grain2;
        } else if (grains === 3) {
          fill = palette.grain3;
        } else if (grains >= CELL_TOPPLE_THRESHOLD) {
          fill = palette.unstable;
        }

        context.fillStyle = fill;
        context.fillRect(left, top, innerSize, innerSize);

        if (grains >= CELL_TOPPLE_THRESHOLD && !reducedMotionRef.current) {
          context.fillStyle = palette.unstableGlow;
          context.fillRect(left - gap * 0.6, top - gap * 0.6, innerSize + gap * 1.2, innerSize + gap * 1.2);
          context.fillStyle = fill;
          context.fillRect(left, top, innerSize, innerSize);
        }

        if (grains > 0) {
          const markerColor = grains >= 3 ? palette.markerStrong : palette.marker;
          drawMarkerPattern(context, left, top, innerSize, grains, markerColor);
        }

        if (targets[index] === 1) {
          context.save();
          context.strokeStyle = activatedTargets[index] === 1 ? palette.targetActive : palette.target;
          context.lineWidth = Math.max(1.6, cellSize * 0.08);

          if (!reducedMotionRef.current) {
            context.shadowColor = activatedTargets[index] === 1 ? palette.targetActive : palette.target;
            context.shadowBlur = cellSize * 0.34;
          }

          context.strokeRect(left + gap * 0.15, top + gap * 0.15, innerSize - gap * 0.3, innerSize - gap * 0.3);
          context.restore();
        }

        if (highlightRef.current.has(index)) {
          context.save();
          context.fillStyle = palette.waveFill;
          context.fillRect(left, top, innerSize, innerSize);
          context.strokeStyle = palette.wave;
          context.lineWidth = Math.max(1.4, cellSize * 0.08);
          context.strokeRect(left, top, innerSize, innerSize);
          context.restore();
        }

        context.strokeStyle = palette.grid;
        context.lineWidth = 1;
        context.strokeRect(left, top, innerSize, innerSize);
      }
    }

    context.strokeStyle = palette.border;
    context.lineWidth = 2;
    context.strokeRect(offsetX + 1, offsetY + 1, gridWidth - 2, gridHeight - 2);
  }

  function updateCanvasSize() {
    const frame = frameRef.current;
    const canvas = canvasRef.current;

    if (!frame || !canvas || typeof window === 'undefined') {
      return;
    }

    const rect = frame.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderMetricsRef.current = {
      width: rect.width,
      height: rect.height,
    };

    drawBoard();
  }

  function clearWaveTimer() {
    if (waveTimeoutRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(waveTimeoutRef.current);
      waveTimeoutRef.current = null;
    }
  }

  function markTargetActivated(index: number, activatedThisTurn: Set<number>) {
    if (targetRef.current[index] !== 1 || activatedTargetsRef.current[index] === 1) {
      return;
    }

    activatedTargetsRef.current[index] = 1;
    activatedTargetCountRef.current += 1;
    activatedThisTurn.add(index);
  }

  function ensureAudioContext() {
    if (typeof window === 'undefined' || !soundEnabledRef.current) {
      return null;
    }

    type AudioWindow = Window &
      typeof globalThis & {
        webkitAudioContext?: typeof AudioContext;
      };

    const browserWindow = window as AudioWindow;
    const AudioCtor = browserWindow.AudioContext ?? browserWindow.webkitAudioContext;

    if (!AudioCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtor();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {
        return undefined;
      });
    }

    return audioContextRef.current;
  }

  function playDropSound() {
    const context = ensureAudioContext();

    if (!context) {
      return;
    }

    playTone(context, {
      frequency: 420,
      endFrequency: 360,
      duration: 0.06,
      gain: 0.018,
      type: 'triangle',
    });
  }

  function playWaveSound(topples: number) {
    const context = ensureAudioContext();

    if (!context) {
      return;
    }

    const frequency = clamp(180 + topples * 12, 180, 520);
    const gain = clamp(0.014 + topples * 0.0012, 0.014, 0.035);

    playTone(context, {
      frequency,
      endFrequency: frequency + 20,
      duration: reducedMotionRef.current ? 0.04 : 0.07,
      gain,
      type: topples < 6 ? 'triangle' : 'square',
    });
  }

  function playOverflowSound() {
    const context = ensureAudioContext();

    if (!context) {
      return;
    }

    playTone(context, {
      frequency: 132,
      endFrequency: 94,
      duration: 0.09,
      gain: 0.028,
      type: 'sawtooth',
    });
  }

  function playCascadeSound(topples: number) {
    const context = ensureAudioContext();

    if (!context) {
      return;
    }

    const now = context.currentTime;
    const notes = topples >= 50 ? [320, 420, 560, 720] : [280, 360, 460];

    notes.forEach((frequency, index) => {
      playTone(context, {
        frequency,
        endFrequency: frequency + 26,
        duration: 0.08,
        gain: topples >= 50 ? 0.024 : 0.019,
        type: 'triangle',
        when: now + index * 0.055,
      });
    });
  }

  function finalizePlayerTurn(clicksUsed: number, stats: TurnStats) {
    const level = LEVELS[currentLevelIndexRef.current];
    const nextRuntime: LevelRuntimeState = {
      clicksUsed,
      lastAvalancheSize: stats.topples,
      comboLabel: comboLabelFor(stats.topples),
      lastOverflow: stats.overflow,
      lastBlockedLoss: stats.blockedLoss,
      bestAvalanche: Math.max(runtimeRef.current.bestAvalanche, stats.topples),
      activatedTargets: activatedTargetCountRef.current,
      objectiveComplete: runtimeRef.current.objectiveComplete,
      objectiveFailed: false,
    };

    nextRuntime.objectiveComplete = runtimeRef.current.objectiveComplete || checkObjective(level, nextRuntime);
    nextRuntime.objectiveFailed = Boolean(
      !nextRuntime.objectiveComplete &&
      level.maxClicks &&
      nextRuntime.clicksUsed >= level.maxClicks,
    );

    runtimeRef.current = nextRuntime;
    setRuntime(nextRuntime);

    if (stats.topples > 0) {
      scoreRef.current += stats.topples;
      setScore(scoreRef.current);
    }

    if (stats.overflow > 0) {
      playOverflowSound();
    }

    if (stats.topples >= 8) {
      playCascadeSound(stats.topples);
    }

    if (nextRuntime.objectiveComplete) {
      setUnlockedLevel((previous) => Math.max(previous, Math.min(LEVELS.length, level.id + 1)));
    }

    isResolvingRef.current = false;
    setIsResolving(false);
  }

  function finalizeAmbientTurn() {
    highlightRef.current = new Set();
    drawBoard();
    isResolvingRef.current = false;
    setIsResolving(false);
  }

  function resolveAvalanche(source: 'player' | 'ambient', context: TurnContext) {
    const level = LEVELS[currentLevelIndexRef.current];
    const waveDelay = reducedMotionRef.current ? 28 : 95;
    const stats: TurnStats = {
      topples: 0,
      overflow: 0,
      blockedLoss: 0,
    };

    const processWave = () => {
      const unstable = collectUnstable(boardRef.current, blockedRef.current);

      if (unstable.length === 0) {
        highlightRef.current = new Set();
        drawBoard();

        if (source === 'player') {
          finalizePlayerTurn(context.clicksUsed, stats);
        } else {
          finalizeAmbientTurn();
        }

        return;
      }

      const waveHighlights = new Set<number>();
      stats.topples += unstable.length;

      unstable.forEach((index) => {
        waveHighlights.add(index);
        boardRef.current[index] -= CELL_TOPPLE_THRESHOLD;
        markTargetActivated(index, context.activatedTargets);

        const x = index % level.cols;
        const y = Math.floor(index / level.cols);
        const neighbors: Point[] = [
          [x, y - 1],
          [x, y + 1],
          [x - 1, y],
          [x + 1, y],
        ];

        neighbors.forEach(([neighborX, neighborY]) => {
          if (
            neighborX < 0 ||
            neighborX >= level.cols ||
            neighborY < 0 ||
            neighborY >= level.rows
          ) {
            stats.overflow += 1;
            return;
          }

          const neighborIndex = neighborY * level.cols + neighborX;

          if (blockedRef.current[neighborIndex] === 1) {
            stats.blockedLoss += 1;
            return;
          }

          boardRef.current[neighborIndex] += 1;
          markTargetActivated(neighborIndex, context.activatedTargets);
        });
      });

      highlightRef.current = waveHighlights;
      drawBoard();

      if (source === 'player') {
        playWaveSound(unstable.length);
      }

      if (typeof window === 'undefined') {
        return;
      }

      waveTimeoutRef.current = window.setTimeout(processWave, waveDelay);
    };

    processWave();
  }

  function initializeLevel(levelIndex: number) {
    clearWaveTimer();
    isResolvingRef.current = false;
    setIsResolving(false);

    const level = LEVELS[levelIndex];
    const blockedMask = buildMask(level.rows, level.cols, level.blockedCells);
    const targetMask = buildMask(level.rows, level.cols, level.targetCells);

    boardRef.current = seedBoard(level, blockedMask, targetMask);
    blockedRef.current = blockedMask;
    targetRef.current = targetMask;
    activatedTargetsRef.current = new Uint8Array(level.rows * level.cols);
    activatedTargetCountRef.current = 0;
    highlightRef.current = new Set();

    const nextRuntime = createInitialRuntimeState();
    runtimeRef.current = nextRuntime;
    setRuntime(nextRuntime);
    updateCanvasSize();
  }

  function goToLevel(levelIndex: number) {
    currentLevelIndexRef.current = levelIndex;
    setCurrentLevelIndex(levelIndex);
    initializeLevel(levelIndex);
  }

  function resetLevel() {
    initializeLevel(currentLevelIndexRef.current);
  }

  function getCanvasCell(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const level = LEVELS[currentLevelIndexRef.current];

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const cellSize = Math.min(rect.width / level.cols, rect.height / level.rows);
    const gridWidth = cellSize * level.cols;
    const gridHeight = cellSize * level.rows;
    const offsetX = (rect.width - gridWidth) / 2;
    const offsetY = (rect.height - gridHeight) / 2;
    const localX = clientX - rect.left - offsetX;
    const localY = clientY - rect.top - offsetY;

    if (localX < 0 || localY < 0 || localX >= gridWidth || localY >= gridHeight) {
      return null;
    }

    const x = Math.floor(localX / cellSize);
    const y = Math.floor(localY / cellSize);

    if (x < 0 || x >= level.cols || y < 0 || y >= level.rows) {
      return null;
    }

    return {
      index: y * level.cols + x,
      x,
      y,
    };
  }

  function handlePlayerMove(index: number) {
    if (isResolvingRef.current || runtimeRef.current.objectiveFailed) {
      return;
    }

    const level = LEVELS[currentLevelIndexRef.current];
    const turnContext: TurnContext = {
      clicksUsed: runtimeRef.current.clicksUsed + 1,
      activatedTargets: new Set<number>(),
    };

    if (blockedRef.current[index] === 1) {
      return;
    }

    boardRef.current[index] += 1;
    drawBoard();
    playDropSound();

    const unstable = collectUnstable(boardRef.current, blockedRef.current);

    if (unstable.length === 0) {
      finalizePlayerTurn(turnContext.clicksUsed, {
        topples: 0,
        overflow: 0,
        blockedLoss: 0,
      });
      return;
    }

    isResolvingRef.current = true;
    setIsResolving(true);
    resolveAvalanche('player', turnContext);

    if (level.targetCells.length > 0) {
      drawBoard();
    }
  }

  function addAmbientGrain() {
    if (isResolvingRef.current) {
      return;
    }

    const level = LEVELS[currentLevelIndexRef.current];
    const validCells: number[] = [];

    for (let index = 0; index < boardRef.current.length; index += 1) {
      if (blockedRef.current[index] === 0) {
        validCells.push(index);
      }
    }

    if (validCells.length === 0) {
      return;
    }

    const randomIndex = validCells[Math.floor(Math.random() * validCells.length)];
    boardRef.current[randomIndex] += 1;
    drawBoard();

    const unstable = collectUnstable(boardRef.current, blockedRef.current);

    if (unstable.length === 0) {
      return;
    }

    if (level.randomGrainInterval) {
      isResolvingRef.current = true;
      setIsResolving(true);
      resolveAvalanche('ambient', {
        clicksUsed: runtimeRef.current.clicksUsed,
        activatedTargets: new Set<number>(),
      });
    }
  }

  function handleCanvasPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const cell = getCanvasCell(event.clientX, event.clientY);

    if (!cell) {
      return;
    }

    handlePlayerMove(cell.index);
  }

  function handleSoundToggle() {
    setSoundEnabled((previous) => {
      const next = !previous;
      soundEnabledRef.current = next;

      if (next) {
        ensureAudioContext();
      }

      return next;
    });
  }

  useEffect(() => {
    initializeLevel(0);

    return () => {
      clearWaveTimer();

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {
          return undefined;
        });
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const browserWindow = window;
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const handleResize = () => {
      updateCanvasSize();
    };

    handleResize();

    if ('ResizeObserver' in window) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(frame);

      return () => {
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
      };
    }

    browserWindow.addEventListener('resize', handleResize);
    return () => {
      browserWindow.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    drawBoard();
  }, [colorMode, runtime, currentLevelIndex, reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
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
    const level = LEVELS[currentLevelIndex];

    if (
      typeof window === 'undefined' ||
      !level.randomGrainInterval ||
      isResolving ||
      runtime.objectiveComplete ||
      runtime.objectiveFailed
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      addAmbientGrain();
    }, level.randomGrainInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentLevelIndex, isResolving, runtime.objectiveComplete, runtime.objectiveFailed]);

  const canAdvance = currentLevelIndex < LEVELS.length - 1 && unlockedLevel > currentLevelIndex + 1;
  const showBlockedMetric = currentLevel.blockedCells.length > 0;
  const showTargetMetric = currentLevel.targetCells.length > 0;
  const clicksLeft = currentLevel.maxClicks ? Math.max(0, currentLevel.maxClicks - runtime.clicksUsed) : null;

  return (
    <div className={styles.shell}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Playable Abelian Sandpile</p>
          <h2 className={styles.levelTitle}>
            Level {currentLevel.id}: {currentLevel.name}
          </h2>
        </div>
        <div className={styles.statusStack}>
          <span className={styles.levelChip}>
            {runtime.objectiveComplete
              ? 'Objective complete'
              : runtime.objectiveFailed
                ? 'Reset to retry'
                : isResolving
                  ? 'Avalanche resolving'
                  : 'Ready for a click'}
          </span>
          {currentLevel.randomGrainInterval ? (
            <span className={styles.subtleStatus}>Random grains drift in every few seconds.</span>
          ) : null}
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.boardColumn}>
          <div
            ref={frameRef}
            className={styles.canvasFrame}
            style={{ aspectRatio: `${currentLevel.cols} / ${currentLevel.rows}` }}
          >
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              onPointerDown={handleCanvasPointerDown}
              aria-label="Interactive Abelian sandpile board"
            />
          </div>
          <p className={styles.boardHint}>
            Tap or click a cell to add one grain. A move locks until the avalanche settles.
          </p>
        </div>

        <div className={styles.sidebar}>
          <section className={styles.metricPanel} aria-label="Sandpile score and status">
            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Score</span>
                <strong className={styles.metricValue}>{score}</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Last Avalanche</span>
                <strong className={styles.metricValue}>{runtime.lastAvalancheSize}</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Combo</span>
                <strong className={styles.metricValue}>{runtime.comboLabel}</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Overflow</span>
                <strong className={styles.metricValue}>{runtime.lastOverflow}</strong>
              </div>
              {showBlockedMetric ? (
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Blocked Loss</span>
                  <strong className={styles.metricValue}>{runtime.lastBlockedLoss}</strong>
                </div>
              ) : null}
              {showTargetMetric ? (
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Targets</span>
                  <strong className={styles.metricValue}>
                    {runtime.activatedTargets}/{currentLevel.objective.target}
                  </strong>
                </div>
              ) : null}
              {clicksLeft !== null ? (
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Clicks Left</span>
                  <strong className={styles.metricValue}>{clicksLeft}</strong>
                </div>
              ) : null}
            </div>
          </section>

          <section className={styles.objectivePanel}>
            <p className={styles.sectionLabel}>Current Objective</p>
            <p className={styles.objectiveText}>{getObjectiveText(currentLevel)}</p>
            <p className={styles.objectiveProgress}>{getObjectiveProgress(currentLevel, runtime)}</p>
          </section>

          <section className={styles.controlsPanel}>
            <p className={styles.sectionLabel}>Controls</p>
            <div className={styles.controlRow}>
              <button
                type="button"
                className={styles.controlButton}
                onClick={resetLevel}
                disabled={isResolving}
              >
                Reset level
              </button>
              <button
                type="button"
                className={styles.controlButton}
                onClick={() => goToLevel(currentLevelIndex + 1)}
                disabled={isResolving || !canAdvance}
              >
                Next level
              </button>
            </div>
            <div className={styles.controlRow}>
              <button
                type="button"
                className={styles.controlButton}
                onClick={handleSoundToggle}
              >
                Sound {soundEnabled ? 'on' : 'off'}
              </button>
              <button
                type="button"
                className={styles.controlButton}
                onClick={() => setShowRules((previous) => !previous)}
              >
                {showRules ? 'Hide rules' : 'Show rules'}
              </button>
            </div>
          </section>

          {showRules ? (
            <section className={styles.helpPanel}>
              <p className={styles.sectionLabel}>Rules</p>
              <p className={styles.helpText}>
                At every time step, the sandpile follows two simple steps:
              </p>
              <ul className={styles.ruleList}>
                <li>Drop one grain onto a cell.</li>
                <li>Check for toppling.</li>
                <li>If a cell has 4 or more grains, it loses 4 grains.</li>
                <li>Each of its 4 neighbours gains 1 grain.</li>
                <li>Any neighbour that now crosses the threshold topples too.</li>
                <li>This continues until every cell is stable again.</li>
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
