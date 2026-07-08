const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "..", "..", process.env.UPLOADS_DIR || "uploads");

// GET /api/audio/:filename  -> streams the wav file for playback
router.get("/:filename", (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Audio file not found" });
  }

  res.setHeader("Content-Type", "audio/wav");
  fs.createReadStream(filePath).pipe(res);
});

module.exports = router;