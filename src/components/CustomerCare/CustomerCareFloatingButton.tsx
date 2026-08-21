import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useCustomerCare } from '../../context/CustomerCareContext';
import { useTheme } from '../../context/ThemeContext';

export const CustomerCareFloatingButton: React.FC = () => {
  const { isOpen, toggleAssistant } = useCustomerCare();
  const { isDark } = useTheme();

  return (
    <div className="fixed bottom-22 sm:bottom-6 right-4 sm:right-48 z-40">
      <button
        onClick={toggleAssistant}
        aria-label={isOpen ? "Close Customer Care" : "Open Customer Care Assistant"}
        className={`btn-tactile flex items-center gap-2.5 px-4 py-2.5 sm:py-3 rounded-full font-sans-clean font-bold text-xs tracking-[0.16em] uppercase shadow-2xl transition-all duration-300 cursor-pointer ${
          isOpen
            ? isDark
              ? 'bg-[#16382A] text-[#F5F0E6] border border-[#B8954A]'
              : 'bg-[#1E5631] text-white border border-[#1E5631]'
            : isDark
              ? 'bg-[#0D3325] hover:bg-[#124231] text-[#F5F0E6] border border-[#B8954A]/50 hover:border-[#B8954A]'
              : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white border border-[#1E5631]/50 hover:border-[#1E5631]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-white'}`} />
          ) : (
            <MessageSquare className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-white'}`} />
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
        <span className="hidden sm:inline">
          {isOpen ? 'Close Care' : 'Customer Care'}
        </span>
        <span className="sm:hidden">
          {isOpen ? 'Close' : 'Help'}
        </span>
      </button>
    </div>
  );
};
