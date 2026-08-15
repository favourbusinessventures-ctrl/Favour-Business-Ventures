import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../types';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#071F16]/95 backdrop-blur-md border-b border-[#16382A] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] py-3.5'
            : 'bg-[#071F16] border-b border-[#16382A]/70 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
          
          {/* Wordmark (Left) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-editorial text-lg sm:text-xl md:text-2xl font-bold tracking-[0.18em] text-[#F5F0E6] uppercase transition-colors group-hover:text-[#B8954A]">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-sans-clean font-semibold tracking-[0.32em] text-[#B8954A] uppercase">
                Stockfish & Crayfish
              </span>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-[11px] font-medium uppercase tracking-[0.22em] transition-colors relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#F5F0E6] font-semibold'
                      : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B8954A]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Refined Order CTA (Right) */}
          <div className="hidden sm:flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0D3325] hover:bg-[#164936] text-[#F5F0E6] border border-[#B8954A]/40 hover:border-[#B8954A] text-[10.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 group"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#B8954A]" />
              <span>Order</span>
              <ArrowUpRight className="w-3 h-3 text-[#F5F0E6]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#F5F0E6] hover:text-[#B8954A] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-[#071F16] flex flex-col justify-between p-8 sm:p-12 md:hidden animate-fade-up border-t border-[#16382A]">
          <div className="space-y-8 pt-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#B8954A] block">
              Menu Navigation
            </span>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left text-3xl font-editorial py-3 flex items-center justify-between border-b border-[#16382A] ${
                      isActive
                        ? 'text-[#F5F0E6] font-bold italic'
                        : 'text-[#F5F0E6]/75 hover:text-[#F5F0E6]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#B8954A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 pb-6 space-y-4 border-t border-[#16382A]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#0D3325] border border-[#B8954A]/50 text-[#F5F0E6] text-xs font-semibold tracking-[0.2em] uppercase shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#B8954A]" />
              <span>Order on WhatsApp</span>
            </a>
            <p className="text-center text-xs text-[#F5F0E6]/60">
              Direct Inquiries: {BUSINESS_CONFIG.whatsappNumberDisplay}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
