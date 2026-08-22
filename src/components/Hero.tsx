import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { heroImg } from '../data/products';
import { NavigationTab } from '../types';

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
      className="relative overflow-hidden min-h-[100svh] flex flex-col"
    >
      {/* Full-width background photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Premium stockfish and sun-dried crayfish provisions"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="sync"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Left-side gradient overlay for text readability — covers left ~55% on desktop, full width on mobile */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-[#071F16] via-[#071F16]/85 to-transparent'
            : 'bg-gradient-to-r from-[#F7F3EA] via-[#F7F3EA]/85 to-transparent'
        }`}
      />

      {/* Mobile: full-width bottom gradient for stacked layout readability */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none lg:hidden ${
          isDark
            ? 'bg-gradient-to-t from-[#071F16] via-[#071F16]/60 to-transparent'
            : 'bg-gradient-to-t from-[#F7F3EA] via-[#F7F3EA]/60 to-transparent'
        }`}
      />

      {/* Content layer */}
      <div className="relative z-20 flex-1 flex flex-col justify-between max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-14 pt-6 sm:pt-10 pb-8 sm:pb-12">

        {/* Top: Brand wordmark with drop shadow for contrast against photo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-1 max-w-md"
        >
          <span
            className={`font-editorial text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] ${
              isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
            }`}
          >
            {settings.name}
          </span>
          <span className={`text-[8px] sm:text-[10px] font-sans-clean font-bold tracking-[0.24em] sm:tracking-[0.32em] uppercase ${
            isDark ? 'text-[#C9A15A]' : 'text-[#1E5631]'
          } drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]`}>
            Stockfish & Crayfish Provisions
          </span>
        </motion.div>

        {/* Middle: Headline + tagline + CTAs */}
        <div className="flex-1 flex flex-col justify-center py-10 sm:py-12 lg:py-0 lg:max-w-[55%]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 sm:space-y-5"
          >
            <h1
              className={`font-editorial text-4xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[0.98] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}
            >
              PREMIUM STOCKFISH &{' '}
              <span className={`italic font-normal ${isDark ? 'text-[#C9A15A]' : 'text-[#1E5631]'}`}>
                SUN-DRIED CRAYFISH.
              </span>
            </h1>

            <div className={`w-24 h-[2px] bg-gradient-to-r ${isDark ? 'from-[#C9A15A]' : 'from-[#1E5631]'} to-transparent`} />

            <p
              className={`text-base sm:text-lg font-sans-clean font-normal leading-relaxed max-w-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.15)] ${
                isDark ? 'text-[#EDEDED]/90' : 'text-[#3D4F43]'
              }`}
            >
              Hand-selected, thoroughly cleaned, and delivered with dependable quality for everyday family cooking, caterers, and festive feasts.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-6 sm:pt-7"
          >
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

            <button
              onClick={() => onNavigate('products')}
              className={`btn-tactile inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-bold tracking-[0.18em] uppercase rounded-xl backdrop-blur-md group cursor-pointer border shadow-sm ${
                isDark
                  ? 'bg-[#0D3325]/80 hover:bg-[#164936] text-[#EDEDED] border-[#16382A] hover:border-[#C9A15A]/50'
                  : 'bg-[#FFFDF8]/90 hover:bg-[#FFFDF8] text-[#173B2A] border-[#E6DEC8] hover:border-[#1E5631]/50'
              }`}
            >
              <span>Shop Products</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isDark ? 'text-[#C9A15A]' : 'text-[#1E5631]'}`} />
            </button>
          </motion.div>
        </div>

        {/* Bottom: Circular trust badge — bottom-left anchor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end gap-4 sm:gap-6"
        >
          {/* Circular badge */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0">
            {/* Gold ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#C9A15A] shadow-[0_4px_20px_rgba(0,0,0,0.3)]" />
            {/* Inner dark green fill */}
            <div className="absolute inset-[3px] rounded-full bg-[#1E5631] flex flex-col items-center justify-center text-center p-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A15A] mb-1" />
              <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-sans-clean font-bold uppercase tracking-[0.12em] text-white leading-tight">
                100% Natural
              </span>
              <span className="text-[7px] sm:text-[8px] lg:text-[9px] font-sans-clean font-semibold uppercase tracking-[0.1em] text-[#C9A15A] leading-tight">
                & Hygienic
              </span>
            </div>
          </div>

          {/* Badge-adjacent micro-copy */}
          <div className="hidden sm:flex flex-col gap-1 pb-1">
            <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] ${isDark ? 'text-[#C9A15A]' : 'text-[#1E5631]'}`}>
              Direct Provisions
            </span>
            <span className={`text-[11px] font-sans-clean font-light leading-snug max-w-[200px] ${isDark ? 'text-[#EDEDED]/75' : 'text-[#3A3A3A]'}`}>
              Zero sand or debris. Rich natural aroma. Ready to cook.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
