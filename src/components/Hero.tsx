import React from 'react';
import { MessageCircle, ArrowDown, ArrowUpRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { heroImg, crayfishWholeImg } from '../data/products';
import { NavigationTab } from '../types';

interface HeroProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section className="relative bg-[#071F16] text-[#F5F0E6] overflow-hidden pt-6 pb-20 sm:pt-8 sm:pb-28 lg:pb-32 border-b border-[#16382A]">
      {/* Subtle Ambient Light Effect in Deep Green */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#164936]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B8954A]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Top Minimal Editorial Tagline Bar */}
        <div className="flex items-center justify-between gap-4 py-3 mb-8 sm:mb-12 border-b border-[#16382A]/80">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
              FAVOUR BUSINESS VENTURES
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-sans-clean font-medium tracking-[0.22em] uppercase text-[#F5F0E6]/60">
            <span className="hidden sm:inline">Stockfish & Crayfish Provisions</span>
            <span className="w-1 h-1 rounded-full bg-[#B8954A]" />
            <span className="text-[#F5F0E6]/80">Direct WhatsApp Desk</span>
          </div>
        </div>

        {/* Asymmetric Hero Spread: Dark Luxury Green Canvas with Warm Food Contrast */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic Command */}
          <div className="lg:col-span-6 space-y-7 sm:space-y-9">
            
            {/* Small Eyebrow */}
            <div className="space-y-3">
              <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A] block">
                FAVOUR BUSINESS VENTURES
              </span>

              {/* Main Headline */}
              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[4.85rem] font-bold text-[#F5F0E6] leading-[0.96] tracking-tight">
                GOOD FOOD <br />
                STARTS WITH <br />
                <span className="italic font-normal text-[#B8954A]">GOOD INGREDIENTS.</span>
              </h1>
              
              {/* Subtle Brass Rule */}
              <div className="w-24 h-[1.5px] bg-[#B8954A]/80 mt-3" />
            </div>

            {/* Product Category & Concise Supporting Copy */}
            <div className="space-y-3 pt-2 max-w-lg">
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F5F0E6] tracking-wide">
                STOCKFISH & CRAYFISH
              </h2>
              <p className="text-base sm:text-lg text-[#F5F0E6]/80 leading-relaxed font-sans-clean font-light">
                Quality stockfish and crayfish for the meals that matter.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md group rounded-[2px]"
              >
                <MessageCircle className="w-4 h-4 text-[#071F16]" />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#16382A] hover:border-[#B8954A] hover:bg-[#0D3325] text-[#F5F0E6] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px]"
              >
                <span>Explore Products</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#B8954A]" />
              </button>
            </div>

            {/* Editorial Category Markers */}
            <div className="pt-5 border-t border-[#16382A] flex items-center justify-between text-xs text-[#F5F0E6]/60 font-sans-clean">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                <span className="text-[#F5F0E6]/85 font-medium">01 / Stockfish</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                <span className="text-[#F5F0E6]/85 font-medium">02 / Crayfish</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8954A]">
                Direct Service
              </span>
            </div>

          </div>

          {/* Right Column: Layered Photographic Showcase (Natural Warm Food Contrasting with Deep Green) */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            
            {/* Primary Frame */}
            <div className="p-3 sm:p-4 bg-[#0D3325] border border-[#16382A] shadow-2xl relative">
              <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#071F16]">
                <img
                  src={heroImg}
                  alt="Stockfish and Crayfish by Favour Business Ventures"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />

                {/* Minimal Dark Luxury Badge */}
                <div className="absolute top-4 left-4 bg-[#071F16]/90 backdrop-blur-xs text-[#F5F0E6] px-3.5 py-1.5 text-[9.5px] font-sans-clean font-semibold tracking-[0.25em] uppercase border border-[#B8954A]/40">
                  Selected Stock
                </div>
              </div>

              {/* Bottom Frame Bar */}
              <div className="pt-3 flex items-center justify-between text-xs">
                <span className="font-editorial italic text-base text-[#F5F0E6]">
                  Natural texture & savory aroma
                </span>
                <span className="text-[9px] font-sans-clean uppercase tracking-[0.22em] text-[#B8954A] font-semibold">
                  Authentic Provisions
                </span>
              </div>
            </div>

            {/* Overlapping Inset Detail: Sun-Dried Crayfish */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#071F16] border border-[#B8954A]/40 p-4 shadow-2xl items-center gap-3.5 max-w-[290px]">
              <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#0D3325] border border-[#16382A]">
                <img
                  src={crayfishWholeImg}
                  alt="Whole crayfish detail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                  Sun-Dried
                </span>
                <p className="font-editorial text-sm font-bold text-[#F5F0E6] leading-tight">
                  Rich aroma & concentrated flavor
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
