import React from 'react';
import { AdminTab } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  ShoppingBag, 
  Star,
  Headphones,
  Activity,
  Settings, 
  Lock,
  ExternalLink,
  X
} from 'lucide-react';
import { useAdminReviews } from '../../hooks/useAdminReviews';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onReturnToStore: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  badge?: string;
  count?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onReturnToStore
}) => {
  const { counts: reviewCounts } = useAdminReviews();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      enabled: true
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      enabled: true
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: ImageIcon,
      enabled: true
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      enabled: true
    },
    {
      id: 'reviews',
      label: 'Customer Reviews',
      icon: Star,
      enabled: true,
      count: reviewCounts.pending > 0 ? reviewCounts.pending : undefined
    },
    {
      id: 'customerCare',
      label: 'Customer Care',
      icon: Headphones,
      enabled: true
    },
    {
      id: 'systemHealth',
      label: 'System Health',
      icon: Activity,
      enabled: true
    },
    {
      id: 'settings',
      label: 'Business Settings',
      icon: Settings,
      enabled: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static top-0 bottom-0 left-0 z-50 md:z-auto
          w-64 bg-[#0D3325] border-r border-[#16382A] flex flex-col justify-between
          transition-transform duration-300 ease-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Navigation List */}
        <div className="p-4 sm:p-5 space-y-6">
          
          {/* Mobile Header in Drawer */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-[#16382A]">
            <div className="text-xs font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
              Navigation
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 text-[#A3B899] hover:text-[#F5F0E6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#6B7266] px-3 pb-2">
              Management Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              if (!item.enabled) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3.5 py-3 rounded-[2px] text-[#6B7266] opacity-60 cursor-not-allowed select-none bg-[#071F16]/30 border border-transparent"
                    title={`${item.label} will be enabled in future phase`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#6B7266]" />
                      <span className="text-xs font-sans-clean font-medium">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#6B7266]" />
                      {item.badge && (
                        <span className="text-[9px] font-sans-clean uppercase tracking-wider px-1.5 py-0.5 bg-[#16382A] text-[#A3B899] rounded-[2px]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-[2px] transition-all cursor-pointer text-left
                    ${isActive
                      ? 'bg-[#B8954A] text-[#071F16] font-semibold shadow-md'
                      : 'text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A]/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#071F16]' : 'text-[#B8954A]'}`} />
                    <span className="text-xs font-sans-clean">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#071F16] text-[#B8954A]' : 'bg-amber-500 text-[#071F16]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#071F16]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#16382A] space-y-3 bg-[#071F16]/40">
          
          <button
            onClick={onReturnToStore}
            className="w-full flex items-center justify-center gap-2 text-xs font-sans-clean text-[#A3B899] hover:text-[#B8954A] transition-colors py-2 px-3 rounded-[2px] border border-[#16382A] hover:border-[#B8954A]/40 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Customer Storefront</span>
          </button>

          <div className="text-[10px] text-center text-[#6B7266] font-sans-clean">
            Favour Admin v1.1 • Reviews Enabled
          </div>
        </div>

      </aside>
    </>
  );
};

