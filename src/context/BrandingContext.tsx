import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BrandingSettings } from '../types/branding';
import { DEFAULT_BRANDING_SETTINGS, validateHexColor, sanitizeBrandName } from '../config/branding';

interface BrandingContextValue {
  branding: BrandingSettings;
  loading: boolean;
  error: string | null;
  saveBranding: (newSettings: BrandingSettings) => Promise<boolean>;
  resetBranding: () => Promise<boolean>;
  getEffectiveLogoUrl: (isDark: boolean, isMobile: boolean) => string;
  getLogoHeightPx: (isMobile?: boolean, isTablet?: boolean) => number;
}

const BrandingContext = createContext<BrandingContextValue | undefined>(undefined);

const BRANDING_DOC_PATH = 'settings/branding_settings';
const LOCAL_CACHE_KEY = 'favora_branding_cache_v1';

function sanitizeBrandingPayload(input: Partial<BrandingSettings>): BrandingSettings {
  const brandName = sanitizeBrandName(input.brandName, DEFAULT_BRANDING_SETTINGS.brandName);
  const brandShortName = sanitizeBrandName(input.brandShortName, brandName);

  return {
    brandName,
    brandShortName,
    brandTagline: input.brandTagline?.trim() || DEFAULT_BRANDING_SETTINGS.brandTagline,
    subTagline: input.subTagline?.trim() || DEFAULT_BRANDING_SETTINGS.subTagline,

    primaryLogoUrl: input.primaryLogoUrl?.trim() || '',
    darkModeLogoUrl: input.darkModeLogoUrl?.trim() || '',
    lightModeLogoUrl: input.lightModeLogoUrl?.trim() || '',
    mobileLogoUrl: input.mobileLogoUrl?.trim() || '',
    faviconUrl: input.faviconUrl?.trim() || '',

    desktopLogoSize: typeof input.desktopLogoSize === 'number' 
      ? Math.max(20, Math.min(90, Math.round(input.desktopLogoSize))) 
      : DEFAULT_BRANDING_SETTINGS.desktopLogoSize,
    tabletLogoSize: typeof input.tabletLogoSize === 'number' 
      ? Math.max(18, Math.min(72, Math.round(input.tabletLogoSize))) 
      : DEFAULT_BRANDING_SETTINGS.tabletLogoSize,
    mobileLogoSize: typeof input.mobileLogoSize === 'number' 
      ? Math.max(16, Math.min(54, Math.round(input.mobileLogoSize))) 
      : DEFAULT_BRANDING_SETTINGS.mobileLogoSize,

    primaryColor: validateHexColor(input.primaryColor, DEFAULT_BRANDING_SETTINGS.primaryColor),
    secondaryColor: validateHexColor(input.secondaryColor, DEFAULT_BRANDING_SETTINGS.secondaryColor),
    accentColor: validateHexColor(input.accentColor, DEFAULT_BRANDING_SETTINGS.accentColor),
    backgroundColor: validateHexColor(input.backgroundColor, DEFAULT_BRANDING_SETTINGS.backgroundColor),
    surfaceColor: validateHexColor(input.surfaceColor, DEFAULT_BRANDING_SETTINGS.surfaceColor),
    textColor: validateHexColor(input.textColor, DEFAULT_BRANDING_SETTINGS.textColor),
    mutedTextColor: validateHexColor(input.mutedTextColor, DEFAULT_BRANDING_SETTINGS.mutedTextColor),
    darkModeBackground: validateHexColor(input.darkModeBackground, DEFAULT_BRANDING_SETTINGS.darkModeBackground),
    darkModeSurface: validateHexColor(input.darkModeSurface, DEFAULT_BRANDING_SETTINGS.darkModeSurface),

    headingScale: input.headingScale || DEFAULT_BRANDING_SETTINGS.headingScale,
    bodyTextSize: input.bodyTextSize || DEFAULT_BRANDING_SETTINGS.bodyTextSize,
    buttonTextSize: input.buttonTextSize || DEFAULT_BRANDING_SETTINGS.buttonTextSize,
    navTextSize: input.navTextSize || DEFAULT_BRANDING_SETTINGS.navTextSize,

    enableIntro: typeof input.enableIntro === 'boolean' ? input.enableIntro : DEFAULT_BRANDING_SETTINGS.enableIntro,
    introDuration: typeof input.introDuration === 'number' 
      ? Math.max(2.0, Math.min(5.0, Number(input.introDuration.toFixed(1)))) 
      : DEFAULT_BRANDING_SETTINGS.introDuration,
    introLogoSize: input.introLogoSize || DEFAULT_BRANDING_SETTINGS.introLogoSize,
    introBackground: input.introBackground || DEFAULT_BRANDING_SETTINGS.introBackground,
    introBackgroundColor: validateHexColor(input.introBackgroundColor, DEFAULT_BRANDING_SETTINGS.introBackgroundColor),
    introTagline: input.introTagline?.trim() || DEFAULT_BRANDING_SETTINGS.introTagline,
    showIntroTagline: typeof input.showIntroTagline === 'boolean' ? input.showIntroTagline : DEFAULT_BRANDING_SETTINGS.showIntroTagline,
    introAnimationStyle: input.introAnimationStyle || DEFAULT_BRANDING_SETTINGS.introAnimationStyle,

    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        return sanitizeBrandingPayload(JSON.parse(cached));
      }
    } catch {
      // Ignore storage read error
    }
    return DEFAULT_BRANDING_SETTINGS;
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Apply CSS custom properties dynamically to :root
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', branding.primaryColor);
      root.style.setProperty('--brand-secondary', branding.secondaryColor);
      root.style.setProperty('--brand-accent', branding.accentColor);
      root.style.setProperty('--brand-bg', branding.backgroundColor);
      root.style.setProperty('--brand-surface', branding.surfaceColor);
      root.style.setProperty('--brand-text', branding.textColor);
      root.style.setProperty('--brand-muted', branding.mutedTextColor);
      root.style.setProperty('--brand-dark-bg', branding.darkModeBackground);
      root.style.setProperty('--brand-dark-surface', branding.darkModeSurface);

      // Handle custom favicon
      if (branding.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = branding.faviconUrl;
      }
    } catch (e) {
      console.warn('[Branding] Failed to apply root CSS variables:', e);
    }
  }, [branding]);

  // Real-time Firestore synchronization with snapshot listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      const docRef = doc(db, 'settings', 'branding_settings');
      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const rawData = snapshot.data();
            const clean = sanitizeBrandingPayload(rawData as Partial<BrandingSettings>);
            setBranding(clean);
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(clean));
            } catch {
              // Ignore cache write error
            }
          } else {
            // Document doesn't exist yet -> retain defaults
            setBranding(DEFAULT_BRANDING_SETTINGS);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('[Branding] Snapshot error, using cached/default branding:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('[Branding] Listener initialization failed:', err);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save new branding settings
  const saveBranding = useCallback(async (newSettings: BrandingSettings): Promise<boolean> => {
    try {
      const clean = sanitizeBrandingPayload({
        ...newSettings,
        updatedAt: new Date().toISOString(),
        createdAt: branding.createdAt || new Date().toISOString(),
      });

      const docRef = doc(db, 'settings', 'branding_settings');
      await setDoc(docRef, clean, { merge: true });

      setBranding(clean);
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(clean));
      } catch {
        // Ignore cache write error
      }
      return true;
    } catch (err: any) {
      console.error('[Branding] Failed to save branding settings:', err);
      throw err;
    }
  }, [branding.createdAt]);

  // Reset branding to factory defaults
  const resetBranding = useCallback(async (): Promise<boolean> => {
    try {
      const defaults = {
        ...DEFAULT_BRANDING_SETTINGS,
        updatedAt: new Date().toISOString(),
      };
      const docRef = doc(db, 'settings', 'branding_settings');
      await setDoc(docRef, defaults, { merge: true });

      setBranding(defaults);
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(defaults));
      } catch {
        // Ignore cache write error
      }
      return true;
    } catch (err: any) {
      console.error('[Branding] Failed to reset branding settings:', err);
      throw err;
    }
  }, []);

  // Compute effective logo based on theme and device context
  const getEffectiveLogoUrl = useCallback((isDark: boolean, isMobile: boolean): string => {
    if (isMobile && branding.mobileLogoUrl) {
      return branding.mobileLogoUrl;
    }
    if (isDark && branding.darkModeLogoUrl) {
      return branding.darkModeLogoUrl;
    }
    if (!isDark && branding.lightModeLogoUrl) {
      return branding.lightModeLogoUrl;
    }
    return branding.primaryLogoUrl || '';
  }, [branding]);

  // Compute effective logo height in pixels
  const getLogoHeightPx = useCallback((isMobile?: boolean, isTablet?: boolean): number => {
    if (isMobile) return branding.mobileLogoSize || 28;
    if (isTablet) return branding.tabletLogoSize || 34;
    return branding.desktopLogoSize || 40;
  }, [branding]);

  const value: BrandingContextValue = {
    branding,
    loading,
    error,
    saveBranding,
    resetBranding,
    getEffectiveLogoUrl,
    getLogoHeightPx,
  };

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
};

export const useBranding = (): BrandingContextValue => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
