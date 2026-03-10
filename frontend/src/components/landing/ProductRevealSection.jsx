import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Score Card ── */
const SCORES = [
  { label: "Clarity", value: 91, color: "#22c55e" },
  { label: "Confidence", value: 82, color: "#0d69f2" },
  { label: "Structure", value: 76, color: "#a855f7" },
  { label: "Relevance", value: 88, color: "#f59e0b" },
  { label: "Depth", value: 79, color: "#ec4899" },
];

const GRAPH_POINTS = [40, 55, 48, 65, 58, 72, 68, 82, 76, 88, 91];

const ScoreCard = ({ label, value, color, active }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-gray-900 text-lg font-bold">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          backgroundColor: color,
          width: active ? `${value}%` : "0%",
        }}
      />
    </div>
  </div>
);

/* ── Mini Line Graph ── */
const PerformanceGraph = ({ active }) => {
  const points = GRAPH_POINTS;
  const width = 400;
  const height = 120;
  const padding = 16;
  const graphW = width - padding * 2;
  const graphH = height - padding * 2;

  const pathD = points
    .map((p, i) => {
      const x = padding + (i / (points.length - 1)) * graphW;
      const y = padding + graphH - (p / 100) * graphH;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Performance Over Time
      </span>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full mt-2"
        style={{ overflow: "visible" }}
      >
        {/* Grid lines */}
        {[25, 50, 75].map((v) => (
          <line
            key={v}
            x1={padding}
            y1={padding + graphH - (v / 100) * graphH}
            x2={width - padding}
            y2={padding + graphH - (v / 100) * graphH}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#0d69f2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: active ? 0 : 600,
            transition: "stroke-dashoffset 2s ease-out",
          }}
        />
        {/* Dots */}
        {points.map((p, i) => {
          const x = padding + (i / (points.length - 1)) * graphW;
          const y = padding + graphH - (p / 100) * graphH;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#0d69f2"
              style={{
                opacity: active ? 1 : 0,
                transition: `opacity 0.3s ease ${i * 0.15}s`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

/* ── Dashboard UI (inside laptop screen) ── */
const DashboardUI = ({ active }) => (
  <div className="w-full h-full bg-[#f8f9fb] rounded-sm overflow-hidden flex flex-col">
    {/* Top bar */}
    <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <span className="text-[11px] text-gray-400 font-medium">
        app.interviewmatrix.ai/dashboard
      </span>
      <div className="w-16" />
    </div>

    {/* Dashboard content */}
    <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h3 className="text-gray-900 text-sm font-bold">
          Interview Performance Report
        </h3>
        <p className="text-gray-400 text-[11px] mt-0.5">
          Senior Frontend Engineer — March 11, 2026
        </p>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-3 gap-2">
        {SCORES.slice(0, 3).map((s) => (
          <ScoreCard key={s.label} {...s} active={active} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SCORES.slice(3).map((s) => (
          <ScoreCard key={s.label} {...s} active={active} />
        ))}
      </div>

      {/* Bottom row: Graph + Coaching */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <PerformanceGraph active={active} />

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            AI Coaching
          </span>
          <p className="text-gray-700 text-xs leading-relaxed">
            <span className="font-semibold text-gray-900">
              Improve your STAR structure.
            </span>{" "}
            Your answers describe the situation well, but results were not
            clearly quantified. Try ending with specific metrics like
            percentages or time saved.
          </p>
          <div className="mt-auto flex gap-2">
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              Structure
            </span>
            <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
              Results
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Laptop Mockup ── */
const LaptopMockup = ({ children, screenRef }) => (
  <div className="relative w-[900px] max-w-[90vw]">
    {/* Screen */}
    <div className="relative bg-[#1a1a1a] rounded-t-2xl p-3 pt-3 shadow-2xl shadow-black/30">
      {/* Camera notch */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700" />
      {/* Screen area */}
      <div
        ref={screenRef}
        className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#1a1a1a]"
      >
        {children}
      </div>
    </div>
    {/* Base / Hinge */}
    <div className="relative">
      <div className="h-4 bg-gradient-to-b from-[#c0c0c0] to-[#a8a8a8] rounded-b-lg mx-auto" />
      <div className="h-1.5 bg-[#888] rounded-b-xl mx-[15%]" />
    </div>
  </div>
);

/* ══════════════════════════════════════
   ProductRevealSection
   ══════════════════════════════════════ */
const ProductRevealSection = () => {
  const sectionRef = useRef(null);
  const laptopRef = useRef(null);
  const screenRef = useRef(null);
  const interviewFrameRef = useRef(null);
  const dashboardRef = useRef(null);

  const [dashboardActive, setDashboardActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(laptopRef.current, { y: "100vh", opacity: 0 });
      gsap.set(interviewFrameRef.current, { scale: 1, opacity: 1 });
      gsap.set(dashboardRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1200",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.45) setDashboardActive(true);
          },
        },
      });

      // 0%–10%: Interview frame (mini preview) shrinks
      tl.to(interviewFrameRef.current, {
        scale: 0.55,
        ease: "power2.inOut",
        duration: 0.1,
      }, 0);

      // 10%–25%: Laptop rises from bottom
      tl.to(laptopRef.current, {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 0.15,
      }, 0.1);

      // 25%–35%: Interview frame docks into screen (shrink + fade)
      tl.to(interviewFrameRef.current, {
        scale: 0.25,
        opacity: 0,
        ease: "power2.in",
        duration: 0.1,
      }, 0.25);

      // 35%–45%: Dashboard fades in inside laptop
      tl.to(dashboardRef.current, {
        opacity: 1,
        ease: "power1.out",
        duration: 0.1,
      }, 0.35);

      // 45%–55%: Everything settled, bg transitions to light
      tl.to(section, {
        backgroundColor: "#f8f9fb",
        ease: "none",
        duration: 0.1,
      }, 0.35);
    }, section);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#0f0f0f]"
    >
      {/* Interview frame (mini version from previous scene) */}
      <div
        ref={interviewFrameRef}
        className="absolute inset-0 z-[2] flex items-center justify-center"
      >
        <div className="w-[280px] h-[500px] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
          <video
            className="w-full h-full object-cover"
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>

      {/* Laptop mockup (starts off-screen below) */}
      <div
        ref={laptopRef}
        className="absolute inset-0 z-[3] flex items-center justify-center"
      >
        <LaptopMockup screenRef={screenRef}>
          <div ref={dashboardRef} className="w-full h-full opacity-0">
            <DashboardUI active={dashboardActive} />
          </div>
        </LaptopMockup>
      </div>
    </section>
  );
};

export default ProductRevealSection;
