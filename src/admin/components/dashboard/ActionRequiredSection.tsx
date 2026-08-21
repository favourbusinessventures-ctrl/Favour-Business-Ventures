import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  Phone,
  ShieldCheck,
  User
} from 'lucide-react';
import { AdminOrder, AdminReview, AdminTab } from '../../types';

interface ActionRequiredSectionProps {
  pendingReviews: AdminReview[];
  newOrders: AdminOrder[];
  onNavigateTab: (tab: AdminTab) => void;
  onQuickWhatsAppReply?: (order: AdminOrder) => void;
}

export const ActionRequiredSection: React.FC<ActionRequiredSectionProps> = ({
  pendingReviews,
  newOrders,
  onNavigateTab,
  onQuickWhatsAppReply
}) => {
  const totalPendingActions = pendingReviews.length + newOrders.length;

  if (totalPendingActions === 0) {
    return (
      <div className="bg-[#0D3325]/80 border border-[#16382A] p-4 sm:p-5 rounded-[2px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-sans-clean font-semibold text-[#F5F0E6] flex items-center gap-2">
              <span>All Queues Clear</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-[2px] border border-emerald-800/40">
                Operations Up To Date
              </span>
            </div>
            <p className="text-[11px] text-[#A3B899] font-sans-clean mt-0.5">
              Zero pending reviews awaiting moderation and all customer inquiries have been acknowledged.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#B8954A] font-sans-clean">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Optimal Response Status</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D3325] border border-amber-800/40 p-5 sm:p-6 rounded-[2px] space-y-4 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/80 via-[#B8954A] to-amber-500/80" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#16382A]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#F5F0E6] flex items-center gap-2">
            <span>Action Required</span>
            <span className="text-xs font-sans-clean font-semibold px-2 py-0.5 rounded-[2px] bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
              {totalPendingActions} item{totalPendingActions > 1 ? 's' : ''}
            </span>
          </h2>
        </div>
        <p className="text-[11px] text-[#A3B899] font-sans-clean">
          Items needing administrator review, moderation, or immediate customer follow-up.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Pending Reviews Queue */}
        {pendingReviews.length > 0 && (
          <div className="bg-[#071F16] border border-amber-800/50 p-4 rounded-[2px] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-sans-clean font-semibold text-[#F5F0E6]">
                    Pending Customer Reviews ({pendingReviews.length})
                  </span>
                </div>
                <span className="text-[10px] font-sans-clean font-semibold text-amber-300 uppercase tracking-wider bg-amber-950/70 px-2 py-0.5 rounded-[2px] border border-amber-800/50">
                  Moderation Required
                </span>
              </div>

              {/* Latest pending review excerpt */}
              {pendingReviews[0] && (
                <div className="bg-[#0D3325]/70 p-3 rounded-[2px] border border-[#16382A] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-sans-clean">
                    <span className="text-[#F5F0E6] font-medium flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#B8954A]" />
                      {pendingReviews[0].customerName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s <= pendingReviews[0].rating
                              ? 'text-[#B8954A] fill-[#B8954A]'
                              : 'text-[#16382A]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#F5F0E6] truncate">
                    "{pendingReviews[0].reviewTitle}"
                  </div>
                  <p className="text-[11px] text-[#A3B899] line-clamp-2 italic">
                    {pendingReviews[0].comment}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateTab('reviews')}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] font-sans-clean font-semibold text-xs tracking-wider uppercase py-2.5 px-4 rounded-[2px] transition-colors cursor-pointer"
            >
              <span>Moderate All Reviews ({pendingReviews.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2. New Uncontacted Inquiries */}
        {newOrders.length > 0 && (
          <div className="bg-[#071F16] border border-blue-800/50 p-4 rounded-[2px] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-sans-clean font-semibold text-[#F5F0E6]">
                    New Inquiries Awaiting Response ({newOrders.length})
                  </span>
                </div>
                <span className="text-[10px] font-sans-clean font-semibold text-blue-300 uppercase tracking-wider bg-blue-950/70 px-2 py-0.5 rounded-[2px] border border-blue-800/50">
                  New Leads
                </span>
              </div>

              {/* Latest new order excerpt */}
              {newOrders[0] && (
                <div className="bg-[#0D3325]/70 p-3 rounded-[2px] border border-[#16382A] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-sans-clean">
                    <span className="text-[#F5F0E6] font-medium flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#B8954A]" />
                      {newOrders[0].customerName}
                    </span>
                    <span className="text-[#A3B899] font-mono text-[10.5px]">
                      {newOrders[0].customerPhone}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#F5F0E6] flex items-center justify-between">
                    <span>{newOrders[0].productName}</span>
                    <span className="text-[#B8954A] font-mono text-[11px]">
                      Qty: {newOrders[0].quantity || '1'}
                    </span>
                  </div>
                  {newOrders[0].customerMessage && (
                    <p className="text-[11px] text-[#A3B899] line-clamp-1 italic">
                      "{newOrders[0].customerMessage}"
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateTab('orders')}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] font-sans-clean font-semibold text-xs tracking-wider uppercase py-2.5 px-4 rounded-[2px] transition-colors cursor-pointer"
            >
              <span>View Inquiries Queue ({newOrders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
