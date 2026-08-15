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
    { id: 'home', label: 'Overview' },
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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e8e2d5] shadow-xs py-3.5'
            : 'bg-[#faf7f2] border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#122b1e] uppercase transition-colors group-hover:text-[#c59b27]">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[10px] sm:text-xs font-sans-clean font-medium tracking-[0.25em] text-[#6b665c] uppercase">
                Stockfish & Crayfish
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs font-medium uppercase tracking-[0.2em] transition-all relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#122b1e] font-semibold'
                      : 'text-[#57534a] hover:text-[#122b1e]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#c59b27]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 shadow-xs group"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Order on WhatsApp</span>
              <ArrowUpRight className="w-3 h-3 text-[#faf7f2]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#122b1e] hover:text-[#c59b27] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Thoughtful Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-[#faf7f2] flex flex-col justify-between p-8 md:hidden animate-fade-in border-t border-[#e8e2d5]">
          <div className="space-y-6 pt-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8a8477]">
              Menu Navigation
            </span>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left text-2xl font-editorial py-2 flex items-center justify-between border-b border-[#ece6d9] ${
                      isActive
                        ? 'text-[#122b1e] font-bold italic'
                        : 'text-[#47433c] hover:text-[#122b1e]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#c59b27]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 pb-4 space-y-4 border-t border-[#e8e2d5]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#122b1e] text-[#faf7f2] text-xs font-medium tracking-[0.15em] uppercase"
            >
              <MessageCircle className="w-4 h-4 text-[#c59b27]" />
              <span>Order on WhatsApp</span>
            </a>
            <p className="text-center text-xs text-[#736e63]">
              {BUSINESS_CONFIG.whatsappNumberDisplay}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
