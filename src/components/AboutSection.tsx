import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { stockfishBaleImg } from '../data/products';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

export const AboutSection: React.FC = () => {
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
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
    <section 
      id="about-section" 
      className={`py-16 sm:py-24 lg:py-32 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#F5F0E6] text-[#173B2A] border-[#DED4BF]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* =========================================================================
            OPENING: Editorial Introduction & Large Statement
           ========================================================================= */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#B58A32]'}`} />
            <span className={`text-[10px] sm:text-[10.5px] font-sans-clean font-bold tracking-[0.35em] uppercase ${
              isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
            }`}>
              WHY FAVOUR BUSINESS VENTURES
            </span>
          </div>

          <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.98] ${
            isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
          }`}>
            GOOD MEALS BEGIN <br />
            <span className={`italic font-normal ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`}>
              WITH GOOD INGREDIENTS.
            </span>
          </h2>

          <div className={`w-20 h-[1.5px] mt-2 ${isDark ? 'bg-[#B8954A]/70' : 'bg-[#B58A32]/50'}`} />
        </div>

        {/* =========================================================================
            MAIN COMPOSITION: 
            Desktop: Left Image / Right Story
            Mobile: Image first, Story second
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column (Desktop) / First (Mobile): Editorial Food Photography */}
          <div className="lg:col-span-6 order-1">
            <div className={`p-3 sm:p-4 border shadow-xl relative group rounded-2xl transition-colors duration-300 ${
              isDark 
                ? 'bg-[#0D3325] border-[#16382A]' 
                : 'bg-[#FFFDF8] border-[#DED4BF] shadow-[0_4px_20px_rgba(23,59,42,0.06)]'
            }`}>
              <div className="overflow-hidden bg-[#071F16] relative rounded-xl">
                <ImageWithPlaceholder
                  src={stockfishBaleImg}
                  alt="Stockfish provisions by Favour Business Ventures"
                  aspectRatioClass="aspect-[4/3] sm:aspect-[5/4]"
                  theme={isDark ? 'dark' : 'light'}
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />

                {/* Subtle Refined Corner Badge */}
                <div className={`absolute top-4 left-4 px-3.5 py-1.5 text-[9px] font-sans-clean font-bold tracking-[0.25em] uppercase border pointer-events-none rounded-md shadow-md ${
                  isDark
                    ? 'bg-[#071F16] text-[#EDEDED] border-[#B8954A]/40'
                    : 'bg-[#FFFDF8] text-[#173B2A] border-[#DED4BF]'
                }`}>
                  Authentic Food Stock
                </div>
              </div>

              {/* Minimal Caption Strip */}
              <div className="pt-3 px-1 flex items-center justify-between text-xs">
                <span className={`font-editorial italic text-sm sm:text-base ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
                }`}>
                  Natural curing, clean handling & rich umami
                </span>
                <span className={`text-[9px] font-sans-clean uppercase tracking-[0.2em] font-bold ${
                  isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
                }`}>
                  Standard of Care
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Second (Mobile): Concise Brand Narrative */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 order-2">
            <div className="space-y-3">
              <span className={`text-[10px] font-sans-clean font-bold uppercase tracking-[0.3em] block ${
                isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
              }`}>
                Our Purpose
              </span>
              
              <h3 className={`font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}>
                Quality ingredients for everyday cooking and special occasions.
              </h3>
            </div>

            <div className={`space-y-3.5 text-sm sm:text-base font-sans-clean font-medium leading-relaxed ${
              isDark ? 'text-[#EDEDED]/80' : 'text-[#173B2A]'
            }`}>
              <p>
                From everyday cooking to meals made for the people you love, the ingredients matter.
              </p>
              
              <p className={isDark ? 'text-[#EDEDED]/65' : 'text-[#35463C]'}>
                {settings.name} focuses on stockfish and crayfish — presented simply, clearly, and ready to order. We avoid unnecessary complexity and concentrate on delivering clean, dependable provisions directly to your doorstep.
              </p>
            </div>

            {/* Direct Action Link with tactile class */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-tactile inline-flex items-center gap-2.5 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase shadow-md group rounded-xl cursor-pointer min-h-[48px] ${
                  isDark
                    ? 'bg-[#0D3325] hover:bg-[#164936] text-[#EDEDED] border border-[#16382A] hover:border-[#B8954A]/50'
                    : 'bg-[#173B2A] hover:bg-[#28533C] text-white border border-[#173B2A]'
                }`}
              >
                <MessageCircle className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-white'}`} />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BRAND VALUES: 3 Simple Editorial Principles
           ========================================================================= */}
        <div className={`pt-6 border-t space-y-6 sm:space-y-8 ${
          isDark ? 'border-[#16382A]' : 'border-[#DED4BF]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#B58A32]'}`} />
              <span className={`text-[10px] font-sans-clean font-bold uppercase tracking-[0.3em] ${
                isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
              }`}>
                The Standards We Maintain
              </span>
            </div>
            <span className={`text-[10px] font-sans-clean uppercase tracking-[0.2em] font-semibold ${
              isDark ? 'text-[#EDEDED]/50' : 'text-[#667268]'
            }`}>
              Favour Business Ventures
            </span>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 divide-y md:divide-y-0 md:divide-x ${
            isDark ? 'divide-[#16382A]' : 'divide-[#DED4BF]'
          }`}>
            {values.map((val, idx) => (
              <div
                key={val.num}
                className={`space-y-2.5 ${idx > 0 ? 'pt-5 md:pt-0 md:pl-6 lg:pl-10' : ''}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-editorial text-2xl font-bold ${
                    isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
                  }`}>
                    {val.num}
                  </span>
                  <h4 className={`font-editorial text-xl sm:text-2xl font-bold tracking-wide ${
                    isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
                  }`}>
                    {val.title}
                  </h4>
                </div>

                <p className={`text-xs sm:text-sm font-sans-clean font-normal leading-relaxed ${
                  isDark ? 'text-[#EDEDED]/65' : 'text-[#35463C]'
                }`}>
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
