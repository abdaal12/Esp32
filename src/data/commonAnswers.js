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
  // ---- About the toy itself ----
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

  // ---- India ----
  {
    patterns: ["capital of india"],
    answer: "The capital of India is New Delhi.",
  },
  {
    patterns: ["prime minister of india"],
    answer: "Narendra Modi is the Prime Minister of India.",
  },
  {
    patterns: ["national animal of india"],
    answer: "The national animal of India is the Bengal tiger.",
  },
  {
    patterns: ["national bird of india"],
    answer: "The national bird of India is the peacock.",
  },
  {
    patterns: ["national flower of india"],
    answer: "The national flower of India is the lotus.",
  },
  {
    patterns: ["national sport of india"],
    answer: "Field hockey is widely considered India's national sport.",
  },
  {
    patterns: ["independence day of india", "when did india get independence"],
    answer: "India became independent on August 15th, 1947.",
  },
  {
    patterns: ["how many states in india", "number of states in india"],
    answer: "India has twenty-eight states and eight union territories.",
  },
  {
    patterns: ["longest river in india"],
    answer: "The Ganga is the longest river in India.",
  },
  {
    patterns: ["national language of india"],
    answer: "Hindi is one of India's official languages, alongside many others.",
  },

  // ---- World & Universe ----
  {
    patterns: ["how many planets"],
    answer: "There are eight planets in our solar system.",
  },
  {
    patterns: ["biggest planet"],
    answer: "Jupiter is the biggest planet in our solar system.",
  },
  {
    patterns: ["smallest planet"],
    answer: "Mercury is the smallest planet in our solar system.",
  },
  {
    patterns: ["closest planet to the sun"],
    answer: "Mercury is the closest planet to the sun.",
  },
  {
    patterns: ["how many continents"],
    answer: "There are seven continents on Earth.",
  },
  {
    patterns: ["biggest ocean", "largest ocean"],
    answer: "The Pacific Ocean is the biggest ocean in the world.",
  },
  {
    patterns: ["tallest mountain"],
    answer: "Mount Everest is the tallest mountain in the world.",
  },
  {
    patterns: ["why is the sky blue"],
    answer: "The sky looks blue because sunlight scatters more in that color when it passes through air.",
  },
  {
    patterns: ["what is the moon"],
    answer: "The moon is a big rock that orbits around the Earth in the sky.",
  },
  {
    patterns: ["how many days in a year"],
    answer: "There are three hundred sixty five days in a year.",
  },
  {
    patterns: ["how many months in a year"],
    answer: "There are twelve months in a year.",
  },
  {
    patterns: ["how many days in a week"],
    answer: "There are seven days in a week.",
  },

  // ---- Education: counting, alphabets, colors, shapes ----
  {
    patterns: ["count to ten", "count till ten"],
    answer: "One, two, three, four, five, six, seven, eight, nine, ten!",
  },
  {
    patterns: ["count to five", "count till five"],
    answer: "One, two, three, four, five!",
  },
  {
    patterns: ["say the alphabet", "abcd", "sing the alphabet"],
    answer: "A B C D E F G, H I J K L M N O P!",
  },
  {
    patterns: ["how many colors in a rainbow"],
    answer: "A rainbow has seven colors: red, orange, yellow, green, blue, indigo, and violet.",
  },
  {
    patterns: ["what shapes do you know", "name some shapes"],
    answer: "Some shapes are circle, square, triangle, and rectangle.",
  },
  {
    patterns: ["what is one plus one", "1 plus 1"],
    answer: "One plus one equals two.",
  },
  {
    patterns: ["what is two plus two", "2 plus 2"],
    answer: "Two plus two equals four.",
  },
  {
    patterns: ["what is two plus three", "2 plus 3"],
    answer: "Two plus three equals five.",
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