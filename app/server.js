const express = require('express');
const { Pool } = require('pg');
const app = express();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Hello FluidAi from backend', dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.get('/readyz', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('ready');
  } catch (err) {
    res.status(503).send('not ready: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));