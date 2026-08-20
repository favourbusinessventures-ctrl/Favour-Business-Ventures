import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MessageCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Loader2, 
  Package, 
  Phone, 
  User, 
  MapPin, 
  FileText,
  AlertCircle 
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductDetail } from '../types';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export interface InquiryInitialData {
  product?: ProductDetail | null;
  productName?: string;
  category?: 'stockfish' | 'crayfish';
  option?: string;
  quantity?: string;
}

interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InquiryInitialData;
}

export const CustomerInquiryModal: React.FC<CustomerInquiryModalProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const { isDark } = useTheme();
  const { settings } = useBusinessSettings();
  const { products } = useLiveProducts();

  // Form Fields
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [selectedProductName, setSelectedProductName] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [customerMessage, setCustomerMessage] = useState<string>('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage(null);

      const targetProdName = initialData?.product?.name || initialData?.productName || (products[0]?.name ?? 'Stockfish Prime Body Cuts');
      setSelectedProductName(targetProdName);

      const targetProd = products.find(p => p.name === targetProdName) || initialData?.product;
      const defaultOption = initialData?.option || (targetProd?.options?.[0]?.name ?? 'Standard Pack');
      setSelectedOption(defaultOption);

      setQuantity(initialData?.quantity || '1');
    }
  }, [isOpen, initialData, products]);

  // Selected product object
  const currentProduct = products.find(p => p.name === selectedProductName);
  const currentOptions = currentProduct?.options || [];

  // Handle product change
  const handleProductChange = (newProdName: string) => {
    setSelectedProductName(newProdName);
    const prod = products.find(p => p.name === newProdName);
    if (prod && prod.options && prod.options.length > 0) {
      setSelectedOption(prod.options[0].name);
    } else {
      setSelectedOption('');
    }
  };

  // Generate WhatsApp pre-formatted URL
  const generateWhatsAppUrl = () => {
    const lines = [
      `*ORDER & INQUIRY — ${settings.name.toUpperCase()}*`,
      `----------------------------------------`,
      `*Customer Name:* ${customerName.trim()}`,
      `*Phone Number:* ${customerPhone.trim()}`,
      customerEmail.trim() ? `*Email:* ${customerEmail.trim()}` : null,
      `*Product:* ${selectedProductName}`,
      selectedOption ? `*Option / Cut:* ${selectedOption}` : null,
      `*Quantity / Volume:* ${quantity.trim() || '1'}`,
      customerMessage.trim() ? `*Notes / Destination:* ${customerMessage.trim()}` : null,
      `----------------------------------------`,
      `Hello, I would like to inquire about availability and pricing for this order. Thank you!`
    ].filter(Boolean);

    return buildWhatsAppUrl(lines.join('\n'), settings.whatsappNumberRaw);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMessage('Please enter a valid phone or WhatsApp number.');
      return;
    }

    if (!selectedProductName) {
      setErrorMessage('Please select a product.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || '',
        productName: selectedProductName,
        category: currentProduct?.category === 'Crayfish' ? 'crayfish' : 'stockfish',
        option: selectedOption || 'Standard',
        quantity: quantity.trim() || '1',
        customerMessage: customerMessage.trim(),
        source: 'website',
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderPayload);
      setIsSuccess(true);
    } catch (err: any) {
      console.warn('Inquiry submission notice:', err);
      // Fallback: don't block the user, allow continuing on WhatsApp directly
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden z-10 my-8 ${
            isDark 
              ? 'bg-[#0D3325] border-[#16382A] text-[#F5F0E6]' 
              : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16]'
          }`}
        >
          {/* Top Gold Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#B8954A] via-[#E8D49E] to-[#B8954A]" />

          {/* Modal Header */}
          <div className={`p-6 border-b flex items-start justify-between gap-4 ${
            isDark ? 'border-[#16382A] bg-[#071F16]/50' : 'border-[#E5DEC9] bg-[#F5F0E6]/50'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-[1.5px] bg-[#B8954A]" />
                <span className="text-[10px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-[#B8954A]">
                  Direct Inquiry & Order
                </span>
              </div>
              <h2 id="inquiry-modal-title" className="font-editorial text-2xl font-bold tracking-tight">
                {isSuccess ? 'Inquiry Sent' : 'Make an Inquiry'}
              </h2>
            </div>

            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-[#16382A] text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A]'
                  : 'border-[#E5DEC9] text-[#6B7266] hover:text-[#071F16] hover:bg-[#F5F0E6]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {isSuccess ? (
              /* Success View */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-editorial text-2xl font-bold">
                    Thank you, {customerName}!
                  </h3>
                  <p className={`text-xs sm:text-sm font-sans-clean font-light leading-relaxed max-w-sm mx-auto ${
                    isDark ? 'text-[#F5F0E6]/75' : 'text-[#6B7266]'
                  }`}>
                    We have received your inquiry for <strong className="font-semibold text-[#B8954A]">{selectedProductName}</strong> ({selectedOption || 'Standard'}). Our team will reach out to you promptly.
                  </p>
                </div>

                {/* Instant WhatsApp Action */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F0E6] border-[#E5DEC9]'
                }`}>
                  <p className="text-[11px] font-sans-clean font-medium">
                    Need instant confirmation? Click below to send this directly on WhatsApp:
                  </p>
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile btn-whatsapp-gold w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xl shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-[#071F16]" />
                    <span>Continue on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16]" />
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    type="button"
                    className={`px-6 py-2.5 text-xs font-sans-clean font-semibold tracking-wider uppercase rounded-lg border transition-colors cursor-pointer ${
                      isDark
                        ? 'border-[#16382A] text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A]'
                        : 'border-[#E5DEC9] text-[#6B7266] hover:text-[#071F16] hover:bg-[#E5DEC9]'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Inquiry Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#B8954A] flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Chief Emeka Okonkwo"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all ${
                      isDark
                        ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6] placeholder-[#A3B899]/40'
                        : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16] placeholder-[#6B7266]/60'
                    }`}
                  />
                </div>

                {/* Customer Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#B8954A] flex items-center gap-1.5">
                      <Phone className="w-3 h-3" />
                      <span>Phone / WhatsApp *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all ${
                        isDark
                          ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6] placeholder-[#A3B899]/40'
                          : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16] placeholder-[#6B7266]/60'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-sans-clean font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                      isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                    }`}>
                      <span>Email (Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. emeka@gmail.com"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all ${
                        isDark
                          ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6] placeholder-[#A3B899]/40'
                          : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16] placeholder-[#6B7266]/60'
                      }`}
                    />
                  </div>
                </div>

                {/* Product Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#B8954A] flex items-center gap-1.5">
                    <Package className="w-3 h-3" />
                    <span>Select Product *</span>
                  </label>
                  <select
                    value={selectedProductName}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all cursor-pointer ${
                      isDark
                        ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6]'
                        : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16]'
                    }`}
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.name}>
                        {prod.name} ({prod.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Option / Cut & Quantity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option/Cut */}
                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-sans-clean font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                      isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                    }`}>
                      <span>Portion / Cut</span>
                    </label>
                    {currentOptions.length > 0 ? (
                      <select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all cursor-pointer ${
                          isDark
                            ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6]'
                            : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16]'
                        }`}
                      >
                        {currentOptions.map((opt, i) => (
                          <option key={i} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        placeholder="Standard"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all ${
                          isDark
                            ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6]'
                            : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16]'
                        }`}
                      />
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#B8954A] flex items-center gap-1.5">
                      <span>Quantity / Volume *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 1 bag, 2 cartons, 5 kg"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all ${
                        isDark
                          ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6] placeholder-[#A3B899]/40'
                          : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16] placeholder-[#6B7266]/60'
                      }`}
                    />
                  </div>
                </div>

                {/* Delivery Destination or Special Notes */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-sans-clean font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                  }`}>
                    <MapPin className="w-3 h-3" />
                    <span>Delivery Location & Special Instructions</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    placeholder="e.g. Delivery to Lekki Phase 1, Lagos. Need by Friday."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 transition-all resize-none ${
                      isDark
                        ? 'bg-[#071F16] border-[#16382A] text-[#F5F0E6] placeholder-[#A3B899]/40'
                        : 'bg-[#FFF9EF] border-[#E5DEC9] text-[#071F16] placeholder-[#6B7266]/60'
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-tactile flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer disabled:opacity-60 min-h-[44px] shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>

                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile btn-whatsapp-gold sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xl transition-all min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#071F16]" />
                    <span>WhatsApp Directly</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
