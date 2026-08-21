import React from 'react';
import { Calendar } from 'lucide-react';

export type DateRangeOption = 'all' | 'today' | '7d' | '30d' | '90d';

interface DateRangeSelectorProps {
  selectedRange: DateRangeOption;
  onSelectRange: (range: DateRangeOption) => void;
  filteredCountDescription?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedRange,
  onSelectRange,
  filteredCountDescription
}) => {
  const options: { id: DateRangeOption; label: string; shortLabel: string }[] = [
    { id: 'today', label: 'Today', shortLabel: 'Today' },
    { id: '7d', label: 'Last 7 Days', shortLabel: '7D' },
    { id: '30d', label: 'Last 30 Days', shortLabel: '30D' },
    { id: '90d', label: 'Last 90 Days', shortLabel: '90D' },
    { id: 'all', label: 'All Time', shortLabel: 'All' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#071F16] border border-[#16382A] p-2.5 sm:p-3 rounded-[2px]">
      <div className="flex items-center gap-2 text-xs font-sans-clean text-[#A3B899]">
        <Calendar className="w-3.5 h-3.5 text-[#B8954A]" />
        <span className="font-medium text-[#F5F0E6]">Date Filter:</span>
        {filteredCountDescription && (
          <span className="text-[11px] text-[#6B7266] hidden md:inline">
            ({filteredCountDescription})
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {options.map((opt) => {
          const isActive = selectedRange === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectRange(opt.id)}
              className={`px-3 py-1.5 text-xs font-sans-clean font-medium rounded-[2px] transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#B8954A] text-[#071F16] font-semibold shadow-xs'
                  : 'text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A] border border-transparent'
              }`}
            >
              <span className="hidden sm:inline">{opt.label}</span>
              <span className="sm:hidden">{opt.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
