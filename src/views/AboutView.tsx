import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { BrandMoment } from '../components/BrandMoment';
import { TrustSection } from '../components/TrustSection';

export const AboutView: React.FC = () => {
  return (
    <div className="w-full">
      <AboutSection />
      <BrandMoment />
      <TrustSection />
    </div>
  );
};
