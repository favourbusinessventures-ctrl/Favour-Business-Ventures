import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductDetail, ProductOption } from '../types';

interface OrderSummaryProps {
  product: ProductDetail;
  selectedOption: ProductOption;
  quantity: number;
  theme?: 'light' | 'dark';
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  selectedOption,
  quantity,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-[2px] border transition-colors ${
        isDark
          ? 'bg-[#071F16]/80 border-[#16382A]'
          : 'bg-[#FFF9EF] border-[#E5DEC9]'
      }`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit">
        <span
          className={`text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] ${
            isDark ? 'text-[#B8954A]' : 'text-[#B8954A]'
          }`}
        >
          Your Selection
        </span>
        <span
          className={`text-[10px] font-sans-clean uppercase tracking-[0.2em] ${
            isDark ? 'text-[#F5F0E6]/50' : 'text-[#6B7266]'
          }`}
        >
          Direct Order Summary
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${product.id}-${selectedOption.name}-${quantity}`}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`font-editorial text-base sm:text-lg font-bold ${
                  isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
                }`}
              >
                {product.name}
              </span>
              <span
                className={`text-xs font-sans-clean ${
                  isDark ? 'text-[#B8954A]' : 'text-[#B8954A]'
                }`}
              >
                • {selectedOption.name}
              </span>
            </div>
            <p
              className={`text-xs font-sans-clean font-light line-clamp-1 ${
                isDark ? 'text-[#F5F0E6]/70' : 'text-[#6B7266]'
              }`}
            >
              {selectedOption.description}
            </p>
          </div>

          <div className="shrink-0 pt-1 sm:pt-0">
            <span
              className={`text-xs font-sans-clean font-semibold px-2.5 py-1 rounded-[2px] border inline-block ${
                isDark
                  ? 'bg-[#0D3325] border-[#16382A] text-[#F5F0E6]'
                  : 'bg-[#F5F0E6] border-[#E5DEC9] text-[#071F16]'
              }`}
            >
              Qty: {quantity} {quantity === 1 ? 'Pack' : 'Packs'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
