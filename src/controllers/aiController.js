/**
 * backend/src/controllers/aiController.js
 *
 * Calls Perplexity for questions that don't match the common-answers
 * list. A strict system instruction + a hard max_tokens cap keep
 * replies short and speech-friendly — no long explanations, no
 * markdown, no rambling — since whatever comes back gets spoken
 * aloud as-is.
 */

const PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions";

function buildSystemPrompt(toyName) {
  return `You are a friendly voice assistant toy for children, named ${toyName}.
Rules you must always follow:
- Answer in 1-2 short sentences only.
- Use simple, warm, conversational language a young child would understand.
- Never use markdown, bullet points, asterisks, or any formatting symbols.
- Never mention that you are an AI, a language model, or any company name.
- Never include citations, sources, or links.
- If a question is unclear, ask a short simple clarifying question instead of guessing.
- Keep answers age-appropriate and positive.`;
}

async function getAiAnswer(transcriptText, toyName) {
  try {
    const res = await fetch(PERPLEXITY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.PERPLEXITY_MODEL || "sonar",
        messages: [
          { role: "system", content: buildSystemPrompt(toyName) },
          { role: "user", content: transcriptText },
        ],
        max_tokens: 60, // hard cap: keeps the spoken answer short no matter what
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Perplexity API error:", res.status, errText);
      return "I'm having trouble thinking right now, try again in a moment.";
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || "I'm not sure how to answer that.";
  } catch (err) {
    console.error("Perplexity request failed:", err.message);
    return "I'm having trouble thinking right now, try again in a moment.";
  }
}

module.exports = { getAiAnswer };