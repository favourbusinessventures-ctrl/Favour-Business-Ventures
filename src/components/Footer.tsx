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
    <footer className="bg-[#122b1e] text-[#faf7f2] border-t border-[#0b1c13]">
      
      {/* Upper Footer Banner */}
      <div className="border-b border-[#1b3d2b] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#c59b27]">
              Premium Staples
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#faf7f2]">
              {BUSINESS_CONFIG.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#c8d4cc] font-sans-clean font-light leading-relaxed">
              {BUSINESS_CONFIG.description}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#c59b27] hover:bg-[#d8b14a] text-[#122b1e] text-xs font-semibold tracking-[0.18em] uppercase transition-all shadow-md group shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#122b1e]" />
            <span>Order on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#122b1e]/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-editorial text-2xl font-bold tracking-[0.1em] text-[#faf7f2] uppercase">
              {BUSINESS_CONFIG.name}
            </span>
            <p className="text-xs text-[#a3b8aa] font-sans-clean font-light leading-relaxed max-w-sm">
              Stockfish and crayfish provided with dependable quality for homes, food vendors, and caterers.
            </p>
            <div className="pt-2 text-xs text-[#c59b27] font-sans-clean">
              WhatsApp: {BUSINESS_CONFIG.whatsappNumberDisplay}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#c59b27] block">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs font-sans-clean text-[#c8d4cc]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#faf7f2] transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#faf7f2] transition-colors cursor-pointer"
                >
                  Stockfish & Crayfish Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#faf7f2] transition-colors cursor-pointer"
                >
                  About The Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#faf7f2] transition-colors cursor-pointer"
                >
                  Visual Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#faf7f2] transition-colors cursor-pointer"
                >
                  Contact & Ordering
                </button>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#c59b27] block">
              Products
            </span>
            <ul className="space-y-2 text-xs font-sans-clean text-[#c8d4cc]">
              <li>• Stockfish Prime Body Cuts</li>
              <li>• Stockfish Heads & Collars</li>
              <li>• Whole Cleaned Sun-Dried Crayfish</li>
              <li>• Pure Freshly Ground Crayfish</li>
              <li>• Commercial Wholesale & Bulk Options</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#1b3d2b] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#82998a] font-sans-clean">
          <p>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-[11px] tracking-wide">
            Quality Stockfish & Crayfish
          </p>
        </div>

      </div>

    </footer>
  );
};
