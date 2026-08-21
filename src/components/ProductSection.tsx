import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowUpRight, Package, FileText, RefreshCw } from 'lucide-react';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { getCustomOrderWhatsAppUrl } from '../utils/whatsapp';
import { ProductDetail } from '../types';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { ProductDetailModal } from './ProductDetailModal';
import { CustomerInquiryModal } from './CustomerInquiryModal';

type CategoryFilter = 'all' | 'Stockfish' | 'Crayfish';

export const ProductSection: React.FC = () => {
  const { products, loading, refetch } = useLiveProducts();
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<ProductDetail | null>(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'Stockfish', label: 'Stockfish' },
    { id: 'Crayfish', label: 'Crayfish' },
  ];

  return (
    <section id="products-section" className={`transition-colors duration-300 ${
      isDark ? 'bg-[#071F16] text-[#F5F0E6]' : 'bg-[#F5F0E6] text-[#071F16]'
    }`}>
      {/* ── Page Header ── */}
      <div className={`pt-14 sm:pt-20 pb-10 sm:pb-14 border-b ${
        isDark ? 'border-[#16382A]' : 'border-[#E5DEC9]'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                Our Products
              </span>
            </div>
            <h1 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.04] ${
              isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
            }`}>
              Stockfish & Crayfish
            </h1>
            <p className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
              isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
            }`}>
              Quality provisions for everyday cooking and special occasions. Browse our selection, make an inquiry, or order directly on WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter Bar + Product Grid ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-10 sm:py-14">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 text-[11px] font-sans-clean font-semibold tracking-[0.15em] uppercase whitespace-nowrap rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] flex items-center ${
                  isActive
                    ? isDark 
                      ? 'bg-[#16382A] text-[#F5F0E6] border border-[#B8954A] shadow-sm'
                      : 'bg-[#071F16] text-[#F5F0E6] border border-[#071F16] shadow-sm'
                    : isDark
                      ? 'bg-[#0D3325] border border-[#16382A] text-[#A3B899] hover:text-[#F5F0E6] hover:border-[#B8954A]/40'
                      : 'bg-[#FFF9EF] border border-[#E5DEC9] text-[#6B7266] hover:text-[#071F16] hover:border-[#071F16]/30'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          /* Skeleton loading state */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-[#B8954A] mb-4 ${
              isDark ? 'bg-[#0D3325] border-[#16382A]' : 'bg-[#FFF9EF] border-[#E5DEC9]'
            }`}>
              <Package className="w-6 h-6" />
            </div>
            <h3 className={`font-editorial text-xl font-bold mb-1 ${
              isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
            }`}>
              No products available
            </h3>
            <p className={`text-sm font-sans-clean font-light max-w-sm mb-4 ${
              isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
            }`}>
              We're currently restocking our selection. Please check back shortly or contact us directly on WhatsApp.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Products</span>
            </button>
          </div>
        ) : (
          /* Actual product grid */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredProducts.map((product, idx) => {
                const quickOrderUrl = getCustomOrderWhatsAppUrl(
                  {
                    productName: product.name,
                    sizeOrPackage: product.options[0]?.name || 'Standard',
                    quantity: 1,
                  },
                  settings.whatsappNumberRaw
                );

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={`border rounded-xl overflow-hidden flex flex-col group transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#0D3325] border-[#16382A] hover:border-[#B8954A]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                        : 'bg-[#FFF9EF] border-[#E5DEC9] hover:border-[#B8954A]/40 hover:shadow-[0_8px_30px_rgba(7,31,22,0.08)]'
                    }`}
                  >
                    {/* Product image — click opens detail modal */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="relative overflow-hidden block text-left cursor-pointer w-full"
                      aria-label={`View ${product.name} details`}
                    >
                      <ImageWithPlaceholder
                        src={product.imageUrl}
                        alt={`${product.name} — ${product.subtitle}`}
                        aspectRatioClass="aspect-[4/3]"
                        theme={isDark ? 'dark' : 'light'}
                        priority={idx < 3}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 bg-[#071F16]/90 backdrop-blur-sm text-[#F5F0E6] px-2.5 py-1 text-[9px] font-sans-clean font-semibold tracking-[0.2em] uppercase border border-[#B8954A]/30 rounded">
                        {product.category}
                      </div>
                    </button>

                    {/* Card content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-3">
                      {/* Title + subtitle */}
                      <div className="space-y-1">
                        <h3 className={`font-editorial text-lg sm:text-xl font-bold leading-tight ${
                          isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-xs font-sans-clean font-light leading-snug line-clamp-2 ${
                          isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                        }`}>
                          {product.subtitle}
                        </p>
                      </div>

                      {/* Availability indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-sans-clean font-medium text-emerald-400 uppercase tracking-wider">
                          Available
                        </span>
                      </div>

                      {/* Options preview */}
                      {product.options && product.options.length > 0 && (
                        <p className={`text-[11px] font-sans-clean font-light leading-relaxed ${
                          isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                        }`}>
                          {product.options.length} formats: {product.options.map((o) => o.name).join(' • ')}
                        </p>
                      )}

                      {/* Actions — primary: Order on WhatsApp, secondary: Make Inquiry / Details */}
                      <div className={`flex flex-col sm:flex-row items-stretch gap-2 pt-3 mt-auto border-t ${
                        isDark ? 'border-[#16382A]' : 'border-[#E5DEC9]'
                      }`}>
                        {/* Primary: Order on WhatsApp */}
                        <a
                          href={quickOrderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Order ${product.name} on WhatsApp`}
                          className="btn-tactile flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-[10px] font-sans-clean font-bold tracking-[0.15em] uppercase rounded-lg transition-all cursor-pointer min-h-[44px] shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Order on WhatsApp</span>
                        </a>

                        {/* Secondary: Inquiry Modal */}
                        <button
                          onClick={() => setInquiryProduct(product)}
                          title="Submit an order inquiry form"
                          className={`btn-tactile sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-3 border text-[10px] font-sans-clean font-semibold tracking-[0.12em] uppercase rounded-lg transition-all cursor-pointer min-h-[44px] ${
                            isDark
                              ? 'bg-[#071F16] hover:bg-[#16382A] text-[#F5F0E6] border-[#16382A] hover:border-[#B8954A]/40'
                              : 'bg-[#F5F0E6] hover:bg-[#071F16] text-[#071F16] hover:text-[#F5F0E6] border-[#E5DEC9] hover:border-[#071F16]'
                          }`}
                        >
                          <FileText className="w-3 h-3 text-[#B8954A]" />
                          <span>Inquire</span>
                        </button>

                        {/* Details */}
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className={`btn-tactile sm:w-auto inline-flex items-center justify-center px-3.5 py-3 border text-[10px] font-sans-clean font-semibold tracking-[0.12em] uppercase rounded-lg transition-all cursor-pointer min-h-[44px] ${
                            isDark
                              ? 'bg-[#071F16] hover:bg-[#16382A] text-[#F5F0E6] border-[#16382A]'
                              : 'bg-[#F5F0E6] hover:bg-[#071F16] text-[#071F16] hover:text-[#F5F0E6] border-[#E5DEC9]'
                          }`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Direct Customer Inquiry Modal */}
      <CustomerInquiryModal
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        initialData={inquiryProduct ? {
          product: inquiryProduct,
          productName: inquiryProduct.name,
          category: inquiryProduct.category === 'Crayfish' ? 'crayfish' : 'stockfish',
          option: inquiryProduct.options[0]?.name || 'Standard Format',
          quantity: '1'
        } : undefined}
      />
    </section>
  );
};
