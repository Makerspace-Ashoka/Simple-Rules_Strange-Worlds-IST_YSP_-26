import { z } from 'zod';

export const MAX_MATRIX_ROWS = 80;
export const MAX_MATRIX_COLS = 80;

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_URL_LENGTH = 500;
const MAX_CATEGORY_LENGTH = 80;
const MAX_TITLE_LENGTH = 160;
const MAX_LONG_TEXT_LENGTH = 4000;

const requiredText = (label: string, maxLength: number) =>
  z
    .string({ required_error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);

const optionalText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) {
        return null;
      }

      return value.trim() || null;
    });

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(MAX_URL_LENGTH, `${label} must be ${MAX_URL_LENGTH} characters or fewer.`)
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) {
        return null;
      }

      return value.trim() || null;
    })
    .refine((value) => value === null || isValidUrl(value), {
      message: `${label} must be a valid URL.`,
    });

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const matrixCellSchema = z.union([z.literal(0), z.literal(1)]);

export const matrixSchema = z
  .array(z.array(matrixCellSchema))
  .superRefine((matrix, ctx) => {
    if (matrix.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pattern matrix must not be empty.',
      });
      return;
    }

    const columnCount = matrix[0]?.length ?? 0;

    if (columnCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pattern matrix must include at least one column.',
      });
      return;
    }

    if (matrix.length > MAX_MATRIX_ROWS || columnCount > MAX_MATRIX_COLS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Pattern matrix must be at most ${MAX_MATRIX_ROWS} rows by ${MAX_MATRIX_COLS} columns.`,
      });
    }

    matrix.forEach((row, index) => {
      if (row.length !== columnCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pattern matrix must be rectangular.',
          path: [index],
        });
      }
    });
  });

export const projectSubmissionSchema = z.object({
  studentName: requiredText('Student name', MAX_NAME_LENGTH),
  email: z
    .string({ required_error: 'Email is required.' })
    .trim()
    .email('Email must be valid.')
    .max(MAX_EMAIL_LENGTH, `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`),
  permissionToShowcase: z.boolean(),
  projectUrl: z
    .string({ required_error: 'Project URL is required.' })
    .trim()
    .min(1, 'Project URL is required.')
    .max(MAX_URL_LENGTH, `Project URL must be ${MAX_URL_LENGTH} characters or fewer.`)
    .refine((value) => isValidUrl(value), {
      message: 'Project URL must be a valid URL.',
    }),
  projectDescription: optionalText('Project description', MAX_LONG_TEXT_LENGTH),
  ruleModifications: optionalText('Rule modifications', MAX_LONG_TEXT_LENGTH),
});

export const startStateSubmissionSchema = z.object({
  studentName: requiredText('Student name', MAX_NAME_LENGTH),
  email: z
    .string({ required_error: 'Email is required.' })
    .trim()
    .email('Email must be valid.')
    .max(MAX_EMAIL_LENGTH, `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`),
  permissionToShowcase: z.boolean(),
  patternName: requiredText('Pattern name', MAX_TITLE_LENGTH),
  patternCategory: requiredText('Pattern category', MAX_CATEGORY_LENGTH),
  patternMatrix: matrixSchema,
  interestingBehavior: optionalText('Interesting behavior', MAX_LONG_TEXT_LENGTH),
  projectUrl: optionalUrl('Project URL'),
  projectDescription: optionalText('Project description', MAX_LONG_TEXT_LENGTH),
  ruleModifications: optionalText('Rule modifications', MAX_LONG_TEXT_LENGTH),
});

export const moderationUpdateSchema = z.object({
  isHidden: z.boolean({
    required_error: 'Moderation visibility is required.',
  }),
});

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;
export type StartStateSubmissionInput = z.infer<typeof startStateSubmissionSchema>;
export type ModerationUpdateInput = z.infer<typeof moderationUpdateSchema>;
