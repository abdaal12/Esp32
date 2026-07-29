/**
 * backend/src/controllers/recordingController.js
 *
 * HTTP handlers for /api/recording/start and /api/recording/stop.
 *
 * Privacy note: audio is written to a TEMPORARY file only so Whisper
 * (a separate process) can read it from disk. That temp file is
 * deleted immediately after transcription, whether it succeeds or
 * fails. The actual audio is sent directly to the frontend as part
 * of the live broadcast (base64), so it's playable only during that
 * runtime session — nothing audio-related is ever persisted to disk
 * or to the database.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const device = require("./deviceController");
const { transcribeAndSave } = require("./transcriptController");
const { buildWavBuffer, writeWavFile } = require("../utils/waveWriter");

const SAMPLE_RATE = 16000;

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

  const durationSeconds = pcmBuffer.length / 2 / SAMPLE_RATE;
  const wavBuffer = buildWavBuffer(pcmBuffer, SAMPLE_RATE);

  // Temp file exists ONLY for Whisper to read — deleted right after, always.
  const tempPath = path.join(os.tmpdir(), `voice-toy-${Date.now()}.wav`);
  fs.writeFileSync(tempPath, wavBuffer);

  try {
    const doc = await transcribeAndSave(tempPath, durationSeconds);

    const result = {
      type: "transcript",
      id: doc._id,
      text: doc.text,
      responseText: doc.responseText,
      durationSeconds: doc.durationSeconds,
      // Sent directly for immediate playback this session only.
      // Never saved anywhere — gone once the frontend tab closes/refreshes.
      audioData: `data:audio/wav;base64,${wavBuffer.toString("base64")}`,
    };

    device.broadcastToFrontend(result);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("Transcription failed:", err.message);
    res.status(500).json({ ok: false, error: "Transcription failed" });
  } finally {
    fs.unlink(tempPath, (err) => {
      if (err) console.error("Failed to delete temp audio file:", err.message);
    });
  }
}

module.exports = { startRecording, stopRecording };