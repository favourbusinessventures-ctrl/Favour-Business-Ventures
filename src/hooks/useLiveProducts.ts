import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductDetail } from '../types';
import { PRODUCTS_DATA } from '../data/products';

export interface UseLiveProductsReturn {
  products: ProductDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLiveProducts(): UseLiveProductsReturn {
  const [products, setProducts] = useState<ProductDetail[]>(PRODUCTS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    let isMounted = true;

    // Timeout safety to ensure loading never hangs indefinitely
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
      }
    }, 4000);

    try {
      const q = query(collection(db, 'products'), where('status', '==', 'active'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!isMounted) return;
          clearTimeout(timeoutId);

          if (!snapshot.empty) {
            const list: (ProductDetail & { displayOrder: number })[] = [];
            snapshot.forEach((doc) => {
              const d = doc.data();
              list.push({
                id: doc.id,
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
            if (list.length > 0) {
              setProducts(list);
            } else {
              setProducts(PRODUCTS_DATA);
            }
          } else {
            setProducts(PRODUCTS_DATA);
          }
          setError(null);
          setLoading(false);
        },
        (err) => {
          if (!isMounted) return;
          clearTimeout(timeoutId);
          // Graceful fallback to verified static data
          console.warn('Live products fallback active:', err.message);
          setProducts(PRODUCTS_DATA);
          setError(null); // Keep error non-blocking because verified static catalog is rendered
          setLoading(false);
        }
      );
    } catch {
      if (isMounted) {
        clearTimeout(timeoutId);
        setProducts(PRODUCTS_DATA);
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [reloadCounter]);

  return { products, loading, error, refetch };
}
