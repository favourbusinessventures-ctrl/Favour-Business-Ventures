import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ArrowUpRight, Check, Minus, Plus, Star, MessageSquarePlus } from 'lucide-react';
import { ProductDetail, ProductOption } from '../types';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useLiveReviews } from '../hooks/useLiveReviews';
import { WriteReviewModal } from './WriteReviewModal';
import { getCustomOrderWhatsAppUrl } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: ProductDetail | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { settings } = useBusinessSettings();
  const { reviews, summary, submitReview } = useLiveReviews(product?.id);
  const [selectedOption, setSelectedOption] = useState<ProductOption>(
    product?.options[0] || { name: 'Standard Format', description: '' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedOption(product.options[0] || { name: 'Standard Format', description: '' });
      setQuantity(1);
    }
  }, [product]);

  // Close on Escape key + lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  const whatsappUrl = getCustomOrderWhatsAppUrl(
    {
      productName: product.name,
      sizeOrPackage: selectedOption.name,
      quantity: quantity,
    },
    settings.whatsappNumberRaw
  );

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-[#071F16]/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-[#FFF9EF] border border-[#E5DEC9] shadow-2xl rounded-t-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close product details"
              className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-[#071F16] text-[#F5F0E6] hover:bg-[#B8954A] hover:text-[#071F16] transition-colors rounded-lg cursor-pointer border border-[#B8954A]/30 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative bg-[#071F16] p-5 sm:p-8 flex items-center justify-center">
                <div className="w-full overflow-hidden rounded-xl">
                  <ImageWithPlaceholder
                    src={product.imageUrl}
                    alt={`${product.name} — premium quality`}
                    aspectRatioClass="aspect-4/3"
                    theme="light"
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Category badge */}
                <div className="absolute top-5 sm:top-6 left-5 sm:left-6 bg-[#071F16]/90 backdrop-blur-sm text-[#F5F0E6] px-3 py-1.5 text-[9px] font-sans-clean font-semibold tracking-[0.2em] uppercase border border-[#B8954A]/40 rounded">
                  {product.category}
                </div>
              </div>

              {/* Details side */}
              <div className="p-5 sm:p-7 lg:p-9 flex flex-col space-y-5">
                {/* Title & Rating Header */}
                <div className="space-y-2 pb-4 border-b border-[#E5DEC9]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#B8954A]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#B8954A] text-[#B8954A]" />
                      ))}
                    </div>
                    <span className="text-xs font-sans-clean font-bold text-[#071F16]">
                      {summary.averageRating.toFixed(1)}
                    </span>
                    <span className="text-[11px] font-sans-clean text-[#6B7266]">
                      ({summary.totalReviews} verified reviews)
                    </span>
                  </div>

                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#071F16] leading-tight pr-10">
                    {product.name}
                  </h2>
                  <p className="font-editorial italic text-sm sm:text-base text-[#6B7266] leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-[#111511] font-sans-clean font-light leading-relaxed">
                  {product.description}
                </p>

                {/* Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                      Key Qualities
                    </span>
                    <ul className="space-y-2">
                      {product.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#111511] font-sans-clean">
                          <Check className="w-3.5 h-3.5 text-[#B8954A] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-sans-clean font-medium text-emerald-700">
                      Available — In Stock
                    </span>
                  </div>

                  <button
                    onClick={() => setIsWriteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-sans-clean text-[#B8954A] hover:text-[#071F16] font-semibold transition-colors cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Rate this provision</span>
                  </button>
                </div>

                {/* Format options */}
                {product.options && product.options.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                      Choose Your Format
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {product.options.map((option) => {
                        const isSelected = selectedOption.name === option.name;
                        return (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() => setSelectedOption(option)}
                            className={`text-left p-3 rounded-lg transition-all duration-200 cursor-pointer min-h-[48px] flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#071F16] text-[#F5F0E6] border border-[#071F16] shadow-md'
                                : 'bg-[#F5F0E6] text-[#071F16] border border-[#E5DEC9] hover:border-[#071F16]/30'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-editorial text-sm font-bold tracking-wide block">
                                {option.name}
                              </span>
                              <span className={`text-[11px] font-sans-clean font-light leading-snug block mt-0.5 ${
                                isSelected ? 'text-[#F5F0E6]/75' : 'text-[#6B7266]'
                              }`}>
                                {option.description}
                              </span>
                            </div>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? 'bg-[#B8954A]' : 'bg-[#E5DEC9]'
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                    Select Quantity
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border rounded-lg bg-[#F5F0E6] border-[#E5DEC9] p-1">
                      <button
                        type="button"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="w-10 h-10 flex items-center justify-center rounded-lg text-[#071F16] hover:bg-[#FFF9EF] hover:text-[#B8954A] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-sm font-sans-clean font-semibold text-[#071F16] tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => quantity < 99 && setQuantity(quantity + 1)}
                        disabled={quantity >= 99}
                        aria-label="Increase quantity"
                        className="w-10 h-10 flex items-center justify-center rounded-lg text-[#071F16] hover:bg-[#FFF9EF] hover:text-[#B8954A] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#6B7266]">
                      Portion / Pack
                    </span>
                  </div>
                </div>

                {/* Selection summary */}
                <div className="p-3.5 rounded-lg bg-[#F5F0E6] border border-[#E5DEC9]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5DEC9]">
                    <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
                      Your Selection
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-editorial text-sm font-bold text-[#071F16]">
                        {product.name}
                      </span>
                      <span className="text-xs font-sans-clean text-[#B8954A] ml-1.5">
                        • {selectedOption.name}
                      </span>
                    </div>
                    <span className="text-xs font-sans-clean font-semibold px-2.5 py-1 rounded bg-[#FFF9EF] border border-[#E5DEC9] text-[#071F16] shrink-0">
                      Qty: {quantity}
                    </span>
                  </div>
                </div>

                {/* WhatsApp CTA — visually dominant */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tactile w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-sans-clean font-bold tracking-[0.2em] uppercase shadow-lg group rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Write Review Modal for specific product */}
            <WriteReviewModal
              isOpen={isWriteModalOpen}
              onClose={() => setIsWriteModalOpen(false)}
              onSubmit={submitReview}
              defaultProductId={product.id}
              defaultProductName={product.name}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

