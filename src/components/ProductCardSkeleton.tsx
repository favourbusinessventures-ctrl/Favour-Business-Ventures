import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FFF9EF] border border-[#E5DEC9] rounded-xl overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-4/3 bg-[#EFE9DC] animate-pulse" />
      {/* Content skeleton */}
      <div className="p-5 sm:p-6 space-y-3">
        <div className="h-3 w-20 bg-[#E5DEC9] rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-[#E5DEC9] rounded animate-pulse" />
        <div className="h-3 w-full bg-[#E5DEC9]/60 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-[#E5DEC9]/60 rounded animate-pulse" />
        <div className="pt-3 mt-2 border-t border-[#E5DEC9] space-y-2">
          <div className="h-9 w-full bg-[#E5DEC9] rounded-lg animate-pulse" />
          <div className="h-9 w-28 bg-[#E5DEC9]/60 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};
