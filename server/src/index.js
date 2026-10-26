// ============================================================================
// FraudLens AI — Unified Financial Risk Intelligence Platform
// Backend Server & Analytical Execution Service
// ============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { exasolClient } from './database/exasolClient.js';
import { initializeMongo } from './database/mongoClient.js';

import analyticsRoutes from './routes/analyticsRoutes.js';
import fraudRoutes from './routes/fraudRoutes.js';
import reconciliationRoutes from './routes/reconciliationRoutes.js';
import exposureRoutes from './routes/exposureRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import monthEndRoutes from './routes/monthEndRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import copilotRoutes from './routes/copilotRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/reconciliation', reconciliationRoutes);
app.use('/api/exposure', exposureRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/month-end', monthEndRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/copilot', copilotRoutes);

// Root Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'FraudLens AI',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production if built
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <body style="background:#0b132b;color:#f1f5f9;font-family:sans-serif;padding:40px;text-align:center;">
            <h1>FraudLens AI Server Online</h1>
            <p>API is active at <a href="/api/analytics/status" style="color:#60a5fa">/api/analytics/status</a>.</p>
            <p>For the interactive frontend, please run the Vite dev server at port 3000.</p>
          </body>
        </html>
      `);
    }
  });
});

// Start Server
async function startServer() {
  try {
    console.log('------------------------------------------------------------');
    console.log('Starting FraudLens AI Unified Financial Risk Platform...');
    console.log('------------------------------------------------------------');

    // 1. Initialize Exasol Personal Analytical Engine
    await exasolClient.initialize();

    // 2. Initialize Application Database (MongoDB with Mongoose)
    await initializeMongo();

    app.listen(PORT, () => {
      console.log(`[FraudLens Server] Listening on http://localhost:${PORT}`);
      console.log(`[FraudLens Server] Ready for ExaThon 2026 Money, Risk & Regulation evaluation.`);
    });
  } catch (err) {
    console.error('[FraudLens Server] Failed to start:', err);
    process.exit(1);
  }
}

startServer();
