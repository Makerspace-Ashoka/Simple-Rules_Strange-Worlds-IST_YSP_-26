import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { requireAdminAuth } from '../adminAuth';
import { query } from '../db';
import { createRateLimit } from '../rateLimit';
import {
  moderationUpdateSchema,
  projectSubmissionSchema,
  startStateSubmissionSchema,
  type ProjectSubmissionInput,
  type StartStateSubmissionInput,
} from '../validation';

type StartStatePublicRow = {
  id: string;
  student_name: string;
  pattern_name: string;
  pattern_category: string | null;
  pattern_matrix: number[][];
  interesting_behavior: string | null;
  project_url: string | null;
  project_description: string | null;
  rule_modifications: string | null;
  submitted_at: Date | string;
};

type StartStateAdminRow = StartStatePublicRow & {
  email: string;
  permission_to_showcase: boolean;
  is_hidden: boolean;
};

type ProjectPublicRow = {
  id: string;
  student_name: string;
  project_url: string;
  project_description: string | null;
  rule_modifications: string | null;
  submitted_at: Date | string;
};

type ProjectAdminRow = ProjectPublicRow & {
  email: string;
  permission_to_showcase: boolean;
  is_hidden: boolean;
};

function toIsoString(value: Date | string) {
  const parsed = value instanceof Date ? value : new Date(value);
  return parsed.toISOString();
}

function mapPublicStartState(row: StartStatePublicRow) {
  return {
    id: row.id,
    studentName: row.student_name,
    patternName: row.pattern_name,
    patternCategory: row.pattern_category,
    patternMatrix: row.pattern_matrix,
    interestingBehavior: row.interesting_behavior,
    projectUrl: row.project_url,
    projectDescription: row.project_description,
    ruleModifications: row.rule_modifications,
    submittedAt: toIsoString(row.submitted_at),
  };
}

function mapAdminStartState(row: StartStateAdminRow) {
  return {
    ...mapPublicStartState(row),
    email: row.email,
    permissionToShowcase: row.permission_to_showcase,
    isHidden: row.is_hidden,
  };
}

function mapPublicProject(row: ProjectPublicRow) {
  return {
    id: row.id,
    studentName: row.student_name,
    projectUrl: row.project_url,
    projectDescription: row.project_description,
    ruleModifications: row.rule_modifications,
    submittedAt: toIsoString(row.submitted_at),
  };
}

function mapAdminProject(row: ProjectAdminRow) {
  return {
    ...mapPublicProject(row),
    email: row.email,
    permissionToShowcase: row.permission_to_showcase,
    isHidden: row.is_hidden,
  };
}

function firstIssueMessage(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message || 'The request body is invalid.';
}

function readIdParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
}

async function insertProjectSubmission(data: ProjectSubmissionInput) {
  const id = randomUUID();

  const result = await query<ProjectPublicRow>(
    `INSERT INTO project_submissions (
      id,
      student_name,
      email,
      permission_to_showcase,
      project_url,
      project_description,
      rule_modifications
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, student_name, project_url, project_description, rule_modifications, submitted_at`,
    [
      id,
      data.studentName,
      data.email,
      data.permissionToShowcase,
      data.projectUrl,
      data.projectDescription,
      data.ruleModifications,
    ],
  );

  return result.rows[0];
}

async function insertStartStateSubmission(data: StartStateSubmissionInput) {
  const id = randomUUID();

  const result = await query<StartStatePublicRow>(
    `INSERT INTO start_state_submissions (
      id,
      student_name,
      email,
      permission_to_showcase,
      pattern_name,
      pattern_category,
      pattern_matrix,
      interesting_behavior,
      project_url,
      project_description,
      rule_modifications
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11)
    RETURNING
      id,
      student_name,
      pattern_name,
      pattern_category,
      pattern_matrix,
      interesting_behavior,
      project_url,
      project_description,
      rule_modifications,
      submitted_at`,
    [
      id,
      data.studentName,
      data.email,
      data.permissionToShowcase,
      data.patternName,
      data.patternCategory,
      JSON.stringify(data.patternMatrix),
      data.interestingBehavior,
      data.projectUrl,
      data.projectDescription,
      data.ruleModifications,
    ],
  );

  return result.rows[0];
}

async function loadAdminStartStates() {
  const result = await query<StartStateAdminRow>(
    `SELECT
      id,
      student_name,
      email,
      permission_to_showcase,
      is_hidden,
      pattern_name,
      pattern_category,
      pattern_matrix,
      interesting_behavior,
      project_url,
      project_description,
      rule_modifications,
      submitted_at
    FROM start_state_submissions
    ORDER BY submitted_at DESC`,
  );

  return result.rows;
}

async function loadAdminProjects() {
  const result = await query<ProjectAdminRow>(
    `SELECT
      id,
      student_name,
      email,
      permission_to_showcase,
      is_hidden,
      project_url,
      project_description,
      rule_modifications,
      submitted_at
    FROM project_submissions
    ORDER BY submitted_at DESC`,
  );

  return result.rows;
}

