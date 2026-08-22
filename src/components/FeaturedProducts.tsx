import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowUpRight, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { NavigationTab } from '../types';

interface FeaturedProductsProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onNavigate }) => {
  const { products } = useLiveProducts();
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const { addItem, recentlyAddedId } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleQuickAdd = (product: typeof products[0]) => {
    const defaultOption = product.options?.[0]?.name || 'Standard Cut';
    addItem(product, defaultOption, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2400);
  };

  // Filter or take the 2 main featured provisions (Stockfish and Crayfish)
  const featured = products.slice(0, 2);

  return (
    <section 
      id="featured-products-section" 
      className={`py-20 sm:py-28 relative overflow-hidden border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#F7F3EA] text-[#173B2A] border-[#E6DEC8]'
      }`}
    >
      {/* Ambient background glows */}
      {isDark ? (
        <>
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0D3325]/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#B8954A]/8 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[#1E5631]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#7A8D60]/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header with Scroll Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b ${
            isDark ? 'border-[#16382A]/80' : 'border-[#E6DEC8]'
          }`}
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
              <span className={`text-[10px] sm:text-[11px] font-sans-clean font-bold tracking-[0.32em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                FEATURED PROVISIONS
              </span>
            </div>

            <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] ${
              isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
            }`}>
              STOCKFISH & CRAYFISH
            </h2>

            <p className={`text-sm sm:text-base font-sans-clean font-normal leading-relaxed ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#3D4F43]'
            }`}>
              Carefully sorted, hygienic, and packaged to give your everyday cooking and celebration dishes authentic flavor and rich aroma.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className={`btn-tactile inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase rounded-xl cursor-pointer shrink-0 self-start md:self-auto border shadow-sm ${
              isDark
                ? 'bg-[#0D3325] hover:bg-[#164936] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                : 'bg-[#FFFDF8] hover:bg-[#F4EFE6] text-[#173B2A] border-[#E6DEC8] hover:border-[#1E5631]/50'
            }`}
          >
            <span>View All Options</span>
            <ArrowRight className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
          </button>
        </motion.div>

        {/* 2-Column Responsive Featured Grid with Hover Lift */}
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
                transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.16, 1, 0.36, 1] }}
                className={`card-glass-hover rounded-2xl overflow-hidden flex flex-col justify-between group border transition-all duration-300 ${
                  isDark
                    ? 'bg-[#0D3325]/80 backdrop-blur-md border-[#16382A] hover:border-[#B8954A]/50 shadow-2xl'
                    : 'bg-[#FFFDF8] border-[#E6DEC8] hover:border-[#1E5631]/50 shadow-md'
                }`}
              >
                {/* Product Image Frame with Glass Tag */}
                <div className={`relative overflow-hidden aspect-[16/10] ${
                  isDark ? 'bg-[#071F16]' : 'bg-[#F4EFE6]'
                }`}>
                  <ImageWithPlaceholder
                    src={product.imageUrl}
                    alt={product.name}
                    aspectRatioClass="aspect-[16/10]"
                    theme={isDark ? 'dark' : 'light'}
                    priority={idx === 0}
                    className="w-full h-full object-cover object-center img-editorial-zoom group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Translucent Category Tag */}
                  <div className={`absolute top-4 left-4 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border text-[9.5px] font-sans-clean font-bold tracking-[0.25em] uppercase shadow-md ${
                    isDark
                      ? 'bg-[#071F16]/90 border-[#B8954A]/40 text-[#EDEDED]'
                      : 'bg-[#FFFDF8]/95 border-[#E6DEC8] text-[#173B2A]'
                  }`}>
                    {product.category}
                  </div>

                  {/* Index Pill */}
                  <div className={`absolute top-4 right-4 backdrop-blur-sm w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-editorial font-bold shadow-md ${
                    isDark
                      ? 'bg-[#0D3325]/90 border-[#16382A] text-[#B8954A]'
                      : 'bg-[#FFFDF8] border-[#E6DEC8] text-[#1E5631]'
                  }`}>
                    0{idx + 1}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className={`font-editorial text-2xl sm:text-3xl font-bold transition-colors leading-snug ${
                      isDark
                        ? 'text-[#EDEDED] group-hover:text-[#B8954A]'
                        : 'text-[#173B2A] group-hover:text-[#1E5631]'
                    }`}>
                      {product.name}
                    </h3>
                    
                    <p className={`text-xs sm:text-sm font-sans-clean font-normal leading-relaxed ${
                      isDark ? 'text-[#EDEDED]/75' : 'text-[#3D4F43]'
                    }`}>
                      {product.description}
                    </p>

                    {/* Feature Highlights Pills */}
                    {product.highlights && product.highlights.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {product.highlights.slice(0, 3).map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-sans-clean border font-medium ${
                              isDark
                                ? 'bg-[#071F16]/80 border-[#16382A] text-[#EDEDED]/90'
                                : 'bg-[#F4EFE6] border-[#E6DEC8] text-[#173B2A]'
                            }`}
                          >
                            <Check className={`w-3 h-3 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                            {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Options List & Direct CTAs */}
                  <div className={`pt-4 border-t space-y-4 ${
                    isDark ? 'border-[#16382A]' : 'border-[#E6DEC8]'
                  }`}>
                    {product.options && product.options.length > 0 && (
                      <div className="space-y-1.5">
                        <span className={`text-[10px] font-sans-clean font-bold uppercase tracking-[0.2em] ${
                          isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                        }`}>
                          Available Portions / Cuts:
                        </span>
                        <p className={`text-xs font-sans-clean font-medium ${
                          isDark ? 'text-[#EDEDED]/65' : 'text-[#58685C]'
                        }`}>
                          {product.options.map(opt => opt.name).join(' • ')}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                      {/* Quick Add to Cart Button */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`btn-tactile flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-sans-clean font-bold tracking-[0.16em] uppercase rounded-xl transition-all cursor-pointer shadow-sm min-h-[44px] ${
                          addedItem === product.id
                            ? 'bg-emerald-600 text-white'
                            : isDark
                              ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16]'
                              : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white'
                        }`}
                      >
                        {addedItem === product.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      {/* WhatsApp CTA */}
                      <a
                        href={productWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn-tactile sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-sans-clean font-bold tracking-[0.14em] uppercase rounded-xl group/btn cursor-pointer border min-h-[44px] ${
                          isDark
                            ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                            : 'bg-[#F4EFE6] hover:bg-white text-[#173B2A] border-[#E6DEC8] hover:border-[#1E5631]/40 shadow-xs'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>WhatsApp</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>

                      {/* Details button */}
                      <button
                        onClick={() => onNavigate('products')}
                        className={`btn-tactile sm:w-auto inline-flex items-center justify-center px-4 py-3.5 text-xs font-sans-clean font-bold tracking-[0.14em] uppercase rounded-xl cursor-pointer border min-h-[44px] ${
                          isDark
                            ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A]'
                            : 'bg-[#F4EFE6] hover:bg-white text-[#173B2A] border-[#E6DEC8]'
                        }`}
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
