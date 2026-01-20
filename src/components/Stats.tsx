export default function Stats() {
  const stats = [
    {
      value: "3.5M+",
      label: "Truck Drivers in the US",
      sublabel: "Our target market",
    },
    {
      value: "94%",
      label: "Annual Turnover Rate",
      sublabel: "The retention crisis",
    },
    {
      value: "$87B",
      label: "Driver Shortage Cost",
      sublabel: "Economic impact per year",
    },
    {
      value: "250+",
      label: "Days Away From Home",
      sublabel: "Per year for OTR drivers",
    },
  ];

  return (
    <section className="py-16 bg-white" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Industry Statistics</h2>
      <div className="max-w-7xl mx-auto px-6">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <dd className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.value}
              </dd>
              <dt className="text-[#1F2937] font-medium mb-1">{stat.label}</dt>
              <dd className="text-sm text-[#9CA3AF]">{stat.sublabel}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
