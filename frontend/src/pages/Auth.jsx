import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";

// Feature bullet icons
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
  </svg>
);
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const FEATURES = [
  { Icon: ShieldIcon, label: "Realistic mock interviews" },
  { Icon: BrainIcon, label: "AI-powered feedback loop" },
  { Icon: BookIcon, label: "Curated industry question banks" },
];

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#e8621a">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) navigate("/dashboard", { replace: true });
    } catch { /* not logged in */ }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#f5f4f2] flex flex-col">
      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <Link to="/" className="font-bold text-base tracking-widest uppercase text-[#111111] hover:opacity-80 transition-opacity">
          Interview Matrix
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-xl shadow-black/[0.06] bg-white min-h-[600px]">

          {/* ── Left Panel ── */}
          <div className="flex-1 bg-white px-10 py-12 flex flex-col justify-between">
            <div className="flex flex-col gap-8">
              {/* Headline */}
              <div>
                <h1 className="font-display text-[52px] leading-[1.08] font-black text-[#111111] tracking-tight">
                  Meet Your Next
                  <br />
                  <em className="not-italic text-[#e8621a]" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
                    Recruiter
                  </em>
                  <span className="text-[#111111]">.</span>
                </h1>
                <p className="mt-4 text-[16px] text-[#666666] leading-relaxed max-w-[400px]">
                  Practice real interviews with our AI-driven platform and get hired by top companies. Built for the modern engineer.
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-4">
                {FEATURES.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#e8621a]/10 flex items-center justify-center text-[#e8621a] flex-shrink-0">
                      <Icon />
                    </div>
                    <span className="text-[15px] text-[#333333] font-medium">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial */}
            <div className="mt-10">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <blockquote className="text-[15px] text-[#444444] leading-relaxed italic font-serif max-w-[400px]">
                &ldquo;InterviewMatrix helped me land my dream job. The simulation was incredibly accurate, providing the confidence I needed to ace the final round.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-[#e0dbd5] overflow-hidden flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#aaa">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">Sarah Jenkins</p>
                  <p className="text-xs text-[#888888] tracking-wider uppercase">Senior Software Engineer</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="w-full lg:w-[480px] bg-[#f9f8f6] flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#ebebeb]">
              {[
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Create Account" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 text-sm font-medium transition-all duration-200 relative ${
                    activeTab === tab.id
                      ? "text-[#111111]"
                      : "text-[#999999] hover:text-[#555555]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2.5px] bg-[#e8621a] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Form area */}
            <div className="flex-1 px-8 py-8 overflow-y-auto">
              {activeTab === "signin" ? (
                <SignIn onSwitchToSignUp={() => setActiveTab("signup")} />
              ) : (
                <SignUp onSwitchToSignIn={() => setActiveTab("signin")} />
              )}
            </div>

            {/* Footer */}
            <div className="px-8 pb-6 text-center">
              <p className="text-xs text-[#aaaaaa] leading-relaxed">
                © 2024 InterviewMatrix Inc. All rights reserved.
                <br />
                By signing in, you agree to our{" "}
                <a href="#" className="text-[#888888] hover:text-[#555555] underline underline-offset-2">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-[#888888] hover:text-[#555555] underline underline-offset-2">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
