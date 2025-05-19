import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './submit.module.css';

<input type="hidden" name="access_key" value="dbbd1b6a-8acf-487f-a291-61e154d58f0b" />
// Define TypeScript interfaces for our state
interface BasicInfoState {
  name: string;
  email: string;
  permission: boolean;
}

interface StatusMessageState {
  type: '' | 'success' | 'error';
  message: string;
}

const Submit: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const formRef = useRef<HTMLFormElement>(null);
  const patternFormRef = useRef<HTMLFormElement>(null);

  // State for form data and status messages
  const [basicInfo, setBasicInfo] = useState<BasicInfoState>({
    name: '',
    email: '',
    permission: false
  });

  const [activeTab, setActiveTab] = useState<string>('info');
  const [projectResult, setProjectResult] = useState<string>("");
  const [patternResult, setPatternResult] = useState<string>("");

  const [patternCount, setPatternCount] = useState<number>(0);

  // Handle changes in the basic info form
  const handleBasicInfoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setBasicInfo({
      ...basicInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle project form submission
  const handleProjectSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!basicInfo.name || !basicInfo.email || !basicInfo.permission) {
      setProjectResult('Please fill out all required fields in the Basic Info tab.');
      setActiveTab('info');
      return;
    }

    setProjectResult("Sending...");

    const formData = new FormData(e.target as HTMLFormElement);

    // Add basic info fields to form data
    formData.append('name', basicInfo.name);
    formData.append('email', basicInfo.email);
    formData.append('form_type', 'project_submission');
    formData.append('access_key', 'dbbd1b6a-8acf-487f-a291-61e154d58f0b');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setProjectResult('Your project has been submitted successfully!');
        (e.target as HTMLFormElement).reset();
        setActiveTab('patterns');
      } else {
        console.log("Error", data);
        setProjectResult(data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setProjectResult(errorMessage);
    }
  };

  // Handle pattern form submission
  const handlePatternSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!basicInfo.name || !basicInfo.email) {
      setPatternResult('Please fill out all required fields in the Basic Info tab.');
      setActiveTab('info');
      return;
    }

    setPatternResult("Sending...");

    const formData = new FormData(e.target as HTMLFormElement);

    // Add basic info fields to form data
    formData.append('name', basicInfo.name);
    formData.append('email', basicInfo.email);
    formData.append('form_type', 'pattern_submission');
    formData.append('access_key', 'dbbd1b6a-8acf-487f-a291-61e154d58f0b');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setPatternResult('Your pattern has been submitted successfully!');
        (e.target as HTMLFormElement).reset();
        setPatternCount(patternCount + 1);
      } else {
        console.log("Error", data);
        setPatternResult(data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setPatternResult(errorMessage);
    }
  };

  // Handle tab changes
  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

  // Move to next tab
  const moveToNextTab = (nextTab: string): void => {
    setActiveTab(nextTab);
  };

  return (
    <Layout
      title={`Submit Your Work | ${siteConfig.title}`}
      description="Submit your cellular automata project and patterns">
      <main className={styles.bauhasuFormContainer}>
        <div className={styles.bauhasuFormHeader}>
          <h1>Submit Your Work</h1>
          <p className={styles.formIntroduction}>
            Share your cellular automata creations with the community! You can submit your project implementation
            and any interesting start states you've discovered.
          </p>

          {/* Bauhaus decorative elements */}
          <div className={styles.decorativeElements}>
            <div className={styles.redSquare}></div>
            <div className={styles.blueCircle}></div>
            <div className={styles.yellowTriangle}></div>
            <div className={styles.blackRectangle}></div>
          </div>
        </div>

        <Tabs
          className={styles.bauhausTabs}
          defaultValue={activeTab}
          values={[
            { label: '1. Basic Info', value: 'info' },
            { label: '2. Project Link', value: 'project' },
            { label: '3. Start States', value: 'patterns' },
          ]}
          onValueChange={handleTabChange}>

          <TabItem value="info">
            <div className={styles.bauhausFormSection}>
              <h2>Your Information</h2>
              <p>This information will be used for all your submissions.</p>

              <div className={styles.formField}>
                <label htmlFor="student-name">Your Name</label>
                <input
                  type="text"
                  id="student-name"
                  name="name"
                  value={basicInfo.name}
                  onChange={handleBasicInfoChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="student-email">Email</label>
                <input
                  type="email"
                  id="student-email"
                  name="email"
                  value={basicInfo.email}
                  onChange={handleBasicInfoChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={`${styles.formField} ${styles.checkbox}`}>
                <input
                  type="checkbox"
                  id="permission"
                  name="permission"
                  checked={basicInfo.permission}
                  onChange={handleBasicInfoChange}
                  required
                />
                <label htmlFor="permission">I grant permission to showcase my submissions in the gallery</label>
              </div>

              <div className={styles.navigationButtons}>
                <button
                  className={`${styles.bauhausButton} ${styles.next}`}
                  type="button"
                  onClick={() => moveToNextTab('project')}
                >
                  Next: Submit Project
                </button>
              </div>
            </div>
          </TabItem>

          <TabItem value="project">
            <div className={styles.bauhausFormSection}>
              <h2>Project Submission</h2>
              <p>Share your p5.js implementation</p>

              <form
                ref={formRef}
                onSubmit={handleProjectSubmit}
                className={styles.bauhausForm}
              >
                {/* Web3Forms required fields */}
                <input type="hidden" name="subject" value="New Cellular Automata Project Submission" />
                <input type="hidden" name="redirect" value="false" />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                <div className={styles.formField}>
                  <label htmlFor="project-url">p5.js Web Editor URL</label>
                  <input
                    type="url"
                    id="project-url"
                    name="project_url"
                    placeholder="https://editor.p5js.org/your-username/sketches/your-sketch-id"
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="project-description">Brief Description</label>
                  <textarea
                    id="project-description"
                    name="project_description"
                    placeholder="Describe your implementation and any interesting features"
                    rows={4}
                    required
                  ></textarea>
                </div>

                <div className={styles.formField}>
                  <label htmlFor="project-rules">Rule Modifications</label>
                  <textarea
                    id="project-rules"
                    name="project_rules"
                    placeholder="Describe any rule modifications you made to the cellular automaton"
                    rows={3}
                  ></textarea>
                </div>

                <div className={styles.navigationButtons}>
                  <button
                    className={`${styles.bauhausButton} ${styles.prev}`}
                    type="button"
                    onClick={() => moveToNextTab('info')}
                  >
                    Back
                  </button>
                  <button
                    className={`${styles.bauhausButton} ${styles.submit}`}
                    type="submit"
                  >
                    Submit Project
                  </button>
                  <button
                    className={`${styles.bauhausButton} ${styles.next}`}
                    type="button"
                    onClick={() => moveToNextTab('patterns')}
                  >
                    Next: Submit Start States
                  </button>
                </div>
              </form>
            </div>
          </TabItem>

          <TabItem value="patterns">
            <div className={styles.bauhausFormSection}>
              <h2>Start State Patterns</h2>
              <p>Share interesting initial patterns you've discovered. You can submit multiple patterns over time.</p>

              <div className={styles.patternCounter}>
                <span>Patterns Submitted: </span>
                <strong>{patternCount}</strong>
              </div>

              <form
                ref={patternFormRef}
                onSubmit={handlePatternSubmit}
                className={styles.bauhausForm}
              >
                {/* Web3Forms required fields */}
                <input type="hidden" name="subject" value="New Cellular Automata Pattern Submission" />
                <input type="hidden" name="redirect" value="false" />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                <div className={styles.formField}>
                  <label htmlFor="pattern-name">Pattern Name</label>
                  <input
                    type="text"
                    id="pattern-name"
                    name="pattern_name"
                    placeholder="Give your pattern a creative name"
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="pattern-category">Pattern Category</label>
                  <select id="pattern-category" name="pattern_category" required>
                    <option value="">Select a category</option>
                    <option value="still_life">Still Life</option>
                    <option value="oscillator">Oscillator</option>
                    <option value="spaceship">Spaceship</option>
                    <option value="methuselah">Methuselah</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label htmlFor="pattern-representation">Pattern Representation</label>
                  <textarea
                    id="pattern-representation"
                    name="pattern_representation"
                    placeholder="Represent your pattern using text (e.g., using 1s and 0s or other notation)"
                    rows={6}
                    required
                  ></textarea>
                </div>

                <div className={styles.formField}>
                  <label htmlFor="pattern-behavior">Interesting Behavior</label>
                  <textarea
                    id="pattern-behavior"
                    name="pattern_behavior"
                    placeholder="Describe what makes this pattern interesting"
                    rows={4}
                    required
                  ></textarea>
                </div>

                <div className={styles.navigationButtons}>
                  <button
                    className={`${styles.bauhausButton} ${styles.prev}`}
                    type="button"
                    onClick={() => moveToNextTab('project')}
                  >
                    Back
                  </button>
                  <button
                    className={`${styles.bauhausButton} ${styles.submit}`}
                    type="submit"
                  >
                    Submit Pattern
                  </button>
                </div>
              </form>
            </div>
          </TabItem>
        </Tabs>

        {projectResult && activeTab === 'project' && (
          <div className={`${styles.formStatus} ${projectResult.includes('success') ? styles.success : styles.error}`}>
            {projectResult}
          </div>
        )}

        {patternResult && activeTab === 'patterns' && (
          <div className={`${styles.formStatus} ${patternResult.includes('success') ? styles.success : styles.error}`}>
            {patternResult}
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Submit;

