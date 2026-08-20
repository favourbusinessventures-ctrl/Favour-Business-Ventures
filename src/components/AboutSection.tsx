import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { stockfishBaleImg } from '../data/products';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

export const AboutSection: React.FC = () => {
  const { settings } = useBusinessSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  const values = [
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
    },
  ];

  return (
    <section id="about-section" className="py-16 sm:py-24 lg:py-32 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* =========================================================================
            OPENING: Editorial Introduction & Large Statement
           ========================================================================= */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] sm:text-[10.5px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
              WHY FAVOUR BUSINESS VENTURES
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#071F16] leading-[0.98]">
            GOOD MEALS BEGIN <br />
            <span className="italic font-normal text-[#B8954A]">WITH GOOD INGREDIENTS.</span>
          </h2>

          <div className="w-20 h-[1.5px] bg-[#B8954A]/70 mt-2" />
        </div>

        {/* =========================================================================
            MAIN COMPOSITION: 
            Desktop: Left Image / Right Story
            Mobile: Image first, Story second
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column (Desktop) / First (Mobile): Editorial Food Photography */}
          <div className="lg:col-span-6 order-1">
            <div className="p-3 sm:p-4 bg-[#FFF9EF] border border-[#E5DEC9] shadow-xl relative group rounded-[2px]">
              <div className="overflow-hidden bg-[#071F16] relative rounded-[1px]">
                <ImageWithPlaceholder
                  src={stockfishBaleImg}
                  alt="Stockfish provisions by Favour Business Ventures"
                  aspectRatioClass="aspect-4/3 sm:aspect-5/4"
                  theme="light"
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />

                {/* Subtle Refined Corner Badge */}
                <div className="absolute top-4 left-4 bg-[#071F16] text-[#F5F0E6] px-3.5 py-1.5 text-[9px] font-sans-clean font-semibold tracking-[0.25em] uppercase border border-[#B8954A]/40 pointer-events-none">
                  Authentic Food Stock
                </div>
              </div>

              {/* Minimal Caption Strip */}
              <div className="pt-3 px-1 flex items-center justify-between text-xs">
                <span className="font-editorial italic text-sm sm:text-base text-[#071F16]">
                  Natural curing, clean handling & rich umami
                </span>
                <span className="text-[9px] font-sans-clean uppercase tracking-[0.2em] text-[#B8954A] font-semibold">
                  Standard of Care
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Second (Mobile): Concise Brand Narrative */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 order-2">
            <div className="space-y-3">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.3em] text-[#B8954A] block">
                Our Purpose
              </span>
              
              <h3 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold text-[#071F16] leading-tight">
                Quality ingredients for everyday cooking and special occasions.
              </h3>
            </div>

            <div className="space-y-3.5 text-sm sm:text-base text-[#111511] font-sans-clean font-light leading-relaxed">
              <p>
                From everyday cooking to meals made for the people you love, the ingredients matter.
              </p>
              
              <p className="text-[#6B7266]">
                {settings.name} focuses on stockfish and crayfish — presented simply, clearly, and ready to order. We avoid unnecessary complexity and concentrate on delivering clean, dependable provisions directly to your doorstep.
              </p>
            </div>

            {/* Direct Action Link with tactile class */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile inline-flex items-center gap-2.5 px-8 py-4 bg-[#071F16] hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/40 text-xs font-bold tracking-[0.2em] uppercase shadow-md group rounded-xl"
              >
                <MessageCircle className="w-4 h-4 text-[#B8954A]" />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F5F0E6]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BRAND VALUES: 3 Simple Editorial Principles (Not Giant Cards)
           ========================================================================= */}
        <div className="pt-6 border-t border-[#E5DEC9] space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.3em] text-[#B8954A]">
                The Standards We Maintain
              </span>
            </div>
            <span className="text-[10px] font-sans-clean text-[#6B7266] uppercase tracking-[0.2em]">
              Favour Business Ventures
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 divide-y md:divide-y-0 md:divide-x divide-[#E5DEC9]">
            {values.map((val, idx) => (
              <div
                key={val.num}
                className={`space-y-2.5 ${idx > 0 ? 'pt-5 md:pt-0 md:pl-6 lg:pl-10' : ''}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-editorial text-2xl font-bold text-[#B8954A]">
                    {val.num}
                  </span>
                  <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#071F16] tracking-wide">
                    {val.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-[#6B7266] font-sans-clean font-light leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
