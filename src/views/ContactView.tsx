import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { TrustSection } from '../components/TrustSection';

export const ContactView: React.FC = () => {
  return (
    <div className="w-full">
      <ContactSection />
      <TrustSection />
    </div>
  );
};
