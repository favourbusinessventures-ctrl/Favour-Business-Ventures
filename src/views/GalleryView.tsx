import React from 'react';
import { GallerySection } from '../components/GallerySection';
import { ContactSection } from '../components/ContactSection';

export const GalleryView: React.FC = () => {
  return (
    <div className="animate-fade-in pt-6">
      <GallerySection />
      <ContactSection />
    </div>
  );
};
