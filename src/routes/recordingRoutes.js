const express = require("express");
const router = express.Router();
const { startRecording, stopRecording } = require("../controllers/recordingController");

router.post("/start", startRecording);
router.post("/stop", stopRecording);

module.exports = router;