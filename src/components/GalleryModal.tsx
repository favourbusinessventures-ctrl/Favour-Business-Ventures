import React from 'react';
import { X, MessageCircle, ArrowUpRight } from 'lucide-react';
import { GalleryItem } from '../types';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface GalleryModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const whatsappUrl = buildWhatsAppUrl(
    `Hello Favour Business Ventures, I am inquiring about the ${item.title} shown in your gallery. Please share current availability and details.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0b1c13]/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#faf7f2] border border-[#e4ddcf] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#122b1e] text-[#faf7f2] hover:bg-[#c59b27] transition-colors flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Image Display */}
          <div className="md:col-span-7 bg-[#122b1e] flex items-center justify-center p-4 sm:p-6">
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] w-full object-contain"
            />
          </div>

          {/* Details Column */}
          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#faf7f2]">
            <div className="space-y-4">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#c59b27] block">
                {item.category.toUpperCase()}
              </span>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122b1e]">
                {item.title}
              </h3>

              <div className="w-8 h-[1.5px] bg-[#c59b27]" />

              <p className="text-sm text-[#47433c] font-sans-clean font-light leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-6 border-t border-[#e8e2d5] space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] text-xs font-medium tracking-[0.15em] uppercase transition-all shadow-xs group"
              >
                <MessageCircle className="w-4 h-4 text-[#c59b27]" />
                <span>Inquire on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#faf7f2]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <p className="text-[11px] text-center text-[#7a7569] font-sans-clean">
                Direct inquiry with {BUSINESS_CONFIG.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
