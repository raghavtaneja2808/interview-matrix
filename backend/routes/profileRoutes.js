const express = require("express");
const Interview = require("../models/Interview");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const ROLE_LABELS = {
  frontend: "Frontend Engineer",
  backend: "Backend Engineer",
  fullstack: "Full Stack Engineer",
  devops: "DevOps Engineer",
  datascience: "Data Scientist",
  aiml: "AI/ML Engineer",
};
const TYPE_LABELS = {
  technical: "Technical Round",
  system: "System Design",
  behavioral: "Behavioral Mock",
};

function relativeTime(date) {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function streak(dates) {
  if (!dates.length) return 0;
  const days = new Set(
    dates.map((d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.getTime();
    })
  );
  let count = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  while (days.has(cur.getTime())) {
    count++;
    cur.setDate(cur.getDate() - 1);
  }
  return count;
}

router.get("/dashboard", async (req, res) => {
  const list = await Interview.find({ userId: req.user._id, status: "completed" })
    .sort({ completedAt: -1 })
    .lean();

  const totalInterviews = list.length;
  const overallScores = list.map((i) => i.review?.overall).filter((n) => typeof n === "number");
  const avgScore = overallScores.length
    ? +(overallScores.reduce((a, b) => a + b, 0) / overallScores.length).toFixed(1)
    : 0;

  const dates = list.map((i) => i.completedAt);
  const currentStreak = streak(dates);

  const avg = (key) => {
    const values = list.map((i) => i.review?.[key]).filter((n) => typeof n === "number");
    return values.length ? +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  };

  const lastInterview = list[0];
  const recent = list.slice(0, 5).map((i) => ({
    id: i._id.toString(),
    role: ROLE_LABELS[i.role] || i.role,
    type: TYPE_LABELS[i.type] || i.type,
    score: typeof i.review?.overall === "number" ? `${i.review.overall.toFixed(1)} / 10` : "—",
    scoreColor:
      i.review?.overall >= 8 ? "#16a34a" : i.review?.overall >= 6 ? "#ca8a04" : "#dc2626",
    date: new Date(i.completedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  res.json({
    user: {
      name: req.user.name,
      email: req.user.email,
      targetRole: req.user.targetRole,
      lastInterview: relativeTime(lastInterview?.completedAt),
      level: avgScore >= 8 ? "Level 5 Candidate" : avgScore >= 6 ? "Level 4 Candidate" : "Level 3 Candidate",
    },
    stats: {
      totalInterviews,
      avgScore,
      currentStreak,
    },
    performance: {
      overall: avgScore,
      clarity: avg("clarity"),
      confidence: avg("confidence"),
      technical: avg("technical"),
    },
    recentInterviews: recent,
  });
});

module.exports = router;
