/**
 * backend/src/controllers/settingsController.js
 *
 * GET/POST for the toy's settings (currently just its name).
 */

const ToySettings = require("../models/ToySettings");

async function getSettings(req, res) {
  let settings = await ToySettings.findOne();
  if (!settings) {
    settings = await ToySettings.create({});
  }
  res.json(settings);
}

async function updateSettings(req, res) {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, error: "Name cannot be empty" });
  }

  let settings = await ToySettings.findOne();
  if (!settings) {
    settings = await ToySettings.create({ name: name.trim() });
  } else {
    settings.name = name.trim();
    await settings.save();
  }

  res.json({ ok: true, settings });
}

module.exports = { getSettings, updateSettings };