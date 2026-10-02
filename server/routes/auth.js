import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { hashPassword, comparePassword, generateToken, authenticateToken } from '../auth.js';

const router = Router();

// Prepared SQL Statements for extreme speed under load
const insertUserStmt = db.prepare(`
  INSERT INTO users (name, email, password_hash, college, phone, year)
  VALUES (@name, @email, @password_hash, @college, @phone, @year)
`);

const findUserByEmailStmt = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);

const findUserByIdStmt = db.prepare(`
  SELECT id, name, email, college, phone, year, created_at FROM users WHERE id = ?
`);

const insertPassStmt = db.prepare(`
  INSERT INTO registrations (ticket_code, user_id, name, email, college, phone, track, pass_type, qr_data)
  VALUES (@ticket_code, @user_id, @name, @email, @college, @phone, @track, @pass_type, @qr_data)
`);

const getUserPassesStmt = db.prepare(`
  SELECT * FROM registrations WHERE email = ? ORDER BY id DESC
`);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, phone, track, year } = req.body;

    if (!name || !email || !password || !college) {
      return res.status(400).json({ error: 'Name, email, password, and college are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = findUserByEmailStmt.get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const passwordHash = await hashPassword(password);

    // Run user creation & initial summit pass in a single transaction for atomicity
    const createUserAndPass = db.transaction(() => {
      const userResult = insertUserStmt.run({
        name: name.trim(),
        email: cleanEmail,
        password_hash: passwordHash,
        college: college.trim(),
        phone: phone ? phone.trim() : null,
        year: year ? year.trim() : 'B.Tech'
      });

      const userId = userResult.lastInsertRowid;
      const ticketCode = `CODEC-26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const chosenTrack = track || 'General Summit Delegate';

      insertPassStmt.run({
        ticket_code: ticketCode,
        user_id: userId,
        name: name.trim(),
        email: cleanEmail,
        college: college.trim(),
        phone: phone ? phone.trim() : null,
        track: chosenTrack,
        pass_type: 'ALL_ACCESS_PASS',
        qr_data: `CODEC:2026:TICKET:${ticketCode}:USER:${userId}`
      });

      return { userId, ticketCode };
    });

    const { userId, ticketCode } = createUserAndPass();

    const user = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      college: college.trim()
    };

    const token = generateToken(user);
    const passes = getUserPassesStmt.all(cleanEmail);

    return res.status(201).json({
      message: 'Account created and Summit Pass issued successfully',
      token,
      user,
      ticketCode,
      passes
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmailStmt.get(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      college: user.college
    };

    const token = generateToken(userPayload);
    const passes = getUserPassesStmt.all(cleanEmail);

    return res.json({
      message: 'Login successful',
      token,
      user: userPayload,
      passes
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// Get current profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = findUserByIdStmt.get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passes = getUserPassesStmt.all(user.email);

    return res.json({
      user,
      passes
    });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
