import { NavLink } from "react-router-dom";

/* ── Icons ── */
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.41"/>
  </svg>
);
const LibraryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const NAV_ITEMS = [
  { to: "/dashboard",           icon: <GridIcon />,    label: "Dashboard" },
  { to: "/dashboard/interview", icon: <PlayIcon />,    label: "Start Interview" },
  { to: "/dashboard/previous",  icon: <HistoryIcon />, label: "Previous Interviews" },
  { to: "/dashboard/library",   icon: <LibraryIcon />, label: "Practice Library" },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface border-r border-border-light flex flex-col z-40">

      {/* ── Logo ── */}
      <div className="px-7 pt-6 pb-5 border-b border-border-light">
        <span className="font-black text-[13px] tracking-[0.2em] leading-none uppercase">
          <span className="text-accent">Interview</span>
          <span className="text-ink"> Matrix</span>
        </span>
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 px-4 pt-5 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-accent" : "text-ink-muted/60"}>{icon}</span>
                {label}
              </>
            )}
          </NavLink>
        ))}

        {/* ── System label ── */}
        <div className="mt-6 mb-2 px-4">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-ink-placeholder">
            System
          </span>
        </div>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 w-full text-left ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={isActive ? "text-accent" : "text-ink-muted/60"}><SettingsIcon /></span>
              Settings & Profile
            </>
          )}
        </NavLink>
      </nav>

      {/* ── PRO PLAN card ── */}
      <div className="px-4 py-5">
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-[10px] font-black tracking-[0.15em] uppercase text-accent mb-1.5">
            Pro Plan
          </p>
          <p className="text-[12px] text-ink-muted leading-relaxed mb-3">
            Unlimited AI-mock interviews and deep analysis.
          </p>
          <button className="w-full h-8 rounded-lg bg-accent hover:bg-accent-dark text-white text-[12px] font-bold transition-colors duration-200 flex items-center justify-center gap-1.5">
            <ZapIcon />
            Upgrade Now
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
