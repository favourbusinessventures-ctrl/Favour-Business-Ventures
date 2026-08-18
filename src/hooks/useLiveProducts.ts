import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductDetail } from '../types';
import { PRODUCTS_DATA } from '../data/products';

export function useLiveProducts(): { products: ProductDetail[]; loading: boolean } {
  const [products, setProducts] = useState<ProductDetail[]>(PRODUCTS_DATA);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'products'), where('status', '==', 'active'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
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
          setLoading(false);
        },
        (error) => {
          // Graceful fallback to verified static data if rules / network disconnect
          console.warn('Live products fallback active:', error.message);
          setProducts(PRODUCTS_DATA);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch {
      setProducts(PRODUCTS_DATA);
      setLoading(false);
    }
  }, []);

  return { products, loading };
}
