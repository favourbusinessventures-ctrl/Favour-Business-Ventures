import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { heroImg, crayfishWholeImg } from '../data/products';
import { NavigationTab } from '../types';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

interface HeroProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { settings } = useBusinessSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <section id="hero-section" className="relative bg-[#071F16] text-[#F5F0E6] overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pb-32 border-b border-[#16382A]">
      {/* Subtle Atmospheric Depth — Multi-layered Deep Emerald & Warm Gold Glows */}
      <div className="absolute top-0 right-1/4 w-[38rem] h-[38rem] bg-[#0D3325]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-88 h-88 bg-[#B8954A]/12 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Editorial Masthead Pill — Subtle Entrance */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-3 sm:gap-4 py-2 px-4 rounded-full bg-[#0D3325]/80 backdrop-blur-md border border-[#16382A] max-w-fit shadow-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8954A] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-[#B8954A]">
              FAVOUR BUSINESS VENTURES
            </span>
          </div>

          <span className="text-[#16382A]">•</span>

          <div className="text-[10px] sm:text-[10.5px] font-sans-clean font-medium tracking-wider uppercase text-[#F5F0E6]/80">
            Direct Provisions Desk
          </div>
        </motion.div>

        {/* 2-Column Responsive Layout: Text on Left / Glass Food Showcase on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column (6 Cols Desktop) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            {/* Main Headline — Refined Fade + Upward Motion */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold text-[#F5F0E6] leading-[0.98] tracking-tight">
                PREMIUM STOCKFISH & <br />
                <span className="text-[#B8954A] italic font-normal">SUN-DRIED CRAYFISH.</span>
              </h1>
              
              <div className="w-24 h-[2px] bg-gradient-to-r from-[#B8954A] to-transparent" />
            </motion.div>

            {/* Short Supporting Copy — Clear in 3 Seconds */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5 max-w-lg"
            >
              <p className="text-base sm:text-lg text-[#F5F0E6]/85 font-sans-clean font-light leading-relaxed">
                Hand-selected, thoroughly cleaned, and delivered with dependable quality for everyday family cooking, caterers, and festive feasts.
              </p>

              {/* Quality Badges */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0D3325]/90 backdrop-blur-xs border border-[#16382A] rounded-full text-xs text-[#F5F0E6]/90 font-sans-clean shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8954A]" />
                  Zero Sand or Debris
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0D3325]/90 backdrop-blur-xs border border-[#16382A] rounded-full text-xs text-[#F5F0E6]/90 font-sans-clean shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8954A]" />
                  Rich Natural Aroma
                </span>
              </div>
            </motion.div>

            {/* Primary and Secondary CTAs — Refined Staggered Entrance */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              {/* Primary WhatsApp Order CTA — Visual Focal Point */}
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
                className="btn-tactile inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#0D3325]/90 hover:bg-[#164936] text-[#F5F0E6] border border-[#16382A] hover:border-[#B8954A]/50 text-xs font-semibold tracking-[0.18em] uppercase rounded-xl backdrop-blur-sm group cursor-pointer shadow-md"
              >
                <span>Shop Products</span>
                <ArrowRight className="w-4 h-4 text-[#B8954A] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>

          {/* Right Column (6 Cols Desktop) — Translucent Glass Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative mt-4 lg:mt-0"
          >
            {/* Main Glass Card Container */}
            <div className="p-3.5 sm:p-5 bg-[#0D3325]/80 backdrop-blur-md border border-[#16382A] hover:border-[#B8954A]/40 rounded-2xl shadow-2xl relative transition-all duration-300">
              
              {/* Product Hero Image */}
              <div className="relative overflow-hidden rounded-xl bg-[#071F16] aspect-16/11">
                <ImageWithPlaceholder
                  src={heroImg}
                  alt="Authentic Stockfish and Clean Sun-Dried Crayfish"
                  aspectRatioClass="aspect-16/11"
                  theme="dark"
                  priority={true}
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />
                
                {/* Floating Translucent Glass Badge */}
                <div className="absolute top-4 left-4 bg-[#071F16]/90 backdrop-blur-sm text-[#F5F0E6] px-3.5 py-1.5 rounded-lg text-[10px] font-sans-clean font-semibold tracking-[0.2em] uppercase border border-[#B8954A]/40 shadow-lg pointer-events-none">
                  Direct Provisions
                </div>
              </div>

              {/* Minimal Caption Strip */}
              <div className="pt-4 px-1 flex items-center justify-between text-xs">
                <span className="font-editorial italic text-sm sm:text-base text-[#F5F0E6]">
                  Natural curing & rich savory aroma
                </span>
                <span className="text-[10px] font-sans-clean uppercase tracking-[0.22em] text-[#B8954A] font-semibold">
                  Grade-A Selection
                </span>
              </div>
            </div>

            {/* Overlapping Glass Card for Crayfish Accent */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#071F16]/95 backdrop-blur-md border border-[#B8954A]/40 p-3.5 sm:p-4 rounded-xl shadow-2xl items-center gap-3.5 max-w-[290px] z-20">
              <div className="w-13 h-13 shrink-0 rounded-lg overflow-hidden bg-[#0D3325] border border-[#16382A]">
                <ImageWithPlaceholder
                  src={crayfishWholeImg}
                  alt="Sun-dried whole crayfish"
                  aspectRatioClass="aspect-square"
                  theme="dark"
                  priority={true}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.22em] text-[#B8954A] block">
                  Sun-Dried
                </span>
                <p className="font-editorial text-sm font-bold text-[#F5F0E6] leading-tight">
                  Pure aroma & rich umami
                </p>
                <span className="text-[10px] text-[#F5F0E6]/65 font-sans-clean block">
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
