const Hero = () => {
  return (
    <main className="w-full min-h-screen flex items-start justify-center px-6 md:px-12 pt-[15vh]">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-start gap-12 md:gap-16">
        {/* Text */}
        <div className="flex-1 flex flex-col gap-8 pt-[8vh]">
          <h1 className="hero-headline font-display font-black text-[#111111] m-0">
            Meet Your Next <span className="text-[#e8621a]">Recruiter.</span>
          </h1>
          <p className="text-[18px] md:text-[20px] text-[#555555] font-normal leading-relaxed max-w-[550px]">
            Experience the world&apos;s most human AI interviewer. Adaptive,
            realistic, and ready to help you land the job.
          </p>
        </div>

        {/* Video */}
        <div className="flex-1 flex justify-center">
          <div className="w-[340px] md:w-[380px] aspect-[9/16] rounded-[28px] overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5 bg-slate-50 relative">
            <video
              className="w-full h-[110%] object-cover object-top"
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, white 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
