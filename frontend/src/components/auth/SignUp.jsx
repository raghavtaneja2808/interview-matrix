import { useState } from "react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const SignUp = ({ onSwitchToSignIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend auth
    console.log("Sign up:", { name, email, password, agreed });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111111] tracking-tight">Create your account</h2>
        <p className="text-[#777777] text-sm mt-1">Start practicing interviews for free today.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#333333]">Full Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-[#e0e0e0] bg-white text-sm text-[#111111] placeholder:text-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#e8621a]/30 focus:border-[#e8621a] transition-all"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#333333]">Email Address</label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-[#e0e0e0] bg-white text-sm text-[#111111] placeholder:text-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#e8621a]/30 focus:border-[#e8621a] transition-all"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#333333]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 pr-11 rounded-lg border border-[#e0e0e0] bg-white text-sm text-[#111111] placeholder:text-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#e8621a]/30 focus:border-[#e8621a] transition-all"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-[#666666] transition-colors"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex gap-1 mt-1">
              {[8, 12, 16].map((threshold, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    password.length >= threshold
                      ? i === 0 ? "bg-red-400" : i === 1 ? "bg-yellow-400" : "bg-green-400"
                      : "bg-[#eeeeee]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                agreed ? "bg-[#111111] border-[#111111]" : "border-[#cccccc] bg-white"
              }`}
            >
              {agreed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-[#555555] leading-snug">
            I agree to the{" "}
            <a href="#" className="text-[#e8621a] hover:text-[#c54e12] font-medium">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-[#e8621a] hover:text-[#c54e12] font-medium">Privacy Policy</a>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-[#111111] hover:bg-black text-white text-sm font-semibold tracking-wide transition-colors duration-200 mt-1"
        >
          Create Account
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#eeeeee]" />
        <span className="text-xs text-[#aaaaaa] font-medium tracking-widest uppercase">Or continue with</span>
        <div className="flex-1 h-px bg-[#eeeeee]" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2.5 h-11 rounded-lg border border-[#e0e0e0] bg-white hover:bg-[#fafafa] text-sm font-medium text-[#333333] transition-colors duration-200">
          <GoogleIcon />
          Google
        </button>
        <button className="flex items-center justify-center gap-2.5 h-11 rounded-lg border border-[#e0e0e0] bg-white hover:bg-[#fafafa] text-sm font-medium text-[#333333] transition-colors duration-200">
          <LinkedInIcon />
          LinkedIn
        </button>
      </div>

      {/* Switch to sign in */}
      <p className="text-center text-sm text-[#777777]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-[#e8621a] hover:text-[#c54e12] transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default SignUp;
