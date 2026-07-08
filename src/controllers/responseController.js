const { commonAnswers } = require("../data/commonAnswers");
const ToySettings = require("../models/ToySettings");
const { getAiAnswer } = require("./aiController");

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

async function getToyName() {
  let settings = await ToySettings.findOne();
  if (!settings) {
    settings = await ToySettings.create({});
  }
  return settings.name;
}

// Returns { matched: boolean, answer: string }
async function matchCommonAnswer(transcriptText) {
  const normalized = normalize(transcriptText);
  const name = await getToyName();

  for (const entry of commonAnswers) {
    const isMatch = entry.patterns.some((pattern) => normalized.includes(pattern));
    if (isMatch) {
      return { matched: true, answer: entry.answer.replace("{name}", name) };
    }
  }

  const aiAnswer = await getAiAnswer(transcriptText, name);
  return { matched: false, answer: aiAnswer };
}

module.exports = { matchCommonAnswer, getToyName };