import React from 'react';

export const TrustSection: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'QUALITY',
      description: 'We focus on presenting stockfish and crayfish clearly, so you can choose what works for your meals.',
    },
    {
      num: '02',
      title: 'RELIABILITY',
      description: 'Straightforward products, clear information and a simple ordering experience.',
    },
    {
      num: '03',
      title: 'SIMPLICITY',
      description: 'Find what you need, make your selection and order directly.',
    }
  ];

  return (
    <section className="py-20 sm:py-32 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* Typographic Statement Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
              OUR APPROACH
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#071F16] leading-[1.05]">
            QUALITY WITHOUT THE COMPLICATION.
          </h2>

          <p className="text-base sm:text-lg text-[#6B7266] font-sans-clean font-light leading-relaxed">
            We keep things simple: quality products, clear choices and a straightforward way to order.
          </p>
        </div>

        {/* 3 Horizontal Principles Arranged with Editorial Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5DEC9] border-y border-[#E5DEC9]">
          {principles.map((principle) => (
            <div
              key={principle.num}
              className="py-10 md:py-12 px-6 sm:px-8 lg:px-12 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#B8954A]">
                    {principle.num}
                  </span>
                  <span className="text-[9px] font-sans-clean uppercase tracking-[0.3em] text-[#6B7266]">
                    Principle
                  </span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#071F16] tracking-wide">
                  {principle.title}
                </h3>

                <p className="text-sm sm:text-base text-[#6B7266] font-sans-clean font-light leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="pt-5 border-t border-[#E5DEC9] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#6B7266]">
                  Core Standard
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

