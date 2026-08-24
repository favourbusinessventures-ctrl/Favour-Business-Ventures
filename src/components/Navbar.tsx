import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Menu, X, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { NavigationTab } from '../types';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useBranding } from '../hooks/useBranding';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { ThemeToggle } from './ThemeToggle';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { settings } = useBusinessSettings();
  const { branding } = useBranding();
  const { isDark } = useTheme();
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLogo = isDark 
    ? (branding.darkModeLogoUrl || branding.primaryLogoUrl)
    : branding.primaryLogoUrl;

  const brandDisplayName = branding.brandName || settings.name || 'FAVORA';
  const brandTagline = branding.brandTagline || 'Stockfish & Crayfish Provisions';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems: { id: NavigationTab; num: string; label: string }[] = [
    { id: 'home', num: '01', label: 'Home' },
    { id: 'products', num: '02', label: 'Products' },
    { id: 'about', num: '03', label: 'About' },
    { id: 'gallery', num: '04', label: 'Gallery' },
    { id: 'contact', num: '05', label: 'Contact' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isDark
            ? isScrolled
              ? 'bg-[#071F16]/95 backdrop-blur-md border-b border-[#16382A] shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-3 sm:py-3.5'
              : 'bg-[#071F16] border-b border-[#16382A]/80 py-4 sm:py-4.5'
            : isScrolled
              ? 'bg-[#FAFAFA]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] py-3 sm:py-3.5'
              : 'bg-[#FAFAFA] border-b border-[#E5E7EB] py-4 sm:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 flex items-center justify-between gap-2">
          
          {/* Brand Wordmark (Left) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none shrink-0 flex items-center gap-3"
          >
            {activeLogo ? (
              <img 
                src={activeLogo} 
                alt={brandDisplayName}
                style={{ maxHeight: `${branding.desktopLogoSize || 40}px` }}
                className="w-auto object-contain"
              />
            ) : (
              <div className="flex flex-col">
                <span className={`font-editorial text-base sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase transition-colors leading-tight ${
                  isDark ? 'text-[#EDEDED] group-hover:text-[#B8954A]' : 'text-[#1A1A1A] group-hover:text-[#1E5631]'
                }`}>
                  {brandDisplayName}
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans-clean font-semibold tracking-[0.24em] sm:tracking-[0.32em] text-[#B8954A] uppercase">
                  {brandTagline}
                </span>
              </div>
            )}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-[11px] font-medium uppercase tracking-[0.22em] transition-colors relative py-2 px-1 cursor-pointer focus:outline-none ${
                    isActive
                      ? isDark ? 'text-[#EDEDED] font-semibold' : 'text-[#1A1A1A] font-semibold'
                      : isDark ? 'text-[#EDEDED]/70 hover:text-[#EDEDED]' : 'text-[#525252] hover:text-[#1A1A1A]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${
                        isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'
                      }`}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTA & Theme Toggle (Right Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              aria-label={`Open shopping cart with ${totalItems} items`}
              className={`btn-tactile relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer min-h-[44px] ${
                isDark
                  ? 'bg-[#0D3325] hover:bg-[#16382A] text-[#EDEDED] border-[#16382A] hover:border-[#B8954A]/50'
                  : 'bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border-[#E5E7EB] hover:border-[#1E5631]/40 shadow-xs'
              }`}
            >
              <div className="relative">
                <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                {totalItems > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 text-[10px] font-sans-clean font-bold rounded-full flex items-center justify-center ${
                      isDark
                        ? 'bg-[#B8954A] text-[#071F16]'
                        : 'bg-[#1E5631] text-white'
                    }`}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-[0.15em]">
                Cart
              </span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile btn-whatsapp-gold inline-flex items-center gap-2 px-5 py-2.5 text-[#071F16] text-[10.5px] font-bold tracking-[0.2em] uppercase rounded-xl group cursor-pointer shadow-md min-h-[44px]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#071F16]" />
              <span>Order</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#071F16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Actions (Cart + Toggle + Menu Button) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {/* Mobile Cart Button */}
            <button
              onClick={openCart}
              aria-label={`Open shopping cart with ${totalItems} items`}
              className={`relative w-11 h-11 flex items-center justify-center transition-colors cursor-pointer rounded-xl border focus:outline-none ${
                isDark
                  ? 'text-[#EDEDED] hover:text-[#B8954A] border-[#16382A] bg-[#0D3325]/50'
                  : 'text-[#1A1A1A] hover:text-[#1E5631] border-[#E5E7EB] bg-white shadow-xs'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[9.5px] font-sans-clean font-bold rounded-full flex items-center justify-center ${
                    isDark
                      ? 'bg-[#B8954A] text-[#071F16]'
                      : 'bg-[#1E5631] text-white'
                  }`}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <ThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer rounded-xl border focus:outline-none ${
                isDark
                  ? 'text-[#EDEDED] hover:text-[#B8954A] border-[#16382A] bg-[#0D3325]/50'
                  : 'text-[#1A1A1A] hover:text-[#1E5631] border-[#E5E7EB] bg-white shadow-xs'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* App-Like Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 top-[60px] z-40 backdrop-blur-lg flex flex-col justify-between p-6 sm:p-10 md:hidden border-t overflow-y-auto ${
              isDark 
                ? 'bg-[#071F16]/98 border-[#16382A] text-[#EDEDED]' 
                : 'bg-[#FAFAFA]/98 border-[#E5E7EB] text-[#1A1A1A]'
            }`}
          >
            <div className="space-y-6 pt-2">
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
              }`}>
                <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.32em] text-[#B8954A]">
                  Navigation Directory
                </span>
                <span className={`text-[10px] font-sans-clean uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#EDEDED]/50' : 'text-[#6B7266]'
                }`}>
                  {brandDisplayName}
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                {navItems.map((item, idx) => {
                  const isActive = currentTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left py-4 px-4 flex items-center justify-between rounded-xl transition-all cursor-pointer min-h-[52px] ${
                        isActive
                          ? isDark 
                            ? 'bg-[#0D3325] border border-[#B8954A]/40 text-[#EDEDED]'
                            : 'bg-white border border-[#1E5631]/30 text-[#1A1A1A] shadow-xs'
                          : isDark
                            ? 'bg-transparent text-[#EDEDED]/80 hover:bg-[#0D3325]/40 hover:text-[#EDEDED]'
                            : 'bg-transparent text-[#525252] hover:bg-white hover:text-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-[11px] font-sans-clean font-semibold tracking-wider ${
                          isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                        }`}>
                          {item.num}
                        </span>
                        <span className="font-editorial text-2xl font-bold tracking-wide">
                          {item.label}
                        </span>
                      </div>

                      {isActive ? (
                        <span className={`text-[9.5px] font-sans-clean uppercase tracking-[0.2em] font-semibold ${
                          isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                        }`}>
                          Active
                        </span>
                      ) : (
                        <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-[#EDEDED]/40' : 'text-[#6B7266]/50'}`} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={`pt-6 pb-4 space-y-3 border-t ${
              isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
            }`}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openCart();
                }}
                className={`btn-tactile w-full flex items-center justify-between px-4 py-3.5 rounded-xl border font-sans-clean font-semibold text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer min-h-[48px] ${
                  isDark
                    ? 'bg-[#0D3325] border-[#16382A] text-[#EDEDED] hover:border-[#B8954A]/50'
                    : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1A1A1A] hover:bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                  <span>View Shopping Cart</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isDark ? 'bg-[#16382A] text-[#B8954A]' : 'bg-white text-[#1E5631] border border-[#E5E7EB]'
                  }`}
                >
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile btn-whatsapp-gold w-full flex items-center justify-center gap-3 py-4 text-[#071F16] text-xs font-bold tracking-[0.2em] uppercase rounded-xl shadow-lg min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 text-[#071F16]" />
                <span>Order on WhatsApp</span>
              </a>
              <div className="text-center">
                <span className={`text-[11px] font-sans-clean ${
                  isDark ? 'text-[#EDEDED]/60' : 'text-[#6B7266]'
                }`}>
                  Direct Line: {settings.whatsappNumberDisplay}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
