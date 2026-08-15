import React from 'react';
import { ShieldCheck, Clock, MessageCircle, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPoints = [
    {
      title: 'Quality Products',
      description: 'Carefully sourced stockfish with firm texture and clean, well-winnowed sun-dried crayfish for rich, authentic culinary flavor.',
      icon: ShieldCheck,
    },
    {
      title: 'Reliable Service',
      description: 'Dependable order fulfillment, careful packing, and transparent communication for household kitchens and catering businesses.',
      icon: Clock,
    },
    {
      title: 'Easy Direct Ordering',
      description: 'Direct interaction with our sales team on WhatsApp. Receive prompt answers, order confirmation, and details in one chat.',
      icon: MessageCircle,
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#faf7f2] border-b border-[#ece6d9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-[#c59b27]" />
            <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#c59b27]">
              Our Principles
            </span>
            <span className="w-6 h-[1px] bg-[#c59b27]" />
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#122b1e]">
            A Dependable Food Supply
          </h2>
          <p className="text-sm sm:text-base text-[#57534a] font-sans-clean font-light leading-relaxed">
            Built on a clear focus: supplying authentic, clean dried food staples with straightforward customer care.
          </p>
        </div>

        {/* 3-Column Editorial Grid (not generic rounded cards, but elegant bordered columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e6dfd1] border-y border-[#e6dfd1]">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="py-10 md:py-8 px-6 lg:px-10 space-y-4 text-center md:text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-[#f3eee5] border border-[#e2dbcd] flex items-center justify-center text-[#122b1e] mx-auto md:mx-0">
                    <Icon className="w-5 h-5 text-[#c59b27]" />
                  </div>
                  
                  <h3 className="font-editorial text-2xl font-bold text-[#122b1e]">
                    {point.title}
                  </h3>
                  
                  <p className="text-sm text-[#57534a] font-sans-clean font-light leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <div className="pt-4">
                  <span className="text-[10px] font-sans-clean font-semibold tracking-[0.2em] uppercase text-[#8a8477]">
                    0{index + 1} • Standard
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
