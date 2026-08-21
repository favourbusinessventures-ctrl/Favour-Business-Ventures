import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowUpRight, FileText, Headphones, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useCustomerCare } from '../context/CustomerCareContext';
import { useTheme } from '../context/ThemeContext';
import { getCartOrderWhatsAppUrl } from '../utils/whatsapp';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { CustomerInquiryModal } from './CustomerInquiryModal';
import { NavigationTab } from '../types';

interface CartDrawerProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { items, totalItems, isCartOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const { openAssistant } = useCustomerCare();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  // Close on escape key + prevent background body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen && !isInquiryModalOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, closeCart, isInquiryModalOpen]);

  const whatsappUrl = getCartOrderWhatsAppUrl(
    items.map((it) => ({
      productName: it.productName,
      selectedOption: it.selectedOption,
      quantity: it.quantity,
      category: it.category,
    })),
    settings.whatsappNumberRaw,
    customerNotes
  );

  const cartSummaryText = items
    .map((it) => `${it.productName} (${it.selectedOption}) x${it.quantity}`)
    .join(', ');

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[90] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-over Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping Cart Drawer"
              className={`relative z-10 w-full max-w-md md:max-w-lg h-full flex flex-col shadow-2xl border-l overflow-hidden ${
                isDark
                  ? 'bg-[#071F16] border-[#16382A] text-[#EDEDED]'
                  : 'bg-[#FAFAFA] border-[#E5E7EB] text-[#1A1A1A]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div
                className={`p-5 sm:p-6 flex items-center justify-between border-b ${
                  isDark ? 'border-[#16382A] bg-[#0D3325]/70' : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isDark
                        ? 'bg-[#071F16] border-[#B8954A]/30 text-[#B8954A]'
                        : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1E5631]'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      className={`font-editorial text-xl sm:text-2xl font-bold tracking-tight ${
                        isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      Your Order Cart
                    </h2>
                    <span
                      className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] ${
                        isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                      }`}
                    >
                      {totalItems} {totalItems === 1 ? 'Pack' : 'Packs'} Selected
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  aria-label="Close cart drawer"
                  className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#071F16] text-[#EDEDED] hover:bg-[#16382A] hover:text-[#B8954A] border-[#16382A]'
                      : 'bg-[#F5F5F0] text-[#1A1A1A] hover:bg-white hover:text-[#1E5631] border-[#E5E7EB]'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body (Items or Empty State) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-5">
                    <div
                      className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-sm ${
                        isDark
                          ? 'bg-[#0D3325] border-[#16382A] text-[#B8954A]'
                          : 'bg-white border-[#E5E7EB] text-[#1E5631]'
                      }`}
                    >
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>

                    <div className="space-y-2 max-w-xs">
                      <h3
                        className={`font-editorial text-2xl font-bold ${
                          isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                        }`}
                      >
                        Your cart is empty
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-sans-clean font-light leading-relaxed ${
                          isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
                        }`}
                      >
                        Browse our authentic stockfish and sun-dried crayfish collection and add the cuts you need.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        closeCart();
                        if (onNavigate) onNavigate('products');
                      }}
                      className={`btn-tactile inline-flex items-center gap-2 px-6 py-3.5 text-xs font-sans-clean font-bold tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer shadow-md ${
                        isDark
                          ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16]'
                          : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white'
                      }`}
                    >
                      <span>Browse Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* List of Cart Items */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <span
                        className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] ${
                          isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                        }`}
                      >
                        Selected Items ({items.length})
                      </span>
                      <button
                        onClick={clearCart}
                        className={`text-[11px] font-sans-clean underline cursor-pointer transition-colors ${
                          isDark ? 'text-[#EDEDED]/60 hover:text-[#B8954A]' : 'text-[#6B7266] hover:text-[#1E5631]'
                        }`}
                      >
                        Clear All
                      </button>
                    </div>

                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-3.5 sm:p-4 rounded-xl border flex gap-3.5 sm:gap-4 transition-all duration-200 ${
                          isDark
                            ? 'bg-[#0D3325] border-[#16382A]'
                            : 'bg-white border-[#E5E7EB] shadow-xs'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div
                          className={`w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border ${
                            isDark ? 'border-[#16382A] bg-[#071F16]' : 'border-[#E5E7EB] bg-[#F5F5F0]'
                          }`}
                        >
                          <ImageWithPlaceholder
                            src={item.imageUrl}
                            alt={item.productName}
                            aspectRatioClass="aspect-square"
                            theme={isDark ? 'dark' : 'light'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details & Quantity Controls */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`font-editorial text-base sm:text-lg font-bold leading-tight truncate ${
                                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                                }`}
                              >
                                {item.productName}
                              </h4>
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.productName} from cart`}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                                  isDark
                                    ? 'text-[#EDEDED]/50 hover:text-rose-400 hover:bg-[#071F16]'
                                    : 'text-[#6B7266] hover:text-rose-600 hover:bg-[#F5F5F0]'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <span
                              className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10.5px] font-sans-clean font-medium border ${
                                isDark
                                  ? 'bg-[#071F16] border-[#16382A] text-[#B8954A]'
                                  : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1E5631]'
                              }`}
                            >
                              {item.selectedOption}
                            </span>
                          </div>

                          {/* Quantity selector */}
                          <div className="flex items-center justify-between pt-2">
                            <div
                              className={`inline-flex items-center border rounded-lg p-0.5 ${
                                isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease ${item.productName} quantity`}
                                className={`w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer ${
                                  isDark
                                    ? 'text-[#EDEDED] hover:bg-[#16382A] hover:text-[#B8954A]'
                                    : 'text-[#1A1A1A] hover:bg-white hover:text-[#1E5631]'
                                }`}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span
                                className={`w-9 text-center text-xs font-sans-clean font-bold tabular-nums ${
                                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                                }`}
                              >
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase ${item.productName} quantity`}
                                className={`w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer ${
                                  isDark
                                    ? 'text-[#EDEDED] hover:bg-[#16382A] hover:text-[#B8954A]'
                                    : 'text-[#1A1A1A] hover:bg-white hover:text-[#1E5631]'
                                }`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span
                              className={`text-[11px] font-sans-clean ${
                                isDark ? 'text-[#EDEDED]/60' : 'text-[#6B7266]'
                              }`}
                            >
                              {item.quantity} {item.quantity === 1 ? 'pack' : 'packs'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Optional Note / Destination input */}
                    <div
                      className={`p-3.5 rounded-xl border space-y-1.5 ${
                        isDark ? 'bg-[#0D3325]/70 border-[#16382A]' : 'bg-white border-[#E5E7EB]'
                      }`}
                    >
                      <label
                        htmlFor="cart-customer-notes"
                        className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] block ${
                          isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                        }`}
                      >
                        Delivery Destination / Special Notes (Optional)
                      </label>
                      <input
                        id="cart-customer-notes"
                        type="text"
                        placeholder="e.g. Waybill to Abuja / Lekki Phase 1"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className={`w-full px-3 py-2 text-xs font-sans-clean rounded-lg border focus:outline-none transition-colors ${
                          isDark
                            ? 'bg-[#071F16] border-[#16382A] text-[#EDEDED] focus:border-[#B8954A]'
                            : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1A1A1A] focus:border-[#1E5631]'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer & Ordering Actions */}
              {items.length > 0 && (
                <div
                  className={`p-5 sm:p-6 border-t space-y-3 ${
                    isDark ? 'border-[#16382A] bg-[#0D3325]/90' : 'border-[#E5E7EB] bg-white shadow-lg'
                  }`}
                >
                  {/* Order Summary Strip */}
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] block ${
                          isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                        }`}
                      >
                        Order Summary
                      </span>
                      <span
                        className={`text-xs font-sans-clean ${
                          isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
                        }`}
                      >
                        {totalItems} {totalItems === 1 ? 'Portion' : 'Portions'} across {items.length} provisions
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-sans-clean font-bold rounded-lg border ${
                        isDark
                          ? 'bg-[#16382A] border-[#B8954A]/30 text-[#EDEDED]'
                          : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
                      }`}
                    >
                      Ready to Dispatch
                    </span>
                  </div>

                  {/* Primary 1: Order via WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile btn-whatsapp-gold w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-sans-clean font-bold tracking-[0.2em] uppercase rounded-xl group cursor-pointer shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 text-[#071F16]" />
                    <span>Order Cart via WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4 text-[#071F16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Secondary 2: Inquiry / Custom Order Form */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(true)}
                      className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-3.5 py-3 border text-[11px] font-sans-clean font-semibold tracking-[0.1em] uppercase rounded-xl transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A]'
                          : 'bg-[#F5F5F0] hover:bg-white text-[#1A1A1A] border-[#E5E7EB]'
                      }`}
                    >
                      <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                      <span>Inquiry Form</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        closeCart();
                        openAssistant(null, `I need assistance with my current cart order containing: ${cartSummaryText}`);
                      }}
                      className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-3.5 py-3 border text-[11px] font-sans-clean font-semibold tracking-[0.1em] uppercase rounded-xl transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A]'
                          : 'bg-[#F5F5F0] hover:bg-white text-[#1A1A1A] border-[#E5E7EB]'
                      }`}
                    >
                      <Headphones className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                      <span>Ask Care</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Inquiry Modal (Pre-populated with entire Cart Selection) */}
      <CustomerInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        initialData={{
          productName: `Cart Order (${items.length} items)`,
          category: 'stockfish',
          option: cartSummaryText,
          quantity: String(totalItems),
          notes: customerNotes || 'Please quote pricing for all selected items and delivery.',
        }}
      />
    </>
  );
};
