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
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`relative max-w-4xl w-full border shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl transition-colors duration-300 flex flex-col md:flex-row max-h-[92vh] sm:max-h-[88vh] ${
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
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-11 h-11 transition-colors flex items-center justify-center cursor-pointer rounded-xl border shadow-md ${
            isDark
              ? 'bg-[#071F16] text-[#EDEDED] hover:bg-[#B8954A] hover:text-[#071F16] border-[#16382A]'
              : 'bg-[#F5F0E6] text-[#173B2A] hover:bg-[#173B2A] hover:text-white border-[#DED4BF]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row w-full overflow-y-auto max-h-[92vh] sm:max-h-[88vh]">
          {/* Image Display */}
          <div className={`md:w-[52%] flex items-center justify-center p-4 sm:p-6 md:p-8 shrink-0 border-b md:border-b-0 md:border-r ${
            isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#FAF7F0] border-[#DED4BF]'
          }`}>
            <div className="w-full h-full min-h-[220px] sm:min-h-[280px] md:min-h-[380px] max-h-[440px] flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="max-h-[36vh] sm:max-h-[48vh] md:max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-md"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className={`flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between space-y-5 overflow-y-auto ${
            isDark ? 'bg-[#0D3325]' : 'bg-[#FFFDF8]'
          }`}>
            <div className="space-y-3.5 pr-8 sm:pr-0">
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

              <p className={`text-xs sm:text-sm font-sans-clean leading-relaxed ${
                isDark ? 'text-[#EDEDED]/80 font-light' : 'text-[#35463C] font-medium'
              }`}>
                {item.description}
              </p>

              {/* Kitchen & Quality Assurance Details */}
              <div className={`pt-3 pb-1 space-y-2 border-t text-xs font-sans-clean ${
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
            <div className={`pt-4 border-t space-y-2.5 ${
              isDark ? 'border-[#16382A]' : 'border-[#DED4BF]'
            }`}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-tactile w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase shadow-sm group rounded-xl min-h-[46px] ${
                  isDark
                    ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16]'
                    : 'bg-[#173B2A] hover:bg-[#28533C] text-white border border-[#173B2A]'
                }`}
              >
                <MessageCircle className={`w-4 h-4 ${isDark ? 'text-[#071F16]' : 'text-[#B58A32]'}`} />
                <span>Order on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleGoToProducts}
                className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] font-sans-clean font-bold tracking-[0.15em] uppercase rounded-xl transition-colors cursor-pointer min-h-[42px] border ${
                  isDark
                    ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A]'
                    : 'bg-[#F5F0E6] hover:bg-[#EAE2D2] text-[#173B2A] border-[#DED4BF]'
                }`}
              >
                <span>View Products Catalogue →</span>
              </button>

              <p className={`text-[10.5px] text-center font-sans-clean ${
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

