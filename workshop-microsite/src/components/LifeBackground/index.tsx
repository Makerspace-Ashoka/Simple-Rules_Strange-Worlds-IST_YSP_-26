import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

const FRAME_MS = 1000 / 10;

type CanvasSize = {
  width: number;
  height: number;
};

type Pattern = {
  cells: Array<[number, number]>;
  width: number;
  height: number;
};

type World = {
  cols: number;
  rows: number;
  cellSize: number;
  current: Uint8Array;
  next: Uint8Array;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createPattern(cells: Array<[number, number]>): Pattern {
  const width = cells.reduce((max, [x]) => Math.max(max, x), 0) + 1;
  const height = cells.reduce((max, [, y]) => Math.max(max, y), 0) + 1;

  return { cells, width, height };
}

function createPatternFromRows(rows: string[]): Pattern {
  const cells: Array<[number, number]> = [];

  rows.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell === 'X') {
        cells.push([x, y]);
      }
    });
  });

  return {
    cells,
    width: rows[0]?.length ?? 0,
    height: rows.length,
  };
}

function transformPattern(pattern: Pattern, rotation: number, flipX: boolean): Pattern {
  let cells = pattern.cells.map(([x, y]) => [x, y] as [number, number]);
  let width = pattern.width;
  let height = pattern.height;

  for (let turn = 0; turn < rotation; turn += 1) {
    cells = cells.map(([x, y]) => [height - 1 - y, x]);
    [width, height] = [height, width];
  }

  if (flipX) {
    cells = cells.map(([x, y]) => [width - 1 - x, y]);
  }

  const minX = cells.reduce((min, [x]) => Math.min(min, x), Number.POSITIVE_INFINITY);
  const minY = cells.reduce((min, [, y]) => Math.min(min, y), Number.POSITIVE_INFINITY);

  return {
    cells: cells.map(([x, y]) => [x - minX, y - minY]),
    width,
    height,
  };
}

const glider = createPattern([
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
]);

const blinker = createPattern([
  [0, 0],
  [1, 0],
  [2, 0],
]);

const lightweightSpaceship = createPattern([
  [1, 0],
  [4, 0],
  [0, 1],
  [0, 2],
  [4, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
]);

const acorn = createPattern([
  [1, 0],
  [3, 1],
  [0, 2],
  [1, 2],
  [4, 2],
  [5, 2],
  [6, 2],
]);

const pulsar = createPatternFromRows([
  '..XXX...XXX..',
  '.............',
  'X....X.X....X',
  'X....X.X....X',
  'X....X.X....X',
  '..XXX...XXX..',
  '.............',
  '..XXX...XXX..',
  'X....X.X....X',
  'X....X.X....X',
  'X....X.X....X',
  '.............',
  '..XXX...XXX..',
]);

const patternLibrary = [glider, blinker, pulsar, lightweightSpaceship, acorn];

function createWorld(width: number, height: number): World {
  const cellSize = clamp(Math.round(width / 120), 9, 14);
  const cols = Math.max(28, Math.ceil(width / cellSize));
  const rows = Math.max(20, Math.ceil(height / cellSize));
  const current = new Uint8Array(cols * rows);
  const next = new Uint8Array(cols * rows);

  return { cols, rows, cellSize, current, next };
}

function placePattern(world: World, pattern: Pattern, originX: number, originY: number) {
  pattern.cells.forEach(([x, y]) => {
    const targetX = originX + x;
    const targetY = originY + y;

    if (targetX < 0 || targetX >= world.cols || targetY < 0 || targetY >= world.rows) {
      return;
    }

    world.current[targetY * world.cols + targetX] = 1;
  });
}

function seedWorld(world: World) {
  world.current.fill(0);

  patternLibrary.forEach((pattern) => {
    const rotation = Math.floor(Math.random() * 4);
    const flipX = Math.random() > 0.5;
    const transformed = transformPattern(pattern, rotation, flipX);
    const maxX = Math.max(1, world.cols - transformed.width - 2);
    const maxY = Math.max(1, world.rows - transformed.height - 2);

    placePattern(
      world,
      transformed,
      1 + Math.floor(Math.random() * maxX),
      1 + Math.floor(Math.random() * maxY),
    );
  });

  const extraPatterns = clamp(Math.floor((world.cols * world.rows) / 950), 4, 12);

  for (let count = 0; count < extraPatterns; count += 1) {
    const pattern = patternLibrary[Math.floor(Math.random() * patternLibrary.length)];
    const transformed = transformPattern(pattern, Math.floor(Math.random() * 4), Math.random() > 0.5);
    const maxX = Math.max(1, world.cols - transformed.width - 2);
    const maxY = Math.max(1, world.rows - transformed.height - 2);

    placePattern(
      world,
      transformed,
      1 + Math.floor(Math.random() * maxX),
      1 + Math.floor(Math.random() * maxY),
    );
  }
}

function stepLife(world: World) {
  const { cols, rows, current, next } = world;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      let neighbors = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) {
            continue;
          }

          const neighborX = (x + offsetX + cols) % cols;
          const neighborY = (y + offsetY + rows) % rows;
          neighbors += current[neighborY * cols + neighborX];
        }
      }

      const index = y * cols + x;
      const alive = current[index] === 1;

      if (!alive && neighbors === 3) {
        next[index] = 1;
      } else if (alive && (neighbors === 2 || neighbors === 3)) {
        next[index] = 1;
      } else {
        next[index] = 0;
      }
    }
  }

  world.current = next;
  world.next = current;
}

