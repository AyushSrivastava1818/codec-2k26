import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = Router();

const insertPassStmt = db.prepare(`
  INSERT INTO registrations (ticket_code, user_id, name, email, college, phone, track, pass_type, team_name, team_members, qr_data)
  VALUES (@ticket_code, @user_id, @name, @email, @college, @phone, @track, @pass_type, @team_name, @team_members, @qr_data)
`);

const checkRsvpStmt = db.prepare(`
  SELECT id FROM event_rsvps WHERE email = ? AND event_title = ?
`);

const insertRsvpStmt = db.prepare(`
  INSERT INTO event_rsvps (name, email, event_title, track)
  VALUES (@name, @email, @event_title, @track)
`);

const findPassByCodeStmt = db.prepare(`
  SELECT * FROM registrations WHERE ticket_code = ?
`);

const findPassesByEmailStmt = db.prepare(`
  SELECT * FROM registrations WHERE email = ? ORDER BY id DESC
`);

// Register for a Summit Pass (Direct Pass issuance)
router.post('/', (req, res) => {
  try {
    const { name, email, college, phone, track, passType, events, teamName, teamMembers } = req.body;

    if (!name || !email || !college) {
      return res.status(400).json({ error: 'Name, email, and institution are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanCollege = college.trim();
    const cleanPhone = phone ? phone.trim() : null;

    const ticketCode = `CODEC-26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const chosenTrack = track || 'General Summit';
    const chosenPassType = passType || 'SUMMIT_ACCESS_PASS';
    const qrData = `CODEC:2026:TICKET:${ticketCode}:NAME:${encodeURIComponent(cleanName)}:COLLEGE:${encodeURIComponent(cleanCollege)}`;

    const eventList = Array.isArray(events) ? events : [];
    const serializedMembers = teamMembers ? (typeof teamMembers === 'string' ? teamMembers : JSON.stringify(teamMembers)) : null;

    const registerTx = db.transaction(() => {
      insertPassStmt.run({
        ticket_code: ticketCode,
        user_id: req.body.userId || null,
        name: cleanName,
        email: cleanEmail,
        college: cleanCollege,
        phone: cleanPhone,
        track: chosenTrack,
        pass_type: chosenPassType,
        team_name: teamName ? teamName.trim() : null,
        team_members: serializedMembers,
        qr_data: qrData
      });

      // Insert any selected competitions into event_rsvps in the same transaction
      for (const evt of eventList) {
        const cleanTitle = String(evt).trim();
        if (!cleanTitle || cleanTitle.toLowerCase().includes('general summit')) continue;
        const exists = checkRsvpStmt.get(cleanEmail, cleanTitle);
        if (!exists) {
          insertRsvpStmt.run({
            name: cleanName,
            email: cleanEmail,
            event_title: cleanTitle,
            track: cleanTitle
          });
        }
      }
    });

    registerTx();

    const pass = findPassByCodeStmt.get(ticketCode);
    if (pass && pass.team_members) {
      try { pass.team_members = JSON.parse(pass.team_members); } catch (e) {}
    }

    return res.status(201).json({
      message: 'Summit Pass generated successfully',
      pass
    });
  } catch (err) {
    console.error('Registration Pass Error:', err);
    return res.status(500).json({ error: 'Unable to issue Summit Pass at this moment.' });
  }
});

// Register 4-member squad specifically for HACKODEC Flagship Hackathon
router.post('/hackathon-team', (req, res) => {
  try {
    const { teamName, leaderName, leaderEmail, college, phone, members, track } = req.body;

    if (!teamName || !leaderName || !leaderEmail) {
      return res.status(400).json({ error: 'Team name, leader name, and email are required.' });
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'At least one member is required for squad registration.' });
    }

    const cleanTeamName = teamName.trim();
    const cleanLeaderName = leaderName.trim();
    const cleanLeaderEmail = leaderEmail.trim().toLowerCase();
    const cleanCollege = (college || 'IIIT Kota').trim();
    const cleanPhone = phone ? phone.trim() : null;
    const cleanTrack = track || 'HACKODEC (12-Hour Flagship Hackathon)';

    const ticketCode = `CODEC-26-HACK-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const qrData = `CODEC:2026:HACKATHON:TICKET:${ticketCode}:TEAM:${encodeURIComponent(cleanTeamName)}:LEADER:${encodeURIComponent(cleanLeaderName)}:COLLEGE:${encodeURIComponent(cleanCollege)}`;

    const serializedMembers = JSON.stringify(members);

    const teamTx = db.transaction(() => {
      insertPassStmt.run({
        ticket_code: ticketCode,
        user_id: req.body.userId || null,
        name: `${cleanLeaderName} [Squad: ${cleanTeamName}]`,
        email: cleanLeaderEmail,
        college: cleanCollege,
        phone: cleanPhone,
        track: cleanTrack,
        pass_type: 'HACKATHON_SQUAD_PASS',
        team_name: cleanTeamName,
        team_members: serializedMembers,
        qr_data: qrData
      });

      // Add HACKODEC to event_rsvps
      const exists = checkRsvpStmt.get(cleanLeaderEmail, cleanTrack);
      if (!exists) {
        insertRsvpStmt.run({
          name: `${cleanLeaderName} (${cleanTeamName})`,
          email: cleanLeaderEmail,
          event_title: cleanTrack,
          track: cleanTrack
        });
      }
    });

    teamTx();

    const pass = findPassByCodeStmt.get(ticketCode);
    if (pass && pass.team_members) {
      try { pass.team_members = JSON.parse(pass.team_members); } catch (e) {}
    }

    return res.status(201).json({
      message: 'HACKODEC Squad registered successfully!',
      pass
    });
  } catch (err) {
    console.error('Hackathon Team Registration Error:', err);
    return res.status(500).json({ error: 'Failed to register hackathon squad.' });
  }
});

// Lookup pass by ticket code or email (for retrieving original pass)
router.get('/lookup', (req, res) => {
  try {
    const query = (req.query.query || req.query.ticket_code || req.query.ticketCode || req.query.email || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Ticket code or email query parameter required' });
    }

    let pass = findPassByCodeStmt.get(query.toUpperCase());
    if (!pass) {
      pass = db.prepare(`SELECT * FROM registrations WHERE LOWER(email) = LOWER(?) ORDER BY id DESC LIMIT 1`).get(query);
    }
    if (!pass) {
      // Partial ticket match if user entered just hex or code
      pass = db.prepare(`SELECT * FROM registrations WHERE ticket_code LIKE ? ORDER BY id DESC LIMIT 1`).get(`%${query}%`);
    }

    if (!pass) {
      return res.status(404).json({ found: false, error: 'No pass found matching that ticket code or email.' });
    }

    if (pass.team_members && typeof pass.team_members === 'string') {
      try { pass.team_members = JSON.parse(pass.team_members); } catch (e) {}
    }

    return res.json({ found: true, pass });
  } catch (err) {
    console.error('Lookup error:', err);
    return res.status(500).json({ error: 'Failed to look up pass.' });
  }
});

// Lookup pass by direct ticket code
router.get('/ticket/:ticketCode', (req, res) => {
  try {
    const code = req.params.ticketCode.trim().toUpperCase();
    let pass = findPassByCodeStmt.get(code);
    if (!pass) {
      pass = db.prepare(`SELECT * FROM registrations WHERE ticket_code LIKE ? LIMIT 1`).get(`%${code}%`);
    }
    if (!pass) {
      return res.status(404).json({ found: false, error: 'Ticket not found.' });
    }
    if (pass.team_members && typeof pass.team_members === 'string') {
      try { pass.team_members = JSON.parse(pass.team_members); } catch (e) {}
    }
    return res.json({ found: true, pass });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch ticket.' });
  }
});

// Get passes by email
router.get('/my', (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    const passes = findPassesByEmailStmt.all(email.trim().toLowerCase());
    passes.forEach(p => {
      if (p.team_members && typeof p.team_members === 'string') {
        try { p.team_members = JSON.parse(p.team_members); } catch (e) {}
      }
    });
    return res.json({ passes });
  } catch (err) {
    console.error('Fetch passes error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify ticket code (public QR scanner target)
router.get('/verify/:ticketCode', (req, res) => {
  try {
    const pass = findPassByCodeStmt.get(req.params.ticketCode.toUpperCase());
    if (!pass) {
      return res.status(404).json({ valid: false, error: 'Pass code not recognized.' });
    }

    let parsedMembers = null;
    if (pass.team_members) {
      try { parsedMembers = JSON.parse(pass.team_members); } catch (e) { parsedMembers = pass.team_members; }
    }

    return res.json({
      valid: true,
      pass: {
        ticketCode: pass.ticket_code,
        name: pass.name,
        college: pass.college,
        track: pass.track,
        passType: pass.pass_type,
        teamName: pass.team_name,
        teamMembers: parsedMembers,
        status: pass.status,
        issuedAt: pass.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Verification error' });
  }
});

export default router;
