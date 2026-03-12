import { useEffect, useRef, useState } from "react";
import { useInView, motion as Motion } from "framer-motion";

/* ── Animated counter ───────────────────────────────────── */

const CountUp = ({ target, active }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const duration = 1200; // ms
    const start = performance.now();
    let rafId;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut curve
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.round(eased * target);
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [active, target]);

  return <span ref={ref}>0</span>;
};

/* ── Analyzing dots ─────────────────────────────────────── */

const AnalyzingDots = () => (
  <span className="inline-flex gap-1 ml-1">
    {[0, 1, 2].map((i) => (
      <Motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-[#e8621a]"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      />
    ))}
  </span>
);

/* ── Score bar ──────────────────────────────────────────── */

const SCORES = [
  { label: "Clarity", value: 91 },
  { label: "Confidence", value: 82 },
  { label: "Structure", value: 76 },
];

const ScoreBar = ({ label, value, active, delay }) => (
  <Motion.div
    className="flex flex-col gap-2"
    initial={{ opacity: 0, y: 10 }}
    animate={active ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    <div className="flex justify-between text-sm">
      <span className="text-[#111111] font-medium">{label}</span>
      <span className="text-[#111111] font-semibold tabular-nums">
        <CountUp target={value} active={active} />
      </span>
    </div>
    <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
      <Motion.div
        className="h-full rounded-full bg-[#e8621a]"
        initial={{ width: 0 }}
        animate={active ? { width: `${value}%` } : {}}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
      />
    </div>
  </Motion.div>
);

/* ── Main component ─────────────────────────────────────── */

const AIAnalysisIllustration = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timers = [
      setTimeout(() => setStep(1), 500),   // answer bubble
      setTimeout(() => setStep(2), 1300),  // analyzing
      setTimeout(() => setStep(3), 2300),  // scores
      setTimeout(() => setStep(4), 3500),  // insight
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="w-full py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#111111] text-3xl md:text-5xl font-display font-bold leading-tight">
            How InterviewMatrix Evaluates Your Answer
          </h2>
          <p className="text-[#555555] text-[17px] md:text-lg leading-relaxed max-w-[560px] mx-auto">
            We analyze every response across clarity, confidence, structure,
            relevance, and depth.
          </p>
        </div>

        {/* Illustration */}
        <div className="w-full max-w-[520px] flex flex-col items-center gap-8">
          {/* Step 1 — Answer bubble */}
          <Motion.div
            className="w-full rounded-lg border border-[#e5e5e5] bg-white px-6 py-5 text-left"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-[#111111] text-[15px] leading-relaxed">
              &ldquo;I improved API response time by 60% by optimizing database
              queries.&rdquo;
            </p>
          </Motion.div>

          {/* Step 2 — Analyzing indicator */}
          <Motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={step >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="text-[#111111] text-sm font-medium">
              Analyzing response
            </span>
            <AnalyzingDots />
          </Motion.div>

          {/* Step 3 — Score bars */}
          <div className="w-full flex flex-col gap-5">
            {SCORES.map((s, i) => (
              <ScoreBar
                key={s.label}
                label={s.label}
                value={s.value}
                active={step >= 3}
                delay={i * 0.15}
              />
            ))}
          </div>

          {/* Step 4 — AI Insight card */}
          <Motion.div
            className="w-full rounded-xl border border-[#e5e5e5] bg-white px-6 py-5 text-left"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={step >= 4 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-[#e8621a] text-sm font-semibold mb-2">
              AI Insight
            </h3>
            <p className="text-[#111111] text-[15px] leading-relaxed">
              Strong explanation and clear structure.
              <br />
              Consider adding measurable business impact.
            </p>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAnalysisIllustration;
