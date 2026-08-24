import React, { useState } from 'react';
import { ZoomIn, MessageCircle, ArrowRight, ShieldCheck, Sparkles, PackageCheck, Utensils } from 'lucide-react';
import { useLiveGallery } from '../hooks/useLiveGallery';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem, NavigationTab } from '../types';
import { GalleryModal } from './GalleryModal';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface GallerySectionProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onNavigate }) => {
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

  const handleExploreProducts = () => {
    if (onNavigate) {
      onNavigate('products');
    } else {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="gallery-section" 
      className={`py-16 sm:py-24 lg:py-32 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#F5F0E6] text-[#173B2A] border-[#DED4BF]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-16">
        
        {/* =========================================================================
            1. SECTION HEADER: Trust + Brand Story Purpose
           ========================================================================= */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b ${
          isDark ? 'border-[#16382A]' : 'border-[#DED4BF]'
        }`}>
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#B58A32]'}`} />
              <span className={`text-[10px] sm:text-[11px] font-sans-clean font-bold tracking-[0.35em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
              }`}>
                PROOF OF QUALITY & CARE
              </span>
            </div>

            <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] ${
              isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
            }`}>
              FROM OUR STORE <br />
              <span className={`italic font-normal ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`}>
                TO YOUR KITCHEN.
              </span>
            </h2>

            <p className={`text-sm sm:text-base font-sans-clean font-medium leading-relaxed ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#35463C]'
            }`}>
              A closer look at the provisions, packaging, and the quality behind every {settings.name} order.
            </p>
          </div>

          {/* Filter Tabs (Touch Targets >= 44px) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'stockfish', 'crayfish'] as const).map((cat) => {
              const label = cat === 'all' 
                ? 'All Provisions' 
                : cat === 'stockfish' 
                  ? 'Stockfish' 
                  : 'Crayfish';
              
              const count = cat === 'all'
                ? displayList.length
                : displayList.filter(i => i.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn-tactile px-5 py-2.5 text-[11px] font-sans-clean tracking-[0.18em] uppercase cursor-pointer rounded-xl whitespace-nowrap flex items-center justify-center gap-2 min-h-[44px] transition-all ${
                    selectedCategory === cat
                      ? isDark 
                        ? 'bg-[#16382A] text-[#EDEDED] font-bold border border-[#B8954A] shadow-sm'
                        : 'bg-[#173B2A] text-white font-bold border border-[#173B2A] shadow-sm'
                      : isDark
                        ? 'bg-[#0D3325] border border-[#16382A] text-[#EDEDED]/70 hover:text-[#EDEDED] hover:border-[#B8954A]/40'
                        : 'bg-[#FFFDF8] border border-[#DED4BF] text-[#35463C] hover:text-[#173B2A] hover:border-[#173B2A]/40 shadow-xs'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[9.5px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat
                      ? isDark ? 'bg-[#071F16] text-[#B8954A]' : 'bg-[#FFFDF8]/20 text-white'
                      : isDark ? 'bg-[#071F16] text-[#EDEDED]/60' : 'bg-[#F5F0E6] text-[#667268]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            2. TRUST PILLARS STRIP: 4 Core Credibility Anchors
           ========================================================================= */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border transition-colors ${
          isDark 
            ? 'bg-[#0D3325]/60 border-[#16382A]' 
            : 'bg-[#FAF7F0] border-[#DED4BF] shadow-[0_2px_12px_rgba(23,59,42,0.04)]'
        }`}>
          <div className="flex items-start gap-3 p-2">
            <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
            <div className="space-y-0.5">
              <h4 className={`text-xs font-sans-clean font-bold uppercase tracking-wider ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}>
                Carefully Sorted
              </h4>
              <p className={`text-[11px] font-sans-clean leading-snug ${
                isDark ? 'text-[#EDEDED]/65' : 'text-[#58685C]'
              }`}>
                Inspected cuts with zero grit and clean drying.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2">
            <Sparkles className={`w-5 h-5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
            <div className="space-y-0.5">
              <h4 className={`text-xs font-sans-clean font-bold uppercase tracking-wider ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}>
                Natural Aroma
              </h4>
              <p className={`text-[11px] font-sans-clean leading-snug ${
                isDark ? 'text-[#EDEDED]/65' : 'text-[#58685C]'
              }`}>
                Sun-dried flavor that deepens every soup base.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2">
            <PackageCheck className={`w-5 h-5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
            <div className="space-y-0.5">
              <h4 className={`text-xs font-sans-clean font-bold uppercase tracking-wider ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}>
                Hygienic Packaging
              </h4>
              <p className={`text-[11px] font-sans-clean leading-snug ${
                isDark ? 'text-[#EDEDED]/65' : 'text-[#58685C]'
              }`}>
                Sealed packs for safe transit and longevity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2">
            <Utensils className={`w-5 h-5 mt-0.5 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
            <div className="space-y-0.5">
              <h4 className={`text-xs font-sans-clean font-bold uppercase tracking-wider ${
                isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
              }`}>
                Kitchen-Ready
              </h4>
              <p className={`text-[11px] font-sans-clean leading-snug ${
                isDark ? 'text-[#EDEDED]/65' : 'text-[#58685C]'
              }`}>
                Portioned for family pots, caterers & events.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. EDITORIAL PROVISIONS GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            let aspectClass = 'aspect-[4/3]';
            if (item.aspect === 'portrait') aspectClass = 'aspect-[3/4] sm:aspect-[4/5]';
            if (item.aspect === 'square') aspectClass = 'aspect-square';

            const itemWhatsAppUrl = buildWhatsAppUrl(
              `Hello ${settings.shortName || 'Favour Business Ventures'}, I am interested in ordering ${item.title}. Please share current availability and pricing.`,
              settings.whatsappNumberRaw
            );

            return (
              <div
                key={item.id}
                id={`gallery-item-${item.id}`}
                className={`group p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl rounded-2xl border ${
                  isDark 
                    ? 'bg-[#0D3325] border-[#16382A] hover:border-[#B8954A]/50' 
                    : 'bg-[#FFFDF8] border-[#DED4BF] hover:border-[#173B2A]/40 shadow-[0_4px_20px_rgba(23,59,42,0.04)]'
                }`}
              >
                {/* Image Frame with controlled aspect ratio */}
                <div 
                  onClick={() => setActiveModalItem(item)}
                  className="relative overflow-hidden rounded-xl cursor-pointer bg-[#071F16]"
                >
                  <ImageWithPlaceholder
                    src={item.imageUrl}
                    alt={item.title}
                    aspectRatioClass={aspectClass}
                    theme={isDark ? 'dark' : 'light'}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  
                  {/* Quality Badge Overlay */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className={`px-2.5 py-1 text-[9px] font-sans-clean font-bold tracking-[0.2em] uppercase rounded-md shadow-md backdrop-blur-md border ${
                        isDark 
                          ? 'bg-[#071F16]/90 text-[#EDEDED] border-[#B8954A]/40' 
                          : 'bg-[#FFFDF8]/95 text-[#173B2A] border-[#DED4BF]'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Touch / Hover Indicator */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className={`px-4 py-2 text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase flex items-center gap-2 shadow-lg rounded-lg ${
                      isDark ? 'bg-[#071F16] text-[#EDEDED]' : 'bg-[#FFFDF8] text-[#173B2A]'
                    }`}>
                      <ZoomIn className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
                      Inspect View
                    </span>
                  </div>
                </div>

                {/* Editorial Caption & Details */}
                <div className="pt-5 pb-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9.5px] font-sans-clean font-bold uppercase tracking-[0.25em] ${
                      isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
                    }`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className={`text-[9.5px] font-sans-clean font-semibold ${
                      isDark ? 'text-[#EDEDED]/50' : 'text-[#667268]'
                    }`}>
                      0{index + 1}
                    </span>
                  </div>

                  <h3 
                    onClick={() => setActiveModalItem(item)}
                    className={`font-editorial text-xl sm:text-2xl font-bold cursor-pointer transition-colors leading-snug ${
                      isDark ? 'text-[#EDEDED] group-hover:text-[#B8954A]' : 'text-[#173B2A] group-hover:text-[#B58A32]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className={`text-xs sm:text-sm font-sans-clean leading-relaxed ${
                    isDark ? 'text-[#EDEDED]/70 font-light' : 'text-[#35463C] font-medium'
                  }`}>
                    {item.description}
                  </p>

                  {/* Kitchen Use Callout */}
                  {item.kitchenUse && (
                    <div className={`pt-2 flex items-center gap-2 text-[11px] font-sans-clean ${
                      isDark ? 'text-[#A3B899]' : 'text-[#2C4A38]'
                    }`}>
                      <Utensils className="w-3 h-3 shrink-0 opacity-80" />
                      <span className="truncate"><strong className="font-semibold">Best For:</strong> {item.kitchenUse}</span>
                    </div>
                  )}

                  {/* Card Action Controls */}
                  <div className={`pt-3 border-t flex items-center justify-between gap-3 ${
                    isDark ? 'border-[#16382A]' : 'border-[#DED4BF]'
                  }`}>
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className={`text-[11px] font-sans-clean font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer py-1.5 ${
                        isDark 
                          ? 'text-[#EDEDED]/70 hover:text-[#B8954A]' 
                          : 'text-[#173B2A] hover:text-[#B58A32]'
                      }`}
                    >
                      Inspect Details →
                    </button>

                    <a
                      href={itemWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-sans-clean font-bold tracking-[0.15em] uppercase rounded-lg transition-colors cursor-pointer shadow-xs ${
                        isDark
                          ? 'bg-[#16382A] hover:bg-[#1f4a38] text-[#EDEDED] border border-[#16382A]'
                          : 'bg-[#F5F0E6] hover:bg-[#EAE2D2] text-[#173B2A] border border-[#DED4BF]'
                      }`}
                    >
                      <MessageCircle className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'}`} />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            4. TRUST TO ORDER CTA: Connect Gallery to Purchasing Journey
           ========================================================================= */}
        <div className={`p-6 sm:p-10 lg:p-12 border flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl transition-colors shadow-lg ${
          isDark 
            ? 'bg-[#0D3325] text-[#EDEDED] border-[#16382A]' 
            : 'bg-[#173B2A] text-white border-[#173B2A]'
        }`}>
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className={`w-5 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#B58A32]'}`} />
              <span className={`text-[9.5px] font-sans-clean font-bold uppercase tracking-[0.35em] block ${
                isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
              }`}>
                READY TO ORDER?
              </span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-4xl font-bold leading-tight">
              Bring Authentic Flavour to Your Kitchen
            </h3>
            <p className="text-xs sm:text-sm font-sans-clean font-normal leading-relaxed opacity-85">
              Explore our full stockfish cuts and clean crayfish packages ready for immediate delivery, or message us directly for custom quantities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleExploreProducts}
              className={`btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-bold tracking-[0.2em] uppercase shadow-md rounded-xl cursor-pointer min-h-[48px] ${
                isDark
                  ? 'bg-[#16382A] hover:bg-[#1e4a37] text-white border border-[#B8954A]/40'
                  : 'bg-white hover:bg-[#F5F0E6] text-[#173B2A]'
              }`}
            >
              <span>Explore Our Provisions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile btn-whatsapp-gold w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-[#071F16] text-xs font-bold tracking-[0.2em] uppercase shadow-md rounded-xl cursor-pointer min-h-[48px]"
            >
              <MessageCircle className="w-4 h-4 text-[#071F16]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Lightbox / Modal View */}
      {activeModalItem && (
        <GalleryModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
};

