/**
 * ElevenLabs Text-to-Speech wrapper.
 * Streams MPEG audio back to the client.
 *
 * Docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 */

async function synthesize(text, { voiceId, model } = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");

  const vid = voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const modelId = model || process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5";

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${vid}?output_format=mp3_44100_128`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.25,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${errText.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

module.exports = { synthesize };
