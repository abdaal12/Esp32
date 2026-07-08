const fs = require("fs");
const path = require("path");

const Conversation =
  require("../models/Conversation");

const {
  createWavFile
} = require("../services/wavService");

const {
  runWhisper
} = require("../services/whisperService");

const uploadsDir = path.join(
  __dirname,
  "..",
  "uploads"
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

let recordingCommand = "idle";

const startCommand = (req, res) => {

  recordingCommand = "start";

  console.log("Command => START");

  res.json({
    success: true,
    command: recordingCommand
  });
};

const stopCommand = (req, res) => {

  recordingCommand = "stop";

  console.log("Command => STOP");

  res.json({
    success: true,
    command: recordingCommand
  });
};

const statusCommand = (req, res) => {

  const currentCommand =
    recordingCommand;

  console.log(
    "Status Requested =>",
    currentCommand
  );

  if (
    recordingCommand === "start" ||
    recordingCommand === "stop"
  ) {
    recordingCommand = "idle";
  }

  res.json({
    command: currentCommand
  });
};

const startRecording = (req, res) => {

  const pcmFile = path.join(
    uploadsDir,
    "recording.pcm"
  );

  if (fs.existsSync(pcmFile)) {
    fs.unlinkSync(pcmFile);
  }

  console.log("Recording Started");

  res.json({
    success: true
  });
};

const audioChunk = (req, res) => {

  const pcmFile = path.join(
    uploadsDir,
    "recording.pcm"
  );

  fs.appendFileSync(
    pcmFile,
    req.body
  );

  res.json({
    success: true
  });
};

const stopRecording =
  async (req, res) => {

    try {

      const pcmFile = path.join(
        uploadsDir,
        "recording.pcm"
      );

      const wavFile = path.join(
        uploadsDir,
        "recording.wav"
      );

      if (
        !fs.existsSync(pcmFile)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "PCM file not found"
        });
      }

      createWavFile(
        pcmFile,
        wavFile
      );

      console.log(
        "recording.wav created"
      );

console.log("Running Whisper...");

const transcript = await runWhisper();

console.log(
  "Transcript:",
  transcript
);


      const conversation =
        await Conversation.create({

          transcript,

          response: "",

          deviceId: "TOY001"

        });
console.log(
  "Saved to MongoDB"
);
      res.json({

        success: true,

        transcript,

        conversation

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }
};

module.exports = {

  startCommand,
  stopCommand,
  statusCommand,

  startRecording,
  audioChunk,
  stopRecording
};