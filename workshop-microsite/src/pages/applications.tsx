import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import PandemicSimulation from '@site/src/components/simulations/PandemicSimulation';
import PredatorPreySimulation from '@site/src/components/simulations/PredatorPreySimulation';
import styles from './applications.module.css';

type TabId = 'pandemic' | 'predator-prey';

const TAB_COPY: Record<TabId, { label: string; description: string }> = {
  pandemic: {
    label: 'Pandemic Spread',
    description:
      'Explore how local infection, host survival, and spatial spread turn a host-pathogen system into a cellular automaton.',
  },
  'predator-prey': {
    label: 'Predator–Prey',
    description:
      'Experiment with local ecological rules that can produce coexistence, collapse, oscillation, and spatial waves.',
  },
};

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('pandemic');

  return (
    <Layout
      title="Applications of Cellular Automata"
      description="Explore interactive cellular automata models for pandemic spread and predator prey dynamics.">
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Interactive Applications</p>
            <Heading as="h1" className={styles.title}>
              Applications of Cellular Automata
            </Heading>
            <p className={styles.subtitle}>
              Explore how simple local rules can model real-world systems like disease spread and predator–prey interaction.
            </p>

            <div className={styles.tabBar} role="tablist" aria-label="Applications tabs">
              {(Object.keys(TAB_COPY) as TabId[]).map((tabId) => (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tabId}
                  className={`${styles.tabButton} ${activeTab === tabId ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveTab(tabId)}
                >
                  {TAB_COPY[tabId].label}
                </button>
              ))}
            </div>

            <p className={styles.tabDescription}>{TAB_COPY[activeTab].description}</p>
          </div>
        </section>

        <section className={styles.simulationSection}>
          <div className="container">
            <div className={styles.simulationPanel}>
              {activeTab === 'pandemic' ? <PandemicSimulation /> : <PredatorPreySimulation />}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
