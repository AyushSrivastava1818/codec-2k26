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

    // Group all RSVPs by email
    const emailToEvents = {};
    rsvps.forEach(r => {
      const em = (r.email || '').toLowerCase().trim();
      if (!emailToEvents[em]) emailToEvents[em] = [];
      if (!emailToEvents[em].includes(r.event_title)) {
        emailToEvents[em].push(r.event_title);
      }
    });

    // Event breakdown counters
    const eventCounts = {
      hackathon: 0,
      dsa: 0,
      robowars: 0,
      ctf: 0,
      microservices: 0,
      esports: 0,
      generalOnly: 0
    };

    const enrichedRegistrations = registrations.map(reg => {
      const em = (reg.email || '').toLowerCase().trim();
      const rsvpEvents = emailToEvents[em] || [];
      const allEvents = [...rsvpEvents];

      // If initial registration specified a non-general track, include it
      if (reg.track && !reg.track.toLowerCase().includes('general') && !allEvents.includes(reg.track)) {
        allEvents.unshift(reg.track);
      }

      // Tally event breakdown
      let hasSubEvent = false;
      allEvents.forEach(evt => {
        const low = evt.toLowerCase();
        if (low.includes('hackathon')) { eventCounts.hackathon++; hasSubEvent = true; }
        else if (low.includes('dsa') || low.includes('speed') || low.includes('coding')) { eventCounts.dsa++; hasSubEvent = true; }
        else if (low.includes('robowars') || low.includes('gladiator') || low.includes('robo')) { eventCounts.robowars++; hasSubEvent = true; }
        else if (low.includes('ctf') || low.includes('security')) { eventCounts.ctf++; hasSubEvent = true; }
        else if (low.includes('microservice')) { eventCounts.microservices++; hasSubEvent = true; }
        else if (low.includes('esport') || low.includes('lan')) { eventCounts.esports++; hasSubEvent = true; }
      });

      if (!hasSubEvent) {
        eventCounts.generalOnly++;
      }

      return {
        ...reg,
        enrolledEvents: allEvents.length > 0 ? allEvents : ['General Summit Delegate']
      };
    });

    return res.json({
      success: true,
      stats: {
        totalDelegates: stats.total_delegates,
        totalRsvps: stats.total_rsvps,
        totalUsers: stats.total_users,
        eventCounts
      },
      registrations: enrichedRegistrations,
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
    const rsvps = getAllRsvpsStmt.all();

    const emailToEvents = {};
    rsvps.forEach(r => {
      const em = (r.email || '').toLowerCase().trim();
      if (!emailToEvents[em]) emailToEvents[em] = [];
      if (!emailToEvents[em].includes(r.event_title)) {
        emailToEvents[em].push(r.event_title);
      }
    });

    const headers = ['ID', 'Ticket Code', 'Name', 'Email', 'College', 'Phone', 'All Registered Events / Arenas', 'Pass Type', 'Status', 'Registered At'];
    const rows = registrations.map(r => {
      const em = (r.email || '').toLowerCase().trim();
      const rsvpList = emailToEvents[em] || [];
      const evts = [...rsvpList];
      if (r.track && !r.track.toLowerCase().includes('general') && !evts.includes(r.track)) {
        evts.unshift(r.track);
      }
      const eventString = evts.length > 0 ? evts.join('; ') : 'General Summit Delegate';

      return [
        r.id,
        `"${r.ticket_code}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.college || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${eventString.replace(/"/g, '""')}"`,
        `"${(r.pass_type || '').replace(/"/g, '""')}"`,
        `"${(r.status || '').replace(/"/g, '""')}"`,
        `"${r.created_at}"`
      ];
    });

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