function drawWorld(
  context: CanvasRenderingContext2D,
  size: CanvasSize,
  world: World,
  colorMode: string,
) {
  context.clearRect(0, 0, size.width, size.height);

  const fillColor = colorMode === 'dark'
    ? 'rgba(189, 189, 189, 0.22)'
    : 'rgba(106, 106, 106, 0.16)';
  const cellInset = Math.max(1, Math.floor(world.cellSize * 0.12));
  const drawSize = Math.max(1.5, world.cellSize - cellInset * 2);

  context.fillStyle = fillColor;

  for (let y = 0; y < world.rows; y += 1) {
    for (let x = 0; x < world.cols; x += 1) {
      if (world.current[y * world.cols + x] === 0) {
        continue;
      }

      context.fillRect(
        x * world.cellSize + cellInset,
        y * world.cellSize + cellInset,
        drawSize,
        drawSize,
      );
    }
  }
}

export default function LifeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const worldRef = useRef<World | null>(null);
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0 });
  const reducedMotionRef = useRef(false);
  const themeRef = useRef('light');
  const visibleRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const getTheme = () => (
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    );
    let mutationObserver: MutationObserver | null = null;

    const cancelFrame = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const requestFrame = () => {
      if (frameRef.current === null && visibleRef.current && !reducedMotionRef.current) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const render = () => {
      if (!worldRef.current) {
        return;
      }

      drawWorld(context, sizeRef.current, worldRef.current, themeRef.current);
    };

    const initialize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      sizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      worldRef.current = createWorld(width, height);
      seedWorld(worldRef.current);
      lastFrameRef.current = 0;
      render();
    };

    const refreshAnimationState = () => {
      if (visibleRef.current && !reducedMotionRef.current) {
        requestFrame();
      } else {
        cancelFrame();
      }
    };

    function animate(timestamp: number) {
      frameRef.current = null;

      if (!visibleRef.current || reducedMotionRef.current || !worldRef.current) {
        refreshAnimationState();
        return;
      }

      if (!lastFrameRef.current || timestamp - lastFrameRef.current >= FRAME_MS) {
        lastFrameRef.current = timestamp;
        stepLife(worldRef.current);
        render();
      }

      requestFrame();
    }

    const handleVisibilityChange = () => {
      visibleRef.current = document.visibilityState === 'visible';
      refreshAnimationState();
    };

    const handleReducedMotionChange = () => {
      reducedMotionRef.current = mediaQuery.matches;
      refreshAnimationState();
      render();
    };

    const handleThemeChange = () => {
      themeRef.current = getTheme();
      render();
    };

    reducedMotionRef.current = mediaQuery.matches;
    themeRef.current = getTheme();
    visibleRef.current = document.visibilityState === 'visible';
    initialize();
    refreshAnimationState();

    window.addEventListener('resize', initialize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
    } else {
      mediaQuery.addListener(handleReducedMotionChange);
    }

    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(handleThemeChange);
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    return () => {
      cancelFrame();
      window.removeEventListener('resize', initialize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      } else {
        mediaQuery.removeListener(handleReducedMotionChange);
      }

      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
