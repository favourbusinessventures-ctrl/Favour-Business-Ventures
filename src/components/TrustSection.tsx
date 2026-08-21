import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TrustSection: React.FC = () => {
  const { isDark } = useTheme();
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
    <section className={`py-20 sm:py-32 border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
        : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#E5E7EB]'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* Typographic Statement Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
            <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              OUR APPROACH
            </span>
          </div>

          <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] ${
            isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
          }`}>
            QUALITY WITHOUT THE COMPLICATION.
          </h2>

          <p className={`text-base sm:text-lg font-sans-clean font-light leading-relaxed ${
            isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
          }`}>
            We keep things simple: quality products, clear choices and a straightforward way to order.
          </p>
        </div>

        {/* 3 Horizontal Principles Arranged with Editorial Dividers */}
        <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-y ${
          isDark 
            ? 'divide-[#16382A] border-[#16382A]' 
            : 'divide-[#E5E7EB] border-[#E5E7EB]'
        }`}>
          {principles.map((principle) => (
            <div
              key={principle.num}
              className="py-10 md:py-12 px-6 sm:px-8 lg:px-12 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-baseline justify-between">
                  <span className={`font-editorial text-3xl sm:text-4xl font-bold ${
                    isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                  }`}>
                    {principle.num}
                  </span>
                  <span className={`text-[9px] font-sans-clean uppercase tracking-[0.3em] ${
                    isDark ? 'text-[#EDEDED]/50' : 'text-[#6B7266]'
                  }`}>
                    Principle
                  </span>
                </div>

                <h3 className={`font-editorial text-2xl sm:text-3xl font-bold tracking-wide ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  {principle.title}
                </h3>

                <p className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
                  isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
                }`}>
                  {principle.description}
                </p>
              </div>

              <div className={`pt-5 border-t flex items-center gap-2 ${
                isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'
                }`} />
                <span className={`text-[10px] font-sans-clean uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#EDEDED]/60' : 'text-[#6B7266]'
                }`}>
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

