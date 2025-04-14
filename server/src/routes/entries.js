import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import pool from "../db/db.js";

const router = express.Router();


router.post("/", requireAuth, async (req, res) => {
    const { title, content, is_public } = req.body;
    
    // @ts-ignore
    const userId = req.session.userId;
  
    try {
      await pool.query(
        `INSERT INTO entries (
            user_id, 
            title, 
            content, 
            is_public, 
            created_at) 
            VALUES ($1, $2, $3, $4, NOW())`,
        [userId, title, content, is_public]
      );
      res.status(201).json({ message: "Entry created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create entry" });
    }
  });
  
router.get("/me", requireAuth, async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;

    try {
        const result = await pool.query(
        `SELECT * FROM entries
            WHERE user_id = $1 
            ORDER BY created_at DESC`,
        [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch entries" });
    }
});

router.get("/public", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
              entries.id,
              entries.title,
              entries.content,
              entries.created_at,
              entries.user_id,
              entries.is_public,
              users.username,
              COUNT(points.id) AS total_points
            FROM entries
            JOIN users ON entries.user_id = users.id
            LEFT JOIN points ON points.entry_id = entries.id
            WHERE entries.is_public = TRUE
            GROUP BY entries.id, users.username
            ORDER BY entries.created_at DESC
            `
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch public entries" });
    }
});

router.get("/given", requireAuth, async (req, res) => {
  // @ts-ignore
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      "SELECT entry_id FROM points WHERE giver_id = $1",
      [userId]
    );

    const given = result.rows.map((row) => row.entry_id);
    res.json(given);
  } catch (err) {
    console.error("Error getting given points:", err);
    res.status(500).json({ error: "Failed to get given points" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;
    const entryId = req.params.id;

    try {
        const result = await pool.query("SELECT * FROM entries WHERE id = $1", [entryId]);
        const entry = result.rows[0];

        if (!entry) {
            res.status(404).json({ error: "Entry not found" });
            return
        }
        if (!entry.is_public && entry.user_id !== userId) {
            res.status(403).json({ error: "Not authorized" });
            return
        }

        res.json(entry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch entry" });
    }
});

router.put("/:id", requireAuth, async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;
    const entryId = req.params.id;
    const { title, content, is_public } = req.body;

    try {
        const check = await pool.query("SELECT * FROM entries WHERE id = $1", [entryId]);
        if (check.rows[0]?.user_id !== userId) {
        res.status(403).json({ error: "Not authorized" });
        return 
        }

        await pool.query(
        "UPDATE entries SET title = $1, content = $2, is_public = $3 WHERE id = $4",
        [title, content, is_public, entryId]
        );
        res.json({ message: "Entry updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update entry" });
    }
});

router.delete("/:id", requireAuth, async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;
    const entryId = req.params.id;

    try {
        const check = await pool.query("SELECT * FROM entries WHERE id = $1", [entryId]);
        if (check.rows[0]?.user_id !== userId) {
        res.status(403).json({ error: "Not authorized" });
        return 
        }

        await pool.query("DELETE FROM entries WHERE id = $1", [entryId]);
        res.json({ message: "Entry deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not delete entry" });
    }
});

router.post("/:id/give-point", requireAuth, async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;
    const entryId = req.params.id;
  
    try {
      const result = await pool.query("SELECT * FROM entries WHERE id = $1", [entryId]);
      const entry = result.rows[0];
  
      if (!entry || !entry.is_public || entry.user_id === userId) {
        res.status(400).json({ error: "Cannot give point" });
        return
      }
  
      try {
        await pool.query(
          "INSERT INTO points (giver_id, entry_id) VALUES ($1, $2)",
          [userId, entryId]
        );
      } catch (err) {
        throw err;
      }
      await pool.query("UPDATE users SET points = points + 1 WHERE id = $1", [entry.user_id]);
  
      res.json({ message: "Point given" });
    } catch (err) {
      console.error("Error giving point:", err);
      res.status(500).json({ error: "Could not give point" });
    }
  });

  router.post("/:id/remove-point", requireAuth, async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;
    const entryId = req.params.id;
  
    try {
      const result = await pool.query("SELECT * FROM entries WHERE id = $1", [entryId]);
      const entry = result.rows[0];
  
      if (!entry || !entry.is_public || entry.user_id === userId) {
        res.status(400).json({ error: "Cannot remove point" });
        return
      }
  
      const deleteResult = await pool.query(
        "DELETE FROM points WHERE entry_id = $1 AND giver_id = $2 RETURNING *",
        [entryId, userId]
      );
  
      if (deleteResult.rowCount === 0) {
        res.status(404).json({ error: "You haven't given a point to this entry" });
        return
      }
  
      await pool.query(
        "UPDATE users SET points = points - 1 WHERE id = $1",
        [entry.user_id]
      );
  
      res.json({ message: "Point removed" });
    } catch (err) {
      console.error("Error removing point:", err);
      res.status(500).json({ error: "Could not remove point" });
    }
  });


  
  
  


export default router;