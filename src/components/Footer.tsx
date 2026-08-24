import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../types';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useBranding } from '../hooks/useBranding';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onNavigateToAdmin }) => {
  const { settings } = useBusinessSettings();
  const { branding } = useBranding();
  const { isDark } = useTheme();
  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  const brandDisplayName = branding.brandName || settings.name || 'FAVORA';
  const brandTagline = branding.brandTagline || 'Stockfish & Crayfish Provisions';
  const footerLogo = isDark 
    ? (branding.darkModeLogoUrl || branding.primaryLogoUrl)
    : (branding.primaryLogoUrl || branding.darkModeLogoUrl);

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark
        ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]'
        : 'bg-white text-[#1A1A1A] border-[#E5E7EB]'
    }`}>

      {/* Upper Footer Action Banner */}
      <div className={`py-14 sm:py-18 border-b ${
        isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2.5 max-w-xl">
            <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.35em] block ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              {brandTagline}
            </span>
            <h3 className={`font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
              isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
            }`}>
              {brandDisplayName}
            </h3>
            <p className={`text-xs sm:text-sm font-sans-clean font-light leading-relaxed ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
              {settings.description}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-tactile inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-xl shadow-lg group shrink-0 cursor-pointer ${
              isDark
                ? 'bg-[#0D3325] hover:bg-[#164936] text-[#EDEDED] border border-[#16382A] hover:border-[#B8954A]/50'
                : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white border border-[#1E5631]'
            }`}
          >
            <MessageCircle className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-white'}`} />
            <span>Order on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-14 sm:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3.5">
            {footerLogo ? (
              <img
                src={footerLogo}
                alt={brandDisplayName}
                style={{ maxHeight: `${Math.min(branding.desktopLogoSize || 40, 48)}px` }}
                className="w-auto object-contain mb-2"
              />
            ) : (
              <span className={`font-editorial text-2xl font-bold tracking-[0.1em] uppercase ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                {brandDisplayName}
              </span>
            )}
            <p className={`text-xs font-sans-clean font-light leading-relaxed max-w-sm ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
              {settings.description || `${brandDisplayName} provisions provided with dependable quality for homes, food vendors, and caterers.`}
            </p>
            <div className={`pt-1 text-xs font-sans-clean font-medium ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              WhatsApp: {settings.whatsappNumberDisplay}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className={`text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] block ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              Navigation
            </span>
            <ul className={`space-y-2 text-xs font-sans-clean ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className={`transition-colors cursor-pointer py-1 block text-left ${
                    isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                  }`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className={`transition-colors cursor-pointer py-1 block text-left ${
                    isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                  }`}
                >
                  Stockfish & Crayfish Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className={`transition-colors cursor-pointer py-1 block text-left ${
                    isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                  }`}
                >
                  About The Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className={`transition-colors cursor-pointer py-1 block text-left ${
                    isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                  }`}
                >
                  Culinary Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className={`transition-colors cursor-pointer py-1 block text-left ${
                    isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                  }`}
                >
                  Contact & Ordering
                </button>
              </li>
            </ul>
          </div>

          {/* Products List */}
          <div className="md:col-span-4 space-y-3">
            <span className={`text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.25em] block ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              Provisions
            </span>
            <ul className={`space-y-1.5 text-xs font-sans-clean ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
              <li>• Stockfish Prime Body Cuts</li>
              <li>• Stockfish Heads & Bone Collars</li>
              <li>• Whole Cleaned Sun-Dried Crayfish</li>
              <li>• Pure Ground Crayfish Powder</li>
              <li>• Commercial Wholesale & Bulk Orders</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans-clean ${
          isDark ? 'border-[#16382A] text-[#EDEDED]/50' : 'border-[#E5E7EB] text-[#6B7266]'
        }`}>
          <p>
            © {new Date().getFullYear()} {brandDisplayName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className={`text-[10px] tracking-wider transition-colors uppercase font-sans-clean cursor-pointer ${
                  isDark ? 'text-[#EDEDED]/60 hover:text-[#B8954A]' : 'text-[#6B7266] hover:text-[#1E5631]'
                }`}
              >
                Admin Portal
              </button>
            )}
            <span className={`text-[10.5px] tracking-wider uppercase ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              Stockfish & Crayfish Specialists
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
};
