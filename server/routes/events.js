import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const insertRsvpStmt = db.prepare(`
  INSERT INTO event_rsvps (name, email, event_title, track)
  VALUES (@name, @email, @event_title, @track)
`);

const findRsvpsByEmailStmt = db.prepare(`
  SELECT * FROM event_rsvps WHERE email = ? ORDER BY id DESC
`);

router.post('/rsvp', (req, res) => {
  try {
    const { name, email, eventTitle, track } = req.body;
    if (!email || !eventTitle) {
      return res.status(400).json({ error: 'Email and event title are required' });
    }

    insertRsvpStmt.run({
      name: name ? name.trim() : 'Delegate',
      email: email.trim().toLowerCase(),
      event_title: eventTitle.trim(),
      track: track || 'Summit Session'
    });

    return res.status(201).json({
      message: `Successfully RSVP'd for ${eventTitle}`
    });
  } catch (err) {
    console.error('Event RSVP Error:', err);
    return res.status(500).json({ error: 'Failed to record RSVP' });
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
