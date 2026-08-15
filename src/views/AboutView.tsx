import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { TrustSection } from '../components/TrustSection';
import { ContactSection } from '../components/ContactSection';

export const AboutView: React.FC = () => {
  return (
    <div className="animate-fade-in pt-6">
      <AboutSection />
      <TrustSection />
      <ContactSection />
    </div>
  );
};
