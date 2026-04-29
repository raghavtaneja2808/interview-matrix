const express = require("express");
const Interview = require("../models/Interview");
const { requireAuth } = require("../middleware/auth");
const { generateNextQuestion, generateReview } = require("../services/groq");
const { Readable } = require("stream");
const { synthesize, synthesizeStream } = require("../services/elevenlabs");
const { transcribe } = require("../services/groqStt");

const router = express.Router();
router.use(requireAuth);

const ALLOWED_ROLES = ["frontend", "backend", "fullstack", "devops", "datascience", "aiml"];
const ALLOWED_TYPES = ["technical", "system", "behavioral"];
const ALLOWED_DIFF = ["junior", "mid", "senior"];

function questionsForDuration(min) {
  if (min <= 15) return 4;
  if (min <= 30) return 6;
  if (min <= 45) return 8;
  return 10;
}

// ── List user's interviews ──────────────────────────────────────────
router.get("/", async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ interviews });
});

// ── Create a new interview session ──────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { role, type, duration, difficulty } = req.body || {};
    if (!ALLOWED_ROLES.includes(role)) return res.status(400).json({ error: "Invalid role." });
    if (!ALLOWED_TYPES.includes(type)) return res.status(400).json({ error: "Invalid type." });
    if (!ALLOWED_DIFF.includes(difficulty)) return res.status(400).json({ error: "Invalid difficulty." });
    const dur = parseInt(duration, 10);
    if (![15, 30, 45, 60].includes(dur)) return res.status(400).json({ error: "Invalid duration." });

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      type,
      duration: dur,
      difficulty,
      totalQuestions: questionsForDuration(dur),
    });

    res.status(201).json({ interview });
  } catch (err) {
    console.error("[interview/create]", err);
    res.status(500).json({ error: "Could not create interview." });
  }
});

// ── Get one interview ───────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) return res.status(404).json({ error: "Interview not found." });
  res.json({ interview });
});

// ── Ask the next question (Groq) ────────────────────────────────────
router.post("/:id/next-question", async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ error: "Interview not found." });
    if (interview.status !== "in_progress") {
      return res.status(400).json({ error: "Interview is no longer active." });
    }
    if (interview.turns.length >= interview.totalQuestions) {
      return res.status(400).json({ error: "All questions asked. Complete the interview." });
    }

    const last = interview.turns[interview.turns.length - 1];
    if (last && !last.answer) {
      return res.status(400).json({ error: "Answer the previous question first." });
    }

    const question = await generateNextQuestion(interview);
    interview.turns.push({
      index: interview.turns.length + 1,
      question,
      askedAt: new Date(),
    });
    await interview.save();

    res.json({ interview, question });
  } catch (err) {
    console.error("[interview/next-question]", err);
    res.status(500).json({ error: "AI is unavailable right now. Please retry." });
  }
});

// ── Submit answer AND fetch next question in one round-trip ────────
// This is the fast path: saves answer + calls Groq + returns both
// in a single request instead of two sequential HTTP calls.
router.post("/:id/answer-and-next", async (req, res) => {
  try {
    const { answer } = req.body || {};
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ error: "Interview not found." });
    if (interview.status !== "in_progress") {
      return res.status(400).json({ error: "Interview is no longer active." });
    }
    const turn = interview.turns[interview.turns.length - 1];
    if (!turn) return res.status(400).json({ error: "No question to answer." });
    if (turn.answer) return res.status(400).json({ error: "This question has already been answered." });

    // 1. Save the answer.
    turn.answer = (answer || "").toString().trim();
    turn.answeredAt = new Date();
    await interview.save();

    // 2. Check if the interview is done.
    const remaining = interview.totalQuestions - interview.turns.length;
    if (remaining <= 0) {
      return res.json({ interview, question: null, done: true });
    }

    // 3. Generate next question (Groq) — happens server-side in the same request.
    const question = await generateNextQuestion(interview);
    interview.turns.push({
      index: interview.turns.length + 1,
      question,
      askedAt: new Date(),
    });
    await interview.save();

    res.json({ interview, question, done: false });
  } catch (err) {
    console.error("[interview/answer-and-next]", err);
    res.status(500).json({ error: "Could not process answer." });
  }
});

