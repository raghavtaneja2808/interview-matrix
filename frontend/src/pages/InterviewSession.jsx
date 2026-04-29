import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { apiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* Sidebar icons */
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.41"/>
  </svg>
);

/* Control icons */
const MicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

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

const Waveform = ({ active }) => {
  const bars = [3, 7, 5, 10, 6, 8, 4, 9, 5, 7, 3, 8, 6, 10, 4, 7, 5, 9, 3, 6, 4, 8, 5, 10];
  return (
    <div className="flex items-center gap-[4px] h-12 w-full justify-center">
      {bars.map((h, i) => (
        <div key={i} className="w-[5px] rounded-full" style={{
          height: `${h * 4}px`, backgroundColor: "#e8621a",
          opacity: active ? 1 : 0.3,
          animation: active ? `wfpulse ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate` : "none",
          animationDelay: `${i * 0.05}s`,
        }} />
      ))}
      <style>{`@keyframes wfpulse { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
};

// Browser SpeechRecognition (Chrome/Edge/Safari) for live preview only.
const BrowserSpeech =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const InterviewSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // SpeechRecognition refs — single source of truth for both live preview and submission text.
  const recognitionRef = useRef(null);
  const finalTextRef = useRef("");
  const interimTextRef = useRef("");
  const stopRequestedRef = useRef(false);

  // Guard so we don't double-submit
  const submitLockRef = useRef(false);
  // Always call the latest version of submit/ask, regardless of closure capture
  const submitRef = useRef(null);
  const askNextRef = useRef(null);

  // Timer
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── ElevenLabs TTS playback ──────────────────────────────────────
  const speakQuestion = useCallback(async (text) => {
    setAiSpeaking(true);
    try {
      const res = await api.post("/interviews/tts", { text }, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => {
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audioRef.current.play().catch(() => setAiSpeaking(false));
      } else {
        setAiSpeaking(false);
      }
    } catch {
      setAiSpeaking(false);
    }
  }, []);

  // ── Initial load ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        if (cancelled) return;
        setInterview(data.interview);
        if (data.interview.status !== "in_progress") {
          navigate(`/review/${id}`, { replace: true });
          return;
        }
        if (data.interview.turns.length === 0) {
          await askNext();
        } else {
          const last = data.interview.turns[data.interview.turns.length - 1];
          if (last && !last.answer) speakQuestion(last.question);
        }
      } catch (err) {
        setError(apiError(err, "Could not load interview."));
      } finally {
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Reset textarea every time a new (unanswered) turn appears ───
  useEffect(() => {
    const turns = interview?.turns || [];
    const last = turns[turns.length - 1];
    if (last && !last.answer) {
      setResponse("");
    }
  }, [interview?.turns?.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [interview?.turns?.length]);

  // ── Ask Groq for the next question ───────────────────────────────
  const askNext = async () => {
    setThinking(true);
    setError("");
    try {
      const { data } = await api.post(`/interviews/${id}/next-question`);
      setInterview(data.interview);
      setResponse("");
      speakQuestion(data.question);
    } catch (err) {
      setError(apiError(err, "Could not get next question."));
    } finally {
      setThinking(false);
    }
  };
  askNextRef.current = askNext;

  // ── Answer submission (used by both auto-submit and manual click) ─
  const submitAnswer = async (textOverride) => {
    if (submitLockRef.current) {
      console.warn("[submit] already in flight, skipping duplicate call");
      return;
    }
    const text = (textOverride ?? response).trim();
    if (!text) {
      setError("Please record or type your answer first.");
      return;
    }
    console.log("[submit] →", text.slice(0, 80));
    submitLockRef.current = true;
    setSubmittingAnswer(true);
    setError("");
    try {
      const { data } = await api.post(`/interviews/${id}/answer`, { answer: text });
      console.log("[submit] saved");
      setInterview(data.interview);
      setResponse("");

      const remaining = data.interview.totalQuestions - data.interview.turns.length;
      if (remaining <= 0) {
        await endSession();
      } else {
        await askNextRef.current?.();
      }
    } catch (err) {
      console.error("[submit] failed:", err);
      setError(apiError(err, "Could not save answer."));
    } finally {
      setSubmittingAnswer(false);
      submitLockRef.current = false;
    }
  };
  submitRef.current = submitAnswer;

  // ── Recording (Web Speech API only — live preview + submission text) ─
  const startRecording = async () => {
    setError("");

    if (!BrowserSpeech) {
      setError("Live voice typing requires Chrome, Edge, or Safari. You can still type your answer.");
      return;
    }

    // Clear state for the new answer.
    finalTextRef.current = "";
    interimTextRef.current = "";
    stopRequestedRef.current = false;
    setResponse("");

    const r = new BrowserSpeech();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    r.onstart = () => {
      console.log("[stt] started");
      setRecording(true);
    };

    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTextRef.current += (finalTextRef.current ? " " : "") + t.trim();
        } else {
          interim += t;
        }
      }
      interimTextRef.current = interim;
      const merged =
        finalTextRef.current + (interim ? (finalTextRef.current ? " " : "") + interim : "");
      setResponse(merged);
    };

    r.onerror = (ev) => {
      console.error("[stt] error:", ev?.error);
      if (ev?.error === "not-allowed" || ev?.error === "service-not-allowed") {
        setError("Microphone permission denied. Click the lock icon in the URL bar → allow Microphone, then retry.");
        stopRequestedRef.current = true;
      } else if (ev?.error === "audio-capture") {
        setError("No microphone detected. Plug one in and retry.");
        stopRequestedRef.current = true;
      } else if (ev?.error === "network") {
        setError("Speech recognition needs internet — check your connection.");
      }
      // 'no-speech' and 'aborted' are benign; onend will handle restart/finalize.
    };

    r.onend = async () => {
      console.log("[stt] ended (stopRequested:", stopRequestedRef.current, ")");

      // Chrome auto-stops after ~60s of silence. If the user didn't ask to stop,
      // restart so continuous recording feels truly continuous.
      if (!stopRequestedRef.current) {
        try {
          r.start();
          console.log("[stt] auto-restarted");
          return;
        } catch (err) {
          console.warn("[stt] restart failed:", err);
        }
      }

      setRecording(false);
      recognitionRef.current = null;

      // Combine accumulated final + any leftover interim text.
      const text = (
        finalTextRef.current +
        (interimTextRef.current ? " " + interimTextRef.current : "")
      ).trim();

      if (!text) {
        setError("No speech detected. Tap the mic and try again.");
        return;
      }

      setResponse(text);
      console.log("[stt] auto-submitting:", text.slice(0, 80));
      await submitRef.current?.(text);
    };

    try {
      r.start();
      recognitionRef.current = r;
    } catch (err) {
      console.error("[stt] start failed:", err);
      setError("Could not start microphone: " + (err?.message || err?.name || "unknown error"));
    }
  };

  const stopRecording = () => {
    stopRequestedRef.current = true;
    const r = recognitionRef.current;
    if (r) {
      try { r.stop(); } catch { /* noop */ }
    } else {
      setRecording(false);
    }
  };

  const toggleMic = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRequestedRef.current = true;
      try { recognitionRef.current?.stop(); } catch { /* noop */ }
    };
  }, []);

  // ── End session ──────────────────────────────────────────────────
  const endSession = async () => {
    setCompleting(true);
    try {
      const text = response.trim();
      if (text && interview?.turns?.length) {
        const last = interview.turns[interview.turns.length - 1];
        if (last && !last.answer) {
          try { await api.post(`/interviews/${id}/answer`, { answer: text }); } catch {}
        }
      }
      await api.post(`/interviews/${id}/complete`);
      navigate(`/review/${id}`);
    } catch (err) {
      setError(apiError(err, "Could not end session."));
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#e5e5e5] border-t-[#e8621a] rounded-full animate-spin" />
          <p className="text-sm text-ink-muted">Preparing your interview…</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-muted">
        <p className="text-sm text-red-600">{error || "Interview not found."}</p>
      </div>
    );
  }

  const sessionTitle = `${ROLE_LABELS[interview.role] || interview.role} — ${TYPE_LABELS[interview.type] || interview.type}`;
  const turns = interview.turns;
  const currentIdx = turns.length - 1;
  const remaining = interview.totalQuestions - turns.length;
  const interviewerStatus =
    aiSpeaking ? "Speaking…" :
    thinking ? "Thinking…" :
    submittingAnswer ? "Saving…" :
    recording ? "Listening" :
    "Waiting";

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">
      <audio ref={audioRef} hidden />

      <aside className="w-[320px] flex-shrink-0 bg-surface border-r border-border-light flex flex-col z-40">
        <div className="px-8 pt-6 pb-5 border-b border-border-light">
          <span className="font-black text-[15px] tracking-tight leading-none">
            <span className="text-accent">Interview</span><span className="text-ink">Matrix</span>
          </span>
        </div>
        <nav className="flex-1 px-5 pt-4 flex flex-col gap-0.5">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-all w-full text-left text-ink-muted hover:bg-surface-muted hover:text-ink">
            <span className="text-ink-muted/60"><GridIcon /></span>Dashboard
          </button>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-all w-full text-left text-ink-muted hover:bg-surface-muted hover:text-ink">
            <span className="text-ink-muted/60"><HistoryIcon /></span>Past Sessions
          </button>
        </nav>
        <div className="px-6 py-5 border-t border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-warm flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <p className="text-[13.5px] font-bold text-ink">{user?.name?.split(" ")[0]}</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-shrink-0 px-8 py-4 bg-surface border-b border-border-light flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-black tracking-[0.18em] uppercase text-ink-placeholder mb-0.5">Active Session</p>
            <h1 className="text-[19px] font-black text-ink tracking-tight">{sessionTitle}</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-black tracking-widest uppercase text-red-600">Live</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
          {turns.map((q, i) => {
            const isActive = i === currentIdx && !q.answer;
            return (
              <div key={i} className={!isActive && q.answer ? "opacity-60" : ""}>
                <p className={`text-[10.5px] font-black tracking-[0.18em] uppercase mb-3 ${isActive ? "text-accent" : "text-ink-placeholder"}`}>
                  Question {i + 1}
                </p>
                <p className={`font-black tracking-tight leading-tight mb-4 ${isActive ? "text-[24px] text-ink" : "text-[16px] text-ink-secondary italic"}`}>
                  {q.question}
                </p>
                {q.answer && (
                  <p className="text-[13.5px] text-ink-muted italic leading-relaxed pl-4 border-l-2 border-border whitespace-pre-wrap">
                    {q.answer}
                  </p>
                )}
              </div>
            );
          })}

          {turns.length > 0 && !turns[currentIdx]?.answer && (
            <div className="mt-2">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={
                  recording
                    ? "Listening… words will appear as you speak. Click the mic to stop & submit."
                    : aiSpeaking
                    ? "AI is asking the question…"
                    : "Click the mic to speak (auto-submits), or type and click Submit."
                }
                readOnly={recording || submittingAnswer}
                rows={5}
                className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-[14px] text-ink placeholder:text-ink-placeholder resize-none focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all leading-relaxed read-only:bg-surface-muted/40"
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[11px] text-ink-placeholder">
                  {recording
                    ? "Live transcription on. Click the mic again to stop and auto-submit."
                    : submittingAnswer
                    ? "Submitting…"
                    : "Voice answers auto-submit. Typed answers use the Submit button."}
                </p>
                <button
                  onClick={() => submitAnswer()}
                  disabled={submittingAnswer || thinking || aiSpeaking || recording}
                  className="h-10 px-5 rounded-lg bg-ink hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingAnswer ? "Saving…" : remaining <= 1 ? "Submit & Finish" : "Submit Answer"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          {thinking && (
            <p className="text-sm text-ink-muted italic">AI is preparing the next question…</p>
          )}
        </div>

        <div className="flex-shrink-0 bg-surface border-t border-border-light px-8 py-3 flex items-center gap-4">
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-ink-placeholder leading-tight">Time</span>
            <span className="text-[18px] font-black text-ink tabular-nums mt-0.5">{fmt(elapsed)}</span>
          </div>
          <div className="w-px h-8 bg-border-light mx-1" />
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-ink-placeholder leading-tight">Questions</span>
            <span className="text-[18px] font-black text-ink tabular-nums mt-0.5">
              {String(turns.length).padStart(2, "0")} / {String(interview.totalQuestions).padStart(2, "0")}
            </span>
          </div>
          <div className="w-px h-8 bg-border-light mx-1" />

          <div className="flex-1 flex items-center justify-center gap-4">
            {turns[currentIdx] && (
              <button
                onClick={() => speakQuestion(turns[currentIdx].question)}
                disabled={aiSpeaking || recording}
                title="Replay AI question"
                className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-ink-muted hover:border-accent hover:text-accent transition-all disabled:opacity-40"
              >
                <PlayIcon />
              </button>
            )}

            <button
              onClick={toggleMic}
              disabled={aiSpeaking || submittingAnswer || thinking}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 ${
                recording ? "bg-red-500 hover:bg-red-600 scale-105 animate-pulse" : "bg-accent hover:bg-accent-dark"
              }`}
              title={recording ? "Stop recording" : "Start recording"}
            >
              <MicIcon />
            </button>

            <button
              onClick={endSession}
              disabled={completing}
              title="End session"
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-ink-muted hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-40"
            >
              <StopIcon />
            </button>
          </div>

          <div className="w-px h-8 bg-border-light mx-1" />

          <button
            onClick={endSession}
            disabled={completing}
            className="px-5 py-2.5 rounded-xl bg-ink text-white text-[13px] font-black tracking-wide hover:bg-ink-secondary transition-colors disabled:opacity-50"
          >
            {completing ? "Generating Review…" : <>End<br />Session</>}
          </button>
        </div>
      </div>

      <aside className="w-[400px] flex-shrink-0 bg-surface border-l border-border-light flex flex-col overflow-y-auto">
        <div className="px-8 pt-6 pb-4 border-b border-border-light">
          <h2 className="text-[20px] font-black text-ink">Session Status</h2>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-ink-placeholder mt-1">Live</p>
        </div>
        <div className="flex-1 px-8 py-6 flex flex-col gap-6">
          <div className="bg-surface-muted rounded-xl p-5">
            <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-2">Interviewer</p>
            <p className="text-[14px] text-ink">{interviewerStatus}</p>
          </div>
          <div className="bg-surface-muted rounded-xl p-5">
            <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-2">Your Microphone</p>
            <p className="text-[14px] text-ink">{recording ? "Recording" : "Idle"}</p>
          </div>
          <div className="bg-surface-muted rounded-xl p-5">
            <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-2">Progress</p>
            <p className="text-[14px] text-ink">{turns.filter(t => t.answer).length} answered · {Math.max(remaining, 0)} left</p>
          </div>
          <div className="border-t border-border-faint" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full bg-accent ${aiSpeaking || recording ? "animate-pulse" : ""}`} />
              <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-accent">Voice Stream</p>
            </div>
            <div className="bg-surface-muted rounded-xl px-6 py-5 flex items-center justify-center">
              <Waveform active={aiSpeaking || recording} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default InterviewSession;
