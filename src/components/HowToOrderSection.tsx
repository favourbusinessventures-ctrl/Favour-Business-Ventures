import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, CheckCircle, MessageCircle, Eye } from 'lucide-react';

export const HowToOrderSection: React.FC = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      num: '01',
      title: 'Choose Your Provisions',
      description: 'Select from our authentic Norwegian stockfish cuts and fresh Oron crayfish.',
      icon: Eye,
    },
    {
      num: '02',
      title: 'Add to Cart',
      description: 'Choose your desired cut format, pack size, and portion quantities.',
      icon: ShoppingBag,
    },
    {
      num: '03',
      title: 'Review Selection',
      description: 'Check your items in the quick-cart drawer and add any waybill notes.',
      icon: CheckCircle,
    },
    {
      num: '04',
      title: 'Direct WhatsApp Dispatch',
      description: 'Send your structured order list for fast price confirmation and dispatch.',
      icon: MessageCircle,
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 transition-colors duration-300 ${
        isDark
          ? 'bg-[#0D3325]/70 border-[#16382A] text-[#EDEDED]'
          : 'bg-white border-[#E5E7EB] text-[#1A1A1A] shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-inherit">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
            <span
              className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}
            >
              Order Protocol
            </span>
          </div>
          <h3
            className={`font-editorial text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
            }`}
          >
            How to Order with Favour Ventures
          </h3>
        </div>
        <span
          className={`text-xs font-sans-clean font-light sm:text-right max-w-xs ${
            isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
          }`}
        >
          Straightforward provisions ordering with prompt delivery across Nigeria and beyond.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                isDark
                  ? 'bg-[#071F16]/70 border-[#16382A]'
                  : 'bg-[#F5F5F0] border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-editorial text-xl font-bold ${
                    isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                  }`}
                >
                  {step.num}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isDark
                      ? 'bg-[#0D3325] border-[#16382A] text-[#B8954A]'
                      : 'bg-white border-[#E5E7EB] text-[#1E5631]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <h4
                  className={`font-editorial text-base font-bold leading-tight ${
                    isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs font-sans-clean font-light leading-relaxed ${
                    isDark ? 'text-[#EDEDED]/70' : 'text-[#525252]'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
