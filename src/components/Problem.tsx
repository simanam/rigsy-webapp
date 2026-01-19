export default function Problem() {
  const problems = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
      title: "The Isolation Crisis",
      stat: "250+",
      statLabel: "days/year away from home",
      description:
        "Long-haul truckers spend months in complete solitude. This isolation contributes to depression, anxiety, and a staggering 94% annual turnover rate in the industry.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Compliance Friction",
      stat: "14hrs",
      statLabel: "of daily ELD management",
      description:
        "ELD management requires constant tablet interaction while tired, in a hurry, or wearing gloves. Pre-trip inspections become tedious checkbox exercises leading to compliance shortcuts.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "Health Deterioration",
      stat: "2x",
      statLabel: "higher obesity rate",
      description:
        "The sedentary nature of trucking combined with limited healthy food options creates a health crisis. Drivers face elevated risks of diabetes, cardiovascular disease, and chronic pain.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      title: "Information Fragmentation",
      stat: "6+",
      statLabel: "apps to juggle daily",
      description:
        "Drivers juggle multiple apps for navigation, ELD, fuel, parking, weather, and load management. Finding truck-safe routes or available parking becomes a frustrating scavenger hunt.",
    },
  ];

  return (
    <section id="problem" className="py-24 bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F0F3F6] mb-4">
            Trucking&apos;s Hidden Crisis
          </h2>
          <p className="text-xl text-[#8B949E] max-w-2xl mx-auto">
            3.5 million professional truck drivers face daily challenges that
            most apps ignore. We&apos;re changing that.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-[#161B22] border border-[#21262D] hover:border-[#4B5EAA]/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#F85149]/10 text-[#F85149] group-hover:bg-[#F85149]/20 transition-colors">
                  {problem.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#F0F3F6] mb-2">
                    {problem.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-[#FF6B35]">
                      {problem.stat}
                    </span>
                    <span className="text-sm text-[#8B949E]">
                      {problem.statLabel}
                    </span>
                  </div>
                  <p className="text-[#8B949E] leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition statement */}
        <div className="mt-16 text-center">
          <p className="text-2xl text-[#8B949E]">
            <span className="text-[#F0F3F6] font-semibold">
              Truckers deserve better.
            </span>{" "}
            They need a co-pilot, not another app.
          </p>
        </div>
      </div>
    </section>
  );
}
