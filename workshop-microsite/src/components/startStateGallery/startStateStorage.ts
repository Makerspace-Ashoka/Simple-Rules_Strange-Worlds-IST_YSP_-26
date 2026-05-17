import { cloneMatrix, normalizeMatrix, type Matrix } from './gameOfLifeRules';

const MAX_MATRIX_ROWS = 80;
const MAX_MATRIX_COLS = 80;
const API_BASE = '/api';

export type StartStateSubmission = {
  id: string;
  studentName: string;
  projectUrl?: string;
  projectDescription?: string;
  ruleModifications?: string;
  patternName: string;
  patternCategory?: string;
  patternMatrix: Matrix;
  interestingBehavior?: string;
  submittedAt: string;
  source: 'backend';
};

export type ProjectSubmission = {
  id: string;
  studentName: string;
  projectUrl: string;
  projectDescription?: string;
  ruleModifications?: string;
  submittedAt: string;
};

export type StartStateSubmissionInput = {
  studentName: string;
  email: string;
  permissionToShowcase: boolean;
  patternName: string;
  patternCategory: string;
  patternMatrix: Matrix;
  interestingBehavior?: string;
  projectUrl?: string;
  projectDescription?: string;
  ruleModifications?: string;
};

export type ProjectSubmissionInput = {
  studentName: string;
  email: string;
  permissionToShowcase: boolean;
  projectUrl: string;
  projectDescription?: string;
  ruleModifications?: string;
};

export type AdminStartStateSubmission = StartStateSubmission & {
  email: string;
  permissionToShowcase: boolean;
  isHidden: boolean;
};

export type AdminProjectSubmission = ProjectSubmission & {
  email: string;
  permissionToShowcase: boolean;
  isHidden: boolean;
};

export type AdminDashboardData = {
  startStates: AdminStartStateSubmission[];
  projects: AdminProjectSubmission[];
};

type ValidationResult = {
  valid: boolean;
  matrix: Matrix;
  error?: string;
};

function sortNewestFirst(a: { submittedAt: string }, b: { submittedAt: string }) {
  return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
}

function cloneSubmission(submission: StartStateSubmission): StartStateSubmission {
  return {
    ...submission,
    patternMatrix: cloneMatrix(submission.patternMatrix),
  };
}

function cloneAdminStartState(submission: AdminStartStateSubmission): AdminStartStateSubmission {
  return {
    ...submission,
    patternMatrix: cloneMatrix(submission.patternMatrix),
  };
}

function normalizeRuleModifications(record: Record<string, unknown>) {
  const value = record.ruleModifications ?? record.projectRules;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeProjectDescription(record: Record<string, unknown>) {
  const value = record.projectDescription;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeProjectUrl(record: Record<string, unknown>) {
  const value = record.projectUrl ?? record.projectLink;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizePublicStartState(candidate: unknown): StartStateSubmission | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const record = candidate as Record<string, unknown>;

  if (
    typeof record.id !== 'string' ||
    typeof record.studentName !== 'string' ||
    typeof record.patternName !== 'string' ||
    typeof record.submittedAt !== 'string'
  ) {
    return null;
  }

  const validation = validateMatrix(record.patternMatrix as Matrix);

  if (!validation.valid) {
    return null;
  }

  return {
    id: record.id,
    studentName: record.studentName.trim(),
    projectUrl: normalizeProjectUrl(record),
    projectDescription: normalizeProjectDescription(record),
    ruleModifications: normalizeRuleModifications(record),
    patternName: record.patternName.trim(),
    patternCategory:
      typeof record.patternCategory === 'string' && record.patternCategory.trim()
        ? record.patternCategory.trim()
        : undefined,
    patternMatrix: validation.matrix,
    interestingBehavior:
      typeof record.interestingBehavior === 'string' && record.interestingBehavior.trim()
        ? record.interestingBehavior.trim()
        : undefined,
    submittedAt: record.submittedAt,
    source: 'backend',
  };
}

function normalizeProjectSubmission(candidate: unknown): ProjectSubmission | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const record = candidate as Record<string, unknown>;

  if (
    typeof record.id !== 'string' ||
    typeof record.studentName !== 'string' ||
    typeof record.projectUrl !== 'string' ||
    typeof record.submittedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: record.id,
    studentName: record.studentName.trim(),
    projectUrl: record.projectUrl.trim(),
    projectDescription: normalizeProjectDescription(record),
    ruleModifications: normalizeRuleModifications(record),
    submittedAt: record.submittedAt,
  };
}

function normalizeAdminStartState(candidate: unknown): AdminStartStateSubmission | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const base = normalizePublicStartState(candidate);

  if (!base) {
    return null;
  }

  const record = candidate as Record<string, unknown>;

  if (
    typeof record.email !== 'string' ||
    typeof record.permissionToShowcase !== 'boolean' ||
    typeof record.isHidden !== 'boolean'
  ) {
    return null;
  }

  return {
    ...base,
    email: record.email.trim(),
    permissionToShowcase: record.permissionToShowcase,
    isHidden: record.isHidden,
  };
}

