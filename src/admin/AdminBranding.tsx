import React, { useState, useEffect, useCallback } from 'react';
import { 
  Palette, 
  Sparkles, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Type, 
  Film, 
  Image as ImageIcon,
  ShieldCheck,
  Check,
  Play,
  HelpCircle
} from 'lucide-react';
import { useBranding } from '../hooks/useBranding';
import { BrandingSettings, HeadingScaleOption, BodyTextSizeOption, ButtonTextSizeOption, NavTextSizeOption, IntroAnimationStyleOption, IntroLogoSizeOption } from '../types/branding';
import { DEFAULT_BRANDING_SETTINGS, BRAND_COLOR_PRESETS, sanitizeBrandName, validateHexColor } from '../config/branding';
import { LogoUploadField } from './components/branding/LogoUploadField';
import { ColorPickerField } from './components/branding/ColorPickerField';
import { BrandingLivePreview } from './components/branding/BrandingLivePreview';
import { IntroAnimationPreviewModal } from './components/branding/IntroAnimationPreviewModal';

export const AdminBranding: React.FC = () => {
  const { branding, loading, error: contextError, saveBranding, resetBranding } = useBranding();

  // Local draft form data
  const [formData, setFormData] = useState<BrandingSettings>({ ...branding });
  const [savedBaseline, setSavedBaseline] = useState<BrandingSettings>({ ...branding });
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'identity' | 'logos' | 'colors' | 'typography' | 'intro'>('all');

  // Sync from context when context loads
  useEffect(() => {
    if (!loading) {
      setFormData({ ...branding });
      setSavedBaseline({ ...branding });
    }
  }, [loading, branding]);

  // Track dirty changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(savedBaseline);

  // Window beforeunload guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Field change helper
  const updateField = <K extends keyof BrandingSettings>(field: K, value: BrandingSettings[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply curated color preset
  const handleApplyPreset = (presetId: string) => {
    const preset = BRAND_COLOR_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setFormData(prev => ({
      ...prev,
      ...preset.colors
    }));
    showToast(`Applied preset: ${preset.name}`);
  };

  // Save changes handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      // Sanitize fields before saving
      const payload: BrandingSettings = {
        ...formData,
        brandName: sanitizeBrandName(formData.brandName, 'FAVORA'),
        brandShortName: sanitizeBrandName(formData.brandShortName, formData.brandName || 'FAVORA'),
        primaryColor: validateHexColor(formData.primaryColor, '#071F16'),
        secondaryColor: validateHexColor(formData.secondaryColor, '#0D3325'),
        accentColor: validateHexColor(formData.accentColor, '#B8954A'),
        backgroundColor: validateHexColor(formData.backgroundColor, '#FAFAFA'),
        surfaceColor: validateHexColor(formData.surfaceColor, '#FFFFFF'),
        textColor: validateHexColor(formData.textColor, '#1A1A1A'),
        mutedTextColor: validateHexColor(formData.mutedTextColor, '#525252'),
        darkModeBackground: validateHexColor(formData.darkModeBackground, '#071F16'),
        darkModeSurface: validateHexColor(formData.darkModeSurface, '#0D3325'),
        introBackgroundColor: validateHexColor(formData.introBackgroundColor, '#051710'),
      };

      await saveBranding(payload);
      setSavedBaseline(payload);
      setFormData(payload);
      showToast('Branding and visual settings saved successfully! Storefront has been updated in real time.');
    } catch (err: any) {
      console.error('[AdminBranding] Save failed:', err);
      showToast(`Failed to save branding settings: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults handler
  const handleConfirmReset = async () => {
    setShowResetConfirm(false);
    setIsSaving(true);
    try {
      await resetBranding();
      setFormData({ ...DEFAULT_BRANDING_SETTINGS });
      setSavedBaseline({ ...DEFAULT_BRANDING_SETTINGS });
      showToast('All branding and visual settings restored to standard factory defaults.');
    } catch (err: any) {
      console.error('[AdminBranding] Reset failed:', err);
      showToast(`Failed to reset branding: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-[#B8954A]" />
        <div className="text-sm font-sans-clean text-[#A3B899]">
          Loading Branding & Appearance configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. Module Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F0E6]">
                Branding & Appearance
              </h1>
              <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean mt-0.5">
                Customize logos, color schemes, typography sizing, and the intro animation without editing source code.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-sans-clean font-semibold uppercase tracking-wider bg-[#071F16] hover:bg-red-950/70 text-[#A3B899] hover:text-red-300 border border-[#16382A] hover:border-red-800/60 rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`
              px-5 py-2 text-xs font-sans-clean font-bold uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-2 transition-all cursor-pointer
              ${hasChanges 
                ? 'bg-[#B8954A] hover:bg-[#C9A65B] text-[#071F16]' 
                : 'bg-[#16382A] text-[#6B7266] cursor-not-allowed'}
              disabled:opacity-50
            `}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Notification Toast Banner */}
      {notification && (
        <div
          className={`
            p-4 rounded-[2px] border flex items-center justify-between gap-3 text-xs font-sans-clean animate-in fade-in slide-in-from-top-2 duration-200
            ${notification.type === 'success'
              ? 'bg-[#0D3325] border-[#B8954A]/50 text-[#F5F0E6]'
              : 'bg-red-950/90 border-red-800 text-red-200'}
          `}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#B8954A] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[11px] font-sans-clean font-semibold uppercase hover:underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Unsaved Changes Sticky Notification */}
      {hasChanges && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-[2px] flex items-center justify-between gap-3 text-xs font-sans-clean text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>You have unsaved branding modifications. Review in the Live Preview below and click <strong>Save Changes</strong>.</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-[10px] rounded-[2px] transition-colors shrink-0"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Section Quick Jump Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Settings' },
          { id: 'identity', label: 'Brand Identity' },
          { id: 'logos', label: 'Logos & Sizing' },
          { id: 'colors', label: 'Colors & Presets' },
          { id: 'typography', label: 'Typography' },
          { id: 'intro', label: 'Intro Animation' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTabSection(tab.id as any)}
            className={`
              px-3.5 py-1.5 rounded-[2px] text-xs font-sans-clean font-semibold whitespace-nowrap transition-colors border
              ${activeTabSection === tab.id
                ? 'bg-[#16382A] text-[#B8954A] border-[#B8954A]/50'
                : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6] hover:border-[#16382A]/80'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Split Layout: Settings Forms on Left + Sticky Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Sections (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* SECTION 1: Brand Identity */}
          {(activeTabSection === 'all' || activeTabSection === 'identity') && (
            <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                      Brand Identity
                    </h3>
                    <p className="text-xs text-[#A3B899] font-sans-clean">
                      Core business titles, tagline, and customer-facing identifiers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Brand Name */}
                <div className="space-y-1.5">
                  <label htmlFor="brandName" className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider flex items-center justify-between">
                    <span>Brand Name</span>
                    <span className="text-[10px] text-[#B8954A] normal-case">Displayed on Navbar, Title, & Receipts</span>
                  </label>
                  <input
                    id="brandName"
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => updateField('brandName', e.target.value)}
                    placeholder="FAVORA"
                    className="w-full px-3.5 py-2 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] rounded-[2px] text-sm text-[#F5F0E6] font-editorial focus:outline-none"
                  />
                </div>

                {/* Short Name / Sub-Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="brandShortName" className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider">
                      Short Name / Mark
                    </label>
                    <input
                      id="brandShortName"
                      type="text"
                      value={formData.brandShortName}
                      onChange={(e) => updateField('brandShortName', e.target.value)}
                      placeholder="FAVORA"
                      className="w-full px-3 py-2 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] rounded-[2px] text-xs text-[#F5F0E6] font-sans-clean focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subTagline" className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider">
                      Sub-Tagline Label
                    </label>
                    <input
                      id="subTagline"
                      type="text"
                      value={formData.subTagline}
                      onChange={(e) => updateField('subTagline', e.target.value)}
                      placeholder="Stockfish & Crayfish Provisions"
                      className="w-full px-3 py-2 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] rounded-[2px] text-xs text-[#F5F0E6] font-sans-clean focus:outline-none"
                    />
                  </div>
                </div>

                {/* Main Tagline */}
                <div className="space-y-1.5">
                  <label htmlFor="brandTagline" className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider flex items-center justify-between">
                    <span>Main Brand Tagline</span>
                    <span className="text-[10px] text-[#A3B899] normal-case">Hero banner & search listings</span>
                  </label>
                  <input
                    id="brandTagline"
                    type="text"
                    value={formData.brandTagline}
                    onChange={(e) => updateField('brandTagline', e.target.value)}
                    placeholder="Stockfish • Crayfish • Seafood"
                    className="w-full px-3.5 py-2 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] rounded-[2px] text-xs text-[#F5F0E6] font-sans-clean focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Logo Management */}
          {(activeTabSection === 'all' || activeTabSection === 'logos') && (
            <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                      Logo Management
                    </h3>
                    <p className="text-xs text-[#A3B899] font-sans-clean">
                      Upload brand assets with transparent backgrounds. If omitted, the default elegant typographic emblem is used.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Logo */}
                <LogoUploadField
                  id="primaryLogoUrl"
                  label="Primary Logo"
                  description="Main logo for navigation and universal branding."
                  recommendedSpec="PNG / SVG • ~300x80px"
                  value={formData.primaryLogoUrl}
                  onChange={(url) => updateField('primaryLogoUrl', url)}
                />

                {/* Dark Mode Logo */}
                <LogoUploadField
                  id="darkModeLogoUrl"
                  label="Dark Mode Logo"
                  description="Optimized light/gold logo for deep green & dark canvases."
                  recommendedSpec="White/Gold text • PNG/SVG"
                  value={formData.darkModeLogoUrl}
                  onChange={(url) => updateField('darkModeLogoUrl', url)}
                  darkPreview
                />

                {/* Light Mode Logo */}
                <LogoUploadField
                  id="lightModeLogoUrl"
                  label="Light Mode Logo"
                  description="Dark emerald/black logo for light backgrounds."
                  recommendedSpec="Dark text • PNG/SVG"
                  value={formData.lightModeLogoUrl}
                  onChange={(url) => updateField('lightModeLogoUrl', url)}
                />

                {/* Mobile / Favicon Logo */}
                <LogoUploadField
                  id="faviconUrl"
                  label="Browser Favicon"
                  description="Small icon rendered inside browser tab."
                  recommendedSpec="32x32px or 64x64px • PNG/ICO"
                  value={formData.faviconUrl}
                  onChange={(url) => updateField('faviconUrl', url)}
                />
              </div>

              {/* Logo Sizing Sliders */}
              <div className="pt-4 border-t border-[#16382A] space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#B8954A]" />
                  <h4 className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6]">
                    Logo Height Controls (Responsive)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Desktop Size */}
                  <div className="bg-[#071F16]/60 border border-[#16382A] p-3 rounded-[2px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans-clean">
                      <span className="text-[#A3B899]">Desktop Height</span>
                      <span className="font-mono text-[#B8954A] font-bold">{formData.desktopLogoSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={90}
                      value={formData.desktopLogoSize}
                      onChange={(e) => updateField('desktopLogoSize', Number(e.target.value))}
                      className="w-full accent-[#B8954A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#6B7266]">
                      <span>20px</span>
                      <span>Default: 40px</span>
                      <span>90px</span>
                    </div>
                  </div>

                  {/* Tablet Size */}
                  <div className="bg-[#071F16]/60 border border-[#16382A] p-3 rounded-[2px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans-clean">
                      <span className="text-[#A3B899]">Tablet Height</span>
                      <span className="font-mono text-[#B8954A] font-bold">{formData.tabletLogoSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={72}
                      value={formData.tabletLogoSize}
                      onChange={(e) => updateField('tabletLogoSize', Number(e.target.value))}
                      className="w-full accent-[#B8954A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#6B7266]">
                      <span>18px</span>
                      <span>Default: 34px</span>
                      <span>72px</span>
                    </div>
                  </div>

                  {/* Mobile Size */}
                  <div className="bg-[#071F16]/60 border border-[#16382A] p-3 rounded-[2px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans-clean">
                      <span className="text-[#A3B899]">Mobile Height</span>
                      <span className="font-mono text-[#B8954A] font-bold">{formData.mobileLogoSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={54}
                      value={formData.mobileLogoSize}
                      onChange={(e) => updateField('mobileLogoSize', Number(e.target.value))}
                      className="w-full accent-[#B8954A] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#6B7266]">
                      <span>16px</span>
                      <span>Default: 28px</span>
                      <span>54px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Colors & Theme Presets */}
          {(activeTabSection === 'all' || activeTabSection === 'colors') && (
            <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                      Colors & Theme Presets
                    </h3>
                    <p className="text-xs text-[#A3B899] font-sans-clean">
                      Choose a curated palette or customize individual brand color values.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Click Curated Presets */}
              <div className="space-y-2.5">
                <label className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6] flex items-center justify-between">
                  <span>Curated Brand Palettes</span>
                  <span className="text-[10px] text-[#A3B899] normal-case">Click to apply instantly</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BRAND_COLOR_PRESETS.map((preset) => {
                    const isCurrent = formData.primaryColor === preset.colors.primaryColor &&
                                      formData.accentColor === preset.colors.accentColor;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.id)}
                        className={`
                          p-3 rounded-[2px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2
                          ${isCurrent 
                            ? 'bg-[#16382A] border-[#B8954A] shadow-xs' 
                            : 'bg-[#071F16] border-[#16382A] hover:border-[#B8954A]/40'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-sans-clean font-bold text-[#F5F0E6]">
                            {preset.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-[#B8954A] font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-[#A3B899] font-sans-clean line-clamp-1">
                          {preset.description}
                        </p>

                        {/* Swatches strip */}
                        <div className="flex items-center gap-1 pt-1">
                          <div className="w-4 h-4 rounded-[1px] border border-white/20" style={{ backgroundColor: preset.colors.primaryColor }} title="Primary" />
                          <div className="w-4 h-4 rounded-[1px] border border-white/20" style={{ backgroundColor: preset.colors.secondaryColor }} title="Secondary" />
                          <div className="w-4 h-4 rounded-[1px] border border-white/20" style={{ backgroundColor: preset.colors.accentColor }} title="Accent" />
                          <div className="w-4 h-4 rounded-[1px] border border-black/20" style={{ backgroundColor: preset.colors.backgroundColor }} title="Light BG" />
                          <div className="w-4 h-4 rounded-[1px] border border-white/20" style={{ backgroundColor: preset.colors.darkModeBackground }} title="Dark BG" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Color Pickers */}
              <div className="pt-4 border-t border-[#16382A] space-y-3">
                <h4 className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6]">
                  Individual Palette Swatches
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerField
                    id="primaryColor"
                    label="Primary Brand"
                    description="Main deep pine background / banners"
                    value={formData.primaryColor}
                    onChange={(hex) => updateField('primaryColor', hex)}
                    defaultColor="#071F16"
                  />

                  <ColorPickerField
                    id="secondaryColor"
                    label="Secondary Brand"
                    description="Card backgrounds & supporting containers"
                    value={formData.secondaryColor}
                    onChange={(hex) => updateField('secondaryColor', hex)}
                    defaultColor="#0D3325"
                  />

                  <ColorPickerField
                    id="accentColor"
                    label="Accent Gold / Amber"
                    description="Call-to-action buttons, badges & stars"
                    value={formData.accentColor}
                    onChange={(hex) => updateField('accentColor', hex)}
                    defaultColor="#B8954A"
                  />

                  <ColorPickerField
                    id="backgroundColor"
                    label="Light Canvas BG"
                    description="Main background for light theme"
                    value={formData.backgroundColor}
                    onChange={(hex) => updateField('backgroundColor', hex)}
                    defaultColor="#FAFAFA"
                  />

                  <ColorPickerField
                    id="surfaceColor"
                    label="Light Surface Card"
                    description="Card containers in light theme"
                    value={formData.surfaceColor}
                    onChange={(hex) => updateField('surfaceColor', hex)}
                    defaultColor="#FFFFFF"
                  />

                  <ColorPickerField
                    id="textColor"
                    label="Primary Text"
                    description="Main headings and body copy"
                    value={formData.textColor}
                    onChange={(hex) => updateField('textColor', hex)}
                    defaultColor="#1A1A1A"
                  />

                  <ColorPickerField
                    id="mutedTextColor"
                    label="Muted Text"
                    description="Secondary subheadings & descriptions"
                    value={formData.mutedTextColor}
                    onChange={(hex) => updateField('mutedTextColor', hex)}
                    defaultColor="#525252"
                  />

                  <ColorPickerField
                    id="darkModeBackground"
                    label="Dark Canvas BG"
                    description="Main dark mode canvas background"
                    value={formData.darkModeBackground}
                    onChange={(hex) => updateField('darkModeBackground', hex)}
                    defaultColor="#071F16"
                  />

                  <ColorPickerField
                    id="darkModeSurface"
                    label="Dark Surface Card"
                    description="Dark mode card container background"
                    value={formData.darkModeSurface}
                    onChange={(hex) => updateField('darkModeSurface', hex)}
                    defaultColor="#0D3325"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Typography & Sizing */}
          {(activeTabSection === 'all' || activeTabSection === 'typography') && (
            <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                      Typography & Sizing Controls
                    </h3>
                    <p className="text-xs text-[#A3B899] font-sans-clean">
                      Adjust font scale proportions for headings, body text, buttons, and navigation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Heading Scale */}
                <div className="bg-[#071F16]/60 border border-[#16382A] p-3.5 rounded-[2px] space-y-2">
                  <label className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6] block">
                    Heading Scale
                  </label>
                  <p className="text-[10px] text-[#A3B899] font-sans-clean">
                    Controls editorial title proportions.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {(['compact', 'standard', 'prominent'] as HeadingScaleOption[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('headingScale', opt)}
                        className={`
                          py-1.5 px-2 text-[11px] font-sans-clean font-semibold capitalize rounded-[2px] border transition-colors
                          ${formData.headingScale === opt
                            ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                            : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Text Size */}
                <div className="bg-[#071F16]/60 border border-[#16382A] p-3.5 rounded-[2px] space-y-2">
                  <label className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6] block">
                    Body Text Size
                  </label>
                  <p className="text-[10px] text-[#A3B899] font-sans-clean">
                    Default base paragraph font size.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {(['small', 'standard', 'large'] as BodyTextSizeOption[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('bodyTextSize', opt)}
                        className={`
                          py-1.5 px-2 text-[11px] font-sans-clean font-semibold capitalize rounded-[2px] border transition-colors
                          ${formData.bodyTextSize === opt
                            ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                            : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Text Size */}
                <div className="bg-[#071F16]/60 border border-[#16382A] p-3.5 rounded-[2px] space-y-2">
                  <label className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6] block">
                    Button Font & Padding
                  </label>
                  <p className="text-[10px] text-[#A3B899] font-sans-clean">
                    Button visual weight across the store.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {(['compact', 'standard', 'large'] as ButtonTextSizeOption[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('buttonTextSize', opt)}
                        className={`
                          py-1.5 px-2 text-[11px] font-sans-clean font-semibold capitalize rounded-[2px] border transition-colors
                          ${formData.buttonTextSize === opt
                            ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                            : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nav Text Size */}
                <div className="bg-[#071F16]/60 border border-[#16382A] p-3.5 rounded-[2px] space-y-2">
                  <label className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6] block">
                    Navigation Links
                  </label>
                  <p className="text-[10px] text-[#A3B899] font-sans-clean">
                    Navbar menu links typography.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {(['compact', 'standard', 'large'] as NavTextSizeOption[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('navTextSize', opt)}
                        className={`
                          py-1.5 px-2 text-[11px] font-sans-clean font-semibold capitalize rounded-[2px] border transition-colors
                          ${formData.navTextSize === opt
                            ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                            : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 5: Intro Animation */}
          {(activeTabSection === 'all' || activeTabSection === 'intro') && (
            <div className="bg-[#0D3325] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#16382A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                      FAVORA Intro Animation
                    </h3>
                    <p className="text-xs text-[#A3B899] font-sans-clean">
                      Configure the opening luxury cinematic splash screen shown to new visitors.
                    </p>
                  </div>
                </div>

                {/* Test Animation Modal Launcher */}
                <button
                  type="button"
                  onClick={() => setShowIntroModal(true)}
                  className="px-3 py-1.5 bg-[#B8954A] hover:bg-[#C9A65B] text-[#071F16] font-sans-clean font-bold text-xs rounded-[2px] uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Intro</span>
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Enable / Disable Switch */}
                <div className="bg-[#071F16]/70 border border-[#16382A] p-4 rounded-[2px] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-sans-clean font-semibold text-[#F5F0E6]">
                      Enable Intro Animation
                    </div>
                    <div className="text-[11px] text-[#A3B899] font-sans-clean">
                      Plays when a visitor first opens the website in their session.
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableIntro}
                      onChange={(e) => updateField('enableIntro', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#16382A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B8954A]"></div>
                  </label>
                </div>

                {/* Duration Slider */}
                <div className="bg-[#071F16]/60 border border-[#16382A] p-4 rounded-[2px] space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans-clean">
                    <span className="font-semibold text-[#F5F0E6]">Animation Duration</span>
                    <span className="font-mono text-[#B8954A] font-bold">{formData.introDuration} seconds</span>
                  </div>
                  <input
                    type="range"
                    min={2.0}
                    max={5.0}
                    step={0.1}
                    value={formData.introDuration}
                    onChange={(e) => updateField('introDuration', Number(parseFloat(e.target.value).toFixed(1)))}
                    className="w-full accent-[#B8954A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#6B7266]">
                    <span>2.0s (Fast)</span>
                    <span>Default: 3.6s</span>
                    <span>5.0s (Cinematic)</span>
                  </div>
                </div>

                {/* Tagline Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="introTagline" className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider">
                      Intro Display Tagline
                    </label>
                    <input
                      id="introTagline"
                      type="text"
                      value={formData.introTagline}
                      onChange={(e) => updateField('introTagline', e.target.value)}
                      placeholder="Stockfish • Crayfish • Seafood"
                      className="w-full px-3 py-2 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] rounded-[2px] text-xs text-[#F5F0E6] font-sans-clean focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider">
                      Intro Animation Style
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['cinematic', 'reveal', 'fade'] as IntroAnimationStyleOption[]).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => updateField('introAnimationStyle', style)}
                          className={`
                            py-2 px-1 text-[11px] font-sans-clean font-semibold capitalize rounded-[2px] border transition-colors
                            ${formData.introAnimationStyle === style
                              ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                              : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                          `}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider">
                      Intro Background
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('introBackground', 'brand')}
                        className={`
                          py-2 px-2 text-xs font-sans-clean font-semibold rounded-[2px] border transition-colors
                          ${formData.introBackground === 'brand'
                            ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                            : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                        `}
                      >
                        Brand Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('introBackground', 'custom')}
                        className={`
                          py-2 px-2 text-xs font-sans-clean font-semibold rounded-[2px] border transition-colors
                          ${formData.introBackground === 'custom'
                            ? 'bg-[#B8954A] text-[#071F16] border-[#B8954A]'
                            : 'bg-[#071F16] text-[#A3B899] border-[#16382A] hover:text-[#F5F0E6]'}
                        `}
                      >
                        Custom Color
                      </button>
                    </div>
                  </div>

                  {formData.introBackground === 'custom' && (
                    <ColorPickerField
                      id="introBackgroundColor"
                      label="Custom Intro BG"
                      description="Custom background color"
                      value={formData.introBackgroundColor}
                      onChange={(hex) => updateField('introBackgroundColor', hex)}
                      defaultColor="#051710"
                    />
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Live Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <BrandingLivePreview settings={formData} />
        </div>

      </div>

      {/* 4. Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D3325] border border-[#16382A] p-6 rounded-[2px] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                  Reset All Branding Settings?
                </h3>
                <p className="text-xs text-[#A3B899] font-sans-clean mt-0.5">
                  This will restore all logos, color palettes, typography scales, and intro configuration to original factory defaults.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#071F16] border border-[#16382A] rounded-[2px] text-xs font-sans-clean text-[#A3B899]">
              Brand Name will revert to <strong>FAVORA</strong> with Signature Nordic Emerald colors.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-sans-clean font-semibold uppercase tracking-wider bg-[#071F16] hover:bg-[#16382A] text-[#A3B899] hover:text-[#F5F0E6] rounded-[2px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-sans-clean font-bold uppercase tracking-wider bg-red-800 hover:bg-red-700 text-white rounded-[2px] transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Intro Animation Test Modal */}
      <IntroAnimationPreviewModal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        settings={formData}
      />

    </div>
  );
};
