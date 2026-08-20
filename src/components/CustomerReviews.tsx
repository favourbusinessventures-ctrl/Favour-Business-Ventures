import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Filter,
  UserCheck
} from 'lucide-react';
import { CustomerReview } from '../types';
import { useLiveReviews } from '../hooks/useLiveReviews';
import { WriteReviewModal } from './WriteReviewModal';

interface CustomerReviewsProps {
  productIdFilter?: string;
  showWriteButton?: boolean;
  className?: string;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  productIdFilter,
  showWriteButton = true,
  className = ''
}) => {
  const { reviews, loading, summary, submitReview } = useLiveReviews(productIdFilter);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeStarFilter, setActiveStarFilter] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Filter reviews based on user selection
  const filteredReviews = reviews.filter((rev) => {
    const matchesCategory =
      activeCategoryFilter === 'all' ||
      (activeCategoryFilter === 'stockfish' && rev.productId.includes('stockfish')) ||
      (activeCategoryFilter === 'crayfish' && rev.productId.includes('crayfish'));

    const matchesStar =
      activeStarFilter === 'all' || Math.round(rev.rating) === activeStarFilter;

    return matchesCategory && matchesStar;
  });

  return (
    <section id="customer-reviews-section" className={`relative overflow-hidden ${className}`}>
      {/* Background ambience */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#0D3325]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#B8954A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-12 sm:space-y-16">
        
        {/* 1. Header & Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#16382A]"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase text-[#B8954A]">
                CUSTOMER RATINGS & EXPERIENCES
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F0E6] leading-tight">
              VERIFIED TASTE & QUALITY
            </h2>

            <p className="text-sm sm:text-base text-[#F5F0E6]/75 font-sans-clean font-light leading-relaxed">
              Authentic feedback from families, commercial restaurant chefs, caterers, and diaspora buyers across Nigeria and abroad.
            </p>
          </div>

          {showWriteButton && (
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="btn-tactile inline-flex items-center gap-2.5 px-6 py-4 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-bold tracking-[0.18em] uppercase rounded-xl transition-all shadow-lg shrink-0 cursor-pointer self-start lg:self-auto group"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#071F16]" />
              <span>Write a Review</span>
            </button>
          )}
        </motion.div>

        {/* 2. Rating Summary Scorecard & Star Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0D3325]/80 backdrop-blur-md border border-[#16382A] rounded-2xl p-6 sm:p-8 shadow-xl"
        >
          {/* Main Average Score Box */}
          <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-3 pb-6 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r border-[#16382A]">
            <div className="text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#B8954A] font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Overall Rating Score</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-5xl sm:text-6xl font-bold text-[#F5F0E6]">
                {summary.averageRating.toFixed(1)}
              </span>
              <span className="text-sm font-sans-clean text-[#A3B899]">/ 5.0</span>
            </div>

            {/* Stars Row */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(summary.averageRating)
                      ? 'text-[#B8954A] fill-[#B8954A]'
                      : 'text-[#16382A]'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-[#A3B899] font-sans-clean pt-1">
              Based on <strong>{summary.totalReviews}</strong> verified customer reviews
            </p>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-2.5 px-0 md:px-4">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = summary.starCounts[starNum as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

              return (
                <div key={starNum} className="flex items-center gap-3 text-xs font-sans-clean">
                  <div className="flex items-center gap-1 w-14 shrink-0 text-[#F5F0E6]/80 text-[11px]">
                    <span>{starNum}</span>
                    <Star className="w-3 h-3 text-[#B8954A] fill-[#B8954A]" />
                  </div>

                  <div className="flex-1 h-2 bg-[#071F16] rounded-full overflow-hidden border border-[#16382A]">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-gradient-to-r from-[#B8954A] to-[#C9A75E] rounded-full transition-all duration-500"
                    />
                  </div>

                  <div className="w-8 text-right text-[11px] text-[#A3B899] font-mono shrink-0">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quality Guarantees Box */}
          <div className="md:col-span-3 flex flex-col justify-center space-y-3.5 pt-6 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-[#16382A]">
            <div className="text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
              Quality Assurance
            </div>

            <div className="space-y-2 text-xs font-sans-clean text-[#F5F0E6]/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8954A] shrink-0" />
                <span>100% Genuine Norwegian Cod</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B8954A] shrink-0" />
                <span>Sand-Free Sun-Cured Crayfish</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#B8954A] shrink-0" />
                <span>Hygienic Sealed Packaging</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="inline-flex items-center p-1 bg-[#0D3325] border border-[#16382A] rounded-xl text-xs font-sans-clean">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-[#B8954A] text-[#071F16] shadow-md'
                  : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'
              }`}
            >
              All Provisions
            </button>
            <button
              onClick={() => setActiveCategoryFilter('stockfish')}
              className={`px-4 py-2 rounded-lg font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === 'stockfish'
                  ? 'bg-[#B8954A] text-[#071F16] shadow-md'
                  : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'
              }`}
            >
              Stockfish
            </button>
            <button
              onClick={() => setActiveCategoryFilter('crayfish')}
              className={`px-4 py-2 rounded-lg font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === 'crayfish'
                  ? 'bg-[#B8954A] text-[#071F16] shadow-md'
                  : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'
              }`}
            >
              Crayfish
            </button>
          </div>

          {/* Star Filter Dropdown / Pills */}
          <div className="flex items-center gap-2 text-xs font-sans-clean">
            <span className="text-[#A3B899] text-[11px] uppercase tracking-wider hidden sm:inline">
              Filter by Stars:
            </span>
            {[
              { label: 'All Stars', val: 'all' },
              { label: '5 Stars', val: 5 },
              { label: '4 Stars', val: 4 },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setActiveStarFilter(opt.val as any)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  activeStarFilter === opt.val
                    ? 'bg-[#16382A] border-[#B8954A] text-[#B8954A] font-semibold'
                    : 'bg-[#0D3325] border-[#16382A] text-[#F5F0E6]/70 hover:border-[#B8954A]/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0D3325] border border-[#16382A] rounded-2xl p-6 h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-[#0D3325] border border-[#16382A] rounded-2xl p-12 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A] mx-auto">
              <Star className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-editorial text-xl font-bold text-[#F5F0E6]">
                No reviews match this filter
              </h3>
              <p className="text-xs text-[#A3B899] font-sans-clean">
                Try selecting "All Provisions" or "All Stars" to view customer experiences.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setActiveStarFilter('all');
              }}
              className="text-xs text-[#B8954A] hover:underline font-sans-clean font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="card-glass-hover bg-[#0D3325]/80 backdrop-blur-md border border-[#16382A] hover:border-[#B8954A]/50 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl group transition-all"
              >
                {/* Card Top: Stars + Verified Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= review.rating
                              ? 'text-[#B8954A] fill-[#B8954A]'
                              : 'text-[#16382A]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Verified Buyer Pill */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#071F16] border border-[#16382A] text-[10px] font-sans-clean font-semibold text-[#B8954A] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-[#B8954A]" />
                      Verified
                    </span>
                  </div>

                  {/* Review Title */}
                  <h4 className="font-editorial text-lg font-bold text-[#F5F0E6] group-hover:text-[#B8954A] transition-colors leading-snug">
                    {review.reviewTitle}
                  </h4>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-[#F5F0E6]/80 font-sans-clean font-light leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                {/* Card Footer: Reviewer Info + Product Tag */}
                <div className="pt-4 border-t border-[#16382A] space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans-clean">
                    <div className="font-semibold text-[#F5F0E6]">
                      {review.customerName}
                    </div>

                    {review.location && (
                      <div className="flex items-center gap-1 text-[11px] text-[#A3B899]">
                        <MapPin className="w-3 h-3 text-[#B8954A]" />
                        <span>{review.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Tag */}
                  <div className="text-[10.5px] font-sans-clean text-[#B8954A] tracking-wider truncate">
                    Item: {review.productName}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Integration */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={submitReview}
        defaultProductId={productIdFilter}
      />
    </section>
  );
};
