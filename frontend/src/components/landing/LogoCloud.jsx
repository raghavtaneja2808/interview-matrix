const LOGOS = [
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Slack", url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
  { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
];

const LogoCloud = () => {
  return (
    <section className="w-full border-t border-slate-100 bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {LOGOS.map((logo) => (
            <img
              key={logo.name}
              src={logo.url}
              alt={logo.name}
              className="h-7 mx-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
