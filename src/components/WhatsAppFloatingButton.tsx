import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] border border-[#c59b27] shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-[#c59b27]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c59b27]" />
        </div>
        <span className="text-xs font-sans-clean font-semibold tracking-[0.12em] uppercase hidden sm:inline-block">
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
};
