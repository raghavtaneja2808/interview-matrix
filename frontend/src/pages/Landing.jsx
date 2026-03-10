import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";

const Landing = () => {
  return (
    <div className="font-sans antialiased relative selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Landing;
