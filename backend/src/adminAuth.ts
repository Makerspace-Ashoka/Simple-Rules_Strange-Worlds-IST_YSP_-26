import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

function getExpectedPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function getProvidedPassword(req: Request) {
  const headerPassword = req.get('x-admin-password');

  if (headerPassword) {
    return headerPassword;
  }

  const authorization = req.get('authorization');

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim();
  }

  return '';
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const expectedPassword = getExpectedPassword();

  if (!expectedPassword) {
    return res.status(503).json({ error: 'Admin access is not configured on the server.' });
  }

  const providedPassword = getProvidedPassword(req);

  if (!providedPassword || !safeEqual(providedPassword, expectedPassword)) {
    return res.status(401).json({ error: 'Admin authentication failed.' });
  }

  return next();
}
