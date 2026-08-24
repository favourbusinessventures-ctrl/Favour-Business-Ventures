import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductDetail } from '../types';
import { PRODUCTS_DATA } from '../data/products';

export interface UseLiveProductsReturn {
  products: ProductDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ============================================================================
// IN-MEMORY SINGLETON CACHE & REQUEST DEDUPLICATION
// ============================================================================
// Cache TTL: 20 minutes (product catalogue updates infrequently)
const CACHE_TTL_MS = 20 * 60 * 1000;

// Error backoff TTL: If Firestore returns quota exhausted or network error,
// avoid hammering Firestore on subsequent mounts for 5 minutes.
const ERROR_BACKOFF_MS = 5 * 60 * 1000;

interface ProductsCacheState {
  data: ProductDetail[];
  timestamp: number;
  isFetched: boolean;
}

let cachedProductsState: ProductsCacheState = {
  data: PRODUCTS_DATA,
  timestamp: 0,
  isFetched: false
};

// In-flight promise to deduplicate simultaneous calls across multiple mounting components
let inFlightProductsPromise: Promise<ProductDetail[]> | null = null;
let lastProductsErrorTimestamp = 0;

// Listeners to notify all active hook instances when fresh products arrive
type ProductsListener = (products: ProductDetail[]) => void;
const productSubscribers = new Set<ProductsListener>();

function notifyProductSubscribers(newProducts: ProductDetail[]) {
  productSubscribers.forEach((callback) => {
    try {
      callback(newProducts);
    } catch {
      // Ignore subscriber notification error
    }
  });
}

async function fetchLiveProductsSingle(forceRefresh = false): Promise<ProductDetail[]> {
  const now = Date.now();

  // 1. Return fresh cached data if within TTL and not forcing refresh
  if (!forceRefresh && cachedProductsState.isFetched && now - cachedProductsState.timestamp < CACHE_TTL_MS) {
    return cachedProductsState.data;
  }

  // 2. If recent error occurred (e.g. quota exhausted), return fallback without spamming Firestore
  if (!forceRefresh && lastProductsErrorTimestamp > 0 && now - lastProductsErrorTimestamp < ERROR_BACKOFF_MS) {
    return cachedProductsState.isFetched ? cachedProductsState.data : PRODUCTS_DATA;
  }

  // 3. Return existing in-flight request if already in progress
  if (inFlightProductsPromise) {
    return inFlightProductsPromise;
  }

  // 4. Initiate single getDocs query
  inFlightProductsPromise = (async () => {
    try {
      const q = query(collection(db, 'products'), where('status', '==', 'active'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const list: (ProductDetail & { displayOrder: number })[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            name: d.name || 'Product',
            category: d.category === 'Crayfish' ? 'Crayfish' : 'Stockfish',
            subtitle: d.subtitle || '',
            description: d.description || '',
            highlights: Array.isArray(d.highlights) && d.highlights.length > 0 ? d.highlights : [],
            imageUrl: d.imageUrl || (d.category === 'Crayfish' ? PRODUCTS_DATA[1].imageUrl : PRODUCTS_DATA[0].imageUrl),
            options: Array.isArray(d.options) && d.options.length > 0 ? d.options : [],
            culinaryNotes: d.culinaryNotes || '',
            displayOrder: typeof d.displayOrder === 'number' ? d.displayOrder : 0
          });
        });

        list.sort((a, b) => a.displayOrder - b.displayOrder);
        const finalProducts = list.length > 0 ? list : PRODUCTS_DATA;

        cachedProductsState = {
          data: finalProducts,
          timestamp: Date.now(),
          isFetched: true
        };
        lastProductsErrorTimestamp = 0;
        notifyProductSubscribers(finalProducts);
        return finalProducts;
      } else {
        // Empty snapshot -> use static catalogue
        cachedProductsState = {
          data: PRODUCTS_DATA,
          timestamp: Date.now(),
          isFetched: true
        };
        lastProductsErrorTimestamp = 0;
        notifyProductSubscribers(PRODUCTS_DATA);
        return PRODUCTS_DATA;
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.warn('Live products fallback active (cached/fallback in use):', errMsg);
      lastProductsErrorTimestamp = Date.now();

      const fallback = cachedProductsState.isFetched ? cachedProductsState.data : PRODUCTS_DATA;
      return fallback;
    } finally {
      inFlightProductsPromise = null;
    }
  })();

  return inFlightProductsPromise;
}

export function useLiveProducts(): UseLiveProductsReturn {
  const [products, setProducts] = useState<ProductDetail[]>(cachedProductsState.data);
  const [loading, setLoading] = useState<boolean>(!cachedProductsState.isFetched);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchLiveProductsSingle(true).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Register subscriber for updates across all active hook instances
    const handleUpdate: ProductsListener = (newProducts) => {
      if (isMounted) {
        setProducts(newProducts);
        setLoading(false);
      }
    };
    productSubscribers.add(handleUpdate);

    // If cache is fresh, sync immediately
    if (cachedProductsState.isFetched && Date.now() - cachedProductsState.timestamp < CACHE_TTL_MS) {
      setProducts(cachedProductsState.data);
      setLoading(false);
    } else {
      // Execute shared deduplicated fetch
      fetchLiveProductsSingle().then((res) => {
        if (isMounted) {
          setProducts(res);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
      productSubscribers.delete(handleUpdate);
    };
  }, []);

  return { products, loading, error, refetch };
}

