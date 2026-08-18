import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BUSINESS_CONFIG } from '../config/business';
import { AdminBusinessSettings } from '../admin/types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export function useBusinessSettings(): {
  settings: AdminBusinessSettings;
  loading: boolean;
  getWhatsAppUrl: (message: string) => string;
} {
  const [settings, setSettings] = useState<AdminBusinessSettings>({
    ...BUSINESS_CONFIG,
    createdAt: undefined,
    updatedAt: undefined
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const docRef = doc(db, 'settings', 'business_info');
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const d = docSnap.data();
            setSettings({
              name: d.name || BUSINESS_CONFIG.name,
              shortName: d.shortName || BUSINESS_CONFIG.shortName,
              tagline: d.tagline || BUSINESS_CONFIG.tagline,
              heroSubtitle: d.heroSubtitle || BUSINESS_CONFIG.heroSubtitle,
              description: d.description || BUSINESS_CONFIG.description,
              whatsappNumberRaw: d.whatsappNumberRaw || BUSINESS_CONFIG.whatsappNumberRaw,
              whatsappNumberDisplay: d.whatsappNumberDisplay || BUSINESS_CONFIG.whatsappNumberDisplay,
              phoneNumberDisplay: d.phoneNumberDisplay || BUSINESS_CONFIG.phoneNumberDisplay,
              phoneCallUrl: d.phoneCallUrl || BUSINESS_CONFIG.phoneCallUrl,
              email: d.email || BUSINESS_CONFIG.email,
              defaultOrderMessage: d.defaultOrderMessage || BUSINESS_CONFIG.defaultOrderMessage,
              stockfishOrderMessage: d.stockfishOrderMessage || BUSINESS_CONFIG.stockfishOrderMessage,
              crayfishOrderMessage: d.crayfishOrderMessage || BUSINESS_CONFIG.crayfishOrderMessage,
              createdAt: d.createdAt,
              updatedAt: d.updatedAt
            });
          } else {
            // Fallback to static verified config
            setSettings({ ...BUSINESS_CONFIG });
          }
          setLoading(false);
        },
        (error) => {
          // Graceful fallback on permission/network error
          console.warn('Live settings fallback active:', error.message);
          setSettings({ ...BUSINESS_CONFIG });
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch {
      setSettings({ ...BUSINESS_CONFIG });
      setLoading(false);
    }
  }, []);

  const getWhatsAppUrl = (message: string) => {
    return buildWhatsAppUrl(message, settings.whatsappNumberRaw);
  };

  return { settings, loading, getWhatsAppUrl };
}
