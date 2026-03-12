import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import TopBar from "../components/dashboard/TopBar";

/* ══════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════ */
const MonitorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const ServerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const CloudIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);
const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const CpuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);
const SettingsGearIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const UserGroupIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const ROLES = [
  { id: "frontend",    icon: <MonitorIcon />,  label: "Frontend Engineer",   sub: "UI, Frameworks, and Performance" },
  { id: "backend",     icon: <ServerIcon />,   label: "Backend Engineer",    sub: "API, Databases, and Systems" },
  { id: "fullstack",   icon: <LayersIcon />,   label: "Full Stack Engineer", sub: "End-to-end technical assessment" },
  { id: "devops",      icon: <CloudIcon />,    label: "DevOps Engineer",     sub: "CI/CD, Cloud, and Infrastructure" },
  { id: "datascience", icon: <TrendingIcon />, label: "Data Scientist",      sub: "Statistics and Modeling" },
  { id: "aiml",        icon: <CpuIcon />,      label: "AI/ML Engineer",      sub: "Neural Networks and LLMs" },
];

const TYPES = [
  { id: "technical",  label: "Technical Screen" },
  { id: "system",     label: "System Design" },
  { id: "behavioral", label: "Behavioral" },
];

const DURATIONS = [
  { id: "15", label: "15 min" },
  { id: "30", label: "30 min" },
  { id: "45", label: "45 min" },
  { id: "60", label: "60 min" },
];

const DIFFICULTIES = [
  { id: "junior", label: "Junior",    desc: "0 – 2 years", bars: 1 },
  { id: "mid",    label: "Mid-Level", desc: "2 – 5 years", bars: 2 },
  { id: "senior", label: "Senior+",   desc: "5+ years",    bars: 3 },
];

const DiffBars = ({ count, active }) => (
  <div className="flex items-end gap-[3px] h-5">
    {[1, 2, 3].map((n) => (
      <div key={n} className="w-[5px] rounded-sm transition-colors duration-200"
        style={{
          height: n === 1 ? 8 : n === 2 ? 13 : 20,
          backgroundColor: n <= count
            ? active ? "#e8621a" : "#cbd5e1"
            : active ? "#fcd5b8" : "#e9ecef",
        }}
      />
    ))}
  </div>
);

const StartInterview = () => {
  const navigate = useNavigate();

  const [selectedRole,       setSelectedRole]       = useState("frontend");
  const [selectedType,       setSelectedType]       = useState("technical");
  const [selectedDuration,   setSelectedDuration]   = useState("30");
  const [selectedDifficulty, setSelectedDifficulty] = useState("mid");

  const role       = ROLES.find((r) => r.id === selectedRole);
  const difficulty = DIFFICULTIES.find((d) => d.id === selectedDifficulty);

  return (
    <div className="min-h-screen bg-surface-muted">
      <Sidebar />
      <TopBar hideStartButton />

      <main className="ml-[280px] pt-[58px] min-h-screen flex flex-col">
        <div className="flex-1 px-8 py-8">
          <div className="mb-7">
            <h1 className="text-[26px] font-black text-ink tracking-tight leading-tight mb-1">Setup Your Interview</h1>
            <p className="text-[13.5px] text-ink-muted">Configure your session parameters for a realistic mock experience.</p>
          </div>

          <div className="grid grid-cols-[1fr_1.15fr] gap-6 items-start">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent"><UserGroupIcon /></span>
                <h2 className="text-[15px] font-bold text-ink">Select Your Role</h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {ROLES.map((r) => {
                  const active = selectedRole === r.id;
                  return (
                    <button key={r.id} onClick={() => setSelectedRole(r.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${active ? "border-accent bg-accent/5 shadow-sm" : "border-border bg-surface hover:border-accent/40 hover:bg-accent/[0.02]"}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-accent/15 text-accent" : "bg-surface-muted text-ink-muted"}`}>{r.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-semibold leading-tight ${active ? "text-accent" : "text-ink"}`}>{r.label}</p>
                        <p className="text-[12px] text-ink-muted mt-0.5 truncate">{r.sub}</p>
                      </div>
                      {active && <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><CheckIcon /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5">
              <div className="bg-surface rounded-2xl border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-accent"><SettingsGearIcon /></span>
                  <h2 className="text-[15px] font-bold text-ink">Interview Configuration</h2>
                </div>
                <div className="mb-6">
                  <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-3">Interview Type</p>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => {
                      const active = selectedType === t.id;
                      return <button key={t.id} onClick={() => setSelectedType(t.id)} className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-150 ${active ? "bg-accent text-white shadow-sm" : "bg-surface-muted text-ink-muted hover:bg-accent/10 hover:text-accent border border-border"}`}>{t.label}</button>;
                    })}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-3">Duration</p>
                  <div className="flex gap-2">
                    {DURATIONS.map((d) => {
                      const active = selectedDuration === d.id;
                      return <button key={d.id} onClick={() => setSelectedDuration(d.id)} className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-150 ${active ? "bg-accent text-white shadow-sm" : "bg-surface-muted text-ink-muted hover:bg-accent/10 hover:text-accent border border-border"}`}>{d.label}</button>;
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-[10.5px] font-black tracking-[0.14em] uppercase text-ink-placeholder mb-3">Difficulty Level</p>
                  <div className="grid grid-cols-3 gap-3">
                    {DIFFICULTIES.map((d) => {
                      const active = selectedDifficulty === d.id;
                      return (
                        <button key={d.id} onClick={() => setSelectedDifficulty(d.id)} className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-150 ${active ? "border-accent bg-accent/5" : "border-border bg-surface-muted hover:border-accent/40"}`}>
                          <DiffBars count={d.bars} active={active} />
                          <p className={`text-[13px] font-bold leading-tight ${active ? "text-accent" : "text-ink"}`}>{d.label}</p>
                          <p className="text-[11px] text-ink-muted">{d.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Ready to begin */}
              <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center flex-shrink-0 shadow-md"><PlayIcon /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-black text-ink mb-1.5">Ready to begin?</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-[12px] text-ink-muted font-medium"><UserGroupIcon /><span className="text-ink-secondary font-semibold">{role?.label}</span></span>
                    <span className="flex items-center gap-1.5 text-[12px] text-ink-muted font-medium"><ClockIcon /><span className="text-ink-secondary font-semibold">{selectedDuration} Minutes</span></span>
                    <span className="flex items-center gap-1.5 text-[12px] text-ink-muted font-medium"><ZapIcon /><span className="text-ink-secondary font-semibold">{difficulty?.label}</span></span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/dashboard/session")}
                  className="flex-shrink-0 h-12 px-7 rounded-xl bg-accent hover:bg-accent-dark text-white text-[14px] font-black tracking-wide transition-colors duration-200 shadow-sm"
                >
                  Start<br />Interview
                </button>
              </div>

              <div className="flex items-start gap-2.5 px-1">
                <span className="flex-shrink-0 mt-0.5"><InfoIcon /></span>
                <p className="text-[12px] text-ink-muted italic leading-relaxed">"Make sure your microphone and camera are working. We'll provide real-time feedback on your communication style and technical accuracy."</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-border-light px-8 py-4 flex items-center justify-between">
          <p className="text-[12px] text-ink-placeholder">© 2024 InterviewMatrix AI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[12px] text-ink-placeholder hover:text-ink-muted transition-colors">Privacy Policy</a>
            <a href="#" className="text-[12px] text-ink-placeholder hover:text-ink-muted transition-colors">Terms of Service</a>
            <a href="#" className="text-[12px] text-ink-placeholder hover:text-ink-muted transition-colors">Help Center</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default StartInterview;
