import PageTransition from "../common/PageTransition";

const TOOLS = [
  {
    title: "AI Resume Builder",
    description: "Create ATS-optimized resumes in minutes with AI-powered formatting and content suggestions.",
  },
  {
    title: "Cover Letter Generator",
    description: "Generate personalized cover letters tailored to each job application.",
  },
  {
    title: "Interview Buddy",
    description: "Get real-time AI assistance during your live job interviews.",
  },
  {
    title: "Auto-Apply",
    description: "Automatically apply to matching jobs with tailored applications.",
  },
];

const Toolkit = () => {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-[#111111] text-center">
          Complete Your Job Search Toolkit
        </h2>

        {/* Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.title}
              className="bg-white rounded-2xl p-6 border border-[#e5e5e5] hover:-translate-y-1 transition-transform duration-200"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-[#111111] text-lg font-bold mb-3">{tool.title}</h3>
              <p className="text-[#555555] text-[15px] leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>

        {/* Decorative curves + CTA */}
        <div className="flex flex-col items-center gap-6 -mt-2">
          {/* Curves */}
          <svg className="w-full stroke-[#d4d4d4] stroke-2" width="1000" height="152" viewBox="0 0 1000 152" fill="none">
            <path d="M0 0C107 105 393 73 415 152" />
            <path d="M1000 0C893 105 607 73 585 152" />
          </svg>

          <h3 className="text-2xl md:text-4xl font-display font-bold text-[#111111] text-center">
            We help job seekers get a job quicker
          </h3>

          <PageTransition
            to="/auth"
            className="bg-[#e8621a] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#d15516] transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
            style={{ boxShadow: "0 8px 20px -4px rgba(232, 98, 26, 0.35)" }}
          >
            Start now
          </PageTransition>
        </div>
      </div>
    </section>
  );
};

export default Toolkit;
