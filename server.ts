import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check
  app.get('/api/status', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      service: 'Pet Care Management System API',
      database: 'MongoDB Engine',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API: Authentication
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    res.json({
      success: true,
      token: `jwt_token_${Date.now()}`,
      message: 'Authentication successful',
      user: { email },
    });
  });

  // REST API: System Statistics for Admin
  app.get('/api/admin/metrics', (_req: Request, res: Response) => {
    res.json({
      totalPets: 48,
      activeOwners: 34,
      registeredVets: 8,
      appointmentsThisMonth: 126,
      vaccinationComplianceRate: 94.2,
      pendingVerifications: 2,
    });
  });

  // Setup Vite dev server or serve production build
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Pet Care Management System running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
