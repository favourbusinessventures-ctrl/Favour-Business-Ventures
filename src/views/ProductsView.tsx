import React from 'react';
import { ProductSection } from '../components/ProductSection';
import { CustomerReviews } from '../components/CustomerReviews';
import { TrustSection } from '../components/TrustSection';
import { ContactSection } from '../components/ContactSection';

export const ProductsView: React.FC = () => {
  return (
    <div className="w-full">
      <ProductSection />
      <CustomerReviews className="py-20 sm:py-28 bg-[#071F16] border-b border-[#16382A]" />
      <TrustSection />
      <ContactSection />
    </div>
  );
};

