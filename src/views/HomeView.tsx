import React from 'react';
import { Hero } from '../components/Hero';
import { EditorialStatement } from '../components/EditorialStatement';
import { ProductSection } from '../components/ProductSection';
import { BrandMoment } from '../components/BrandMoment';
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
    <div className="animate-fade-up">
      {/* 1. INTRODUCTION: Signature Magazine Cover Hero */}
      <Hero onNavigate={onNavigate} />

      {/* 2. EDITORIAL STATEMENT: The Ingredients Behind The Meals That Matter */}
      <EditorialStatement
        tag="Standard of Quality"
        headline="THE INGREDIENTS BEHIND THE MEALS THAT MATTER."
        paragraph="Good meals begin with ingredients you can trust. We focus exclusively on stockfish and sun-dried crayfish—cleanly handled, carefully prepared, and ready for the everyday recipes and celebration meals you have in mind."
        theme="ivory"
      />

      {/* 3. THE PRODUCTS: Two Distinct Major Editorial Experiences */}
      <ProductSection />

      {/* 4. THE SIGNATURE BRAND MOMENT: Full-width Deep Forest Campaign */}
      <BrandMoment />

      {/* 5. THE BRAND STORY: Authentic Nigerian Character & Direct Care */}
      <AboutSection />

      {/* 6. THE VISUAL EXPERIENCE: Curated Food Campaign Gallery */}
      <GallerySection />

      {/* 7. THE QUALITY: What Matters To Us (3 Horizontal Principles) */}
      <TrustSection />

      {/* 8. THE ORDER: Ready to Order? WhatsApp Ordering */}
      <ContactSection />
    </div>
  );
};
