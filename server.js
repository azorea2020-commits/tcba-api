// server.js — TCBA Authentication API (Full Version)
// Supports Local Login, Google OAuth, Facebook OAuth, Sessions, SQLite

require("dotenv").config();
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const app = express();
const PORT = process.env.PORT || 5000;

/*******************************
 *  DATABASE SETUP
 *******************************/
const dbFile = path.join(__dirname, "tcba.db");
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("❌ DB Load Error:", err.message);
  } else {
    console.log("✅ SQLite DB Loaded:", dbFile);
  }
});

// Create users table if not exists
db.run(
  `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  password_hash TEXT,
  google_id TEXT UNIQUE,
  facebook_id TEXT UNIQUE,
  display_name TEXT,
  role TEXT DEFAULT 'member',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`,
  (err) => {
    if (err) console.error("❌ DB table creation failed:", err.message);
  }
);

/*******************************
 *  MIDDLEWARE
 *******************************/
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "https://tcbabees.org",
      "https://www.tcbabees.org",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SUPER_SECRET_KEY_CHANGE_THIS",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

/*******************************
 *  PASSPORT LOCAL STRATEGY
 *******************************/
passport.use(
  new LocalStrategy(
    { usernameField: "identifier", passwordField: "password" },
    (identifier, password, done) => {
      db.get(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [identifier, identifier],
        (err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false, { message: "User not found" });

          bcrypt.compare(password, user.password_hash, (err, success) => {
            if (err) return done(err);
            if (!success)
              return done(null, false, { message: "Incorrect password" });

            return done(null, user);
          });
        }
      );
    }
  )
);

/*******************************
 *  GOOGLE STRATEGY
 *******************************/
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `${process.env.BASE_URL}/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@googleuser.com`;

        db.get(
          "SELECT * FROM users WHERE google_id = ? OR email = ?",
          [profile.id, email],
          (err, user) => {
            if (err) return done(err);

            if (user) return done(null, user);

            db.run(
              `
              INSERT INTO users (email, google_id, display_name)
              VALUES (?, ?, ?)
            `,
              [email, profile.id, profile.displayName],
              function (err) {
                if (err) return done(err);
                db.get(
                  "SELECT * FROM users WHERE id = ?",
                  [this.lastID],
                  (err, newUser) => done(err, newUser)
                );
              }
            );
          }
        );
      }
    )
  );
}

/*******************************
 *  FACEBOOK STRATEGY
 *******************************/
if (process.env.FACEBOOK_CLIENT_ID) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL ||
          `${process.env.BASE_URL}/auth/facebook/callback`,
        profileFields: ["id", "emails", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.id}@facebookuser.com`;

        db.get(
          "SELECT * FROM users WHERE facebook_id = ? OR email = ?",
          [profile.id, email],
          (err, user) => {
            if (err) return done(err);

            if (user) return done(null, user);

            db.run(
              `
              INSERT INTO users (email, facebook_id, display_name)
              VALUES (?, ?, ?)
            `,
              [email, profile.id, profile.displayName],
              function (err) {
                if (err) return done(err);
                db.get(
                  "SELECT * FROM users WHERE id = ?",
                  [this.lastID],
                  (err, newUser) => done(err, newUser)
                );
              }
            );
          }
        );
      }
    )
  );
}

/*******************************
 *  PASSPORT SESSION HANDLERS
 *******************************/
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user || false);
  });
});

/*******************************
 *  AUTH ROUTES
 *******************************/
app.post("/api/register", (req, res) => {
  const { email, username, password, displayName } = req.body;

  if (!email || !username || !password)
    return res.status(400).json({ error: "Missing required fields" });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Password hash failed" });

    db.run(
      `
      INSERT INTO users (email, username, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `,
      [email, username, hash, displayName || username],
      function (err) {
        if (err)
          return res.status(409).json({ error: "Email or username already exists" });

        res.json({ success: true, userId: this.lastID });
      }
    );
  });
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!user) return res.status(401).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          display_name: user.display_name,
        },
      });
    });
  })(req, res, next);
});

app.post("/api/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

app.get("/api/me", (req, res) => {
  if (!req.user) return res.json({ authenticated: false });

  res.json({
    authenticated: true,
    user: req.user,
  });
});

/*******************************
 *  HEALTH CHECK
 *******************************/
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/*******************************
 *  START SERVER
 *******************************/
app.listen(PORT, () => {
  console.log(`🚀 TCBA API running on port ${PORT}`);
});
