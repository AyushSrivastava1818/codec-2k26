import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const getAllRegistrationsStmt = db.prepare(`
  SELECT id, ticket_code, name, email, college, phone, track, pass_type, status, created_at
  FROM registrations
  ORDER BY id DESC
`);

const getAllRsvpsStmt = db.prepare(`
  SELECT id, name, email, event_title, track, created_at
  FROM event_rsvps
  ORDER BY id DESC
`);

const getStatsStmt = db.prepare(`
  SELECT 
    (SELECT COUNT(*) FROM registrations) as total_delegates,
    (SELECT COUNT(*) FROM event_rsvps) as total_rsvps,
    (SELECT COUNT(*) FROM users) as total_users
`);

// 1. Get all registrations & summary statistics
router.get('/registrations', (req, res) => {
  try {
    const registrations = getAllRegistrationsStmt.all();
    const rsvps = getAllRsvpsStmt.all();
    const stats = getStatsStmt.get();

    // Group count by track
    const trackCounts = {};
    registrations.forEach(r => {
      const track = r.track || 'General Summit';
      trackCounts[track] = (trackCounts[track] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        totalDelegates: stats.total_delegates,
        totalRsvps: stats.total_rsvps,
        totalUsers: stats.total_users,
        trackBreakdown: trackCounts
      },
      registrations,
      rsvps
    });
  } catch (err) {
    console.error('Admin Fetch Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve registrations' });
  }
});

// 2. Export registrations directly as CSV spreadsheet
router.get('/export.csv', (req, res) => {
  try {
    const registrations = getAllRegistrationsStmt.all();

    const headers = ['ID', 'Ticket Code', 'Name', 'Email', 'College', 'Phone', 'Track / Sub-Event', 'Pass Type', 'Status', 'Registered At'];
    const rows = registrations.map(r => [
      r.id,
      `"${r.ticket_code}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.college || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.track || '').replace(/"/g, '""')}"`,
      `"${(r.pass_type || '').replace(/"/g, '""')}"`,
      `"${(r.status || '').replace(/"/g, '""')}"`,
      `"${r.created_at}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="codec_2k26_registrations_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('CSV Export Error:', err);
    return res.status(500).json({ error: 'Failed to generate CSV export' });
  }
});

export default router;
