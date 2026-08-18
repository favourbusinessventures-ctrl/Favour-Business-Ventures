import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, ArrowUpRight, Send } from 'lucide-react';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const { settings } = useBusinessSettings();
  const [productChoice, setProductChoice] = useState<'Stockfish' | 'Crayfish' | 'Both Stockfish & Crayfish'>('Stockfish');
  const [orderQuantity, setOrderQuantity] = useState('Standard Retail / Household Portion');
  const [customerName, setCustomerName] = useState('');
  const [customNote, setCustomNote] = useState('');

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = `Hello ${settings.shortName || 'Favour Business Ventures'}, I would like to place an order.\n\n`;
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
    <section id="contact-section" className="py-16 sm:py-24 lg:py-32 bg-[#F5F0E6] text-[#071F16] border-b border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 space-y-12 sm:space-y-20">
        
        {/* Powerful Section Banner / Header */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.35em] uppercase text-[#B8954A]">
              Direct Inquiries
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#071F16] leading-[0.98]">
            Ready to order?
          </h2>

          <p className="font-editorial italic text-xl sm:text-3xl text-[#6B7266]">
            Tell us what you need.
          </p>

          <p className="text-sm sm:text-base text-[#6B7266] font-sans-clean font-light leading-relaxed">
            Choose what you need. Send your order. We'll take it from there. Direct WhatsApp communication for transparent quotes and swift fulfillment.
          </p>
        </div>

        {/* 2-Column Split: Custom Order Builder & Direct Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Order Composer */}
          <div className="lg:col-span-7 bg-[#FFF9EF] border border-[#E5DEC9] p-6 sm:p-10 space-y-6 sm:space-y-8 shadow-sm rounded-[2px]">
            <div className="space-y-2 border-b border-[#E5DEC9] pb-5">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.3em] text-[#B8954A]">
                Order Composer
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#071F16]">
                Format Your WhatsApp Message
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7266] font-sans-clean font-light">
                Select your required products to generate a clear, pre-filled WhatsApp inquiry.
              </p>
            </div>

            <form onSubmit={handleSendOrder} className="space-y-5">
              
              {/* Product Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#071F16]">
                  Select Product
                </label>
                <select
                  value={productChoice}
                  onChange={(e) => setProductChoice(e.target.value as any)}
                  className="w-full px-4 py-3.5 bg-[#F5F0E6] border border-[#E5DEC9] text-[#071F16] text-sm focus:outline-none focus:border-[#071F16] rounded-[2px] cursor-pointer min-h-[44px]"
                >
                  <option value="Stockfish">Stockfish (Cuts / Heads / Bulk Packs)</option>
                  <option value="Crayfish">Crayfish (Whole Sun-Dried / Pure Ground Powder)</option>
                  <option value="Both Stockfish & Crayfish">Stockfish & Crayfish Combination</option>
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#071F16]">
                  Order Quantity / Purpose
                </label>
                <select
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#F5F0E6] border border-[#E5DEC9] text-[#071F16] text-sm focus:outline-none focus:border-[#071F16] rounded-[2px] cursor-pointer min-h-[44px]"
                >
                  <option value="Standard Retail / Household Portion">Standard Retail / Household Portion</option>
                  <option value="Family / Event Volume">Family Gathering / Event Volume</option>
                  <option value="Commercial Catering / Vendor Supply">Commercial Catering / Vendor Supply</option>
                  <option value="Custom Quantity (Specified in Notes)">Custom Quantity (Specified in Notes)</option>
                </select>
              </div>

              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#071F16]">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F0E6] border border-[#E5DEC9] text-[#071F16] text-sm focus:outline-none focus:border-[#071F16] rounded-[2px] min-h-[44px]"
                />
              </div>

              {/* Custom Notes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#071F16]">
                  Notes or Custom Cut Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prefer prime fleshy body cuts, extra clean crayfish packaging..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F0E6] border border-[#E5DEC9] text-[#071F16] text-sm focus:outline-none focus:border-[#071F16] rounded-[2px]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-tactile w-full inline-flex items-center justify-center gap-3 py-4 px-6 bg-[#071F16] hover:bg-[#0D3325] text-[#F5F0E6] border border-[#B8954A]/40 text-xs font-semibold tracking-[0.2em] uppercase shadow-md cursor-pointer group rounded-[2px]"
              >
                <Send className="w-4 h-4 text-[#B8954A]" />
                <span>Send via WhatsApp ({settings.whatsappNumberDisplay})</span>
              </button>

            </form>
          </div>

          {/* Right Column: Direct Channels in Deep Luxury Green */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* WhatsApp Direct Card */}
            <div className="p-6 sm:p-8 bg-[#071F16] text-[#F5F0E6] border border-[#16382A] space-y-4 rounded-[2px] shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-[#B8954A] text-[#071F16] flex items-center justify-center rounded-[1px]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-sans-clean uppercase tracking-[0.3em] text-[#B8954A] font-semibold block">
                    Primary Channel
                  </span>
                  <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F0E6]">
                    WhatsApp Direct
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#F5F0E6]/80 font-sans-clean font-light leading-relaxed">
                Fastest response for real-time stock availability, custom cut selections, and instant price confirmations.
              </p>

              <div className="pt-1">
                <a
                  href={defaultWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#B8954A] hover:text-[#C9A75E] transition-colors py-1"
                >
                  <span>Chat with {settings.whatsappNumberDisplay}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Direct Phone Call */}
            <div className="p-5 sm:p-6 bg-[#FFF9EF] border border-[#E5DEC9] space-y-2 rounded-[2px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#F5F0E6] text-[#071F16] flex items-center justify-center border border-[#E5DEC9]">
                  <Phone className="w-4 h-4 text-[#B8954A]" />
                </div>
                <div>
                  <span className="text-[9px] font-sans-clean uppercase tracking-[0.25em] text-[#6B7266]">
                    Telephone
                  </span>
                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#071F16]">
                    Voice Calls
                  </h4>
                </div>
              </div>
              <p className="text-sm font-sans-clean text-[#071F16] font-semibold pt-1">
                <a href={settings.phoneCallUrl} className="hover:text-[#B8954A] transition-colors">
                  {settings.phoneNumberDisplay}
                </a>
              </p>
            </div>

            {/* Email Contact */}
            <div className="p-5 sm:p-6 bg-[#FFF9EF] border border-[#E5DEC9] space-y-2 rounded-[2px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#F5F0E6] text-[#071F16] flex items-center justify-center border border-[#E5DEC9]">
                  <Mail className="w-4 h-4 text-[#B8954A]" />
                </div>
                <div>
                  <span className="text-[9px] font-sans-clean uppercase tracking-[0.25em] text-[#6B7266]">
                    Electronic Mail
                  </span>
                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#071F16]">
                    Email Desk
                  </h4>
                </div>
              </div>
              <p className="text-sm font-sans-clean text-[#071F16] font-semibold pt-1">
                <a href={`mailto:${settings.email}`} className="hover:text-[#B8954A] transition-colors">
                  {settings.email}
                </a>
              </p>
            </div>

            {/* Service Standard */}
            <div className="p-5 border border-[#E5DEC9] bg-[#FFF9EF] space-y-1.5 rounded-[2px]">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A] block">
                Our Standard
              </span>
              <p className="text-xs text-[#6B7266] font-sans-clean leading-relaxed">
                Every order is inspected and confirmed directly before packaging. Inquiries receive attention during standard operating hours.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
