import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { crayfishWholeImg, stockfishCutsImg } from '../data/products';

export const BrandMoment: React.FC = () => {
  const { settings } = useBusinessSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <section className="relative bg-[#071F16] text-[#F5F0E6] py-16 sm:py-24 lg:py-32 overflow-hidden border-y border-[#16382A]">
      {/* Background Ambience in Deep Forest */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0D3325]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B8954A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Typography & Campaign Statement */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7">
            
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[#B8954A]" />
                <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                  Brand Campaign
                </span>
              </div>

              {/* Enormous Warm Ivory Editorial Headline */}
              <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#F5F0E6] leading-[0.96]">
                QUALITY <br />
                YOU CAN <br />
                <span className="italic font-normal text-[#B8954A]">TASTE.</span>
              </h2>

              {/* Subtle Brass Line */}
              <div className="w-20 h-[1.5px] bg-[#B8954A]/80 mt-2" />
            </div>

            {/* Natural Confident Copy */}
            <p className="text-base sm:text-xl text-[#F5F0E6]/80 font-sans-clean font-light leading-relaxed max-w-xl">
              From everyday cooking to the meals you make for people you love.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile btn-whatsapp-gold inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[#071F16] text-xs font-bold tracking-[0.2em] uppercase rounded-xl shadow-lg group"
              >
                <MessageCircle className="w-4 h-4 text-[#071F16]" />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <span className="text-xs text-[#F5F0E6]/60 font-sans-clean flex items-center justify-center sm:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                Direct WhatsApp confirmation
              </span>
            </div>

          </div>

          {/* Overlapping Campaign Imagery: Warm Golden Tones against Deep Luxury Green */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            
            {/* Primary Overlapping Frame */}
            <div className="p-3 sm:p-4 bg-[#0D3325] border border-[#16382A] shadow-2xl relative">
              <div className="aspect-[4/5] overflow-hidden bg-[#071F16]">
                <img
                  src={stockfishCutsImg}
                  alt="Stockfish quality cuts"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center img-editorial-zoom"
                />
              </div>

              {/* Minimal Tag */}
              <div className="p-3.5 bg-[#0D3325] border-t border-[#16382A] flex items-center justify-between">
                <span className="font-editorial italic text-sm sm:text-base text-[#F5F0E6]">
                  Hand-inspected cuts
                </span>
                <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.22em] text-[#B8954A]">
                  01 • Stockfish
                </span>
              </div>
            </div>

            {/* Offset Mini Frame: Golden Crayfish */}
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-44 sm:w-48 p-2.5 bg-[#071F16] border border-[#B8954A]/40 shadow-2xl">
              <div className="aspect-square overflow-hidden bg-[#0D3325]">
                <img
                  src={crayfishWholeImg}
                  alt="Whole sun-dried crayfish detail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-2 text-center">
                <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                  Sun-Dried Crayfish
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
