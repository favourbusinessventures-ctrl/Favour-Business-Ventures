import React from 'react';
import { 
  ShoppingBag, 
  Star, 
  Clock, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Activity
} from 'lucide-react';
import { AdminOrder, AdminReview, AdminTab } from '../../types';

interface ActivityItem {
  id: string;
  type: 'order_new' | 'order_update' | 'review_new' | 'review_approved';
  title: string;
  subtitle: string;
  timestamp: string;
  dateObj: Date;
  statusBadge?: {
    label: string;
    color: string;
  };
  linkTab: AdminTab;
}

interface RecentActivityFeedProps {
  orders: AdminOrder[];
  reviews: AdminReview[];
  onNavigateTab: (tab: AdminTab) => void;
  maxItems?: number;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  orders,
  reviews,
  onNavigateTab,
  maxItems = 8
}) => {
  // Aggregate events from orders and reviews
  const events: ActivityItem[] = [];

  // Order events
  orders.forEach((o) => {
    const dateObj = new Date(o.createdAt);
    const isValidDate = !isNaN(dateObj.getTime());
    const finalDate = isValidDate ? dateObj : new Date();

    if (o.status === 'new') {
      events.push({
        id: `ord-new-${o.id}`,
        type: 'order_new',
        title: `New Inquiry from ${o.customerName}`,
        subtitle: `${o.productName} • ${o.option || 'Standard Cut'} (Qty: ${o.quantity || '1'})`,
        timestamp: o.createdAt,
        dateObj: finalDate,
        statusBadge: {
          label: 'New Lead',
          color: 'bg-blue-950/70 text-blue-300 border-blue-800/40'
        },
        linkTab: 'orders'
      });
    } else {
      events.push({
        id: `ord-upd-${o.id}`,
        type: 'order_update',
        title: `Inquiry #${o.id.slice(-4)} (${o.customerName})`,
        subtitle: `Status: ${o.status.toUpperCase()} • ${o.productName}`,
        timestamp: o.updatedAt || o.createdAt,
        dateObj: o.updatedAt ? new Date(o.updatedAt) : finalDate,
        statusBadge: {
          label: o.status.toUpperCase(),
          color: o.status === 'confirmed' || o.status === 'completed'
            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40'
            : 'bg-amber-950/70 text-amber-300 border-amber-800/40'
        },
        linkTab: 'orders'
      });
    }
  });

  // Review events
  reviews.forEach((r) => {
    const dateObj = new Date(r.createdAt);
    const isValidDate = !isNaN(dateObj.getTime());
    const finalDate = isValidDate ? dateObj : new Date();

    if (r.status === 'pending') {
      events.push({
        id: `rev-pen-${r.id}`,
        type: 'review_new',
        title: `New Review by ${r.customerName}`,
        subtitle: `Rated ${r.rating}★: "${r.reviewTitle || r.comment.slice(0, 40)}..."`,
        timestamp: r.createdAt,
        dateObj: finalDate,
        statusBadge: {
          label: 'Pending Approval',
          color: 'bg-amber-950/70 text-amber-300 border-amber-800/40'
        },
        linkTab: 'reviews'
      });
    } else if (r.status === 'approved') {
      events.push({
        id: `rev-app-${r.id}`,
        type: 'review_approved',
        title: `Verified Review Published`,
        subtitle: `${r.customerName} (${r.location || 'Customer'}) • ${r.rating}★`,
        timestamp: r.updatedAt || r.createdAt,
        dateObj: r.updatedAt ? new Date(r.updatedAt) : finalDate,
        statusBadge: {
          label: 'Published',
          color: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40'
        },
        linkTab: 'reviews'
      });
    }
  });

  // Sort newest first
  events.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  const displayEvents = events.slice(0, maxItems);

  // Helper formatting for timestamps
  const formatTimeAgo = (d: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#B8954A]" />
            <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
              Recent Operations & Customer Activity Feed
            </h3>
          </div>
          <p className="text-xs text-[#A3B899] font-sans-clean mt-0.5">
            Chronological audit log of live storefront interactions, inquiries, and customer feedback.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#A3B899] font-sans-clean">
          <Clock className="w-3.5 h-3.5 text-[#B8954A]" />
          <span>Live Synchronized</span>
        </div>
      </div>

      {/* Activity List */}
      {displayEvents.length === 0 ? (
        <div className="text-center py-10 bg-[#071F16] border border-[#16382A] rounded-[2px] text-xs font-sans-clean text-[#6B7266] space-y-1">
          <p>No recent activity records found for this period.</p>
          <p className="text-[11px] text-[#A3B899]">Inquiries and customer reviews will populate here instantly.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayEvents.map((item) => {
            const isOrder = item.type.startsWith('order');
            return (
              <div
                key={item.id}
                onClick={() => onNavigateTab(item.linkTab)}
                className="bg-[#071F16] hover:bg-[#16382A]/50 border border-[#16382A] hover:border-[#B8954A]/40 p-3 sm:p-3.5 rounded-[2px] flex items-center justify-between gap-3 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isOrder 
                      ? 'bg-blue-950/60 border-blue-800/40 text-blue-400' 
                      : 'bg-amber-950/60 border-amber-800/40 text-amber-400'
                  }`}>
                    {isOrder ? <ShoppingBag className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5 fill-current" />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-sans-clean font-semibold text-[#F5F0E6] flex items-center gap-2 truncate">
                      <span className="truncate">{item.title}</span>
                      {item.statusBadge && (
                        <span className={`text-[9.5px] uppercase font-sans-clean tracking-wider font-semibold px-1.5 py-0.2 rounded-[2px] border ${item.statusBadge.color} shrink-0`}>
                          {item.statusBadge.label}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#A3B899] font-sans-clean truncate mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10.5px] font-mono text-[#6B7266]">
                    {formatTimeAgo(item.dateObj)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B7266] group-hover:text-[#B8954A] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
