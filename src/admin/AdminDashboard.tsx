import React, { useState, useMemo, useCallback } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { useLiveOrders } from '../hooks/useLiveOrders';
import { useAdminReviews } from '../hooks/useAdminReviews';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { AdminTab, AdminOrder, AdminReview } from './types';
import { DateRangeSelector, DateRangeOption } from './components/dashboard/DateRangeSelector';
import { ActionRequiredSection } from './components/dashboard/ActionRequiredSection';
import { KpiOverviewCards } from './components/dashboard/KpiOverviewCards';
import { InquiryFunnelChart } from './components/dashboard/InquiryFunnelChart';
import { ProductDemandAnalytics } from './components/dashboard/ProductDemandAnalytics';
import { ReviewSentimentAnalytics } from './components/dashboard/ReviewSentimentAnalytics';
import { RecentActivityFeed } from './components/dashboard/RecentActivityFeed';
import { QuickNavMatrix } from './components/dashboard/QuickNavMatrix';

interface AdminDashboardProps {
  onNavigateTab?: (tab: AdminTab) => void;
  onReturnToStore?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateTab = () => {},
  onReturnToStore
}) => {
  const { adminData, user } = useAdminAuth();
  
  // Real-time live data hooks from Firestore
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useLiveOrders();
  const { 
    reviews, 
    loading: reviewsLoading, 
    counts: reviewCounts 
  } = useAdminReviews();
  const { products, loading: productsLoading, refetch: refetchProducts } = useLiveProducts();

  // Date range filter state
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Manual refresh handler
  const handleSyncAll = useCallback(async () => {
    setIsRefreshing(true);
    refetchOrders();
    refetchProducts();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, [refetchOrders, refetchProducts]);

  // Filter orders and reviews based on selected date range
  const { filteredOrders, filteredReviews, rangeLabel } = useMemo(() => {
    const now = new Date().getTime();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTime = startOfToday.getTime();

    const isWithinRange = (dateStr?: string): boolean => {
      if (!dateStr || selectedRange === 'all') return true;
      const t = new Date(dateStr).getTime();
      if (isNaN(t)) return true; // Keep fallback if parsing fails

      switch (selectedRange) {
        case 'today':
          return t >= todayTime;
        case '7d':
          return t >= now - 7 * 24 * 60 * 60 * 1000;
        case '30d':
          return t >= now - 30 * 24 * 60 * 60 * 1000;
        case '90d':
          return t >= now - 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    };

    const fOrders = orders.filter((o) => isWithinRange(o.createdAt));
    const fReviews = reviews.filter((r) => isWithinRange(r.createdAt));

    let rLabel = 'All Time';
    if (selectedRange === 'today') rLabel = 'Today';
    else if (selectedRange === '7d') rLabel = 'Last 7 Days';
    else if (selectedRange === '30d') rLabel = 'Last 30 Days';
    else if (selectedRange === '90d') rLabel = 'Last 90 Days';

    return {
      filteredOrders: fOrders,
      filteredReviews: fReviews,
      rangeLabel: rLabel
    };
  }, [orders, reviews, selectedRange]);

  // Urgent action items (unfiltered to ensure zero missed tasks)
  const pendingReviews = useMemo(() => reviews.filter((r) => r.status === 'pending'), [reviews]);
  const newOrders = useMemo(() => orders.filter((o) => o.status === 'new'), [orders]);

  const isLoading = ordersLoading || reviewsLoading || productsLoading;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 selection:bg-[#B8954A]/30">
      
      {/* ── 1. WELCOME & OPERATIONS COMMAND HEADER ── */}
      <div className="bg-[#0D3325] border border-[#16382A] p-6 sm:p-8 rounded-[2px] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
                Business Intelligence & Operations
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F0E6]">
              Operations Control Center
            </h1>

            <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean font-light max-w-2xl">
              Live intelligence overview of Norwegian Stockfish & Oron Crayfish inquiries, conversion funnel, customer satisfaction metrics, and moderation queues.
            </p>
          </div>

          {/* Admin Identity Card */}
          <div className="bg-[#071F16] border border-[#16382A] p-4 rounded-[2px] shrink-0 space-y-2 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans-clean uppercase tracking-wider text-[#6B7266]">
                Signed In As
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs font-sans-clean font-medium text-[#F5F0E6] truncate">
              {adminData?.displayName || user?.email || 'Administrator'}
            </div>
            <div className="flex items-center justify-between text-[11px] font-sans-clean text-[#B8954A] pt-1.5 border-t border-[#16382A]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Verified Admin</span>
              </div>
              <button
                onClick={handleSyncAll}
                disabled={isRefreshing}
                className="text-[#A3B899] hover:text-[#B8954A] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 text-[10.5px]"
                title="Synchronize Firestore Data"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. DATE RANGE SELECTOR ── */}
      <DateRangeSelector
        selectedRange={selectedRange}
        onSelectRange={setSelectedRange}
        filteredCountDescription={`${filteredOrders.length} Inquiries, ${filteredReviews.length} Reviews`}
      />

      {/* ── 3. ACTION REQUIRED SECTION (Pending Reviews & New Inquiries) ── */}
      <ActionRequiredSection
        pendingReviews={pendingReviews}
        newOrders={newOrders}
        onNavigateTab={onNavigateTab}
      />

      {/* ── 4. KEY PERFORMANCE INDICATOR (KPI) CARDS ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#B8954A]" />
            <h2 className="text-xs font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
              Executive Business Metrics ({rangeLabel})
            </h2>
          </div>
          <span className="text-[11px] text-[#6B7266] font-sans-clean hidden sm:inline">
            Real-time calculations from verified Firestore records
          </span>
        </div>

        <KpiOverviewCards
          orders={filteredOrders}
          reviews={filteredReviews}
          totalProductsCount={products.length}
          loading={isLoading}
          dateRangeLabel={rangeLabel}
        />
      </div>

      {/* ── 5. DEEP BUSINESS INTELLIGENCE GRIDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inquiry Funnel & Lead Sources */}
        <InquiryFunnelChart
          orders={filteredOrders}
          loading={ordersLoading}
        />

        {/* Right: Product Demand & Category Split */}
        <ProductDemandAnalytics
          orders={filteredOrders}
          products={products}
          loading={productsLoading}
        />
      </div>

      {/* ── 6. CUSTOMER REVIEWS & SENTIMENT ANALYTICS ── */}
      <ReviewSentimentAnalytics
        reviews={filteredReviews}
        loading={reviewsLoading}
      />

      {/* ── 7. RECENT OPERATIONS AUDIT STREAM & ACTIVITY FEED ── */}
      <RecentActivityFeed
        orders={orders}
        reviews={reviews}
        onNavigateTab={onNavigateTab}
      />

      {/* ── 8. MANAGEMENT MODULES & QUICK ACCESS MATRIX ── */}
      <QuickNavMatrix
        onNavigateTab={onNavigateTab}
        pendingReviewsCount={reviewCounts.pending}
        newOrdersCount={newOrders.length}
        totalProductsCount={products.length}
      />

      {/* ── 9. STOREFRONT QUICK LINK ── */}
      {onReturnToStore && (
        <div className="p-4 bg-[#071F16] border border-[#16382A] rounded-[2px] flex items-center justify-between text-xs font-sans-clean text-[#A3B899]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B8954A]" />
            <span>Favour Business Ventures Admin Console • Real-Time Business Intelligence Active</span>
          </div>
          <button
            onClick={onReturnToStore}
            className="text-[#B8954A] hover:text-[#C9A55B] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
