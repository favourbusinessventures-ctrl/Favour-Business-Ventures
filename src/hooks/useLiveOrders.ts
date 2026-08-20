import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AdminOrder } from '../admin/types';

interface UseLiveOrdersReturn {
  orders: AdminOrder[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLiveOrders(): UseLiveOrdersReturn {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      // Order by createdAt descending
      const ordersRef = collection(db, 'orders');
      
      unsubscribe = onSnapshot(
        ordersRef,
        (snapshot) => {
          const list: AdminOrder[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            const parseDate = (val: any): string => {
              if (!val) return new Date().toISOString();
              if (typeof val?.toDate === 'function') {
                return val.toDate().toISOString();
              }
              if (val?.seconds) {
                return new Date(val.seconds * 1000).toISOString();
              }
              if (typeof val === 'string') {
                const parsed = new Date(val);
                return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
              }
              return new Date().toISOString();
            };

            const createdStr = parseDate(data.createdAt);
            const updatedStr = parseDate(data.updatedAt || data.createdAt);

            list.push({
              id: doc.id,
              customerName: data.customerName || 'Unknown Customer',
              customerPhone: data.customerPhone || '',
              customerEmail: data.customerEmail || '',
              productName: data.productName || 'General Product',
              category: (data.category === 'crayfish' ? 'crayfish' : 'stockfish'),
              option: data.option || '',
              quantity: data.quantity || '',
              customerMessage: data.customerMessage || '',
              source: (data.source === 'whatsapp' ? 'whatsapp' : data.source === 'website' ? 'website' : 'admin'),
              status: (['new', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(data.status) ? data.status : 'new'),
              createdAt: createdStr,
              updatedAt: updatedStr,
            });
          });

          // Sort in-memory newest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setOrders(list);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Firestore orders subscription notice:', err.message);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('Error setting up live orders listener:', err);
      setError(err?.message || 'Failed to initialize orders listener');
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: () => {
      // onSnapshot automatically updates
    }
  };
}
