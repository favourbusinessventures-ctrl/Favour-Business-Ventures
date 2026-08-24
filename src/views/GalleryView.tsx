import React from 'react';
import { GallerySection } from '../components/GallerySection';
import { ContactSection } from '../components/ContactSection';
import { NavigationTab } from '../types';

interface GalleryViewProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      <GallerySection onNavigate={onNavigate} />
      <ContactSection />
    </div>
  );
};

