import React from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const TrustValueStrip: React.FC = () => {
  const values = [
    {
      id: 'val-quality',
      icon: Award,
      title: 'Quality Products',
      subtitle: 'Grade-A hand-selected stockfish cuts and whole golden crayfish.',
    },
    {
      id: 'val-fresh',
      icon: Sparkles,
      title: 'Freshly Cleaned',
      subtitle: 'Sun-dried to perfection, cleanly sorted with zero sand or debris.',
    },
    {
      id: 'val-reliable',
      icon: ShieldCheck,
      title: 'Reliable Service',
      subtitle: 'Transparent portions, verified weights, and attentive customer care.',
    },
    {
      id: 'val-convenient',
      icon: Truck,
      title: 'Convenient Ordering',
      subtitle: 'Direct WhatsApp ordering with swift and dependable dispatch.',
    },
  ];

  return (
    <section
      id="trust-value-strip"
      className="relative z-20 -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-14"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0D3325]/90 backdrop-blur-md border border-[#16382A] rounded-2xl shadow-2xl p-5 sm:p-7 lg:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x-0 lg:divide-x divide-[#16382A]">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                id={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-start gap-4 group ${
                  index > 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                {/* Icon Badge */}
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#071F16] border border-[#B8954A]/30 flex items-center justify-center text-[#B8954A] shadow-inner group-hover:border-[#B8954A] group-hover:bg-[#071F16]/90 transition-all duration-300">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-[#F5F0E6] tracking-wide group-hover:text-[#B8954A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#F5F0E6]/70 font-sans-clean font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
