// server.js - TCBA LOGIN UNIQUE2
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = './tcba.db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());                     // allow cross-origin (e.g., GoDaddy -> Render)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- SQLite ----
const DB_PATH = path.join(__dirname, 'tcba.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) { console.error('DB error:', err.message); process.exit(1); }
  console.log('SQLite connected at', DB_PATH);
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_members_email ON members(email)`);
  // seed default user (idempotent)
  db.run(`INSERT OR IGNORE INTO members (name, email, password) VALUES ('Test User', 'test@example.com', 'secret123')`);
});

// ---- Routes ----
app.get('/healthz', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.get('SELECT id, name FROM members WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: 'Invalid credentials' });
      res.json({ success: true, id: row.id, name: row.name });
    });
});

// PayPal stub: succeeds and redirects to welcome page hosted on this server
app.get('/auth/paypal', (req, res) => {
  res.redirect('/welcome.html');
});

// ---- Static frontend (login + welcome) ----
app.use(express.static(path.join(__dirname, 'public_html')));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