// ── Submit an answer ────────────────────────────────────────────────
router.post("/:id/answer", async (req, res) => {
  try {
    const { answer } = req.body || {};
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ error: "Interview not found." });
    if (interview.status !== "in_progress") {
      return res.status(400).json({ error: "Interview is no longer active." });
    }
    const turn = interview.turns[interview.turns.length - 1];
    if (!turn) return res.status(400).json({ error: "No question to answer." });
    if (turn.answer) return res.status(400).json({ error: "This question has already been answered." });

    turn.answer = (answer || "").toString().trim();
    turn.answeredAt = new Date();
    await interview.save();
    res.json({ interview });
  } catch (err) {
    console.error("[interview/answer]", err);
    res.status(500).json({ error: "Could not save answer." });
  }
});

// ── Complete the interview & generate review (Groq) ─────────────────
router.post("/:id/complete", async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ error: "Interview not found." });
    if (interview.status === "completed") {
      return res.json({ interview });
    }

    if (interview.turns.length === 0) {
      interview.status = "abandoned";
      interview.completedAt = new Date();
      await interview.save();
      return res.json({ interview });
    }

    const review = await generateReview(interview);
    interview.review = review;
    interview.status = "completed";
    interview.completedAt = new Date();
    await interview.save();
    res.json({ interview });
  } catch (err) {
    console.error("[interview/complete]", err);
    res.status(500).json({ error: "Could not finalize interview." });
  }
});

// ── Speech-to-Text (Groq Whisper) ───────────────────────────────────
router.post(
  "/stt",
  express.raw({ type: () => true, limit: "25mb" }),
  async (req, res) => {
    try {
      if (!req.body || !req.body.length) {
        return res.status(400).json({ error: "Empty audio body." });
      }
      const mime = (req.headers["content-type"] || "audio/webm").split(";")[0];
      const ext = mime.includes("ogg")
        ? "ogg"
        : mime.includes("mp4") || mime.includes("m4a")
        ? "m4a"
        : mime.includes("wav")
        ? "wav"
        : mime.includes("mpeg") || mime.includes("mp3")
        ? "mp3"
        : "webm";
      const text = await transcribe(req.body, { mimeType: mime, filename: `audio.${ext}` });
      res.json({ text });
    } catch (err) {
      console.error("[interview/stt]", err.message);
      res.status(502).json({ error: "Transcription failed." });
    }
  }
);

// ── Text-to-Speech (ElevenLabs) — streamed, no backend buffering ────
router.post("/tts", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: "text is required" });
    if (text.length > 2000) return res.status(400).json({ error: "text too long" });

    // synthesizeStream() calls the ElevenLabs /stream endpoint and returns the
    // raw fetch Response. We pipe its body straight to the client so the browser
    // receives audio chunks as they arrive — no waiting for the full file.
    const elevenRes = await synthesizeStream(text.trim());

    res.set("Content-Type", "audio/mpeg");
    res.set("Transfer-Encoding", "chunked");
    res.set("Cache-Control", "no-store");

    // Convert the WHATWG ReadableStream (from fetch) to a Node.js Readable
    // then pipe it into the Express response.
    const nodeStream = Readable.fromWeb(elevenRes.body);
    nodeStream.pipe(res);

    // If the client disconnects early, destroy the upstream stream.
    req.on("close", () => nodeStream.destroy());
  } catch (err) {
    console.error("[interview/tts]", err.message);
    if (!res.headersSent) res.status(502).json({ error: "Voice synthesis failed." });
  }
});

module.exports = router;
