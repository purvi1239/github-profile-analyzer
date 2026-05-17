import express from "express";
import axios from "axios";
import { verifyToken } from "../middleware/verifyToken.js";
import Search from "../models/Search.js";

const router = express.Router();

router.get("/user/:username", verifyToken, async (req, res) => {
  try {
    await Search.create({
      firebaseUid: req.user.uid,
      githubUsername: req.params.username,
    });

    const { data } = await axios.get(
      `https://api.github.com/users/${req.params.username}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    res.json(data);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

router.get("/user/:username/repos", verifyToken, async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/users/${req.params.username}/repos?sort=stars&per_page=20`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    res.json(data);
  } catch {
    res.status(404).json({ error: "Repos not found" });
  }
});

router.get("/user/:username/events", verifyToken, async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/users/${req.params.username}/events/public?per_page=100`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    res.json(data);
  } catch {
    res.status(404).json({ error: "Events not found" });
  }
});

export default router;
