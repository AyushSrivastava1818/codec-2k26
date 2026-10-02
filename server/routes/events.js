import { Router } from 'express';
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

// Single Event RSVP
router.post('/rsvp', (req, res) => {
  try {
    const { name, email, eventTitle, track } = req.body;
    if (!email || !eventTitle) {
      return res.status(400).json({ error: 'Email and event title are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanTitle = eventTitle.trim();

    // Prevent duplicate entries
    const existing = checkRsvpStmt.get(cleanEmail, cleanTitle);
    if (existing) {
      return res.status(200).json({
        message: `Already registered for ${cleanTitle}`,
        alreadyRegistered: true
      });
    }

    insertRsvpStmt.run({
      name: name ? name.trim() : 'Delegate',
      email: cleanEmail,
      event_title: cleanTitle,
      track: track || cleanTitle
    });

    return res.status(201).json({
      message: `Successfully registered for ${cleanTitle}`
    });
  } catch (err) {
    console.error('Event RSVP Error:', err);
    return res.status(500).json({ error: 'Failed to record event registration' });
  }
});

// Batch Events RSVP (Register for multiple events simultaneously)
router.post('/batch-rsvp', (req, res) => {
  try {
    const { name, email, events } = req.body;
    if (!email || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Email and events array are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : 'Delegate';
    let addedCount = 0;

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
      addedCount
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
