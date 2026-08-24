import React, { useState, useEffect } from 'react';
import { validateHexColor } from '../../../config/branding';

interface ColorPickerFieldProps {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (hex: string) => void;
  defaultColor?: string;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  id,
  label,
  description,
  value,
  onChange,
  defaultColor = '#071F16'
}) => {
  const [localHex, setLocalHex] = useState<string>(value || defaultColor);
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    setLocalHex(value || defaultColor);
  }, [value, defaultColor]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.trim();
    if (!input.startsWith('#') && input.length > 0) {
      input = `#${input}`;
    }
    setLocalHex(input);

    const valid = /^#([A-Fa-f0-9]{3}){1,2}$/.test(input);
    setIsValid(valid);
    if (valid) {
      onChange(input.toUpperCase());
    }
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setLocalHex(hex);
    setIsValid(true);
    onChange(hex);
  };

  return (
    <div className="bg-[#071F16]/60 border border-[#16382A] p-3.5 rounded-[2px] flex flex-col justify-between space-y-2.5">
      <div className="space-y-1">
        <label htmlFor={id} className="text-xs font-sans-clean font-semibold text-[#F5F0E6] flex items-center justify-between">
          <span>{label}</span>
          <span 
            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" 
            style={{ backgroundColor: validateHexColor(localHex, defaultColor) }}
            title={`Preview of ${label}`}
          />
        </label>
        <p className="text-[10px] text-[#A3B899] font-sans-clean leading-snug">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {/* Native Color Circle / Button */}
        <div className="relative w-9 h-9 shrink-0 rounded-[2px] border border-[#16382A] overflow-hidden cursor-pointer shadow-inner">
          <input
            id={`${id}-native`}
            type="color"
            value={validateHexColor(localHex, defaultColor)}
            onChange={handleNativePickerChange}
            className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer opacity-0"
            title="Open color palette"
          />
          <div 
            className="w-full h-full"
            style={{ backgroundColor: validateHexColor(localHex, defaultColor) }}
          />
        </div>

        {/* HEX Input Box */}
        <div className="relative flex-1">
          <input
            id={id}
            type="text"
            value={localHex}
            onChange={handleHexInputChange}
            maxLength={7}
            placeholder="#000000"
            className={`
              w-full px-2.5 py-1.5 bg-[#051710] text-[#F5F0E6] font-mono text-xs rounded-[2px] border transition-colors uppercase
              ${isValid ? 'border-[#16382A] focus:border-[#B8954A]' : 'border-red-500 focus:border-red-400 text-red-200'}
              focus:outline-none
            `}
          />
        </div>
      </div>
    </div>
  );
};
