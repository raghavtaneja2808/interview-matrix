import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PageTransition = ({ to, children, className = "", ...props }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => navigate(to), 600);
    return () => clearTimeout(timer);
  }, [loading, navigate, to]);

  return (
    <>
      <button onClick={handleClick} className={className} {...props}>
        {children}
      </button>

      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="w-8 h-8 border-[3px] border-[#e5e5e5] border-t-[#e8621a] rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};

export default PageTransition;
