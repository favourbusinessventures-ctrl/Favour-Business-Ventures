import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, MessageCircle, ArrowUpRight } from 'lucide-react';
import { GalleryItem } from '../types';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface GalleryModalProps {
  item: GalleryItem;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose }) => {
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
    `Hello ${settings.shortName || 'Favour Business Ventures'}, I am interested in ordering ${item.title}. Please share available quantities and pricing.`,
    settings.whatsappNumberRaw
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`relative max-w-4xl w-full border shadow-2xl overflow-hidden rounded-2xl ${
          isDark 
            ? 'bg-[#0D3325] border-[#16382A] text-[#EDEDED]' 
            : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
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
              : 'bg-[#F5F5F0] text-[#1A1A1A] hover:bg-[#1E5631] hover:text-white border-[#E5E7EB]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Image Display */}
          <div className={`md:col-span-7 flex items-center justify-center p-4 sm:p-6 ${
            isDark ? 'bg-[#071F16]' : 'bg-[#F5F5F0]'
          }`}>
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[50vh] sm:max-h-[60vh] md:max-h-[75vh] w-auto object-contain rounded-xl"
            />
          </div>

          {/* Details Column */}
          <div className={`md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 ${
            isDark ? 'bg-[#0D3325]' : 'bg-white'
          }`}>
            <div className="space-y-3 sm:space-y-4">
              <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.3em] block ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                {item.category.toUpperCase()}
              </span>

              <h3 className={`font-editorial text-2xl sm:text-4xl font-bold ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                {item.title}
              </h3>

              <div className={`w-8 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />

              <p className={`text-sm font-sans-clean font-light leading-relaxed ${
                isDark ? 'text-[#EDEDED]/80' : 'text-[#525252]'
              }`}>
                {item.description}
              </p>
            </div>

            {/* Inquire Action */}
            <div className={`pt-6 border-t space-y-3 ${
              isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
            }`}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-tactile w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase shadow-sm group rounded-xl ${
                  isDark
                    ? 'bg-[#071F16] hover:bg-[#16382A] text-[#EDEDED] border border-[#16382A] hover:border-[#B8954A]/40'
                    : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <p className={`text-[11px] text-center font-sans-clean ${
                isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
              }`}>
                Direct inquiry with {settings.name}
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
