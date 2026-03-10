import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AI_QUESTION = `"Tell me about a time you solved a difficult problem."`;

const TRANSCRIPT_TEXT = `I was working on a backend performance issue that was causing slow API responses. I profiled the service and discovered inefficient database queries that were making redundant joins across three tables. I restructured the query logic, added proper indexing, and implemented a caching layer. The result was a 4x improvement in response time and a significant drop in server load during peak hours.`;

const METRICS = [
  { label: "Confidence", value: 82, color: "#0d69f2" },
  { label: "Clarity", value: 91, color: "#22c55e" },
  { label: "Structure", value: 76, color: "#a855f7" },
];

const GlassPanel = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/15 shadow-lg ${className}`}
    style={{
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}
  >
    {children}
  </div>
);

const Waveform = () => (
  <div className="flex items-end gap-[3px] h-5">
    {[0.6, 1, 0.4, 0.8, 0.5, 1, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-primary animate-pulse"
        style={{
          height: `${h * 100}%`,
          animationDelay: `${i * 0.12}s`,
          animationDuration: "0.8s",
        }}
      />
    ))}
  </div>
);

const ProgressBar = ({ label, value, color, active }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-sm">
      <span className="text-white/70">{label}</span>
      <span className="text-white font-semibold">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
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

const TypingTranscript = ({ text, active }) => {
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    indexRef.current = 0;
    setDisplayed("");

    intervalRef.current = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current);
      }
    }, 18);

    return () => clearInterval(intervalRef.current);
  }, [active, text]);

  return (
    <p className="text-white/80 text-sm leading-relaxed font-mono">
      {displayed}
      {active && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-4 bg-primary animate-pulse ml-0.5 align-middle" />
      )}
    </p>
  );
};

const InterviewExperienceSection = () => {
  const sectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const bgVideoRef = useRef(null);
  const questionRef = useRef(null);
  const transcriptRef = useRef(null);
  const analysisRef = useRef(null);

  const [transcriptActive, setTranscriptActive] = useState(false);
  const [analysisActive, setAnalysisActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoContainerRef.current;

    const getFullscreenScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return Math.max(vw / 360, vh / 640);
    };

    // Video starts invisible
    gsap.set(video, { scale: 0, opacity: 0, borderRadius: 28 });

    const ctx = gsap.context(() => {
      const fullScale = getFullscreenScale();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.55) setTranscriptActive(true);
            if (self.progress >= 0.7) setAnalysisActive(true);
          },
        },
      });

      // 0%–8%: Video pops in from scale(0) to portrait size (scale 1)
      tl.to(video, {
        scale: 1,
        opacity: 1,
        ease: "back.out(1.4)",
        duration: 0.08,
      }, 0);

      // 0%–8%: Bg starts darkening
      tl.to(section, {
        backgroundColor: "#0f0f0f",
        ease: "none",
        duration: 0.08,
      }, 0);

      // 10%–30%: Video scales from portrait to fullscreen
      tl.to(video, {
        scale: fullScale,
        borderRadius: 0,
        ease: "power2.inOut",
        duration: 0.2,
      }, 0.1);

      // 10%–30%: Blurred bg video fades in
      tl.to(bgVideoRef.current, {
        opacity: 1,
        ease: "power1.in",
        duration: 0.2,
      }, 0.1);

      // 35%: AI question panel
      tl.fromTo(questionRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
        0.35
      );

      // 50%: Transcript panel
      tl.fromTo(transcriptRef.current,
        { opacity: 0, x: -80 },
        { opacity: 1, x: 0, ease: "power2.out", duration: 0.1 },
        0.5
      );

      // 65%: Analysis panel
      tl.fromTo(analysisRef.current,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, ease: "power2.out", duration: 0.1 },
        0.65
      );
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
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      {/* Blurred fullscreen background video */}
      <div
        ref={bgVideoRef}
        className="absolute inset-0 z-[1] opacity-0 overflow-hidden"
      >
        <video
          className="w-full h-full object-cover scale-125"
          style={{ filter: "blur(50px) brightness(0.4)" }}
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Portrait video — starts scale(0), grows to portrait, then fullscreen */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div
          ref={videoContainerRef}
          className="w-[360px] h-[640px] rounded-[28px] overflow-hidden shadow-2xl shadow-black/20"
          style={{ willChange: "transform", transformOrigin: "center center" }}
        >
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

      {/* Overlay Panels */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {/* AI Question — top center */}
        <div
          ref={questionRef}
          className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-xl opacity-0"
        >
          <GlassPanel className="px-6 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-semibold tracking-widest uppercase">
                AI Interviewer
              </span>
              <Waveform />
            </div>
            <p className="text-white text-lg font-medium leading-snug">
              {AI_QUESTION}
            </p>
          </GlassPanel>
        </div>

        {/* Transcript — left */}
        <div
          ref={transcriptRef}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-[280px] md:w-[320px] opacity-0"
        >
          <GlassPanel className="px-5 py-5 flex flex-col gap-3 max-h-[320px] overflow-hidden">
            <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">
              Live Transcript
            </span>
            <TypingTranscript text={TRANSCRIPT_TEXT} active={transcriptActive} />
          </GlassPanel>
        </div>

        {/* Analysis — right */}
        <div
          ref={analysisRef}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[260px] md:w-[300px] opacity-0"
        >
          <GlassPanel className="px-5 py-5 flex flex-col gap-5">
            <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">
              AI Analysis
            </span>
            {METRICS.map((m) => (
              <ProgressBar
                key={m.label}
                label={m.label}
                value={m.value}
                color={m.color}
                active={analysisActive}
              />
            ))}
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default InterviewExperienceSection;
