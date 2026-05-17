import React, { useEffect, useRef, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

const EMPTY = 0;
const TREE = 1;
const BURNING = 2;
const BURNT = 3;

const LIGHTNING_IDLE_STEPS = 14;
const EMPTY_GROWTH_FACTOR = 0.08;

type WindVector = {
  x: number;
  y: number;
  strength: number;
};

type CanvasSize = {
  width: number;
  height: number;
};

type ControlSettings = {
  treeDensity: number;
  baseSpreadProbability: number;
  windStrength: number;
  regrowthRate: number;
  simulationSpeed: number;
};

type ControlKey = keyof ControlSettings;

type ControlDefinition = {
  key: ControlKey;
  label: string;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
};

type SimulationBuffers = {
  cols: number;
  rows: number;
  cellSize: number;
  current: Uint8Array;
  next: Uint8Array;
  burningCount: number;
  treeCount: number;
  idleSteps: number;
};

type Palette = {
  backgroundStart: string;
  backgroundEnd: string;
  tree: string;
  burning: string;
  ember: string;
  glow: string;
  burnt: string;
};

const DEFAULT_SETTINGS: ControlSettings = {
  treeDensity: 0.68,
  baseSpreadProbability: 0.22,
  windStrength: 1.35,
  regrowthRate: 0.003,
  simulationSpeed: 12,
};

const CONTROL_DEFINITIONS: ControlDefinition[] = [
  {
    key: 'treeDensity',
    label: 'Tree Density',
    min: 0.25,
    max: 0.85,
    step: 0.01,
    formatValue: (value) => `${Math.round(value * 100)}%`,
  },
  {
    key: 'baseSpreadProbability',
    label: 'Base Spread',
    min: 0.05,
    max: 0.5,
    step: 0.01,
    formatValue: (value) => `${Math.round(value * 100)}%`,
  },
  {
    key: 'windStrength',
    label: 'Wind Strength',
    min: 0,
    max: 2.5,
    step: 0.05,
    formatValue: (value) => `${value.toFixed(2)}x`,
  },
  {
    key: 'regrowthRate',
    label: 'Regrowth',
    min: 0,
    max: 0.015,
    step: 0.0005,
    formatValue: (value) => `${(value * 100).toFixed(2)}%`,
  },
  {
    key: 'simulationSpeed',
    label: 'Speed',
    min: 6,
    max: 18,
    step: 1,
    formatValue: (value) => `${Math.round(value)} fps`,
  },
];

const lightPalette: Palette = {
  backgroundStart: '#f6efc6',
  backgroundEnd: '#fbf2dc',
  tree: '#2f7d4b',
  burning: '#E85607',
  ember: '#ffd166',
  glow: 'rgba(232, 86, 7, 0.42)',
  burnt: '#050505',
};

const darkPalette: Palette = {
  backgroundStart: '#1f180b',
  backgroundEnd: '#2a1d0d',
  tree: '#4fa86a',
  burning: '#E85607',
  ember: '#ffe08a',
  glow: 'rgba(232, 86, 7, 0.48)',
  burnt: '#000000',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function seedForest(current: Uint8Array, density: number) {
  let treeCount = 0;

  for (let index = 0; index < current.length; index += 1) {
    if (Math.random() < density) {
      current[index] = TREE;
      treeCount += 1;
    } else {
      current[index] = EMPTY;
    }
  }

  return treeCount;
}

function createSimulation(width: number, height: number, settings: ControlSettings): SimulationBuffers {
  const cellSize = clamp(Math.round(width / 78), 7, 10);
  const cols = Math.max(28, Math.floor(width / cellSize));
  const rows = Math.max(18, Math.floor(height / cellSize));
  const current = new Uint8Array(cols * rows);
  const next = new Uint8Array(cols * rows);

  return {
    cols,
    rows,
    cellSize,
    current,
    next,
    burningCount: 0,
    treeCount: seedForest(current, settings.treeDensity),
    idleSteps: 0,
  };
}

function igniteBrush(simulation: SimulationBuffers, cellX: number, cellY: number, radius = 1) {
  let ignited = 0;

  for (let y = Math.max(0, cellY - radius); y <= Math.min(simulation.rows - 1, cellY + radius); y += 1) {
    for (let x = Math.max(0, cellX - radius); x <= Math.min(simulation.cols - 1, cellX + radius); x += 1) {
      const index = y * simulation.cols + x;

      if (simulation.current[index] === EMPTY || simulation.current[index] === BURNT) {
        simulation.current[index] = TREE;
      }

      if (simulation.current[index] !== BURNING) {
        simulation.current[index] = BURNING;
        ignited += 1;
      }
    }
  }

  simulation.burningCount += ignited;
  simulation.idleSteps = 0;
}

function igniteRandomTree(simulation: SimulationBuffers) {
  const totalCells = simulation.current.length;

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const index = Math.floor(Math.random() * totalCells);

    if (simulation.current[index] === TREE) {
      simulation.current[index] = BURNING;
      simulation.burningCount = 1;
      simulation.idleSteps = 0;
      return true;
    }
  }

  return false;
}

function stepSimulation(simulation: SimulationBuffers, wind: WindVector, settings: ControlSettings) {
  const { cols, rows } = simulation;
  const current = simulation.current;
  const next = simulation.next;
  const emptyGrowthChance = settings.regrowthRate * EMPTY_GROWTH_FACTOR;
  let burningCount = 0;
  let treeCount = 0;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const index = y * cols + x;
      const state = current[index];

      if (state === EMPTY) {
        if (Math.random() < emptyGrowthChance) {
          next[index] = TREE;
          treeCount += 1;
        } else {
          next[index] = EMPTY;
        }
        continue;
      }

      if (state === BURNING) {
        next[index] = BURNT;
        continue;
      }

      if (state === BURNT) {
        if (Math.random() < settings.regrowthRate) {
          next[index] = TREE;
          treeCount += 1;
        } else {
          next[index] = BURNT;
        }
        continue;
      }

      let spreadChance = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) {
            continue;
          }

          const neighborX = x + offsetX;
          const neighborY = y + offsetY;

          if (neighborX < 0 || neighborX >= cols || neighborY < 0 || neighborY >= rows) {
            continue;
          }

          const neighborIndex = neighborY * cols + neighborX;

          if (current[neighborIndex] !== BURNING) {
            continue;
          }

          const distance = Math.hypot(offsetX, offsetY);
          const distanceFactor = distance > 1 ? 0.76 : 1;
          const spreadX = -offsetX / distance;
          const spreadY = -offsetY / distance;
          const alignment = wind.strength > 0 ? spreadX * wind.x + spreadY * wind.y : 0;
          const directionalMultiplier = alignment >= 0
            ? 1 + alignment * (2.9 * wind.strength)
            : 1 + alignment * (1.9 * wind.strength);
          const neighborChance = clamp(
            settings.baseSpreadProbability * distanceFactor * directionalMultiplier,
            0,
            0.98,
          );

          spreadChance = 1 - (1 - spreadChance) * (1 - neighborChance);
        }
      }

      if (spreadChance > 0 && Math.random() < spreadChance) {
        next[index] = BURNING;
        burningCount += 1;
      } else {
        next[index] = TREE;
        treeCount += 1;
      }
    }
  }

  simulation.current = next;
  simulation.next = current;
  simulation.burningCount = burningCount;
  simulation.treeCount = treeCount;

  if (burningCount === 0) {
    simulation.idleSteps += 1;

    if (
      simulation.idleSteps > LIGHTNING_IDLE_STEPS &&
      simulation.treeCount > simulation.current.length * 0.1 &&
      Math.random() < 0.08
    ) {
      igniteRandomTree(simulation);
    }
  } else {
    simulation.idleSteps = 0;
  }
}

