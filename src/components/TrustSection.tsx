import React from 'react';

export const TrustSection: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'QUALITY',
      description: 'Carefully cured stockfish with firm flesh and clean sun-dried crayfish ready to enrich traditional recipes.',
    },
    {
      num: '02',
      title: 'RELIABILITY',
      description: 'Consistent attention to packaging, accurate quantities, and prompt dispatch for household kitchens and catering orders.',
    },
    {
      num: '03',
      title: 'SIMPLICITY',
      description: 'Direct communication on WhatsApp for transparent pricing, custom cuts, and quick confirmation in one easy chat.',
    }
  ];

  return (
    <section className="py-24 sm:py-36 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-16 sm:space-y-24">
        
        {/* Typographic Statement Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
              Core Principles
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#071F16]">
            What matters to us.
          </h2>

          <p className="text-base sm:text-lg text-[#6B7266] font-sans-clean font-light leading-relaxed">
            Good food starts with honest standards. We keep our business clear, focused, and dependable.
          </p>
        </div>

        {/* 3 Horizontal Principles Arranged with Editorial Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5DEC9] border-y border-[#E5DEC9]">
          {principles.map((principle) => (
            <div
              key={principle.num}
              className="py-12 md:py-14 px-6 sm:px-8 lg:px-12 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-editorial text-4xl font-bold text-[#B8954A]">
                    {principle.num}
                  </span>
                  <span className="text-[9px] font-sans-clean uppercase tracking-[0.3em] text-[#6B7266]">
                    Standard
                  </span>
                </div>

                <h3 className="font-editorial text-3xl font-bold text-[#071F16] tracking-wide">
                  {principle.title}
                </h3>

                <p className="text-sm sm:text-base text-[#6B7266] font-sans-clean font-light leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5DEC9] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#6B7266]">
                  Direct Standard
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
