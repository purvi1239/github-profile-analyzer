import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import githubRoutes from "./routes/github.js";
import historyRoutes from "./routes/history.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/github", githubRoutes);
app.use("/api/history", historyRoutes);

app.listen(3000, () => console.log("✅ Server running on port 3000"));
