import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B8954A]/50 min-h-[44px] min-w-[44px] justify-center ${
        isDark
          ? 'bg-[#0D3325] border-[#16382A] text-[#B8954A] hover:bg-[#164936] hover:text-[#EDEDED]'
          : 'bg-white border-[#E5E7EB] text-[#1E5631] hover:bg-[#F5F5F0] hover:text-[#111814] shadow-xs'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#B8954A] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#1E5631] transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-[11px] font-sans-clean font-semibold tracking-wider uppercase">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
