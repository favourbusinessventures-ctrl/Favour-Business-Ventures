import React, { useState } from 'react';
import { ZoomIn, MessageCircle } from 'lucide-react';
import { useLiveGallery } from '../hooks/useLiveGallery';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { GalleryModal } from './GalleryModal';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const GallerySection: React.FC = () => {
  const { galleryItems } = useLiveGallery();
  const { settings } = useBusinessSettings();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stockfish' | 'crayfish'>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const displayList = galleryItems && galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;

  const filteredItems = selectedCategory === 'all'
    ? displayList
    : displayList.filter((item) => item.category === selectedCategory);

  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <section id="gallery-section" className="py-16 sm:py-24 lg:py-32 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-[#E5DEC9]">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                Culinary Portfolio
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#071F16]">
              The Food Campaign
            </h2>
            <p className="text-sm sm:text-base text-[#6B7266] font-sans-clean font-light">
              An intimate look at our stockfish cuts, bone collars, whole sun-dried crayfish, and pure ground powder.
            </p>
          </div>

          {/* Filter Tabs (Touch Targets >= 44px) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'stockfish', 'crayfish'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-tactile px-5 py-2.5 text-[11px] font-sans-clean tracking-[0.2em] uppercase cursor-pointer rounded-[2px] whitespace-nowrap flex items-center justify-center ${
                  selectedCategory === cat
                    ? 'bg-[#071F16] text-[#F5F0E6] font-semibold border border-[#B8954A]/40 shadow-sm'
                    : 'bg-[#FFF9EF] border border-[#E5DEC9] text-[#6B7266] hover:text-[#071F16] hover:border-[#071F16]'
                }`}
              >
                {cat === 'all' ? 'All Provisions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Photo Campaign Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            let aspectClass = 'aspect-[4/3]';
            if (item.aspect === 'portrait') aspectClass = 'aspect-[3/4] sm:aspect-[4/5]';
            if (item.aspect === 'square') aspectClass = 'aspect-square';

            const subtleCaption = item.category === 'stockfish'
              ? 'Carefully selected.'
              : 'Rich flavour. Simple ingredient.';

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group cursor-pointer bg-[#FFF9EF] border border-[#E5DEC9] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:border-[#071F16] hover:shadow-lg rounded-[2px]"
              >
                {/* Image Frame with controlled aspect ratio */}
                <div className="relative overflow-hidden rounded-[1px]">
                  <ImageWithPlaceholder
                    src={item.imageUrl}
                    alt={item.title}
                    aspectRatioClass={aspectClass}
                    theme="light"
                    className="w-full h-full object-cover img-editorial-zoom"
                  />
                  
                  {/* Subtle Touch / Hover Indicator */}
                  <div className="absolute inset-0 bg-[#071F16]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-[#F5F0E6] text-[#071F16] text-[10px] font-sans-clean font-semibold tracking-[0.25em] uppercase flex items-center gap-2 shadow-md rounded-[2px]">
                      <ZoomIn className="w-3.5 h-3.5 text-[#B8954A]" />
                      Expand View
                    </span>
                  </div>
                </div>

                {/* Editorial Caption */}
                <div className="pt-5 pb-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-sans-clean text-[#6B7266]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#071F16] group-hover:text-[#B8954A] transition-colors">
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
        <div className="p-6 sm:p-10 lg:p-12 bg-[#071F16] text-[#F5F0E6] border border-[#16382A] flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2px]">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.35em] text-[#B8954A] block">
              Direct Desk
            </span>
            <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-[#F5F0E6]">
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
            className="btn-tactile btn-whatsapp-gold inline-flex items-center justify-center gap-3 px-8 py-4 text-[#071F16] text-xs font-bold tracking-[0.2em] uppercase shadow-lg shrink-0 rounded-xl"
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
