const express = require('express');
const cors = require('cors');
const { pool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ── GET all expenses ──────────────────────────────
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM expenses ORDER BY date DESC, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// ── POST add a new expense ────────────────────────
app.post('/api/expenses', async (req, res) => {
  try {
    const { items, tags, amount, date, time } = req.body;

    const [result] = await pool.query(
      `INSERT INTO expenses (items, tags, amount, date, time)
       VALUES (?, ?, ?, ?, ?)`,
      [items, tags, amount, date, time]
    );

    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// ── DELETE an expense ─────────────────────────────
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
