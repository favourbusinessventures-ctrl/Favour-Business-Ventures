import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  theme?: 'light' | 'dark';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  theme = 'light',
}) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`inline-flex items-center border rounded-[2px] p-1 transition-colors ${
          isDark
            ? 'bg-[#071F16] border-[#16382A]'
            : 'bg-[#FFF9EF] border-[#E5DEC9]'
        }`}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
          className={`w-11 h-11 flex items-center justify-center rounded-[2px] transition-all cursor-pointer select-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
            isDark
              ? 'text-[#F5F0E6] hover:bg-[#0D3325] hover:text-[#B8954A]'
              : 'text-[#071F16] hover:bg-[#F5F0E6] hover:text-[#B8954A]'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span
          className={`w-12 text-center text-sm font-sans-clean font-semibold select-none ${
            isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
          }`}
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className={`w-11 h-11 flex items-center justify-center rounded-[2px] transition-all cursor-pointer select-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
            isDark
              ? 'text-[#F5F0E6] hover:bg-[#0D3325] hover:text-[#B8954A]'
              : 'text-[#071F16] hover:bg-[#F5F0E6] hover:text-[#B8954A]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <span
        className={`text-[11px] font-sans-clean uppercase tracking-[0.2em] select-none ${
          isDark ? 'text-[#F5F0E6]/60' : 'text-[#6B7266]'
        }`}
      >
        Portion / Pack
      </span>
    </div>
  );
};
