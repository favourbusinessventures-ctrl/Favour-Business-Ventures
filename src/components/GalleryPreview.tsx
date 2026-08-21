import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, ArrowRight } from 'lucide-react';
import { useLiveGallery } from '../hooks/useLiveGallery';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem, NavigationTab } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GalleryModal } from './GalleryModal';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

interface GalleryPreviewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ onNavigate }) => {
  const { galleryItems } = useLiveGallery();
  const { isDark } = useTheme();
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const displayList = galleryItems && galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;
  const previewItems = displayList.slice(0, 4);

  return (
    <section
      id="gallery-preview-section"
      className={`py-20 sm:py-28 relative border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]'
          : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 space-y-12 sm:space-y-16">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b ${
            isDark ? 'border-[#16382A]/80' : 'border-[#E5E7EB]'
          }`}
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
              <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                PROVISION SHOWCASE
              </span>
            </div>

            <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] ${
              isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
            }`}>
              CULINARY GALLERY
            </h2>

            <p className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
              Explore authentic cuts of stockfish, whole golden sun-dried crayfish, and freshly milled crayfish powder.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className={`btn-tactile inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase rounded-xl cursor-pointer shrink-0 self-start md:self-auto border shadow-sm ${
              isDark
                ? 'bg-[#0D3325] hover:bg-[#164936] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                : 'bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border-[#E5E7EB] hover:border-[#1E5631]/40'
            }`}
          >
            <span>View Full Gallery</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
          </button>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewItems.map((item, idx) => (
            <motion.div
              key={item.id}
              id={`gallery-preview-card-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveModalItem(item)}
              className={`card-glass-hover p-3.5 rounded-2xl group cursor-pointer flex flex-col justify-between border transition-all duration-300 ${
                isDark
                  ? 'bg-[#0D3325]/75 backdrop-blur-md border-[#16382A] hover:border-[#B8954A]/50 shadow-xl'
                  : 'bg-white border-[#E5E7EB] hover:border-[#1E5631]/40 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Image Frame */}
              <div className={`relative overflow-hidden rounded-xl aspect-[4/3] ${
                isDark ? 'bg-[#071F16]' : 'bg-[#F5F5F0]'
              }`}>
                <ImageWithPlaceholder
                  src={item.imageUrl}
                  alt={item.title}
                  aspectRatioClass="aspect-[4/3]"
                  theme={isDark ? 'dark' : 'light'}
                  className="w-full h-full object-cover img-editorial-zoom group-hover:scale-105 transition-transform duration-700"
                />

                {/* Zoom Overlay */}
                <div className="absolute inset-0 bg-[#071F16]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 bg-[#071F16]/90 backdrop-blur-sm text-[#F5F0E6] text-[10px] font-sans-clean font-semibold tracking-[0.2em] uppercase rounded-lg border border-[#B8954A]/40 flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-[#B8954A]" />
                    Expand
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="pt-4 pb-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] ${
                    isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                  }`}>
                    {item.category}
                  </span>
                  <span className={`text-[9px] font-sans-clean ${
                    isDark ? 'text-[#EDEDED]/50' : 'text-[#6B7266]'
                  }`}>
                    0{idx + 1}
                  </span>
                </div>

                <h3 className={`font-editorial text-lg sm:text-xl font-bold transition-colors leading-snug line-clamp-1 ${
                  isDark
                    ? 'text-[#EDEDED] group-hover:text-[#B8954A]'
                    : 'text-[#1A1A1A] group-hover:text-[#1E5631]'
                }`}>
                  {item.title}
                </h3>

                <p className={`text-xs font-sans-clean font-light line-clamp-2 leading-relaxed ${
                  isDark ? 'text-[#EDEDED]/65' : 'text-[#525252]'
                }`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <GalleryModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </section>
  );
};
