# InterviewMatrix — Architecture & Tech Stack

This document explains every moving part of the system: what each piece does, why it was chosen, and how the pieces interact at runtime.

---

## 1. High-level architecture

```
                      ┌─────────────────────────┐
                      │   Browser (React SPA)   │
                      │  ───────────────────    │
                      │  • Auth context (JWT)   │
                      │  • Axios API client     │
                      │  • Web Speech API (STT) │
                      │  • <audio> for TTS      │
                      └────────────┬────────────┘
                                   │  HTTPS / JSON
                                   │  Authorization: Bearer <jwt>
                                   ▼
                      ┌─────────────────────────┐
                      │   Express API server    │
                      │  ───────────────────    │
                      │  • CORS, JSON parser    │
                      │  • requireAuth middleware
                      │  • Routes: auth /       │
                      │    interviews / profile │
                      └────┬────────┬───────┬───┘
                           │        │       │
              MongoDB Atlas│ Groq   │       │ElevenLabs
              (Mongoose)   │ API    │       │ TTS API
                           ▼        ▼       ▼
               ┌─────────────┐ ┌────────┐ ┌───────────┐
               │ Users       │ │ Llama  │ │ MP3 audio │
               │ Interviews  │ │ 3.3 70B│ │ stream    │
               └─────────────┘ └────────┘ └───────────┘
```

The browser is a single-page app served by Vite. All persistence and AI work happens server-side; the browser only carries the JWT, plays audio, and runs the (free, browser-built-in) speech recognizer.

---

## 2. The technology choices, explained

### 2.1 React 19 + Vite + Tailwind v4
- **React 19** for the UI — modern hooks API, automatic batching, compatible with React Router v6.
- **Vite** because it is the fastest dev server for React; HMR is sub-second and the production build emits a single ~150 kB gzipped JS bundle.
- **Tailwind v4** for styling, with custom design tokens (`accent`, `ink`, `surface-*`, `border-*`) defined in `index.css`. Utility-first means we don't ship a separate CSS framework; the build only bakes in classes we actually use.
- **react-router-dom v6** for client-side routing. `RequireAuth` is a wrapper component that redirects to `/auth` if the user is missing.

### 2.2 Express 4 + Node 20
- **Express 4** is a minimal, mature HTTP server. The whole API has ~10 routes; we don't need NestJS or Fastify ceremony.
- A single `server.js` wires up CORS, `express.json()`, the three route files, and a final error handler.

### 2.3 MongoDB Atlas + Mongoose
- **MongoDB Atlas** — managed MongoDB. Free tier covers this app's scale.
- **Mongoose** for schemas, validation, and per-document methods. Two collections only:
  - `users` — `{ name, email (unique, lowercased), password (bcrypt, hidden), targetRole, timestamps }`. The `toPublic()` instance method returns a safe shape (no password hash).
  - `interviews` — `{ userId, role, type, duration, difficulty, totalQuestions, turns[], status, review, completedAt, timestamps }`. `turns[]` is an embedded array (`{ index, question, answer, askedAt, answeredAt }`); the AI review is also embedded so a single read returns the entire history.
- Embedding vs referencing: turns and review are embedded because they are always read with the parent and never independently. This avoids a join.

### 2.4 JWT + bcrypt
- **bcryptjs** with cost 10 hashes passwords. We use the pure-JS package so it works on every Node platform without native build tools.
- **jsonwebtoken** issues HS256 tokens signed with `JWT_SECRET`. The token's payload is `{ sub: <userId> }` and it expires after `JWT_EXPIRES_IN` (default 7 days).
- The `requireAuth` middleware:
  1. Reads `Authorization: Bearer …` and rejects 401 if missing.
  2. `jwt.verify` decodes & verifies signature/expiry.
  3. Loads the `User` doc by `payload.sub`, attaches it to `req.user`, and calls `next()`.
- The frontend axios interceptor automatically attaches the token from `localStorage` to every request, and on a 401 clears `localStorage` and bounces the user to `/auth`.

