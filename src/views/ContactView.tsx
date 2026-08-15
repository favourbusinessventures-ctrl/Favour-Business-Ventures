import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { TrustSection } from '../components/TrustSection';

export const ContactView: React.FC = () => {
  return (
    <div className="animate-fade-in pt-6">
      <ContactSection />
      <TrustSection />
    </div>
  );
};
