import { Link } from "react-router-dom";
import AppTopNav from "../components/common/AppTopNav";

const reviewMetrics = [
  {
    label: "Clarity of Speech",
    score: 8.2,
    note: "Excellent articulation and steady pace.",
  },
  {
    label: "Confidence Level",
    score: 7.5,
    note: "Steady eye contact and body language.",
  },
  {
    label: "Technical Knowledge",
    score: 7.7,
    note: "Deep understanding of Figma and systems.",
  },
];

const strengths = [
  {
    id: "1",
    title: "Concise Responses",
    note: "You avoided rambling and got straight to the point on technical questions.",
  },
  {
    id: "2",
    title: "Professional Tone",
    note: "Maintained a high level of vocabulary suitable for a senior-level position.",
  },
];

const practiceItems = [
  {
    title: "Behavioral Drill",
    note: "Focus on conflict resolution and STAR structure.",
  },
  {
    title: "Rapid Fire Prep",
    note: "Improve reaction time for technical design queries.",
  },
];

const transcriptItems = [
  {
    id: "Q1",
    question: "Can you describe a time you had to defend a design decision to a difficult stakeholder?",
    time: "04:12",
    answer:
      "In my previous role at Meta, we were launching a new checkout flow. One of the PMs insisted on adding three more upsell modals. I knew this would hurt conversion, so I gathered data from our previous A/B tests. I presented the quantitative drop in conversion rates and suggested an alternative 'soft-upsell' post-purchase. We ended up compromising with a single toast notification.",
    feedbackTone: "feedback",
    feedbackLabel: "Feedback",
    feedback:
      "Good use of quantitative data. To make this stronger, describe the specific stakeholder's objection and how you managed the interpersonal dynamic during the meeting.",
  },
  {
    id: "Q2",
    question: "How do you approach creating a design system for scale?",
    time: "08:45",
    answer:
      "Scale starts with foundations. I focus on tokenization first: colors, typography, and spacing. Then I build out atoms like buttons and inputs. The key is documentation and engineer buy-in. Without a shared language in code, using something like Tailwind or CSS variables, the system won't scale across teams.",
    feedbackTone: "strong",
    feedbackLabel: "Strong Answer",
    feedback:
      "Expert knowledge shown here. Mentioning engineer buy-in and shared language shows senior-level architectural thinking.",
  },
];

const CircleScore = ({ score, size = 116, thick = 10, large = false }) => {
  const pct = Math.max(0, Math.min(score / 10, 1));
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
        style={{
          width: size - thick * 2,
          height: size - thick * 2,
        }}
      >
        <div className="text-center">
          <div className={`${large ? "text-[54px]" : "text-[30px]"} font-black leading-none tracking-tight text-ink`}>
            {score}
          </div>
          <div className="mt-1 text-[12px] font-bold text-ink-muted">/ 10</div>
        </div>
      </div>
    </div>
  );
};

const ActionIcon = ({ share = false }) =>
  share ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

const SectionTitle = ({ icon, title, tone = "default" }) => (
  <div className="mb-4 flex items-center gap-2">
    <span className={tone === "warn" ? "text-[#d28b00]" : tone === "accent" ? "text-accent" : "text-[#22a861]"}>
      {icon}
    </span>
    <h2 className="text-[25px] font-black tracking-tight text-ink">{title}</h2>
  </div>
);

