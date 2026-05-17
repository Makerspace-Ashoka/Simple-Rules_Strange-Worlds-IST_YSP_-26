type P5Instance = {
  createCanvas: (width: number, height: number) => { parent: (node: HTMLElement) => void };
  resizeCanvas: (width: number, height: number) => void;
  background: (value: string | number) => void;
  fill: (value: string | number) => void;
  stroke: (value: string | number) => void;
  strokeWeight: (value: number) => void;
  rect: (x: number, y: number, width: number, height: number) => void;
  noFill: () => void;
  noLoop: () => void;
  loop: () => void;
  redraw: () => void;
  frameRate: (value: number) => void;
  remove: () => void;
  mouseX: number;
  mouseY: number;
  width: number;
  height: number;
  setup?: () => void;
  draw?: () => void;
  mousePressed?: () => void;
  mouseMoved?: () => void;
  mouseDragged?: () => void;
  mouseReleased?: () => void;
};

type Grid = number[][];

export type GameOfLifePatternId = 'glider' | 'blinker' | 'block' | 'toad' | 'pulsar';

export type GameOfLifeStats = {
  generation: number;
  isRunning: boolean;
  speed: number;
  cols: number;
  rows: number;
  liveCells: number;
};

export type GameOfLifeTheme = {
  background: string;
  dead: string;
  alive: string;
  stroke: string;
  hover: string;
  shadow: string;
};

export type GameOfLifeController = {
  toggleRunning: () => void;
  setRunning: (value: boolean) => void;
  step: () => void;
  clear: () => void;
  randomize: () => void;
  reset: () => void;
  getSeedMatrix: () => Grid;
  setSpeed: (value: number) => void;
  placePattern: (patternId: GameOfLifePatternId) => void;
  resize: (width: number, height: number) => void;
  destroy: () => void;
};

type CreateSketchOptions = {
  container: HTMLElement;
  theme: GameOfLifeTheme;
  initialSpeed?: number;
  resolution?: number;
  onStatsChange: (stats: GameOfLifeStats) => void;
  onReady: (controller: GameOfLifeController) => void;
};

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

const PATTERNS: Record<GameOfLifePatternId, Grid> = {
  glider: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ],
  blinker: [[1, 1, 1]],
  block: [
    [1, 1],
    [1, 1],
  ],
  toad: [
    [0, 1, 1, 1],
    [1, 1, 1, 0],
  ],
  pulsar: [
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  ],
};

export const GAME_OF_LIFE_PATTERNS: Array<{
  id: GameOfLifePatternId;
  label: string;
}> = [
  { id: 'glider', label: 'Glider' },
  { id: 'blinker', label: 'Blinker' },
  { id: 'block', label: 'Block' },
  { id: 'toad', label: 'Toad' },
  { id: 'pulsar', label: 'Pulsar' },
];

function createEmptyGrid(cols: number, rows: number): Grid {
  return Array.from({ length: cols }, () => Array.from({ length: rows }, () => 0));
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((column) => [...column]);
}

function toRowMajorMatrix(grid: Grid, cols: number, rows: number): Grid {
  const matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      matrix[row][col] = grid[col]?.[row] === 1 ? 1 : 0;
    }
  }

  return matrix;
}

function countLiveCells(grid: Grid) {
  let liveCells = 0;

  for (let x = 0; x < grid.length; x += 1) {
    for (let y = 0; y < grid[x].length; y += 1) {
      liveCells += grid[x][y];
    }
  }

  return liveCells;
}

function countNeighbors(grid: Grid, x: number, y: number, cols: number, rows: number) {
  let sum = 0;

  for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      const wrappedX = (x + offsetX + cols) % cols;
      const wrappedY = (y + offsetY + rows) % rows;
      sum += grid[wrappedX][wrappedY];
    }
  }

  return sum;
}

function computeNextGeneration(grid: Grid, cols: number, rows: number) {
  const nextGrid = createEmptyGrid(cols, rows);

  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      const state = grid[x][y];
      const neighbors = countNeighbors(grid, x, y, cols, rows);

      if (state === 1 && (neighbors === 2 || neighbors === 3)) {
        nextGrid[x][y] = 1;
      } else if (state === 0 && neighbors === 3) {
        nextGrid[x][y] = 1;
      } else {
        nextGrid[x][y] = 0;
      }
    }
  }

  return nextGrid;
}

function randomizeGrid(grid: Grid) {
  for (let x = 0; x < grid.length; x += 1) {
    for (let y = 0; y < grid[x].length; y += 1) {
      grid[x][y] = Math.random() < 0.25 ? 1 : 0;
    }
  }
}

