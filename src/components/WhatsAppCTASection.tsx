import React from 'react';
import { MessageCircle, Phone, Mail, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppCTASection: React.FC = () => {
  const { settings } = useBusinessSettings();

  const generalWhatsAppUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);
  const stockfishWhatsAppUrl = buildWhatsAppUrl(settings.stockfishOrderMessage, settings.whatsappNumberRaw);
  const crayfishWhatsAppUrl = buildWhatsAppUrl(settings.crayfishOrderMessage, settings.whatsappNumberRaw);
  const wholesaleWhatsAppUrl = buildWhatsAppUrl(
    `Hello ${settings.shortName || 'Favour Business Ventures'}, I would like to inquire about bulk wholesale and catering supply for Stockfish and Crayfish.`,
    settings.whatsappNumberRaw
  );

  return (
    <section id="order-cta-section" className="py-20 sm:py-28 bg-[#071F16] text-[#F5F0E6] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-[#0D3325]/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8954A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        
        {/* Central Glassmorphic Order Banner */}
        <div className="bg-gradient-to-br from-[#0D3325]/90 via-[#071F16]/95 to-[#0D3325]/90 border border-[#B8954A]/40 rounded-2xl p-8 sm:p-12 lg:p-16 shadow-2xl space-y-10">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#071F16]/80 border border-[#B8954A]/40 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#B8954A] animate-pulse" />
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                READY TO ORDER?
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F0E6] leading-[1.02]">
              Order Direct on WhatsApp for Instant Confirmation.
            </h2>

            <p className="text-sm sm:text-base text-[#F5F0E6]/80 font-sans-clean font-light leading-relaxed max-w-2xl mx-auto">
              Tell us your desired cuts and portion sizes. We confirm live availability, portion weights, and dispatch directly to your location.
            </p>
          </div>

          {/* Quick Choice Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            
            {/* Quick Stockfish Button */}
            <a
              href={stockfishWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile bg-[#071F16]/80 hover:bg-[#071F16] border border-[#16382A] hover:border-[#B8954A]/60 p-5 rounded-xl text-left flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                  Quick Inquiry 01
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors">
                  Order Stockfish
                </h3>
                <p className="text-xs text-[#F5F0E6]/60 font-sans-clean font-light">
                  Body cuts, bone collars, heads & bulk packs.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#B8954A] tracking-wider uppercase pt-2 border-t border-[#16382A]">
                <span>Inquire</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* Quick Crayfish Button */}
            <a
              href={crayfishWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile bg-[#071F16]/80 hover:bg-[#071F16] border border-[#16382A] hover:border-[#B8954A]/60 p-5 rounded-xl text-left flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                  Quick Inquiry 02
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors">
                  Order Crayfish
                </h3>
                <p className="text-xs text-[#F5F0E6]/60 font-sans-clean font-light">
                  Cleaned sun-dried whole or 100% pure ground powder.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#B8954A] tracking-wider uppercase pt-2 border-t border-[#16382A]">
                <span>Inquire</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* Bulk & Wholesale Button */}
            <a
              href={wholesaleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile bg-[#071F16]/80 hover:bg-[#071F16] border border-[#16382A] hover:border-[#B8954A]/60 p-5 rounded-xl text-left flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] block">
                  Commercial 03
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors">
                  Wholesale & Catering
                </h3>
                <p className="text-xs text-[#F5F0E6]/60 font-sans-clean font-light">
                  Large bags, event caterer supplies & bulk sacks.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#B8954A] tracking-wider uppercase pt-2 border-t border-[#16382A]">
                <span>Inquire</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

          </div>

          {/* Primary High-Visibility WhatsApp Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold tracking-[0.22em] uppercase rounded-xl shadow-xl group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#071F16]" />
              <span>Chat Directly on WhatsApp ({settings.whatsappNumberDisplay})</span>
              <ArrowUpRight className="w-4 h-4 text-[#071F16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Direct Phone & Email Fallback Contacts */}
          <div className="pt-6 border-t border-[#16382A] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#F5F0E6]/70 font-sans-clean">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B8954A]" />
              <span>Instant Response Desk</span>
            </div>

            <a
              href={settings.phoneCallUrl}
              className="flex items-center gap-2 hover:text-[#B8954A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B8954A]" />
              <span>Voice Call: {settings.phoneNumberDisplay}</span>
            </a>

            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 hover:text-[#B8954A] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#B8954A]" />
              <span>Email: {settings.email}</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