async function updateStartStateHidden(id: string, isHidden: boolean) {
  const result = await query<StartStateAdminRow>(
    `UPDATE start_state_submissions
    SET is_hidden = $2
    WHERE id = $1
    RETURNING
      id,
      student_name,
      email,
      permission_to_showcase,
      is_hidden,
      pattern_name,
      pattern_category,
      pattern_matrix,
      interesting_behavior,
      project_url,
      project_description,
      rule_modifications,
      submitted_at`,
    [id, isHidden],
  );

  return result.rows[0] || null;
}

async function updateProjectHidden(id: string, isHidden: boolean) {
  const result = await query<ProjectAdminRow>(
    `UPDATE project_submissions
    SET is_hidden = $2
    WHERE id = $1
    RETURNING
      id,
      student_name,
      email,
      permission_to_showcase,
      is_hidden,
      project_url,
      project_description,
      rule_modifications,
      submitted_at`,
    [id, isHidden],
  );

  return result.rows[0] || null;
}

const router = Router();
const submissionRateLimit = createRateLimit({
  keyPrefix: 'submission',
  maxRequests: 12,
  windowMs: 15 * 60 * 1000,
});

router.post('/submissions/project', submissionRateLimit, async (req, res) => {
  const parsed = projectSubmissionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: firstIssueMessage(parsed.error) });
  }

  try {
    const project = await insertProjectSubmission(parsed.data);
    return res.status(201).json({ ok: true, project: mapPublicProject(project) });
  } catch (error) {
    console.error('Failed to save project submission', error);
    return res.status(500).json({ error: 'Could not save project submission right now.' });
  }
});

router.post('/submissions/start-state', submissionRateLimit, async (req, res) => {
  const parsed = startStateSubmissionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: firstIssueMessage(parsed.error) });
  }

  try {
    const startState = await insertStartStateSubmission(parsed.data);
    return res.status(201).json({ ok: true, startState: mapPublicStartState(startState) });
  } catch (error) {
    console.error('Failed to save start state submission', error);
    return res.status(500).json({ error: 'Could not save start state submission right now.' });
  }
});

router.get('/start-states', async (_req, res) => {
  try {
    const result = await query<StartStatePublicRow>(
      `SELECT
        id,
        student_name,
        pattern_name,
        pattern_category,
        pattern_matrix,
        interesting_behavior,
        project_url,
        project_description,
        rule_modifications,
        submitted_at
      FROM start_state_submissions
      WHERE permission_to_showcase = TRUE
        AND is_hidden = FALSE
      ORDER BY submitted_at DESC`,
    );

    return res.json({
      ok: true,
      startStates: result.rows.map(mapPublicStartState),
    });
  } catch (error) {
    console.error('Failed to load start states', error);
    return res.status(500).json({ error: 'Could not load start states right now.' });
  }
});

router.get('/projects', async (_req, res) => {
  try {
    const result = await query<ProjectPublicRow>(
      `SELECT
        id,
        student_name,
        project_url,
        project_description,
        rule_modifications,
        submitted_at
      FROM project_submissions
      WHERE permission_to_showcase = TRUE
        AND is_hidden = FALSE
      ORDER BY submitted_at DESC`,
    );

    return res.json({
      ok: true,
      projects: result.rows.map(mapPublicProject),
    });
  } catch (error) {
    console.error('Failed to load project submissions', error);
    return res.status(500).json({ error: 'Could not load project submissions right now.' });
  }
});

router.get('/admin/submissions', requireAdminAuth, async (_req, res) => {
  try {
    const [startStates, projects] = await Promise.all([loadAdminStartStates(), loadAdminProjects()]);

    return res.json({
      ok: true,
      startStates: startStates.map(mapAdminStartState),
      projects: projects.map(mapAdminProject),
    });
  } catch (error) {
    console.error('Failed to load admin submission dashboard', error);
    return res.status(500).json({ error: 'Could not load admin submissions right now.' });
  }
});

router.patch('/admin/start-states/:id', requireAdminAuth, async (req, res) => {
  const parsed = moderationUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: firstIssueMessage(parsed.error) });
  }

  try {
    const updated = await updateStartStateHidden(readIdParam(req.params.id), parsed.data.isHidden);

    if (!updated) {
      return res.status(404).json({ error: 'Start state submission not found.' });
    }

    return res.json({ ok: true, startState: mapAdminStartState(updated) });
  } catch (error) {
    console.error('Failed to update start state moderation', error);
    return res.status(500).json({ error: 'Could not update start state moderation right now.' });
  }
});

router.patch('/admin/projects/:id', requireAdminAuth, async (req, res) => {
  const parsed = moderationUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: firstIssueMessage(parsed.error) });
  }

  try {
    const updated = await updateProjectHidden(readIdParam(req.params.id), parsed.data.isHidden);

    if (!updated) {
      return res.status(404).json({ error: 'Project submission not found.' });
    }

    return res.json({ ok: true, project: mapAdminProject(updated) });
  } catch (error) {
    console.error('Failed to update project moderation', error);
    return res.status(500).json({ error: 'Could not update project moderation right now.' });
  }
});

export default router;
