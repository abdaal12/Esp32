/**
 * backend/controllers/transcriptController.js
 *
 * Bridges to the one Python piece (faster-whisper) via child_process,
 * and handles saving/reading transcripts in MongoDB.
 */

const { spawn } = require("child_process");
const path = require("path");
const Transcript = require("../models/Transcript");
const { matchCommonAnswer } = require("./responseController");


const PYTHON_SCRIPT = path.join(__dirname, "..", "..", "python", "transcribe.py");
const PYTHON_BIN = process.platform === "win32"
  ? path.join(__dirname, "..", "..", "python", "venv", "Scripts", "python.exe")
  : path.join(__dirname, "..", "..", "python", "venv", "bin", "python3");

// Runs the whisper script on a wav file, resolves with the transcribed text.
function transcribeWithPython(wavPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON_BIN, [PYTHON_SCRIPT, wavPath]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => (stdout += data.toString()));
    proc.stderr.on("data", (data) => (stderr += data.toString()));

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`transcribe.py exited ${code}: ${stderr}`));
      }
      try {
        const result = JSON.parse(stdout.trim());
        resolve(result.text || "");
      } catch (err) {
        reject(new Error(`Bad JSON from transcribe.py: ${stdout}`));
      }
    });
  });
}

async function transcribeAndSave(wavPath, audioFileName, durationSeconds) {
  const text = await transcribeWithPython(wavPath);
  const { answer } = await matchCommonAnswer(text);

  const doc = await Transcript.create({
    text,
    audioPath: audioFileName,
    durationSeconds,
    responseText: answer, // null if no common-answer matched (AI call goes here later)
  });

  return doc;
}

async function listTranscripts(req, res) {
  const limit = parseInt(req.query.limit) || 50;
  const docs = await Transcript.find().sort({ createdAt: -1 }).limit(limit);
  res.json(docs);
}

async function getLatestTranscript(req, res) {
  const doc = await Transcript.findOne().sort({ createdAt: -1 });
  if (!doc) return res.status(404).json({ error: "No transcripts yet" });
  res.json(doc);
}

async function getTranscriptById(req, res) {
  const doc = await Transcript.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
}

module.exports = {
  transcribeAndSave,
  listTranscripts,
  getLatestTranscript,
  getTranscriptById,
};