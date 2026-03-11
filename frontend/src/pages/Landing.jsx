import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import Categories from "../components/landing/Categories";
import AIAnalysisIllustration from "../components/landing/AIAnalysisIllustration";
import Comparison from "../components/landing/Comparison";
import LogoCloud from "../components/landing/LogoCloud";
import Toolkit from "../components/landing/Toolkit";
import FAQ from "../components/landing/FAQ";

const Landing = () => {
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
