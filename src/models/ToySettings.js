/**
 * backend/src/models/ToySettings.js
 *
 * Single-document settings store for the toy itself (as opposed to
 * per-recording data). Currently just the toy's name, but this is the
 * natural place to add more toy-level settings later.
 */

const mongoose = require("mongoose");

const toySettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Arobo",
  },
});

module.exports = mongoose.model("ToySettings", toySettingsSchema);