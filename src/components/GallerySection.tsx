import React, { useState } from 'react';
import { ZoomIn, MessageCircle } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { GalleryModal } from './GalleryModal';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stockfish' | 'crayfish'>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section id="gallery-section" className="py-24 sm:py-36 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 space-y-16 sm:space-y-24">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#E5DEC9]">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                Culinary Portfolio
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#071F16]">
              The Food Campaign
            </h2>
            <p className="text-base sm:text-lg text-[#6B7266] font-sans-clean font-light">
              An intimate look at our stockfish cuts, bone collars, whole sun-dried crayfish, and pure ground powder.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {(['all', 'stockfish', 'crayfish'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-[11px] font-sans-clean tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px] ${
                  selectedCategory === cat
                    ? 'bg-[#071F16] text-[#F5F0E6] font-semibold border border-[#B8954A]/40'
                    : 'bg-[#FFF9EF] border border-[#E5DEC9] text-[#6B7266] hover:text-[#071F16] hover:border-[#071F16]'
                }`}
              >
                {cat === 'all' ? 'All Provisions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Photo Campaign Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredItems.map((item, index) => {
            let aspectClass = 'aspect-4/3';
            if (item.aspect === 'portrait') aspectClass = 'aspect-3/4 sm:aspect-4/5';
            if (item.aspect === 'square') aspectClass = 'aspect-square';

            const subtleCaption = item.category === 'stockfish'
              ? 'Carefully selected.'
              : 'Rich flavour. Simple ingredient.';

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group cursor-pointer bg-[#FFF9EF] border border-[#E5DEC9] p-4 flex flex-col justify-between transition-all duration-500 hover:border-[#071F16] hover:shadow-xl rounded-[2px]"
              >
                {/* Image Frame */}
                <div className={`relative ${aspectClass} overflow-hidden bg-[#071F16]`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover img-editorial-zoom"
                    loading="lazy"
                  />
                  
                  {/* Subtle Hover Reveal */}
                  <div className="absolute inset-0 bg-[#071F16]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#F5F0E6] text-[#071F16] text-[10px] font-sans-clean font-semibold tracking-[0.25em] uppercase flex items-center gap-2 shadow-md rounded-[2px]">
                      <ZoomIn className="w-3.5 h-3.5 text-[#B8954A]" />
                      Expand
                    </span>
                  </div>
                </div>

                {/* Editorial Caption */}
                <div className="pt-6 pb-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-sans-clean text-[#6B7266]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl font-bold text-[#071F16] group-hover:text-[#B8954A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-editorial italic text-sm text-[#6B7266]">
                    {subtleCaption}
                  </p>

                  <p className="text-xs text-[#6B7266] font-sans-clean font-light line-clamp-2 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campaign Action Strip in Deep Luxury Green */}
        <div className="p-8 sm:p-12 lg:p-14 bg-[#071F16] text-[#F5F0E6] border border-[#16382A] flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2px]">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.35em] text-[#B8954A] block">
              Direct Desk
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#F5F0E6]">
              Need custom cuts or commercial quantity?
            </h3>
            <p className="text-xs sm:text-sm text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
              Message us directly on WhatsApp for live product availability, portion confirmations, and fast quotes.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md shrink-0 rounded-[2px]"
          >
            <MessageCircle className="w-4 h-4 text-[#071F16]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Modal View */}
      {activeModalItem && (
        <GalleryModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </section>
  );
};
