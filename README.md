# InterviewMatrix

A production-ready, AI-powered mock interview platform.

The AI plays the role of a senior interviewer, **speaks each question aloud**, listens to the candidate's spoken answer, then produces a **structured, scored review** at the end of the session.

* **Frontend:** React 19 + Vite + Tailwind v4 + React Router
* **Backend:** Node.js + Express + Mongoose
* **Database:** MongoDB Atlas
* **Auth:** JWT (Bearer tokens) + bcrypt password hashing
* **AI brain:** [Groq](https://groq.com) (Llama 3.3 70B) for questions, follow-ups, and the post-interview review
* **Voice (TTS):** [ElevenLabs](https://elevenlabs.io) — natural-sounding interviewer voice
* **Voice (STT):** Browser-native Web Speech API — zero extra cost / zero latency

---

## ✨ Features

* Email/password sign-up & sign-in (JWT, bcrypt)
* Configurable interviews — role, type (technical / system design / behavioral), duration, and difficulty
* AI interviewer that **asks one question at a time**, builds on prior answers, and adapts to the role/difficulty
* Each question is **read aloud** by ElevenLabs
* Each answer can be **spoken** (browser STT) or typed
* End-of-interview AI review with overall, clarity, confidence and technical sub-scores, key strengths, areas to improve, and per-question feedback
* Dashboard aggregates real history, average scores, and current streak
* Profile page — update name, target role, change password, sign out

---

## 🚀 Getting started

### 1. Prerequisites

* Node.js 20+
* MongoDB Atlas cluster ([free tier is fine](https://cloud.mongodb.com))
* Groq API key — https://console.groq.com/keys
* ElevenLabs API key — https://elevenlabs.io/app/settings/api-keys

### 2. Clone and install

```bash
git clone <this repo>
cd interview-matrix

cd backend  && npm install
cd ../frontend && npm install
```

### 3. Configure environment

```bash
# backend/.env  ← copy from backend/.env.example
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pwd>@<cluster>.mongodb.net/interview-matrix
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_xxx
GROQ_MODEL=llama-3.3-70b-versatile
ELEVENLABS_API_KEY=sk_xxx
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM      # Rachel (default)
ELEVENLABS_MODEL=eleven_turbo_v2_5
```

```bash
# frontend/.env  ← copy from frontend/.env.example
VITE_API_URL=http://localhost:5000/api
```

### 4. Run both services

```bash
# terminal 1
cd backend  && npm run dev
# → http://localhost:5000

# terminal 2
cd frontend && npm run dev
# → http://localhost:5173
```

Open `http://localhost:5173`, create an account, configure an interview, and go.

---

## 📡 API surface

All `/api/auth/me`, `/api/interviews/*`, `/api/profile/*` routes require a `Authorization: Bearer <jwt>` header.

| Method | Path                                     | Purpose |
|--------|------------------------------------------|---------|
| POST   | `/api/auth/signup`                       | Create account → returns `{ user, token }` |
| POST   | `/api/auth/signin`                       | Sign in → returns `{ user, token }` |
| GET    | `/api/auth/me`                           | Resolve current user from JWT |
| PUT    | `/api/auth/update-name`                  | Update display name |
| PUT    | `/api/auth/update-target-role`           | Update target role |
| PUT    | `/api/auth/change-password`              | Change password |
| GET    | `/api/profile/dashboard`                 | Aggregated stats + recent interviews |
| GET    | `/api/interviews`                        | List user's interviews |
| POST   | `/api/interviews`                        | Create new interview session |
| GET    | `/api/interviews/:id`                    | Fetch a single interview |
| POST   | `/api/interviews/:id/next-question`      | Ask Groq for the next question |
| POST   | `/api/interviews/:id/answer`             | Submit answer for the latest question |
| POST   | `/api/interviews/:id/complete`           | Finalize + generate AI review |
| POST   | `/api/interviews/tts`                    | Synthesize speech for arbitrary text (returns `audio/mpeg`) |

---

## 🧠 How the interview loop works

```
┌──────────────────────────────────────────────────────────────┐
│  StartInterview ─POST /api/interviews─►  Mongo (interview)   │
│        ▼                                                     │
│  /dashboard/session/:id                                      │
│        │                                                     │
│        │  GET interview                                      │
│        ├─ POST /next-question  ──► Groq  ──► save turn       │
│        ├─ POST /tts            ──► ElevenLabs ──► play MP3   │
│        ├─ user speaks (Web Speech API STT in the browser)    │
│        ├─ POST /answer         ──► save answer               │
│        └─ repeat until totalQuestions                        │
│        ▼                                                     │
│  POST /complete  ──► Groq (JSON review)  ──► save            │
│        ▼                                                     │
│  /review/:id    ◄── full transcript + AI scoring             │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Project layout

```
interview-matrix/
├── backend/
│   ├── server.js                # Express bootstrap, CORS, route mounts
│   ├── config/db.js             # Mongoose connection
│   ├── middleware/auth.js       # JWT verify + signToken helper
│   ├── models/
│   │   ├── User.js              # name, email, hashed password, targetRole
│   │   └── Interview.js         # role, type, duration, turns[], review{}
│   ├── routes/
│   │   ├── authRoutes.js        # signup / signin / me / updates
│   │   ├── interviewRoutes.js   # create / next-question / answer / complete / tts
│   │   └── profileRoutes.js     # dashboard aggregation
│   ├── services/
│   │   ├── groq.js              # interviewer prompts + JSON review
│   │   └── elevenlabs.js        # TTS HTTP wrapper
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── lib/api.js           # axios instance + auth interceptor
    │   ├── context/AuthContext.jsx  # user state, sign in/up/out, RequireAuth
    │   ├── components/          # auth, dashboard, landing, common
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Auth.jsx
    │       ├── Dashboard.jsx           # uses /api/profile/dashboard
    │       ├── StartInterview.jsx      # creates an interview
    │       ├── InterviewSession.jsx    # Groq + ElevenLabs + Web Speech
    │       ├── Review.jsx              # renders AI-generated JSON review
    │       └── Profile.jsx             # name, role, password, logout
    └── .env.example
```

---

## 🛡️ Security notes

* Passwords are bcrypt-hashed (cost 10) and excluded from queries by `select: false`.
* JWTs are signed with a server-only secret and expire (default 7 days). The token is sent as `Authorization: Bearer ...` on every request via axios interceptor.
* CORS is restricted to `CLIENT_ORIGIN`.
* Mongoose `strictQuery: true` to prevent unexpected query injection.
* The `/api/interviews/tts` endpoint is auth-gated, length-capped (2000 chars), and never echoes the user's input back as HTML.
* All AI/TTS keys live server-side only — they are never shipped to the browser.

---

## 🧪 Quick manual test plan

1. `npm run dev` both services.
2. Create an account at `/auth`. The dashboard loads with empty state.
3. Click **Start Interview**, pick `Frontend / Technical / 15 min / Mid`. The session opens, AI speaks Q1 within ~2s.
4. Click the mic, answer aloud, click **Submit Answer**. Q2 appears.
5. Repeat through all questions or click **End Session** early. The AI review screen renders with overall score, sub-scores, strengths, improvements, and per-question feedback.
6. Back on the dashboard, the interview now appears under "Recent Interviews", stats update.
7. Open Profile, update name + target role, log out. Confirm token is cleared from `localStorage`.

---

## 🛠 Troubleshooting

| Symptom | Likely cause |
|---|---|
| `[db] MONGODB_URI is not set` on startup | Missing `backend/.env` |
| `401 Session expired` after login | `JWT_SECRET` was rotated — sign in again |
| TTS request fails with 502 | Bad/missing `ELEVENLABS_API_KEY` or quota exceeded |
| `next-question` errors with 500 | Bad/missing `GROQ_API_KEY` or model name |
| Mic button shows "voice input requires Chrome…" | Browser without Web Speech API. Use Chrome / Edge / Safari, or just type the answer. |

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for a deeper technical walkthrough.
