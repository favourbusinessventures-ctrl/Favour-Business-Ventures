import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { stockfishBaleImg } from '../data/products';

export const AboutSection: React.FC = () => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section id="about-section" className="py-24 sm:py-36 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Brand Narrative */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-[#B8954A]" />
                <span className="text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                  Our Approach
                </span>
              </div>
              
              <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#071F16] leading-[1.02]">
                A Dedicated Focus on What Matters.
              </h2>
            </div>

            <div className="space-y-5 text-base sm:text-lg text-[#111511] font-sans-clean font-light leading-relaxed">
              <p className="font-editorial italic text-2xl sm:text-3xl text-[#071F16] leading-snug">
                "Good meals begin with ingredients you can trust."
              </p>

              <p>
                At {BUSINESS_CONFIG.name}, we believe in doing fewer things with exceptional standards. We concentrate entirely on stockfish and sun-dried crayfish.
              </p>

              <p className="text-[#6B7266] text-sm sm:text-base">
                Whether you are preparing everyday family meals, cooking for a weekend celebration, or running a catering kitchen, we provide dependable products packaged cleanly and dispatched without fuss.
              </p>
            </div>

            {/* Two Column Highlight Metrics */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E5DEC9]">
              <div>
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#071F16] block">
                  Pure Focus
                </span>
                <span className="text-xs text-[#6B7266] font-sans-clean mt-1 block">
                  Dedicated strictly to stockfish & crayfish.
                </span>
              </div>

              <div>
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#071F16] block">
                  Direct Care
                </span>
                <span className="text-xs text-[#6B7266] font-sans-clean mt-1 block">
                  Inspected, packed, and confirmed before dispatch.
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#071F16] hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/30 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md group rounded-[2px]"
              >
                <MessageCircle className="w-4 h-4 text-[#B8954A]" />
                <span>Talk with Us on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F5F0E6]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>

          {/* Right Column: Editorial Photo Framing */}
          <div className="lg:col-span-6 relative">
            <div className="p-3 sm:p-4 bg-[#FFF9EF] border border-[#E5DEC9] shadow-xl relative">
              <div className="aspect-4/3 sm:aspect-5/4 overflow-hidden bg-[#071F16]">
                <img
                  src={stockfishBaleImg}
                  alt="Stockfish presentation by Favour Business Ventures"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-editorial-zoom"
                />
              </div>

              {/* Minimal caption banner */}
              <div className="p-5 bg-[#FFF9EF] border-t border-[#E5DEC9] flex items-center justify-between">
                <div>
                  <p className="font-editorial text-lg text-[#071F16] font-bold">
                    Dependable food supply
                  </p>
                  <p className="text-xs text-[#6B7266] font-sans-clean">
                    For household kitchens, events, and caterers.
                  </p>
                </div>
                <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#B8954A] font-semibold">
                  Standard 01
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
