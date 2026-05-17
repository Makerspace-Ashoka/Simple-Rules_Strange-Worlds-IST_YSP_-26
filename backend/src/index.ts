import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { closeDatabase, initDatabase } from './db';
import submissionsRouter from './routes/submissions';

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', submissionsRouter);

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  return next(error);
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

async function startServer() {
  await initDatabase();

  const server = app.listen(port, () => {
    console.log(`CA workshop backend listening on port ${port}`);
  });

  const shutdown = async () => {
    console.log('Shutting down backend...');
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
