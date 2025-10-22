// === TCBA API SERVER – working version ===
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;
const FRONTEND = process.env.CORS_ORIGIN || "https://tcbabees.org";

app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(bodyParser.json());

// root route  ->  proves server is online
app.get("/", (req, res) => {
  res.send(`
    <h2>🐝 TCBA API is live!</h2>
    <p>Connected successfully to: <strong>${FRONTEND}</strong></p>
    <p>Try <a href="/test">/test</a> for a JSON check.</p>
  `);
});

// test route  ->  JSON proof endpoint
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "TCBA API test route is working" });
});

// start the server
app.listen(PORT, () => {
  console.log(`🚀 TCBA API running on port ${PORT}`);
});
