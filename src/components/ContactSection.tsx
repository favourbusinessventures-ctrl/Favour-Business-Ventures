import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, ArrowUpRight, Send } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const { settings } = useBusinessSettings();
  const { isDark } = useTheme();
  const [productChoice, setProductChoice] = useState<'Stockfish' | 'Crayfish' | 'Both Stockfish & Crayfish'>('Stockfish');
  const [orderQuantity, setOrderQuantity] = useState('Standard Retail / Household Portion');
  const [customerName, setCustomerName] = useState('');
  const [customNote, setCustomNote] = useState('');

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `Hello ${settings.shortName || 'FAVORA'}, I would like to place an order.\n\n`;
    message += `• Product: ${productChoice}\n`;
    message += `• Quantity/Purpose: ${orderQuantity}\n`;
    if (customerName.trim()) {
      message += `• Name: ${customerName.trim()}\n`;
    }
    if (customNote.trim()) {
      message += `• Notes: ${customNote.trim()}\n`;
    }
    message += `\nPlease confirm availability, pricing, and dispatch details.`;

    const url = buildWhatsAppUrl(message, settings.whatsappNumberRaw);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const defaultWhatsAppUrl = buildWhatsAppUrl(settings.defaultOrderMessage, settings.whatsappNumberRaw);

  return (
    <section 
      id="contact-section" 
      className={`py-16 sm:py-24 lg:py-32 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071F16] text-[#EDEDED] border-[#16382A]' 
          : 'bg-[#FAFAFA] text-[#1A1A1A] border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* Section Banner / Header */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
            <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              Direct Inquiries
            </span>
          </div>

          <h2 className={`font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98] ${
            isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
          }`}>
            Ready to order?
          </h2>

          <p className={`font-editorial italic text-xl sm:text-3xl ${
            isDark ? 'text-[#A3B899]' : 'text-[#525252]'
          }`}>
            Tell us what you need.
          </p>

          <p className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
            isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
          }`}>
            Choose what you need. Send your order. We'll take it from there. Direct WhatsApp communication for transparent quotes and swift fulfillment.
          </p>
        </div>

        {/* 2-Column Split: Custom Order Builder & Direct Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Order Composer */}
          <div className={`lg:col-span-7 p-6 sm:p-10 space-y-6 sm:space-y-8 rounded-2xl border shadow-sm transition-colors duration-300 ${
            isDark 
              ? 'bg-[#0D3325]/80 backdrop-blur-md border-[#16382A]' 
              : 'bg-white border-[#E5E7EB]'
          }`}>
            <div className={`space-y-2 border-b pb-5 ${
              isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
            }`}>
              <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.3em] ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                Order Composer
              </span>
              <h3 className={`font-editorial text-2xl sm:text-3xl font-bold ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                Format Your WhatsApp Message
              </h3>
              <p className={`text-xs sm:text-sm font-sans-clean font-light ${
                isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
              }`}>
                Select your required products to generate a clear, pre-filled WhatsApp inquiry.
              </p>
            </div>

            <form onSubmit={handleSendOrder} className="space-y-5">
              
              {/* Product Selection */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Select Product
                </label>
                <select
                  value={productChoice}
                  onChange={(e) => setProductChoice(e.target.value as any)}
                  className={`w-full px-4 py-3.5 text-sm focus:outline-none rounded-xl cursor-pointer min-h-[44px] border ${
                    isDark 
                      ? 'bg-[#071F16] border-[#16382A] text-[#EDEDED] focus:border-[#B8954A]' 
                      : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1A1A1A] focus:border-[#1E5631]'
                  }`}
                >
                  <option value="Stockfish">Stockfish (Cuts / Heads / Bulk Packs)</option>
                  <option value="Crayfish">Crayfish (Whole Sun-Dried / Pure Ground Powder)</option>
                  <option value="Both Stockfish & Crayfish">Stockfish & Crayfish Combination</option>
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Order Quantity / Purpose
                </label>
                <select
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className={`w-full px-4 py-3.5 text-sm focus:outline-none rounded-xl cursor-pointer min-h-[44px] border ${
                    isDark 
                      ? 'bg-[#071F16] border-[#16382A] text-[#EDEDED] focus:border-[#B8954A]' 
                      : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1A1A1A] focus:border-[#1E5631]'
                  }`}
                >
                  <option value="Standard Retail / Household Portion">Standard Retail / Household Portion</option>
                  <option value="Family / Event Volume">Family Gathering / Event Volume</option>
                  <option value="Commercial Catering / Vendor Supply">Commercial Catering / Vendor Supply</option>
                  <option value="Custom Quantity (Specified in Notes)">Custom Quantity (Specified in Notes)</option>
                </select>
              </div>

              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-4 py-3 text-sm focus:outline-none rounded-xl min-h-[44px] border ${
                    isDark 
                      ? 'bg-[#071F16] border-[#16382A] text-[#EDEDED] placeholder-[#EDEDED]/40 focus:border-[#B8954A]' 
                      : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#1E5631]'
                  }`}
                />
              </div>

              {/* Custom Notes */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Notes or Custom Cut Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prefer prime fleshy body cuts, extra clean crayfish packaging..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className={`w-full px-4 py-3 text-sm focus:outline-none rounded-xl border ${
                    isDark 
                      ? 'bg-[#071F16] border-[#16382A] text-[#EDEDED] placeholder-[#EDEDED]/40 focus:border-[#B8954A]' 
                      : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#1E5631]'
                  }`}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-tactile btn-whatsapp-gold w-full inline-flex items-center justify-center gap-3 py-4 px-6 text-[#071F16] text-xs font-bold tracking-[0.2em] uppercase shadow-lg cursor-pointer group rounded-xl"
              >
                <Send className="w-4 h-4 text-[#071F16]" />
                <span>Send via WhatsApp ({settings.whatsappNumberDisplay})</span>
              </button>

            </form>
          </div>

          {/* Right Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* WhatsApp Direct Card */}
            <div className={`p-6 sm:p-8 space-y-4 rounded-2xl border shadow-lg ${
              isDark 
                ? 'bg-[#0D3325] text-[#EDEDED] border-[#16382A]' 
                : 'bg-[#0D3325] text-white border-[#16382A]'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-[#B8954A] text-[#071F16] flex items-center justify-center rounded-xl font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-sans-clean uppercase tracking-[0.3em] text-[#B8954A] font-semibold block">
                    Primary Channel
                  </span>
                  <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#EDEDED]">
                    WhatsApp Direct
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#EDEDED]/80 font-sans-clean font-light leading-relaxed">
                Fastest response for real-time stock availability, custom cut selections, and instant price confirmations.
              </p>

              <div className="pt-1">
                <a
                  href={defaultWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#B8954A] hover:text-[#C9A75E] transition-colors py-1 cursor-pointer"
                >
                  <span>Chat with {settings.whatsappNumberDisplay}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Direct Phone Call */}
            <div className={`p-5 sm:p-6 space-y-2 rounded-2xl border ${
              isDark
                ? 'bg-[#0D3325]/80 border-[#16382A]'
                : 'bg-white border-[#E5E7EB]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl border ${
                  isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                }`}>
                  <Phone className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                </div>
                <div>
                  <span className={`text-[9px] font-sans-clean uppercase tracking-[0.25em] ${
                    isDark ? 'text-[#EDEDED]/60' : 'text-[#525252]'
                  }`}>
                    Telephone
                  </span>
                  <h4 className={`font-editorial text-lg sm:text-xl font-bold ${
                    isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                  }`}>
                    Voice Calls
                  </h4>
                </div>
              </div>
              <p className={`text-sm font-sans-clean font-semibold pt-1 ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                <a href={settings.phoneCallUrl} className={`transition-colors ${
                  isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                }`}>
                  {settings.phoneNumberDisplay}
                </a>
              </p>
            </div>

            {/* Email Contact */}
            <div className={`p-5 sm:p-6 space-y-2 rounded-2xl border ${
              isDark
                ? 'bg-[#0D3325]/80 border-[#16382A]'
                : 'bg-white border-[#E5E7EB]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl border ${
                  isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                }`}>
                  <Mail className={`w-4 h-4 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                </div>
                <div>
                  <span className={`text-[9px] font-sans-clean uppercase tracking-[0.25em] ${
                    isDark ? 'text-[#EDEDED]/60' : 'text-[#525252]'
                  }`}>
                    Electronic Mail
                  </span>
                  <h4 className={`font-editorial text-lg sm:text-xl font-bold ${
                    isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                  }`}>
                    Email Desk
                  </h4>
                </div>
              </div>
              <p className={`text-sm font-sans-clean font-semibold pt-1 ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                <a href={`mailto:${settings.email}`} className={`transition-colors ${
                  isDark ? 'hover:text-[#B8954A]' : 'hover:text-[#1E5631]'
                }`}>
                  {settings.email}
                </a>
              </p>
            </div>

            {/* Service Standard */}
            <div className={`p-5 border space-y-1.5 rounded-2xl ${
              isDark
                ? 'bg-[#0D3325]/80 border-[#16382A]'
                : 'bg-white border-[#E5E7EB]'
            }`}>
              <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] block ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                Our Standard
              </span>
              <p className={`text-xs font-sans-clean leading-relaxed ${
                isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
              }`}>
                Every order is inspected and confirmed directly before packaging. Inquiries receive attention during standard operating hours.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
