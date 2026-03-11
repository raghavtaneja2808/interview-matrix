import { useState } from "react";

const FAQS = [
  {
    question: "How does the AI interviewer work?",
    answer:
      "Our AI interviewer simulates real interview scenarios using advanced language models. It asks adaptive follow-up questions based on your responses, just like a real recruiter would.",
  },
  {
    question: "What types of interviews does it support?",
    answer:
      "We support behavioral, technical, system design, product management, data science, and many more interview types across all major tech roles.",
  },
  {
    question: "Can I practice with my own job description?",
    answer:
      "Yes. Paste any job description and our AI will generate tailored interview questions specific to that role and company.",
  },
  {
    question: "How is my performance evaluated?",
    answer:
      "Every response is analyzed across five dimensions: clarity, confidence, structure, relevance, and depth. You get real-time scores and actionable feedback after each session.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. All interview sessions are encrypted end-to-end. We never share your data with employers or third parties.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Interview Matrix runs entirely in your browser. Just sign up and start practicing immediately.",
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer"
      >
        <span className="text-[#111111] text-[17px] font-semibold pr-8">
          {question}
        </span>
        <span
          className="text-[#e8621a] text-2xl shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <p className="text-[#555555] text-[15px] leading-relaxed pb-6">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <span className="text-[#e8621a] text-sm font-semibold tracking-wide">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#111111]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="border-t border-[#e5e5e5]">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
