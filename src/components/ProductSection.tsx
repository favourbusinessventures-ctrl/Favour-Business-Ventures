import React from 'react';
import { MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import { PRODUCTS_DATA } from '../data/products';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const ProductSection: React.FC = () => {
  return (
    <section id="products-section" className="py-20 sm:py-28 bg-[#faf7f2] border-b border-[#ece6d9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24 sm:space-y-32">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1.5px] bg-[#c59b27]" />
            <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#c59b27]">
              Product Offerings
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#122b1e]">
            Our Essential Selection
          </h2>
          <p className="text-base text-[#57534a] font-sans-clean font-light leading-relaxed">
            Focused exclusively on stockfish and crayfish, offering dependable quality and clean preparation for everyday cooking and large gatherings.
          </p>
        </div>

        {/* Editorial Product Rows */}
        <div className="space-y-28 sm:space-y-36">
          {PRODUCTS_DATA.map((product, index) => {
            const isReversed = index % 2 === 1;
            const productWhatsAppUrl = buildWhatsAppUrl(
              `Hello Favour Business Ventures, I would like to order ${product.name}. Please share available sizes, quantities, and pricing.`
            );

            return (
              <div
                key={product.id}
                id={`product-${product.id}`}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isReversed ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image Column */}
                <div className={`lg:col-span-6 ${isReversed ? 'lg:col-start-7' : ''}`}>
                  <div className="p-3 bg-[#f3eee5] border border-[#e4ddcf] relative group">
                    <div className="aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#122b1e]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover img-zoom-hover"
                      />
                    </div>
                    
                    {/* Category Label */}
                    <div className="absolute top-6 left-6 bg-[#faf7f2]/95 border border-[#e4ddcf] px-3.5 py-1 text-[10px] font-sans-clean tracking-[0.25em] uppercase text-[#122b1e] font-semibold">
                      {product.category}
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-6 space-y-6 ${isReversed ? 'lg:col-start-1' : ''}`}>
                  
                  <div className="space-y-2">
                    <span className="text-[11px] font-sans-clean font-medium tracking-[0.25em] uppercase text-[#c59b27]">
                      {product.category}
                    </span>
                    <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122b1e] leading-tight">
                      {product.name}
                    </h3>
                    <p className="font-editorial italic text-lg sm:text-xl text-[#6b665c]">
                      {product.subtitle}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-[#47433c] leading-relaxed font-sans-clean font-light">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2.5 pt-2">
                    {product.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#122b1e] text-[#faf7f2] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#c59b27]" />
                        </div>
                        <span className="text-xs sm:text-sm text-[#47433c] font-sans-clean">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Options / Formats */}
                  <div className="pt-3">
                    <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#8a8477] block mb-2">
                      Available Options
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {product.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className="p-3 bg-[#f5f1e8] border border-[#e6dfd1]"
                        >
                          <h4 className="text-xs font-semibold text-[#122b1e]">
                            {opt.name}
                          </h4>
                          <p className="text-[11px] text-[#6b665c] mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Culinary Note */}
                  <div className="p-4 bg-[#f8f5ee] border-l-2 border-[#c59b27] text-xs text-[#57534a] font-sans-clean">
                    <strong className="text-[#122b1e] font-semibold">Culinary Note: </strong>
                    {product.culinaryNotes}
                  </div>

                  {/* Action CTA */}
                  <div className="pt-2">
                    <a
                      href={productWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] text-xs font-medium tracking-[0.15em] uppercase transition-all duration-200 shadow-xs group"
                    >
                      <MessageCircle className="w-4 h-4 text-[#c59b27]" />
                      <span>Order {product.name} on WhatsApp</span>
                      <ArrowUpRight className="w-3 h-3 text-[#faf7f2]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
