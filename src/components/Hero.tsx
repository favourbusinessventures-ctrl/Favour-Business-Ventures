import React from 'react';
import { MessageCircle, ArrowDown, ArrowUpRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { heroImg } from '../data/products';
import { NavigationTab } from '../types';

interface HeroProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section className="relative bg-[#faf7f2] overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-[#ece6d9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Top Editorial Eyebrow & Brand Signature */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#e8e2d5]">
          <div className="space-y-1">
            <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#c59b27]">
              Culinary Staple & Quality Provision
            </span>
            <p className="text-xs font-sans-clean tracking-[0.18em] uppercase text-[#615c52]">
              {BUSINESS_CONFIG.name}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-editorial italic text-[#57534a]">
              Carefully curated for authentic African kitchens
            </p>
          </div>
        </div>

        {/* Main Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10 sm:pt-14 items-center">
          
          {/* Left Column: Bold Typography & Brand Statement */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-4">
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#122b1e] leading-[1.08]">
                Premium Stockfish & Crayfish
              </h1>
              
              <div className="w-12 h-[2px] bg-[#c59b27]" />
            </div>

            <p className="text-base sm:text-lg text-[#4a463e] leading-relaxed font-sans-clean font-light max-w-lg">
              Favour Business Ventures provides quality stockfish and crayfish for customers looking for dependable food products.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Primary CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-[#c59b27]" />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#faf7f2]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Secondary CTA */}
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-[#cfc8b8] hover:border-[#122b1e] text-[#122b1e] text-xs font-semibold tracking-[0.15em] uppercase transition-colors bg-transparent cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#827d73]" />
              </button>
            </div>

            {/* Subtle Brand Note */}
            <div className="pt-4 border-t border-[#ede7dc] flex items-center gap-6 text-xs text-[#736e63]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
                Selected Stockfish
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
                Cleaned Crayfish
              </span>
            </div>

          </div>

          {/* Right Column: Editorial Hero Photography */}
          <div className="lg:col-span-7 relative">
            <div className="relative p-3 sm:p-4 bg-[#f3eee5] border border-[#e4ddcf]">
              
              {/* Image Frame */}
              <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#122b1e]">
                <img
                  src={heroImg}
                  alt="Stockfish and Crayfish presentation by Favour Business Ventures"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom-hover"
                />
                
                {/* Minimalist Corner Label */}
                <div className="absolute bottom-4 left-4 bg-[#122b1e]/90 text-[#faf7f2] px-3.5 py-1.5 text-[11px] font-sans-clean tracking-[0.2em] uppercase backdrop-blur-xs">
                  Stockfish & Crayfish
                </div>
              </div>

            </div>

            {/* Refined Floating Accent Card */}
            <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:right-6 bg-[#faf7f2] border border-[#e4ddcf] p-5 shadow-lg max-w-[260px] hidden sm:block">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#c59b27] block mb-1">
                Direct Service
              </span>
              <p className="font-editorial text-lg text-[#122b1e] font-semibold leading-snug">
                Quality dried food staples ready for your kitchen.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
