import React from 'react';
import { 
  Package, 
  Star, 
  ShoppingBag, 
  Headphones, 
  Activity, 
  Settings, 
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { AdminTab } from '../../types';

interface QuickNavMatrixProps {
  onNavigateTab: (tab: AdminTab) => void;
  pendingReviewsCount: number;
  newOrdersCount: number;
  totalProductsCount: number;
}

export const QuickNavMatrix: React.FC<QuickNavMatrixProps> = ({
  onNavigateTab,
  pendingReviewsCount,
  newOrdersCount,
  totalProductsCount
}) => {
  const cards: {
    id: AdminTab;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'orders',
      title: 'Customer Inquiries & Orders',
      description: 'Manage sales pipeline, update order statuses, and track customer communication.',
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? `${newOrdersCount} New` : undefined,
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800/50'
    },
    {
      id: 'reviews',
      title: 'Review Moderation Hub',
      description: 'Approve, verify, or manage customer testimonials and star ratings.',
      icon: Star,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Pending` : undefined,
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/50'
    },
    {
      id: 'products',
      title: 'Product Catalog & Pricing',
      description: 'Configure cuts, package sizes, live highlights, and Norwegian/Oron stock details.',
      icon: Package,
      badge: `${totalProductsCount} Active`,
      badgeColor: 'bg-[#16382A] text-[#A3B899] border-[#16382A]'
    },
    {
      id: 'customerCare',
      title: 'Customer Care Assistant',
      description: 'Review knowledge base questions, AI chat logs, and business FAQs.',
      icon: Headphones,
      badge: '24/7 Active',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
    },
    {
      id: 'gallery',
      title: 'Media & Gallery Assets',
      description: 'Manage visual showcases, product photography, and Cloudflare storage.',
      icon: ImageIcon
    },
    {
      id: 'systemHealth',
      title: 'Diagnostics & Health',
      description: 'Real-time uptime checks, database connectivity, and automated fail-safe probes.',
      icon: Activity,
      badge: 'Protected',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
    },
    {
      id: 'settings',
      title: 'Business & Contact Settings',
      description: 'Update phone numbers, WhatsApp lines, physical office addresses, and brand details.',
      icon: Settings
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#16382A]">
        <div>
          <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
            Management Modules & Quick Access
          </h3>
          <p className="text-xs text-[#A3B899] font-sans-clean mt-0.5">
            Direct operational shortcuts across all business administration modules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onNavigateTab(card.id)}
              className="bg-[#0D3325] hover:bg-[#16382A]/70 border border-[#16382A] hover:border-[#B8954A]/50 p-4 sm:p-5 rounded-[2px] text-left flex flex-col justify-between space-y-4 transition-all cursor-pointer group shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A] group-hover:text-[#F5F0E6] group-hover:border-[#B8954A]/50 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  {card.badge && (
                    <span className={`text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-editorial font-bold text-sm text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-[#A3B899] font-sans-clean line-clamp-2 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-sans-clean text-[#6B7266] group-hover:text-[#B8954A] transition-colors border-t border-[#16382A]">
                <span className="font-medium">Open Module</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
