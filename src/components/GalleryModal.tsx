import React, { useEffect } from 'react';
import { X, MessageCircle, ArrowUpRight } from 'lucide-react';
import { GalleryItem } from '../types';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface GalleryModalProps {
  item: GalleryItem;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const whatsappUrl = buildWhatsAppUrl(
    `Hello Favour Business Ventures, I am interested in ordering ${item.title}. Please share available quantities and pricing.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#071F16]/90 backdrop-blur-md animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#FFF9EF] border border-[#E5DEC9] shadow-2xl overflow-hidden rounded-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#071F16] text-[#F5F0E6] hover:bg-[#B8954A] hover:text-[#071F16] transition-colors flex items-center justify-center cursor-pointer rounded-[1px]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Image Display */}
          <div className="md:col-span-7 bg-[#071F16] flex items-center justify-center p-4 sm:p-6">
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] md:max-h-[75vh] w-auto object-contain"
            />
          </div>

          {/* Details Column */}
          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#FFF9EF]">
            <div className="space-y-4">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.3em] text-[#B8954A] block">
                {item.category.toUpperCase()}
              </span>

              <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-[#071F16]">
                {item.title}
              </h3>

              <div className="w-8 h-[1.5px] bg-[#B8954A]" />

              <p className="text-sm text-[#6B7266] font-sans-clean font-light leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Inquire Action */}
            <div className="pt-6 border-t border-[#E5DEC9] space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#071F16] hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/30 text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-sm group rounded-[2px]"
              >
                <MessageCircle className="w-4 h-4 text-[#B8954A]" />
                <span>Inquire on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F5F0E6]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <p className="text-[11px] text-center text-[#6B7266] font-sans-clean">
                Direct inquiry with {BUSINESS_CONFIG.name}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
