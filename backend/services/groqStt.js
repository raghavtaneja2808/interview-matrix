/**
 * Groq Whisper Large v3 Turbo — speech-to-text.
 * Free tier on console.groq.com; ~5× real-time, very accurate.
 *
 * Docs: https://console.groq.com/docs/speech-text
 */

async function transcribe(buffer, { mimeType = "audio/webm", filename = "audio.webm", language = "en" } = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mimeType }), filename);
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "json");
  if (language) form.append("language", language);
  form.append("temperature", "0");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Groq STT ${res.status}: ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.text || "").trim();
}

module.exports = { transcribe };
