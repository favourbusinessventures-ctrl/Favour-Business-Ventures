import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { heroImg, crayfishWholeImg } from '../data/products';
import { NavigationTab } from '../types';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

interface HeroProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <section 
      id="hero-section" 
      className={`relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pb-32 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#E5E7EB]'
      }`}
    >
      {/* Subtle Atmospheric Depth Glows */}
      {isDark ? (
        <>
          <div className="absolute top-0 right-1/4 w-[38rem] h-[38rem] bg-[#0D3325]/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-20 w-88 h-88 bg-[#B8954A]/12 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-[#1E5631]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-[#8A9A5B]/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Editorial Masthead Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-center justify-between gap-3 sm:gap-4 py-2 px-4 rounded-full max-w-fit border shadow-sm backdrop-blur-md ${
            isDark
              ? 'bg-[#0D3325]/80 border-[#16382A] text-[#EDEDED]'
              : 'bg-white/90 border-[#E5E7EB] text-[#1A1A1A]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
            <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              FAVOUR BUSINESS VENTURES
            </span>
          </div>

          <span className={isDark ? 'text-[#16382A]' : 'text-[#E5E7EB]'}>•</span>

          <div className={`text-[10px] sm:text-[10.5px] font-sans-clean font-medium tracking-wider uppercase ${
            isDark ? 'text-[#EDEDED]/80' : 'text-[#525252]'
          }`}>
            Direct Provisions Desk
          </div>
        </motion.div>

        {/* 2-Column Responsive Layout: Text on Left / Showcase on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column (6 Cols Desktop) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className={`font-editorial text-4xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[0.98] tracking-tight ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                PREMIUM STOCKFISH & <br />
                <span className={`italic font-normal ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`}>
                  SUN-DRIED CRAYFISH.
                </span>
              </h1>
              
              <div className={`w-24 h-[2px] ${
                isDark 
                  ? 'bg-gradient-to-r from-[#B8954A] to-transparent' 
                  : 'bg-gradient-to-r from-[#1E5631] to-transparent'
              }`} />
            </motion.div>

            {/* Short Supporting Copy */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5 max-w-lg"
            >
              <p className={`text-base sm:text-lg font-sans-clean font-light leading-relaxed ${
                isDark ? 'text-[#EDEDED]/85' : 'text-[#525252]'
              }`}>
                Hand-selected, thoroughly cleaned, and delivered with dependable quality for everyday family cooking, caterers, and festive feasts.
              </p>

              {/* Quality Badges */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans-clean border shadow-xs backdrop-blur-xs ${
                  isDark 
                    ? 'bg-[#0D3325]/90 border-[#16382A] text-[#EDEDED]/90' 
                    : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
                }`}>
                  <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                  Zero Sand or Debris
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans-clean border shadow-xs backdrop-blur-xs ${
                  isDark 
                    ? 'bg-[#0D3325]/90 border-[#16382A] text-[#EDEDED]/90' 
                    : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
                }`}>
                  <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                  Rich Natural Aroma
                </span>
              </div>
            </motion.div>

            {/* Primary and Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              {/* Primary WhatsApp Order CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile btn-whatsapp-gold inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-xl group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#071F16]" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-[#071F16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Secondary Navigation CTA */}
              <button
                onClick={() => onNavigate('products')}
                className={`btn-tactile inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-semibold tracking-[0.18em] uppercase rounded-xl backdrop-blur-sm group cursor-pointer border shadow-sm ${
                  isDark
                    ? 'bg-[#0D3325]/90 hover:bg-[#164936] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                    : 'bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border-[#E5E7EB] hover:border-[#1E5631]/40'
                }`}
              >
                <span>Shop Products</span>
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
                  isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                }`} />
              </button>
            </motion.div>

          </div>

          {/* Right Column (6 Cols Desktop) — Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative mt-4 lg:mt-0"
          >
            {/* Main Card Container */}
            <div className={`p-3.5 sm:p-5 rounded-2xl border shadow-xl relative transition-all duration-300 ${
              isDark 
                ? 'bg-[#0D3325]/80 backdrop-blur-md border-[#16382A] hover:border-[#B8954A]/40' 
                : 'bg-white border-[#E5E7EB] hover:border-[#1E5631]/30'
            }`}>
              
              {/* Product Hero Image */}
              <div className={`relative overflow-hidden rounded-xl aspect-[16/11] ${
                isDark ? 'bg-[#071F16]' : 'bg-[#F5F5F0]'
              }`}>
                <ImageWithPlaceholder
                  src={heroImg}
                  alt="Authentic Stockfish and Clean Sun-Dried Crayfish"
                  aspectRatioClass="aspect-[16/11]"
                  theme={isDark ? 'dark' : 'light'}
                  priority={true}
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />
                
                {/* Floating Badge */}
                <div className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-lg text-[10px] font-sans-clean font-semibold tracking-[0.2em] uppercase border shadow-md pointer-events-none backdrop-blur-sm ${
                  isDark
                    ? 'bg-[#071F16]/90 text-[#EDEDED] border-[#B8954A]/40'
                    : 'bg-white/95 text-[#1A1A1A] border-[#E5E7EB]'
                }`}>
                  Direct Provisions
                </div>
              </div>

              {/* Minimal Caption Strip */}
              <div className="pt-4 px-1 flex items-center justify-between text-xs">
                <span className={`font-editorial italic text-sm sm:text-base ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Natural curing & rich savory aroma
                </span>
                <span className={`text-[10px] font-sans-clean uppercase tracking-[0.22em] font-semibold ${
                  isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                }`}>
                  Grade-A Selection
                </span>
              </div>
            </div>

            {/* Overlapping Card for Crayfish Accent */}
            <div className={`hidden sm:flex absolute -bottom-6 -left-6 backdrop-blur-md border p-3.5 sm:p-4 rounded-xl shadow-xl items-center gap-3.5 max-w-[290px] z-20 ${
              isDark
                ? 'bg-[#071F16]/95 border-[#B8954A]/40 text-[#EDEDED]'
                : 'bg-white/95 border-[#E5E7EB] text-[#1A1A1A]'
            }`}>
              <div className={`w-13 h-13 shrink-0 rounded-lg overflow-hidden border ${
                isDark ? 'bg-[#0D3325] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
              }`}>
                <ImageWithPlaceholder
                  src={crayfishWholeImg}
                  alt="Sun-dried whole crayfish"
                  aspectRatioClass="aspect-square"
                  theme={isDark ? 'dark' : 'light'}
                  priority={true}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className={`text-[9px] font-sans-clean font-semibold uppercase tracking-[0.22em] block ${
                  isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                }`}>
                  Sun-Dried
                </span>
                <p className={`font-editorial text-sm font-bold leading-tight ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Pure aroma & rich umami
                </p>
                <span className={`text-[10px] font-sans-clean block ${
                  isDark ? 'text-[#EDEDED]/65' : 'text-[#6B7266]'
                }`}>
                  Ready to cook
                </span>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
