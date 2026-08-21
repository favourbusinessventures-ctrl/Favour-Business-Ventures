import React from 'react';
import { Star, ThumbsUp, ShieldCheck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { AdminReview } from '../../types';

interface ReviewSentimentAnalyticsProps {
  reviews: AdminReview[];
  loading: boolean;
}

export const ReviewSentimentAnalytics: React.FC<ReviewSentimentAnalyticsProps> = ({
  reviews,
  loading
}) => {
  const total = reviews.length;
  const approved = reviews.filter((r) => r.status === 'approved');
  const pending = reviews.filter((r) => r.status === 'pending');
  const rejected = reviews.filter((r) => r.status === 'rejected');

  // Star counts
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let starSum = 0;

  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
    starSum += star;
  });

  const avgRating = total > 0 ? (starSum / total).toFixed(1) : '5.0';
  const positiveReviews = (starCounts[5] || 0) + (starCounts[4] || 0);
  const positivePercentage = total > 0 ? Math.round((positiveReviews / total) * 100) : 100;

  return (
    <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-[#B8954A] text-[#B8954A]" />
            <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
              Customer Ratings & Feedback Sentiment
            </h3>
          </div>
          <p className="text-xs text-[#A3B899] font-sans-clean mt-0.5">
            Breakdown of customer satisfaction scores and moderation distribution.
          </p>
        </div>

        <div className="text-xs font-sans-clean text-[#B8954A] flex items-center gap-1.5 bg-[#071F16] border border-[#16382A] px-2.5 py-1 rounded-[2px]">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{positivePercentage}% Positive</span>
        </div>
      </div>

      {/* Main Score Hero & Moderation Status Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Average Score */}
        <div className="bg-[#071F16] border border-[#16382A] p-4 rounded-[2px] text-center space-y-1">
          <div className="text-3xl font-editorial font-bold text-[#F5F0E6] flex items-center justify-center gap-1">
            <span>{avgRating}</span>
            <Star className="w-5 h-5 fill-[#B8954A] text-[#B8954A]" />
          </div>
          <div className="text-xs font-sans-clean font-semibold text-[#A3B899]">
            Average Store Score
          </div>
          <div className="text-[10px] text-[#6B7266] font-sans-clean">
            Across {total} total reviews
          </div>
        </div>

        {/* Live Published */}
        <div className="bg-[#071F16] border border-[#16382A] p-4 rounded-[2px] text-center space-y-1">
          <div className="text-3xl font-editorial font-bold text-emerald-400">
            {approved.length}
          </div>
          <div className="text-xs font-sans-clean font-semibold text-emerald-300">
            Approved & Live
          </div>
          <div className="text-[10px] text-[#6B7266] font-sans-clean">
            Visible on customer storefront
          </div>
        </div>

        {/* Moderation Pending */}
        <div className="bg-[#071F16] border border-[#16382A] p-4 rounded-[2px] text-center space-y-1">
          <div className="text-3xl font-editorial font-bold text-amber-400">
            {pending.length}
          </div>
          <div className="text-xs font-sans-clean font-semibold text-amber-300">
            Pending Moderation
          </div>
          <div className="text-[10px] text-[#6B7266] font-sans-clean">
            {pending.length > 0 ? 'Requires admin action' : 'Queue cleared'}
          </div>
        </div>

      </div>

      {/* Star Distribution Progress Bars */}
      <div className="space-y-2.5 pt-2">
        <div className="text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
          Star Rating Distribution
        </div>

        {[5, 4, 3, 2, 1].map((star) => {
          const count = starCounts[star] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-xs font-sans-clean">
              <div className="flex items-center gap-1 w-14 shrink-0 font-medium text-[#F5F0E6]">
                <span>{star}</span>
                <Star className="w-3 h-3 fill-[#B8954A] text-[#B8954A]" />
              </div>

              {/* Progress bar */}
              <div className="flex-1 bg-[#071F16] h-2 rounded-full overflow-hidden border border-[#16382A]">
                <div
                  className="bg-[#B8954A] h-full rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? percentage : 0}%` }}
                />
              </div>

              <div className="w-16 text-right font-mono text-[11px] text-[#A3B899] shrink-0">
                <span>{count} ({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
