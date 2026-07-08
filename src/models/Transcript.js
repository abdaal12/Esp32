const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  audioPath: {
    type: String,
    required: true,
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
  responseText: {
    type: String,
    default: null, // null until answered (either by common-answers match or, later, AI)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transcript", transcriptSchema);