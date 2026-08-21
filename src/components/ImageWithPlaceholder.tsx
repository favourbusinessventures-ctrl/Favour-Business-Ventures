import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithPlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatioClass?: string;
  theme?: 'light' | 'dark';
  containerClassName?: string;
  priority?: boolean;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  aspectRatioClass = 'aspect-[4/3]',
  theme = 'light',
  containerClassName = '',
  priority = false,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative overflow-hidden ${aspectRatioClass} ${
        isDark ? 'bg-[#0D3325]' : 'bg-[#EFE9DC]'
      } ${containerClassName}`}
    >
      {/* Subtle Warm Placeholder Shimmer */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isDark ? 'bg-[#0D3325]' : 'bg-[#EFE9DC]'
          }`}
        />
      )}

      {/* Actual Image */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      ) : (
        /* Graceful Editorial Fallback */
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
            isDark
              ? 'bg-[#071F16] text-[#F5F0E6]/70 border border-[#16382A]'
              : 'bg-[#FFF9EF] text-[#6B7266] border border-[#E5DEC9]'
          }`}
        >
          <ImageOff className="w-8 h-8 mb-2 opacity-50 text-[#B8954A]" />
          <span className="font-editorial text-sm font-semibold tracking-wide">
            {alt || 'Favour Business Ventures'}
          </span>
          <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] mt-1 opacity-70">
            Quality Product Presentation
          </span>
        </div>
      )}
    </div>
  );
};
