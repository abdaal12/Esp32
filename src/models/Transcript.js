/**
 * backend/src/models/Transcript.js
 *
 * Stores only text — question, response, and duration. Audio is
 * never persisted (see recordingController.js), so there's no
 * audio-related field here at all.
 */

const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
  responseText: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transcript", transcriptSchema);