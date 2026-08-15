import React from 'react';
import { ProductSection } from '../components/ProductSection';
import { TrustSection } from '../components/TrustSection';
import { ContactSection } from '../components/ContactSection';

export const ProductsView: React.FC = () => {
  return (
    <div className="animate-fade-in pt-6">
      <ProductSection />
      <TrustSection />
      <ContactSection />
    </div>
  );
};
