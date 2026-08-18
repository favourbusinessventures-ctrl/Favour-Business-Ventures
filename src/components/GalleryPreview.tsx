import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, ArrowRight } from 'lucide-react';
import { useLiveGallery } from '../hooks/useLiveGallery';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem, NavigationTab } from '../types';
import { GalleryModal } from './GalleryModal';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';

interface GalleryPreviewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ onNavigate }) => {
  const { galleryItems } = useLiveGallery();
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const displayList = galleryItems && galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;
  // Take up to 4 preview items for the homepage
  const previewItems = displayList.slice(0, 4);

  return (
    <section id="gallery-preview-section" className="py-20 sm:py-28 bg-[#071F16] text-[#F5F0E6] relative border-b border-[#16382A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#16382A]/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
                PROVISION SHOWCASE
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F0E6] leading-[1.02]">
              CULINARY GALLERY
            </h2>

            <p className="text-sm sm:text-base text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
              Explore authentic cuts of stockfish, whole golden sun-dried crayfish, and freshly milled crayfish powder.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className="btn-tactile inline-flex items-center gap-2 px-6 py-3 bg-[#0D3325] hover:bg-[#164936] text-[#F5F0E6] border border-[#16382A] hover:border-[#B8954A]/50 text-xs font-semibold tracking-[0.18em] uppercase rounded-lg cursor-pointer shrink-0 self-start md:self-auto"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B8954A]" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewItems.map((item, idx) => (
            <motion.div
              key={item.id}
              id={`gallery-preview-card-${item.id}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => setActiveModalItem(item)}
              className="bg-[#0D3325]/70 backdrop-blur-sm border border-[#16382A] hover:border-[#B8954A]/50 p-3.5 rounded-xl shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative overflow-hidden rounded-lg bg-[#071F16] aspect-4/3">
                <ImageWithPlaceholder
                  src={item.imageUrl}
                  alt={item.title}
                  aspectRatioClass="aspect-4/3"
                  theme="dark"
                  className="w-full h-full object-cover img-editorial-zoom group-hover:scale-105 transition-transform duration-500"
                />

                {/* Translucent Zoom Overlay */}
                <div className="absolute inset-0 bg-[#071F16]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 bg-[#071F16]/90 backdrop-blur-xs text-[#F5F0E6] text-[10px] font-sans-clean font-semibold tracking-[0.2em] uppercase rounded-md border border-[#B8954A]/40 flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-[#B8954A]" />
                    Expand
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="pt-4 pb-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-sans-clean text-[#F5F0E6]/50">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors leading-snug line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-[#F5F0E6]/65 font-sans-clean font-light line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Interactive Lightbox Modal */}
      {activeModalItem && (
        <GalleryModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </section>
  );
};
