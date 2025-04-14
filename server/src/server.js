import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import entriesRoutes from "./routes/entries.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import pool from "./db/db.js";
import pgSession from "connect-pg-simple";

const app = express();
const PORT = process.env.PORT || 3000

const allowedOrigins = [
    "http://localhost:3000",
    "https://einstaklingsverkefni-95p0.onrender.com",
    "https://einstaklingsverkefni-six.vercel.app",
    "https://einstaklingsverkefni-six.vercel.app/"
  ];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.options("*", cors())

app.use(express.json());

const PgSession = pgSession(session);

app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: "session",
      }),
      secret: process.env.SESSION_SECRET || "ekki-mcdonalds-a-islandi",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );


app.use("/auth", authRoutes);
app.use("/entries", entriesRoutes);
app.use("/leaderboard", leaderboardRoutes);


app.get("/", async (req, res) => {
    try {
        res.json({message: "TODO: Home Page"});
    } catch (err) {
      res.status(500).send("Database error");
    }
  });


app.get("/my-profile", async (req, res) => {
    // @ts-ignore
    const userId = req.session.userId;

    console.log("SESSION DEBUG:", req.session); // 

    if (!userId) {
        res.status(401).json({ error: "Not logged in" });
        return
    }

    try {
        const result = await pool.query(
        "SELECT id, username FROM users WHERE id = $1",
        [userId]
        );

        const user = result.rows[0];
        if (!user) {
        res.status(404).json({ error: "User not found" });
        return
        } 

        res.json(user);
    } catch (err) {
        console.error("Error gettin the profile", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    try{
        console.info(`Server started on http://localhost:${PORT}`);
    } catch(err){
        console.error("Unable to start server.");
    }
})