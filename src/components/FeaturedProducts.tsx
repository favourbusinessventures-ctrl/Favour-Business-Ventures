import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { NavigationTab } from '../types';

interface FeaturedProductsProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onNavigate }) => {
  const { products } = useLiveProducts();
  const { settings } = useBusinessSettings();

  // Filter or take the 2 main featured provisions (Stockfish and Crayfish)
  const featured = products.slice(0, 2);

  return (
    <section id="featured-products-section" className="py-20 sm:py-28 bg-[#071F16] text-[#F5F0E6] relative overflow-hidden border-b border-[#16382A]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0D3325]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#B8954A]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header with Scroll Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#16382A]/80"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
                FEATURED PROVISIONS
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F0E6] leading-[1.02]">
              STOCKFISH & CRAYFISH
            </h2>

            <p className="text-sm sm:text-base text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
              Carefully sorted, hygienic, and packaged to give your everyday cooking and celebration dishes authentic flavor and rich aroma.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="btn-tactile inline-flex items-center gap-2 px-6 py-3.5 bg-[#0D3325] hover:bg-[#164936] text-[#F5F0E6] border border-[#16382A] hover:border-[#B8954A]/50 text-xs font-semibold tracking-[0.18em] uppercase rounded-xl cursor-pointer shrink-0 self-start md:self-auto shadow-md"
          >
            <span>View All Options</span>
            <ArrowRight className="w-4 h-4 text-[#B8954A]" />
          </button>
        </motion.div>

        {/* 2-Column Responsive Featured Grid with Hover Lift & Subtle Zoom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {featured.map((product, idx) => {
            const productWhatsAppUrl = buildWhatsAppUrl(
              `Hello ${settings.shortName || 'Favour Business Ventures'}, I would like to order ${product.name}. Please confirm current portion availability and pricing.`,
              settings.whatsappNumberRaw
            );

            return (
              <motion.div
                key={product.id}
                id={`featured-card-${product.id}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="card-glass-hover bg-[#0D3325]/80 backdrop-blur-md border border-[#16382A] hover:border-[#B8954A]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group"
              >
                {/* Product Image Frame with Glass Tag */}
                <div className="relative overflow-hidden bg-[#071F16] aspect-16/10">
                  <ImageWithPlaceholder
                    src={product.imageUrl}
                    alt={product.name}
                    aspectRatioClass="aspect-16/10"
                    theme="dark"
                    priority={idx === 0}
                    className="w-full h-full object-cover object-center img-editorial-zoom group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Translucent Category Tag */}
                  <div className="absolute top-4 left-4 bg-[#071F16]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-[#B8954A]/40 text-[#F5F0E6] text-[9.5px] font-sans-clean font-semibold tracking-[0.25em] uppercase shadow-md">
                    {product.category}
                  </div>

                  {/* Index Pill */}
                  <div className="absolute top-4 right-4 bg-[#0D3325]/90 backdrop-blur-sm w-8 h-8 rounded-full border border-[#16382A] flex items-center justify-center text-[11px] font-editorial font-bold text-[#B8954A] shadow-md">
                    0{idx + 1}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
                      {product.description}
                    </p>

                    {/* Feature Highlights Pills */}
                    {product.highlights && product.highlights.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {product.highlights.slice(0, 3).map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#071F16]/80 border border-[#16382A] rounded-full text-[10.5px] text-[#F5F0E6]/90 font-sans-clean"
                          >
                            <Check className="w-3 h-3 text-[#B8954A]" />
                            {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Options List & Direct CTAs */}
                  <div className="pt-4 border-t border-[#16382A] space-y-4">
                    {product.options && product.options.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
                          Available Portions / Cuts:
                        </span>
                        <p className="text-xs text-[#F5F0E6]/65 font-sans-clean">
                          {product.options.map(opt => opt.name).join(' • ')}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                      {/* WhatsApp CTA — Visual Focal Point */}
                      <a
                        href={productWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-tactile btn-whatsapp-gold flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-xs font-bold tracking-[0.18em] uppercase rounded-xl group/btn"
                      >
                        <MessageCircle className="w-4 h-4 text-[#071F16]" />
                        <span>Order on WhatsApp</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>

                      <button
                        onClick={() => onNavigate('products')}
                        className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#071F16] hover:bg-[#16382A] text-[#F5F0E6] border border-[#16382A] hover:border-[#B8954A]/40 text-xs font-semibold tracking-[0.16em] uppercase rounded-xl cursor-pointer"
                      >
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
