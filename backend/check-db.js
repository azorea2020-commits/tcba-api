const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("F:/tcba-api/db/tcba.db");

// SQL to create members table if it doesn’t exist
const createMembersSQL = `
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  join_date TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);
`;

db.serialize(() => {
  console.log("🔍 Checking database...");

  db.run(createMembersSQL, (err) => {
    if (err) {
      console.error("❌ Error creating members table:", err.message);
    } else {
      console.log("✅ Members table is ready.");
    }
  });

  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
    if (!err) {
      console.log("📋 Tables in DB:", rows.map(r => r.name));
    }
  });

  db.close();
});
