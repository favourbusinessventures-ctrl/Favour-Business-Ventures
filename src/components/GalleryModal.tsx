import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, MessageCircle, ArrowUpRight, CheckCircle2, Utensils, ShieldCheck } from 'lucide-react';
import { GalleryItem, NavigationTab } from '../types';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface GalleryModalProps {
  item: GalleryItem;
  onClose: () => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose, onNavigate }) => {
  const { isDark } = useTheme();
  const { settings } = useBusinessSettings();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const whatsappUrl = buildWhatsAppUrl(
    `Hello ${settings.shortName || 'FAVORA'}, I saw ${item.title} in your gallery and I would like to make an order. Please share availability and current pricing.`,
    settings.whatsappNumberRaw
  );

  const handleGoToProducts = () => {
    onClose();
    if (onNavigate) {
      onNavigate('products');
    } else {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`relative max-w-4xl w-full border shadow-2xl overflow-hidden rounded-2xl transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0D3325] border-[#16382A] text-[#EDEDED]' 
            : 'bg-[#FFFDF8] border-[#DED4BF] text-[#173B2A]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 z-10 w-11 h-11 transition-colors flex items-center justify-center cursor-pointer rounded-xl border shadow-md ${
            isDark
              ? 'bg-[#071F16] text-[#EDEDED] hover:bg-[#B8954A] hover:text-[#071F16] border-[#16382A]'
              : 'bg-[#F5F0E6] text-[#173B2A] hover:bg-[#173B2A] hover:text-white border-[#DED4BF]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[88vh] overflow-y-auto">
          {/* Image Display */}
          <div className={`md:col-span-7 flex items-center justify-center p-4 sm:p-6 sm:min-h-[380px] ${
            isDark ? 'bg-[#071F16]' : 'bg-[#F5F0E6]'
          }`}>
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[45vh] sm:max-h-[55vh] md:max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
            />
          </div>

          {/* Details Column */}
          <div className={`md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
            isDark ? 'bg-[#0D3325]' : 'bg-[#FFFDF8]'
          }`}>
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-sans-clean font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-md border ${
                  isDark 
                    ? 'bg-[#071F16] text-[#B8954A] border-[#16382A]' 
                    : 'bg-[#F5F0E6] text-[#B58A32] border-[#DED4BF]'
                }`}>
                  {item.category.toUpperCase()}
                </span>
                {item.badge && (
                  <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-md ${
                    isDark ? 'bg-[#16382A] text-[#EDEDED]' : 'bg-[#FAF7F0] text-[#173B2A] border border-[#DED4BF]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className={`font-editorial text-2xl sm:text-3xl font-bold leading-tight ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}>
                {item.title}
              </h3>

              <div className={`w-10 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#B58A32]'}`} />

              <p className={`text-sm font-sans-clean leading-relaxed ${
                isDark ? 'text-[#EDEDED]/80 font-light' : 'text-[#35463C] font-medium'
              }`}>
                {item.description}
              </p>

              {/* Kitchen & Quality Assurance Details */}
              <div className={`pt-3 pb-2 space-y-2.5 border-t text-xs font-sans-clean ${
                isDark ? 'border-[#16382A] text-[#EDEDED]/75' : 'border-[#DED4BF] text-[#35463C]'
              }`}>
                {item.kitchenUse && (
                  <div className="flex items-start gap-2">
                    <Utensils className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
                    <span><strong className="font-semibold">Culinary Use:</strong> {item.kitchenUse}</span>
                  </div>
                )}
                {item.processNote ? (
                  <div className="flex items-start gap-2">
                    <ShieldCheck className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
                    <span><strong className="font-semibold">Quality Handling:</strong> {item.processNote}</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
                    <span><strong className="font-semibold">Standard:</strong> Thoroughly inspected, clean and ready for your kitchen.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquire & Order Action */}
            <div className={`pt-5 border-t space-y-3 ${
              isDark ? 'border-[#16382A]' : 'border-[#DED4BF]'
            }`}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-tactile w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase shadow-sm group rounded-xl min-h-[46px] ${
                  isDark
                    ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border border-[#16382A] hover:border-[#B8954A]/40'
                    : 'bg-[#173B2A] hover:bg-[#28533C] text-white border border-[#173B2A]'
                }`}
              >
                <MessageCircle className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleGoToProducts}
                className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] font-sans-clean font-bold tracking-[0.15em] uppercase rounded-xl transition-colors cursor-pointer min-h-[42px] ${
                  isDark
                    ? 'bg-transparent hover:bg-[#16382A]/40 text-[#EDEDED]/80 border border-[#16382A]'
                    : 'bg-[#F5F0E6] hover:bg-[#EAE2D2] text-[#173B2A] border border-[#DED4BF]'
                }`}
              >
                <span>View Products Catalogue →</span>
              </button>

              <p className={`text-[11px] text-center font-sans-clean ${
                isDark ? 'text-[#EDEDED]/50' : 'text-[#667268]'
              }`}>
                Direct quality fulfillment by {settings.name}
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

