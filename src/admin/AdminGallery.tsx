import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  UploadCloud, 
  AlertCircle, 
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Loader2,
  FileImage,
  X
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminGalleryItem } from './types';
import { GALLERY_ITEMS } from '../data/gallery';
import { useStorageUpload } from '../hooks/useStorageUpload';
import { 
  heroImg, 
  stockfishCutsImg, 
  stockfishHeadImg, 
  stockfishBaleImg, 
  crayfishWholeImg, 
  crayfishGroundImg 
} from '../data/products';

const IMAGE_PRESETS = [
  { label: 'Stockfish & Crayfish Pairing', url: heroImg, category: 'stockfish', aspect: 'landscape' as const },
  { label: 'Stockfish Body Cuts', url: stockfishCutsImg, category: 'stockfish', aspect: 'portrait' as const },
  { label: 'Stockfish Heads & Collars', url: stockfishHeadImg, category: 'stockfish', aspect: 'square' as const },
  { label: 'Bulk Stockfish Bale', url: stockfishBaleImg, category: 'stockfish', aspect: 'portrait' as const },
  { label: 'Whole Dried Crayfish', url: crayfishWholeImg, category: 'crayfish', aspect: 'portrait' as const },
  { label: 'Pure Ground Crayfish', url: crayfishGroundImg, category: 'crayfish', aspect: 'landscape' as const }
];

interface GalleryFormData {
  id?: string;
  title: string;
  category: 'stockfish' | 'crayfish';
  description: string;
  imageUrl: string;
  aspect: 'portrait' | 'landscape' | 'square';
  status: 'active' | 'draft';
  displayOrder: number;
}

