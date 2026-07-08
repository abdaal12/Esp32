const express = require("express");
const router = express.Router();
const {
  listTranscripts,
  getLatestTranscript,
  getTranscriptById,
} = require("../controllers/transcriptController");

router.get("/", listTranscripts);
router.get("/latest", getLatestTranscript);
router.get("/:id", getTranscriptById);

module.exports = router;