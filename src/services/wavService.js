const fs = require("fs");

const createWavFile = (pcmFile, wavFile) => {

  const pcmData = fs.readFileSync(pcmFile);

  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;

  const byteRate =
    sampleRate *
    numChannels *
    bitsPerSample / 8;

  const blockAlign =
    numChannels *
    bitsPerSample / 8;

  const header = Buffer.alloc(44);

  header.write("RIFF", 0);

  header.writeUInt32LE(
    36 + pcmData.length,
    4
  );

  header.write("WAVE", 8);

  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  header.write("data", 36);

  header.writeUInt32LE(
    pcmData.length,
    40
  );

  const wavBuffer = Buffer.concat([
    header,
    pcmData
  ]);

  fs.writeFileSync(
    wavFile,
    wavBuffer
  );
};

module.exports = {
  createWavFile
};