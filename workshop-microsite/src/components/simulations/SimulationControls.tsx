import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type SimulationAction = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'secondary' | 'accent';
};

export type SimulationSlider = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

export type SimulationSelect = {
  id: string;
  label: string;
  value: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  onChange: (value: string) => void;
};

type SimulationControlsProps = {
  title?: string;
  actions: SimulationAction[];
  sliders?: SimulationSlider[];
  selects?: SimulationSelect[];
};

function toneClassName(tone?: SimulationAction['tone']) {
  if (tone === 'primary') {
    return styles.buttonPrimary;
  }

  if (tone === 'secondary') {
    return styles.buttonSecondary;
  }

  return undefined;
}

export default function SimulationControls({
  title = 'Controls',
  actions,
  sliders = [],
  selects = [],
}: SimulationControlsProps) {
  return (
    <section className={styles.controlsPanel} aria-label={title}>
      <p className={styles.sectionTitle}>{title}</p>

      <div className={styles.buttonGrid}>
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={clsx(styles.actionButton, toneClassName(action.tone))}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </button>
        ))}
      </div>

      {selects.length > 0 ? (
        <div className={styles.fieldStack}>
          {selects.map((select) => (
            <label key={select.id} className={styles.controlField}>
              <span className={styles.controlHeader}>
                <span>{select.label}</span>
              </span>
              <select
                className={styles.selectInput}
                value={select.value}
                onChange={(event) => select.onChange(event.target.value)}
              >
                {select.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}

      {sliders.length > 0 ? (
        <div className={styles.fieldStack}>
          {sliders.map((slider) => (
            <label key={slider.id} className={styles.controlField}>
              <span className={styles.controlHeader}>
                <span>{slider.label}</span>
                <span className={styles.controlValue}>
                  {slider.formatValue ? slider.formatValue(slider.value) : slider.value}
                </span>
              </span>
              <input
                className={styles.sliderInput}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={(event) => slider.onChange(Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      ) : null}
    </section>
  );
}
