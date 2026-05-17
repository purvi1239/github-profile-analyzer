import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Search from "../models/Search.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const history = await Search.find({ firebaseUid: req.user.uid })
    .sort({ searchedAt: -1 })
    .limit(20);
  res.json(history);
});

router.delete("/:id", verifyToken, async (req, res) => {
  await Search.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
