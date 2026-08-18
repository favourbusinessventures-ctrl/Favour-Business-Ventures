import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../types';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { settings } = useBusinessSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          isScrolled
            ? 'bg-[#071F16]/95 backdrop-blur-md border-b border-[#16382A] shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-3 sm:py-3.5'
            : 'bg-[#071F16] border-b border-[#16382A]/80 py-4 sm:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between">
          
          {/* Brand Wordmark (Left) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex flex-col">
              <span className="font-editorial text-lg sm:text-xl md:text-2xl font-bold tracking-[0.16em] text-[#F5F0E6] uppercase transition-colors group-hover:text-[#B8954A]">
                {settings.name}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-sans-clean font-semibold tracking-[0.32em] text-[#B8954A] uppercase">
                Stockfish & Crayfish
              </span>
            </div>
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
                      ? 'text-[#F5F0E6] font-semibold'
                      : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B8954A]"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTA (Right Desktop) */}
          <div className="hidden sm:flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D3325] hover:bg-[#164936] text-[#F5F0E6] border border-[#B8954A]/40 hover:border-[#B8954A] text-[10.5px] font-semibold tracking-[0.2em] uppercase shadow-sm group rounded-[2px]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#B8954A]" />
              <span>Order</span>
              <ArrowUpRight className="w-3 h-3 text-[#F5F0E6]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button (Touch Target >= 44px) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="w-11 h-11 flex items-center justify-center text-[#F5F0E6] hover:text-[#B8954A] transition-colors cursor-pointer rounded-[2px] border border-[#16382A] bg-[#0D3325]/50 focus:outline-none"
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
            className="fixed inset-0 top-[60px] z-40 bg-[#071F16]/98 backdrop-blur-lg flex flex-col justify-between p-6 sm:p-10 md:hidden border-t border-[#16382A] overflow-y-auto"
          >
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
                <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.32em] text-[#B8954A]">
                  Navigation Directory
                </span>
                <span className="text-[10px] font-sans-clean text-[#F5F0E6]/50 uppercase tracking-[0.2em]">
                  Favour Ventures
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
                      className={`w-full text-left py-4 px-4 flex items-center justify-between rounded-[2px] transition-all cursor-pointer min-h-[52px] ${
                        isActive
                          ? 'bg-[#0D3325] border border-[#B8954A]/40 text-[#F5F0E6]'
                          : 'bg-transparent text-[#F5F0E6]/80 hover:bg-[#0D3325]/40 hover:text-[#F5F0E6]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-sans-clean font-semibold tracking-wider text-[#B8954A]">
                          {item.num}
                        </span>
                        <span className="font-editorial text-2xl font-bold tracking-wide">
                          {item.label}
                        </span>
                      </div>

                      {isActive ? (
                        <span className="text-[9.5px] font-sans-clean uppercase tracking-[0.2em] text-[#B8954A] font-semibold">
                          Active
                        </span>
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-[#F5F0E6]/40" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 pb-4 space-y-4 border-t border-[#16382A]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile w-full flex items-center justify-center gap-3 py-4 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.2em] uppercase shadow-lg rounded-[2px]"
              >
                <MessageCircle className="w-4 h-4 text-[#071F16]" />
                <span>Order on WhatsApp</span>
              </a>
              <div className="text-center">
                <span className="text-[11px] text-[#F5F0E6]/60 font-sans-clean">
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
