import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminReview, ReviewModerationStatus } from '../admin/types';

export function useAdminReviews(): {
  reviews: AdminReview[];
  loading: boolean;
  error: string | null;
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  approveReview: (reviewId: string) => Promise<{ success: boolean; error?: string }>;
  rejectReview: (reviewId: string) => Promise<{ success: boolean; error?: string }>;
  deleteReview: (reviewId: string) => Promise<{ success: boolean; error?: string }>;
  updateReviewStatus: (reviewId: string, status: ReviewModerationStatus) => Promise<{ success: boolean; error?: string }>;
} {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const colRef = collection(db, 'reviews');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          const list: AdminReview[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            list.push({
              id: docSnap.id,
              customerName: d.customerName || 'Anonymous Customer',
              rating: typeof d.rating === 'number' ? Math.max(1, Math.min(5, Math.round(d.rating))) : 5,
              reviewTitle: d.reviewTitle || '',
              comment: d.comment || '',
              productId: d.productId || 'general',
              productName: d.productName || 'Stockfish & Crayfish',
              location: d.location || '',
              status: (d.status as ReviewModerationStatus) || 'pending',
              createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
              updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : (d.updatedAt || undefined)
            });
          });

          // Sort newest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReviews(list);
          setLoading(false);
        },
        (err) => {
          console.error('Error listening to admin reviews:', err);
          setError(err.message || 'Permission denied or network failure.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Failed to subscribe to reviews:', err);
      setError(err?.message || 'Failed to initialize reviews');
      setLoading(false);
    }
  }, []);

  // Compute status counts
  const counts = useMemo(() => {
    return {
      total: reviews.length,
      pending: reviews.filter((r) => r.status === 'pending').length,
      approved: reviews.filter((r) => r.status === 'approved').length,
      rejected: reviews.filter((r) => r.status === 'rejected').length
    };
  }, [reviews]);

  // Moderation action: Approve review
  const approveReview = useCallback(
    async (reviewId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const ref = doc(db, 'reviews', reviewId);
        await updateDoc(ref, {
          status: 'approved',
          updatedAt: serverTimestamp()
        });
        return { success: true };
      } catch (err: any) {
        console.error('Error approving review:', err);
        return { success: false, error: err?.message || 'Failed to approve review' };
      }
    },
    []
  );

  // Moderation action: Reject review
  const rejectReview = useCallback(
    async (reviewId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const ref = doc(db, 'reviews', reviewId);
        await updateDoc(ref, {
          status: 'rejected',
          updatedAt: serverTimestamp()
        });
        return { success: true };
      } catch (err: any) {
        console.error('Error rejecting review:', err);
        return { success: false, error: err?.message || 'Failed to reject review' };
      }
    },
    []
  );

  // Moderation action: Update review status
  const updateReviewStatus = useCallback(
    async (reviewId: string, status: ReviewModerationStatus): Promise<{ success: boolean; error?: string }> => {
      try {
        const ref = doc(db, 'reviews', reviewId);
        await updateDoc(ref, {
          status,
          updatedAt: serverTimestamp()
        });
        return { success: true };
      } catch (err: any) {
        console.error('Error updating review status:', err);
        return { success: false, error: err?.message || 'Failed to update review status' };
      }
    },
    []
  );

  // Moderation action: Delete review
  const deleteReview = useCallback(
    async (reviewId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const ref = doc(db, 'reviews', reviewId);
        await deleteDoc(ref);
        return { success: true };
      } catch (err: any) {
        console.error('Error deleting review:', err);
        return { success: false, error: err?.message || 'Failed to delete review' };
      }
    },
    []
  );

  return {
    reviews,
    loading,
    error,
    counts,
    approveReview,
    rejectReview,
    deleteReview,
    updateReviewStatus
  };
}
