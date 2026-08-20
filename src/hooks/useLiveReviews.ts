import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CustomerReview, RatingSummary, ReviewSubmissionData } from '../types';
import { INITIAL_REVIEWS } from '../data/reviews';

export function useLiveReviews(productIdFilter?: string): {
  reviews: CustomerReview[];
  loading: boolean;
  error: string | null;
  summary: RatingSummary;
  submitReview: (data: ReviewSubmissionData) => Promise<{ success: boolean; id?: string; error?: string }>;
} {
  const [firestoreReviews, setFirestoreReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: CustomerReview[] = [];
            snapshot.forEach((doc) => {
              const d = doc.data();
              list.push({
                id: doc.id,
                customerName: d.customerName || 'Anonymous Customer',
                rating: typeof d.rating === 'number' ? Math.max(1, Math.min(5, Math.round(d.rating))) : 5,
                reviewTitle: d.reviewTitle || 'Customer Review',
                comment: d.comment || '',
                productId: d.productId || 'general',
                productName: d.productName || 'Stockfish & Crayfish',
                location: d.location || '',
                status: 'approved',
                createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString()),
                updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : d.updatedAt
              });
            });

            // Sort newest first
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setFirestoreReviews(list);
          } else {
            setFirestoreReviews([]);
          }
          setLoading(false);
        },
        (err) => {
          console.warn('Live reviews listening notice:', err.message);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.warn('Error subscribing to reviews:', err);
      setError(err?.message || 'Failed to initialize reviews');
      setLoading(false);
    }
  }, []);

  // Merged reviews: use Firestore reviews if available, otherwise fallback to curated initial reviews
  const allApprovedReviews = useMemo(() => {
    if (firestoreReviews.length > 0) {
      return firestoreReviews;
    }
    return INITIAL_REVIEWS;
  }, [firestoreReviews]);

  // Filter by product if requested
  const reviews = useMemo(() => {
    if (!productIdFilter || productIdFilter === 'all') {
      return allApprovedReviews;
    }
    return allApprovedReviews.filter(
      (r) => r.productId === productIdFilter || r.productId === 'general'
    );
  }, [allApprovedReviews, productIdFilter]);

  // Compute rating metrics & star distribution
  const summary: RatingSummary = useMemo(() => {
    const targetSet = reviews;
    if (targetSet.length === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    let sum = 0;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    targetSet.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      starCounts[star] = (starCounts[star] || 0) + 1;
      sum += star;
    });

    const averageRating = Number((sum / targetSet.length).toFixed(1));

    return {
      averageRating,
      totalReviews: targetSet.length,
      starCounts
    };
  }, [reviews]);

  // Submit public review with pending moderation status
  const submitReview = useCallback(
    async (data: ReviewSubmissionData): Promise<{ success: boolean; id?: string; error?: string }> => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const docRef = await addDoc(reviewsRef, {
          customerName: data.customerName.trim(),
          rating: Math.max(1, Math.min(5, Math.round(data.rating))),
          reviewTitle: data.reviewTitle.trim(),
          comment: data.comment.trim(),
          productId: data.productId.trim() || 'general',
          productName: data.productName.trim() || 'General Store Experience',
          ...(data.location?.trim() ? { location: data.location.trim() } : {}),
          status: 'pending',
          createdAt: serverTimestamp()
        });

        return { success: true, id: docRef.id };
      } catch (err: any) {
        console.error('Error submitting review:', err);
        return {
          success: false,
          error: err?.message || 'Failed to submit review. Please check your connection and try again.'
        };
      }
    },
    []
  );

  return { reviews, loading, error, summary, submitReview };
}
