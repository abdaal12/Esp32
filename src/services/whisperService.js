const { exec } = require("child_process");

const runWhisper = () => {

  return new Promise((resolve, reject) => {

    exec(
      "python transcribe.py",
      { maxBuffer: 1024 * 1024 * 10 },
      (error, stdout, stderr) => {

        console.log("Whisper Process Finished");

        if (stderr) {
          console.log(stderr);
        }

        if (error) {
          return reject(error);
        }

        const transcript =
          stdout.trim();

        resolve(transcript);
      }
    );

  });
};

module.exports = {
  runWhisper
};