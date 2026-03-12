import { useNavigate } from "react-router-dom";

const BellIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const TopBar = ({ hideStartButton = false }) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-[280px] right-0 h-[58px] bg-surface border-b border-border-light flex items-center px-6 gap-3 z-30">
      {hideStartButton ? (
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-accent hover:bg-accent-dark text-white text-[13px] font-semibold transition-colors duration-200"
        >
          <ArrowLeftIcon />
          Return to Dashboard
        </button>
      ) : (
        <button
          onClick={() => navigate("/dashboard/interview")}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-accent hover:bg-accent-dark text-white text-[13px] font-semibold transition-colors duration-200"
        >
          <PlusIcon />
          Start Interview
        </button>
      )}
      <div className="flex-1" />
      <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-surface-muted transition-colors">
        <BellIcon />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-surface" />
      </button>
      <div className="w-9 h-9 rounded-full bg-surface-warm flex items-center justify-center overflow-hidden border-2 border-border cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
    </header>
  );
};

export default TopBar;
