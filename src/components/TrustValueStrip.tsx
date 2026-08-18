import React from 'react';
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
      <div className="bg-[#0D3325]/85 backdrop-blur-md border border-[#16382A] rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x-0 lg:divide-x divide-[#16382A]">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`flex items-start gap-4 ${
                  index > 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                {/* Icon Badge */}
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#071F16] border border-[#B8954A]/30 flex items-center justify-center text-[#B8954A] shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-[#F5F0E6] tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#F5F0E6]/70 font-sans-clean font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
