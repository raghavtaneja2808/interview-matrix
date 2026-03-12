import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import Categories from "../components/landing/Categories";
import AIAnalysisIllustration from "../components/landing/AIAnalysisIllustration";
import Comparison from "../components/landing/Comparison";
import LogoCloud from "../components/landing/LogoCloud";
import Toolkit from "../components/landing/Toolkit";
import FAQ from "../components/landing/FAQ";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) navigate("/dashboard", { replace: true });
    } catch { /* not logged in */ }
  }, [navigate]);

  return (
    <div className="font-sans antialiased relative selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Categories />
      <AIAnalysisIllustration />
      <Comparison />
      <Toolkit />
      <FAQ />
    </div>
  );
};

export default Landing;
