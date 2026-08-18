import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useBusinessSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Order"
        className="btn-tactile flex items-center gap-2 px-4 py-2.5 bg-[#071F16]/95 hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/50 shadow-2xl backdrop-blur-xs group hover:border-[#B8954A] rounded-[2px]"
      >
        <MessageCircle className="w-4 h-4 text-[#B8954A] transition-transform group-hover:scale-110" />
        <span className="text-[10px] font-sans-clean font-semibold tracking-[0.2em] uppercase text-[#F5F0E6]/90 group-hover:text-[#F5F0E6] transition-colors">
          WhatsApp
        </span>
      </a>
    </div>
  );
};
