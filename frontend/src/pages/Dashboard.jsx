import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopBar from "../components/dashboard/TopBar";
import {
  defaultUser,
  stats,
  performance,
  focusAreas,
  recommendedPractice,
  recentInterviews,
} from "../data/dashboardData";

/* ═══════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════ */
const CheckCircleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" strokeWidth="1">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);
const CodeTagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const CompassIcon2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CodeChipIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const FireIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#e8621a">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const LightbulbIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

const STAT_ICONS     = { check: <CheckCircleIcon />, star: <StarIcon />, flame: <FlameIcon /> };
const PRACTICE_ICONS = { people: <PeopleIcon />, compass: <CompassIcon2 />, code: <CodeTagIcon /> };

/* ═══════════════════════════════════════════════════
   CIRCULAR GAUGE
═══════════════════════════════════════════════════ */
const CircleGauge = ({ value, max = 10, size = 140, stroke = 13 }) => {
  const [animated, setAnimated] = useState(0);
  const ref  = useRef(null);
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (animated / max);
  const gap  = circ - dash;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(value); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0eeeb" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8621a" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${dash} ${gap}`}
          style={{ transition: "stroke-dasharray 1s ease-out" }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[34px] font-black text-ink leading-none">{value}</span>
        <span className="text-[9px] font-bold tracking-widest uppercase text-ink-muted mt-0.5">OVERALL</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SKILL ROW
   Layout: [label — 110px fixed] [bar — 55% of row] [score — right]
   Bar thickness restored to 7px. Bar length constrained to 55% of row.
═══════════════════════════════════════════════════ */
const SkillRow = ({ label, value, max = 10 }) => {
  const [barWidth, setBarWidth] = useState(0);
  const ref = useRef(null);
  const pct      = (value / max) * 100;             // e.g. 85
  const barColor = pct >= 85 ? "#22c55e" : pct >= 70 ? "#e8621a" : "#f59e0b";

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBarWidth(pct); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div ref={ref} className="flex items-center gap-3">
      {/* Fixed-width label so bars always start at the same x */}
      <span className="text-[12.5px] font-medium text-ink shrink-0 w-[140px]">{label}</span>

      {/* Bar track — capped at 55% of the row, never full width */}
      <div className="h-[7px] rounded-full bg-surface-muted overflow-hidden" style={{ width: "55%" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${barWidth}%`, backgroundColor: barColor }}
        />
      </div>

      {/* Score — right-aligned, tabular so digits don't shift */}
      <span
        className="text-[12.5px] font-bold tabular-nums ml-auto shrink-0"
        style={{ color: barColor }}
      >
        {value}/10
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════ */
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-surface-muted">
      <Sidebar />
      <TopBar />

      <main className="ml-[280px] pt-[58px] min-h-screen flex flex-col">
        <div className="flex-1 px-7 py-7 w-full">

          {/* ── Welcome ── */}
          <div className="mb-6">
            <h1 className="text-[28px] font-black text-ink tracking-tight leading-tight mb-2">
              Welcome back, {defaultUser.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-[12.5px] text-ink-muted font-medium">
                <CodeChipIcon /> Target: {defaultUser.targetRole}
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="flex items-center gap-1.5 text-[12.5px] text-ink-muted font-medium">
                <CalendarIcon /> Last Interview: {defaultUser.lastInterview}
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="flex items-center gap-1.5 text-[12.5px] text-ink-muted font-medium">
                <FireIcon /> {defaultUser.level}
              </span>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {stats.map((s) => (
              <div key={s.id} className="bg-surface rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                  {STAT_ICONS[s.icon]}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-ink-placeholder mb-0.5">{s.label}</p>
                  <p className="text-[26px] font-black text-ink leading-none tracking-tight">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Performance + Focus — equal columns ── */}
          <div className="grid grid-cols-2 gap-4 mb-5">

            {/* Performance Evaluation */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-ink">Performance Evaluation</h2>
                <span className="flex items-center gap-1 text-[11px] text-green-500 font-semibold">
                  <TrendUpIcon /> Improving
                </span>
              </div>

              {/* Overall gauge */}
              <div className="flex flex-col items-center mb-6">
                <CircleGauge value={performance.overall} />
                <p className="text-[12px] font-semibold text-ink-muted mt-2.5">Interview Score</p>
              </div>

              {/* Skill rows with contained bar length */}
              <div className="flex flex-col gap-4 flex-1 justify-center">
                {performance.skills.map((s) => (
                  <SkillRow key={s.label} label={s.label.replace("\n", " ")} value={s.value} />
                ))}
              </div>

              {/* Score chips */}
              <div className="flex gap-2 mt-5 pt-4 border-t border-border-faint flex-wrap">
                {performance.skills.map((s) => {
                  const pct   = (s.value / 10) * 100;
                  const color = pct >= 85 ? "#22c55e" : pct >= 70 ? "#e8621a" : "#f59e0b";
                  const bg    = pct >= 85 ? "#f0fdf4" : pct >= 70 ? "#fff7ed" : "#fefce8";
                  return (
                    <span key={s.label} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ color, backgroundColor: bg }}>
                      {s.label.replace("\n", " ")} · {s.value}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
              <h2 className="text-[16px] font-bold text-ink mb-5">Focus Areas</h2>
              <div className="flex flex-col gap-5 flex-1">
                {focusAreas.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-lg hover:bg-surface-muted transition-colors">
                    <div className="w-6 h-6 rounded-full bg-accent/10 text-accent text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.id}
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-ink leading-tight">{item.title}</p>
                      <p className="text-[12.5px] text-ink-muted leading-snug mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border-faint">
                <div className="flex items-start gap-2.5 rounded-lg bg-accent/5 border border-accent/15 p-3.5">
                  <span className="flex-shrink-0 mt-0.5"><LightbulbIcon /></span>
                  <div>
                    <p className="text-[10.5px] font-black tracking-widest uppercase text-accent mb-1">AI Tip</p>
                    <p className="text-[12px] text-ink-muted leading-snug">
                      Practice the STAR method daily — candidates who use structured answers score 23% higher on average.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Recommended Practice ── */}
          <div className="mb-5">
            <h2 className="text-[18px] font-bold text-ink mb-4">Recommended Practice</h2>
            <div className="grid grid-cols-3 gap-4">
              {recommendedPractice.map((item) => (
                <div key={item.id}
                  className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center">
                      {PRACTICE_ICONS[item.icon]}
                    </div>
                    <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: item.badgeColor, backgroundColor: item.badgeBg }}>
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14.5px] font-bold text-ink">{item.title}</p>
                    <p className="text-[12.5px] text-ink-muted leading-snug mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-ink-muted mt-auto pt-1">
                    <ClockIcon /> {item.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Interviews ── */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-bold text-ink">Recent Interviews</h2>
              <button className="text-[13px] font-semibold text-accent hover:text-accent-dark transition-colors">
                View All History
              </button>
            </div>
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 px-3 pb-3 border-b border-border-faint">
              {["ROLE", "TYPE", "SCORE", "DATE"].map((h) => (
                <span key={h} className="text-[10.5px] font-bold tracking-widest uppercase text-ink-placeholder">{h}</span>
              ))}
            </div>
            {recentInterviews.map((item) => (
              <div key={item.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 items-center px-3 py-4 border-b border-border-faint last:border-0 hover:bg-surface-muted rounded-lg transition-colors cursor-pointer">
                <span className="text-[14px] font-semibold text-ink">{item.role}</span>
                <span className="text-[13px] text-ink-muted">{item.type}</span>
                <span className="text-[13px] font-bold" style={{ color: item.scoreColor }}>{item.score}</span>
                <span className="text-[13px] text-ink-muted">{item.date}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-border-light px-7 py-4 flex items-center justify-between">
          <p className="text-[12px] text-ink-placeholder">© 2023 InterviewMatrix AI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[12px] text-ink-placeholder hover:text-ink-muted transition-colors">Privacy Policy</a>
            <a href="#" className="text-[12px] text-ink-placeholder hover:text-ink-muted transition-colors">Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
