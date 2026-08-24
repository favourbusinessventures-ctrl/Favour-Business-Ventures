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
          : 'bg-[#F5F0E6] text-[#173B2A] border-[#DED4BF]'
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
            isDark ? 'border-[#16382A]/80' : 'border-[#DED4BF]'
          }`}
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#B58A32]'}`} />
              <span className={`text-[10px] sm:text-[11px] font-sans-clean font-bold tracking-[0.32em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
              }`}>
                PROOF OF QUALITY & CARE
              </span>
            </div>

            <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] ${
              isDark ? 'text-[#EDEDED]' : 'text-[#173B2A]'
            }`}>
              FROM STORE TO KITCHEN
            </h2>

            <p className={`text-sm sm:text-base font-sans-clean font-medium leading-relaxed ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#35463C]'
            }`}>
              See how our stockfish and sun-dried crayfish are selected, sorted, and packaged with dependable cleanliness.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className={`btn-tactile inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase rounded-xl cursor-pointer shrink-0 self-start md:self-auto border shadow-sm min-h-[46px] ${
              isDark
                ? 'bg-[#0D3325] hover:bg-[#164936] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                : 'bg-[#FFFDF8] hover:bg-[#FAF7F0] text-[#173B2A] border-[#DED4BF] hover:border-[#173B2A]/40'
            }`}
          >
            <span>View Full Story & Gallery</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#B8954A]' : 'text-[#173B2A]'}`} />
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
                  : 'bg-[#FFFDF8] border-[#DED4BF] hover:border-[#173B2A]/40 shadow-[0_4px_16px_rgba(23,59,42,0.04)] hover:shadow-lg'
              }`}
            >
              {/* Image Frame */}
              <div className={`relative overflow-hidden rounded-xl aspect-[4/3] ${
                isDark ? 'bg-[#071F16]' : 'bg-[#F5F0E6]'
              }`}>
                <ImageWithPlaceholder
                  src={item.imageUrl}
                  alt={item.title}
                  aspectRatioClass="aspect-[4/3]"
                  theme={isDark ? 'dark' : 'light'}
                  className="w-full h-full object-cover img-editorial-zoom group-hover:scale-105 transition-transform duration-700"
                />

                {/* Quality Badge if present */}
                {item.badge && (
                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className={`px-2 py-0.5 text-[8.5px] font-sans-clean font-bold tracking-[0.2em] uppercase rounded shadow-sm backdrop-blur-sm border ${
                      isDark 
                        ? 'bg-[#071F16]/90 text-[#EDEDED] border-[#B8954A]/40' 
                        : 'bg-[#FFFDF8]/95 text-[#173B2A] border-[#DED4BF]'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Zoom Overlay */}
                <div className="absolute inset-0 bg-[#071F16]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 bg-[#071F16]/90 backdrop-blur-sm text-[#F5F0E6] text-[10px] font-sans-clean font-bold tracking-[0.2em] uppercase rounded-lg border border-[#B8954A]/40 flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-[#B8954A]" />
                    Inspect
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="pt-4 pb-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9.5px] font-sans-clean font-bold uppercase tracking-[0.25em] ${
                    isDark ? 'text-[#B8954A]' : 'text-[#B58A32]'
                  }`}>
                    {item.category.toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-sans-clean font-semibold ${
                    isDark ? 'text-[#EDEDED]/50' : 'text-[#667268]'
                  }`}>
                    0{idx + 1}
                  </span>
                </div>

                <h3 className={`font-editorial text-lg sm:text-xl font-bold transition-colors leading-snug line-clamp-1 ${
                  isDark
                    ? 'text-[#EDEDED] group-hover:text-[#B8954A]'
                    : 'text-[#173B2A] group-hover:text-[#B58A32]'
                }`}>
                  {item.title}
                </h3>

                <p className={`text-xs font-sans-clean leading-relaxed line-clamp-2 ${
                  isDark ? 'text-[#EDEDED]/65 font-light' : 'text-[#35463C] font-medium'
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
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
};

