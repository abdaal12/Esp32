/**
 * backend/src/data/commonAnswers.js
 *
 * Canned answers for frequently-asked questions, so the toy doesn't
 * need to call an AI API for things it can answer instantly and for
 * free. Each entry has a list of trigger phrases (matched as
 * substrings of the normalized transcript) and an answer, which can
 * reference {name} for the toy's current configured name.
 *
 * Add more entries here any time — no code changes needed elsewhere.
 */

const commonAnswers = [
  {
    patterns: ["what is your name", "what's your name", "your name"],
    answer: "My name is {name}.",
  },
  {
    patterns: ["who are you"],
    answer: "I'm {name}, your voice assistant toy.",
  },
  {
    patterns: ["hello", "hi there", "hey"],
    answer: "Hello! I'm {name}. How can I help?",
  },
  {
    patterns: ["how are you"],
    answer: "I'm doing great, thanks for asking!",
  },
  {
    patterns: ["what can you do"],
    answer: "I can listen to what you say and answer your questions.",
  },
  {
    patterns: ["who made you", "who created you", "who built you"],
    answer: "I was built as a voice toy project by my creator.",
  },
  {
    patterns: ["how old are you", "what is your age"],
    answer: "I'm still very new — just getting started!",
  },
  {
    patterns: ["thank you", "thanks"],
    answer: "You're welcome!",
  },
  {
    patterns: ["goodbye", "bye", "see you"],
    answer: "Goodbye! Talk soon.",
  },
];

// Used when no common-answer pattern matches, until the real AI API
// is wired in. Keeps the toy feeling responsive instead of silent.
const pendingReplies = [
  "Let me think about that for a moment.",
  "Hmm, give me a second to figure that out.",
  "That's a good question — let me get back to you on that.",
  "I'm still learning how to answer that one.",
  "Let me answer your question... just a moment.",
  "Working on it — hang tight.",
];



module.exports = { commonAnswers, pendingReplies };