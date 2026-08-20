import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminGallery } from './AdminGallery';
import { AdminOrders } from './AdminOrders';
import { AdminReviews } from './AdminReviews';
import { AdminCustomerCare } from './AdminCustomerCare';
import { AdminSettings } from './AdminSettings';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTab } from './types';
import { Loader2 } from 'lucide-react';

interface AdminRootProps {
  onReturnToStore: () => void;
}

const AdminContent: React.FC<AdminRootProps> = ({ onReturnToStore }) => {
  const { user, adminData, loading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState<boolean>(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#071F16] text-[#F5F0E6] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8954A]" />
        <div className="text-xs font-sans-clean font-semibold tracking-[0.25em] uppercase text-[#A3B899]">
          Verifying Admin Credentials...
        </div>
      </div>
    );
  }

  // Not logged in or not verified admin -> Show Login View
  if (!user || !adminData) {
    return <AdminLogin onReturnToStore={onReturnToStore} />;
  }

  // Authenticated Admin Shell
  return (
    <div className="min-h-screen bg-[#071F16] text-[#F5F0E6] flex flex-col selection:bg-[#B8954A]/30">
      
      {/* Top Admin Header */}
      <AdminHeader 
        onReturnToStore={onReturnToStore}
        onToggleSidebar={() => setSidebarOpenMobile(!sidebarOpenMobile)}
      />

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
          onReturnToStore={onReturnToStore}
        />

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto bg-[#071F16]">
          {currentTab === 'dashboard' && (
            <AdminDashboard 
              onNavigateTab={setCurrentTab}
              onReturnToStore={onReturnToStore}
            />
          )}
          {currentTab === 'products' && (
            <AdminProducts />
          )}
          {currentTab === 'gallery' && (
            <AdminGallery />
          )}
          {currentTab === 'orders' && (
            <AdminOrders />
          )}
          {currentTab === 'reviews' && (
            <AdminReviews />
          )}
          {currentTab === 'customerCare' && (
            <AdminCustomerCare />
          )}
          {currentTab === 'settings' && (
            <AdminSettings />
          )}
        </main>

      </div>

    </div>
  );
};


export const AdminRoot: React.FC<AdminRootProps> = ({ onReturnToStore }) => {
  return (
    <AdminAuthProvider>
      <AdminContent onReturnToStore={onReturnToStore} />
    </AdminAuthProvider>
  );
};
