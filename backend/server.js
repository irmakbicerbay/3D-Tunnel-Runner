import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// .env dosyasını oku
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase bağlantısı
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test endpoint
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

// Skor kaydetme
app.post("/score", async (req, res) => {
  try {
    const { player_name, score } = req.body;

    if (!player_name) {
      return res.status(400).json({ error: "player_name required" });
    }
    if (typeof score !== "number") {
      return res.status(400).json({ error: "score must be number" });
    }

    const { data, error } = await supabase
      .from("scores")
      .insert([{ player_name, score }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaderboard
app.get("/leaderboard", async (req, res) => {
  const { data, error } = await supabase
    .from("scores")
    .select("player_name, score, created_at")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Server başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
