import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BUSINESS_CONFIG } from '../config/business';
import { AdminBusinessSettings } from '../admin/types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

// ============================================================================
// IN-MEMORY SINGLETON CACHE & REQUEST DEDUPLICATION
// ============================================================================
// Cache TTL: 30 minutes (business settings change very rarely)
const CACHE_TTL_MS = 30 * 60 * 1000;

// Error backoff TTL: If Firestore returns quota exhausted or network error,
// avoid hammering Firestore on subsequent mounts for 5 minutes.
const ERROR_BACKOFF_MS = 5 * 60 * 1000;

interface SettingsCacheState {
  data: AdminBusinessSettings;
  timestamp: number;
  isFetched: boolean;
}

// Permanent Customer-Facing Brand Name Constant
export const PERMANENT_BRAND_NAME = "FAVORA";

/**
 * Sanitizes any text string from Firestore to guarantee the customer-facing
 * brand name is strictly FAVORA, removing any old legacy business names.
 */
function sanitizeBrandText(text?: string, fallback: string = ''): string {
  if (!text) return fallback;
  return text
    .replace(/Favour\s+Business\s+Ventures/gi, PERMANENT_BRAND_NAME)
    .replace(/Favour\s+Business/gi, PERMANENT_BRAND_NAME)
    .replace(/\bFBV\b/gi, PERMANENT_BRAND_NAME);
}

const defaultSettings: AdminBusinessSettings = {
  ...BUSINESS_CONFIG,
  name: PERMANENT_BRAND_NAME,
  shortName: PERMANENT_BRAND_NAME,
  createdAt: undefined,
  updatedAt: undefined
};

let cachedState: SettingsCacheState = {
  data: defaultSettings,
  timestamp: 0,
  isFetched: false
};

// In-flight promise to deduplicate simultaneous calls across multiple mounting components
let inFlightFetchPromise: Promise<AdminBusinessSettings> | null = null;
let lastErrorTimestamp = 0;

// Listeners to notify all active hook instances when fresh settings arrive
type Listener = (settings: AdminBusinessSettings) => void;
const subscribers = new Set<Listener>();

function notifySubscribers(newSettings: AdminBusinessSettings) {
  subscribers.forEach((callback) => {
    try {
      callback(newSettings);
    } catch {
      // Ignore subscriber notification error
    }
  });
}

async function fetchBusinessSettingsSingle(): Promise<AdminBusinessSettings> {
  const now = Date.now();

  // 1. Return fresh cached data if within TTL
  if (cachedState.isFetched && now - cachedState.timestamp < CACHE_TTL_MS) {
    return cachedState.data;
  }

  // 2. If recent error occurred (e.g. quota exhausted), return fallback without spamming Firestore
  if (lastErrorTimestamp > 0 && now - lastErrorTimestamp < ERROR_BACKOFF_MS) {
    return cachedState.isFetched ? cachedState.data : defaultSettings;
  }

  // 3. Return existing in-flight request if already in progress
  if (inFlightFetchPromise) {
    return inFlightFetchPromise;
  }

  // 4. Initiate single getDoc request
  inFlightFetchPromise = (async () => {
    try {
      const docRef = doc(db, 'settings', 'business_info');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const d = docSnap.data();
        const freshSettings: AdminBusinessSettings = {
          // Permanent customer-facing brand name is ALWAYS FAVORA
          name: PERMANENT_BRAND_NAME,
          shortName: PERMANENT_BRAND_NAME,
          tagline: sanitizeBrandText(d.tagline, BUSINESS_CONFIG.tagline),
          heroSubtitle: sanitizeBrandText(d.heroSubtitle, BUSINESS_CONFIG.heroSubtitle),
          description: sanitizeBrandText(d.description, BUSINESS_CONFIG.description),
          whatsappNumberRaw: d.whatsappNumberRaw || BUSINESS_CONFIG.whatsappNumberRaw,
          whatsappNumberDisplay: d.whatsappNumberDisplay || BUSINESS_CONFIG.whatsappNumberDisplay,
          phoneNumberDisplay: d.phoneNumberDisplay || BUSINESS_CONFIG.phoneNumberDisplay,
          phoneCallUrl: d.phoneCallUrl || BUSINESS_CONFIG.phoneCallUrl,
          email: d.email || BUSINESS_CONFIG.email,
          defaultOrderMessage: sanitizeBrandText(d.defaultOrderMessage, BUSINESS_CONFIG.defaultOrderMessage),
          stockfishOrderMessage: sanitizeBrandText(d.stockfishOrderMessage, BUSINESS_CONFIG.stockfishOrderMessage),
          crayfishOrderMessage: sanitizeBrandText(d.crayfishOrderMessage, BUSINESS_CONFIG.crayfishOrderMessage),
          createdAt: d.createdAt,
          updatedAt: d.updatedAt
        };

        cachedState = {
          data: freshSettings,
          timestamp: Date.now(),
          isFetched: true
        };
        lastErrorTimestamp = 0;
        notifySubscribers(freshSettings);
        return freshSettings;
      } else {
        // Document does not exist, use verified static config
        const fallback: AdminBusinessSettings = { ...defaultSettings };
        cachedState = {
          data: fallback,
          timestamp: Date.now(),
          isFetched: true
        };
        lastErrorTimestamp = 0;
        notifySubscribers(fallback);
        return fallback;
      }
    } catch (error: unknown) {
      // Graceful fallback on permission/quota/network error
      const errMsg = error instanceof Error ? error.message : 'Unknown Firestore error';
      console.warn('Live settings fallback active (cached/fallback in use):', errMsg);
      lastErrorTimestamp = Date.now();
      
      const fallback = cachedState.isFetched ? cachedState.data : defaultSettings;
      return fallback;
    } finally {
      inFlightFetchPromise = null;
    }
  })();

  return inFlightFetchPromise;
}

export function useBusinessSettings(): {
  settings: AdminBusinessSettings;
  loading: boolean;
  getWhatsAppUrl: (message: string) => string;
} {
  const [settings, setSettings] = useState<AdminBusinessSettings>(cachedState.data);
  const [loading, setLoading] = useState<boolean>(!cachedState.isFetched);

  useEffect(() => {
    let isMounted = true;

    // Register subscriber for updates
    const handleUpdate: Listener = (newSettings) => {
      if (isMounted) {
        setSettings(newSettings);
        setLoading(false);
      }
    };
    subscribers.add(handleUpdate);

    // If we already have fresh cached data, sync immediately
    if (cachedState.isFetched && Date.now() - cachedState.timestamp < CACHE_TTL_MS) {
      setSettings(cachedState.data);
      setLoading(false);
    } else {
      // Execute shared deduplicated fetch
      fetchBusinessSettingsSingle().then((res) => {
        if (isMounted) {
          setSettings(res);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
      subscribers.delete(handleUpdate);
    };
  }, []);

  const getWhatsAppUrl = (message: string) => {
    return buildWhatsAppUrl(message, settings.whatsappNumberRaw);
  };

  return { settings, loading, getWhatsAppUrl };
}

