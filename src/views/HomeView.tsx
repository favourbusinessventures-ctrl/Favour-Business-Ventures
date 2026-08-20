import React from 'react';
import { Hero } from '../components/Hero';
import { TrustValueStrip } from '../components/TrustValueStrip';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { GalleryPreview } from '../components/GalleryPreview';
import { CustomerReviews } from '../components/CustomerReviews';
import { WhatsAppCTASection } from '../components/WhatsAppCTASection';
import { NavigationTab } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div id="homepage-container" className="animate-fade-up">
      
      {/* 1. HERO SECTION: Concise, High-Impact Visuals & Immediate CTAs */}
      <Hero onNavigate={onNavigate} />

      {/* 2. TRUST / VALUE STRIP: 4 Core Pillars with Subtle Glass Treatment */}
      <TrustValueStrip />

      {/* 3. FEATURED PRODUCTS: Direct Firestore Data with Translucent Glass Cards */}
      <FeaturedProducts onNavigate={onNavigate} />

      {/* 4. WHY CHOOSE US: 4 Concise Pillars Explaining The FBV Quality Difference */}
      <WhyChooseUs />

      {/* 5. CULINARY GALLERY PREVIEW: Real Firestore Gallery Data with Modal Zooming */}
      <GalleryPreview onNavigate={onNavigate} />

      {/* 6. CUSTOMER REVIEWS & RATINGS: Verified Customer Feedback & Write-a-Review System */}
      <CustomerReviews className="py-20 sm:py-28 bg-[#071F16] border-b border-[#16382A]" />

      {/* 7. WHATSAPP & DIRECT ORDER CTA: Immediate Ordering with Pre-Formatted Inquiries */}
      <WhatsAppCTASection />

    </div>
  );
};