function drawSimulation(
  context: CanvasRenderingContext2D,
  size: CanvasSize,
  simulation: SimulationBuffers,
  palette: Palette,
) {
  const { width, height } = size;
  const { cols, rows, cellSize, current } = simulation;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.backgroundStart);
  gradient.addColorStop(1, palette.backgroundEnd);

  context.clearRect(0, 0, width, height);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const gap = Math.max(0.75, cellSize * 0.08);
  const innerInset = Math.max(1, Math.floor(cellSize * 0.2));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const state = current[y * cols + x];

      if (state === EMPTY) {
        continue;
      }

      const drawX = x * cellSize + gap;
      const drawY = y * cellSize + gap;
      const drawSize = Math.max(1, cellSize - gap * 2);

      if (state === TREE) {
        context.fillStyle = palette.tree;
        context.fillRect(drawX, drawY, drawSize, drawSize);
        continue;
      }

      if (state === BURNING) {
        context.fillStyle = palette.glow;
        context.fillRect(drawX - gap * 0.5, drawY - gap * 0.5, drawSize + gap, drawSize + gap);
        context.fillStyle = (x + y) % 3 === 0 ? palette.ember : palette.burning;
        context.fillRect(drawX, drawY, drawSize, drawSize);
        context.fillStyle = palette.ember;
        context.fillRect(
          drawX + innerInset * 0.5,
          drawY + innerInset * 0.5,
          Math.max(1, drawSize - innerInset),
          Math.max(1, drawSize - innerInset),
        );
        continue;
      }

      context.fillStyle = palette.burnt;
      context.fillRect(drawX, drawY, drawSize, drawSize);
    }
  }
}

