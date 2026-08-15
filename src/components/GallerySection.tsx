import React, { useState } from 'react';
import { ZoomIn, MessageCircle, ArrowUpRight } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { GalleryModal } from './GalleryModal';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stockfish' | 'crayfish'>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section id="gallery-section" className="py-20 sm:py-28 bg-[#f5f1e8] border-b border-[#ece6d9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-[#e2dbcd]">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1.5px] bg-[#c59b27]" />
              <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#c59b27]">
                Visual Presentation
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#122b1e]">
              Product Gallery
            </h2>
            <p className="text-sm sm:text-base text-[#57534a] font-sans-clean font-light">
              A closer look at our stockfish cuts, whole dried crayfish, and pure ground options.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(['all', 'stockfish', 'crayfish'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-sans-clean tracking-[0.15em] uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#122b1e] text-[#faf7f2] font-semibold'
                    : 'bg-[#faf7f2] border border-[#d8d0bf] text-[#57534a] hover:text-[#122b1e] hover:border-[#122b1e]'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            // Asymmetric aspect ratio styling
            let aspectClass = 'aspect-4/3';
            if (item.aspect === 'portrait') aspectClass = 'aspect-3/4 sm:aspect-4/5';
            if (item.aspect === 'square') aspectClass = 'aspect-square';
            if (item.aspect === 'landscape') aspectClass = 'aspect-16/10';

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group cursor-pointer bg-[#faf7f2] border border-[#e4ddcf] p-3 flex flex-col justify-between transition-all duration-300 hover:border-[#122b1e] hover:shadow-lg"
              >
                {/* Image Frame */}
                <div className={`relative ${aspectClass} overflow-hidden bg-[#122b1e]`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover img-zoom-hover"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0b1c13]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#faf7f2] text-[#122b1e] text-[11px] font-sans-clean font-semibold tracking-[0.18em] uppercase flex items-center gap-1.5 shadow-md">
                      <ZoomIn className="w-3.5 h-3.5 text-[#c59b27]" />
                      View Image
                    </span>
                  </div>
                </div>

                {/* Minimal Caption */}
                <div className="pt-4 pb-1 space-y-1">
                  <span className="text-[10px] font-sans-clean font-medium uppercase tracking-[0.2em] text-[#8a8477]">
                    {item.category}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#122b1e] group-hover:text-[#c59b27] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6b665c] font-sans-clean font-light line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery WhatsApp Inquiry Banner */}
        <div className="p-8 sm:p-10 bg-[#122b1e] text-[#faf7f2] border border-[#0b1c13] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#c59b27]">
              Inquire About Today's Stock
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#faf7f2]">
              Have questions about current availability or custom cuts?
            </h3>
            <p className="text-xs sm:text-sm text-[#c8d4cc] font-sans-clean font-light">
              Message us directly on WhatsApp for real-time stock details and pricing.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 bg-[#c59b27] hover:bg-[#d8b14a] text-[#122b1e] text-xs font-semibold tracking-[0.15em] uppercase transition-all shadow-md shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#122b1e]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      <GalleryModal
        item={activeModalItem}
        isOpen={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </section>
  );
};
