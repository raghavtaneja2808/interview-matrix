const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ROWS = [
  { pain: "Fear of Failure", gain: "Unshakeable Calm" },
  { pain: "Generic Answers", gain: "High-Value Pitch" },
  { pain: "Job Search Limbo", gain: "The Power of Choice" },
];

const Comparison = () => {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy */}
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[#111111] leading-[1.08] tracking-tight">
            Don&apos;t just interview.{" "}
            <span className="text-[#e8621a]">Dominate</span> the room.
          </h2>

          <p className="text-lg text-[#555555] leading-relaxed max-w-xl">
            Stop leaving your career to chance. Master the{" "}
            <span className="font-bold text-[#111111] underline decoration-[#e8621a] decoration-4 underline-offset-4">
              psychology of persuasion
            </span>{" "}
            with AI simulations that mirror the world&apos;s toughest recruiters.
          </p>

        </div>

        {/* Right — Comparison Card */}
        <div className="relative">
          {/* Background blobs */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#e8621a]/10 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-blob" />
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-blob-delay" />

          <div
            className="relative rounded-[40px] p-10"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(229, 231, 235, 0.5)",
              boxShadow: "0 32px 64px -16px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <div className="flex justify-between mb-12 border-b border-slate-100 pb-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Old Way</div>
                <div className="text-sm font-bold text-slate-500">Manual Hustle</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e8621a] mb-1">New Way</div>
                <div className="text-sm font-bold text-emerald-600">AI Advantage</div>
              </div>
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-8">
              {ROWS.map((row) => (
                <div key={row.pain} className="flex items-center gap-4">
                  {/* Pain */}
                  <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3 hover:-translate-x-1 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                      <XIcon />
                    </div>
                    <span className="text-slate-600 font-bold text-sm">{row.pain}</span>
                  </div>

                  {/* Arrow */}
                  <div className="text-slate-300 shrink-0">
                    <ArrowIcon />
                  </div>

                  {/* Gain */}
                  <div className="flex-1 bg-emerald-500 p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-100 hover:translate-x-1 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-white font-black text-sm">{row.gain}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div className="mt-12 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                Join the elite top 1% of applicants
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
