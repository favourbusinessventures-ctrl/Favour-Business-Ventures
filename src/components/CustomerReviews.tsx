import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  MapPin, 
  Award, 
  ShieldCheck, 
  UserCheck
} from 'lucide-react';
import { CustomerReview } from '../types';
import { useLiveReviews } from '../hooks/useLiveReviews';
import { useTheme } from '../context/ThemeContext';
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
  const { isDark } = useTheme();

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
      {isDark ? (
        <>
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#0D3325]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#B8954A]/5 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#1E5631]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8A9A5B]/8 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 relative z-10 space-y-12 sm:space-y-16">
        
        {/* 1. Header & Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b ${
            isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
          }`}
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className={`w-6 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
              <span className={`text-[10px] sm:text-[11px] font-sans-clean font-semibold tracking-[0.32em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                CUSTOMER RATINGS & EXPERIENCES
              </span>
            </div>

            <h2 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
            }`}>
              VERIFIED TASTE & QUALITY
            </h2>

            <p className={`text-sm sm:text-base font-sans-clean font-light leading-relaxed ${
              isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
            }`}>
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
          className={`grid grid-cols-1 md:grid-cols-12 gap-6 rounded-2xl p-6 sm:p-8 border shadow-xl transition-all duration-300 ${
            isDark
              ? 'bg-[#0D3325]/80 backdrop-blur-md border-[#16382A]'
              : 'bg-white border-[#E5E7EB]'
          }`}
        >
          {/* Main Average Score Box */}
          <div className={`md:col-span-4 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-3 pb-6 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r ${
            isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
          }`}>
            <div className={`text-[11px] font-sans-clean uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              <Award className="w-4 h-4" />
              <span>Overall Rating Score</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`font-editorial text-5xl sm:text-6xl font-bold ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                {summary.averageRating.toFixed(1)}
              </span>
              <span className={`text-sm font-sans-clean ${
                isDark ? 'text-[#A3B899]' : 'text-[#525252]'
              }`}>/ 5.0</span>
            </div>

            {/* Stars Row */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(summary.averageRating)
                      ? 'text-[#B8954A] fill-[#B8954A]'
                      : isDark ? 'text-[#16382A]' : 'text-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>

            <p className={`text-xs font-sans-clean pt-1 ${
              isDark ? 'text-[#A3B899]' : 'text-[#525252]'
            }`}>
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
                  <div className={`flex items-center gap-1 w-14 shrink-0 text-[11px] ${
                    isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                  }`}>
                    <span>{starNum}</span>
                    <Star className="w-3 h-3 text-[#B8954A] fill-[#B8954A]" />
                  </div>

                  <div className={`flex-1 h-2 rounded-full overflow-hidden border ${
                    isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
                  }`}>
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-gradient-to-r from-[#B8954A] to-[#C9A75E] rounded-full transition-all duration-500"
                    />
                  </div>

                  <div className={`w-8 text-right text-[11px] font-mono shrink-0 ${
                    isDark ? 'text-[#A3B899]' : 'text-[#525252]'
                  }`}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quality Guarantees Box */}
          <div className={`md:col-span-3 flex flex-col justify-center space-y-3.5 pt-6 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l ${
            isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
          }`}>
            <div className={`text-[10.5px] font-sans-clean font-semibold uppercase tracking-[0.2em] ${
              isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
            }`}>
              Quality Assurance
            </div>

            <div className={`space-y-2 text-xs font-sans-clean ${
              isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                <span>100% Genuine Norwegian Cod</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                <span>Sand-Free Sun-Cured Crayfish</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                <span>Hygienic Sealed Packaging</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className={`inline-flex items-center p-1 border rounded-xl text-xs font-sans-clean ${
            isDark ? 'bg-[#0D3325] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
          }`}>
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-[#B8954A] text-[#071F16] shadow-md'
                  : isDark ? 'text-[#EDEDED]/70 hover:text-[#EDEDED]' : 'text-[#525252] hover:text-[#1A1A1A]'
              }`}
            >
              All Provisions
            </button>
            <button
              onClick={() => setActiveCategoryFilter('stockfish')}
              className={`px-4 py-2 rounded-lg font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === 'stockfish'
                  ? 'bg-[#B8954A] text-[#071F16] shadow-md'
                  : isDark ? 'text-[#EDEDED]/70 hover:text-[#EDEDED]' : 'text-[#525252] hover:text-[#1A1A1A]'
              }`}
            >
              Stockfish
            </button>
            <button
              onClick={() => setActiveCategoryFilter('crayfish')}
              className={`px-4 py-2 rounded-lg font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategoryFilter === 'crayfish'
                  ? 'bg-[#B8954A] text-[#071F16] shadow-md'
                  : isDark ? 'text-[#EDEDED]/70 hover:text-[#EDEDED]' : 'text-[#525252] hover:text-[#1A1A1A]'
              }`}
            >
              Crayfish
            </button>
          </div>

          {/* Star Filter Dropdown / Pills */}
          <div className="flex items-center gap-2 text-xs font-sans-clean">
            <span className={`text-[11px] uppercase tracking-wider hidden sm:inline ${
              isDark ? 'text-[#A3B899]' : 'text-[#525252]'
            }`}>
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
                    ? isDark 
                      ? 'bg-[#16382A] border-[#B8954A] text-[#B8954A] font-semibold'
                      : 'bg-[#1E5631] border-[#1E5631] text-white font-semibold'
                    : isDark
                      ? 'bg-[#0D3325] border-[#16382A] text-[#EDEDED]/70 hover:border-[#B8954A]/40'
                      : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:border-[#1E5631]/40'
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
              <div key={i} className={`border rounded-2xl p-6 h-64 animate-pulse ${
                isDark ? 'bg-[#0D3325] border-[#16382A]' : 'bg-white border-[#E5E7EB]'
              }`} />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className={`border rounded-2xl p-12 text-center space-y-4 shadow-xl ${
            isDark ? 'bg-[#0D3325] border-[#16382A]' : 'bg-white border-[#E5E7EB]'
          }`}>
            <div className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto ${
              isDark ? 'bg-[#071F16] border-[#16382A] text-[#B8954A]' : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1E5631]'
            }`}>
              <Star className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className={`font-editorial text-xl font-bold ${
                isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
              }`}>
                No reviews match this filter
              </h3>
              <p className={`text-xs font-sans-clean ${
                isDark ? 'text-[#A3B899]' : 'text-[#525252]'
              }`}>
                Try selecting "All Provisions" or "All Stars" to view customer experiences.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setActiveStarFilter('all');
              }}
              className={`text-xs font-sans-clean font-semibold cursor-pointer ${
                isDark ? 'text-[#B8954A] hover:underline' : 'text-[#1E5631] hover:underline'
              }`}
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
                className={`card-glass-hover rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl group border transition-all duration-300 ${
                  isDark
                    ? 'bg-[#0D3325]/80 backdrop-blur-md border-[#16382A] hover:border-[#B8954A]/50'
                    : 'bg-white border-[#E5E7EB] hover:border-[#1E5631]/40 shadow-md'
                }`}
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
                              : isDark ? 'text-[#16382A]' : 'text-[#E5E7EB]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Verified Buyer Pill */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans-clean font-semibold uppercase tracking-wider border ${
                      isDark
                        ? 'bg-[#071F16] border-[#16382A] text-[#B8954A]'
                        : 'bg-[#F5F5F0] border-[#E5E7EB] text-[#1E5631]'
                    }`}>
                      <CheckCircle2 className={`w-3 h-3 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                      Verified
                    </span>
                  </div>

                  {/* Review Title */}
                  <h4 className={`font-editorial text-lg font-bold transition-colors leading-snug ${
                    isDark
                      ? 'text-[#EDEDED] group-hover:text-[#B8954A]'
                      : 'text-[#1A1A1A] group-hover:text-[#1E5631]'
                  }`}>
                    {review.reviewTitle}
                  </h4>

                  {/* Comment */}
                  <p className={`text-xs sm:text-sm font-sans-clean font-light leading-relaxed ${
                    isDark ? 'text-[#EDEDED]/80' : 'text-[#525252]'
                  }`}>
                    "{review.comment}"
                  </p>
                </div>

                {/* Card Footer: Reviewer Info + Product Tag */}
                <div className={`pt-4 border-t space-y-2 ${
                  isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
                }`}>
                  <div className="flex items-center justify-between text-xs font-sans-clean">
                    <div className={`font-semibold ${
                      isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                    }`}>
                      {review.customerName}
                    </div>

                    {review.location && (
                      <div className={`flex items-center gap-1 text-[11px] ${
                        isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                      }`}>
                        <MapPin className={`w-3 h-3 ${isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}`} />
                        <span>{review.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Tag */}
                  <div className={`text-[10.5px] font-sans-clean tracking-wider truncate ${
                    isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                  }`}>
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
