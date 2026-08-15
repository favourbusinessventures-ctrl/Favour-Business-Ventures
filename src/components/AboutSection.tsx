import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { stockfishHeadImg } from '../data/products';

export const AboutSection: React.FC = () => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section id="about-section" className="py-20 sm:py-28 bg-[#f5f1e8] border-b border-[#ece6d9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Brand Story */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[1.5px] bg-[#c59b27]" />
                <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#c59b27]">
                  About The Brand
                </span>
              </div>
              
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#122b1e] leading-[1.1]">
                About Favour Business Ventures
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-[#47433c] font-sans-clean font-light leading-relaxed">
              <p className="font-editorial italic text-xl sm:text-2xl text-[#122b1e] leading-snug">
                "{BUSINESS_CONFIG.description}"
              </p>

              <p>
                We focus squarely on two essential culinary ingredients: stockfish and crayfish. By concentrating our attention on these core staples, we ensure each order meets standards of cleanliness, proper drying, and rich traditional flavor.
              </p>

              <p>
                Whether you are ordering for home meals, family gatherings, catering, or commercial food service, we provide responsive service and direct communication from order placement to final delivery.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e2dbcd]">
              <div className="space-y-1">
                <span className="font-editorial text-xl font-bold text-[#122b1e]">Quality</span>
                <p className="text-xs text-[#6b665c]">Clean and carefully selected stockfish & crayfish.</p>
              </div>
              <div className="space-y-1">
                <span className="font-editorial text-xl font-bold text-[#122b1e]">Reliability</span>
                <p className="text-xs text-[#6b665c]">Consistent supply and dependable communication.</p>
              </div>
              <div className="space-y-1">
                <span className="font-editorial text-xl font-bold text-[#122b1e]">Simplicity</span>
                <p className="text-xs text-[#6b665c]">Direct, straightforward ordering over WhatsApp.</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] text-xs font-medium tracking-[0.15em] uppercase transition-all shadow-xs group"
              >
                <MessageCircle className="w-4 h-4 text-[#c59b27]" />
                <span>Contact on WhatsApp</span>
                <ArrowUpRight className="w-3 h-3 text-[#faf7f2]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>

          {/* Right Column: Editorial Photography */}
          <div className="lg:col-span-6">
            <div className="p-3 sm:p-4 bg-[#faf7f2] border border-[#e4ddcf] relative">
              <div className="aspect-4/3 sm:aspect-5/4 overflow-hidden bg-[#122b1e]">
                <img
                  src={stockfishHeadImg}
                  alt="Stockfish quality preparation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom-hover"
                />
              </div>

              {/* Minimal caption */}
              <div className="p-4 sm:p-5 bg-[#faf7f2] border-t border-[#ede7dc]">
                <p className="font-editorial text-base text-[#122b1e] font-semibold">
                  Dedicated to authentic culinary depth
                </p>
                <p className="text-xs text-[#6b665c] mt-0.5 font-sans-clean">
                  Carefully preserved and prepared for traditional recipes.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