### 2.5 Groq (Llama 3.3 70B)
- **Why Groq?** Groq's LPU inference returns Llama 3.3 70B tokens at ~250 tok/s. The interviewer feels real because the next question arrives in under 2 seconds.
- We use it for two distinct prompts:
  1. **`generateNextQuestion(interview)`** — a chat completion seeded with a system prompt that defines the interviewer persona (role, type, difficulty), then replays prior turns as alternating `assistant` / `user` messages so the model can ask context-aware follow-ups.
  2. **`generateReview(interview)`** — a `response_format: { type: "json_object" }` call that grades the full transcript and returns a strict JSON shape (`overall`, sub-scores, summary, strengths, improvements, keywords, perTurn). We `JSON.parse` the response; if parsing fails we fall back to a zeroed review so the UI never crashes.
- Temperature is tuned per call (0.7 for question generation, 0.3 for the review).
- The Groq SDK key never leaves the server.

### 2.6 ElevenLabs (TTS)
- The `/api/interviews/tts` endpoint POSTs `{ text, model_id, voice_settings }` to `api.elevenlabs.io/v1/text-to-speech/<voiceId>` with `output_format=mp3_44100_128`.
- The MP3 bytes are buffered server-side and returned to the browser as `audio/mpeg`. The browser drops them into a hidden `<audio>` element via an Object URL.
- Default voice is **Rachel** (`21m00Tcm4TlvDq8ikWAM`); change via `ELEVENLABS_VOICE_ID`.
- Default model is `eleven_turbo_v2_5` — best latency/quality trade-off as of writing.
- Length-capped (2000 chars) to defend against runaway costs from a malicious or buggy client.

### 2.7 Speech-to-Text — browser-native
We deliberately **don't** use Whisper or any paid STT. The Web Speech API (`SpeechRecognition`) ships free in Chrome, Edge, and Safari, runs in the browser, and gives interim results we can stream into the textarea live. Users on browsers without it can type their answer — the textarea always works as a fallback.

### 2.8 Axios + Auth Context
`src/lib/api.js` exposes a singleton axios instance with:
- `baseURL = import.meta.env.VITE_API_URL`
- a request interceptor that adds `Authorization: Bearer <token>`
- a response interceptor that on 401 clears the session and redirects to `/auth`

`src/context/AuthContext.jsx` exposes `useAuth()` with `{ user, loading, signIn, signUp, signOut, updateUser }`. It hydrates from `localStorage`, then calls `/auth/me` on mount to verify the token is still valid. `RequireAuth` is a tiny route guard that uses this context.

---

## 3. End-to-end request flows

### 3.1 Sign-up
1. UI: `POST /api/auth/signup { name, email, password }`
2. Server: validates inputs, checks for duplicate email, bcrypt-hashes the password, creates the `User`, signs a JWT, returns `{ user, token }`.
3. UI: `AuthContext` writes both into `localStorage`; subsequent requests carry the token automatically.

### 3.2 Starting an interview
1. UI (`StartInterview`): `POST /api/interviews { role, type, duration, difficulty }`
2. Server: validates against allow-lists, computes `totalQuestions` from duration (15→4, 30→6, 45→8, 60→10), creates the `Interview` document with `status: "in_progress"`.
3. UI: navigates to `/dashboard/session/:id`.

### 3.3 The interview loop
For each question:
1. **`POST /api/interviews/:id/next-question`** — server replays the conversation (prior turns) into Groq's chat completion API, gets back a single question, pushes a new turn `{ index, question, askedAt }` and saves.
2. **`POST /api/interviews/tts { text }`** — server calls ElevenLabs, streams MP3 bytes back. Browser plays them.
3. The user speaks; `webkitSpeechRecognition` writes an interim transcript into the textarea, then a final transcript when they stop.
4. **`POST /api/interviews/:id/answer { answer }`** — server stores the answer onto the latest turn.
5. Repeat until `turns.length === totalQuestions` or the user clicks **End Session**.

