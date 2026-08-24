import React from 'react';
import { FavoraBrandIntro } from './FavoraBrandIntro';

interface BrandedLoaderProps {
  isLoading?: boolean;
  onFinish?: () => void;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ onFinish }) => {
  return <FavoraBrandIntro onFinish={onFinish} />;
};
