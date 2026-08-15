import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../types';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <footer className="bg-[#071F16] text-[#F5F0E6] border-t border-[#16382A]">
      
      {/* Upper Footer Action Banner */}
      <div className="border-b border-[#16382A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.35em] text-[#B8954A] block">
              Stockfish & Crayfish Provisions
            </span>
            <h3 className="font-editorial text-3xl sm:text-5xl font-bold text-[#F5F0E6]">
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
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md group shrink-0 rounded-[2px]"
          >
            <MessageCircle className="w-4 h-4 text-[#071F16]" />
            <span>Order on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-editorial text-2xl font-bold tracking-[0.1em] text-[#F5F0E6] uppercase">
              {BUSINESS_CONFIG.name}
            </span>
            <p className="text-xs text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed max-w-sm">
              Stockfish and crayfish provided with dependable quality for homes, food vendors, and caterers.
            </p>
            <div className="pt-2 text-xs text-[#B8954A] font-sans-clean font-medium">
              WhatsApp: {BUSINESS_CONFIG.whatsappNumberDisplay}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] block">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs font-sans-clean text-[#F5F0E6]/75">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  Stockfish & Crayfish Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  About The Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  Culinary Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  Contact & Ordering
                </button>
              </li>
            </ul>
          </div>

          {/* Products List */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] block">
              Provisions
            </span>
            <ul className="space-y-2 text-xs font-sans-clean text-[#F5F0E6]/75">
              <li>• Stockfish Prime Body Cuts</li>
              <li>• Stockfish Heads & Bone Collars</li>
              <li>• Whole Cleaned Sun-Dried Crayfish</li>
              <li>• Pure Ground Crayfish Powder</li>
              <li>• Commercial Wholesale & Bulk Orders</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-14 pt-8 border-t border-[#16382A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F0E6]/50 font-sans-clean">
          <p>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-[11px] tracking-wider uppercase text-[#B8954A]">
            Stockfish & Crayfish Specialists
          </p>
        </div>

      </div>

    </footer>
  );
};