function resampleGrid(sourceGrid: Grid, nextCols: number, nextRows: number) {
  const nextGrid = createEmptyGrid(nextCols, nextRows);

  if (sourceGrid.length === 0 || sourceGrid[0]?.length === 0) {
    return nextGrid;
  }

  const sourceCols = sourceGrid.length;
  const sourceRows = sourceGrid[0].length;

  for (let x = 0; x < nextCols; x += 1) {
    for (let y = 0; y < nextRows; y += 1) {
      const sourceX = Math.min(sourceCols - 1, Math.floor((x / nextCols) * sourceCols));
      const sourceY = Math.min(sourceRows - 1, Math.floor((y / nextRows) * sourceRows));
      nextGrid[x][y] = sourceGrid[sourceX][sourceY];
    }
  }

  return nextGrid;
}

function centerPattern(grid: Grid, pattern: Grid, cols: number, rows: number) {
  const startX = Math.floor(cols / 2) - Math.floor(pattern[0].length / 2);
  const startY = Math.floor(rows / 2) - Math.floor(pattern.length / 2);

  for (let patternRow = 0; patternRow < pattern.length; patternRow += 1) {
    for (let patternCol = 0; patternCol < pattern[patternRow].length; patternCol += 1) {
      const wrappedX = (startX + patternCol + cols) % cols;
      const wrappedY = (startY + patternRow + rows) % rows;
      grid[wrappedX][wrappedY] = pattern[patternRow][patternCol];
    }
  }
}

