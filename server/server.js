import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import authRoutes from './routes/auth.js';
import registrationRoutes from './routes/registrations.js';
import eventRoutes from './routes/events.js';
import statsRoutes from './routes/stats.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 15) {
      console.log(`[HTTP] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'CODEC 2K26 High-Concurrency Apex Backend',
    database: 'SQLite WAL Mode',
    timestamp: new Date().toISOString()
  });
});

// Route mount points
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Graceful SQLite close on process termination
process.on('SIGINT', () => {
  console.log('\nClosing SQLite connection...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nClosing SQLite connection...');
  db.close();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`CODEC 2K26 BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`SQLite WAL Engine Active [Concurrency: 200-500+ users]`);
  console.log(`URL: http://127.0.0.1:${PORT}`);
  console.log(`====================================================`);
});
