import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowDown, ArrowUpRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { heroImg, crayfishWholeImg } from '../data/products';
import { NavigationTab } from '../types';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

interface HeroProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section className="relative bg-[#071F16] text-[#F5F0E6] overflow-hidden pt-4 pb-16 sm:pt-6 sm:pb-24 lg:pb-32 border-b border-[#16382A]">
      {/* Subtle Atmospheric Depth — Deep Forest and Muted Brass Glow */}
      <div className="absolute top-0 right-1/3 w-[32rem] h-[32rem] bg-[#0D3325]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B8954A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 relative z-10">
        
        {/* Editorial Masthead Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-4 py-3 mb-6 sm:mb-10 border-b border-[#16382A]/80"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
              PROVISIONS DESK
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-sans-clean font-medium tracking-[0.22em] uppercase text-[#F5F0E6]/60">
            <span className="hidden sm:inline">Stockfish & Crayfish Provisions</span>
            <span className="w-1 h-1 rounded-full bg-[#B8954A]" />
            <span className="text-[#F5F0E6]/80">Direct WhatsApp Desk</span>
          </div>
        </motion.div>

        {/* Asymmetric Editorial Grid: 40% Text / 60% Food Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: ~40% Visual Weight (5 of 12 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            
            {/* Subtle Editorial Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[#B8954A]" />
                <span className="text-[10.5px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
                  FAVOUR BUSINESS VENTURES
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-bold text-[#F5F0E6] leading-[0.96] tracking-tight">
                GOOD FOOD <br />
                STARTS WITH <br />
                <span className="italic font-normal text-[#B8954A]">GOOD INGREDIENTS.</span>
              </h1>
              
              {/* Thin Muted Brass Rule */}
              <div className="w-20 sm:w-24 h-[1.5px] bg-[#B8954A]/80 mt-3" />
            </motion.div>

            {/* Product Subtitle & Supporting Copy */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2.5 pt-1 max-w-md"
            >
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F5F0E6] tracking-wide">
                STOCKFISH & CRAYFISH
              </h2>
              <p className="text-sm sm:text-base text-[#F5F0E6]/80 font-sans-clean font-light leading-relaxed">
                Quality stockfish and crayfish for the meals that matter.
              </p>
            </motion.div>

            {/* Sophisticated Rectangular CTAs with Tactile Interactions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase shadow-lg group rounded-[2px]"
              >
                <MessageCircle className="w-4 h-4 text-[#071F16]" />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={() => onNavigate('products')}
                className="btn-tactile inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0D3325] hover:bg-[#164936] text-[#F5F0E6] border border-[#16382A] hover:border-[#B8954A]/50 text-xs font-semibold tracking-[0.18em] uppercase cursor-pointer rounded-[2px]"
              >
                <span>Explore Products</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#B8954A]" />
              </button>
            </motion.div>

            {/* Minimal Editorial Category Markers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="pt-4 border-t border-[#16382A] flex items-center justify-between text-xs text-[#F5F0E6]/60 font-sans-clean max-w-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#F5F0E6]/85 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                  01 / Stockfish
                </span>
                <span className="text-[#F5F0E6]/85 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                  02 / Crayfish
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8954A] font-medium">
                Direct Supply
              </span>
            </motion.div>

          </div>

          {/* Right Column: ~60% Visual Dominance (7 of 12 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative mt-4 lg:mt-0"
          >
            {/* Primary Large Editorial Photo Frame */}
            <div className="p-3 sm:p-4 bg-[#0D3325] border border-[#16382A] shadow-2xl relative rounded-[2px]">
              
              {/* Image Canvas: Deep Green Frame */}
              <div className="relative overflow-hidden bg-[#071F16] rounded-[1px]">
                <ImageWithPlaceholder
                  src={heroImg}
                  alt="Quality stockfish and sun-dried crayfish by Favour Business Ventures"
                  aspectRatioClass="aspect-4/3 sm:aspect-16/11 lg:aspect-16/11"
                  theme="dark"
                  priority={true}
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />
                
                {/* Subtle Refined Dark Luxury Tag */}
                <div className="absolute top-4 left-4 bg-[#071F16]/90 backdrop-blur-xs text-[#F5F0E6] px-3.5 py-1.5 text-[9.5px] font-sans-clean font-semibold tracking-[0.25em] uppercase border border-[#B8954A]/40 pointer-events-none">
                  Direct Provisions
                </div>
              </div>

              {/* Minimal Caption Strip */}
              <div className="pt-3 flex items-center justify-between text-xs px-1">
                <span className="font-editorial italic text-sm sm:text-base text-[#F5F0E6]">
                  Natural curing & rich savory aroma
                </span>
                <span className="text-[9px] font-sans-clean uppercase tracking-[0.22em] text-[#B8954A] font-semibold">
                  Selected Stock
                </span>
              </div>
            </div>

            {/* Asymmetric Overlapping Inset: Highlights Whole Sun-Dried Golden Crayfish */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#071F16] border border-[#B8954A]/40 p-3.5 sm:p-4 shadow-2xl items-center gap-3.5 max-w-[280px] z-20 rounded-[2px]">
              <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#0D3325] border border-[#16382A] rounded-[1px]">
                <ImageWithPlaceholder
                  src={crayfishWholeImg}
                  alt="Sun-dried whole crayfish"
                  aspectRatioClass="aspect-square"
                  theme="dark"
                  priority={true}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] block">
                  Sun-Dried
                </span>
                <p className="font-editorial text-sm font-bold text-[#F5F0E6] leading-tight">
                  Rich aroma & pure color
                </p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
