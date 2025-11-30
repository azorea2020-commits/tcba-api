/**
 * TCBA API — FINAL STABLE SERVER.JS
 * Works on Render Linux, Windows, GoDaddy, anywhere.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== DATABASE =====
const dbPath = path.join(__dirname, "db", "members.sqlite");

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DATABASE ERROR:", err.message);
    } else {
        console.log("DATABASE CONNECTED:", dbPath);
    }
});

// ===== MIDDLEWARE =====
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.get("/", (req, res) => {
    res.send("TCBA API ONLINE — FINAL STABLE VERSION");
});

app.get("/healthz", (req, res) => {
    res.json({ ok: true, time: Date.now() });
});

// ===== LOGIN =====
app.post("/login", (req, res) => {
    const { user, password } = req.body;

    const sql = `
        SELECT id, username, email, password, status, isOfficer
        FROM members
        WHERE username = ? OR email = ?
        LIMIT 1
    `;

    db.get(sql, [user, user], (err, row) => {
        if (err) return res.json({ ok: false, error: "db-error" });
        if (!row) return res.json({ ok: false, error: "no-user" });
        if (row.password !== password) return res.json({ ok: false, error: "bad-pass" });

        res.json({
            ok: true,
            id: row.id,
            username: row.username,
            status: row.status,
            isOfficer: row.isOfficer
        });
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log("TCBA API — FINAL SERVER.JS ACTIVE ON PORT", PORT);
});
