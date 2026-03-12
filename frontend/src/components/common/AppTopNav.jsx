import { NavLink } from "react-router-dom";

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/review", label: "History" },
  { to: "/dashboard/interview", label: "Practice" },
  { to: "/dashboard", label: "Resources" },
];

const AppTopNav = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border-light bg-surface/95 backdrop-blur">
      <div className="flex h-[76px] w-full items-center gap-6 px-5 sm:px-8 lg:px-12">
        <NavLink to="/dashboard" className="text-[15px] font-black tracking-tight text-accent">
          InterviewMatrix
        </NavLink>

        <nav className="mx-auto flex items-center gap-3 sm:gap-6">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={`${label}-${to}`}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative px-2 py-7 text-[13px] font-semibold transition-colors ${
                  isActive ? "text-accent" : "text-ink-muted hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 mx-auto h-[2px] w-10 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink">
            <BellIcon />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f1d7c8] bg-[#fff4ec] text-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppTopNav;
