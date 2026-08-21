import React, { useState } from 'react';
import { ZoomIn, MessageCircle } from 'lucide-react';
import { useLiveGallery } from '../hooks/useLiveGallery';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { GalleryModal } from './GalleryModal';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const GallerySection: React.FC = () => {
  const { galleryItems } = useLiveGallery();
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stockfish' | 'crayfish'>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const displayList = galleryItems && galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;

  const filteredItems = selectedCategory === 'all'
    ? displayList
    : displayList.filter((item) => item.category === selectedCategory);

  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <section 
      id="gallery-section" 
      className={`py-16 sm:py-24 lg:py-32 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* Header & Filter Tabs */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b ${
          isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
        }`}>
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
              <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                Culinary Portfolio
              </span>
            </div>
            <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${
              isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
            }`}>
              The Food Campaign
            </h2>
            <p className={`text-sm sm:text-base font-sans-clean font-light ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
              An intimate look at our stockfish cuts, bone collars, whole sun-dried crayfish, and pure ground powder.
            </p>
          </div>

          {/* Filter Tabs (Touch Targets >= 44px) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'stockfish', 'crayfish'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-tactile px-5 py-2.5 text-[11px] font-sans-clean tracking-[0.2em] uppercase cursor-pointer rounded-xl whitespace-nowrap flex items-center justify-center min-h-[44px] transition-all ${
                  selectedCategory === cat
                    ? isDark 
                      ? 'bg-[#16382A] text-[#EDEDED] font-semibold border border-[#B8954A] shadow-sm'
                      : 'bg-[#1E5631] text-white font-semibold border border-[#1E5631] shadow-sm'
                    : isDark
                      ? 'bg-[#0D3325] border border-[#16382A] text-[#EDEDED]/70 hover:text-[#EDEDED] hover:border-[#B8954A]/40'
                      : 'bg-white border border-[#E5E7EB] text-[#525252] hover:text-[#1A1A1A] hover:border-[#1E5631]/30'
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
                className={`group cursor-pointer p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl rounded-2xl border ${
                  isDark 
                    ? 'bg-[#0D3325] border-[#16382A] hover:border-[#B8954A]/50' 
                    : 'bg-white border-[#E5E7EB] hover:border-[#1E5631]/40'
                }`}
              >
                {/* Image Frame with controlled aspect ratio */}
                <div className="relative overflow-hidden rounded-xl">
                  <ImageWithPlaceholder
                    src={item.imageUrl}
                    alt={item.title}
                    aspectRatioClass={aspectClass}
                    theme={isDark ? 'dark' : 'light'}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  
                  {/* Subtle Touch / Hover Indicator */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className={`px-4 py-2 text-[10px] font-sans-clean font-semibold tracking-[0.25em] uppercase flex items-center gap-2 shadow-md rounded-lg ${
                      isDark ? 'bg-[#071F16] text-[#EDEDED]' : 'bg-white text-[#1A1A1A]'
                    }`}>
                      <ZoomIn className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                      Expand View
                    </span>
                  </div>
                </div>

                {/* Editorial Caption */}
                <div className="pt-5 pb-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-sans-clean font-semibold uppercase tracking-[0.25em] ${
                      isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                    }`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-sans-clean ${
                      isDark ? 'text-[#EDEDED]/50' : 'text-[#6B7266]'
                    }`}>
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className={`font-editorial text-xl sm:text-2xl font-bold transition-colors ${
                    isDark ? 'text-[#EDEDED] group-hover:text-[#B8954A]' : 'text-[#1A1A1A] group-hover:text-[#1E5631]'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`font-editorial italic text-sm ${
                    isDark ? 'text-[#A3B899]' : 'text-[#525252]'
                  }`}>
                    {subtleCaption}
                  </p>

                  <p className={`text-xs font-sans-clean font-light line-clamp-2 leading-relaxed pt-1 ${
                    isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campaign Action Strip */}
        <div className={`p-6 sm:p-10 lg:p-12 border flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl ${
          isDark 
            ? 'bg-[#0D3325] text-[#EDEDED] border-[#16382A]' 
            : 'bg-[#1E5631] text-white border-[#1E5631]'
        }`}>
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className={`text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.35em] block ${
              isDark ? 'text-[#B8954A]' : 'text-[#B8954A]'
            }`}>
              Direct Desk
            </span>
            <h3 className="font-editorial text-2xl sm:text-4xl font-bold">
              Need custom cuts or commercial quantity?
            </h3>
            <p className="text-xs sm:text-sm font-sans-clean font-light leading-relaxed opacity-85">
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
