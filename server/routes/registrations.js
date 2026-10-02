import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = Router();

const insertPassStmt = db.prepare(`
  INSERT INTO registrations (ticket_code, user_id, name, email, college, phone, track, pass_type, qr_data)
  VALUES (@ticket_code, @user_id, @name, @email, @college, @phone, @track, @pass_type, @qr_data)
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
    const { name, email, college, phone, track, passType, events } = req.body;

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

    return res.status(201).json({
      message: 'Summit Pass generated successfully',
      pass
    });
  } catch (err) {
    console.error('Registration Pass Error:', err);
    return res.status(500).json({ error: 'Unable to issue Summit Pass at this moment.' });
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

    return res.json({
      valid: true,
      pass: {
        ticketCode: pass.ticket_code,
        name: pass.name,
        college: pass.college,
        track: pass.track,
        passType: pass.pass_type,
        status: pass.status,
        issuedAt: pass.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Verification error' });
  }
});

export default router;