const DEFAULT_FORM: GalleryFormData = {
  title: '',
  category: 'stockfish',
  description: '',
  imageUrl: stockfishCutsImg,
  aspect: 'portrait',
  status: 'active',
  displayOrder: 1
};

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'stockfish' | 'crayfish'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [aspectFilter, setAspectFilter] = useState<'all' | 'portrait' | 'landscape' | 'square'>('all');
  
  // Modals & form state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<GalleryFormData>(DEFAULT_FORM);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminGalleryItem | null>(null);
  
  // Storage Upload Hook
  const { 
    uploading: isUploadingImage, 
    progress: uploadProgress, 
    error: uploadError, 
    uploadFile,
    deleteFile,
    cancelUpload 
  } = useStorageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileForRetry, setSelectedFileForRetry] = useState<File | string | null>(null);
  
  // Feedback
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Real-time Firestore sync
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'gallery'),
      (snapshot) => {
        const list: AdminGalleryItem[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            title: d.title || 'Untitled Photo',
            category: d.category === 'crayfish' ? 'crayfish' : 'stockfish',
            description: d.description || '',
            imageUrl: d.imageUrl || heroImg,
            aspect: (d.aspect === 'portrait' || d.aspect === 'landscape' || d.aspect === 'square') ? d.aspect : 'portrait',
            status: d.status === 'draft' ? 'draft' : 'active',
            displayOrder: typeof d.displayOrder === 'number' ? d.displayOrder : 0,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          });
        });
        list.sort((a, b) => a.displayOrder - b.displayOrder);
        setItems(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching gallery:', error);
        showNotification(`Failed to load gallery items: ${error.message}`, 'error');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Seed verified initial gallery from static data
  const handleSeedInitialGallery = async () => {
    setIsProcessing(true);
    try {
      const batch = writeBatch(db);
      GALLERY_ITEMS.forEach((item, idx) => {
        const itemDoc = doc(db, 'gallery', item.id);
        batch.set(itemDoc, {
          title: item.title,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
          aspect: item.aspect || 'portrait',
          status: 'active',
          displayOrder: idx + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
      showNotification('Successfully seeded baseline gallery from verified project items!');
    } catch (err: any) {
      console.error('Error seeding gallery:', err);
      showNotification(`Seed failed: ${err.message || 'Permission denied'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      ...DEFAULT_FORM,
      displayOrder: items.length + 1
    });
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: AdminGalleryItem) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      aspect: item.aspect,
      status: item.status,
      displayOrder: item.displayOrder
    });
    setIsFormOpen(true);
  };

  // Save (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showNotification('Title is required', 'error');
      return;
    }
    if (!formData.imageUrl.trim()) {
      showNotification('Image URL is required', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const cleanImageUrl = formData.imageUrl.trim();
      
      // Strict guard against storing raw base64 data in Firestore
      if (cleanImageUrl.startsWith('data:') && cleanImageUrl.length > 2048) {
        setIsProcessing(false);
        showNotification('Raw base64 image data cannot be saved to database. Please upload the photo to storage first.', 'error');
        return;
      }

      const now = new Date().toISOString();
      const itemId = isEditing && formData.id ? formData.id : `g-${Date.now()}`;
      
      // Construct pure metadata payload with zero binary/base64 data
      const payload: {
        title: string;
        category: 'stockfish' | 'crayfish';
        description: string;
        imageUrl: string;
        aspect: 'portrait' | 'landscape' | 'square';
        status: 'active' | 'draft';
        displayOrder: number;
        updatedAt: string;
        createdAt?: string;
      } = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        imageUrl: cleanImageUrl,
        aspect: formData.aspect,
        status: formData.status,
        displayOrder: Number(formData.displayOrder) || 1,
        updatedAt: now
      };

      if (!isEditing) {
        payload.createdAt = now;
      }

      await setDoc(doc(db, 'gallery', itemId), payload, { merge: true });
      showNotification(isEditing ? 'Gallery photo updated successfully!' : 'New gallery photo added!');
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Save failed:', err);
      showNotification(`Failed to save: ${err.message || 'Check administrator permissions'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle Publish Status
  const handleToggleStatus = async (item: AdminGalleryItem) => {
    const newStatus = item.status === 'active' ? 'draft' : 'active';
    try {
      await updateDoc(doc(db, 'gallery', item.id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      showNotification(`Photo marked as ${newStatus === 'active' ? 'Published' : 'Draft'}`);
    } catch (err: any) {
      showNotification(`Failed to update status: ${err.message}`, 'error');
    }
  };

  // Quick display order increment / decrement
  const handleAdjustOrder = async (item: AdminGalleryItem, delta: number) => {
    const newOrder = Math.max(1, item.displayOrder + delta);
    if (newOrder === item.displayOrder) return;
    try {
      await updateDoc(doc(db, 'gallery', item.id), {
        displayOrder: newOrder,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      showNotification(`Failed to update order: ${err.message}`, 'error');
    }
  };

  // Delete
  const handleDeleteItem = async () => {
    if (!deleteConfirmItem) return;
    setIsProcessing(true);
    try {
      if (deleteConfirmItem.imageUrl) {
        try {
          await deleteFile(deleteConfirmItem.imageUrl);
        } catch {
          // Non-blocking cleanup
        }
      }
      await deleteDoc(doc(db, 'gallery', deleteConfirmItem.id));
      showNotification(`Deleted "${deleteConfirmItem.title}"`);
      setDeleteConfirmItem(null);
    } catch (err: any) {
      showNotification(`Failed to delete: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered list
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesAspect = aspectFilter === 'all' || item.aspect === aspectFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesAspect;
  });

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
              Culinary Portfolio
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F0E6]">
            Gallery Management
          </h1>
          <p className="text-xs text-[#A3B899] font-sans-clean">
            Manage high-resolution showcase photos, framing aspect ratios, and category arrangements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {items.length === 0 && !loading && (
            <button
              onClick={handleSeedInitialGallery}
              disabled={isProcessing}
              className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D3325] hover:bg-[#16382A] border border-[#B8954A]/40 text-[#F5F0E6] text-xs font-sans-clean tracking-wider uppercase rounded-[2px] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8954A]" />
              <span>Seed Baseline Gallery</span>
            </button>
          )}

          <button
            onClick={handleOpenCreate}
            className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-sans-clean font-semibold tracking-wider uppercase rounded-[2px] shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Showcase Photo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#071F16] p-4 border border-[#16382A] rounded-[2px]">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A3B899] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles or descriptions..."
            className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] pl-9 pr-3 py-2 rounded-[2px] font-sans-clean focus:outline-none placeholder:text-[#6B7266]"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none cursor-pointer"
          >
            <option value="all">All Provisions (Both)</option>
            <option value="stockfish">Stockfish Photos</option>
            <option value="crayfish">Crayfish Photos</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none cursor-pointer"
          >
            <option value="all">All Publication Statuses</option>
            <option value="active">Active (Published on Store)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
        </div>

        {/* Aspect Filter */}
        <div>
          <select
            value={aspectFilter}
            onChange={(e) => setAspectFilter(e.target.value as any)}
            className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none cursor-pointer"
          >
            <option value="all">All Aspect Ratios</option>
            <option value="portrait">Portrait (3:4)</option>
            <option value="landscape">Landscape (4:3)</option>
            <option value="square">Square (1:1)</option>
          </select>
        </div>
      </div>

      {/* Main Gallery List Table */}
      <div className="bg-[#071F16] border border-[#16382A] rounded-[2px] overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#A3B899]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#B8954A]" />
            <span className="text-xs font-sans-clean">Loading gallery showcase...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#0D3325] border border-[#16382A] flex items-center justify-center mx-auto text-[#A3B899]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg text-[#F5F0E6]">No gallery items found</h3>
              <p className="text-xs text-[#A3B899] font-sans-clean max-w-md mx-auto">
                {items.length === 0 
                  ? 'The gallery database is empty. You can seed the baseline items or create a new showcase photo.'
                  : 'No items match your active search and category filters.'}
              </p>
            </div>
            {items.length === 0 && (
              <button
                onClick={handleSeedInitialGallery}
                disabled={isProcessing}
                className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Seed Baseline Showcase</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans-clean">
              <thead className="bg-[#0D3325]/80 text-[#A3B899] uppercase tracking-wider text-[10px] border-b border-[#16382A]">
                <tr>
                  <th className="px-4 py-3.5 w-14">Order</th>
                  <th className="px-4 py-3.5 w-24">Photo</th>
                  <th className="px-4 py-3.5">Details</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Aspect</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16382A]/60">
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-[#0D3325]/40 transition-colors group"
                  >
                    {/* Display Order with Up/Down buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[#F5F0E6] text-xs font-semibold w-5">
                          {item.displayOrder}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleAdjustOrder(item, -1)}
                            className="text-[#6B7266] hover:text-[#B8954A] p-0.5"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleAdjustOrder(item, 1)}
                            className="text-[#6B7266] hover:text-[#B8954A] p-0.5"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Preview */}
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 bg-[#0D3325] border border-[#16382A] rounded-[2px] overflow-hidden relative group-hover:border-[#B8954A]/50 transition-colors">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td className="px-4 py-3 max-w-xs">
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold text-[#F5F0E6] font-editorial">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#A3B899] line-clamp-1">
                          {item.description}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-[2px] text-[10px] font-semibold uppercase tracking-wider ${
                        item.category === 'stockfish' 
                          ? 'bg-[#0D3325] text-[#B8954A] border border-[#B8954A]/30' 
                          : 'bg-[#16382A] text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Aspect */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] text-[#A3B899] bg-[#0D3325] border border-[#16382A] font-mono capitalize">
                        {item.aspect}
                      </span>
                    </td>

                    {/* Publication Status Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-medium uppercase tracking-wider cursor-pointer transition-all ${
                          item.status === 'active'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:border-emerald-600'
                            : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:border-zinc-500'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {item.status === 'active' ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-zinc-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#A3B899] hover:text-[#B8954A] hover:bg-[#0D3325] rounded-[2px] transition-colors cursor-pointer"
                          title="Edit photo details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 text-[#A3B899] hover:text-rose-400 hover:bg-rose-950/40 rounded-[2px] transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#071F16] border border-[#B8954A]/40 rounded-[2px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#16382A] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                  {isEditing ? 'Modify Entry' : 'New Photo Entry'}
                </span>
                <h3 className="font-editorial text-xl text-[#F5F0E6]">
                  {isEditing ? `Edit: ${formData.title}` : 'Add Showcase Photo'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#A3B899] hover:text-[#F5F0E6] text-sm p-1.5"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveItem} className="p-5 space-y-5 overflow-y-auto">
              
              {/* Photo Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Stockfish Cuts Presentation"
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Category & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                  >
                    <option value="stockfish">Stockfish</option>
                    <option value="crayfish">Crayfish</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Framing Aspect Ratio *
                  </label>
                  <select
                    value={formData.aspect}
                    onChange={(e) => setFormData(prev => ({ ...prev, aspect: e.target.value as any }))}
                    className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                  >
                    <option value="portrait">Portrait (3:4 or 4:5)</option>
                    <option value="landscape">Landscape (4:3)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Editorial Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product cut, color, or traditional cooking utility..."
                  className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none leading-relaxed"
                />
              </div>

              {/* Image Asset (Storage Upload + Presets + Custom URL + Preview) */}
              <div className="space-y-3 pt-2 border-t border-[#16382A]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Image Asset *
                  </label>
                  <span className="text-[10px] text-[#B8954A] font-sans-clean">
                    Upload image or select preset
                  </span>
                </div>

                {/* File Upload Zone */}
                <div className="p-3.5 bg-[#071F16] border border-dashed border-[#16382A] hover:border-[#B8954A]/60 rounded-[2px] transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFileForRetry(file);
                        try {
                          const url = await uploadFile(file, 'gallery');
                          setFormData(prev => ({ ...prev, imageUrl: url }));
                          showNotification(`Photo "${file.name}" uploaded successfully!`, 'success');
                        } catch (err: any) {
                          showNotification(err?.message || 'Failed to upload photo.', 'error');
                        }
                      }
                      if (e.target) e.target.value = '';
                    }}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[2px] bg-[#0D3325] border border-[#16382A] flex items-center justify-center text-[#B8954A] shrink-0">
                        {isUploadingImage ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#B8954A]" />
                        ) : (
                          <UploadCloud className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-0.5 text-left">
                        <div className="text-xs font-semibold text-[#F5F0E6] font-sans-clean">
                          {isUploadingImage 
                            ? (uploadProgress > 0 ? `Uploading showcase image... ${uploadProgress}%` : 'Initiating upload...') 
                            : 'Upload showcase photo from computer'}
                        </div>
                        <div className="text-[10px] text-[#A3B899] font-sans-clean">
                          Instant, reliable storage with direct preview (PNG, JPG, WEBP • Max 15MB)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUploadingImage ? (
                        <button
                          type="button"
                          onClick={cancelUpload}
                          className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] font-sans-clean font-semibold rounded-[2px] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-[#16382A] hover:bg-[#B8954A] text-[#F5F0E6] hover:text-[#071F16] text-[11px] font-sans-clean font-semibold rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1.5"
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          <span>Browse File</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  {isUploadingImage && (
                    <div className="mt-3 space-y-1">
                      <div className="w-full bg-[#0D3325] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#B8954A] h-full transition-all duration-300 ease-out"
                          style={{ width: `${Math.max(uploadProgress, 4)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-right font-mono text-[#B8954A]">
                        {uploadProgress > 0 ? `${uploadProgress}%` : 'Initiating...'}
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-2.5 p-2 bg-rose-950/40 border border-rose-900/50 rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-[10px] text-rose-300 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{uploadError}</span>
                      </div>
                      {selectedFileForRetry && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const url = await uploadFile(selectedFileForRetry, 'gallery');
                              setFormData(prev => ({ ...prev, imageUrl: url }));
                              showNotification('Photo uploaded successfully!', 'success');
                            } catch (err: any) {
                              showNotification(err?.message || 'Retry failed.', 'error');
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-[#F5F0E6] text-[10px] font-sans-clean font-semibold rounded-[2px] cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry Upload</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Preset Thumbnails */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#6B7266] font-sans-clean">Or select verified preset:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            imageUrl: preset.url,
                            category: preset.category as any,
                            aspect: preset.aspect
                          }));
                          setSelectedFileForRetry(preset.url);
                        }}
                        className={`relative aspect-square rounded-[2px] overflow-hidden border transition-all ${
                          formData.imageUrl === preset.url
                            ? 'border-[#B8954A] ring-2 ring-[#B8954A]/40'
                            : 'border-[#16382A] hover:border-[#A3B899]'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#6B7266] font-sans-clean">Or specify image URL directly:</span>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Image URL (e.g. /uploads/gallery/... or HTTPS link)"
                    className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none font-mono"
                  />
                </div>

                {/* Current Image Preview & Cloud Storage Upload */}
                {formData.imageUrl && (
                  <div className="p-2.5 bg-[#071F16] border border-[#16382A] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-14 h-14 rounded-[2px] bg-[#0D3325] border border-[#16382A] overflow-hidden shrink-0">
                        <img
                          src={formData.imageUrl}
                          alt="Gallery preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.opacity = '0.3';
                          }}
                        />
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="text-[11px] font-semibold text-[#F5F0E6] font-sans-clean flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {formData.imageUrl.startsWith('/uploads/') 
                              ? 'Hosted Storage Photo' 
                              : formData.imageUrl.includes('firebasestorage.googleapis.com')
                                ? 'Firebase Cloud Storage Photo' 
                                : 'Attached Local / Preset Asset'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6B7266] truncate font-mono">
                          {formData.imageUrl}
                        </div>
                      </div>
                    </div>

                    {formData.imageUrl.startsWith('/src/') && (
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={async () => {
                          setSelectedFileForRetry(formData.imageUrl);
                          try {
                            const url = await uploadFile(formData.imageUrl, 'gallery');
                            setFormData(prev => ({ ...prev, imageUrl: url }));
                            showNotification('Preset photo uploaded to image storage!', 'success');
                          } catch (err: any) {
                            showNotification(err?.message || 'Could not upload preset to storage.', 'error');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#0D3325] hover:bg-[#B8954A] text-[#B8954A] hover:text-[#071F16] border border-[#B8954A]/40 text-[10px] font-sans-clean font-semibold rounded-[2px] transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload to Storage</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Display Order & Publication Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#16382A]">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Presentation Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Storefront Visibility
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                  >
                    <option value="active">Active (Published on Storefront)</option>
                    <option value="draft">Draft (Hidden in Admin Only)</option>
                  </select>
                </div>
              </div>

              {/* Form Footer Buttons */}
              <div className="pt-4 border-t border-[#16382A] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-sans-clean uppercase tracking-wider text-[#A3B899] hover:text-[#F5F0E6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-tactile inline-flex items-center gap-2 px-6 py-2.5 bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] text-xs font-sans-clean font-semibold uppercase tracking-wider rounded-[2px] shadow-md cursor-pointer"
                >
                  {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Create Showcase Entry'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#071F16] border border-rose-900/60 rounded-[2px] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial text-lg text-[#F5F0E6]">Delete Gallery Entry</h3>
            </div>
            
            <p className="text-xs text-[#A3B899] font-sans-clean leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#F5F0E6]">"{deleteConfirmItem.title}"</strong> from the showcase portfolio? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#16382A]">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-sans-clean uppercase tracking-wider text-[#A3B899] hover:text-[#F5F0E6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans-clean font-semibold uppercase tracking-wider rounded-[2px] shadow-md cursor-pointer"
              >
                {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
