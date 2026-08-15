import React from 'react';
import { GallerySection } from '../components/GallerySection';
import { ContactSection } from '../components/ContactSection';

export const GalleryView: React.FC = () => {
  return (
    <div className="w-full">
      <GallerySection />
      <ContactSection />
    </div>
  );
};
