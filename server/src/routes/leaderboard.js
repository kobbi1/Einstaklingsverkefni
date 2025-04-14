import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, points FROM users ORDER BY points DESC LIMIT 10"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal error, unable to get the leaderboard" });
  }
});

export default router;
