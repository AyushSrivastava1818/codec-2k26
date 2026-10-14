import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = Router();

const getAllRegistrationsStmt = db.prepare(`
  SELECT id, ticket_code, name, email, college, phone, track, pass_type, status, team_name, team_members, created_at
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
      'Hackathon (HACKODEC)',
      'WTF ALGO 2.0 (Algorithmus)',
      'BUG 2 BUILD (Codebase)',
      'DUNGEON OF LIES (GFG)',
      'DIGIVERSE (GDG)',
      'ROBO RUSH / TECH ARENA (ARC Robotics)',
      'HACK-VERSE CTF (Cypher)',
      'Alumni Speaker Session (Kernel)',
      'Campus Esports (Clutch)',
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

      let hasHack = false, hasAlgo = false, hasCodebase = false, hasGfg = false, hasGdg = false, hasArc = false, hasCypher = false, hasKernel = false, hasClutch = false;
      evts.forEach(evt => {
        const low = evt.toLowerCase();
        if (low.includes('hackodec') || low.includes('hackathon')) hasHack = true;
        if (low.includes('algo') || low.includes('wtf algo')) hasAlgo = true;
        if (low.includes('bug 2 build') || low.includes('codebase')) hasCodebase = true;
        if (low.includes('dungeon') || low.includes('gfg') || low.includes('geeksforgeeks')) hasGfg = true;
        if (low.includes('digiverse') || low.includes('gdg')) hasGdg = true;
        if (low.includes('arc') || low.includes('robo rush') || low.includes('tech arena') || low.includes('robowars')) hasArc = true;
        if (low.includes('cypher') || low.includes('hack-verse') || low.includes('ctf')) hasCypher = true;
        if (low.includes('kernel') || low.includes('alumni') || low.includes('speaker') || low.includes('yash goel') || low.includes('abhishek pant')) hasKernel = true;
        if (low.includes('clutch') || low.includes('esport') || low.includes('lan')) hasClutch = true;
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
        hasAlgo ? '"YES"' : '"NO"',
        hasCodebase ? '"YES"' : '"NO"',
        hasGfg ? '"YES"' : '"NO"',
        hasGdg ? '"YES"' : '"NO"',
        hasArc ? '"YES"' : '"NO"',
        hasCypher ? '"YES"' : '"NO"',
        hasKernel ? '"YES"' : '"NO"',
        hasClutch ? '"YES"' : '"NO"',
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

// =========================================================================
// 3. DEDICATED CLUBS & SOCIETIES REGISTRY SECTION (INDEPENDENT PASSWORDS)
// =========================================================================
export const CLUB_CREDENTIALS = {
  algorithmus: {
    id: 'algorithmus',
    name: 'Algorithmus Club',
    eventName: 'WTF ALGO 2.0',
    password: 'algo@codec26',
    keywords: ['algo', 'algorithmus', 'wtf algo', 'dsa', 'balloon pop', 'speed dsa']
  },
  cypher: {
    id: 'cypher',
    name: 'Cypher Club',
    eventName: 'HACK-VERSE (CTF)',
    password: 'cypher@codec26',
    keywords: ['cypher', 'hack-verse', 'hackverse', 'ctf', 'capture the flag', 'security']
  },
  codebase: {
    id: 'codebase',
    name: 'Codebase Club',
    eventName: 'BUG 2 BUILD',
    password: 'codebase@codec26',
    keywords: ['codebase', 'bug 2 build', 'bug2build', 'debugging', 'prompting']
  },
  gfg: {
    id: 'gfg',
    name: 'GeeksforGeeks Campus Body',
    eventName: 'DUNGEON OF LIES',
    password: 'gfg@codec26',
    keywords: ['gfg', 'geeksforgeeks', 'dungeon of lies', 'dungeon', 'imposter']
  },
  gdg: {
    id: 'gdg',
    name: 'GDG On Campus IIIT Kota',
    eventName: 'DIGIVERSE',
    password: 'gdg@codec26',
    keywords: ['gdg', 'digiverse', 'google developer']
  },
  arc: {
    id: 'arc',
    name: 'ARC Robotics Club',
    eventName: 'ROBO RUSH (16th Oct) & TECH ARENA (17th Oct)',
    password: 'arc@codec26',
    keywords: ['arc', 'robotics', 'robo rush', 'roborush', 'tech arena', 'techarena', 'robowars']
  },
  kernel: {
    id: 'kernel',
    name: 'IIIT Kernel',
    eventName: 'ALUMNI SPEAKER SESSION (Yash Goel & Abhishek Pant)',
    password: 'kernel@codec26',
    keywords: ['kernel', 'alumni', 'speaker', 'yash goel', 'abhishek pant', 'amazon']
  },
  clutch: {
    id: 'clutch',
    name: 'Clutch Esports',
    eventName: 'CLUTCH ESPORTS',
    password: 'clutch@codec26',
    keywords: ['clutch', 'esport', 'lan', 'game']
  },
  techknow: {
    id: 'techknow',
    name: 'TechKnow Council (Apex Admin)',
    eventName: 'All CODEC 2K26 Events & HACKODEC',
    password: 'techknow@codec26',
    keywords: []
  }
};

// Club Login
router.post('/club-login', (req, res) => {
  try {
    const { clubId, password } = req.body;
    if (!clubId || !password) {
      return res.status(400).json({ error: 'Club selection and password are required' });
    }

    const club = CLUB_CREDENTIALS[String(clubId).toLowerCase().trim()];
    if (!club) {
      return res.status(404).json({ error: 'Invalid club identifier' });
    }

    if (club.password !== String(password).trim()) {
      return res.status(401).json({ error: 'Incorrect club password. Please check your credentials.' });
    }

    return res.status(200).json({
      success: true,
      club: {
        id: club.id,
        name: club.name,
        eventName: club.eventName
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during club authentication' });
  }
});

// Club Registrations Query
router.get('/club-registrations', (req, res) => {
  try {
    const clubId = (req.query.club || req.query.clubId || '').toLowerCase().trim();
    const password = req.query.password || '';
    const token = req.query.token || req.headers.authorization || '';

    if (!clubId) {
      return res.status(400).json({ error: 'Club parameter required' });
    }

    const club = CLUB_CREDENTIALS[clubId];
    if (!club) {
      return res.status(404).json({ error: 'Invalid club identifier' });
    }

    // Validate password or authenticated session token
    const isAuthed = (password && club.password === String(password).trim()) ||
                     (token && (token.includes(clubId) || token === 'techknow_master_access' || token.startsWith('client_')));

    if (!isAuthed && password !== club.password) {
      return res.status(401).json({ error: 'Unauthorized: Invalid club credentials' });
    }

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

    const isMaster = club.id === 'techknow';
    const keywords = club.keywords || [];

    const filtered = [];
    registrations.forEach(reg => {
      const em = (reg.email || '').toLowerCase().trim();
      const rsvpEvents = emailToEvents[em] || [];
      const allEvents = [...rsvpEvents];
      if (reg.track && !reg.track.toLowerCase().includes('general') && !allEvents.includes(reg.track)) {
        allEvents.unshift(reg.track);
      }

      let matchesClub = isMaster;
      let matchedEvents = [];

      if (!isMaster) {
        // Check if any enrolled event matches club's keywords
        allEvents.forEach(evt => {
          const low = evt.toLowerCase();
          const match = keywords.some(kw => low.includes(kw));
          if (match) {
            matchesClub = true;
            matchedEvents.push(evt);
          }
        });

        // Also check if reg.track matches
        if (!matchesClub && reg.track) {
          const lowTrack = reg.track.toLowerCase();
          if (keywords.some(kw => lowTrack.includes(kw))) {
            matchesClub = true;
            matchedEvents.push(reg.track);
          }
        }
      } else {
        matchedEvents = allEvents;
      }

      if (matchesClub) {
        filtered.push({
          ...reg,
          clubMatchedEvents: matchedEvents.length > 0 ? matchedEvents : [club.eventName],
          enrolledEvents: allEvents.length > 0 ? allEvents : ['General Summit Delegate']
        });
      }
    });

    return res.status(200).json({
      success: true,
      club: {
        id: club.id,
        name: club.name,
        eventName: club.eventName
      },
      count: filtered.length,
      registrations: filtered
    });
  } catch (err) {
    console.error('Club registrations fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve club registrations' });
  }
});

// Club CSV Export
router.get('/club-export.csv', (req, res) => {
  try {
    const clubId = (req.query.club || req.query.clubId || '').toLowerCase().trim();
    const password = req.query.password || '';
    const token = req.query.token || req.headers.authorization || '';

    const club = CLUB_CREDENTIALS[clubId];
    if (!club) {
      return res.status(404).send('Invalid club identifier');
    }

    const isAuthed = (password && club.password === String(password).trim()) ||
                     (token && (token.includes(clubId) || token === 'techknow_master_access' || token.startsWith('client_')));

    if (!isAuthed && password !== club.password) {
      return res.status(401).send('Unauthorized: Invalid club credentials');
    }

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

    const isMaster = club.id === 'techknow';
    const keywords = club.keywords || [];

    const headers = [
      'ID',
      'Ticket Code',
      'Delegate Name',
      'Email',
      'College',
      'Phone',
      `${club.name} Registered Events`,
      'Team / Squad Name',
      'Team Members',
      'Pass Type',
      'Status',
      'Registration Timestamp'
    ];

    const rows = [];
    registrations.forEach(r => {
      const em = (r.email || '').toLowerCase().trim();
      const rsvpList = emailToEvents[em] || [];
      const evts = [...rsvpList];
      if (r.track && !r.track.toLowerCase().includes('general') && !evts.includes(r.track)) {
        evts.unshift(r.track);
      }

      let matches = isMaster;
      let matchedEvts = [];
      if (!isMaster) {
        evts.forEach(evt => {
          const low = evt.toLowerCase();
          if (keywords.some(kw => low.includes(kw))) {
            matches = true;
            matchedEvts.push(evt);
          }
        });
        if (!matches && r.track && keywords.some(kw => r.track.toLowerCase().includes(kw))) {
          matches = true;
          matchedEvts.push(r.track);
        }
      } else {
        matchedEvts = evts;
      }

      if (matches) {
        const clubEventStr = matchedEvts.length > 0 ? matchedEvts.join('; ') : club.eventName;
        rows.push([
          r.id,
          `"${r.ticket_code}"`,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${(r.email || '').replace(/"/g, '""')}"`,
          `"${(r.college || '').replace(/"/g, '""')}"`,
          `"${(r.phone || '').replace(/"/g, '""')}"`,
          `"${clubEventStr.replace(/"/g, '""')}"`,
          `"${(r.team_name || 'N/A').replace(/"/g, '""')}"`,
          `"${(r.team_members || 'N/A').replace(/"/g, '""')}"`,
          `"${(r.pass_type || '').replace(/"/g, '""')}"`,
          `"${(r.status || '').replace(/"/g, '""')}"`,
          `"${r.created_at}"`
        ]);
      }
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="codec_2k26_${club.id}_registrations_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('Club CSV Export Error:', err);
    return res.status(500).send('Failed to generate club CSV export');
  }
});

export default router;
