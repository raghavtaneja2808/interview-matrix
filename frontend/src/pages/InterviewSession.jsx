import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const MicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="4" width="4" height="16" rx="1"/>
  </svg>
);
const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const SESSION = { role: "Senior Software Engineer", company: "Apple Inc.", totalQuestions: 10 };

const QUESTIONS = [
  {
    id: 1,
    text: '"Welcome, Alex. To start, could you walk me through your most complex design system project?"',
    answer: '"Certainly. At my previous role, I led the transition from a fragmented UI kit to a unified token-based system across three platforms..."',
    done: true,
  },
  {
    id: 2,
    text: '"How did you handle cross-functional friction during that migration?"',
    answer: '"I established weekly \'Office Hours\' and created a governance board that included key engineering leads to ensure buy-in..."',
    done: true,
  },
  {
    id: 3,
    text: '"Interesting. If you were asked to scale this system for a global audience with accessibility as the priority, what would be your first three steps?"',
    answer: null,
    done: false,
  },
];

const KEYWORDS = ["Design Systems", "Accessibility", "Stakeholders", "WCAG 2.1"];

const MetricBar = ({ value, max = 100, color }) => {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setW((value / max) * 100);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, max]);
  return (
    <div ref={ref} className="h-[5px] rounded-full bg-surface-muted overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  );
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

const InterviewSession = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [micActive, setMicActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(12 * 60 + 45);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  const currentQ = QUESTIONS.find((q) => !q.done);

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">

      {/* ══ LEFT SIDEBAR — 320px ══ */}
      <aside className="w-[320px] flex-shrink-0 bg-surface border-r border-border-light flex flex-col z-40">
        <div className="px-8 pt-6 pb-5 border-b border-border-light">
          <span className="font-black text-[15px] tracking-tight leading-none">
            <span className="text-accent">Interview</span><span className="text-ink">Matrix</span>
          </span>
        </div>

        <nav className="flex-1 px-5 pt-4 flex flex-col gap-0.5">
          {[
            { icon: <GridIcon />,     label: "Dashboard",     path: "/dashboard" },
            { icon: <HistoryIcon />,  label: "Past Sessions", path: "/dashboard/previous" },
            { icon: <BookIcon />,     label: "Question Bank", path: "/dashboard/library" },
            { icon: <BarChartIcon />, label: "Performance",   path: "/dashboard" },
          ].map(({ icon, label, path }) => {
            const active = label === "Dashboard";
            return (
              <button key={label} onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-all w-full text-left ${
                  active ? "bg-accent/10 text-accent" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                }`}>
                <span className={active ? "text-accent" : "text-ink-muted/60"}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-5 border-t border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-warm flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <p className="text-[13.5px] font-bold text-ink">Raghav G</p>
          </div>
        </div>
      </aside>

      {/* ══ CENTRE ══ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Session header */}
        <div className="flex-shrink-0 px-8 py-4 bg-surface border-b border-border-light flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-black tracking-[0.18em] uppercase text-ink-placeholder mb-0.5">Active Session</p>
            <h1 className="text-[19px] font-black text-ink tracking-tight">{SESSION.role} — {SESSION.company}</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-black tracking-widest uppercase text-green-600">Live Analysis</span>
          </div>
        </div>

        {/* Q&A scroll */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
          {QUESTIONS.map((q) => (
            <div key={q.id} className={q.done ? "opacity-55" : ""}>
              <p className={`text-[10.5px] font-black tracking-[0.18em] uppercase mb-3 ${q.done ? "text-ink-placeholder" : "text-accent"}`}>
                Question {q.id}
              </p>
              <p className={`font-black tracking-tight leading-tight mb-4 ${q.done ? "text-[17px] text-ink-secondary italic" : "text-[27px] text-ink"}`}>
                {q.text}
              </p>
              {q.answer && (
                <p className="text-[13.5px] text-ink-muted italic leading-relaxed pl-4 border-l-2 border-border">{q.answer}</p>
              )}
            </div>
          ))}

          {currentQ && (
            <div className="mt-2">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response or click the microphone to speak..."
                rows={4}
                className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-[14px] text-ink placeholder:text-ink-placeholder resize-none focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* ══ BOTTOM CONTROL BAR ══ */}
        <div className="flex-shrink-0 bg-surface border-t border-border-light px-8 py-3 flex items-center gap-4">
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-ink-placeholder leading-tight">Time</span>
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-ink-placeholder leading-tight">Elapsed</span>
            <span className="text-[18px] font-black text-ink tabular-nums mt-0.5">{fmt(elapsed)}</span>
          </div>

          <div className="w-px h-8 bg-border-light mx-1" />

          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-ink-placeholder leading-tight">Questions</span>
            <span className="text-[18px] font-black text-ink tabular-nums mt-0.5">
              {String(QUESTIONS.filter(q => q.done).length + 1).padStart(2, "0")} / {String(SESSION.totalQuestions).padStart(2, "0")}
            </span>
          </div>

          <div className="w-px h-8 bg-border-light mx-1" />

          <div className="flex-1 flex items-center justify-center gap-4">
            <button
              onClick={() => setPaused((p) => !p)}
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-ink-muted hover:border-accent hover:text-accent transition-all"
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ) : (
                <PauseIcon />
              )}
            </button>

            <button
              onClick={() => setMicActive((m) => !m)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                micActive ? "bg-accent hover:bg-accent-dark scale-105" : "bg-ink-muted hover:bg-ink-secondary"
              }`}
            >
              <MicIcon />
            </button>

            <button className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-ink-muted hover:border-red-400 hover:text-red-400 transition-all">
              <StopIcon />
            </button>
          </div>

          <div className="w-px h-8 bg-border-light mx-1" />

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">
            <SettingsIcon />
            Settings
          </button>

          {/* ✅ End Session → navigates to /review */}
          <button
            onClick={() => navigate("/review")}
            className="px-5 py-2.5 rounded-xl bg-ink text-white text-[13px] font-black tracking-wide hover:bg-ink-secondary transition-colors"
          >
            End<br />Session
          </button>
        </div>
      </div>

      {/* ══ RIGHT PANEL — 440px ══ */}
      <aside className="w-[440px] flex-shrink-0 bg-surface border-l border-border-light flex flex-col overflow-y-auto">
        <div className="px-9 pt-6 pb-4 border-b border-border-light">
          <h2 className="text-[20px] font-black text-ink">Session Insights</h2>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-ink-placeholder mt-1">Real-Time Performance</p>
        </div>

        <div className="flex-1 px-9 py-6 flex flex-col gap-6">

          <div className="bg-surface-muted rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder">Tone &amp; Confidence</span>
              <span className="text-[22px] font-black text-ink leading-none">85<span className="text-[13px] font-bold text-ink-muted">/100</span></span>
            </div>
            <MetricBar value={85} color="#e8621a" />
            <p className="text-[10.5px] font-bold tracking-widest uppercase text-ink-placeholder mt-2">
              Status: <span className="text-ink-secondary font-black">Strong &amp; Decisive</span>
            </p>
          </div>

          <div className="bg-surface-muted rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder">Technical Depth</span>
              <span className="text-[22px] font-black text-ink leading-none">72<span className="text-[13px] font-bold text-ink-muted">/100</span></span>
            </div>
            <MetricBar value={72} color="#e8621a" />
            <p className="text-[10.5px] font-bold tracking-widest uppercase text-ink-placeholder mt-2">
              Status: <span className="text-ink-secondary font-black">Solid Foundations</span>
            </p>
          </div>

          <div className="bg-surface-muted rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder">Pacing</span>
              <span className="text-[18px] font-black text-ink leading-none">Optimal</span>
            </div>
            <MetricBar value={80} color="#22c55e" />
            <p className="text-[10.5px] font-bold tracking-widest uppercase text-ink-placeholder mt-2">
              Speed: <span className="text-ink-secondary font-black">135 Words Per Min</span>
            </p>
          </div>

          <div className="border-t border-border-faint" />

          <div>
            <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-3">Keywords Detected</p>
            <div className="flex flex-wrap gap-2">
              {KEYWORDS.map((kw) => (
                <span key={kw} className="px-3 py-1.5 rounded-full text-[12px] font-semibold border border-border text-ink-secondary bg-surface-muted">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border-faint" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-accent">AI Waveform</p>
            </div>
            <div className="bg-surface-muted rounded-xl px-6 py-5 flex items-center justify-center">
              <Waveform active={micActive && !paused} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default InterviewSession;
