import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Moon, 
  Sun, 
  ShoppingBag, 
  ArrowUpRight, 
  MessageCircle, 
  Star, 
  Sparkles,
  Eye
} from 'lucide-react';
import { BrandingSettings } from '../../../types/branding';
import { validateHexColor } from '../../../config/branding';

interface BrandingLivePreviewProps {
  settings: BrandingSettings;
}

export const BrandingLivePreview: React.FC<BrandingLivePreviewProps> = ({ settings }) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');

  const isDark = previewTheme === 'dark';
  const isMobile = previewDevice === 'mobile';

  // Compute theme colors dynamically from admin settings
  const primaryBg = isDark 
    ? validateHexColor(settings.darkModeBackground, '#071F16') 
    : validateHexColor(settings.backgroundColor, '#FAFAFA');
    
  const surfaceBg = isDark 
    ? validateHexColor(settings.darkModeSurface, '#0D3325') 
    : validateHexColor(settings.surfaceColor, '#FFFFFF');

  const primaryText = isDark 
    ? '#EDEDED' 
    : validateHexColor(settings.textColor, '#1A1A1A');

  const mutedText = isDark 
    ? '#A3B899' 
    : validateHexColor(settings.mutedTextColor, '#525252');

  const accentColor = validateHexColor(settings.accentColor, '#B8954A');
  const primaryColor = validateHexColor(settings.primaryColor, '#071F16');

  // Compute logo URL
  const effectiveLogo = isMobile && settings.mobileLogoUrl
    ? settings.mobileLogoUrl
    : isDark && settings.darkModeLogoUrl
      ? settings.darkModeLogoUrl
      : !isDark && settings.lightModeLogoUrl
        ? settings.lightModeLogoUrl
        : settings.primaryLogoUrl || '';

  // Logo height
  const logoHeight = isMobile 
    ? (settings.mobileLogoSize || 28) 
    : (settings.desktopLogoSize || 40);

  // Typography scale classes
  const headingClass = settings.headingScale === 'prominent' 
    ? 'text-2xl sm:text-3xl font-extrabold' 
    : settings.headingScale === 'compact' 
      ? 'text-lg sm:text-xl font-bold' 
      : 'text-xl sm:text-2xl font-bold';

  const bodyClass = settings.bodyTextSize === 'large' 
    ? 'text-[13px] sm:text-sm' 
    : settings.bodyTextSize === 'small' 
      ? 'text-[11px] sm:text-xs' 
      : 'text-xs sm:text-[13px]';

  const navClass = settings.navTextSize === 'large'
    ? 'text-[11px] font-semibold'
    : settings.navTextSize === 'compact'
      ? 'text-[9px] font-medium'
      : 'text-[10px] font-medium';

  return (
    <div className="bg-[#051710] border border-[#16382A] rounded-[2px] overflow-hidden flex flex-col shadow-lg">
      
      {/* Top Toolbar */}
      <div className="bg-[#0D3325] border-b border-[#16382A] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#B8954A]" />
          <span className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6]">
            Real-Time Visual Preview
          </span>
          <span className="text-[10px] font-sans-clean px-2 py-0.5 bg-[#071F16] text-[#A3B899] rounded-[2px]">
            Live Feedback
          </span>
        </div>

        {/* Viewport & Theme Toggles */}
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="bg-[#071F16] border border-[#16382A] p-0.5 rounded-[2px] flex items-center">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-2 py-1 rounded-[2px] text-xs font-sans-clean flex items-center gap-1.5 transition-colors ${
                previewDevice === 'desktop' 
                  ? 'bg-[#B8954A] text-[#071F16] font-semibold' 
                  : 'text-[#A3B899] hover:text-[#F5F0E6]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-2 py-1 rounded-[2px] text-xs font-sans-clean flex items-center gap-1.5 transition-colors ${
                previewDevice === 'mobile' 
                  ? 'bg-[#B8954A] text-[#071F16] font-semibold' 
                  : 'text-[#A3B899] hover:text-[#F5F0E6]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="bg-[#071F16] border border-[#16382A] p-0.5 rounded-[2px] flex items-center">
            <button
              type="button"
              onClick={() => setPreviewTheme('dark')}
              className={`px-2 py-1 rounded-[2px] text-xs font-sans-clean flex items-center gap-1.5 transition-colors ${
                previewTheme === 'dark' 
                  ? 'bg-[#B8954A] text-[#071F16] font-semibold' 
                  : 'text-[#A3B899] hover:text-[#F5F0E6]'
              }`}
              title="Preview in Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme('light')}
              className={`px-2 py-1 rounded-[2px] text-xs font-sans-clean flex items-center gap-1.5 transition-colors ${
                previewTheme === 'light' 
                  ? 'bg-[#B8954A] text-[#071F16] font-semibold' 
                  : 'text-[#A3B899] hover:text-[#F5F0E6]'
              }`}
              title="Preview in Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div className="p-4 sm:p-6 bg-[#030D09] flex items-center justify-center overflow-x-auto min-h-[520px]">
        
        {/* Device Frame */}
        <div 
          className={`
            transition-all duration-300 rounded-[4px] border shadow-2xl overflow-hidden flex flex-col
            ${isMobile ? 'w-[340px] max-w-full' : 'w-full max-w-3xl'}
          `}
          style={{
            backgroundColor: primaryBg,
            borderColor: isDark ? '#16382A' : '#E5E7EB',
            color: primaryText,
          }}
        >
          
          {/* Mockup 1: Navigation Bar */}
          <header 
            className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0"
            style={{
              backgroundColor: isDark ? '#071F16' : '#FFFFFF',
              borderColor: isDark ? '#16382A' : '#E5E7EB',
            }}
          >
            {/* Logo / Wordmark */}
            <div className="flex items-center gap-2.5">
              {effectiveLogo ? (
                <img 
                  src={effectiveLogo} 
                  alt={settings.brandName} 
                  style={{ height: `${logoHeight}px` }}
                  className="max-w-[140px] object-contain"
                  onError={(e) => {
                    // Fallback to text if broken
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}

              <div className="flex flex-col">
                <span 
                  className="font-editorial font-bold tracking-[0.14em] uppercase leading-tight text-sm sm:text-base"
                  style={{ color: primaryText }}
                >
                  {settings.brandName || 'FAVORA'}
                </span>
                <span 
                  className="text-[7px] sm:text-[8px] font-sans-clean font-semibold tracking-[0.2em] uppercase"
                  style={{ color: accentColor }}
                >
                  {settings.subTagline || 'Stockfish & Crayfish Provisions'}
                </span>
              </div>
            </div>

            {/* Nav Links (Desktop preview only) */}
            {!isMobile && (
              <nav className="flex items-center gap-4">
                {['Home', 'Products', 'About', 'Gallery', 'Contact'].map((item, idx) => (
                  <span 
                    key={item} 
                    className={`uppercase tracking-wider transition-colors cursor-pointer ${navClass} ${
                      idx === 0 ? 'font-bold' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{ color: idx === 0 ? accentColor : primaryText }}
                  >
                    {item}
                  </span>
                ))}
              </nav>
            )}

            {/* Right Mini Action */}
            <div className="flex items-center gap-2">
              <span 
                className="px-2.5 py-1 text-[9px] font-sans-clean font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1"
                style={{
                  backgroundColor: accentColor,
                  color: isDark ? '#071F16' : '#FFFFFF',
                }}
              >
                <MessageCircle className="w-2.5 h-2.5" />
                <span>Order</span>
              </span>
            </div>
          </header>

          {/* Mockup 2: Hero Section */}
          <section 
            className="p-5 sm:p-8 flex flex-col items-center text-center space-y-3 relative overflow-hidden"
            style={{
              backgroundColor: isDark ? '#071F16' : '#F7F5F0',
              borderBottom: `1px solid ${isDark ? '#16382A' : '#E5E7EB'}`
            }}
          >
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-sans-clean font-bold uppercase tracking-[0.2em] border"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor
              }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Authentic Norwegian & Oron Supply</span>
            </div>

            <h1 
              className={`font-editorial font-bold tracking-tight uppercase max-w-md ${headingClass}`}
              style={{ color: primaryText }}
            >
              Premium {settings.brandName || 'FAVORA'} Provisions
            </h1>

            <p 
              className={`max-w-sm font-sans-clean leading-relaxed ${bodyClass}`}
              style={{ color: mutedText }}
            >
              {settings.brandTagline || 'Stockfish • Crayfish • Seafood'} — Specially curated for wholesale, catering, and gourmet culinary traditions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <span 
                className="px-4 py-2 text-[10px] font-sans-clean font-bold uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5"
                style={{
                  backgroundColor: accentColor,
                  color: isDark ? '#071F16' : '#FFFFFF',
                }}
              >
                <span>View Full Catalog</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
              <span 
                className="px-3.5 py-2 text-[10px] font-sans-clean font-semibold uppercase tracking-wider rounded-[2px] border"
                style={{
                  borderColor: isDark ? '#16382A' : '#D1D5DB',
                  color: primaryText,
                  backgroundColor: isDark ? '#0D3325' : '#FFFFFF'
                }}
              >
                Inquire on WhatsApp
              </span>
            </div>
          </section>

          {/* Mockup 3: Product Cards Grid */}
          <section className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span 
                className="text-[10px] font-sans-clean font-bold uppercase tracking-[0.2em]"
                style={{ color: accentColor }}
              >
                Catalog Highlights
              </span>
              <span className="text-[10px] font-sans-clean font-medium" style={{ color: mutedText }}>
                Direct Import
              </span>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
              
              {/* Card 1: Stockfish */}
              <div 
                className="p-3.5 rounded-[2px] border flex flex-col justify-between space-y-2.5 shadow-xs"
                style={{
                  backgroundColor: surfaceBg,
                  borderColor: isDark ? '#16382A' : '#E5E7EB'
                }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[8px] font-sans-clean font-bold uppercase px-1.5 py-0.5 rounded-[2px]"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor
                      }}
                    >
                      Norwegian Cod
                    </span>
                    <div className="flex text-amber-400 text-[10px]">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                  </div>

                  <h4 className="font-editorial font-bold text-xs sm:text-sm" style={{ color: primaryText }}>
                    Round Cut Stockfish
                  </h4>
                  <p className="text-[10px] font-sans-clean line-clamp-2" style={{ color: mutedText }}>
                    Whole dried Lofoten cod offering rich collagen, dense flakes, and authentic traditional aroma.
                  </p>
                </div>

                <div 
                  className="pt-2 border-t flex items-center justify-between text-[10px]"
                  style={{ borderColor: isDark ? '#16382A' : '#F3F4F6' }}
                >
                  <span className="font-mono font-bold" style={{ color: accentColor }}>
                    Premium Grade A
                  </span>
                  <span 
                    className="font-sans-clean font-semibold uppercase text-[9px] px-2 py-0.5 rounded-[2px]"
                    style={{
                      backgroundColor: accentColor,
                      color: isDark ? '#071F16' : '#FFFFFF'
                    }}
                  >
                    Order
                  </span>
                </div>
              </div>

              {/* Card 2: Crayfish */}
              <div 
                className="p-3.5 rounded-[2px] border flex flex-col justify-between space-y-2.5 shadow-xs"
                style={{
                  backgroundColor: surfaceBg,
                  borderColor: isDark ? '#16382A' : '#E5E7EB'
                }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[8px] font-sans-clean font-bold uppercase px-1.5 py-0.5 rounded-[2px]"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor
                      }}
                    >
                      Oron Coastal
                    </span>
                    <div className="flex text-amber-400 text-[10px]">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                  </div>

                  <h4 className="font-editorial font-bold text-xs sm:text-sm" style={{ color: primaryText }}>
                    Smoked Oron Crayfish
                  </h4>
                  <p className="text-[10px] font-sans-clean line-clamp-2" style={{ color: mutedText }}>
                    Sun-dried and hardwood-smoked whole prawns with intense umami for rich soups and stews.
                  </p>
                </div>

                <div 
                  className="pt-2 border-t flex items-center justify-between text-[10px]"
                  style={{ borderColor: isDark ? '#16382A' : '#F3F4F6' }}
                >
                  <span className="font-mono font-bold" style={{ color: accentColor }}>
                    Sealed 1kg & Bulk
                  </span>
                  <span 
                    className="font-sans-clean font-semibold uppercase text-[9px] px-2 py-0.5 rounded-[2px]"
                    style={{
                      backgroundColor: accentColor,
                      color: isDark ? '#071F16' : '#FFFFFF'
                    }}
                  >
                    Order
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* Mockup 4: Footer */}
          <footer 
            className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[9px] font-sans-clean"
            style={{
              backgroundColor: isDark ? '#051710' : '#ECE9DF',
              borderColor: isDark ? '#16382A' : '#E5E7EB',
              color: mutedText
            }}
          >
            <div>
              © {new Date().getFullYear()} {settings.brandName || 'FAVORA'}. All Rights Reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:underline cursor-pointer">Norwegian Stockfish</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Oron Crayfish</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Wholesale</span>
            </div>
          </footer>

        </div>

      </div>
    </div>
  );
};
