import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, PackageCheck, MessageSquare } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
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
      description: 'We source only genuine high-grade stockfish and coastal crayfish, ensuring rich umami richness and optimal texture in your soups and stews.'
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
      description: 'Clear pricing, swift portion advice, live stock confirmation, and seamless nationwide logistics delivered with personal care.'
    }
  ];

  return (
    <section id="why-choose-us-section" className="py-20 sm:py-28 bg-[#0D3325]/40 text-[#F5F0E6] relative border-b border-[#16382A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-6 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
              THE FBV DIFFERENCE
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F0E6] leading-[1.04]">
            WHY CHOOSE FAVOUR BUSINESS VENTURES?
          </h2>

          <p className="text-sm sm:text-base text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
            We focus exclusively on two essential Nigerian staples, guaranteeing unwavering quality, clean preparation, and honest customer service.
          </p>
        </div>

        {/* 4 Crisp Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.id}
                id={pt.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#071F16]/80 backdrop-blur-sm border border-[#16382A] hover:border-[#B8954A]/40 p-6 sm:p-7 rounded-xl shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-editorial text-2xl font-bold text-[#B8954A]">
                      {pt.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#0D3325] border border-[#16382A] flex items-center justify-center text-[#B8954A] group-hover:border-[#B8954A]/30 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors leading-snug">
                    {pt.title}
                  </h3>

                  {/* Text */}
                  <p className="text-xs sm:text-sm text-[#F5F0E6]/70 font-sans-clean font-light leading-relaxed">
                    {pt.description}
                  </p>
                </div>

                {/* Subtle Accent Bottom Line */}
                <div className="w-full h-[1px] bg-[#16382A] group-hover:bg-[#B8954A]/40 transition-colors" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
