import React, { useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

type GraphSeries = {
  key: string;
  label: string;
  color: string;
};

type PopulationGraphProps = {
  title: string;
  history: Array<Record<string, number>>;
  series: GraphSeries[];
  ariaLabel: string;
};

export default function PopulationGraph({
  title,
  history,
  series,
  ariaLabel,
}: PopulationGraphProps) {
  const { colorMode } = useColorMode();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawGraph() {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || typeof window === 'undefined') {
      return;
    }

    const rect = container.getBoundingClientRect();

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

    const padding = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 12,
    };
    const plotWidth = rect.width - padding.left - padding.right;
    const plotHeight = rect.height - padding.top - padding.bottom;

    const axisColor = colorMode === 'dark' ? 'rgba(245, 245, 245, 0.26)' : 'rgba(44, 44, 44, 0.2)';
    const fillColor = colorMode === 'dark' ? 'rgba(42, 42, 42, 0.4)' : 'rgba(245, 245, 245, 0.65)';
    const labelColor = colorMode === 'dark' ? '#bdbdbd' : '#6a6a6a';
    const maxValue = Math.max(
      1,
      ...history.flatMap((entry) =>
        series.map((item) => entry[item.key] ?? 0),
      ),
    );

    context.fillStyle = fillColor;
    context.fillRect(padding.left, padding.top, plotWidth, plotHeight);
    context.strokeStyle = axisColor;
    context.lineWidth = 1;
    context.strokeRect(padding.left, padding.top, plotWidth, plotHeight);

    context.strokeStyle = axisColor;
    context.beginPath();
    context.moveTo(padding.left, padding.top + plotHeight);
    context.lineTo(padding.left + plotWidth, padding.top + plotHeight);
    context.moveTo(padding.left, padding.top);
    context.lineTo(padding.left, padding.top + plotHeight);
    context.stroke();

    context.font = '11px Helvetica Neue, Arial, sans-serif';
    context.fillStyle = labelColor;
    context.fillText(String(maxValue), padding.left + 4, padding.top + 12);
    context.fillText('0', padding.left + 4, padding.top + plotHeight - 4);

    if (history.length < 2) {
      return;
    }

    const stepWidth = history.length > 1 ? plotWidth / (history.length - 1) : plotWidth;

    series.forEach((item) => {
      context.beginPath();
      context.strokeStyle = item.color;
      context.lineWidth = 2;

      history.forEach((entry, index) => {
        const x = padding.left + stepWidth * index;
        const y = padding.top + plotHeight - ((entry[item.key] ?? 0) / maxValue) * plotHeight;

        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });

      context.stroke();
    });
  }

  useEffect(() => {
    drawGraph();
  }, [history, series, colorMode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const browserWindow: Window & typeof globalThis = window;
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleResize = () => {
      drawGraph();
    };

    handleResize();

    browserWindow.addEventListener('resize', handleResize);
    return () => {
      browserWindow.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={styles.graphPanel} aria-label={ariaLabel}>
      <p className={styles.sectionTitle}>{title}</p>
      <div ref={containerRef} className={styles.graphFrame}>
        <canvas ref={canvasRef} className={styles.graphCanvas} />
      </div>
      <div className={styles.graphLegend}>
        {series.map((item) => (
          <span key={item.key} className={styles.graphLegendItem}>
            <span className={styles.graphDot} style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
