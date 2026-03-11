const CATEGORIES = [
  "Product Management",
  "Data Structures & Algorithms",
  "Engineering",
  "System Design",
  "Behavioral",
  "Data Science",
  "SQL",
  "Data Analytics",
  "Machine Learning",
  "BizOps & Strategy",
];

const Categories = () => {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-16 md:gap-24">
        {/* Left — pill tags */}
        <div className="flex-1 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="px-6 py-3 rounded-full bg-[#f3f3f3] text-[#111111] text-[15px] font-medium"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Right — text */}
        <div className="flex-1 flex flex-col gap-5">
          <span className="text-[#e8621a] text-sm font-semibold tracking-wide">
            Who&apos;s using it
          </span>
          <h2 className="text-[#111111] text-4xl md:text-5xl font-display font-bold leading-tight">
            How everyone in tech prepares
          </h2>
          <p className="text-[#555555] text-[17px] leading-relaxed max-w-[480px]">
            Interview Matrix supports interview prep for everyone in tech. From
            product management to software engineering and data roles, there are
            thousands of practice questions to choose from.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Categories;
