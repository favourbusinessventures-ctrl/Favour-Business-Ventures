import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { NavigationTab } from '../types';

interface StickyMobileOrderBarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const StickyMobileOrderBar: React.FC<StickyMobileOrderBarProps> = ({
  currentTab,
  onNavigate,
}) => {
  const { settings } = useBusinessSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down slightly (e.g. past hero)
      const scrolled = window.scrollY > 240;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-3 inset-x-3 z-40 sm:hidden"
        >
          <div className="bg-[#071F16]/95 backdrop-blur-md border border-[#B8954A]/40 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.65)] flex items-center justify-between gap-3">
            
            {/* Quick Context / Navigation hint */}
            <div className="flex flex-col pl-2 overflow-hidden">
              <span className="text-[9px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] truncate">
                Direct Provisions
              </span>
              <span className="font-editorial text-sm font-bold text-[#F5F0E6] truncate">
                Stockfish & Crayfish
              </span>
            </div>

            {/* Tap Action: Order on WhatsApp */}
            <div className="flex items-center gap-2 shrink-0">
              {currentTab !== 'products' && (
                <button
                  onClick={() => onNavigate('products')}
                  className="btn-tactile min-h-[44px] px-3.5 flex items-center justify-center bg-[#0D3325] text-[#F5F0E6] text-[10px] font-sans-clean font-semibold tracking-[0.16em] uppercase rounded-xl border border-[#16382A]"
                >
                  Products
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile btn-whatsapp-gold min-h-[44px] px-4 flex items-center gap-2 text-[#071F16] text-[10.5px] font-sans-clean font-bold tracking-[0.18em] uppercase rounded-xl shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#071F16]" />
                <span>Order</span>
                <ArrowUpRight className="w-3 h-3 text-[#071F16]" />
              </a>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
