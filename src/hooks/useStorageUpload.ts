import { useState, useRef, useEffect } from 'react';
import { resolveToFile, startImageUpload, deleteUploadedImage, ActiveUploadHandle } from '../lib/imageStorage';
import { useAdminAuth } from '../admin/AdminAuthContext';

interface UseStorageUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
  uploadFile: (fileOrUrl: File | Blob | string, folderPath: 'products' | 'gallery', customName?: string) => Promise<string>;
  deleteFile: (imageUrl: string) => Promise<boolean>;
  cancelUpload: () => void;
  reset: () => void;
}

export function useStorageUpload(): UseStorageUploadReturn {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const activeHandleRef = useRef<ActiveUploadHandle | null>(null);
  const { user, adminData } = useAdminAuth();

  // Clean up any active upload on unmount
  useEffect(() => {
    return () => {
      if (activeHandleRef.current) {
        try {
          activeHandleRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const reset = () => {
    if (activeHandleRef.current) {
      try {
        activeHandleRef.current.abort();
      } catch {
        // Ignore
      }
      activeHandleRef.current = null;
    }
    setUploading(false);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
  };

  const cancelUpload = () => {
    if (activeHandleRef.current) {
      try {
        activeHandleRef.current.abort();
        console.log('[ImageStorage] Active upload cancelled by user.');
      } catch (err) {
        console.warn('[ImageStorage] Could not abort upload:', err);
      }
      activeHandleRef.current = null;
    }
    setUploading(false);
    setProgress(0);
    setError('Upload cancelled by user.');
  };

  const uploadFile = async (
    fileOrUrl: File | Blob | string,
    folderPath: 'products' | 'gallery',
    customName?: string
  ): Promise<string> => {
    reset();

    // 1. Resolve source to an actual binary File object
    let file: File;
    try {
      file = await resolveToFile(fileOrUrl, customName);
    } catch (resolveErr: any) {
      const errStr = `Could not prepare image for upload: ${resolveErr?.message || resolveErr}`;
      console.error('[ImageStorage] Resolution Error:', errStr);
      setError(errStr);
      throw new Error(errStr);
    }

    // 2. Validate MIME type
    if (!file.type || !file.type.startsWith('image/')) {
      const mimeErr = `Invalid image type (${file.type || 'unknown'}). Please choose a valid image (PNG, JPG, JPEG, WEBP, SVG).`;
      console.error('[ImageStorage] MIME Rejection:', mimeErr);
      setError(mimeErr);
      throw new Error(mimeErr);
    }

    // 3. Validate size (max 15MB)
    const MAX_SIZE_MB = 15;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      const sizeErr = `File exceeds size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is ${MAX_SIZE_MB}MB.`;
      console.error('[ImageStorage] Size Rejection:', sizeErr);
      setError(sizeErr);
      throw new Error(sizeErr);
    }

    // 4. Validate admin authorization context
    if (!user) {
      const authErr = 'Upload Failed: No authenticated session found. Please sign into the Admin Portal.';
      console.error('[ImageStorage] Auth Guard:', authErr);
      setError(authErr);
      throw new Error(authErr);
    }

    // 5. Get Firebase ID token for authorization header
    let idToken: string | null = null;
    try {
      idToken = await user.getIdToken();
    } catch (tokenErr) {
      console.warn('[ImageStorage] Could not fetch ID token:', tokenErr);
    }

    console.group('[ImageStorage Upload Started]');
    console.log('File Name:', file.name);
    console.log('File Size:', `${(file.size / 1024).toFixed(1)} KB`);
    console.log('MIME Type:', file.type);
    console.log('Folder:', folderPath);
    console.log('Admin UID:', user.uid);
    console.log('Admin Email:', user.email);
    console.groupEnd();

    // 6. Initialize UI state
    setUploading(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const handle = startImageUpload(
        file,
        folderPath,
        (percent, loaded, total) => {
          console.log(`[ImageStorage Progress] ${percent}% (${loaded}/${total} bytes)`);
          setProgress(percent);
        },
        idToken
      );

      activeHandleRef.current = handle;
      const result = await handle.promise;
      activeHandleRef.current = null;

      console.log('[ImageStorage Success] Upload complete:', result);
      setDownloadUrl(result.url);
      setProgress(100);
      setUploading(false);
      return result.url;
    } catch (uploadErr: any) {
      activeHandleRef.current = null;
      console.error('[ImageStorage Error]:', uploadErr);
      const displayMsg = uploadErr?.message || 'Failed to upload image. Please try again.';
      setError(displayMsg);
      setProgress(0);
      setUploading(false);
      throw new Error(displayMsg);
    }
  };

  const deleteFile = async (imageUrl: string): Promise<boolean> => {
    let idToken: string | null = null;
    if (user) {
      try {
        idToken = await user.getIdToken();
      } catch {
        // Continue
      }
    }
    return deleteUploadedImage(imageUrl, idToken);
  };

  return {
    uploading,
    progress,
    error,
    downloadUrl,
    uploadFile,
    deleteFile,
    cancelUpload,
    reset
  };
}
