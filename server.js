const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ FIXED CORS CONFIG
app.use(
  cors({
    origin: '*', // allow all origins for now
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(bodyParser.json());

// SQLite setup
const db = new sqlite3.Database('./db/tcba.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'TCBA API test route is working' });
});

// Root route
app.get('/', (req, res) => {
  res.send('🐝 TCBA API is live and buzzing!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