### 3.4 Completion + review
`POST /api/interviews/:id/complete`:
1. If no turns were captured, mark the interview `abandoned` and return.
2. Otherwise call Groq with the full transcript, requesting a strict JSON review.
3. Persist `review`, set `status: "completed"`, set `completedAt`, return the document.
4. UI navigates to `/review/:id` and renders all sections from the saved JSON.

### 3.5 Dashboard aggregation
`GET /api/profile/dashboard`:
- Pulls all completed interviews for the user.
- Computes `avgScore`, `avgClarity`, `avgConfidence`, `avgTechnical`.
- Computes `currentStreak` by walking back from today through unique completion-date days.
- Returns the 5 most recent interviews with display-friendly fields (label, score, color, date) so the React component is purely presentational.

---

## 4. Data model

### `User`
```js
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercased),
  password: String (bcrypt; select: false),
  targetRole: String,
  createdAt, updatedAt
}
```

### `Interview`
```js
{
  _id: ObjectId,
  userId: ObjectId(ref: "User", indexed),
  role: "frontend"|"backend"|"fullstack"|"devops"|"datascience"|"aiml",
  type: "technical"|"system"|"behavioral",
  duration: 15|30|45|60,
  difficulty: "junior"|"mid"|"senior",
  totalQuestions: Number,
  turns: [
    { index, question, answer, askedAt, answeredAt }
  ],
  status: "in_progress"|"completed"|"abandoned",
  review: {
    overall, clarity, confidence, technical,
    summary,
    strengths: [{ title, note }],
    improvements: [{ title, note, tip }],
    keywords: [String],
    perTurn: [{ index, tone: "strong"|"feedback", feedback }]
  },
  completedAt,
  createdAt, updatedAt
}
```

---

## 5. Security model

| Concern | Mitigation |
|---|---|
| Password storage | bcrypt cost 10, `select: false`, never returned by `toPublic()` |
| Session hijacking | JWT signed server-side, HS256, expires; sent only over HTTPS in production |
| Cross-origin requests | CORS restricted to `CLIENT_ORIGIN` |
| Vendor key leak | Groq + ElevenLabs keys live only in `backend/.env`; the browser never sees them |
| Cost runaway via TTS | `text` length capped server-side, route is auth-gated |
| Replay / IDOR | Every interview route filters by `userId: req.user._id` |
| Injection into AI | Groq prompts are JSON-templated; we never concatenate untrusted text into the system prompt — only into the user/assistant turn history that the model is meant to read |

---

## 6. Extending the system

* **Persistent transcripts as audio:** record `MediaRecorder` blobs in the browser, upload to S3, store the URL on each turn. Hand them to Whisper for canonical transcripts and to a future "review your delivery" feature.
* **Live coaching during the interview:** add an `/api/interviews/:id/live-feedback` route that streams Groq tokens via SSE while the user types. The right-hand insights panel is already wired to render those metrics.
* **Multiple voices:** expose `voiceId` on the `User` and have `/tts` honor it.
* **Refresh tokens:** swap the single 7-day JWT for a short access token + rotated refresh token if you need real session revocation.
* **Rate limits:** drop in `express-rate-limit` on `/auth/*` and `/interviews/tts` before going to production.
* **Observability:** Pino logs + a `/healthz` route already exists at `/api/health`; pipe to your observability stack.

---

## 7. Why this stack

We chose every piece for a single sentence's worth of reasoning:

* **Groq:** sub-2s questions make the conversation feel real.
* **ElevenLabs:** the only TTS that doesn't sound like a robot at this price point.
* **Web Speech API:** the cheapest STT is the one you don't pay for.
* **MongoDB:** an interview is a tree (turns, review nested inside) — embed it and read it back in one query.
* **JWT:** stateless, no Redis needed, easy to verify on every request.
* **Vite + Tailwind:** fast dev loop, tiny prod bundle, no design-system overhead.