export function createGameOfLifeSketch(options: CreateSketchOptions) {
  const resolution = options.resolution ?? 10;
  let cols = Math.max(12, Math.floor(DEFAULT_CANVAS_WIDTH / resolution));
  let rows = Math.max(12, Math.floor(DEFAULT_CANVAS_HEIGHT / resolution));
  let grid = createEmptyGrid(cols, rows);
  let seedGrid = createEmptyGrid(cols, rows);
  let generation = 0;
  let isRunning = false;
  let speed = options.initialSpeed ?? 10;
  let hoverCell: { x: number; y: number } | null = null;
  let dragMode: 0 | 1 | null = null;
  let lastDraggedCellKey: string | null = null;
  let canvasWidth = DEFAULT_CANVAS_WIDTH;
  let canvasHeight = DEFAULT_CANVAS_HEIGHT;
  let p5Instance: P5Instance | null = null;

  const publish = () => {
    options.onStatsChange({
      generation,
      isRunning,
      speed,
      cols,
      rows,
      liveCells: countLiveCells(grid),
    });
  };

  const redraw = () => {
    if (p5Instance) {
      p5Instance.redraw();
    }
  };

  const syncSeed = () => {
    seedGrid = cloneGrid(grid);
  };

  const replaceGrid = (nextGrid: Grid, resetGeneration = false) => {
    grid = nextGrid;

    if (resetGeneration) {
      generation = 0;
    }

    publish();
    redraw();
  };

  const updateHoverCell = (mouseX: number, mouseY: number) => {
    if (mouseX < 0 || mouseY < 0 || mouseX >= canvasWidth || mouseY >= canvasHeight) {
      hoverCell = null;
      redraw();
      return;
    }

    hoverCell = {
      x: Math.floor(mouseX / resolution),
      y: Math.floor(mouseY / resolution),
    };
    redraw();
  };

  const toggleCell = (mouseX: number, mouseY: number) => {
    const cellX = Math.floor(mouseX / resolution);
    const cellY = Math.floor(mouseY / resolution);

    if (cellX < 0 || cellX >= cols || cellY < 0 || cellY >= rows) {
      return;
    }

    grid[cellX][cellY] = grid[cellX][cellY] === 1 ? 0 : 1;

    if (!isRunning) {
      generation = 0;
      syncSeed();
    }

    publish();
    redraw();
  };

  const setCellState = (cellX: number, cellY: number, value: 0 | 1) => {
    if (cellX < 0 || cellX >= cols || cellY < 0 || cellY >= rows) {
      return false;
    }

    if (grid[cellX][cellY] === value) {
      return false;
    }

    grid[cellX][cellY] = value;
    generation = 0;
    syncSeed();
    publish();
    redraw();
    return true;
  };

  const beginPointerEdit = (mouseX: number, mouseY: number) => {
    const cellX = Math.floor(mouseX / resolution);
    const cellY = Math.floor(mouseY / resolution);

    if (cellX < 0 || cellX >= cols || cellY < 0 || cellY >= rows) {
      dragMode = null;
      lastDraggedCellKey = null;
      return;
    }

    if (isRunning) {
      controller.setRunning(false);
    }

    const nextValue = grid[cellX][cellY] === 1 ? 0 : 1;
    dragMode = nextValue as 0 | 1;
    lastDraggedCellKey = `${cellX},${cellY}`;
    setCellState(cellX, cellY, dragMode);
  };

  const dragPaint = (mouseX: number, mouseY: number) => {
    if (dragMode === null) {
      return;
    }

    const cellX = Math.floor(mouseX / resolution);
    const cellY = Math.floor(mouseY / resolution);
    const cellKey = `${cellX},${cellY}`;

    if (cellKey === lastDraggedCellKey) {
      return;
    }

    lastDraggedCellKey = cellKey;
    setCellState(cellX, cellY, dragMode);
  };

  const resizeBoard = (nextWidth: number, nextHeight: number) => {
    const safeWidth = Math.max(resolution * 12, Math.floor(nextWidth));
    const safeHeight = Math.max(resolution * 12, Math.floor(nextHeight));
    const nextCols = Math.max(12, Math.floor(safeWidth / resolution));
    const nextRows = Math.max(12, Math.floor(safeHeight / resolution));

    canvasWidth = nextCols * resolution;
    canvasHeight = nextRows * resolution;

    if (p5Instance) {
      p5Instance.resizeCanvas(canvasWidth, canvasHeight);
    }

    if (nextCols === cols && nextRows === rows) {
      redraw();
      return;
    }

    grid = resampleGrid(grid, nextCols, nextRows);
    seedGrid = resampleGrid(seedGrid, nextCols, nextRows);
    cols = nextCols;
    rows = nextRows;
    publish();
    redraw();
  };

  const controller: GameOfLifeController = {
    toggleRunning() {
      controller.setRunning(!isRunning);
    },
    setRunning(value) {
      isRunning = value;
      publish();

      if (!p5Instance) {
        return;
      }

      if (isRunning) {
        p5Instance.frameRate(speed);
        p5Instance.loop();
      } else {
        p5Instance.noLoop();
        p5Instance.redraw();
      }
    },
    step() {
      if (isRunning) {
        return;
      }

      grid = computeNextGeneration(grid, cols, rows);
      generation += 1;
      publish();
      redraw();
    },
    clear() {
      replaceGrid(createEmptyGrid(cols, rows), true);
      syncSeed();
    },
    randomize() {
      const nextGrid = createEmptyGrid(cols, rows);
      randomizeGrid(nextGrid);
      replaceGrid(nextGrid, true);
      syncSeed();
    },
    reset() {
      replaceGrid(cloneGrid(seedGrid), true);
    },
    getSeedMatrix() {
      return toRowMajorMatrix(seedGrid, cols, rows);
    },
    setSpeed(value) {
      speed = value;
      publish();

      if (p5Instance && isRunning) {
        p5Instance.frameRate(speed);
      }
    },
    placePattern(patternId) {
      const pattern = PATTERNS[patternId];

      if (!pattern) {
        return;
      }

      const nextGrid = createEmptyGrid(cols, rows);
      centerPattern(nextGrid, pattern, cols, rows);
      replaceGrid(nextGrid, true);
      syncSeed();
    },
    resize(width, height) {
      resizeBoard(width, height);
    },
    destroy() {
      if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
      }
    },
  };

  options.onReady(controller);

  return (p: P5Instance) => {
    p5Instance = p;

    p.setup = () => {
      const canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent(options.container);
      controller.randomize();
      p.frameRate(speed);
      p.noLoop();
      p.redraw();
    };

    p.draw = () => {
      p.background(options.theme.background);
      p.stroke(options.theme.stroke);
      p.strokeWeight(1);

      for (let x = 0; x < cols; x += 1) {
        for (let y = 0; y < rows; y += 1) {
          p.fill(grid[x][y] === 1 ? options.theme.alive : options.theme.dead);
          p.rect(x * resolution, y * resolution, resolution, resolution);
        }
      }

      if (hoverCell && hoverCell.x >= 0 && hoverCell.x < cols && hoverCell.y >= 0 && hoverCell.y < rows) {
        p.noFill();
        p.stroke(options.theme.hover);
        p.strokeWeight(2);
        p.rect(hoverCell.x * resolution, hoverCell.y * resolution, resolution, resolution);
      }

      if (isRunning) {
        grid = computeNextGeneration(grid, cols, rows);
        generation += 1;
        publish();
      }
    };

    p.mousePressed = () => {
      beginPointerEdit(p.mouseX, p.mouseY);
    };

    p.mouseMoved = () => {
      updateHoverCell(p.mouseX, p.mouseY);
    };

    p.mouseDragged = () => {
      updateHoverCell(p.mouseX, p.mouseY);
      dragPaint(p.mouseX, p.mouseY);
    };

    p.mouseReleased = () => {
      dragMode = null;
      lastDraggedCellKey = null;
    };
  };
}
