// ========================================================
// TCBA API SERVER  —  FIXES "Cannot GET /"
// ========================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;
const FRONTEND = process.env.CORS_ORIGIN || 'https://tcbabees.org';

// ===== Middleware =====
app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Routes =====

// Root route  →  proves server is working
app.get('/', (req, res) => {
  res.status(200).send(`
    <h2>🐝 TCBA API is live!</h2>
    <p>Connected successfully to: <strong>${FRONTEND}</strong></p>
    <p>Use <code>/test</code> for API testing.</p>
  `);
});

// Simple test route
app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TCBA API test route is working'
  });
});

// Example login endpoint (for future use)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username or password' });
  }
  res.json({ success: true, message: `Welcome, ${username}! (test mode)` });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log('======================================');
  console.log(`🚀 TCBA API running on port ${PORT}`);
  console.log(`🌐 CORS allowed: ${FRONTEND}`);
  console.log('======================================');
});
