export type Grid = Uint8Array;
export type Neighbourhood = 'Moore' | 'VonNeumann';

export type GridRuleFunction<TParams, TContext> = (
  grid: Grid,
  nextGrid: Grid,
  x: number,
  y: number,
  index: number,
  params: TParams,
  context: TContext,
) => void;

type GridInitializer = (x: number, y: number, index: number) => number;

const MOORE_OFFSETS: Array<[number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const VON_NEUMANN_OFFSETS: Array<[number, number]> = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createGrid(width: number, height: number, initializer?: GridInitializer) {
  const grid = new Uint8Array(width * height);

  if (!initializer) {
    return grid;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      grid[index] = initializer(x, y, index);
    }
  }

  return grid;
}

export function cloneGrid(grid: Grid) {
  return new Uint8Array(grid);
}

export function createNextGrid(grid: Grid) {
  return new Uint8Array(grid.length);
}

export function chance(probability: number) {
  return Math.random() < clamp(probability, 0, 1);
}

export function randomInt(min: number, maxExclusive: number) {
  return min + Math.floor(Math.random() * Math.max(0, maxExclusive - min));
}

export function randomChoice<T>(items: T[]) {
  return items[randomInt(0, items.length)];
}

export function countNeighbours(
  grid: Grid,
  width: number,
  height: number,
  x: number,
  y: number,
  targetState: number,
  neighbourhood: Neighbourhood = 'Moore',
) {
  const offsets = neighbourhood === 'Moore' ? MOORE_OFFSETS : VON_NEUMANN_OFFSETS;
  let count = 0;

  for (const [offsetX, offsetY] of offsets) {
    const neighbourX = x + offsetX;
    const neighbourY = y + offsetY;

    if (neighbourX < 0 || neighbourX >= width || neighbourY < 0 || neighbourY >= height) {
      continue;
    }

    if (grid[neighbourY * width + neighbourX] === targetState) {
      count += 1;
    }
  }

  return count;
}

export function stepGrid<TParams, TContext>(
  grid: Grid,
  width: number,
  height: number,
  ruleFunction: GridRuleFunction<TParams, TContext>,
  params: TParams,
  context: TContext,
) {
  const nextGrid = createNextGrid(grid);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      ruleFunction(grid, nextGrid, x, y, index, params, context);
    }
  }

  return nextGrid;
}

export function countPopulation(grid: Grid, trackedStates?: number[]) {
  const counts: Record<number, number> = {};

  if (trackedStates) {
    trackedStates.forEach((state) => {
      counts[state] = 0;
    });
  }

  for (let index = 0; index < grid.length; index += 1) {
    const state = grid[index];
    counts[state] = (counts[state] ?? 0) + 1;
  }

  return counts;
}

export function cappedHistory<T>(history: T[], nextItem: T, limit = 200) {
  if (history.length + 1 <= limit) {
    return [...history, nextItem];
  }

  return [...history.slice(history.length + 1 - limit), nextItem];
}

export function clearArray(array: Uint8Array | Int16Array) {
  array.fill(0);
}

