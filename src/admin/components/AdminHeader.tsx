import React from 'react';
import { useAdminAuth } from '../AdminAuthContext';
import { LogOut, ExternalLink, ShieldCheck, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onReturnToStore: () => void;
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onReturnToStore, onToggleSidebar }) => {
  const { adminData, logout } = useAdminAuth();

  return (
    <header className="h-16 bg-[#0D3325] border-b border-[#16382A] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Mobile Sidebar Toggle & Branding */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-[#A3B899] hover:text-[#F5F0E6] transition-colors rounded-[2px]"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[2px] bg-[#071F16] border border-[#B8954A]/40 flex items-center justify-center text-[#B8954A]">
            <span className="font-editorial text-lg font-bold">F</span>
          </div>
          <div>
            <div className="font-editorial text-base font-bold text-[#F5F0E6] tracking-wide leading-none">
              FAVORA
            </div>
            <div className="text-[9px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-[#B8954A] mt-0.5">
              Control Panel
            </div>
          </div>
        </div>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Customer Store Link */}
        <button
          onClick={onReturnToStore}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans-clean text-[#A3B899] hover:text-[#B8954A] transition-colors py-1.5 px-2.5 rounded-[2px] border border-[#16382A] bg-[#071F16]/50"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Public Store</span>
        </button>

        {/* Admin User Chip */}
        <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-[#16382A]">
          <div className="hidden lg:block text-right">
            <div className="text-xs font-sans-clean font-medium text-[#F5F0E6] truncate max-w-[180px]">
              {adminData?.email}
            </div>
            <div className="text-[9px] font-sans-clean text-[#B8954A] uppercase tracking-wider flex items-center justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Admin</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-1.5 text-xs font-sans-clean font-medium text-[#F5F0E6] bg-[#071F16] hover:bg-red-950/40 hover:text-red-300 border border-[#16382A] hover:border-red-800/50 py-1.5 px-3 rounded-[2px] transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>

    </header>
  );
};
