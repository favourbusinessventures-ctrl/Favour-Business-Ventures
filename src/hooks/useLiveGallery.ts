import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/gallery';

export function useLiveGallery(): { galleryItems: GalleryItem[]; loading: boolean } {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'gallery'), where('status', '==', 'active'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: (GalleryItem & { displayOrder: number })[] = [];
            snapshot.forEach((doc) => {
              const d = doc.data();
              list.push({
                id: doc.id,
                title: d.title || 'Gallery Item',
                category: d.category === 'crayfish' ? 'crayfish' : 'stockfish',
                description: d.description || '',
                imageUrl: d.imageUrl || (d.category === 'crayfish' ? GALLERY_ITEMS[2].imageUrl : GALLERY_ITEMS[0].imageUrl),
                aspect: (d.aspect === 'portrait' || d.aspect === 'landscape' || d.aspect === 'square') ? d.aspect : 'portrait',
                displayOrder: typeof d.displayOrder === 'number' ? d.displayOrder : 0
              });
            });
            list.sort((a, b) => a.displayOrder - b.displayOrder);
            if (list.length > 0) {
              setGalleryItems(list);
            } else {
              setGalleryItems(GALLERY_ITEMS);
            }
          } else {
            setGalleryItems(GALLERY_ITEMS);
          }
          setLoading(false);
        },
        (error) => {
          // Graceful fallback to verified static gallery data
          console.warn('Live gallery fallback active:', error.message);
          setGalleryItems(GALLERY_ITEMS);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch {
      setGalleryItems(GALLERY_ITEMS);
      setLoading(false);
    }
  }, []);

  return { galleryItems, loading };
}
