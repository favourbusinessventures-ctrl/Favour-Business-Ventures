import React from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  HelpCircle,
  MessageSquare,
  Globe,
  FileText
} from 'lucide-react';
import { AdminOrder } from '../../types';

interface InquiryFunnelChartProps {
  orders: AdminOrder[];
  loading: boolean;
}

export const InquiryFunnelChart: React.FC<InquiryFunnelChartProps> = ({
  orders,
  loading
}) => {
  const total = orders.length;

  const counts = {
    new: orders.filter((o) => o.status === 'new').length,
    contacted: orders.filter((o) => o.status === 'contacted').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length
  };

  const sources = {
    whatsapp: orders.filter((o) => o.source === 'whatsapp').length,
    website: orders.filter((o) => o.source === 'website').length,
    admin: orders.filter((o) => o.source === 'admin').length
  };

  const stages = [
    {
      id: 'new',
      label: '1. New Inquiries',
      count: counts.new,
      color: 'bg-blue-400',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-950/40',
      borderColor: 'border-blue-800/40',
      description: 'Incoming customer leads'
    },
    {
      id: 'contacted',
      label: '2. Contacted',
      count: counts.contacted,
      color: 'bg-amber-400',
      textColor: 'text-amber-300',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-800/40',
      description: 'Pricing & options discussed'
    },
    {
      id: 'confirmed',
      label: '3. Confirmed',
      count: counts.confirmed,
      color: 'bg-emerald-400',
      textColor: 'text-emerald-300',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-800/40',
      description: 'Waybill & payment agreed'
    },
    {
      id: 'completed',
      label: '4. Delivered',
      count: counts.completed,
      color: 'bg-[#B8954A]',
      textColor: 'text-[#B8954A]',
      bgColor: 'bg-[#16382A]/70',
      borderColor: 'border-[#B8954A]/40',
      description: 'Fulfilled & delivered'
    },
    {
      id: 'cancelled',
      label: '5. Cancelled',
      count: counts.cancelled,
      color: 'bg-red-400',
      textColor: 'text-red-300',
      bgColor: 'bg-red-950/40',
      borderColor: 'border-red-800/40',
      description: 'Voided or out of scope'
    }
  ];

  return (
    <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#B8954A]" />
            <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
              Inquiry & Fulfillment Pipeline
            </h3>
          </div>
          <p className="text-xs text-[#A3B899] font-sans-clean mt-0.5">
            Stage-by-stage progression from initial lead to confirmed delivery.
          </p>
        </div>

        <div className="text-xs font-sans-clean text-[#6B7266] flex items-center gap-2">
          <span>Total Records: <strong className="text-[#F5F0E6]">{total}</strong></span>
        </div>
      </div>

      {/* Stage Flow Chart */}
      <div className="space-y-3.5">
        {stages.map((st) => {
          const percentage = total > 0 ? Math.round((st.count / total) * 100) : 0;
          return (
            <div key={st.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-sans-clean">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${st.textColor}`}>
                    {st.label}
                  </span>
                  <span className="text-[10.5px] text-[#6B7266] hidden sm:inline">
                    — {st.description}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-[#F5F0E6]">{st.count}</span>
                  <span className="text-[11px] text-[#A3B899]">({percentage}%)</span>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="w-full bg-[#071F16] h-2.5 rounded-full overflow-hidden border border-[#16382A] p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${st.color}`}
                  style={{ width: `${total > 0 ? Math.max(3, percentage) : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Acquisition Channels Breakdown */}
      <div className="pt-4 border-t border-[#16382A] space-y-3">
        <div className="text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
          Inbound Lead Sources
        </div>

        <div className="grid grid-cols-3 gap-3">
          
          {/* WhatsApp */}
          <div className="bg-[#071F16] border border-[#16382A] p-3 rounded-[2px] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-sans-clean font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </div>
            <div className="text-xl font-editorial font-bold text-[#F5F0E6]">
              {sources.whatsapp}
            </div>
            <div className="text-[10px] text-[#6B7266] font-sans-clean">
              {total > 0 ? `${Math.round((sources.whatsapp / total) * 100)}%` : '0%'} of volume
            </div>
          </div>

          {/* Storefront Website */}
          <div className="bg-[#071F16] border border-[#16382A] p-3 rounded-[2px] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-blue-400 text-xs font-sans-clean font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </div>
            <div className="text-xl font-editorial font-bold text-[#F5F0E6]">
              {sources.website}
            </div>
            <div className="text-[10px] text-[#6B7266] font-sans-clean">
              {total > 0 ? `${Math.round((sources.website / total) * 100)}%` : '0%'} of volume
            </div>
          </div>

          {/* Admin Log */}
          <div className="bg-[#071F16] border border-[#16382A] p-3 rounded-[2px] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[#B8954A] text-xs font-sans-clean font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>Admin Log</span>
            </div>
            <div className="text-xl font-editorial font-bold text-[#F5F0E6]">
              {sources.admin}
            </div>
            <div className="text-[10px] text-[#6B7266] font-sans-clean">
              {total > 0 ? `${Math.round((sources.admin / total) * 100)}%` : '0%'} of volume
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
