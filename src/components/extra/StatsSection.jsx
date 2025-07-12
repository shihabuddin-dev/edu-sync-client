import React from 'react';
import CountUp from 'react-countup';

const StatsSection = ({ title, stats, className = "" }) => {
  return (
    <section className={`bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 ${className}`} data-aos="zoom-in">
      <h2 className="text-xl md:text-2xl font-semibold text-base-content mb-6 text-center">{title}</h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center gap-2 w-full sm:w-auto">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full ${stat.bgColor} mb-2 text-2xl sm:text-3xl`}>
              {stat.icon}
            </div>
            <span className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${stat.textColor}`}>
              <CountUp
                end={stat.value}
                duration={5}
                decimals={stat.decimals || 0}
                separator=","
                enableScrollSpy={true}
                scrollSpyOnce={true}
              /> +
            </span>
            <span className="text-base-content/80 text-xs sm:text-sm md:text-base">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection; 