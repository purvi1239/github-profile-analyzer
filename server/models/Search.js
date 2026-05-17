import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true },
  githubUsername: String,
  searchedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Search", searchSchema);
