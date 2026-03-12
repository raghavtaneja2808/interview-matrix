// ── User ──────────────────────────────────────────────
export function getUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return {
      name: stored?.name?.split(" ")[0] || "User",
      email: stored?.email || "",
      targetRole: "Frontend Developer",
      lastInterview: "Yesterday",
      level: "Level 4 Candidate",
    };
  } catch {
    return {
      name: "User",
      email: "",
      targetRole: "Frontend Developer",
      lastInterview: "Yesterday",
      level: "Level 4 Candidate",
    };
  }
}

// ── Stat cards ────────────────────────────────────────
export const stats = [
  { id: "interviews", icon: "check",  label: "INTERVIEWS COMPLETED", value: "14" },
  { id: "score",      icon: "star",   label: "AVG SCORE",             value: "7.8" },
  { id: "streak",     icon: "flame",  label: "CURRENT STREAK",        value: "5 days" },
];

// ── Performance gauges ────────────────────────────────
export const performance = {
  overall: 7.8,
  skills: [
    { label: "Clarity of\nSpeech",        value: 8.5 },
    { label: "Confidence\nLevel",          value: 7.2 },
    { label: "Technical\nUnderstanding",   value: 9.1 },
  ],
};

// ── Focus areas ───────────────────────────────────────
export const focusAreas = [
  {
    id: 1,
    title: "STAR Method",
    description: "Structure behavioral answers more clearly with specific results.",
  },
  {
    id: 2,
    title: "Technical Depth",
    description: "Elaborate more on browser rendering cycles in React questions.",
  },
  {
    id: 3,
    title: "Reducing Filler Words",
    description: 'Frequent use of "basically" and "like" noticed in long explanations.',
  },
];

// ── Recommended practice ──────────────────────────────
export const recommendedPractice = [
  {
    id: "behavioral",
    badge: "BEHAVIORAL",
    badgeColor: "#3b82f6",
    badgeBg: "#eff6ff",
    icon: "people",
    title: "Behavioral Interview",
    description: "Focus on leadership and conflict resolution scenarios.",
    duration: "45 Minutes",
  },
  {
    id: "design",
    badge: "DESIGN",
    badgeColor: "#10b981",
    badgeBg: "#ecfdf5",
    icon: "compass",
    title: "System Design Practice",
    description: "Architect scalable frontend applications using micro-frontends.",
    duration: "60 Minutes",
  },
  {
    id: "technical",
    badge: "TECHNICAL",
    badgeColor: "#e8621a",
    badgeBg: "#fff7ed",
    icon: "code",
    title: "React Deep Dive",
    description: "Hooks, reconciliation, and performance optimization techniques.",
    duration: "30 Minutes",
  },
];

// ── Recent interviews ─────────────────────────────────
export const recentInterviews = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    type: "Technical Round",
    score: "8.2 / 10",
    scoreColor: "#16a34a",
    date: "Oct 24, 2023",
  },
  {
    id: 2,
    role: "Fullstack Engineer",
    type: "Behavioral Mock",
    score: "7.4 / 10",
    scoreColor: "#ca8a04",
    date: "Oct 21, 2023",
  },
  {
    id: 3,
    role: "Junior UI Developer",
    type: "System Design",
    score: "9.0 / 10",
    scoreColor: "#16a34a",
    date: "Oct 18, 2023",
  },
];
