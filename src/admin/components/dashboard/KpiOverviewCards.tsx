import React from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Star, 
  Package, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  Percent
} from 'lucide-react';
import { AdminOrder, AdminReview } from '../../types';

interface KpiOverviewCardsProps {
  orders: AdminOrder[];
  reviews: AdminReview[];
  totalProductsCount: number;
  loading: boolean;
  dateRangeLabel: string;
}

export const KpiOverviewCards: React.FC<KpiOverviewCardsProps> = ({
  orders,
  reviews,
  totalProductsCount,
  loading,
  dateRangeLabel
}) => {
  // 1. Inquiries metrics
  const totalInquiries = orders.length;
  const newCount = orders.filter((o) => o.status === 'new').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const convertedCount = confirmedCount + completedCount;
  
  // 2. Conversion rate
  const conversionRate = totalInquiries > 0 
    ? Math.round((convertedCount / totalInquiries) * 100) 
    : 0;

  // 3. Review metrics
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  // 4. Primary channel
  const whatsappCount = orders.filter((o) => o.source === 'whatsapp').length;
  const websiteCount = orders.filter((o) => o.source === 'website').length;
  const adminCount = orders.filter((o) => o.source === 'admin').length;
  
  let dominantChannel = 'WhatsApp';
  if (websiteCount > whatsappCount && websiteCount > adminCount) dominantChannel = 'Website';
  else if (adminCount > whatsappCount && adminCount > websiteCount) dominantChannel = 'Admin Log';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* KPI 1: Inquiries & Orders Volume */}
      <div className="bg-[#0D3325] border border-[#16382A] p-5 rounded-[2px] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#B8954A]/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-wider text-[#B8954A] bg-[#071F16] border border-[#16382A] px-2 py-0.5 rounded-[2px]">
            {dateRangeLabel}
          </span>
        </div>

        <div>
          <div className="text-3xl font-editorial font-bold text-[#F5F0E6]">
            {loading ? '—' : totalInquiries}
          </div>
          <div className="text-xs font-sans-clean font-semibold text-[#A3B899] mt-0.5">
            Total Inquiries Received
          </div>
          <div className="text-[11px] font-sans-clean text-[#6B7266] mt-2 flex items-center justify-between pt-2 border-t border-[#16382A]">
            <span>{newCount} pending response</span>
            <span>{convertedCount} confirmed</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Conversion & Confirmation Rate */}
      <div className="bg-[#0D3325] border border-[#16382A] p-5 rounded-[2px] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#B8954A]/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-[2px]">
            Funnel Efficiency
          </span>
        </div>

        <div>
          <div className="text-3xl font-editorial font-bold text-emerald-300 flex items-baseline gap-1">
            <span>{loading ? '—' : `${conversionRate}%`}</span>
            {totalInquiries > 0 && (
              <span className="text-xs font-sans-clean text-[#A3B899] font-normal">
                ({convertedCount}/{totalInquiries})
              </span>
            )}
          </div>
          <div className="text-xs font-sans-clean font-semibold text-[#A3B899] mt-0.5">
            Inquiry Conversion Rate
          </div>
          
          {/* Progress bar */}
          <div className="mt-2.5 pt-2 border-t border-[#16382A] space-y-1">
            <div className="w-full bg-[#071F16] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(5, conversionRate))}%` }}
              />
            </div>
            <div className="text-[10.5px] font-sans-clean text-[#6B7266] flex items-center justify-between">
              <span>Confirmed + Fulfilled</span>
              <span>{completedCount} Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI 3: Store CSAT & Review Sentiment */}
      <div className="bg-[#0D3325] border border-[#16382A] p-5 rounded-[2px] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#B8954A]/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
            <Star className="w-5 h-5 fill-[#B8954A]" />
          </div>
          <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-wider text-[#B8954A] bg-[#071F16] border border-[#16382A] px-2 py-0.5 rounded-[2px]">
            Satisfaction
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-editorial font-bold text-[#F5F0E6]">
              {loading ? '—' : averageRating}
            </span>
            <span className="text-xs font-sans-clean text-[#A3B899]">/ 5.0</span>
          </div>
          <div className="text-xs font-sans-clean font-semibold text-[#A3B899] mt-0.5">
            Average Customer Rating
          </div>
          <div className="text-[11px] font-sans-clean text-[#6B7266] mt-2 flex items-center justify-between pt-2 border-t border-[#16382A]">
            <span>{approvedReviews.length} approved reviews</span>
            <span className="text-emerald-400 font-medium">Verified</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Lead Channel Breakdown */}
      <div className="bg-[#0D3325] border border-[#16382A] p-5 rounded-[2px] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#B8954A]/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-[2px]">
            Top Lead Source
          </span>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-editorial font-bold text-[#F5F0E6] truncate">
            {loading ? '—' : dominantChannel}
          </div>
          <div className="text-xs font-sans-clean font-semibold text-[#A3B899] mt-0.5">
            Dominant Inbound Channel
          </div>
          <div className="text-[11px] font-sans-clean text-[#6B7266] mt-2 flex items-center justify-between pt-2 border-t border-[#16382A]">
            <span>WA: {whatsappCount}</span>
            <span>Web: {websiteCount}</span>
            <span>Admin: {adminCount}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