function normalizeAdminProject(candidate: unknown): AdminProjectSubmission | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const base = normalizeProjectSubmission(candidate);

  if (!base) {
    return null;
  }

  const record = candidate as Record<string, unknown>;

  if (
    typeof record.email !== 'string' ||
    typeof record.permissionToShowcase !== 'boolean' ||
    typeof record.isHidden !== 'boolean'
  ) {
    return null;
  }

  return {
    ...base,
    email: record.email.trim(),
    permissionToShowcase: record.permissionToShowcase,
    isHidden: record.isHidden,
  };
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error || `Request failed with status ${response.status}.`;
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

async function requestJson<T>(path: string, init?: RequestInit) {
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };

  const response = await fetch(path, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

function adminHeaders(adminPassword: string) {
  if (!adminPassword.trim()) {
    throw new Error('Enter the admin password to load the moderation dashboard.');
  }

  return {
    'x-admin-password': adminPassword.trim(),
  };
}

export function parseMatrixInput(input: string): Matrix {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Pattern representation cannot be empty.');
  }

  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);

    if (!Array.isArray(parsed)) {
      throw new Error('Please enter a rectangular matrix containing only 0s and 1s.');
    }

    return parsed as Matrix;
  }

  return trimmed
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const compact = line.replace(/[\s,]+/g, '');

      if (/^[01]+$/.test(compact)) {
        return compact.split('').map((cell) => Number(cell));
      }

      const tokens = line.split(/[\s,]+/).filter(Boolean);

      if (tokens.length > 0 && tokens.every((cell) => cell === '0' || cell === '1')) {
        return tokens.map((cell) => Number(cell));
      }

      throw new Error('Please enter a rectangular matrix containing only 0s and 1s.');
    });
}

export function validateMatrix(matrix: Matrix): ValidationResult {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return {
      valid: false,
      matrix: [],
      error: 'Please enter a rectangular matrix containing only 0s and 1s.',
    };
  }

  const normalizedRows = matrix.map((row) => (Array.isArray(row) ? row : []));
  const columnCount = normalizedRows[0]?.length ?? 0;

  if (columnCount === 0) {
    return {
      valid: false,
      matrix: [],
      error: 'Please enter a rectangular matrix containing only 0s and 1s.',
    };
  }

  if (normalizedRows.length > MAX_MATRIX_ROWS || columnCount > MAX_MATRIX_COLS) {
    return {
      valid: false,
      matrix: [],
      error: `Pattern representation must be at most ${MAX_MATRIX_ROWS} rows by ${MAX_MATRIX_COLS} columns.`,
    };
  }

  for (const row of normalizedRows) {
    if (row.length !== columnCount) {
      return {
        valid: false,
        matrix: [],
        error: 'Please enter a rectangular matrix containing only 0s and 1s.',
      };
    }

    for (const cell of row) {
      if (cell !== 0 && cell !== 1) {
        return {
          valid: false,
          matrix: [],
          error: 'Please enter a rectangular matrix containing only 0s and 1s.',
        };
      }
    }
  }

  return { valid: true, matrix: normalizeMatrix(normalizedRows) };
}

