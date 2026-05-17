import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory, useLocation } from '@docusaurus/router';
import {
  parseMatrixInput,
  submitProjectSubmission,
  submitStartStateSubmission,
  validateMatrix,
} from '@site/src/components/startStateGallery/startStateStorage';
import styles from './submit.module.css';

interface BasicInfoState {
  name: string;
  email: string;
  permission: boolean;
}

interface ProjectInfoState {
  project_url: string;
  project_description: string;
  project_rules: string;
}

interface PatternFormState {
  pattern_name: string;
  pattern_category: string;
  pattern_representation: string;
  pattern_behavior: string;
}

type SuccessAction = {
  label: string;
  to: string;
} | null;

function getTabFromSearch(search: string) {
  const urlParams = new URLSearchParams(search);
  const tabParam = urlParams.get('tab');

  if (tabParam && ['info', 'project', 'patterns'].includes(tabParam)) {
    return tabParam;
  }

  return 'info';
}

const INITIAL_BASIC_INFO: BasicInfoState = {
  name: '',
  email: '',
  permission: false,
};

const INITIAL_PROJECT_INFO: ProjectInfoState = {
  project_url: '',
  project_description: '',
  project_rules: '',
};

const INITIAL_PATTERN_FORM: PatternFormState = {
  pattern_name: '',
  pattern_category: '',
  pattern_representation: '',
  pattern_behavior: '',
};

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default function SubmitPage() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const history = useHistory();

  const [basicInfo, setBasicInfo] = useState<BasicInfoState>(INITIAL_BASIC_INFO);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoState>(INITIAL_PROJECT_INFO);
  const [patternForm, setPatternForm] = useState<PatternFormState>(INITIAL_PATTERN_FORM);
  const [activeTab, setActiveTab] = useState(() => getTabFromSearch(location.search));
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successAction, setSuccessAction] = useState<SuccessAction>(null);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [isSubmittingPattern, setIsSubmittingPattern] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromSearch(location.search));
  }, [location.search]);

  const resetStatus = () => {
    setFormError('');
    setSuccessMessage('');
    setSuccessAction(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    resetStatus();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('tab', tab);
    history.push({
      pathname: location.pathname,
      search: urlParams.toString(),
    });
  };

  const handleBasicInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setBasicInfo((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProjectInfoChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setProjectInfo((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePatternFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setPatternForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const ensureBasicInfo = (requirePermission: boolean) => {
    if (!basicInfo.name.trim() || !basicInfo.email.trim()) {
      return 'Please fill out your name and email in the Basic Info tab.';
    }

    if (requirePermission && !basicInfo.permission) {
      return 'Please grant permission to showcase your submission in the Basic Info tab.';
    }

    return '';
  };

  const handlePatternFormat = () => {
    resetStatus();

    try {
      const parsed = parseMatrixInput(patternForm.pattern_representation);
      const validation = validateMatrix(parsed);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setPatternForm((current) => ({
        ...current,
        pattern_representation: JSON.stringify(validation.matrix, null, 2),
      }));
      setSuccessMessage('Pattern formatted as a submission-ready 2D array.');
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Please enter a rectangular matrix containing only 0s and 1s.',
      );
    }
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStatus();

    const basicInfoError = ensureBasicInfo(false);

    if (basicInfoError) {
      setFormError(basicInfoError);
      setActiveTab('info');
      scrollToTop();
      return;
    }

    setIsSubmittingProject(true);

    try {
      await submitProjectSubmission({
        studentName: basicInfo.name,
        email: basicInfo.email,
        permissionToShowcase: basicInfo.permission,
        projectUrl: projectInfo.project_url,
        projectDescription: projectInfo.project_description,
        ruleModifications: projectInfo.project_rules,
      });

      setProjectInfo(INITIAL_PROJECT_INFO);
      setSuccessMessage(
        basicInfo.permission
          ? 'Your p5.js project was submitted to the workshop server and can appear in the public Project Gallery.'
          : 'Your p5.js project was submitted to the workshop server. It will stay private unless you grant gallery permission in Basic Info.',
      );
      setSuccessAction({
        label: 'View Project Gallery',
        to: '/project-gallery',
      });
      scrollToTop();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'The project could not be submitted right now.',
      );
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handlePatternSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStatus();

    const basicInfoError = ensureBasicInfo(true);

    if (basicInfoError) {
      setFormError(basicInfoError);
      setActiveTab('info');
      scrollToTop();
      return;
    }

    if (!patternForm.pattern_name.trim()) {
      setFormError('Pattern Name is required.');
      return;
    }

    if (!patternForm.pattern_category.trim()) {
      setFormError('Pattern Category is required.');
      return;
    }

    if (!patternForm.pattern_representation.trim()) {
      setFormError('Pattern Representation is required.');
      return;
    }

    setIsSubmittingPattern(true);

    try {
      const parsedMatrix = parseMatrixInput(patternForm.pattern_representation);
      const validation = validateMatrix(parsedMatrix);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      await submitStartStateSubmission({
        studentName: basicInfo.name,
        email: basicInfo.email,
        permissionToShowcase: basicInfo.permission,
        patternName: patternForm.pattern_name,
        patternCategory: patternForm.pattern_category,
        patternMatrix: validation.matrix,
        interestingBehavior: patternForm.pattern_behavior,
        projectUrl: projectInfo.project_url || undefined,
        projectDescription: projectInfo.project_description || undefined,
        ruleModifications: projectInfo.project_rules || undefined,
      });

      setPatternForm(INITIAL_PATTERN_FORM);
      setSuccessMessage('Your start state was submitted and should now appear in the Start State Gallery.');
      setSuccessAction({
        label: 'View In Start State Gallery',
        to: '/start-state-gallery',
      });
      scrollToTop();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'The start state could not be submitted right now.',
      );
    } finally {
      setIsSubmittingPattern(false);
    }
  };

  const renderStatus = () => (
    <>
      {formError ? <div className={styles.formError}>{formError}</div> : null}
      {successMessage ? (
        <div className={styles.successPanel}>
          <p className={styles.successMessage}>{successMessage}</p>
          {successAction ? (
            <div className={styles.statusActions}>
              <Link className={styles.statusLink} to={successAction.to}>
                {successAction.label}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const renderTabNavigation = () => (
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className={styles.bauhausFormSection}>
            <h2>Your Information</h2>
            <p>This information will be used for both project and start-state submissions.</p>

            {renderStatus()}

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
              />
              <label htmlFor="permission">I grant permission to showcase my submissions in the gallery</label>
            </div>

            <div className={styles.navigationButtons}>
              <button
                className={`${styles.bauhausButton} ${styles.next}`}
                type="button"
                onClick={() => handleTabChange('project')}
              >
                Submit my p5js project
              </button>
              <button
                className={`${styles.bauhausButton} ${styles.next}`}
                type="button"
                onClick={() => handleTabChange('patterns')}
              >
                Submit a start state
              </button>
            </div>
          </div>
        );

      case 'project':
        return (
          <div className={styles.bauhausFormSection}>
            <h2>Project Submission</h2>
            <p>Share your p5.js implementation with the workshop server.</p>

            {renderStatus()}

            <form className={styles.bauhausForm} onSubmit={handleProjectSubmit}>
              <div className={styles.formField}>
                <label htmlFor="project-url">p5.js Web Editor URL</label>
                <input
                  type="url"
                  id="project-url"
                  name="project_url"
                  value={projectInfo.project_url}
                  onChange={handleProjectInfoChange}
                  placeholder="https://editor.p5js.org/your-username/sketches/your-sketch-id"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="project-description">Brief Description</label>
                <textarea
                  id="project-description"
                  name="project_description"
                  value={projectInfo.project_description}
                  onChange={handleProjectInfoChange}
                  placeholder="Describe your implementation and any interesting features"
                  rows={4}
                ></textarea>
              </div>

              <div className={styles.formField}>
                <label htmlFor="project-rules">Rule Modifications</label>
                <textarea
                  id="project-rules"
                  name="project_rules"
                  value={projectInfo.project_rules}
                  onChange={handleProjectInfoChange}
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
                  disabled={isSubmittingProject}
                >
                  {isSubmittingProject ? 'Submitting Project…' : 'Submit Project'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'patterns':
        return (
          <div className={styles.bauhausFormSection}>
            <h2>Start State Patterns</h2>
            <p>Share interesting initial patterns you&apos;ve discovered for the public Start State Gallery.</p>

            {renderStatus()}

            <form className={styles.bauhausForm} onSubmit={handlePatternSubmit}>
              <div className={styles.formField}>
                <label htmlFor="student-name-patterns">Your Name</label>
                <input
                  type="text"
                  id="student-name-patterns"
                  name="name"
                  value={basicInfo.name}
                  onChange={handleBasicInfoChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="student-email-patterns">Email</label>
                <input
                  type="email"
                  id="student-email-patterns"
                  name="email"
                  value={basicInfo.email}
                  onChange={handleBasicInfoChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="pattern-name">Pattern Name</label>
                <input
                  type="text"
                  id="pattern-name"
                  name="pattern_name"
                  value={patternForm.pattern_name}
                  onChange={handlePatternFormChange}
                  placeholder="Give your pattern a creative name"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="pattern-category">Pattern Category</label>
                <select
                  id="pattern-category"
                  name="pattern_category"
                  value={patternForm.pattern_category}
                  onChange={handlePatternFormChange}
                  required
                >
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
                  <p>Paste your matrix below. Supported formats include a JSON-style 2D array or simple rows like `010`.</p>
                  <pre className={styles.codeExample}>
                    {`[
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1]
]`}
                  </pre>
                  <button
                    type="button"
                    className={styles.patternFormatButton}
                    onClick={handlePatternFormat}
                  >
                    Format Pattern
                  </button>
                </div>
                <textarea
                  id="pattern-representation"
                  name="pattern_representation"
                  value={patternForm.pattern_representation}
                  onChange={handlePatternFormChange}
                  placeholder="Paste or type your pattern as rows of 0s and 1s"
                  rows={10}
                  className={styles.codeTextarea}
                  required
                ></textarea>
              </div>

              <div className={styles.formField}>
                <label htmlFor="pattern-behavior">Interesting Behavior</label>
                <textarea
                  id="pattern-behavior"
                  name="pattern_behavior"
                  value={patternForm.pattern_behavior}
                  onChange={handlePatternFormChange}
                  placeholder="Describe what makes this pattern interesting"
                  rows={4}
                ></textarea>
              </div>

              <div className={`${styles.formField} ${styles.checkbox}`}>
                <input
                  type="checkbox"
                  id="permission-patterns"
                  name="permission"
                  checked={basicInfo.permission}
                  onChange={handleBasicInfoChange}
                  required
                />
                <label htmlFor="permission-patterns">I grant permission to showcase my submissions in the gallery</label>
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
                  disabled={isSubmittingPattern}
                >
                  {isSubmittingPattern ? 'Submitting Start State…' : 'Submit Pattern'}
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      title={`Submit Your Work | ${siteConfig.title}`}
      description="Submit your cellular automata project and Conway start states"
    >
      <main className={styles.bauhausFormContainer}>
        <div className={styles.bauhausFormHeader}>
          <h1>Submit Your Work</h1>
          <p className={styles.formIntroduction}>
            Share your cellular automata creations with the community. You can submit your project implementation
            and send interesting Conway start states to the public Start State Gallery.
          </p>
        </div>

        {renderTabNavigation()}

        <div className={styles.tabContent}>{renderTabContent()}</div>
      </main>
    </Layout>
  );
}
