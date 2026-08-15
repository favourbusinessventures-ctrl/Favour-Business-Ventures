import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../types';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onNavigateToAdmin }) => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <footer className="bg-[#071F16] text-[#F5F0E6] border-t border-[#16382A]">
      
      {/* Upper Footer Action Banner */}
      <div className="border-b border-[#16382A] py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2.5 max-w-xl">
            <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.35em] text-[#B8954A] block">
              Stockfish & Crayfish Provisions
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F0E6]">
              {BUSINESS_CONFIG.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
              {BUSINESS_CONFIG.description}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile inline-flex items-center gap-3 px-8 py-3.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase shadow-md group shrink-0 rounded-[2px]"
          >
            <MessageCircle className="w-4 h-4 text-[#071F16]" />
            <span>Order on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-14 sm:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3.5">
            <span className="font-editorial text-2xl font-bold tracking-[0.1em] text-[#F5F0E6] uppercase">
              {BUSINESS_CONFIG.name}
            </span>
            <p className="text-xs text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed max-w-sm">
              Stockfish and crayfish provided with dependable quality for homes, food vendors, and caterers.
            </p>
            <div className="pt-1 text-xs text-[#B8954A] font-sans-clean font-medium">
              WhatsApp: {BUSINESS_CONFIG.whatsappNumberDisplay}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs font-sans-clean text-[#F5F0E6]/75">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer py-1 block text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer py-1 block text-left"
                >
                  Stockfish & Crayfish Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer py-1 block text-left"
                >
                  About The Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer py-1 block text-left"
                >
                  Culinary Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer py-1 block text-left"
                >
                  Contact & Ordering
                </button>
              </li>
            </ul>
          </div>

          {/* Products List */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] block">
              Provisions
            </span>
            <ul className="space-y-1.5 text-xs font-sans-clean text-[#F5F0E6]/75">
              <li>• Stockfish Prime Body Cuts</li>
              <li>• Stockfish Heads & Bone Collars</li>
              <li>• Whole Cleaned Sun-Dried Crayfish</li>
              <li>• Pure Ground Crayfish Powder</li>
              <li>• Commercial Wholesale & Bulk Orders</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-[#16382A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5F0E6]/50 font-sans-clean">
          <p>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="text-[10px] tracking-wider text-[#A3B899]/60 hover:text-[#B8954A] transition-colors uppercase font-sans-clean cursor-pointer"
              >
                Admin Portal
              </button>
            )}
            <span className="text-[10.5px] tracking-wider uppercase text-[#B8954A]">
              Stockfish & Crayfish Specialists
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
};
