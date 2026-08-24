import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { startImageUpload, ActiveUploadHandle } from '../../../lib/imageStorage';
import { useAdminAuth } from '../../AdminAuthContext';

interface LogoUploadFieldProps {
  id: string;
  label: string;
  description: string;
  recommendedSpec: string;
  value: string;
  onChange: (url: string) => void;
  darkPreview?: boolean;
}

export const LogoUploadField: React.FC<LogoUploadFieldProps> = ({
  id,
  label,
  description,
  recommendedSpec,
  value,
  onChange,
  darkPreview = false
}) => {
  const { user } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const activeUploadRef = useRef<ActiveUploadHandle | null>(null);

  const validateAndUpload = async (file: File) => {
    setErrorMessage(null);
    setImgError(false);

    // 1. Format validation
    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validMimes.includes(file.type) && !hasValidExt) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    // 2. Size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please upload an optimized image.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = user ? await user.getIdToken().catch(() => null) : null;
      const handle = startImageUpload(
        file,
        'branding',
        (percent) => {
          setUploadProgress(percent);
        },
        token
      );
      activeUploadRef.current = handle;

      const result = await handle.promise;
      if (result && result.url) {
        onChange(result.url);
      } else {
        throw new Error('Upload completed without a valid image URL.');
      }
    } catch (err: any) {
      console.error(`[LogoUpload] Error uploading ${label}:`, err);
      setErrorMessage(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      activeUploadRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setImgError(false);
    setErrorMessage(null);
  };

  return (
    <div className="bg-[#071F16]/70 border border-[#16382A] p-4 sm:p-5 rounded-[2px] flex flex-col justify-between space-y-4">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs font-sans-clean font-semibold text-[#F5F0E6] uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] font-sans-clean text-[#B8954A] font-medium">
            {recommendedSpec}
          </span>
        </div>
        <p className="text-[11px] text-[#A3B899] font-sans-clean leading-relaxed">
          {description}
        </p>
      </div>

      {/* Preview Box & Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-[2px] p-4 flex flex-col items-center justify-center min-h-[120px] transition-all cursor-pointer select-none
          ${isDragOver ? 'border-[#B8954A] bg-[#B8954A]/10' : 'border-[#16382A] hover:border-[#B8954A]/50 bg-[#051710]'}
          ${darkPreview ? 'bg-[#051710]' : 'bg-[#122E22]'}
        `}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#B8954A]" />
            <div className="text-xs font-sans-clean font-semibold text-[#F5F0E6]">
              Uploading Image ({uploadProgress}%)
            </div>
            {/* Progress bar */}
            <div className="w-36 h-1.5 bg-[#16382A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#B8954A] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : value && !imgError ? (
          <div className="flex flex-col items-center space-y-3 w-full">
            {/* Render Image Preview */}
            <div className="p-2.5 rounded-[2px] bg-[#071F16] border border-[#16382A] max-w-full flex items-center justify-center">
              <img
                src={value}
                alt={label}
                className="max-h-16 max-w-full object-contain"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-2.5 py-1 text-[11px] font-sans-clean font-medium bg-[#16382A] hover:bg-[#B8954A] text-[#F5F0E6] hover:text-[#071F16] rounded-[2px] transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-1 text-[11px] font-sans-clean font-medium bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/60 rounded-[2px] transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-center py-2">
            <div className="w-9 h-9 rounded-full bg-[#16382A]/60 flex items-center justify-center text-[#B8954A]">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-sans-clean font-medium text-[#F5F0E6]">
                Click or drag & drop to upload
              </div>
              <div className="text-[10px] text-[#A3B899] font-sans-clean">
                PNG, JPG, WEBP, or SVG (max 5MB)
              </div>
            </div>
            {value && imgError && (
              <div className="text-[10px] text-amber-400 font-sans-clean flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Custom URL failed to load. Using fallback FAVORA emblem.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message Feedback */}
      {errorMessage && (
        <div className="p-2.5 bg-red-950/80 border border-red-800/80 rounded-[2px] flex items-start gap-2 text-red-200 text-xs font-sans-clean">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active URL string (read-only preview) */}
      {value && !isUploading && (
        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#A3B899] truncate border-t border-[#16382A]">
          <span className="truncate max-w-[200px]" title={value}>
            {value}
          </span>
          <span className="text-[#B8954A] shrink-0">Configured</span>
        </div>
      )}
    </div>
  );
};