function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  formatValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.control}>
      <span className={styles.controlHeader}>
        <span>{label}</span>
        <span className={styles.controlValue}>{formatValue(value)}</span>
      </span>
      <input
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function ForestFireSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0 });
  const simulationRef = useRef<SimulationBuffers | null>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const windRef = useRef<WindVector>({ x: 0, y: 0, strength: 0 });
  const visibleRef = useRef(true);
  const inViewRef = useRef(true);
  const renderRef = useRef<(() => void) | null>(null);
  const [controls, setControls] = useState(DEFAULT_SETTINGS);
  const { colorMode } = useColorMode();

  useEffect(() => {
    settingsRef.current = controls;
  }, [controls]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return undefined;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return undefined;
    }

    const palette = colorMode === 'dark' ? darkPalette : lightPalette;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;

    const cancelFrame = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const requestFrame = () => {
      if (frameRef.current === null && visibleRef.current && inViewRef.current) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const render = () => {
      if (!simulationRef.current) {
        return;
      }

      drawSimulation(context, sizeRef.current, simulationRef.current, palette);
    };

    const initialize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(280, Math.floor(rect.width));
      const height = Math.max(220, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;

      sizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      simulationRef.current = createSimulation(width, height, settingsRef.current);
      lastFrameRef.current = 0;
      render();
    };

    const refreshAnimationState = () => {
      if (visibleRef.current && inViewRef.current) {
        requestFrame();
      } else {
        cancelFrame();
      }
    };

    function animate(timestamp: number) {
      frameRef.current = null;

      if (!visibleRef.current || !inViewRef.current || !simulationRef.current) {
        refreshAnimationState();
        return;
      }

      const frameDuration = 1000 / settingsRef.current.simulationSpeed;

      if (!lastFrameRef.current || timestamp - lastFrameRef.current >= frameDuration) {
        lastFrameRef.current = timestamp;
        stepSimulation(simulationRef.current, windRef.current, settingsRef.current);
        render();
      }

      requestFrame();
    }

    const handleVisibilityChange = () => {
      visibleRef.current = document.visibilityState === 'visible';
      refreshAnimationState();
    };

    renderRef.current = render;
    visibleRef.current = document.visibilityState === 'visible';
    initialize();
    requestFrame();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        initialize();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', initialize);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          inViewRef.current = entries[0]?.isIntersecting ?? true;
          refreshAnimationState();
        },
        { threshold: 0.15 },
      );
      intersectionObserver.observe(container);
    }

    return () => {
      renderRef.current = null;
      cancelFrame();
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', initialize);
      }

      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, [colorMode, controls.treeDensity]);

  const handleControlChange = (key: ControlKey) => (value: number) => {
    setControls((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const magnitude = Math.hypot(offsetX, offsetY);
    const radius = Math.max(1, Math.min(rect.width, rect.height) * 0.5);

    if (magnitude < 1) {
      windRef.current = { x: 0, y: 0, strength: 0 };
      return;
    }

    const cursorStrength = clamp((magnitude / radius) * settingsRef.current.windStrength, 0, 1.75);

    windRef.current = {
      x: offsetX / magnitude,
      y: offsetY / magnitude,
      strength: cursorStrength,
    };
  };

  const handlePointerLeave = () => {
    windRef.current = { x: 0, y: 0, strength: 0 };
  };

  const handleCanvasClick = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const simulation = simulationRef.current;

    if (!simulation) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = clamp((event.clientX - rect.left) / rect.width, 0, 0.9999);
    const relativeY = clamp((event.clientY - rect.top) / rect.height, 0, 0.9999);
    const cellX = Math.floor(relativeX * simulation.cols);
    const cellY = Math.floor(relativeY * simulation.rows);

    igniteBrush(simulation, cellX, cellY, 1);
    renderRef.current?.();
  };

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.frame}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onClick={handleCanvasClick}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          aria-label="Interactive forest fire cellular automata simulation"
        />
      </div>

      <div className={styles.infoStrip} aria-label="Forest fire simulation instructions">
        <span className={styles.infoLabel}>Forest Fire Spread Simulation</span>
        <span className={styles.infoText}>Click to spark a fire. Move to steer the wind.</span>
      </div>

      <div className={styles.controls} aria-label="Forest fire simulation controls">
        {CONTROL_DEFINITIONS.map((control) => (
          <ControlSlider
            key={control.key}
            label={control.label}
            value={controls[control.key]}
            min={control.min}
            max={control.max}
            step={control.step}
            formatValue={control.formatValue}
            onChange={handleControlChange(control.key)}
          />
        ))}
      </div>
    </div>
  );
}
