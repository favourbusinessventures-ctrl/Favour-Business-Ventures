import React from 'react';
import { MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import { PRODUCTS_DATA, stockfishCutsImg, crayfishWholeImg } from '../data/products';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const ProductSection: React.FC = () => {
  const stockfish = PRODUCTS_DATA.find(p => p.id === 'stockfish') || PRODUCTS_DATA[0];
  const crayfish = PRODUCTS_DATA.find(p => p.id === 'crayfish') || PRODUCTS_DATA[1];

  const stockfishWhatsAppUrl = buildWhatsAppUrl(
    `Hello Favour Business Ventures, I would like to order Stockfish. Please share current cuts and pricing.`
  );

  const crayfishWhatsAppUrl = buildWhatsAppUrl(
    `Hello Favour Business Ventures, I would like to order Crayfish. Please share whole and ground options with pricing.`
  );

  return (
    <section id="products-section" className="border-b border-[#16382A]">
      
      {/* =========================================================================
          01 / STOCKFISH — Light Editorial Canvas (Warm Ivory #F5F0E6)
         ========================================================================= */}
      <div id="product-stockfish" className="py-20 sm:py-28 lg:py-32 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-16 sm:space-y-20">
          
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10.5px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                Provision 01
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#071F16] leading-tight">
              Stockfish, <br />
              <span className="font-normal italic text-[#B8954A]">cleanly cured with firm, flavorful flesh.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#6B7266] font-sans-clean font-light leading-relaxed pt-1">
              Choose what you need. Send your order. We'll take it from there.
            </p>
          </div>

          {/* Editorial Spread: Light Background framing Warm Textured Stockfish */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Visual Frame (Left) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-3 sm:p-4 bg-[#FFF9EF] border border-[#E5DEC9] shadow-md relative">
                <div className="aspect-16/11 overflow-hidden bg-[#071F16]">
                  <img
                    src={stockfishCutsImg}
                    alt="Selected stockfish cuts"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center img-editorial-zoom"
                  />
                </div>

                <div className="absolute top-6 left-6 bg-[#071F16] text-[#F5F0E6] px-4 py-1.5 text-[10px] font-sans-clean tracking-[0.25em] uppercase font-semibold border border-[#B8954A]/30">
                  01 / STOCKFISH
                </div>
              </div>

              {/* Format Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#6B7266] font-sans-clean">
                <div className="p-4 bg-[#FFF9EF] border border-[#E5DEC9]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B8954A] block mb-1">
                    Format A
                  </span>
                  <span className="font-editorial text-lg font-bold text-[#071F16] block">Prime Body Cuts</span>
                  <p className="text-[11px] text-[#6B7266] mt-0.5">Meaty portions for rich traditional stews.</p>
                </div>
                <div className="p-4 bg-[#FFF9EF] border border-[#E5DEC9]">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B8954A] block mb-1">
                    Format B
                  </span>
                  <span className="font-editorial text-lg font-bold text-[#071F16] block">Heads & Collars</span>
                  <p className="text-[11px] text-[#6B7266] mt-0.5">Flavorful base for authentic broths.</p>
                </div>
              </div>
            </div>

            {/* Editorial Content (Right) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-2 border-b border-[#E5DEC9] pb-5">
                <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A] block">
                  01 / STOCKFISH
                </span>
                <h3 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#071F16] tracking-tight">
                  Stockfish
                </h3>
                <p className="font-editorial italic text-lg sm:text-xl text-[#6B7266]">
                  Firm, clean-cured, and rich in natural umami.
                </p>
              </div>

              <p className="text-base text-[#111511] font-sans-clean font-light leading-relaxed">
                Selected for firm meatiness and clean curing. Rehydrates well and adds savory depth to native soups, stews, and household cooking.
              </p>

              {/* Highlights */}
              <div className="space-y-3 pt-1">
                {stockfish.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-3.5 h-3.5 bg-[#071F16] text-[#F5F0E6] flex items-center justify-center shrink-0 mt-0.5 rounded-[1px]">
                      <Check className="w-2 h-2 text-[#B8954A]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#6B7266] font-sans-clean">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order CTA */}
              <div className="pt-3">
                <a
                  href={stockfishWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#071F16] hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/30 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-sm group rounded-[2px]"
                >
                  <MessageCircle className="w-4 h-4 text-[#B8954A]" />
                  <span>Order Stockfish</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F5F0E6]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          02 / CRAYFISH — Deep Luxury Green Section (#071F16 / #0D3325)
         ========================================================================= */}
      <div id="product-crayfish" className="py-20 sm:py-28 lg:py-32 bg-[#071F16] text-[#F5F0E6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-16 sm:space-y-20">
          
          {/* Section Header */}
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10.5px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                Provision 02
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#F5F0E6] leading-tight">
              Crayfish, <br />
              <span className="font-normal italic text-[#B8954A]">sun-dried, intensely aromatic, and pure.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#F5F0E6]/70 font-sans-clean font-light leading-relaxed pt-1">
              Whole sun-dried and pure ground options prepared with direct care.
            </p>
          </div>

          <div className="p-8 sm:p-12 lg:p-14 bg-[#0D3325] border border-[#16382A] rounded-[2px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
                
                <div className="space-y-2 border-b border-[#16382A] pb-5">
                  <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A] block">
                    02 / CRAYFISH
                  </span>
                  <h3 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F0E6] tracking-tight">
                    Crayfish
                  </h3>
                  <p className="font-editorial italic text-lg sm:text-xl text-[#F5F0E6]/80">
                    Whole sun-dried & pure ground options.
                  </p>
                </div>

                <p className="text-base text-[#F5F0E6]/85 font-sans-clean font-light leading-relaxed">
                  Sun-dried and winnowed for clean presentation. Delivers the signature aroma and concentrated flavor essential for good traditional cooking.
                </p>

                {/* Highlights */}
                <div className="space-y-3 pt-1">
                  {crayfish.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-3.5 h-3.5 bg-[#071F16] text-[#F5F0E6] flex items-center justify-center shrink-0 mt-0.5 border border-[#16382A] rounded-[1px]">
                        <Check className="w-2 h-2 text-[#B8954A]" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#F5F0E6]/75 font-sans-clean">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order CTA */}
                <div className="pt-3">
                  <a
                    href={crayfishWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md group rounded-[2px]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#071F16]" />
                    <span>Order Crayfish</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

              </div>

              {/* Right Photographic Showcase (Golden Crayfish against Deep Forest) */}
              <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
                <div className="p-3 sm:p-4 bg-[#071F16] border border-[#16382A] shadow-2xl relative">
                  
                  <div className="aspect-16/11 overflow-hidden bg-[#071F16]">
                    <img
                      src={crayfishWholeImg}
                      alt="Sun-dried whole crayfish presentation"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center img-editorial-zoom"
                    />
                  </div>

                  <div className="absolute top-6 right-6 bg-[#071F16] text-[#F5F0E6] px-4 py-1.5 text-[10px] font-sans-clean tracking-[0.25em] uppercase font-semibold border border-[#B8954A]/40">
                    02 / CRAYFISH
                  </div>

                </div>

                <div className="p-3.5 bg-[#071F16] border border-[#16382A] flex items-center justify-between">
                  <span className="font-editorial text-sm sm:text-base text-[#F5F0E6] font-bold">
                    Whole sun-dried & pure milled powder
                  </span>
                  <span className="text-[9.5px] font-sans-clean uppercase tracking-[0.2em] text-[#B8954A] font-semibold">
                    Direct Inquiries
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
