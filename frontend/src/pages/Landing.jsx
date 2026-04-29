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
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

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
