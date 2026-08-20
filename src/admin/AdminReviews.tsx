import React, { useState } from 'react';
import { useAdminReviews } from '../hooks/useAdminReviews';
import { AdminReview, ReviewModerationStatus } from './types';
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  AlertCircle,
  X,
  Loader2,
  User,
  Package,
  MapPin,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const {
    reviews,
    loading,
    error,
    counts,
    approveReview,
    rejectReview,
    deleteReview,
    updateReviewStatus
  } = useAdminReviews();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');

  // Modal States
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [deletingReview, setDeletingReview] = useState<AdminReview | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.reviewTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rev.location && rev.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || rev.status === statusFilter;
    const matchesStar = starFilter === 'all' || Math.round(rev.rating).toString() === starFilter;
    const matchesProduct =
      productFilter === 'all' ||
      (productFilter === 'stockfish' && rev.productId.includes('stockfish')) ||
      (productFilter === 'crayfish' && rev.productId.includes('crayfish'));

    return matchesSearch && matchesStatus && matchesStar && matchesProduct;
  });

  // Calculate Average Rating of Approved Reviews
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const averageApprovedScore =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  // Handle Approve
  const handleApprove = async (review: AdminReview) => {
    setActionLoading(true);
    const res = await approveReview(review.id);
    setActionLoading(false);
    if (res.success) {
      showToast('success', `Review from "${review.customerName}" is now APPROVED and visible to public.`);
      if (selectedReview?.id === review.id) {
        setSelectedReview({ ...review, status: 'approved' });
      }
    } else {
      showToast('error', res.error || 'Failed to approve review.');
    }
  };

  // Handle Reject
  const handleReject = async (review: AdminReview) => {
    setActionLoading(true);
    const res = await rejectReview(review.id);
    setActionLoading(false);
    if (res.success) {
      showToast('success', `Review from "${review.customerName}" has been marked as REJECTED.`);
      if (selectedReview?.id === review.id) {
        setSelectedReview({ ...review, status: 'rejected' });
      }
    } else {
      showToast('error', res.error || 'Failed to reject review.');
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deletingReview) return;
    setActionLoading(true);
    const res = await deleteReview(deletingReview.id);
    setActionLoading(false);
    if (res.success) {
      showToast('success', `Review record successfully deleted.`);
      if (selectedReview?.id === deletingReview.id) {
        setSelectedReview(null);
      }
      setDeletingReview(null);
    } else {
      showToast('error', res.error || 'Failed to delete review.');
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: ReviewModerationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-amber-950/70 text-amber-300 border border-amber-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending Moderation
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            Approved & Live
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-red-950/70 text-red-300 border border-red-800/50">
            <XCircle className="w-2.5 h-2.5 text-red-400" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-[2px] shadow-2xl flex items-center gap-3 border text-xs font-sans-clean animate-in slide-in-from-bottom-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#0D3325] text-emerald-300 border-emerald-700/60'
              : 'bg-[#2A0D0D] text-red-300 border-red-700/60'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="bg-[#0D3325] border border-[#16382A] p-6 sm:p-8 rounded-[2px] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
                Customer Feedback • Moderation Center
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F0E6]">
              Customer Reviews & Ratings Moderation
            </h1>
            <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean font-light max-w-2xl">
              Inspect incoming customer ratings, approve verified authentic feedback to publish onto the storefront, and prevent spam or abuse.
            </p>
          </div>

          <div className="bg-[#071F16] border border-[#16382A] px-4 py-3 rounded-[2px] text-right shrink-0">
            <div className="text-[10px] font-sans-clean uppercase tracking-[0.2em] text-[#B8954A]">
              Store Live Rating
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <Star className="w-4 h-4 fill-[#B8954A] text-[#B8954A]" />
              <span className="font-editorial text-2xl font-bold text-[#F5F0E6]">
                {averageApprovedScore}
              </span>
              <span className="text-xs text-[#A3B899]">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Reviews */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#071F16] border-[#B8954A] shadow-md ring-1 ring-[#B8954A]/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-[#B8954A]/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-[#A3B899] uppercase tracking-wider font-semibold">
            All Reviews
          </div>
          <div className="text-2xl font-editorial font-bold text-[#F5F0E6] mt-1">
            {counts.total}
          </div>
          <div className="text-[10px] text-[#6B7266] font-sans-clean mt-0.5">
            Total submissions
          </div>
        </div>

        {/* Pending Moderation */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-[#071F16] border-amber-400 shadow-md ring-1 ring-amber-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-amber-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-amber-300 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Pending</span>
            {counts.pending > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          </div>
          <div className="text-2xl font-editorial font-bold text-amber-100 mt-1">
            {counts.pending}
          </div>
          <div className="text-[10px] text-amber-400/70 font-sans-clean mt-0.5">
            Requires admin action
          </div>
        </div>

        {/* Approved & Live */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-[#071F16] border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-emerald-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-emerald-300 uppercase tracking-wider font-semibold">
            Approved & Live
          </div>
          <div className="text-2xl font-editorial font-bold text-emerald-100 mt-1">
            {counts.approved}
          </div>
          <div className="text-[10px] text-emerald-400/70 font-sans-clean mt-0.5">
            Visible on storefront
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-[#071F16] border-red-400 shadow-md ring-1 ring-red-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-red-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-red-300 uppercase tracking-wider font-semibold">
            Rejected
          </div>
          <div className="text-2xl font-editorial font-bold text-red-200 mt-1">
            {counts.rejected}
          </div>
          <div className="text-[10px] text-red-400/70 font-sans-clean mt-0.5">
            Hidden from storefront
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-[#0D3325] border border-[#16382A] p-4 rounded-[2px] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7266]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, title, review text, or product..."
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] pl-10 pr-3.5 py-2.5 rounded-[2px] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7266] hover:text-[#F5F0E6]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Statuses ({counts.total})</option>
              <option value="pending">Pending ({counts.pending})</option>
              <option value="approved">Approved ({counts.approved})</option>
              <option value="rejected">Rejected ({counts.rejected})</option>
            </select>
          </div>

          {/* Star Filter */}
          <div className="md:col-span-2">
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Product Filter */}
          <div className="md:col-span-2">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Products</option>
              <option value="stockfish">Stockfish</option>
              <option value="crayfish">Crayfish</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {(searchQuery || statusFilter !== 'all' || starFilter !== 'all' || productFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#16382A] text-[11px] font-sans-clean text-[#A3B899]">
            <span>
              Showing <strong className="text-[#F5F0E6]">{filteredReviews.length}</strong> of {reviews.length} reviews
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setStarFilter('all');
                setProductFilter('all');
              }}
              className="text-[#B8954A] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Reviews List */}
      {loading ? (
        <div className="bg-[#0D3325] border border-[#16382A] p-12 text-center rounded-[2px] space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#B8954A] mx-auto" />
          <div className="text-xs font-sans-clean text-[#A3B899] tracking-wider uppercase">
            Loading Customer Reviews from Firestore...
          </div>
        </div>
      ) : error ? (
        <div className="bg-[#2A0D0D] border border-red-800/60 p-6 rounded-[2px] text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
          <div className="text-sm font-sans-clean font-semibold text-red-200">
            Database Access Notice
          </div>
          <div className="text-xs text-red-300 font-sans-clean max-w-md mx-auto">
            {error}
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-[#0D3325] border border-[#16382A] p-12 sm:p-16 rounded-[2px] text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A] mx-auto">
            <Star className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-editorial text-xl font-bold text-[#F5F0E6]">
              {reviews.length === 0 ? 'No customer reviews submitted yet' : 'No matching reviews found'}
            </h3>
            <p className="text-xs text-[#A3B899] font-sans-clean leading-relaxed">
              {reviews.length === 0
                ? 'When customers submit reviews on the storefront or product pages, they will appear here for admin review and moderation.'
                : 'Try adjusting your search query or reset the active status filters.'}
            </p>
          </div>
          {reviews.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setStarFilter('all');
                setProductFilter('all');
              }}
              className="text-xs font-sans-clean text-[#B8954A] hover:underline cursor-pointer"
            >
              Clear Search Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-[#0D3325] border border-[#16382A] rounded-[2px] overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#16382A] bg-[#071F16]/60 text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#6B7266]">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product Target</th>
                  <th className="py-3.5 px-3">Rating</th>
                  <th className="py-3.5 px-4">Review Headline & Content</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16382A] text-xs font-sans-clean">
                {filteredReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    className="hover:bg-[#071F16]/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedReview(rev)}
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#F5F0E6] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#B8954A]" />
                        <span>{rev.customerName}</span>
                      </div>
                      {rev.location && (
                        <div className="text-[11px] text-[#A3B899] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#6B7266]" />
                          <span>{rev.location}</span>
                        </div>
                      )}
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="text-[#F5F0E6] font-medium truncate max-w-xs">
                        {rev.productName}
                      </div>
                      <div className="text-[10.5px] text-[#6B7266]">
                        ID: {rev.productId}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? 'text-[#B8954A] fill-[#B8954A]'
                                : 'text-[#16382A]'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Review Title & Excerpt */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-[#F5F0E6] truncate">
                        {rev.reviewTitle}
                      </div>
                      <p className="text-[11px] text-[#A3B899] truncate font-light mt-0.5">
                        "{rev.comment}"
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(rev.status)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[11px] text-[#A3B899]">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(rev)}
                            disabled={actionLoading}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-950/60 rounded-[2px] transition-colors cursor-pointer"
                            title="Approve Review"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(rev)}
                            disabled={actionLoading}
                            className="p-1.5 text-amber-400 hover:bg-amber-950/60 rounded-[2px] transition-colors cursor-pointer"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedReview(rev)}
                          className="p-1.5 text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A] rounded-[2px] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingReview(rev)}
                          disabled={actionLoading}
                          className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-[2px] transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3.5">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                onClick={() => setSelectedReview(rev)}
                className="bg-[#0D3325] border border-[#16382A] p-4 rounded-[2px] space-y-3 cursor-pointer hover:border-[#B8954A]/50 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#16382A]">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sm text-[#F5F0E6] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B8954A]" />
                      <span>{rev.customerName}</span>
                    </div>
                    {rev.location && (
                      <div className="text-xs text-[#A3B899] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#6B7266]" />
                        <span>{rev.location}</span>
                      </div>
                    )}
                  </div>
                  <div>{renderStatusBadge(rev.status)}</div>
                </div>

                <div className="space-y-1 text-xs font-sans-clean">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'text-[#B8954A] fill-[#B8954A]'
                              : 'text-[#16382A]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#A3B899]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="font-semibold text-[#F5F0E6] pt-1">
                    {rev.reviewTitle}
                  </div>
                  <p className="text-[11px] text-[#A3B899] line-clamp-2 italic">
                    "{rev.comment}"
                  </p>
                  <div className="text-[10.5px] text-[#B8954A] pt-1">
                    Product: {rev.productName}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between pt-2 border-t border-[#16382A] text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(rev)}
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(rev)}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setDeletingReview(rev)}
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. REVIEW DETAILS & MODERATION MODAL                                     */}
      {/* ========================================================================= */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0D3325] border border-[#16382A] max-w-2xl w-full rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#071F16] border-b border-[#16382A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[2px] bg-[#0D3325] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                  <Star className="w-4 h-4 fill-[#B8954A]" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                    Customer Review Details
                  </h3>
                  <div className="text-[10px] font-mono text-[#6B7266]">
                    ID: {selectedReview.id}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {renderStatusBadge(selectedReview.status)}
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-1 text-[#A3B899] hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Customer Box */}
              <div className="bg-[#071F16] p-4 rounded-[2px] border border-[#16382A] space-y-3">
                <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
                  Reviewer Profile
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans-clean">
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Customer Name</div>
                    <div className="text-[#F5F0E6] font-semibold mt-0.5">
                      {selectedReview.customerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Location</div>
                    <div className="text-[#F5F0E6] mt-0.5">
                      {selectedReview.location || 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Target Product</div>
                    <div className="text-[#F5F0E6] font-medium mt-0.5">
                      {selectedReview.productName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Product ID</div>
                    <div className="text-[#A3B899] font-mono text-[11px] mt-0.5">
                      {selectedReview.productId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="bg-[#071F16] p-4 rounded-[2px] border border-[#16382A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
                    Review & Rating Narrative
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= selectedReview.rating
                            ? 'text-[#B8954A] fill-[#B8954A]'
                            : 'text-[#16382A]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                    {selectedReview.reviewTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean leading-relaxed whitespace-pre-wrap bg-[#0D3325]/60 p-3 rounded-[2px]">
                    "{selectedReview.comment}"
                  </p>
                </div>
              </div>

              {/* Moderation Controls */}
              <div className="space-y-2">
                <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
                  Change Moderation Status
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={actionLoading || selectedReview.status === 'approved'}
                    onClick={() => handleApprove(selectedReview)}
                    className="p-2.5 text-xs font-sans-clean rounded-[2px] bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>

                  <button
                    disabled={actionLoading || selectedReview.status === 'rejected'}
                    onClick={() => handleReject(selectedReview)}
                    className="p-2.5 text-xs font-sans-clean rounded-[2px] bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/60 transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject / Hide</span>
                  </button>

                  <button
                    disabled={actionLoading || selectedReview.status === 'pending'}
                    onClick={async () => {
                      setActionLoading(true);
                      await updateReviewStatus(selectedReview.id, 'pending');
                      setSelectedReview({ ...selectedReview, status: 'pending' });
                      setActionLoading(false);
                      showToast('success', 'Review moved back to Pending queue.');
                    }}
                    className="p-2.5 text-xs font-sans-clean rounded-[2px] bg-[#16382A] border border-[#B8954A]/40 text-[#B8954A] hover:bg-[#16382A]/80 transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Mark Pending</span>
                  </button>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex items-center justify-between text-[11px] font-sans-clean text-[#6B7266] pt-2 border-t border-[#16382A]">
                <span>Submitted: {new Date(selectedReview.createdAt).toLocaleString()}</span>
                {selectedReview.updatedAt && (
                  <span>Moderated: {new Date(selectedReview.updatedAt).toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#071F16] border-t border-[#16382A] flex items-center justify-between">
              <button
                onClick={() => {
                  setDeletingReview(selectedReview);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-sans-clean text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Review Permanently</span>
              </button>

              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-[#16382A] hover:bg-[#204e3b] text-[#F5F0E6] text-xs font-sans-clean font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DELETE CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {deletingReview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0D3325] border border-red-800/60 max-w-md w-full p-6 rounded-[2px] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                Confirm Review Deletion
              </h3>
            </div>

            <p className="text-xs text-[#A3B899] font-sans-clean leading-relaxed">
              Are you sure you want to permanently delete the review from{' '}
              <strong className="text-[#F5F0E6]">{deletingReview.customerName}</strong> ("
              {deletingReview.reviewTitle}")? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingReview(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-sans-clean text-[#A3B899] hover:text-[#F5F0E6] rounded-[2px] border border-[#16382A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-sans-clean font-semibold bg-red-600 hover:bg-red-700 text-white rounded-[2px] transition-colors cursor-pointer flex items-center gap-2"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
