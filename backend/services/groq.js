const Groq = require("groq-sdk");

let _client = null;
function client() {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set");
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
}

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function chat(messages, { temperature = 0.6, json = false, maxTokens = 1024 } = {}) {
  const completion = await client().chat.completions.create({
    model: MODEL,
    messages,
    temperature,
    max_tokens: maxTokens,
    ...(json ? { response_format: { type: "json_object" } } : {}),
  });
  return completion.choices?.[0]?.message?.content?.trim() || "";
}

const ROLE_LABELS = {
  frontend: "Frontend Engineer",
  backend: "Backend Engineer",
  fullstack: "Full Stack Engineer",
  devops: "DevOps Engineer",
  datascience: "Data Scientist",
  aiml: "AI/ML Engineer",
};
const TYPE_LABELS = {
  technical: "Technical Screen",
  system: "System Design",
  behavioral: "Behavioral",
};
const DIFF_LABELS = {
  junior: "Junior (0-2 years)",
  mid: "Mid-Level (2-5 years)",
  senior: "Senior+ (5+ years)",
};

function interviewerSystemPrompt(interview) {
  const role = ROLE_LABELS[interview.role] || interview.role;
  const type = TYPE_LABELS[interview.type] || interview.type;
  const diff = DIFF_LABELS[interview.difficulty] || interview.difficulty;
  return `You are an expert technical interviewer at a top-tier tech company conducting a ${type} interview for a ${diff} ${role} role.

Rules:
- Speak in first person, warm but professional, like a real interviewer.
- Ask ONE question at a time. Keep each question to 1-3 sentences.
- Build naturally on the candidate's previous answer with thoughtful follow-ups when appropriate.
- Do not give the candidate the answer, do not coach during the interview.
- Cover a realistic mix of conceptual, applied, and scenario-based questions for a ${type} interview.
- Never include preamble like "Sure" or "Great question". Output only the question text.`;
}

async function generateNextQuestion(interview) {
  const isFirst = interview.turns.length === 0;

  if (isFirst) {
    const sys = interviewerSystemPrompt(interview);
    const user = `Begin the interview now with your opening question. Keep it welcoming and concise.`;
    return chat(
      [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      { temperature: 0.7, maxTokens: 220 }
    );
  }

  const history = interview.turns.flatMap((t) => [
    { role: "assistant", content: t.question },
    { role: "user", content: t.answer || "(no answer)" },
  ]);

  const remaining = interview.totalQuestions - interview.turns.length;
  const closing =
    remaining <= 1
      ? "This is your final question. Make it a strong closing question that tests depth."
      : `You have ${remaining} questions left. Ask the next question now.`;

  return chat(
    [
      { role: "system", content: interviewerSystemPrompt(interview) },
      ...history,
      { role: "user", content: closing },
    ],
    { temperature: 0.7, maxTokens: 220 }
  );
}

async function generateReview(interview) {
  const role = ROLE_LABELS[interview.role] || interview.role;
  const type = TYPE_LABELS[interview.type] || interview.type;
  const diff = DIFF_LABELS[interview.difficulty] || interview.difficulty;

  const transcript = interview.turns
    .map(
      (t, i) =>
        `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer || "(no answer provided)"}`
    )
    .join("\n\n");

  const sys = `You are a senior interviewer giving structured, honest feedback on a completed mock interview. Output STRICT JSON only.`;
  const user = `Interview context:
- Role: ${role}
- Type: ${type}
- Difficulty: ${diff}

Transcript:
${transcript}

Return JSON with this exact shape:
{
  "overall": <number 0-10, one decimal>,
  "clarity": <number 0-10>,
  "confidence": <number 0-10>,
  "technical": <number 0-10>,
  "summary": "<2-4 sentences, addressed to the candidate>",
  "strengths": [{"title":"...", "note":"..."}, ...up to 3],
  "improvements": [{"title":"...", "note":"...", "tip":"..."}, ...up to 3],
  "keywords": ["...", "...", up to 8 short topical keywords detected],
  "perTurn": [{"index": 1, "tone": "strong"|"feedback", "feedback": "1-2 sentences"}]
}
Be specific, reference what the candidate actually said. If a turn was empty, mark it as "feedback" with a note about not answering.`;

  const raw = await chat(
    [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    { temperature: 0.3, json: true, maxTokens: 1500 }
  );

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return {
      overall: 0,
      clarity: 0,
      confidence: 0,
      technical: 0,
      summary: "We couldn't parse the AI review. Please retry.",
      strengths: [],
      improvements: [],
      keywords: [],
      perTurn: [],
    };
  }
}

module.exports = { chat, generateNextQuestion, generateReview };