const Review = () => {
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
            <h1 className="text-[44px] font-black tracking-tight text-ink sm:text-[56px]">Alex Johnson</h1>
            <p className="mt-1 text-[16px] italic text-ink-muted">
              Senior Product Designer Interview · Oct 24, 2023
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-5 text-[13px] font-semibold text-ink shadow-[0_6px_18px_rgba(17,17,17,0.04)] transition-colors hover:bg-surface-muted">
              <ActionIcon />
              Export PDF
            </button>
            <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(232,98,26,0.28)] transition-colors hover:bg-accent-dark">
              <ActionIcon share />
              Share Report
            </button>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <article className="rounded-[22px] border border-border bg-white p-7 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-ink-placeholder">
              Overall Interview Score
            </p>
            <div className="mt-8 flex justify-center">
              <CircleScore score={7.8} size={184} thick={12} large />
            </div>
            <div className="mt-8 flex justify-center">
              <span className="rounded-full bg-[#dff4e5] px-5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#2d9f5b]">
                Strong Performance
              </span>
            </div>
          </article>

          {reviewMetrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[22px] border border-border bg-white p-6 shadow-[0_10px_24px_rgba(17,17,17,0.04)]"
            >
              <div className="flex justify-center">
                <CircleScore score={metric.score} />
              </div>
              <h2 className="mt-7 text-center text-[22px] font-black tracking-tight text-ink">{metric.label}</h2>
              <p className="mx-auto mt-3 max-w-[220px] text-center text-[14px] leading-6 text-ink-muted">
                {metric.note}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-9 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionTitle
              title="Key Strengths"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <div className="space-y-4">
              {strengths.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[18px] border border-border bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-7 w-7 place-items-center rounded-full bg-[#e6f7eb] text-[11px] font-black text-[#2d9f5b]">
                      {item.id}
                    </div>
                    <div>
                      <h3 className="text-[19px] font-black tracking-tight text-ink">{item.title}</h3>
                      <p className="mt-2 text-[14px] leading-6 text-ink-muted">{item.note}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8">
              <SectionTitle
                title="Areas to Improve"
                tone="warn"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3 1 21h22L12 3z" />
                    <path d="M12 9v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="17" r="1.3" fill="#fff" />
                  </svg>
                }
              />
              <article className="rounded-[18px] border border-[#f0d8ca] bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#d1843d]">
                  STAR Method Enhancement
                </p>
                <p className="mt-4 text-[15px] italic leading-7 text-ink-muted">
                  "When asked about a conflict with a stakeholder, you focused heavily on the Situation but missed
                  explaining the specific Results achieved after your intervention."
                </p>
                <div className="mt-5 border-l-2 border-[#f0d8ca] pl-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#d1843d]">Pro Tip</p>
                  <p className="mt-2 text-[14px] leading-6 text-ink">
                    Dedicate at least 30% of your story to measurable outcomes like data, metrics, or direct team impact.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div>
            <SectionTitle
              title="AI Interview Feedback"
              tone="accent"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.3 1.1 4.3 2.8 5.6V19a1 1 0 0 0 1.6.8l2.2-1.7c.1 0 .3.1.4.1a7 7 0 1 0 0-14z" />
                  <circle cx="12" cy="9" r="1" fill="#fff" />
                  <path d="M12 12v3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            />
            <article className="rounded-[18px] border border-[#f0d8ca] bg-[#fff8f4] p-6 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
              <p className="text-[15px] leading-8 text-ink-secondary">
                Overall, Alex, your interview was highly professional. You demonstrated significant depth in design
                systems and accessibility. However, your response speed for the behavioral questions was slightly
                delayed, suggesting a need for more muscle memory with your "career stories." We recommend focusing on
                the STAR method to structure your narratives more clearly. Your use of industry terminology was spot-on,
                though you could benefit from simplifying complex technical concepts for non-design stakeholders.
              </p>
            </article>

            <div className="mt-8">
              <h2 className="text-[25px] font-black tracking-tight text-ink">Recommended Practice</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {practiceItems.map((item) => (
                  <article
                    key={item.title}
                    className="group rounded-[18px] border border-border bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)] transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1e8] text-accent">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5a2 2 0 0 0-2 2v14l4-3h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                        </svg>
                      </div>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-ink-placeholder transition-colors group-hover:text-accent"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                    <h3 className="mt-5 text-[18px] font-black tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-2 text-[14px] leading-6 text-ink-muted">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[20px] border border-border bg-white px-6 py-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-ink-muted">
                <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h2 className="text-[28px] font-black tracking-tight text-ink">Detailed Transcript</h2>
            </div>
            <div className="flex items-center gap-5 text-[13px] font-semibold text-ink-muted">
              <span>24 mins audio</span>
              <span>3,402 words</span>
            </div>
          </div>
        </section>

        <section className="mt-5 space-y-5">
          {transcriptItems.map((item) => {
            const isStrong = item.feedbackTone === "strong";
            return (
              <article
                key={item.id}
                className="rounded-[20px] border border-border bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-[12px] font-black uppercase tracking-[0.18em] text-accent">
                      {item.id}
                    </span>
                    <h3 className="max-w-[880px] text-[21px] font-black tracking-tight text-ink">
                      "{item.question}"
                    </h3>
                  </div>
                  <span className="text-[12px] font-semibold text-ink-placeholder">{item.time}</span>
                </div>

                <div className="mt-6 rounded-2xl bg-[#faf9f7] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#eef1f4] text-ink-placeholder">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v.6h19.2v-.6c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <p className="text-[14px] leading-7 text-ink-muted">"{item.answer}"</p>
                  </div>

                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 ${
                      isStrong ? "bg-[#e6f4ea]" : "bg-[#fff2ea]"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-black uppercase tracking-[0.18em] ${
                        isStrong ? "text-[#2d9f5b]" : "text-accent"
                      }`}
                    >
                      {item.feedbackLabel}
                    </p>
                    <p className="mt-2 text-[13px] italic leading-6 text-ink-muted">{item.feedback}</p>
                  </div>
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
            <p className="mt-2 text-[12px] font-medium text-ink-placeholder">
              © 2023 InterviewMatrix Inc. All rights reserved.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 text-[13px] font-semibold text-ink shadow-[0_6px_18px_rgba(17,17,17,0.04)] transition-colors hover:bg-surface-muted"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Return to Dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-[0.18em] text-ink-placeholder">
            <a href="#" className="transition-colors hover:text-ink-muted">Privacy</a>
            <a href="#" className="transition-colors hover:text-ink-muted">Terms</a>
            <a href="#" className="transition-colors hover:text-ink-muted">Support</a>
            <a href="#" className="transition-colors hover:text-ink-muted">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Review;
