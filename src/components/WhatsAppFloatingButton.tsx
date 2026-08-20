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
        className="btn-tactile btn-whatsapp-gold flex items-center gap-2.5 px-4.5 py-3 rounded-full text-[#071F16] font-sans-clean font-bold text-xs tracking-[0.18em] uppercase group shadow-2xl"
      >
        <MessageCircle className="w-4 h-4 text-[#071F16] transition-transform group-hover:scale-110" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};
