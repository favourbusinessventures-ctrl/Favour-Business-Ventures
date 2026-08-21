import React from 'react';
import { Package, TrendingUp, Sparkles, Tag, PieChart } from 'lucide-react';
import { AdminOrder } from '../../types';
import { ProductDetail } from '../../../types';

interface ProductDemandAnalyticsProps {
  orders: AdminOrder[];
  products: ProductDetail[];
  loading: boolean;
}

export const ProductDemandAnalytics: React.FC<ProductDemandAnalyticsProps> = ({
  orders,
  products,
  loading
}) => {
  const totalOrders = orders.length;

  // 1. Category demand
  const stockfishOrders = orders.filter((o) => o.category === 'stockfish').length;
  const crayfishOrders = orders.filter((o) => o.category === 'crayfish').length;

  const stockfishPct = totalOrders > 0 ? Math.round((stockfishOrders / totalOrders) * 100) : 50;
  const crayfishPct = totalOrders > 0 ? Math.round((crayfishOrders / totalOrders) * 100) : 50;

  // 2. Count mentions of options or product names
  const optionCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const key = o.option?.trim() || o.productName?.trim() || 'Standard Cut';
    optionCounts[key] = (optionCounts[key] || 0) + 1;
  });

  // Convert to sorted array
  const topOptions = Object.entries(optionCounts)
    .map(([name, count]) => ({
      name,
      count,
      pct: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#B8954A]" />
            <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
              Product Demand & Category Ranking
            </h3>
          </div>
          <p className="text-xs text-[#A3B899] font-sans-clean mt-0.5">
            Customer interest distribution between Norwegian Stockfish and Oron Crayfish.
          </p>
        </div>

        <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-[2px]">
          Demand Live
        </div>
      </div>

      {/* Category Split Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-sans-clean">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8954A]" />
            <span className="font-semibold text-[#F5F0E6]">Norwegian Stockfish</span>
            <span className="text-[#A3B899] font-mono">({stockfishOrders} inquiries • {stockfishPct}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#A3B899] font-mono">({crayfishOrders} inquiries • {crayfishPct}%)</span>
            <span className="font-semibold text-emerald-400">Oron Crayfish</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Dual Color Meter */}
        <div className="w-full h-3 bg-[#071F16] rounded-full overflow-hidden flex border border-[#16382A]">
          <div
            className="bg-[#B8954A] h-full transition-all duration-500"
            style={{ width: `${totalOrders > 0 ? stockfishPct : 50}%` }}
            title={`Stockfish: ${stockfishPct}%`}
          />
          <div
            className="bg-emerald-400 h-full transition-all duration-500"
            style={{ width: `${totalOrders > 0 ? crayfishPct : 50}%` }}
            title={`Crayfish: ${crayfishPct}%`}
          />
        </div>
      </div>

      {/* Top Requested Options List */}
      <div className="space-y-3 pt-2">
        <div className="text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
          Top Requested Package Cuts & Portions
        </div>

        {topOptions.length === 0 ? (
          <div className="text-center py-6 bg-[#071F16] border border-[#16382A] rounded-[2px] text-xs font-sans-clean text-[#6B7266]">
            No specific cut selections logged yet. Inquiries are tracked in real-time.
          </div>
        ) : (
          <div className="space-y-2.5">
            {topOptions.map((opt, idx) => (
              <div
                key={opt.name}
                className="bg-[#071F16] p-3 rounded-[2px] border border-[#16382A] flex items-center justify-between gap-3 text-xs font-sans-clean"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0D3325] border border-[#16382A] text-[10px] font-mono font-bold text-[#B8954A] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-[#F5F0E6] block">
                      {opt.name}
                    </span>
                    <span className="text-[10.5px] text-[#A3B899]">
                      Requested across {opt.count} customer inquiries
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <span className="text-sm font-bold text-[#F5F0E6]">{opt.count}</span>
                  <span className="text-[11px] text-[#A3B899] ml-1">({opt.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
