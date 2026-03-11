import PageTransition from "./PageTransition";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 bg-transparent">
      <div className="text-[#111111] font-bold text-base tracking-widest uppercase">
        Interview Matrix
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#product" className="text-[15px] text-[#555555] hover:text-[#111111] transition-colors duration-200">Product</a>
        <a href="#features" className="text-[15px] text-[#555555] hover:text-[#111111] transition-colors duration-200">Features</a>
        <a href="#pricing" className="text-[15px] text-[#555555] hover:text-[#111111] transition-colors duration-200">Pricing</a>
      </div>
      <PageTransition
        to="/auth"
        className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#e8621a] hover:bg-[#d15516] transition-colors duration-200 text-white text-[15px] font-medium tracking-wide cursor-pointer"
      >
        Get Access
      </PageTransition>
    </nav>
  );
};

export default Navbar;
