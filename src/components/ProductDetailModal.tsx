import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ArrowUpRight, Check, Minus, Plus, Star, MessageSquarePlus, Headphones, FileText, ShoppingBag } from 'lucide-react';
import { ProductDetail, ProductOption } from '../types';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useLiveReviews } from '../hooks/useLiveReviews';
import { useCustomerCare } from '../context/CustomerCareContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { WriteReviewModal } from './WriteReviewModal';
import { CustomerInquiryModal } from './CustomerInquiryModal';
import { getCustomOrderWhatsAppUrl } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: ProductDetail | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const { reviews, summary, submitReview } = useLiveReviews(product?.id);
  const { openAssistant } = useCustomerCare();
  const { addItem, openCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<ProductOption>(
    product?.options[0] || { name: 'Standard Format', description: '' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedOption(product.options[0] || { name: 'Standard Format', description: '' });
      setQuantity(1);
      setIsAddedFeedback(false);
    }
  }, [product]);

  // Close on Escape key + lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isWriteModalOpen && !isInquiryModalOpen) onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose, isWriteModalOpen, isInquiryModalOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, selectedOption.name, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2800);
  };

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
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-2xl sm:rounded-2xl border ${
              isDark 
                ? 'bg-[#0D3325] border-[#16382A] text-[#EDEDED]' 
                : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close product details"
              className={`absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center transition-colors rounded-xl cursor-pointer border shadow-md ${
                isDark
                  ? 'bg-[#071F16] text-[#EDEDED] hover:bg-[#B8954A] hover:text-[#071F16] border-[#16382A]'
                  : 'bg-[#F5F5F0] text-[#1A1A1A] hover:bg-[#1E5631] hover:text-white border-[#E5E7EB]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className={`relative p-5 sm:p-8 flex items-center justify-center ${
                isDark ? 'bg-[#071F16]' : 'bg-[#F5F5F0]'
              }`}>
                <div className="w-full overflow-hidden rounded-xl">
                  <ImageWithPlaceholder
                    src={product.imageUrl}
                    alt={`${product.name} — premium quality`}
                    aspectRatioClass="aspect-[4/3]"
                    theme={isDark ? 'dark' : 'light'}
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Category badge */}
                <div className={`absolute top-5 sm:top-6 left-5 sm:left-6 px-3 py-1.5 text-[9px] font-sans-clean font-semibold tracking-[0.2em] uppercase border rounded-md shadow-sm ${
                  isDark 
                    ? 'bg-[#071F16]/90 backdrop-blur-sm text-[#EDEDED] border-[#B8954A]/40' 
                    : 'bg-white/90 backdrop-blur-sm text-[#1A1A1A] border-[#E5E7EB]'
                }`}>
                  {product.category}
                </div>
              </div>

              {/* Details side */}
              <div className="p-5 sm:p-7 lg:p-9 flex flex-col space-y-5">
                {/* Title & Rating Header */}
                <div className={`space-y-2 pb-4 border-b ${
                  isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#B8954A]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#B8954A] text-[#B8954A]" />
                      ))}
                    </div>
                    <span className={`text-xs font-sans-clean font-bold ${
                      isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                    }`}>
                      {summary.averageRating.toFixed(1)}
                    </span>
                    <span className={`text-[11px] font-sans-clean ${
                      isDark ? 'text-[#EDEDED]/60' : 'text-[#6B7266]'
                    }`}>
                      ({summary.totalReviews} verified reviews)
                    </span>
                  </div>

                  <h2 className={`font-editorial text-2xl sm:text-3xl font-bold leading-tight pr-10 ${
                    isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                  }`}>
                    {product.name}
                  </h2>
                  <p className={`font-editorial italic text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-[#A3B899]' : 'text-[#525252]'
                  }`}>
                    {product.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className={`text-sm font-sans-clean font-light leading-relaxed ${
                  isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                }`}>
                  {product.description}
                </p>

                {/* Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="space-y-2.5">
                    <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] block ${
                      isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                    }`}>
                      Key Qualities
                    </span>
                    <ul className="space-y-2">
                      {product.highlights.map((hl, idx) => (
                        <li key={idx} className={`flex items-start gap-2 text-xs font-sans-clean ${
                          isDark ? 'text-[#EDEDED]/85' : 'text-[#1A1A1A]'
                        }`}>
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                          }`} />
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
                    <span className="text-xs font-sans-clean font-medium text-emerald-600 dark:text-emerald-400">
                      Available — In Stock
                    </span>
                  </div>

                  <button
                    onClick={() => setIsWriteModalOpen(true)}
                    className={`inline-flex items-center gap-1.5 text-xs font-sans-clean hover:underline font-semibold transition-colors cursor-pointer ${
                      isDark ? 'text-[#B8954A] hover:text-[#EDEDED]' : 'text-[#1E5631] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Rate this provision</span>
                  </button>
                </div>

                {/* Format options */}
                {product.options && product.options.length > 0 && (
                  <div className="space-y-2.5">
                    <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] block ${
                      isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                    }`}>
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
                            className={`text-left p-3 rounded-xl transition-all duration-200 cursor-pointer min-h-[48px] flex items-center justify-between gap-3 ${
                              isSelected
                                ? isDark
                                  ? 'bg-[#16382A] text-[#EDEDED] border border-[#B8954A] shadow-md'
                                  : 'bg-[#1E5631] text-white border border-[#1E5631] shadow-md'
                                : isDark
                                  ? 'bg-[#071F16]/60 text-[#EDEDED] border border-[#16382A] hover:border-[#B8954A]/40'
                                  : 'bg-[#F5F5F0] text-[#1A1A1A] border border-[#E5E7EB] hover:border-[#1E5631]/40'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-editorial text-sm font-bold tracking-wide block">
                                {option.name}
                              </span>
                              <span className={`text-[11px] font-sans-clean font-light leading-snug block mt-0.5 ${
                                isSelected 
                                  ? isDark ? 'text-[#EDEDED]/85' : 'text-white/85' 
                                  : isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                              }`}>
                                {option.description}
                              </span>
                            </div>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? isDark ? 'bg-[#B8954A]' : 'bg-white' : isDark ? 'bg-[#16382A]' : 'bg-[#E5E7EB]'
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="space-y-2">
                  <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] block ${
                    isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                  }`}>
                    Select Quantity
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center border rounded-xl p-1 ${
                      isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                    }`}>
                      <button
                        type="button"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                          isDark 
                            ? 'text-[#EDEDED] hover:bg-[#16382A] hover:text-[#B8954A]' 
                            : 'text-[#1A1A1A] hover:bg-white hover:text-[#1E5631]'
                        }`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className={`w-12 text-center text-sm font-sans-clean font-semibold tabular-nums ${
                        isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                      }`}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => quantity < 99 && setQuantity(quantity + 1)}
                        disabled={quantity >= 99}
                        aria-label="Increase quantity"
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                          isDark 
                            ? 'text-[#EDEDED] hover:bg-[#16382A] hover:text-[#B8954A]' 
                            : 'text-[#1A1A1A] hover:bg-white hover:text-[#1E5631]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className={`text-[11px] font-sans-clean uppercase tracking-[0.2em] ${
                      isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                    }`}>
                      Portion / Pack
                    </span>
                  </div>
                </div>

                {/* Selection summary */}
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                }`}>
                  <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
                    isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
                  }`}>
                    <span className={`text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] ${
                      isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                    }`}>
                      Your Selection
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`font-editorial text-sm font-bold ${
                        isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                      }`}>
                        {product.name}
                      </span>
                      <span className={`text-xs font-sans-clean ml-1.5 ${
                        isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                      }`}>
                        • {selectedOption.name}
                      </span>
                    </div>
                    <span className={`text-xs font-sans-clean font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${
                      isDark 
                        ? 'bg-[#16382A] border-[#B8954A]/30 text-[#EDEDED]' 
                        : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
                    }`}>
                      Qty: {quantity}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Add to Cart, Inquiry Modal & WhatsApp */}
                <div className="space-y-2.5 pt-1">
                  {/* Primary 1: Add to Cart */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`btn-tactile flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-sans-clean font-bold tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer shadow-md min-h-[48px] ${
                        isAddedFeedback
                          ? 'bg-emerald-600 text-white'
                          : isDark
                            ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16]'
                            : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white'
                      }`}
                    >
                      {isAddedFeedback ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart ({quantity}x)</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {isAddedFeedback && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openCart();
                        }}
                        className={`btn-tactile inline-flex items-center justify-center px-4 py-4 text-xs font-sans-clean font-bold tracking-[0.15em] uppercase rounded-xl border transition-all cursor-pointer shadow-md min-h-[48px] ${
                          isDark
                            ? 'bg-[#16382A] text-[#B8954A] border-[#B8954A]'
                            : 'bg-white text-[#1E5631] border-[#1E5631]'
                        }`}
                      >
                        <span>View Cart</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    )}
                  </div>

                  {/* WhatsApp Quick Order & Inquiry Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-sans-clean font-bold tracking-[0.15em] uppercase rounded-xl group cursor-pointer border min-h-[44px] ${
                        isDark
                          ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                          : 'bg-[#F5F5F0] hover:bg-white text-[#1A1A1A] border-[#E5E7EB] hover:border-[#1E5631]/40'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WhatsApp Order</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(true)}
                      className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-4 py-3 border text-[11px] font-sans-clean font-semibold tracking-[0.12em] uppercase rounded-xl transition-all cursor-pointer min-h-[44px] ${
                        isDark
                          ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/40'
                          : 'bg-[#F5F5F0] hover:bg-white text-[#1A1A1A] border-[#E5E7EB]'
                      }`}
                    >
                      <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                      <span>Inquiry Form</span>
                    </button>
                  </div>

                  {/* Secondary: Ask Customer Care */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openAssistant(product);
                    }}
                    className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border text-xs font-sans-clean font-semibold tracking-[0.1em] rounded-xl transition-colors cursor-pointer min-h-[44px] ${
                      isDark
                        ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]'
                        : 'bg-[#F5F5F0] text-[#1A1A1A] border-[#E5E7EB] hover:border-[#1E5631]'
                    }`}
                  >
                    <Headphones className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                    <span>Have questions? Ask Customer Care</span>
                  </button>
                </div>

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

            {/* Customer Inquiry Modal */}
            <CustomerInquiryModal
              isOpen={isInquiryModalOpen}
              onClose={() => setIsInquiryModalOpen(false)}
              initialData={{
                product: product,
                productName: product.name,
                category: product.category === 'Crayfish' ? 'crayfish' : 'stockfish',
                option: selectedOption.name,
                quantity: String(quantity)
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

