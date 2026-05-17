import React, { useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import type { Matrix } from './gameOfLifeRules';
import styles from './styles.module.css';

type GameOfLifeCanvasProps = {
  matrix: Matrix;
  ariaLabel: string;
};

export default function GameOfLifeCanvas({ matrix, ariaLabel }: GameOfLifeCanvasProps) {
  const { colorMode } = useColorMode();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawMatrix() {
    const frame = frameRef.current;
    const canvas = canvasRef.current;

    if (!frame || !canvas || typeof window === 'undefined') {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const rowCount = matrix.length;
    const colCount = matrix[0]?.length ?? 0;

    if (!rect.width || !rect.height || rowCount === 0 || colCount === 0) {
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

    const backgroundFill = colorMode === 'dark' ? 'rgba(15, 15, 16, 0.96)' : 'rgba(255, 255, 255, 0.88)';
    const deadFill = colorMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(44, 44, 44, 0.03)';
    const liveFill = colorMode === 'dark' ? '#ffab00' : '#6b1e2a';
    const gridStroke = colorMode === 'dark' ? 'rgba(245, 245, 245, 0.08)' : 'rgba(44, 44, 44, 0.08)';
    const borderStroke = colorMode === 'dark' ? 'rgba(245, 245, 245, 0.18)' : 'rgba(44, 44, 44, 0.14)';

    context.fillStyle = backgroundFill;
    context.fillRect(0, 0, rect.width, rect.height);

    const padding = 14;
    const cellSize = Math.max(
      1,
      Math.floor(
        Math.min((rect.width - padding * 2) / colCount, (rect.height - padding * 2) / rowCount),
      ),
    );
    const gridWidth = colCount * cellSize;
    const gridHeight = rowCount * cellSize;
    const offsetX = Math.floor((rect.width - gridWidth) / 2);
    const offsetY = Math.floor((rect.height - gridHeight) / 2);
    const gap = cellSize > 10 ? 1 : 0;
    const drawSize = Math.max(1, cellSize - gap * 2);

    context.fillStyle = deadFill;
    context.fillRect(offsetX, offsetY, gridWidth, gridHeight);

    for (let row = 0; row < rowCount; row += 1) {
      for (let col = 0; col < colCount; col += 1) {
        const left = offsetX + col * cellSize + gap;
        const top = offsetY + row * cellSize + gap;

        if (matrix[row][col] === 1) {
          context.fillStyle = liveFill;
          context.fillRect(left, top, drawSize, drawSize);
        }

        if (cellSize >= 8) {
          context.strokeStyle = gridStroke;
          context.lineWidth = 1;
          context.strokeRect(left, top, drawSize, drawSize);
        }
      }
    }

    context.strokeStyle = borderStroke;
    context.lineWidth = 2;
    context.strokeRect(offsetX, offsetY, gridWidth, gridHeight);
  }

  useEffect(() => {
    drawMatrix();
  }, [colorMode, matrix]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      drawMatrix();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [colorMode, matrix]);

  return (
    <div ref={frameRef} className={styles.canvasFrame}>
      <canvas ref={canvasRef} aria-label={ariaLabel} className={styles.canvas} />
    </div>
  );
}
