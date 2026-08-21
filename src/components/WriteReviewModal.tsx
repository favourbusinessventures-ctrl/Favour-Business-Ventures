import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { ReviewSubmissionData } from '../types';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useTheme } from '../context/ThemeContext';
import { formatFriendlyError } from '../utils/errorUtils';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewSubmissionData) => Promise<{ success: boolean; id?: string; error?: string }>;
  defaultProductId?: string;
  defaultProductName?: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultProductId,
  defaultProductName
}) => {
  const { isDark } = useTheme();
  const { products } = useLiveProducts();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [productId, setProductId] = useState<string>(defaultProductId || 'norwegian-stockfish');
  const [productName, setProductName] = useState<string>(defaultProductName || 'Norwegian Stockfish (Torsk / Cod)');
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleProductSelect = (id: string) => {
    setProductId(id);
    if (id === 'general') {
      setProductName('General Provision & Store Experience');
    } else {
      const found = products.find((p) => p.id === id);
      setProductName(found ? found.name : 'Norwegian Stockfish');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || customerName.trim().length < 2) {
      setError('Please provide your name or initials (at least 2 characters).');
      return;
    }
    if (!reviewTitle.trim()) {
      setError('Please provide a brief headline or title for your review.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please write at least a few words (10+ characters) describing your experience.');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit({
      customerName: customerName.trim(),
      rating,
      reviewTitle: reviewTitle.trim(),
      comment: comment.trim(),
      productId,
      productName,
      location: location.trim() || undefined
    });

    setSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
    } else {
      const friendly = formatFriendlyError(result.error || 'Failed to submit review. Please try again.');
      setError(friendly.message);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    setRating(5);
    setCustomerName('');
    setLocation('');
    setReviewTitle('');
    setComment('');
    onClose();
  };

  const ratingLabels: { [key: number]: string } = {
    1: '1 Star — Needs Significant Improvement',
    2: '2 Stars — Below Expectations',
    3: '3 Stars — Average / Satisfactory',
    4: '4 Stars — Very Good Quality & Taste',
    5: '5 Stars — Outstanding & Highly Recommended'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="write-review-modal"
        className={`w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
          isDark
            ? 'bg-[#0D3325] border-[#16382A] text-[#EDEDED]'
            : 'bg-white border-[#E5E7EB] text-[#1A1A1A]'
        }`}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between relative ${
          isDark
            ? 'bg-[#071F16] border-[#16382A]'
            : 'bg-[#F5F5F0] border-[#E5E7EB]'
        }`}>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className={`w-4 h-[1.5px] ${isDark ? 'bg-[#B8954A]' : 'bg-[#1E5631]'}`} />
              <span className={`text-[10px] font-sans-clean font-semibold tracking-[0.25em] uppercase ${
                isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
              }`}>
                Customer Feedback
              </span>
            </div>
            <h3 className={`font-editorial text-xl sm:text-2xl font-bold ${
              isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
            }`}>
              Share Your Culinary Experience
            </h3>
          </div>

          <button
            onClick={handleResetAndClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              isDark
                ? 'border-[#16382A] text-[#A3B899] hover:text-[#EDEDED] hover:bg-[#071F16]'
                : 'border-[#E5E7EB] text-[#6B7266] hover:text-[#1A1A1A] hover:bg-white'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            <div className="text-center py-8 px-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h4 className={`font-editorial text-2xl font-bold ${
                  isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'
                }`}>
                  Review Submitted for Moderation
                </h4>
                <p className={`text-xs sm:text-sm font-sans-clean leading-relaxed ${
                  isDark ? 'text-[#EDEDED]/75' : 'text-[#525252]'
                }`}>
                  Thank you, <strong className={isDark ? 'text-[#EDEDED]' : 'text-[#1A1A1A]'}>{customerName}</strong>! Your review for{' '}
                  <strong className={isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'}>{productName}</strong> has been received. To ensure authentic customer feedback, our team verifies submissions before displaying them on the public website.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl text-left flex items-start gap-3 max-w-sm mx-auto border ${
                isDark
                  ? 'bg-[#071F16] border-[#16382A]'
                  : 'bg-[#F5F5F0] border-[#E5E7EB]'
              }`}>
                <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${
                  isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                }`} />
                <p className={`text-[11px] font-sans-clean ${
                  isDark ? 'text-[#A3B899]' : 'text-[#525252]'
                }`}>
                  Authenticity Guarantee: All reviews undergo strict quality moderation to maintain premium Nigerian seafood standards.
                </p>
              </div>

              <button
                onClick={handleResetAndClose}
                className={`btn-tactile px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase rounded-xl transition-all cursor-pointer font-sans-clean shadow-lg ${
                  isDark
                    ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16]'
                    : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white'
                }`}
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-sans-clean text-rose-600 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Rating Stars Picker */}
              <div className={`space-y-2 text-center sm:text-left p-4 rounded-xl border ${
                isDark ? 'bg-[#071F16] border-[#16382A]' : 'bg-[#F5F5F0] border-[#E5E7EB]'
              }`}>
                <label className={`block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'text-[#B8954A]' : 'text-[#1E5631]'
                }`}>
                  Overall Rating *
                </label>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating !== null ? hoverRating : rating;
                    const isFilled = star <= activeRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-2xl transition-transform hover:scale-115 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-[#B8954A] fill-[#B8954A]'
                              : isDark
                                ? 'text-[#16382A] hover:text-[#B8954A]/50'
                                : 'text-[#E5E7EB] hover:text-[#B8954A]/50'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className={`text-[11px] font-sans-clean italic ${
                  isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                }`}>
                  {ratingLabels[hoverRating !== null ? hoverRating : rating]}
                </div>
              </div>

              {/* 2. Product Selector */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.16em] ${
                  isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                }`}>
                  Select Provision / Item *
                </label>
                <select
                  value={productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className={`w-full text-xs font-sans-clean px-3.5 py-3 rounded-xl outline-none cursor-pointer border transition-colors ${
                    isDark
                      ? 'bg-[#071F16] border-[#16382A] focus:border-[#B8954A] text-[#EDEDED]'
                      : 'bg-[#F5F5F0] border-[#E5E7EB] focus:border-[#1E5631] text-[#1A1A1A]'
                  }`}
                >
                  <option value="norwegian-stockfish">Norwegian Stockfish (Torsk / Cod)</option>
                  <option value="oron-crayfish">Oron Crayfish (Sun-Cured / Stone-Free)</option>
                  {products
                    .filter((p) => p.id !== 'norwegian-stockfish' && p.id !== 'oron-crayfish')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  <option value="general">Overall Store & Delivery Experience</option>
                </select>
              </div>

              {/* 3. Reviewer Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className={`block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.16em] ${
                    isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                  }`}>
                    Your Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Chief Emeka O. or Chef Anita"
                    maxLength={100}
                    className={`w-full text-xs font-sans-clean px-3.5 py-3 rounded-xl outline-none border transition-colors ${
                      isDark
                        ? 'bg-[#071F16] border-[#16382A] focus:border-[#B8954A] text-[#EDEDED] placeholder-[#EDEDED]/40'
                        : 'bg-[#F5F5F0] border-[#E5E7EB] focus:border-[#1E5631] text-[#1A1A1A] placeholder-[#9CA3AF]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.16em] ${
                    isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                  }`}>
                    Location / City (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lagos, Abuja, London UK"
                    maxLength={100}
                    className={`w-full text-xs font-sans-clean px-3.5 py-3 rounded-xl outline-none border transition-colors ${
                      isDark
                        ? 'bg-[#071F16] border-[#16382A] focus:border-[#B8954A] text-[#EDEDED] placeholder-[#EDEDED]/40'
                        : 'bg-[#F5F5F0] border-[#E5E7EB] focus:border-[#1E5631] text-[#1A1A1A] placeholder-[#9CA3AF]'
                    }`}
                  />
                </div>
              </div>

              {/* 4. Review Headline / Title */}
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.16em] ${
                  isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                }`}>
                  Review Headline / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Sand-free and incredibly sweet aroma in our soup"
                  maxLength={150}
                  className={`w-full text-xs font-sans-clean px-3.5 py-3 rounded-xl outline-none border transition-colors ${
                    isDark
                      ? 'bg-[#071F16] border-[#16382A] focus:border-[#B8954A] text-[#EDEDED] placeholder-[#EDEDED]/40'
                      : 'bg-[#F5F5F0] border-[#E5E7EB] focus:border-[#1E5631] text-[#1A1A1A] placeholder-[#9CA3AF]'
                  }`}
                />
              </div>

              {/* 5. Detailed Review Narrative */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`block text-[11px] font-sans-clean font-semibold uppercase tracking-[0.16em] ${
                    isDark ? 'text-[#EDEDED]/80' : 'text-[#1A1A1A]'
                  }`}>
                    Detailed Review *
                  </label>
                  <span className={`text-[10px] font-sans-clean ${
                    isDark ? 'text-[#A3B899]' : 'text-[#6B7266]'
                  }`}>
                    {comment.length}/1500 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the aroma, texture, cleanliness, cooking results, or delivery experience..."
                  maxLength={1500}
                  className={`w-full text-xs font-sans-clean p-3.5 rounded-xl outline-none border transition-colors resize-none leading-relaxed ${
                    isDark
                      ? 'bg-[#071F16] border-[#16382A] focus:border-[#B8954A] text-[#EDEDED] placeholder-[#EDEDED]/40'
                      : 'bg-[#F5F5F0] border-[#E5E7EB] focus:border-[#1E5631] text-[#1A1A1A] placeholder-[#9CA3AF]'
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className={`pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t ${
                isDark ? 'border-[#16382A]' : 'border-[#E5E7EB]'
              }`}>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className={`w-full sm:w-auto px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase rounded-xl transition-colors cursor-pointer border ${
                    isDark
                      ? 'bg-transparent hover:bg-[#071F16] text-[#A3B899] hover:text-[#EDEDED] border-[#16382A]'
                      : 'bg-transparent hover:bg-[#F5F5F0] text-[#525252] hover:text-[#1A1A1A] border-[#E5E7EB]'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full sm:w-auto btn-tactile inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-[0.18em] uppercase rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16]'
                      : 'bg-[#1E5631] hover:bg-[#2E7D4F] text-white'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Review...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
