import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './submit.module.css';

// Define TypeScript interfaces for our state
interface BasicInfoState {
  name: string;
  email: string;
  permission: boolean;
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

  // Handle tab changes
  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

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

  // A simple custom tabs component
  const TabNavigation = () => (
    <div className={styles.customTabNavigation}>
      <ul>
        <li
          className={activeTab === 'info' ? styles.activeTab : ''}
          onClick={() => handleTabChange('info')}
        >
          1. Basic Info
        </li>
        <li
          className={activeTab === 'project' ? styles.activeTab : ''}
          onClick={() => handleTabChange('project')}
        >
          2. Project Link
        </li>
        <li
          className={activeTab === 'patterns' ? styles.activeTab : ''}
          onClick={() => handleTabChange('patterns')}
        >
          3. Start States
        </li>
      </ul>
    </div>
  );

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
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
                onClick={() => handleTabChange('project')}
              >
                Next: Submit Project
              </button>
            </div>
          </div>
        );

      case 'project':
        return (
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
                  onClick={() => handleTabChange('info')}
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
                  onClick={() => handleTabChange('patterns')}
                >
                  Next: Submit Start States
                </button>
              </div>
            </form>

            {projectResult && (
              <div className={`${styles.formStatus} ${projectResult.includes('success') ? styles.success : styles.error}`}>
                {projectResult}
              </div>
            )}
          </div>
        );

      case 'patterns':
        return (
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
                <div className={styles.patternInputHelp}>
                  <p>Paste your 2D array pattern below. Format example:</p>
                  <pre className={styles.codeExample}>
                    [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0]
                    ]
                  </pre>
                  <button
                    type="button"
                    className={styles.patternFormatButton}
                    onClick={() => {
                      // Get the textarea
                      const textarea = document.getElementById('pattern-representation') as HTMLTextAreaElement;
                      // Format the input if it's valid
                      try {
                        // Try to parse as JavaScript
                        const input = textarea.value.trim();
                        // Skip if empty
                        if (!input) return;

                        // Handle different input formats
                        let matrix;
                        if (input.startsWith('[') && input.endsWith(']')) {
                          // Try to parse as JSON
                          matrix = JSON.parse(input);
                        } else {
                          // Try to parse as space/newline separated format
                          matrix = input.split('\n').map(line =>
                            line.trim().split(/\s+/).map(cell =>
                              cell === '1' ? 1 : 0
                            )
                          );
                        }

                        // Validate it's a 2D array of 0s and 1s
                        if (!Array.isArray(matrix) || !matrix.every(row =>
                          Array.isArray(row) && row.every(cell =>
                            cell === 0 || cell === 1
                          )
                        )) {
                          throw new Error('Invalid pattern format');
                        }

                        // Format nicely with indentation
                        const formatted = '[\n' + matrix.map(row =>
                          '  [' + row.join(', ') + ']'
                        ).join(',\n') + '\n]';

                        // Update the textarea
                        textarea.value = formatted;
                      } catch (error) {
                        alert('Could not format pattern. Make sure it\'s a valid 2D array of 0s and 1s.');
                      }
                    }}
                  >
                    Format Pattern
                  </button>
                </div>
                <textarea
                  id="pattern-representation"
                  name="pattern_representation"
                  placeholder="Paste or type your pattern as a 2D array of 1s and 0s"
                  rows={10}
                  className={styles.codeTextarea}
                  required
                ></textarea>
                <div className={styles.patternPreview} id="pattern-preview">
                  {/* Pattern preview will be shown here */}
                </div>
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
                  onClick={() => handleTabChange('project')}
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

            {patternResult && (
              <div className={`${styles.formStatus} ${patternResult.includes('success') ? styles.success : styles.error}`}>
                {patternResult}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      title={`Submit Your Work | ${siteConfig.title}`}
      description="Submit your cellular automata project and patterns">
      <main className={styles.bauhausFormContainer}>
        <div className={styles.bauhausFormHeader}>
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

        {/* Custom tab navigation */}
        <TabNavigation />

        {/* Tab content */}
        <div className={styles.tabContent}>
          {renderTabContent()}
        </div>
      </main>
    </Layout>
  );
};

export default Submit;

