import { BrandingSettings, BrandColorPreset } from '../types/branding';

export const DEFAULT_BRANDING_SETTINGS: BrandingSettings = {
  // Brand Identity
  brandName: 'FAVORA',
  brandShortName: 'FAVORA',
  brandTagline: 'Stockfish • Crayfish • Seafood',
  subTagline: 'Stockfish & Crayfish Provisions',

  // Logo Management (empty strings mean fallback to elegant typographic brand mark)
  primaryLogoUrl: '',
  darkModeLogoUrl: '',
  lightModeLogoUrl: '',
  mobileLogoUrl: '',
  faviconUrl: '',

  // Logo Sizing Controls (height in px)
  desktopLogoSize: 40,
  tabletLogoSize: 34,
  mobileLogoSize: 28,

  // Brand Colors
  primaryColor: '#071F16',       // Deep Forest Emerald
  secondaryColor: '#0D3325',     // Rich Evergreen Pine
  accentColor: '#B8954A',        // Warm Amber Gold
  backgroundColor: '#FAFAFA',    // Clean Oyster Light
  surfaceColor: '#FFFFFF',       // Card / Panel Pure White
  textColor: '#1A1A1A',          // High-contrast primary text
  mutedTextColor: '#525252',     // Readable secondary text
  darkModeBackground: '#071F16', // Dark canvas
  darkModeSurface: '#0D3325',    // Dark card surface

  // Typography & Sizing Controls
  headingScale: 'standard',
  bodyTextSize: 'standard',
  buttonTextSize: 'standard',
  navTextSize: 'standard',

  // Intro Animation Settings
  enableIntro: true,
  introDuration: 3.6,
  introLogoSize: 'medium',
  introBackground: 'brand',
  introBackgroundColor: '#051710',
  introTagline: 'Stockfish • Crayfish • Seafood',
  showIntroTagline: true,
  introAnimationStyle: 'cinematic',
};

export const BRAND_COLOR_PRESETS: BrandColorPreset[] = [
  {
    id: 'signature-emerald',
    name: 'Signature Nordic Emerald',
    description: 'Heritage Norwegian pine forest paired with golden wheat accents and clean oyster light backgrounds.',
    colors: {
      primaryColor: '#071F16',
      secondaryColor: '#0D3325',
      accentColor: '#B8954A',
      backgroundColor: '#FAFAFA',
      surfaceColor: '#FFFFFF',
      textColor: '#1A1A1A',
      mutedTextColor: '#525252',
      darkModeBackground: '#071F16',
      darkModeSurface: '#0D3325',
    }
  },
  {
    id: 'royal-navy-gold',
    name: 'Royal Ocean & Amber',
    description: 'Deep Atlantic maritime navy balanced with warm golden sun rays and maritime coastal clarity.',
    colors: {
      primaryColor: '#0A192F',
      secondaryColor: '#112240',
      accentColor: '#D4AF37',
      backgroundColor: '#F8FAFC',
      surfaceColor: '#FFFFFF',
      textColor: '#0F172A',
      mutedTextColor: '#475569',
      darkModeBackground: '#0A192F',
      darkModeSurface: '#112240',
    }
  },
  {
    id: 'artisan-terracotta',
    name: 'Artisan Spice & Ochre',
    description: 'Warm Oron coastal terracotta and bronze ochre reminiscent of authentic seafood smoking kilns.',
    colors: {
      primaryColor: '#2B170E',
      secondaryColor: '#3F2314',
      accentColor: '#C86D3A',
      backgroundColor: '#FDFBF7',
      surfaceColor: '#FFFFFF',
      textColor: '#291811',
      mutedTextColor: '#63483D',
      darkModeBackground: '#1C100A',
      darkModeSurface: '#2B170E',
    }
  },
  {
    id: 'modern-monochrome',
    name: 'Contemporary Obsidian',
    description: 'Refined editorial charcoal and metallic titanium accents with ultra-high contrast minimalism.',
    colors: {
      primaryColor: '#121212',
      secondaryColor: '#1E1E1E',
      accentColor: '#A3B899',
      backgroundColor: '#F7F7F7',
      surfaceColor: '#FFFFFF',
      textColor: '#111111',
      mutedTextColor: '#555555',
      darkModeBackground: '#121212',
      darkModeSurface: '#1E1E1E',
    }
  }
];

export function validateHexColor(hex?: string, fallback: string = '#071F16'): string {
  if (!hex || typeof hex !== 'string') return fallback;
  const clean = hex.trim();
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(clean)) {
    return clean;
  }
  return fallback;
}

export function sanitizeBrandName(name?: string, fallback: string = 'FAVORA'): string {
  if (!name || typeof name !== 'string') return fallback;
  const trimmed = name.trim();
  if (!trimmed) return fallback;
  // Prevent old unwanted business names
  return trimmed
    .replace(/Favour\s+Business\s+Ventures/gi, 'FAVORA')
    .replace(/Favour\s+Business/gi, 'FAVORA')
    .replace(/\bFBV\b/gi, 'FAVORA');
}
