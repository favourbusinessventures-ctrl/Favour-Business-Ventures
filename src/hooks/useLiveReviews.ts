import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CustomerReview, RatingSummary, ReviewSubmissionData } from '../types';
import { INITIAL_REVIEWS } from '../data/reviews';

// ============================================================================
// IN-MEMORY SINGLETON CACHE & REQUEST DEDUPLICATION
// ============================================================================
// Cache TTL: 10 minutes (reviews update when admin approves new customer submissions)
const CACHE_TTL_MS = 10 * 60 * 1000;

// Error backoff TTL: If Firestore returns quota exhausted or network error,
// avoid hammering Firestore on subsequent mounts for 5 minutes.
const ERROR_BACKOFF_MS = 5 * 60 * 1000;

interface ReviewsCacheState {
  data: CustomerReview[];
  timestamp: number;
  isFetched: boolean;
}

let cachedReviewsState: ReviewsCacheState = {
  data: INITIAL_REVIEWS,
  timestamp: 0,
  isFetched: false
};

// In-flight promise to deduplicate simultaneous calls across multiple mounting components
let inFlightReviewsPromise: Promise<CustomerReview[]> | null = null;
let lastReviewsErrorTimestamp = 0;

// Listeners to notify all active hook instances when fresh reviews arrive
type ReviewsListener = (reviews: CustomerReview[]) => void;
const reviewSubscribers = new Set<ReviewsListener>();

function notifyReviewSubscribers(newReviews: CustomerReview[]) {
  reviewSubscribers.forEach((callback) => {
    try {
      callback(newReviews);
    } catch {
      // Ignore subscriber notification error
    }
  });
}

async function fetchLiveReviewsSingle(forceRefresh = false): Promise<CustomerReview[]> {
  const now = Date.now();

  // 1. Return fresh cached data if within TTL and not forcing refresh
  if (!forceRefresh && cachedReviewsState.isFetched && now - cachedReviewsState.timestamp < CACHE_TTL_MS) {
    return cachedReviewsState.data;
  }

  // 2. If recent error occurred (e.g. quota exhausted), return fallback without spamming Firestore
  if (!forceRefresh && lastReviewsErrorTimestamp > 0 && now - lastReviewsErrorTimestamp < ERROR_BACKOFF_MS) {
    return cachedReviewsState.isFetched ? cachedReviewsState.data : INITIAL_REVIEWS;
  }

  // 3. Return existing in-flight request if already in progress
  if (inFlightReviewsPromise) {
    return inFlightReviewsPromise;
  }

  // 4. Initiate single getDocs query
  inFlightReviewsPromise = (async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved')
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const list: CustomerReview[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
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
        const finalReviews = list.length > 0 ? list : INITIAL_REVIEWS;

        cachedReviewsState = {
          data: finalReviews,
          timestamp: Date.now(),
          isFetched: true
        };
        lastReviewsErrorTimestamp = 0;
        notifyReviewSubscribers(finalReviews);
        return finalReviews;
      } else {
        // Empty snapshot -> use curated initial reviews
        cachedReviewsState = {
          data: INITIAL_REVIEWS,
          timestamp: Date.now(),
          isFetched: true
        };
        lastReviewsErrorTimestamp = 0;
        notifyReviewSubscribers(INITIAL_REVIEWS);
        return INITIAL_REVIEWS;
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.warn('Live reviews fallback active (cached/fallback in use):', errMsg);
      lastReviewsErrorTimestamp = Date.now();

      const fallback = cachedReviewsState.isFetched ? cachedReviewsState.data : INITIAL_REVIEWS;
      return fallback;
    } finally {
      inFlightReviewsPromise = null;
    }
  })();

  return inFlightReviewsPromise;
}

export function useLiveReviews(productIdFilter?: string): {
  reviews: CustomerReview[];
  loading: boolean;
  error: string | null;
  summary: RatingSummary;
  submitReview: (data: ReviewSubmissionData) => Promise<{ success: boolean; id?: string; error?: string }>;
  refetch: () => void;
} {
  const [firestoreReviews, setFirestoreReviews] = useState<CustomerReview[]>(cachedReviewsState.data);
  const [loading, setLoading] = useState<boolean>(!cachedReviewsState.isFetched);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchLiveReviewsSingle(true).then((res) => {
      setFirestoreReviews(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Register subscriber for updates across all active hook instances
    const handleUpdate: ReviewsListener = (newReviews) => {
      if (isMounted) {
        setFirestoreReviews(newReviews);
        setLoading(false);
      }
    };
    reviewSubscribers.add(handleUpdate);

    // If cache is fresh, sync immediately
    if (cachedReviewsState.isFetched && Date.now() - cachedReviewsState.timestamp < CACHE_TTL_MS) {
      setFirestoreReviews(cachedReviewsState.data);
      setLoading(false);
    } else {
      // Execute shared deduplicated fetch
      fetchLiveReviewsSingle().then((res) => {
        if (isMounted) {
          setFirestoreReviews(res);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
      reviewSubscribers.delete(handleUpdate);
    };
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
      } catch (err: unknown) {
        console.error('Error submitting review:', err);
        const errMsg = err instanceof Error ? err.message : 'Failed to submit review. Please check your connection and try again.';
        return {
          success: false,
          error: errMsg
        };
      }
    },
    []
  );

  return { reviews, loading, error, summary, submitReview, refetch };
}

