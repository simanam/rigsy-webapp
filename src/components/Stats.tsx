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
    <section className="py-16 bg-[#161B22]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-[#F0F3F6] font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-[#6E7681]">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
