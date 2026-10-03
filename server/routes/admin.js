import { Router } from 'express';
import crypto from 'crypto';
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

const insertMissingRegStmt = db.prepare(`
  INSERT INTO registrations (ticket_code, name, email, college, phone, track, pass_type, status, qr_data)
  VALUES (@ticket_code, @name, @email, @college, @phone, @track, 'SUBEVENT_PASS', 'CONFIRMED', @qr_data)
`);

// 1. Get all registrations & summary statistics
router.get('/registrations', (req, res) => {
  try {
    let registrations = getAllRegistrationsStmt.all();
    const rsvps = getAllRsvpsStmt.all();

    // Set of emails already in registrations
    const registeredEmails = new Set(registrations.map(r => (r.email || '').toLowerCase().trim()));

    // Find any attendees who registered for subevents but lack a primary registration record
    const missingAttendees = {};
    rsvps.forEach(r => {
      const em = (r.email || '').toLowerCase().trim();
      if (em && !registeredEmails.has(em)) {
        if (!missingAttendees[em]) {
          missingAttendees[em] = {
            name: r.name || 'Delegate',
            email: em,
            events: []
          };
        }
        if (!missingAttendees[em].events.includes(r.event_title)) {
          missingAttendees[em].events.push(r.event_title);
        }
      }
    });

    // Auto-heal: Insert missing attendees into registrations so they have official tickets
    for (const [em, data] of Object.entries(missingAttendees)) {
      const ticketCode = `CODEC-26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const qrData = `CODEC:2026:TICKET:${ticketCode}:NAME:${encodeURIComponent(data.name)}:COLLEGE:IIIT%20Kota`;
      insertMissingRegStmt.run({
        ticket_code: ticketCode,
        name: data.name,
        email: em,
        college: 'IIIT Kota',
        phone: null,
        track: data.events[0] || 'Sub-Event Arena',
        qr_data: qrData
      });
      registeredEmails.add(em);
    }

    // Refresh registrations if any missing attendees were inserted
    if (Object.keys(missingAttendees).length > 0) {
      registrations = getAllRegistrationsStmt.all();
    }

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

      // Check category flags
      let hasHackathon = false;
      let hasDsa = false;
      let hasRobowars = false;
      let hasCtf = false;
      let hasWorkshop = false;
      let hasEsports = false;

      allEvents.forEach(evt => {
        const low = evt.toLowerCase();
        if (low.includes('hackathon')) { hasHackathon = true; }
        if (low.includes('dsa') || low.includes('speed') || low.includes('coding') || low.includes('codebase') || low.includes('algorithmus') || low.includes('gfg')) { hasDsa = true; }
        if (low.includes('robowars') || low.includes('gladiator') || low.includes('robo') || low.includes('arc')) { hasRobowars = true; }
        if (low.includes('ctf') || low.includes('security') || low.includes('cypher')) { hasCtf = true; }
        if (low.includes('microservice') || low.includes('workshop') || low.includes('kernel') || low.includes('speaker')) { hasWorkshop = true; }
        if (low.includes('esport') || low.includes('lan') || low.includes('game') || low.includes('clutch')) { hasEsports = true; }
      });

      if (hasHackathon) eventCounts.hackathon++;
      if (hasDsa) eventCounts.dsa++;
      if (hasRobowars) eventCounts.robowars++;
      if (hasCtf) eventCounts.ctf++;
      if (hasWorkshop) eventCounts.microservices++;
      if (hasEsports) eventCounts.esports++;

      const hasAnySubEvent = hasHackathon || hasDsa || hasRobowars || hasCtf || hasWorkshop || hasEsports;
      if (!hasAnySubEvent) {
        eventCounts.generalOnly++;
      }

      return {
        ...reg,
        enrolledEvents: allEvents.length > 0 ? allEvents : ['General Summit Delegate'],
        hasHackathon,
        hasDsa,
        hasRobowars,
        hasCtf,
        hasWorkshop,
        hasEsports
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

    const headers = [
      'ID',
      'Ticket Code',
      'Name',
      'Email',
      'College',
      'Phone',
      'Hackathon (24h)',
      'Speed DSA',
      'RoboWars',
      'Security CTF',
      'Microservices Workshop',
      'Campus Esports',
      'All Enrolled Events',
      'Pass Type',
      'Status',
      'Registered At'
    ];

    const rows = registrations.map(r => {
      const em = (r.email || '').toLowerCase().trim();
      const rsvpList = emailToEvents[em] || [];
      const evts = [...rsvpList];
      if (r.track && !r.track.toLowerCase().includes('general') && !evts.includes(r.track)) {
        evts.unshift(r.track);
      }

      let hasHack = false, hasDsa = false, hasRobo = false, hasCtf = false, hasMicro = false, hasEsp = false;
      evts.forEach(evt => {
        const low = evt.toLowerCase();
        if (low.includes('hackathon')) hasHack = true;
        if (low.includes('dsa') || low.includes('speed') || low.includes('coding')) hasDsa = true;
        if (low.includes('robowars') || low.includes('gladiator') || low.includes('robo')) hasRobo = true;
        if (low.includes('ctf') || low.includes('security')) hasCtf = true;
        if (low.includes('microservice') || low.includes('workshop')) hasMicro = true;
        if (low.includes('esport') || low.includes('lan') || low.includes('game')) hasEsp = true;
      });

      const eventString = evts.length > 0 ? evts.join('; ') : 'General Summit Delegate';

      return [
        r.id,
        `"${r.ticket_code}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.college || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        hasHack ? '"YES"' : '"NO"',
        hasDsa ? '"YES"' : '"NO"',
        hasRobo ? '"YES"' : '"NO"',
        hasCtf ? '"YES"' : '"NO"',
        hasMicro ? '"YES"' : '"NO"',
        hasEsp ? '"YES"' : '"NO"',
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
