import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = Router();

const checkRsvpStmt = db.prepare(`
  SELECT id FROM event_rsvps WHERE email = ? AND event_title = ?
`);

const insertRsvpStmt = db.prepare(`
  INSERT INTO event_rsvps (name, email, event_title, track)
  VALUES (@name, @email, @event_title, @track)
`);

const findRsvpsByEmailStmt = db.prepare(`
  SELECT * FROM event_rsvps WHERE email = ? ORDER BY id DESC
`);

const checkRegByEmailStmt = db.prepare(`
  SELECT id, ticket_code FROM registrations WHERE email = ?
`);

const insertAutoRegStmt = db.prepare(`
  INSERT INTO registrations (ticket_code, name, email, college, phone, track, pass_type, status, qr_data)
  VALUES (@ticket_code, @name, @email, @college, @phone, @track, 'SUBEVENT_PASS', 'CONFIRMED', @qr_data)
`);

// Helper to guarantee attendee has an official Summit Pass in registrations
function ensureDelegateRegistration(name, email, college, phone, track) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const existing = checkRegByEmailStmt.get(cleanEmail);
  if (existing) {
    return existing.ticket_code;
  }

  const cleanName = (name || 'Delegate').trim();
  const cleanCollege = (college || 'IIIT Kota').trim();
  const cleanPhone = phone ? String(phone).trim() : null;
  const ticketCode = `CODEC-26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const qrData = `CODEC:2026:TICKET:${ticketCode}:NAME:${encodeURIComponent(cleanName)}:COLLEGE:${encodeURIComponent(cleanCollege)}`;

  insertAutoRegStmt.run({
    ticket_code: ticketCode,
    name: cleanName,
    email: cleanEmail,
    college: cleanCollege,
    phone: cleanPhone,
    track: track || 'Sub-Event Arena',
    qr_data: qrData
  });

  return ticketCode;
}

// Single Event RSVP
router.post('/rsvp', (req, res) => {
  try {
    const { name, email, eventTitle, track, college, phone } = req.body;
    if (!email || !eventTitle) {
      return res.status(400).json({ error: 'Email and event title are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanTitle = eventTitle.trim();
    const cleanName = name ? name.trim() : 'Delegate';

    // Ensure attendee is registered in primary registry
    const ticketCode = ensureDelegateRegistration(cleanName, cleanEmail, college, phone, cleanTitle);

    // Prevent duplicate entries
    const existing = checkRsvpStmt.get(cleanEmail, cleanTitle);
    if (!existing) {
      insertRsvpStmt.run({
        name: cleanName,
        email: cleanEmail,
        event_title: cleanTitle,
        track: track || cleanTitle
      });
    }

    return res.status(200).json({
      message: `Successfully registered for ${cleanTitle}`,
      ticketCode,
      alreadyRegistered: !!existing
    });
  } catch (err) {
    console.error('Event RSVP Error:', err);
    return res.status(500).json({ error: 'Failed to record event registration' });
  }
});

// Batch Events RSVP (Register for multiple events simultaneously)
router.post('/batch-rsvp', (req, res) => {
  try {
    const { name, email, events, college, phone } = req.body;
    if (!email || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Email and events array are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : 'Delegate';
    let addedCount = 0;

    // Ensure attendee is registered in primary registry
    const primaryTrack = String(events[0] || 'Sub-Event Arena').trim();
    const ticketCode = ensureDelegateRegistration(cleanName, cleanEmail, college, phone, primaryTrack);

    const insertMany = db.transaction((evts) => {
      for (const evt of evts) {
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
          addedCount++;
        }
      }
    });

    insertMany(events);

    return res.status(200).json({
      message: `Registered for ${addedCount} events successfully`,
      addedCount,
      ticketCode
    });
  } catch (err) {
    console.error('Batch RSVP Error:', err);
    return res.status(500).json({ error: 'Failed to record batch registrations' });
  }
});

router.get('/my', (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    const rsvps = findRsvpsByEmailStmt.all(email.trim().toLowerCase());
    return res.json({ rsvps });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
