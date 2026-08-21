import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import { ProductDetail, ProductOption } from '../types';
import { OptionSelector } from './OptionSelector';
import { QuantitySelector } from './QuantitySelector';
import { OrderSummary } from './OrderSummary';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { getCustomOrderWhatsAppUrl } from '../utils/whatsapp';

interface ProductSelectorProps {
  product: ProductDetail;
  theme?: 'light' | 'dark';
  indexNumber: string;
  imageAspect?: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  product,
  theme = 'light',
  indexNumber,
}) => {
  const { settings } = useBusinessSettings();
  const [selectedOption, setSelectedOption] = useState<ProductOption>(
    product.options[0] || { name: 'Standard Format', description: '' }
  );
  const [quantity, setQuantity] = useState<number>(1);

  const isDark = theme === 'dark';

  // Build WhatsApp URL with the exact details and live number
  const whatsappUrl = getCustomOrderWhatsAppUrl({
    productName: product.name,
    sizeOrPackage: selectedOption.name,
    quantity: quantity,
  }, settings.whatsappNumberRaw);

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
        isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
      }`}
    >
      {/* Visual Photography Hero Frame */}
      <div className={`lg:col-span-6 space-y-4 ${isDark ? 'order-1 lg:order-2' : ''}`}>
        <div
          className={`p-3 sm:p-4 border shadow-xl relative group rounded-[2px] ${
            isDark
              ? 'bg-[#071F16] border-[#16382A]'
              : 'bg-[#FFF9EF] border-[#E5DEC9]'
          }`}
        >
          <div className="overflow-hidden bg-[#071F16] relative rounded-[1px]">
            <ImageWithPlaceholder
              src={product.imageUrl}
              alt={`${product.name} - ${selectedOption.name}`}
              aspectRatioClass="aspect-[16/11] sm:aspect-[4/3]"
              theme={theme}
              className="w-full h-full object-cover object-center img-editorial-zoom"
            />

            {/* Corner Badge */}
            <div className="absolute top-4 left-4 bg-[#071F16]/95 backdrop-blur-xs text-[#F5F0E6] px-3.5 py-1.5 text-[9px] sm:text-[9.5px] font-sans-clean font-semibold tracking-[0.25em] uppercase border border-[#B8954A]/40 rounded-[1px] pointer-events-none">
              {indexNumber} / {product.category.toUpperCase()}
            </div>
          </div>

          {/* Minimal Editorial Subtext */}
          <div className="pt-3 px-1 flex items-center justify-between text-xs">
            <span
              className={`font-editorial italic text-sm sm:text-base ${
                isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
              }`}
            >
              {product.subtitle}
            </span>
            <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.22em] text-[#B8954A]">
              Selected Format: {selectedOption.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details, Selection Controls & WhatsApp Order Action */}
      <div
        className={`lg:col-span-6 space-y-6 sm:space-y-7 ${
          isDark ? 'order-2 lg:order-1' : ''
        }`}
      >
        {/* Product Heading & Subtitle */}
        <div
          className={`space-y-2 border-b pb-5 sm:pb-6 ${
            isDark ? 'border-[#16382A]' : 'border-[#E5DEC9]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
              {indexNumber} / {product.category.toUpperCase()}
            </span>
          </div>

          <h3
            className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${
              isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
            }`}
          >
            {product.name}
          </h3>

          <p
            className={`font-editorial italic text-base sm:text-xl pt-0.5 ${
              isDark ? 'text-[#F5F0E6]/80' : 'text-[#6B7266]'
            }`}
          >
            {product.subtitle}
          </p>
        </div>

        {/* Short Natural Description */}
        <p
          className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
            isDark ? 'text-[#F5F0E6]/85' : 'text-[#111511]'
          }`}
        >
          {product.description}
        </p>

        {/* Step 1: Format Option Selector */}
        <OptionSelector
          options={product.options}
          selectedOption={selectedOption}
          onSelectOption={(option) => setSelectedOption(option)}
          theme={theme}
        />

        {/* Step 2: Quantity Selector */}
        <div className="space-y-2 pt-1">
          <span
            className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] block ${
              isDark ? 'text-[#B8954A]' : 'text-[#B8954A]'
            }`}
          >
            Select Quantity
          </span>
          <QuantitySelector
            quantity={quantity}
            onChange={(q) => setQuantity(q)}
            theme={theme}
          />
        </div>

        {/* Step 3: Minimal Selection Summary */}
        <OrderSummary
          product={product}
          selectedOption={selectedOption}
          quantity={quantity}
          theme={theme}
        />

        {/* Step 4: WhatsApp CTA Button */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 text-xs font-bold tracking-[0.2em] uppercase shadow-lg group rounded-xl ${
              isDark
                ? 'btn-whatsapp-gold text-[#071F16]'
                : 'bg-[#071F16] hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/40'
            }`}
          >
            <MessageCircle
              className={`w-4 h-4 ${isDark ? 'text-[#071F16]' : 'text-[#B8954A]'}`}
            />
            <span>Order on WhatsApp</span>
            <ArrowUpRight
              className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 ${
                isDark ? 'text-[#071F16]' : 'text-[#F5F0E6]/80'
              }`}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
