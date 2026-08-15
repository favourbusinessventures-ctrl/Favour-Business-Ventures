import React from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { 
  ShieldCheck, 
  Package, 
  Image as ImageIcon, 
  ShoppingBag, 
  Clock, 
  Database, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminData, user } = useAdminAuth();

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-[#0D3325] border border-[#16382A] p-6 sm:p-8 rounded-[2px] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
                Secure Administration
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F0E6]">
              Welcome, {adminData?.displayName || 'Administrator'}
            </h1>

            <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean font-light max-w-2xl">
              Favour Business Ventures management console. Authorized control for catalog items, media assets, inquiry logs, and business settings.
            </p>
          </div>

          {/* Account Status Pill */}
          <div className="bg-[#071F16] border border-[#16382A] p-4 rounded-[2px] shrink-0 space-y-2 min-w-[240px]">
            <div className="text-[10px] font-sans-clean uppercase tracking-wider text-[#6B7266]">
              Session Credentials
            </div>
            <div className="text-xs font-sans-clean font-medium text-[#F5F0E6] truncate">
              {user?.email}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-sans-clean text-[#B8954A]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role: Administrator (Firestore Verified)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid of Module Placeholders (Clearly marked empty states) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Product Catalog Card */}
        <div className="bg-[#0D3325] border border-[#16382A] p-6 rounded-[2px] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-sans-clean uppercase tracking-[0.25em] text-[#6B7266] bg-[#071F16] px-2.5 py-1 rounded-[2px] border border-[#16382A]">
                Phase 3 Module
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                Product Catalog
              </h3>
              <p className="text-xs text-[#A3B899] font-sans-clean">
                Stockfish and crayfish item listings, portions, and pricing.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#16382A] text-xs font-sans-clean text-[#6B7266] italic flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>No data available yet.</span>
          </div>
        </div>

        {/* Gallery Media Card */}
        <div className="bg-[#0D3325] border border-[#16382A] p-6 rounded-[2px] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-sans-clean uppercase tracking-[0.25em] text-[#6B7266] bg-[#071F16] px-2.5 py-1 rounded-[2px] border border-[#16382A]">
                Phase 3 Module
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                Gallery Media
              </h3>
              <p className="text-xs text-[#A3B899] font-sans-clean">
                Product photography, bulk stock views, and customer showcases.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#16382A] text-xs font-sans-clean text-[#6B7266] italic flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>No data available yet.</span>
          </div>
        </div>

        {/* Order Inquiries Card */}
        <div className="bg-[#0D3325] border border-[#16382A] p-6 rounded-[2px] flex flex-col justify-between space-y-6 sm:col-span-2 lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-sans-clean uppercase tracking-[0.25em] text-[#6B7266] bg-[#071F16] px-2.5 py-1 rounded-[2px] border border-[#16382A]">
                Phase 3 Module
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                Orders & Inquiries
              </h3>
              <p className="text-xs text-[#A3B899] font-sans-clean">
                WhatsApp inquiry references and administrative order logs.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#16382A] text-xs font-sans-clean text-[#6B7266] italic flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>No data available yet.</span>
          </div>
        </div>

      </div>

      {/* Two Columns: System Status & Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: System Status Overview */}
        <div className="lg:col-span-5 bg-[#0D3325] border border-[#16382A] p-6 rounded-[2px] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#B8954A]" />
              <h3 className="text-xs font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#F5F0E6]">
                Backend Infrastructure
              </h3>
            </div>
            <span className="text-[10px] font-sans-clean text-[#A3B899] bg-[#071F16] px-2 py-0.5 rounded-[2px] border border-[#16382A]">
              Phase 2 Active
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3 p-3 bg-[#071F16] border border-[#16382A] rounded-[2px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-sans-clean font-medium text-[#F5F0E6]">
                  Firebase Authentication
                </div>
                <div className="text-[11px] font-sans-clean text-[#A3B899]">
                  Email/Password authentication with verified admin role gating.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#071F16] border border-[#16382A] rounded-[2px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-sans-clean font-medium text-[#F5F0E6]">
                  Cloud Firestore Database
                </div>
                <div className="text-[11px] font-sans-clean text-[#A3B899]">
                  Provisioned with locked security rules denying unauthorized writes.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#071F16] border border-[#16382A] rounded-[2px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-sans-clean font-medium text-[#F5F0E6]">
                  Storefront Fallback Safety
                </div>
                <div className="text-[11px] font-sans-clean text-[#A3B899]">
                  Customer website remains fully operational independently.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity (Honest empty state) */}
        <div className="lg:col-span-7 bg-[#0D3325] border border-[#16382A] p-6 rounded-[2px] space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B8954A]" />
                <h3 className="text-xs font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#F5F0E6]">
                  Audit & Activity Log
                </h3>
              </div>
              <span className="text-[10px] font-sans-clean text-[#6B7266]">
                Real-Time
              </span>
            </div>

            {/* Empty State */}
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#071F16] border border-[#16382A] mx-auto flex items-center justify-center text-[#6B7266]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-sans-clean font-medium text-[#F5F0E6]">
                  No activity recorded yet.
                </p>
                <p className="text-xs text-[#6B7266] font-sans-clean max-w-sm mx-auto">
                  Activity logs will track product modifications, gallery uploads, and status changes once Phase 3 editing is introduced.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#16382A] text-[11px] font-sans-clean text-[#6B7266] text-right">
            Last session started: {adminData?.lastLoginAt ? new Date(adminData.lastLoginAt).toLocaleTimeString() : 'Just now'}
          </div>
        </div>

      </div>

    </div>
  );
};
