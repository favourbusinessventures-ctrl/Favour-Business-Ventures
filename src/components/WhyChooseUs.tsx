import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, PackageCheck, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const WhyChooseUs: React.FC = () => {
  const { isDark } = useTheme();

  const points = [
    {
      id: 'why-1',
      icon: Sparkles,
      num: '01',
      title: 'Hygienic Clean Handling',
      description: 'Our crayfish is thoroughly cleaned and sun-dried to eliminate sand, dust, and impurities. You get pure culinary flavor with zero waste.'
    },
    {
      id: 'why-2',
      icon: CheckCircle2,
      num: '02',
      title: 'Authentic Grade-A Sourcing',
      description: 'We source only genuine high-grade stockfish and coastal crayfish, ensuring rich umami depth and optimal texture in your soups and stews.'
    },
    {
      id: 'why-3',
      icon: PackageCheck,
      num: '03',
      title: 'Portion & Bulk Flexibility',
      description: 'From convenient household retail packs to catering bulk crates and commercial sacks, we cater precisely to your volume requirements.'
    },
    {
      id: 'why-4',
      icon: MessageSquare,
      num: '04',
      title: 'Direct WhatsApp Desk',
      description: 'Clear pricing, swift portion advice, live stock confirmation, and seamless dispatch delivered with personal care.'
    }
  ];

  return (
    <section 
      id="why-choose-us-section" 
      className={`py-20 sm:py-28 relative border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0D3325]/40 text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#F5F5F0] text-[#1A1A1A] border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header with Scroll Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2.5">
            <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
            <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              THE FBV DIFFERENCE
            </span>
          </div>

          <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.04] ${
            isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
          }`}>
            WHY CHOOSE FAVOUR BUSINESS VENTURES?
          </h2>

          <p className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
            isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
          }`}>
            We focus exclusively on two essential staples, guaranteeing unwavering quality, clean preparation, and honest customer service.
          </p>
        </motion.div>

        {/* 4 Crisp Pillars Grid with Glass Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.id}
                id={pt.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`card-glass-hover p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-6 group border transition-all duration-300 ${
                  isDark
                    ? 'bg-[#071F16]/90 backdrop-blur-sm border-[#16382A] hover:border-[#B8954A]/50 shadow-lg'
                    : 'bg-white border-[#E5E7EB] hover:border-[#1E5631]/40 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`font-editorial text-2xl font-bold ${
                      isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                    }`}>
                      {pt.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 border shadow-xs ${
                      isDark
                        ? 'bg-[#0D3325] border-[#16382A] text-[#B8954A] group-hover:border-[#B8954A]/40'
                        : 'bg-[#FAFAFA] border-[#E5E7EB] text-[#1E5631] group-hover:border-[#1E5631]/40'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`font-editorial text-xl sm:text-2xl font-bold transition-colors leading-snug ${
                    isDark
                      ? 'text-[#EDEDED] group-hover:text-[#B8954A]'
                      : 'text-[#1A1A1A] group-hover:text-[#1E5631]'
                  }`}>
                    {pt.title}
                  </h3>

                  {/* Text */}
                  <p className={`text-xs sm:text-sm font-sans-clean font-light leading-relaxed ${
                    isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
                  }`}>
                    {pt.description}
                  </p>
                </div>

                {/* Subtle Accent Bottom Line */}
                <div className={`w-full h-[1px] transition-colors ${
                  isDark
                    ? 'bg-[#16382A] group-hover:bg-[#B8954A]/40'
                    : 'bg-[#E5E7EB] group-hover:bg-[#1E5631]/40'
                }`} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
