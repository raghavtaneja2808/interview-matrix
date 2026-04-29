import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppTopNav from "../components/common/AppTopNav";
import api, { apiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";

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

const CircleScore = ({ score, size = 116, thick = 10, large = false }) => {
  const safe = typeof score === "number" ? score : 0;
  const pct = Math.max(0, Math.min(safe / 10, 1));
  const angle = pct * 360;
  return (
    <div
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#e8621a ${angle}deg, #eceef2 ${angle}deg)`,
      }}
    >
      <div
        className="grid place-items-center rounded-full bg-white"
        style={{ width: size - thick * 2, height: size - thick * 2 }}
      >
        <div className="text-center">
          <div className={`${large ? "text-[54px]" : "text-[30px]"} font-black leading-none tracking-tight text-ink`}>
            {safe.toFixed(1)}
          </div>
          <div className="mt-1 text-[12px] font-bold text-ink-muted">/ 10</div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title, tone = "default" }) => (
  <div className="mb-4 flex items-center gap-2">
    <span className={tone === "warn" ? "text-[#d28b00]" : tone === "accent" ? "text-accent" : "text-[#22a861]"}>
      {icon}
    </span>
    <h2 className="text-[25px] font-black tracking-tight text-ink">{title}</h2>
  </div>
);

const Review = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/interviews/${id}`)
      .then((r) => setInterview(r.data.interview))
      .catch((err) => setError(apiError(err, "Could not load review.")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f4f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#e5e5e5] border-t-[#e8621a] rounded-full animate-spin" />
          <p className="text-sm text-ink-muted">Loading review…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f4f2] flex items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  if (!interview) return null;

  const review = interview.review || {};
  const reviewMetrics = [
    { label: "Clarity of Speech", score: review.clarity ?? 0, note: "How clearly you articulated your answers." },
    { label: "Confidence Level", score: review.confidence ?? 0, note: "Your delivery, pacing, and decisiveness." },
    { label: "Technical Knowledge", score: review.technical ?? 0, note: "Depth and accuracy of technical content." },
  ];
  const overall = review.overall ?? 0;
  const overallLabel = overall >= 8 ? "Strong Performance" : overall >= 6 ? "Solid Performance" : "Needs Practice";
  const overallBg = overall >= 8 ? "#dff4e5" : overall >= 6 ? "#fff1e8" : "#fee2e2";
  const overallColor = overall >= 8 ? "#2d9f5b" : overall >= 6 ? "#e8621a" : "#dc2626";

  const dateStr = new Date(interview.completedAt || interview.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f6f4f2] text-ink">
      <AppTopNav />

      <main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-ink-placeholder">
              <span>History</span>
              <span className="text-accent">Review</span>
            </div>
            <h1 className="text-[44px] font-black tracking-tight text-ink sm:text-[56px]">{user?.name || "Candidate"}</h1>
            <p className="mt-1 text-[16px] italic text-ink-muted">
              {ROLE_LABELS[interview.role] || interview.role} · {TYPE_LABELS[interview.type] || interview.type} · {dateStr}
            </p>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <article className="rounded-[22px] border border-border bg-white p-7 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-ink-placeholder">Overall Interview Score</p>
            <div className="mt-8 flex justify-center">
              <CircleScore score={overall} size={184} thick={12} large />
            </div>
            <div className="mt-8 flex justify-center">
              <span className="rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.16em]"
                style={{ backgroundColor: overallBg, color: overallColor }}>
                {overallLabel}
              </span>
            </div>
          </article>

          {reviewMetrics.map((m) => (
            <article key={m.label} className="rounded-[22px] border border-border bg-white p-6 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
              <div className="flex justify-center">
                <CircleScore score={m.score} />
              </div>
              <h2 className="mt-7 text-center text-[22px] font-black tracking-tight text-ink">{m.label}</h2>
              <p className="mx-auto mt-3 max-w-[220px] text-center text-[14px] leading-6 text-ink-muted">{m.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-9 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionTitle title="Key Strengths" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
            <div className="space-y-4">
              {(review.strengths || []).map((item, i) => (
                <article key={i} className="rounded-[18px] border border-border bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-7 w-7 place-items-center rounded-full bg-[#e6f7eb] text-[11px] font-black text-[#2d9f5b]">{i + 1}</div>
                    <div>
                      <h3 className="text-[19px] font-black tracking-tight text-ink">{item.title}</h3>
                      <p className="mt-2 text-[14px] leading-6 text-ink-muted">{item.note}</p>
                    </div>
                  </div>
                </article>
              ))}
              {!review.strengths?.length && (
                <p className="text-sm text-ink-muted italic">No strengths captured for this session.</p>
              )}
            </div>

            <div className="mt-8">
              <SectionTitle title="Areas to Improve" tone="warn" icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3 1 21h22L12 3z" />
                  <path d="M12 9v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1.3" fill="#fff" />
                </svg>
              } />
              <div className="space-y-4">
                {(review.improvements || []).map((item, i) => (
                  <article key={i} className="rounded-[18px] border border-[#f0d8ca] bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#d1843d]">{item.title}</p>
                    <p className="mt-4 text-[15px] italic leading-7 text-ink-muted">"{item.note}"</p>
                    {item.tip && (
                      <div className="mt-5 border-l-2 border-[#f0d8ca] pl-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d1843d]">Pro Tip</p>
                        <p className="mt-2 text-[14px] leading-6 text-ink">{item.tip}</p>
                      </div>
                    )}
                  </article>
                ))}
                {!review.improvements?.length && (
                  <p className="text-sm text-ink-muted italic">No improvements flagged for this session.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <SectionTitle title="AI Interview Feedback" tone="accent" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 2.3 1.1 4.3 2.8 5.6V19a1 1 0 0 0 1.6.8l2.2-1.7c.1 0 .3.1.4.1a7 7 0 1 0 0-14z" />
              </svg>
            } />
            <article className="rounded-[18px] border border-[#f0d8ca] bg-[#fff8f4] p-6 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
              <p className="text-[15px] leading-8 text-ink-secondary">
                {review.summary || "No AI summary available for this interview."}
              </p>
            </article>

            {!!(review.keywords || []).length && (
              <div className="mt-8">
                <h2 className="text-[18px] font-black tracking-tight text-ink mb-3">Topics Detected</h2>
                <div className="flex flex-wrap gap-2">
                  {review.keywords.map((kw) => (
                    <span key={kw} className="px-3 py-1.5 rounded-full text-[12px] font-semibold border border-border text-ink-secondary bg-white">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[20px] border border-border bg-white px-6 py-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[28px] font-black tracking-tight text-ink">Detailed Transcript</h2>
            <div className="flex items-center gap-5 text-[13px] font-semibold text-ink-muted">
              <span>{interview.duration} min</span>
              <span>{interview.turns.length} questions</span>
            </div>
          </div>
        </section>

        <section className="mt-5 space-y-5">
          {interview.turns.map((t, i) => {
            const turnReview = (review.perTurn || []).find((p) => p.index === i + 1);
            const isStrong = turnReview?.tone === "strong";
            return (
              <article key={i} className="rounded-[20px] border border-border bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-[12px] font-black uppercase tracking-[0.18em] text-accent">Q{i + 1}</span>
                    <h3 className="max-w-[880px] text-[21px] font-black tracking-tight text-ink">"{t.question}"</h3>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#faf9f7] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#eef1f4] text-ink-placeholder">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v.6h19.2v-.6c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <p className="text-[14px] leading-7 text-ink-muted whitespace-pre-wrap">"{t.answer || "(no answer)"}"</p>
                  </div>

                  {turnReview?.feedback && (
                    <div className={`mt-4 rounded-2xl px-4 py-3 ${isStrong ? "bg-[#e6f4ea]" : "bg-[#fff2ea]"}`}>
                      <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${isStrong ? "text-[#2d9f5b]" : "text-accent"}`}>
                        {isStrong ? "Strong Answer" : "Feedback"}
                      </p>
                      <p className="mt-2 text-[13px] italic leading-6 text-ink-muted">{turnReview.feedback}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="mt-16 w-full border-t border-border-light bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-[24px] font-black tracking-tight text-accent">InterviewMatrix</p>
            <p className="mt-2 text-[12px] font-medium text-ink-placeholder">© 2024 InterviewMatrix Inc. All rights reserved.</p>
          </div>
          <Link to="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 text-[13px] font-semibold text-ink shadow-[0_6px_18px_rgba(17,17,17,0.04)] transition-colors hover:bg-surface-muted">
            Return to Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Review;
