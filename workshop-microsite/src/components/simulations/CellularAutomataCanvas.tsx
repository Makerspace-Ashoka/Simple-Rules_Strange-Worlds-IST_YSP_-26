import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export type CanvasPaletteEntry = {
  fill: string;
};

export type CanvasCellEvent = {
  x: number;
  y: number;
  index: number;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  buttons: number;
  pointerType: string;
};

type CellularAutomataCanvasProps = {
  ariaLabel: string;
  cols: number;
  rows: number;
  grid: Uint8Array;
  revision: number;
  palette: Record<number, CanvasPaletteEntry>;
  backgroundColor: string;
  borderColor: string;
  gridColor: string;
  highlightMask?: Uint8Array | null;
  targetMask?: Uint8Array | null;
  targetColor?: string;
  onCellPointerDown?: (cell: CanvasCellEvent) => void;
  onCellPointerDrag?: (cell: CanvasCellEvent) => void;
  onCellPointerUp?: (cell: CanvasCellEvent | null) => void;
};

function buildCellEvent(
  cols: number,
  rows: number,
  canvas: HTMLCanvasElement,
  event: Pick<React.PointerEvent<HTMLCanvasElement>, 'clientX' | 'clientY' | 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey' | 'buttons' | 'pointerType'>,
) {
  const rect = canvas.getBoundingClientRect();
  const cellSize = Math.min(rect.width / cols, rect.height / rows);
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;
  const offsetX = (rect.width - gridWidth) / 2;
  const offsetY = (rect.height - gridHeight) / 2;
  const localX = event.clientX - rect.left - offsetX;
  const localY = event.clientY - rect.top - offsetY;

  if (localX < 0 || localY < 0 || localX >= gridWidth || localY >= gridHeight) {
    return null;
  }

  const x = Math.floor(localX / cellSize);
  const y = Math.floor(localY / cellSize);

  if (x < 0 || x >= cols || y < 0 || y >= rows) {
    return null;
  }

  return {
    x,
    y,
    index: y * cols + x,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    buttons: event.buttons,
    pointerType: event.pointerType,
  };
}

export default function CellularAutomataCanvas({
  ariaLabel,
  cols,
  rows,
  grid,
  revision,
  palette,
  backgroundColor,
  borderColor,
  gridColor,
  highlightMask = null,
  targetMask = null,
  targetColor = '#ffab00',
  onCellPointerDown,
  onCellPointerDrag,
  onCellPointerUp,
}: CellularAutomataCanvasProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggingRef = useRef(false);
  const lastCellIndexRef = useRef<number | null>(null);

  function drawCanvas() {
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
    context.clearRect(0, 0, rect.width, rect.height);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, rect.width, rect.height);

    const cellSize = Math.min(rect.width / cols, rect.height / rows);
    const gridWidth = cols * cellSize;
    const gridHeight = rows * cellSize;
    const offsetX = (rect.width - gridWidth) / 2;
    const offsetY = (rect.height - gridHeight) / 2;
    const gap = Math.max(0.8, cellSize * 0.08);
    const drawSize = Math.max(1.2, cellSize - gap * 2);

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const index = y * cols + x;
        const left = offsetX + x * cellSize + gap;
        const top = offsetY + y * cellSize + gap;
        const state = grid[index];
        const entry = palette[state] ?? palette[0];

        context.fillStyle = entry.fill;
        context.fillRect(left, top, drawSize, drawSize);

        if (highlightMask?.[index] === 1) {
          context.strokeStyle = targetColor;
          context.lineWidth = Math.max(1.1, cellSize * 0.08);
          context.strokeRect(left, top, drawSize, drawSize);
        }

        if (targetMask?.[index] === 1) {
          context.save();
          context.strokeStyle = targetColor;
          context.lineWidth = Math.max(1.2, cellSize * 0.08);
          context.shadowColor = targetColor;
          context.shadowBlur = cellSize * 0.3;
          context.strokeRect(left + gap * 0.12, top + gap * 0.12, drawSize - gap * 0.24, drawSize - gap * 0.24);
          context.restore();
        }

        context.strokeStyle = gridColor;
        context.lineWidth = 1;
        context.strokeRect(left, top, drawSize, drawSize);
      }
    }

    context.strokeStyle = borderColor;
    context.lineWidth = 2;
    context.strokeRect(offsetX + 1, offsetY + 1, gridWidth - 2, gridHeight - 2);
  }

  useEffect(() => {
    drawCanvas();
  }, [backgroundColor, borderColor, cols, grid, gridColor, highlightMask, palette, revision, rows, targetColor, targetMask]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const browserWindow: Window & typeof globalThis = window;
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const handleResize = () => {
      drawCanvas();
    };

    handleResize();

    browserWindow.addEventListener('resize', handleResize);
    return () => {
      browserWindow.removeEventListener('resize', handleResize);
    };
  }, [cols, rows]);

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const cell = buildCellEvent(cols, rows, canvas, event);

    if (!cell) {
      return;
    }

    draggingRef.current = true;
    lastCellIndexRef.current = cell.index;
    canvas.setPointerCapture?.(event.pointerId);
    onCellPointerDown?.(cell);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingRef.current || !onCellPointerDrag) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const cell = buildCellEvent(cols, rows, canvas, event);

    if (!cell || cell.index === lastCellIndexRef.current) {
      return;
    }

    lastCellIndexRef.current = cell.index;
    onCellPointerDrag(cell);
  }

  function finishInteraction(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      draggingRef.current = false;
      lastCellIndexRef.current = null;
      onCellPointerUp?.(null);
      return;
    }

    const cell = buildCellEvent(cols, rows, canvas, event);

    draggingRef.current = false;
    lastCellIndexRef.current = null;
    canvas.releasePointerCapture?.(event.pointerId);
    onCellPointerUp?.(cell);
  }

  return (
    <div ref={frameRef} className={styles.canvasFrame} style={{ aspectRatio: `${cols} / ${rows}` }}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label={ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishInteraction}
        onPointerCancel={finishInteraction}
      />
    </div>
  );
}
