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
  const scrollRef = useRef(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayed]);

  return (
    <div ref={scrollRef} className="max-h-[160px] overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: "none" }}>
      <p className="text-white/80 text-sm leading-relaxed font-mono">
        {displayed}
        {active && displayed.length < text.length && (
          <span className="inline-block w-[2px] h-4 bg-primary animate-pulse ml-0.5 align-middle" />
        )}
      </p>
    </div>
  );
};

const Hero = () => {
  const sectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoOverlayRef = useRef(null);
  const bgColorRef = useRef(null);
  const bgVideoRef = useRef(null);
  const questionRef = useRef(null);
  const transcriptRef = useRef(null);
  const analysisRef = useRef(null);

  const [transcriptActive, setTranscriptActive] = useState(false);
  const [analysisActive, setAnalysisActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoWrapRef.current;
    const text = heroTextRef.current;

    const computeValues = () => {
      const videoRect = video.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const videoCenterX = videoRect.left + videoRect.width / 2;
      const videoCenterY = videoRect.top + videoRect.height / 2;

      // Target: right side of viewport, vertically centered
      // Video goes to roughly 65% from left, centered vertically
      const targetX = vw * 0.65 - videoCenterX;
      const targetY = vh / 2 - videoCenterY;

      return { targetX, targetY };
    };

    const ctx = gsap.context(() => {
      const { targetX, targetY } = computeValues();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=900",
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.4) setTranscriptActive(true);
            if (self.progress >= 0.55) setAnalysisActive(true);
          },
        },
      });

      // 0%–8%: Text fades out + video overlay fades
      tl.to(text, {
        opacity: 0,
        y: -40,
        ease: "power2.in",
        duration: 0.08,
      }, 0);

      tl.to(videoOverlayRef.current, {
        opacity: 0,
        duration: 0.08,
      }, 0);

      // 8%–20%: Bg goes dark + blur appears (video stays in place)
      tl.to(bgColorRef.current, {
        opacity: 1,
        ease: "power1.in",
        duration: 0.12,
      }, 0.08);

      tl.to(bgVideoRef.current, {
        opacity: 1,
        ease: "power1.in",
        duration: 0.12,
      }, 0.1);

      // 25%: AI Question
      tl.fromTo(questionRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
        0.25
      );

      // 40%: Transcript
      tl.fromTo(transcriptRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
        0.4
      );

      // 55%: Analysis
      tl.fromTo(analysisRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
        0.55
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
      {/* Dark bg */}
      <div
        ref={bgColorRef}
        className="absolute inset-0 z-[1] opacity-0 bg-[#0f0f0f]"
      />

      {/* Blurred bg video */}
      <div
        ref={bgVideoRef}
        className="absolute inset-0 z-[2] opacity-0 overflow-hidden"
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

      {/* Hero content — upper portion with whitespace below */}
      <div className="relative z-[3] w-full h-full flex items-start justify-center px-6 md:px-12 pt-[10vh]">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-start gap-12 md:gap-16">
          {/* Text — fades out on scroll */}
          <div ref={heroTextRef} className="flex-1 flex flex-col gap-8 pt-[8vh]">
            <h1 className="hero-headline font-display font-black text-[#111111] m-0">
              Meet Your Next Recruiter.
            </h1>
            <p className="text-[18px] md:text-[20px] text-[#555555] font-normal leading-relaxed max-w-[550px]">
              Experience the world&apos;s most human AI interviewer. Adaptive,
              realistic, and ready to help you land the job.
            </p>
          </div>

          {/* Video — slides to right on scroll */}
          <div className="flex-1 flex justify-center">
            <div
              ref={videoWrapRef}
              className="w-[360px] h-[640px] rounded-[3rem] overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5 bg-slate-50 relative"
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
              <div
                ref={videoOverlayRef}
                className="absolute inset-0 pointer-events-none visual-overlay"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Panels — left side (appear after video moves right) */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* AI Question — top left area */}
        <div
          ref={questionRef}
          className="absolute top-[10vh] left-6 md:left-12 w-[90%] max-w-lg opacity-0"
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

        {/* Transcript — left, below question */}
        <div
          ref={transcriptRef}
          className="absolute top-[30vh] left-6 md:left-12 w-[380px] md:w-[420px] opacity-0"
        >
          <GlassPanel className="px-5 py-5 flex flex-col gap-3">
            <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">
              Live Transcript
            </span>
            <TypingTranscript text={TRANSCRIPT_TEXT} active={transcriptActive} />
          </GlassPanel>
        </div>

        {/* Analysis — left, below transcript */}
        <div
          ref={analysisRef}
          className="absolute bottom-[4vh] left-6 md:left-12 w-[340px] md:w-[380px] opacity-0"
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

export default Hero;
