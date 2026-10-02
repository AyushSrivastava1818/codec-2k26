import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const countDelegatesStmt = db.prepare(`SELECT COUNT(*) as count FROM registrations`);
const countUsersStmt = db.prepare(`SELECT COUNT(*) as count FROM users`);
const countRsvpsStmt = db.prepare(`SELECT COUNT(*) as count FROM event_rsvps`);

router.get('/', (req, res) => {
  try {
    const totalDelegates = countDelegatesStmt.get().count;
    const totalUsers = countUsersStmt.get().count;
    const totalRsvps = countRsvpsStmt.get().count;

    const baseSeats = 1500;
    const seatsRemaining = Math.max(0, baseSeats - totalDelegates);

    return res.json({
      status: 'ONLINE',
      edition: 'CODEC 2K26',
      council: 'TechKnow Council',
      institution: 'IIIT Kota',
      totalDelegates: totalDelegates + 342, // base delegate seed + actual live registrations
      seatsRemaining: seatsRemaining,
      totalUsers: totalUsers,
      totalRsvps: totalRsvps,
      guildsFormed: 48,
      prizePool: '₹2,50,000+'
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
