/**
 * backend/controllers/recordingController.js
 *
 * HTTP handlers for /api/recording/start and /api/recording/stop.
 * Orchestrates: device commands -> audio buffer -> wav file -> transcription.
 */

const fs = require("fs");
const path = require("path");
const device = require("./deviceController");
const { transcribeAndSave } = require("./transcriptController");
const { writeWavFile } = require("../utils/waveWriter");

const UPLOADS_DIR = path.join(__dirname, "..", "..", process.env.UPLOADS_DIR || "uploads");
const SAMPLE_RATE = 16000;

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function startRecording(req, res) {
  if (!device.isDeviceConnected()) {
    return res.status(409).json({ ok: false, error: "Device not connected" });
  }

  device.startRecordingState();
  device.sendCommandToDevice("start");
  device.broadcastToFrontend(device.getStatus());

  res.json({ ok: true });
}

async function stopRecording(req, res) {
  if (!device.isDeviceConnected()) {
    return res.status(409).json({ ok: false, error: "Device not connected" });
  }

  device.stopRecordingState();
  device.sendCommandToDevice("stop");
  device.broadcastToFrontend(device.getStatus());

  const pcmBuffer = device.drainAudioBuffer();

  if (pcmBuffer.length === 0) {
    return res.status(400).json({ ok: false, error: "No audio captured" });
  }

  const fileName = `recording_${Date.now()}.wav`;
  const wavPath = path.join(UPLOADS_DIR, fileName);
  const durationSeconds = pcmBuffer.length / 2 / SAMPLE_RATE; // 16-bit mono

  writeWavFile(wavPath, pcmBuffer, SAMPLE_RATE);

  try {
    const doc = await transcribeAndSave(wavPath, fileName, durationSeconds);

   const result = {
  type: "transcript",
  id: doc._id,
  text: doc.text,
  audioPath: doc.audioPath,
  durationSeconds: doc.durationSeconds,
  responseText: doc.responseText,
};

    device.broadcastToFrontend(result);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("Transcription failed:", err.message);
    res.status(500).json({ ok: false, error: "Transcription failed" });
  }
}

module.exports = { startRecording, stopRecording };