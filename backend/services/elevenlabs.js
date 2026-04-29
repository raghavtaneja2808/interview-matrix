/**
 * ElevenLabs Text-to-Speech wrapper.
 * synthesizeStream() — streams MPEG audio directly (low latency).
 * synthesize()       — buffers full audio (kept as fallback).
 *
 * Docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 */

const VOICE_SETTINGS = {
  stability: 0.45,
  similarity_boost: 0.75,
  style: 0.25,
  use_speaker_boost: true,
};

/**
 * Returns the raw fetch Response so the caller can pipe res.body
 * directly to an HTTP response — no buffering, first bytes arrive
 * ~300-500 ms faster than the buffered approach.
 */
async function synthesizeStream(text, { voiceId, model } = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");

  const vid = voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  // eleven_flash_v2_5 is the fastest ElevenLabs model (~2× faster than turbo)
  const modelId = model || process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5";

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${vid}/stream?output_format=mp3_44100_128`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: VOICE_SETTINGS,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${errText.slice(0, 300)}`);
  }
  return res; // caller pipes res.body
}

/**
 * Buffered version — kept for any callers that still need a Buffer.
 */
async function synthesize(text, { voiceId, model } = {}) {
  const res = await synthesizeStream(text, { voiceId, model });
  return Buffer.from(await res.arrayBuffer());
}

module.exports = { synthesize, synthesizeStream };
