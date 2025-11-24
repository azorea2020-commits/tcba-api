// server.js
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database (SQLite)
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Simple Test Route
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "TCBA API is running!" });
});

// Example Route (you can add more)
app.get("/members", (req, res) => {
  db.all("SELECT * FROM members", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Fallback (for any unknown route)
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
