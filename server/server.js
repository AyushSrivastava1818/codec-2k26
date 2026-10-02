import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import authRoutes from './routes/auth.js';
import registrationRoutes from './routes/registrations.js';
import eventRoutes from './routes/events.js';
import statsRoutes from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Request logging in development
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

// Seed default demo data if table is brand new
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial demo delegates and summit credentials...');
    import('./auth.js').then(({ hashPassword }) => {
      const demoHash = hashPassword('codec2026');
      db.prepare(`
        INSERT INTO users (name, email, password_hash, college, phone, year)
        VALUES ('Ayush Srivastava', 'lead@codec2k26.iiitkota.ac.in', ?, 'IIIT Kota', '+91 9876543210', 'Final Year')
      `).run(demoHash);

      db.prepare(`
        INSERT INTO registrations (ticket_code, user_id, name, email, college, phone, track, pass_type, qr_data)
        VALUES ('CODEC-26-APEX01', 1, 'Ayush Srivastava', 'lead@codec2k26.iiitkota.ac.in', 'IIIT Kota', '+91 9876543210', 'Hackathon 24h & Robotics', 'VIP_FOUNDER_PASS', 'CODEC:2026:TICKET:CODEC-26-APEX01')
      `).run();
      console.log('Demo seed completed.');
    });
  }
} catch (e) {
  console.warn('Seed notice:', e.message);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`⚡ CODEC 2K26 BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`⚡ SQLite WAL Engine Active [Concurrency: 200-500+ users]`);
  console.log(`⚡ URL: http://127.0.0.1:${PORT}`);
  console.log(`====================================================`);
});
