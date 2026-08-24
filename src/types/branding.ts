export type HeadingScaleOption = 'compact' | 'standard' | 'prominent';
export type BodyTextSizeOption = 'small' | 'standard' | 'large';
export type ButtonTextSizeOption = 'compact' | 'standard' | 'large';
export type NavTextSizeOption = 'compact' | 'standard' | 'large';
export type IntroAnimationStyleOption = 'fade' | 'reveal' | 'cinematic';
export type IntroLogoSizeOption = 'small' | 'medium' | 'large';
export type IntroBackgroundOption = 'brand' | 'custom';

export interface BrandingSettings {
  // 1. Brand Identity
  brandName: string;
  brandShortName: string;
  brandTagline: string;
  subTagline: string;

  // 2. Logo Management
  primaryLogoUrl: string;
  darkModeLogoUrl: string;
  lightModeLogoUrl: string;
  mobileLogoUrl: string;
  faviconUrl: string;

  // 3. Logo Sizing Controls (in pixels)
  desktopLogoSize: number; // 20px - 90px (default 40px)
  tabletLogoSize: number;  // 18px - 72px (default 34px)
  mobileLogoSize: number;  // 16px - 54px (default 28px)

  // 4. Brand Colors
  primaryColor: string;       // Main brand color (default #071F16)
  secondaryColor: string;     // Supporting dark brand color (default #0D3325)
  accentColor: string;        // Accent / highlight / gold (default #B8954A)
  backgroundColor: string;    // Main light-mode background (default #FAFAFA)
  surfaceColor: string;       // Main light-mode card/surface (default #FFFFFF)
  textColor: string;          // Primary text (default #1A1A1A)
  mutedTextColor: string;     // Secondary/muted text (default #525252)
  darkModeBackground: string; // Dark theme canvas (default #071F16)
  darkModeSurface: string;    // Dark theme surface (default #0D3325)

  // 5. Typography & Sizing Controls
  headingScale: HeadingScaleOption;
  bodyTextSize: BodyTextSizeOption;
  buttonTextSize: ButtonTextSizeOption;
  navTextSize: NavTextSizeOption;

  // 6. Intro Animation Settings
  enableIntro: boolean;
  introDuration: number; // 2.0 to 5.0 seconds
  introLogoSize: IntroLogoSizeOption;
  introBackground: IntroBackgroundOption;
  introBackgroundColor: string;
  introTagline: string;
  showIntroTagline: boolean;
  introAnimationStyle: IntroAnimationStyleOption;

  createdAt?: string;
  updatedAt?: string;
}

export interface BrandColorPreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    mutedTextColor: string;
    darkModeBackground: string;
    darkModeSurface: string;
  };
}