export async function submitProjectSubmission(submission: ProjectSubmissionInput): Promise<ProjectSubmission> {
  const payload = {
    studentName: submission.studentName.trim(),
    email: submission.email.trim(),
    permissionToShowcase: submission.permissionToShowcase,
    projectUrl: submission.projectUrl.trim(),
    projectDescription: submission.projectDescription?.trim() || null,
    ruleModifications: submission.ruleModifications?.trim() || null,
  };

  if (!payload.studentName || !payload.email || !payload.projectUrl) {
    throw new Error('Please fill out your name, email, and project URL before submitting.');
  }

  const response = await requestJson<{ ok: true; project: unknown }>(`${API_BASE}/submissions/project`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const saved = normalizeProjectSubmission(response.project);

  if (!saved) {
    throw new Error('The server returned an invalid project submission.');
  }

  return saved;
}

export async function submitStartStateSubmission(
  submission: StartStateSubmissionInput,
): Promise<StartStateSubmission> {
  const validation = validateMatrix(submission.patternMatrix);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (!submission.studentName.trim() || !submission.email.trim()) {
    throw new Error('Please fill out your name and email before submitting.');
  }

  if (!submission.patternName.trim() || !submission.patternCategory.trim()) {
    throw new Error('Pattern name and category are required.');
  }

  const payload = {
    studentName: submission.studentName.trim(),
    email: submission.email.trim(),
    permissionToShowcase: submission.permissionToShowcase,
    patternName: submission.patternName.trim(),
    patternCategory: submission.patternCategory.trim(),
    patternMatrix: validation.matrix,
    interestingBehavior: submission.interestingBehavior?.trim() || null,
    projectUrl: submission.projectUrl?.trim() || null,
    projectDescription: submission.projectDescription?.trim() || null,
    ruleModifications: submission.ruleModifications?.trim() || null,
  };

  const response = await requestJson<{ ok: true; startState: unknown }>(`${API_BASE}/submissions/start-state`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const saved = normalizePublicStartState(response.startState);

  if (!saved) {
    throw new Error('The server returned an invalid start state.');
  }

  return cloneSubmission(saved);
}

export async function loadStartStateSubmissions(): Promise<StartStateSubmission[]> {
  const response = await requestJson<{ ok: true; startStates: unknown[] }>(`${API_BASE}/start-states`);
  return response.startStates
    .map(normalizePublicStartState)
    .filter((entry): entry is StartStateSubmission => entry !== null)
    .sort(sortNewestFirst)
    .map(cloneSubmission);
}

export async function loadProjectSubmissions(): Promise<ProjectSubmission[]> {
  const response = await requestJson<{ ok: true; projects: unknown[] }>(`${API_BASE}/projects`);
  return response.projects
    .map(normalizeProjectSubmission)
    .filter((entry): entry is ProjectSubmission => entry !== null)
    .sort(sortNewestFirst);
}

export async function loadAdminDashboard(adminPassword: string): Promise<AdminDashboardData> {
  const response = await requestJson<{ ok: true; startStates: unknown[]; projects: unknown[] }>(
    `${API_BASE}/admin/submissions`,
    {
      headers: adminHeaders(adminPassword),
    },
  );

  return {
    startStates: response.startStates
      .map(normalizeAdminStartState)
      .filter((entry): entry is AdminStartStateSubmission => entry !== null)
      .sort(sortNewestFirst)
      .map(cloneAdminStartState),
    projects: response.projects
      .map(normalizeAdminProject)
      .filter((entry): entry is AdminProjectSubmission => entry !== null)
      .sort(sortNewestFirst),
  };
}

export async function updateStartStateHidden(
  id: string,
  isHidden: boolean,
  adminPassword: string,
): Promise<AdminStartStateSubmission> {
  const response = await requestJson<{ ok: true; startState: unknown }>(`${API_BASE}/admin/start-states/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(adminPassword),
    body: JSON.stringify({ isHidden }),
  });

  const updated = normalizeAdminStartState(response.startState);

  if (!updated) {
    throw new Error('The server returned an invalid moderated start state.');
  }

  return cloneAdminStartState(updated);
}

export async function updateProjectHidden(
  id: string,
  isHidden: boolean,
  adminPassword: string,
): Promise<AdminProjectSubmission> {
  const response = await requestJson<{ ok: true; project: unknown }>(`${API_BASE}/admin/projects/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(adminPassword),
    body: JSON.stringify({ isHidden }),
  });

  const updated = normalizeAdminProject(response.project);

  if (!updated) {
    throw new Error('The server returned an invalid moderated project.');
  }

  return updated;
}
