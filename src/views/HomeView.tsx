import React from 'react';
import { Hero } from '../components/Hero';
import { ProductSection } from '../components/ProductSection';
import { AboutSection } from '../components/AboutSection';
import { TrustSection } from '../components/TrustSection';
import { GallerySection } from '../components/GallerySection';
import { ContactSection } from '../components/ContactSection';
import { NavigationTab } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      <Hero onNavigate={onNavigate} />
      <TrustSection />
      <ProductSection />
      <AboutSection />
      <GallerySection />
      <ContactSection />
    </div>
  );
};
