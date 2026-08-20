import React from 'react';
import { motion } from 'motion/react';
import { ProductOption } from '../types';

interface OptionSelectorProps {
  options: ProductOption[];
  selectedOption: ProductOption;
  onSelectOption: (option: ProductOption) => void;
  theme?: 'light' | 'dark';
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedOption,
  onSelectOption,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] ${
            isDark ? 'text-[#B8954A]' : 'text-[#B8954A]'
          }`}
        >
          Choose Your Format
        </span>
        <span
          className={`text-[10px] font-sans-clean uppercase tracking-[0.2em] ${
            isDark ? 'text-[#F5F0E6]/50' : 'text-[#6B7266]'
          }`}
        >
          {options.length} Formats Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {options.map((option) => {
          const isSelected = selectedOption.name === option.name;

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => onSelectOption(option)}
              className={`relative text-left p-3 sm:p-3.5 rounded-[2px] transition-all duration-200 cursor-pointer min-h-[48px] flex flex-col justify-between active:scale-[0.98] ${
                isSelected
                  ? isDark
                    ? 'bg-[#071F16] text-[#F5F0E6] border border-[#B8954A] shadow-[0_0_15px_rgba(184,149,74,0.15)]'
                    : 'bg-[#071F16] text-[#F5F0E6] border border-[#071F16] shadow-md'
                  : isDark
                  ? 'bg-[#071F16]/50 text-[#F5F0E6]/80 border border-[#16382A] hover:border-[#B8954A]/50 hover:bg-[#071F16]'
                  : 'bg-[#FFF9EF] text-[#071F16] border border-[#E5DEC9] hover:border-[#071F16]/40 hover:bg-[#F5F0E6]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="font-editorial text-sm sm:text-base font-bold tracking-wide leading-snug">
                  {option.name}
                </span>

                {/* Subtle indicator bullet */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#B8954A]'
                      : isDark
                      ? 'bg-[#16382A]'
                      : 'bg-[#E5DEC9]'
                  }`}
                />
              </div>

              <p
                className={`text-[11px] font-sans-clean font-light leading-relaxed mt-1 line-clamp-2 ${
                  isSelected
                    ? isDark
                      ? 'text-[#F5F0E6]/80'
                      : 'text-[#F5F0E6]/80'
                    : isDark
                    ? 'text-[#F5F0E6]/60'
                    : 'text-[#6B7266]'
                }`}
              >
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
