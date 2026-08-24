import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  MessageCircle, 
  Phone, 
  Mail, 
  Building2, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BUSINESS_CONFIG } from '../config/business';
import { AdminBusinessSettings } from './types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSettings, setSavedSettings] = useState<AdminBusinessSettings>({ ...BUSINESS_CONFIG });
  const [formData, setFormData] = useState<AdminBusinessSettings>({ ...BUSINESS_CONFIG });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Load existing settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'settings', 'business_info');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const d = docSnap.data();
          const sanitizeBrand = (val?: string) => (!val || val.includes('Favour') ? 'FAVORA' : val);
          const sanitizeText = (text?: string, fallback: string = '') => {
            if (!text) return fallback;
            return text
              .replace(/Favour\s+Business\s+Ventures/gi, 'FAVORA')
              .replace(/Favour\s+Business/gi, 'FAVORA')
              .replace(/\bFBV\b/gi, 'FAVORA');
          };

          const loaded: AdminBusinessSettings = {
            name: sanitizeBrand(d.name),
            shortName: sanitizeBrand(d.shortName),
            tagline: sanitizeText(d.tagline, BUSINESS_CONFIG.tagline),
            heroSubtitle: sanitizeText(d.heroSubtitle, BUSINESS_CONFIG.heroSubtitle),
            description: sanitizeText(d.description, BUSINESS_CONFIG.description),
            whatsappNumberRaw: d.whatsappNumberRaw || BUSINESS_CONFIG.whatsappNumberRaw,
            whatsappNumberDisplay: d.whatsappNumberDisplay || BUSINESS_CONFIG.whatsappNumberDisplay,
            phoneNumberDisplay: d.phoneNumberDisplay || BUSINESS_CONFIG.phoneNumberDisplay,
            phoneCallUrl: d.phoneCallUrl || BUSINESS_CONFIG.phoneCallUrl,
            email: d.email || BUSINESS_CONFIG.email,
            defaultOrderMessage: sanitizeText(d.defaultOrderMessage, BUSINESS_CONFIG.defaultOrderMessage),
            stockfishOrderMessage: sanitizeText(d.stockfishOrderMessage, BUSINESS_CONFIG.stockfishOrderMessage),
            crayfishOrderMessage: sanitizeText(d.crayfishOrderMessage, BUSINESS_CONFIG.crayfishOrderMessage),
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          };
          setSavedSettings(loaded);
          setFormData(loaded);
        } else {
          // Default baseline
          setSavedSettings({ ...BUSINESS_CONFIG });
          setFormData({ ...BUSINESS_CONFIG });
        }
      } catch (err: any) {
        console.error('Failed to load business settings:', err);
        showNotification(`Could not load settings from Firestore: ${err.message}`, 'error');
        // Fallback to static verified config
        setSavedSettings({ ...BUSINESS_CONFIG });
        setFormData({ ...BUSINESS_CONFIG });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Compute whether there are unsaved modifications
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(savedSettings);

  // Field change handler
  const handleChange = (field: keyof AdminBusinessSettings, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      
      // Convenience automatic synchronization for phone call URLs if raw WhatsApp number is altered
      if (field === 'whatsappNumberRaw') {
        const cleaned = value.replace(/[^0-9]/g, '');
        next.whatsappNumberRaw = cleaned;
        if (prev.phoneCallUrl === `tel:+${prev.whatsappNumberRaw}`) {
          next.phoneCallUrl = `tel:+${cleaned}`;
        }
      }
      
      return next;
    });
  };

  // Reset unsaved changes back to last saved state
  const handleResetUnsaved = () => {
    setFormData({ ...savedSettings });
    showNotification('Unsaved changes discarded.');
  };

  // Restore baseline defaults from src/config/business.ts
  const handleRestoreBaseline = () => {
    setFormData({
      ...BUSINESS_CONFIG,
      createdAt: savedSettings.createdAt,
      updatedAt: savedSettings.updatedAt
    });
    showNotification('Loaded baseline default configuration. Click "Save Settings" to apply.');
  };

  // Save changes to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      showNotification('Business Name is required.', 'error');
      return;
    }
    if (!formData.whatsappNumberRaw.trim()) {
      showNotification('Raw WhatsApp number is required for order routing.', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showNotification('Email address is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: AdminBusinessSettings = {
        name: formData.name.trim(),
        shortName: formData.shortName.trim() || 'FAVORA',
        tagline: formData.tagline.trim(),
        heroSubtitle: formData.heroSubtitle.trim(),
        description: formData.description.trim(),
        whatsappNumberRaw: formData.whatsappNumberRaw.trim(),
        whatsappNumberDisplay: formData.whatsappNumberDisplay.trim(),
        phoneNumberDisplay: formData.phoneNumberDisplay.trim(),
        phoneCallUrl: formData.phoneCallUrl.trim(),
        email: formData.email.trim(),
        defaultOrderMessage: formData.defaultOrderMessage.trim(),
        stockfishOrderMessage: formData.stockfishOrderMessage.trim(),
        crayfishOrderMessage: formData.crayfishOrderMessage.trim(),
        createdAt: savedSettings.createdAt || now,
        updatedAt: now
      };

      const docRef = doc(db, 'settings', 'business_info');
      await setDoc(docRef, payload, { merge: true });

      setSavedSettings(payload);
      setFormData(payload);
      showNotification('Business settings successfully saved and published live!');
    } catch (err: any) {
      console.error('Failed to save business settings:', err);
      showNotification(`Save failed: ${err.message || 'Permission denied. Verify admin authentication.'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // WhatsApp preview url
  const sampleWhatsAppUrl = buildWhatsAppUrl(formData.defaultOrderMessage, formData.whatsappNumberRaw);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-[2px] shadow-2xl text-xs font-sans-clean font-medium border ${
          notification.type === 'success' 
            ? 'bg-[#071F16] border-[#B8954A] text-[#F5F0E6]' 
            : 'bg-rose-950 border-rose-600 text-rose-100'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#B8954A] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8954A]" />
            <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
              Configuration & Contacts
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F0E6]">
            Business Settings
          </h1>
          <p className="text-xs text-[#A3B899] font-sans-clean">
            Manage contact channels, WhatsApp ordering phone numbers, and direct messaging templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              type="button"
              onClick={handleResetUnsaved}
              disabled={saving || loading}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#0D3325] hover:bg-[#16382A] border border-[#16382A] text-[#A3B899] hover:text-[#F5F0E6] text-xs font-sans-clean tracking-wider uppercase rounded-[2px] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Changes</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRestoreBaseline}
            disabled={saving || loading}
            className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#0D3325] hover:bg-[#16382A] border border-[#B8954A]/30 text-[#F5F0E6] text-xs font-sans-clean tracking-wider uppercase rounded-[2px] cursor-pointer"
            title="Reload initial verified static config"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B8954A]" />
            <span>Load Baseline</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading || !hasChanges}
            className={`btn-tactile inline-flex items-center gap-2 px-6 py-2.5 text-xs font-sans-clean font-semibold tracking-wider uppercase rounded-[2px] shadow-md transition-all ${
              hasChanges && !saving && !loading
                ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] cursor-pointer'
                : 'bg-[#16382A] text-[#6B7266] cursor-not-allowed opacity-70'
            }`}
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-[#071F16] border border-[#16382A] rounded-[2px] text-[#A3B899]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#B8954A]" />
          <span className="text-xs font-sans-clean">Loading business configuration...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">

          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#071F16] border border-[#16382A] rounded-[2px]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-sans-clean">
                <span className="text-[#A3B899]">Configuration State:</span>
                {hasChanges ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold uppercase tracking-wider bg-amber-950/70 border border-amber-600/40 text-amber-300">
                    Unsaved Edits Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    Synchronized with Storefront
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-sans-clean text-[#6B7266]">
              {savedSettings.updatedAt && (
                <span>Last saved: {new Date(savedSettings.updatedAt).toLocaleString()}</span>
              )}
              <span className="flex items-center gap-1 text-[#A3B899]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8954A]" />
                Admin write protected
              </span>
            </div>
          </div>

          {/* Section 1: Business Identity */}
          <div className="bg-[#071F16] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#16382A]">
              <Building2 className="w-4 h-4 text-[#B8954A]" />
              <h2 className="font-editorial text-lg text-[#F5F0E6] font-semibold">
                Business Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Business Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Registered Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Short Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Short Name / Brand Abbreviation
                </label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => handleChange('shortName', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Tagline / Specialization
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Business Description */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Business Description (Footer & Meta)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Channels & WhatsApp Ordering */}
          <div className="bg-[#071F16] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#16382A]">
              <MessageCircle className="w-4 h-4 text-[#B8954A]" />
              <h2 className="font-editorial text-lg text-[#F5F0E6] font-semibold">
                Direct Contact & WhatsApp Ordering
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* WhatsApp Raw Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    WhatsApp Number (International Digits Only) *
                  </label>
                  <span className="text-[10px] text-[#B8954A] font-mono">
                    e.g. 2348030000000
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.whatsappNumberRaw}
                  onChange={(e) => handleChange('whatsappNumberRaw', e.target.value)}
                  placeholder="2348030000000"
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-mono focus:outline-none"
                />
                <p className="text-[10px] text-[#6B7266] font-sans-clean">
                  Used directly in <code className="text-[#A3B899]">wa.me/[number]</code> links. Do not include + or spaces.
                </p>
              </div>

              {/* WhatsApp Display Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  WhatsApp Formatted Display *
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsappNumberDisplay}
                  onChange={(e) => handleChange('whatsappNumberDisplay', e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
                <p className="text-[10px] text-[#6B7266] font-sans-clean">
                  Visible to customers in the navbar, contact cards, and footer.
                </p>
              </div>

              {/* Phone Display */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Direct Phone Call Display
                </label>
                <input
                  type="text"
                  value={formData.phoneNumberDisplay}
                  onChange={(e) => handleChange('phoneNumberDisplay', e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Phone Call URL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Phone Call URL Link
                </label>
                <input
                  type="text"
                  value={formData.phoneCallUrl}
                  onChange={(e) => handleChange('phoneCallUrl', e.target.value)}
                  placeholder="tel:+2348030000000"
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-mono focus:outline-none"
                />
              </div>

              {/* Email Address */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Official Inquiries Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="favourbusinessventures@gmail.com"
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: WhatsApp Pre-filled Order Templates */}
          <div className="bg-[#071F16] border border-[#16382A] p-5 sm:p-6 rounded-[2px] space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#16382A]">
              <FileText className="w-4 h-4 text-[#B8954A]" />
              <h2 className="font-editorial text-lg text-[#F5F0E6] font-semibold">
                WhatsApp Order Message Templates
              </h2>
            </div>

            <div className="space-y-4">
              {/* Default General Order Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  General Order / Inquiries Message (Nav, Floating Button, Footer)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.defaultOrderMessage}
                  onChange={(e) => handleChange('defaultOrderMessage', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none leading-relaxed"
                />
              </div>

              {/* Stockfish Order Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Stockfish Catalog Inquiry Template
                </label>
                <textarea
                  rows={2}
                  value={formData.stockfishOrderMessage}
                  onChange={(e) => handleChange('stockfishOrderMessage', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none leading-relaxed"
                />
              </div>

              {/* Crayfish Order Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Crayfish Catalog Inquiry Template
                </label>
                <textarea
                  rows={2}
                  value={formData.crayfishOrderMessage}
                  onChange={(e) => handleChange('crayfishOrderMessage', e.target.value)}
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Test WhatsApp Link Preview */}
            <div className="pt-4 border-t border-[#16382A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D3325]/40 p-3.5 rounded-[2px]">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#F5F0E6] font-sans-clean flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Link Verification</span>
                </div>
                <div className="text-[10px] text-[#A3B899] font-mono truncate max-w-lg">
                  {sampleWhatsAppUrl}
                </div>
              </div>

              <a
                href={sampleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#071F16] hover:bg-[#16382A] border border-[#B8954A]/40 text-[#F5F0E6] text-xs rounded-[2px] font-sans-clean shrink-0 transition-colors"
              >
                <span>Test Chat Link</span>
                <ExternalLink className="w-3 h-3 text-[#B8954A]" />
              </a>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#16382A]">
            {hasChanges && (
              <button
                type="button"
                onClick={handleResetUnsaved}
                disabled={saving}
                className="px-4 py-2 text-xs font-sans-clean uppercase tracking-wider text-[#A3B899] hover:text-[#F5F0E6] cursor-pointer"
              >
                Discard Changes
              </button>
            )}

            <button
              type="submit"
              disabled={saving || !hasChanges}
              className={`btn-tactile inline-flex items-center gap-2 px-7 py-3 text-xs font-sans-clean font-semibold tracking-wider uppercase rounded-[2px] shadow-md transition-all ${
                hasChanges && !saving
                  ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] cursor-pointer'
                  : 'bg-[#16382A] text-[#6B7266] cursor-not-allowed opacity-70'
              }`}
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? 'Saving Settings...' : 'Save & Publish Settings'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
