import express from "express";
import pg from "pg";
import dotenv from "dotenv";
const PORT = 3000;

dotenv.config();
const app = express();
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to this NodeJS and PostgreSQL lesson.");
});

app.get("/player-scores", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT players.name, games.title, scores.score
        FROM scores
        JOIN players ON scores.player_id = players.id
        JOIN games ON scores.game_id = games.id;
        `);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/top-players", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT players.name, SUM(scores.score) AS total_score
        FROM scores
        JOIN players ON scores.player_id = players.id
        GROUP BY players.name
        ORDER BY total_score DESC
        LIMIT 3;`);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/inactive-players", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT players.name
        FROM players
        LEFT JOIN scores ON players.id = scores.player_id
        WHERE scores.id IS NULL; `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/popular-genres", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT games.genre, COUNT(scores.id) AS times_played
        FROM scores
        JOIN games ON scores.game_id = games.id
        GROUP BY games.genre
        ORDER BY times_played DESC;`);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/recent-players", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT name, join_date
        FROM players
        WHERE join_date >= CURRENT_DATE - INTERVAL '30 days';`);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/athletes", async (req, res) => {
  const { name, sport, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO athletes (name, sport, age) VALUES ($1, $2, $3) RETURNING *",
      [name, sport, age],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/athletes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, sport, age } = req.body;
  try {
    const result = await pool.query(
      "UPDATE athletes SET name = $1, sport = $2, age = $3 WHERE id = $4 RETURNING *",
      [name, sport, age, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Athlete not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/athletes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM athletes WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Athlete not found");
    }
    res.send("Athlete deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
