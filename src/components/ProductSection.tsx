import React from 'react';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { PRODUCTS_DATA } from '../data/products';
import { ProductSelector } from './ProductSelector';

export const ProductSection: React.FC = () => {
  const { products } = useLiveProducts();
  
  const stockfish = products.find((p) => p.category === 'Stockfish') || PRODUCTS_DATA[0];
  const crayfish = products.find((p) => p.category === 'Crayfish') || PRODUCTS_DATA[1];

  return (
    <section id="products-section" className="border-b border-[#16382A]">
      
      {/* =========================================================================
          SECTION INTRO: Deep Luxury Green & Warm Ivory Editorial Intro
         ========================================================================= */}
      <div className="py-14 sm:py-20 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            
            {/* Small Eyebrow Marker */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] sm:text-[10.5px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
                01 / OUR PRODUCTS
              </span>
            </div>

            {/* Section Main Title */}
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#071F16] leading-[1.04]">
              STOCKFISH & CRAYFISH
            </h2>

            {/* Supporting Copy */}
            <p className="font-editorial italic text-lg sm:text-2xl text-[#6B7266] leading-relaxed pt-1">
              "Carefully presented for the meals you already have in mind."
            </p>

          </div>
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 01 / STOCKFISH — Light Ivory Editorial Canvas (#F5F0E6)
         ========================================================================= */}
      <div id="product-stockfish" className="py-16 sm:py-24 lg:py-32 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
          <ProductSelector
            product={stockfish}
            theme="light"
            indexNumber="01"
          />
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 02 / CRAYFISH — Deep Luxury Forest Green Canvas (#071F16)
         ========================================================================= */}
      <div id="product-crayfish" className="py-16 sm:py-24 lg:py-32 bg-[#071F16] text-[#F5F0E6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
          <div className="p-5 sm:p-8 lg:p-14 bg-[#0D3325] border border-[#16382A] rounded-[2px] shadow-2xl">
            <ProductSelector
              product={crayfish}
              theme="dark"
              indexNumber="02"
            />
          </div>
        </div>
      </div>

    </section>
  );
};
