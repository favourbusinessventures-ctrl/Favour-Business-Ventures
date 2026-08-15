import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, ArrowUpRight, Send, Check } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const [productChoice, setProductChoice] = useState<'Stockfish' | 'Crayfish' | 'Both Stockfish & Crayfish'>('Stockfish');
  const [orderQuantity, setOrderQuantity] = useState('Standard Order');
  const [customerName, setCustomerName] = useState('');
  const [customNote, setCustomNote] = useState('');

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let message = `Hello Favour Business Ventures, I would like to place an order.`;
    message += `\n- Product: ${productChoice}`;
    message += `\n- Quantity / Requirement: ${orderQuantity}`;
    if (customerName.trim()) {
      message += `\n- Name: ${customerName.trim()}`;
    }
    if (customNote.trim()) {
      message += `\n- Notes: ${customNote.trim()}`;
    }
    message += `\n\nPlease share current pricing and availability.`;

    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const defaultWhatsAppUrl = buildWhatsAppUrl(BUSINESS_CONFIG.defaultOrderMessage);

  return (
    <section id="contact-section" className="py-20 sm:py-28 bg-[#faf7f2] border-b border-[#ece6d9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1.5px] bg-[#c59b27]" />
            <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#c59b27]">
              Order & Inquiries
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#122b1e]">
            Connect & Place Your Order
          </h2>
          <p className="text-sm sm:text-base text-[#57534a] font-sans-clean font-light leading-relaxed">
            Direct communication on WhatsApp for current price quotes, product inquiries, and fast fulfillment.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Direct WhatsApp Order Builder */}
          <div className="lg:col-span-7 bg-[#f5f1e8] border border-[#e4ddcf] p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#c59b27]">
                Interactive Order Composer
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122b1e]">
                Prepare Your Order Message
              </h3>
              <p className="text-xs sm:text-sm text-[#57534a] font-sans-clean font-light">
                Select your product interest below to generate a pre-filled WhatsApp message.
              </p>
            </div>

            <form onSubmit={handleSendOrder} className="space-y-5">
              
              {/* Product Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-[#122b1e]">
                  Product Interest
                </label>
                <select
                  value={productChoice}
                  onChange={(e) => setProductChoice(e.target.value as any)}
                  className="w-full px-4 py-3 bg-[#faf7f2] border border-[#d8d0bf] text-[#122b1e] text-sm focus:outline-none focus:border-[#122b1e] rounded-none"
                >
                  <option value="Stockfish">Stockfish (Cuts / Heads / Bulk)</option>
                  <option value="Crayfish">Crayfish (Whole / Pure Ground / Bulk)</option>
                  <option value="Both Stockfish & Crayfish">Both Stockfish & Crayfish Combo</option>
                </select>
              </div>

              {/* Order Scale / Option */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-[#122b1e]">
                  Order Size / Quantity
                </label>
                <select
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf7f2] border border-[#d8d0bf] text-[#122b1e] text-sm focus:outline-none focus:border-[#122b1e] rounded-none"
                >
                  <option value="Standard Retail / Household Order">Standard Retail / Household Order</option>
                  <option value="Catering / Family Volume">Catering / Family Volume</option>
                  <option value="Commercial / Wholesale Bulk Order">Commercial / Wholesale Bulk Order</option>
                  <option value="Custom Quantity (Specify in Notes)">Custom Quantity (Specify in Notes)</option>
                </select>
              </div>

              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-[#122b1e]">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf7f2] border border-[#d8d0bf] text-[#122b1e] text-sm focus:outline-none focus:border-[#122b1e] rounded-none"
                />
              </div>

              {/* Special Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-[#122b1e]">
                  Additional Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please share current price list for prime cuts..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf7f2] border border-[#d8d0bf] text-[#122b1e] text-sm focus:outline-none focus:border-[#122b1e] rounded-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 bg-[#122b1e] hover:bg-[#0b1c13] text-[#faf7f2] text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-200 shadow-sm cursor-pointer group"
              >
                <Send className="w-4 h-4 text-[#c59b27]" />
                <span>Send Order via WhatsApp ({BUSINESS_CONFIG.whatsappNumberDisplay})</span>
              </button>

            </form>
          </div>

          {/* Right Column: Contact Channels & Business Card */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* WhatsApp Card */}
              <div className="p-6 sm:p-8 bg-[#122b1e] text-[#faf7f2] border border-[#0b1c13] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c59b27] text-[#122b1e] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#c59b27] font-semibold">
                      Primary Channel
                    </span>
                    <h4 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                      WhatsApp Direct
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#c8d4cc] font-sans-clean font-light leading-relaxed">
                  Fastest response for real-time inquiries, product availability, and custom orders.
                </p>

                <div className="pt-2">
                  <a
                    href={defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-[#c59b27] hover:underline"
                  >
                    <span>Message {BUSINESS_CONFIG.whatsappNumberDisplay}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Direct Phone Call */}
              <div className="p-6 bg-[#f5f1e8] border border-[#e4ddcf] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#e8e2d5] text-[#122b1e] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#8a8477]">
                      Voice Calls
                    </span>
                    <h4 className="font-editorial text-lg font-bold text-[#122b1e]">
                      Phone Inquiries
                    </h4>
                  </div>
                </div>
                <p className="text-sm font-sans-clean text-[#122b1e] font-semibold">
                  <a href={BUSINESS_CONFIG.phoneCallUrl} className="hover:text-[#c59b27] transition-colors">
                    {BUSINESS_CONFIG.phoneNumberDisplay}
                  </a>
                </p>
              </div>

              {/* Email Contact */}
              <div className="p-6 bg-[#f5f1e8] border border-[#e4ddcf] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#e8e2d5] text-[#122b1e] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#8a8477]">
                      Electronic Mail
                    </span>
                    <h4 className="font-editorial text-lg font-bold text-[#122b1e]">
                      Email Desk
                    </h4>
                  </div>
                </div>
                <p className="text-sm font-sans-clean text-[#122b1e] font-semibold">
                  <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-[#c59b27] transition-colors">
                    {BUSINESS_CONFIG.email}
                  </a>
                </p>
              </div>

            </div>

            {/* Bottom Assurance */}
            <div className="p-5 border border-[#e4ddcf] bg-[#faf7f2] space-y-2">
              <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#c59b27]">
                Customer Commitment
              </span>
              <p className="text-xs text-[#57534a] font-sans-clean leading-relaxed">
                Every inquiry is handled directly to ensure clear communication on product selection, pricing, and fulfillment.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
