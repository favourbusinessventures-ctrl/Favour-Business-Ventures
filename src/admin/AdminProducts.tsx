import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { AdminProduct, ProductOption } from './types';
import { PRODUCTS_DATA } from '../data/products';
import { useStorageUpload } from '../hooks/useStorageUpload';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpDown, 
  RefreshCw, 
  Layers, 
  Image as ImageIcon, 
  Sparkles,
  AlertTriangle,
  Loader2,
  UploadCloud,
  FileImage
} from 'lucide-react';

const PRESET_IMAGE_OPTIONS = [
  { label: 'Stockfish Cuts (Default)', url: PRODUCTS_DATA[0]?.imageUrl || '' },
  { label: 'Crayfish Whole (Default)', url: PRODUCTS_DATA[1]?.imageUrl || '' },
];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Stockfish' | 'Crayfish'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'active' | 'draft'>('All');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  
  // Delete Modal State
  const [deleteCandidate, setDeleteCandidate] = useState<AdminProduct | null>(null);
  
  // Storage Upload Hook
  const { 
    uploading: isUploadingImage, 
    progress: uploadProgress, 
    error: uploadError, 
    uploadFile, 
    deleteFile,
    cancelUpload, 
    reset: resetUpload 
  } = useStorageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileForRetry, setSelectedFileForRetry] = useState<File | string | null>(null);
  
  // Notification Toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: 'Stockfish' | 'Crayfish';
    subtitle: string;
    description: string;
    culinaryNotes: string;
    imageUrl: string;
    highlights: string[];
    options: ProductOption[];
    status: 'active' | 'draft';
    isAvailable: boolean;
    displayOrder: number;
  }>({
    name: '',
    category: 'Stockfish',
    subtitle: '',
    description: '',
    culinaryNotes: '',
    imageUrl: '',
    highlights: [''],
    options: [{ name: '', description: '' }],
    status: 'active',
    isAvailable: true,
    displayOrder: 1
  });

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const list: AdminProduct[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Omit<AdminProduct, 'id'>;
          list.push({
            id: docSnap.id,
            name: data.name || 'Untitled Product',
            category: data.category === 'Crayfish' ? 'Crayfish' : 'Stockfish',
            subtitle: data.subtitle || '',
            description: data.description || '',
            highlights: Array.isArray(data.highlights) ? data.highlights : [],
            imageUrl: data.imageUrl || '',
            options: Array.isArray(data.options) ? data.options : [],
            culinaryNotes: data.culinaryNotes || '',
            status: data.status === 'draft' ? 'draft' : 'active',
            isAvailable: data.isAvailable !== false,
            displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
        // Sort by display order then name
        list.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
        setProducts(list);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products from Firestore:', err);
      showFeedback('error', 'Could not load products. Please check Firestore connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Seed default catalog if Firestore is empty
  const handleSeedDefaults = async () => {
    setActionLoading(true);
    try {
      for (let i = 0; i < PRODUCTS_DATA.length; i++) {
        const item = PRODUCTS_DATA[i];
        const docRef = doc(db, 'products', item.id);
        await setDoc(docRef, {
          name: item.name,
          category: item.category,
          subtitle: item.subtitle,
          description: item.description,
          highlights: item.highlights,
          imageUrl: item.imageUrl,
          options: item.options,
          culinaryNotes: item.culinaryNotes,
          status: 'active',
          isAvailable: true,
          displayOrder: i + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      showFeedback('success', 'Default verified catalog seeded into Firestore successfully!');
      await fetchProducts();
    } catch (err) {
      console.error('Error seeding defaults:', err);
      showFeedback('error', 'Failed to seed initial catalog.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Stockfish',
      subtitle: '',
      description: '',
      culinaryNotes: '',
      imageUrl: PRESET_IMAGE_OPTIONS[0].url,
      highlights: ['Firm, clean texture that tenderizes when cooked', 'Properly dried and inspected for quality'],
      options: [
        { name: 'Prime Cuts', description: 'Meaty center pieces ideal for family and catering soups' },
        { name: 'Bulk Pack', description: 'Wholesale quantities for large orders and food vendors' }
      ],
      status: 'active',
      isAvailable: true,
      displayOrder: products.length + 1
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      subtitle: prod.subtitle,
      description: prod.description,
      culinaryNotes: prod.culinaryNotes,
      imageUrl: prod.imageUrl,
      highlights: prod.highlights.length > 0 ? [...prod.highlights] : [''],
      options: prod.options.length > 0 ? prod.options.map(o => ({ ...o })) : [{ name: '', description: '' }],
      status: prod.status,
      isAvailable: prod.isAvailable,
      displayOrder: prod.displayOrder
    });
    setIsModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showFeedback('error', 'Product name is required.');
      return;
    }

    setActionLoading(true);
    try {
      const cleanHighlights = formData.highlights.map(h => h.trim()).filter(Boolean);
      const cleanOptions = formData.options
        .map(o => ({ name: o.name.trim(), description: o.description.trim() }))
        .filter(o => o.name.length > 0);

      const productId = editingProduct 
        ? editingProduct.id 
        : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subtitle: formData.subtitle.trim(),
        description: formData.description.trim(),
        culinaryNotes: formData.culinaryNotes.trim(),
        imageUrl: formData.imageUrl.trim() || (formData.category === 'Crayfish' ? PRESET_IMAGE_OPTIONS[1].url : PRESET_IMAGE_OPTIONS[0].url),
        highlights: cleanHighlights,
        options: cleanOptions,
        status: formData.status,
        isAvailable: formData.isAvailable,
        displayOrder: Number(formData.displayOrder) || 1,
        updatedAt: new Date().toISOString(),
        ...(editingProduct ? {} : { createdAt: new Date().toISOString() })
      };

      await setDoc(doc(db, 'products', productId), payload, { merge: true });
      showFeedback('success', editingProduct ? 'Product updated successfully.' : 'New product created.');
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      showFeedback('error', 'Failed to save product in Firestore.');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Toggle Publish Status
  const handleToggleStatus = async (prod: AdminProduct) => {
    const nextStatus = prod.status === 'active' ? 'draft' : 'active';
    try {
      await updateDoc(doc(db, 'products', prod.id), {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, status: nextStatus } : p));
      showFeedback('success', `Product ${nextStatus === 'active' ? 'published' : 'moved to draft'}.`);
    } catch (err) {
      console.error('Error updating status:', err);
      showFeedback('error', 'Could not update publication status.');
    }
  };

  // Quick Toggle Stock Availability
  const handleToggleAvailability = async (prod: AdminProduct) => {
    const nextAvailable = !prod.isAvailable;
    try {
      await updateDoc(doc(db, 'products', prod.id), {
        isAvailable: nextAvailable,
        updatedAt: new Date().toISOString()
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, isAvailable: nextAvailable } : p));
      showFeedback('success', `Product marked ${nextAvailable ? 'In Stock / Available' : 'Unavailable'}.`);
    } catch (err) {
      console.error('Error updating availability:', err);
      showFeedback('error', 'Could not update availability.');
    }
  };

  // Delete Product Action
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setActionLoading(true);
    try {
      if (deleteCandidate.imageUrl) {
        try {
          await deleteFile(deleteCandidate.imageUrl);
        } catch {
          // Non-blocking cleanup
        }
      }
      await deleteDoc(doc(db, 'products', deleteCandidate.id));
      showFeedback('success', `Product "${deleteCandidate.name}" removed from Firestore.`);
      setDeleteCandidate(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showFeedback('error', 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Highlights handlers in modal
  const handleAddHighlight = () => {
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    setFormData(prev => {
      const next = [...prev.highlights];
      next[index] = val;
      return { ...prev, highlights: next };
    });
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Options handlers in modal
  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: '', description: '' }]
    }));
  };

  const handleUpdateOption = (index: number, field: 'name' | 'description', val: string) => {
    setFormData(prev => {
      const next = [...prev.options];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, options: next };
    });
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Feedback Notification */}
      {feedback && (
        <div className={`p-4 rounded-[2px] border text-xs font-sans-clean flex items-center justify-between shadow-xl animate-in fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-700/70 text-emerald-200' 
            : 'bg-red-950/80 border-red-700/70 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100 ml-4">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-[#0D3325] border border-[#16382A] p-6 sm:p-8 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#B8954A]" />
            <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
              Inventory & Catalog
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F0E6]">
            Product Management
          </h1>
          <p className="text-xs text-[#A3B899] font-sans-clean font-light max-w-xl">
            Control genuine Stockfish and Crayfish catalog items, cuts, packaging portions, publication statuses, and presentation order.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-[2px] bg-[#071F16] border border-[#16382A] hover:border-[#B8954A]/40 text-xs font-sans-clean text-[#A3B899] hover:text-[#F5F0E6] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {products.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#071F16] border border-[#B8954A]/60 text-[#B8954A] hover:bg-[#B8954A]/10 text-xs font-sans-clean font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Seed Initial Catalog</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] text-xs font-sans-clean font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0D3325] border border-[#16382A] p-4 sm:p-5 rounded-[2px] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7266]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or subtitle..."
            className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] pl-10 pr-4 py-2.5 rounded-[2px] font-sans-clean focus:outline-none placeholder:text-[#6B7266]"
          />
        </div>

        {/* Category and Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center bg-[#071F16] border border-[#16382A] p-1 rounded-[2px]">
            {(['All', 'Stockfish', 'Crayfish'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-sans-clean font-medium rounded-[2px] transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#B8954A] text-[#071F16]'
                    : 'text-[#A3B899] hover:text-[#F5F0E6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-[#071F16] border border-[#16382A] p-1 rounded-[2px]">
            {(['All', 'active', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs font-sans-clean font-medium rounded-[2px] transition-all cursor-pointer capitalize ${
                  selectedStatus === st
                    ? 'bg-[#B8954A] text-[#071F16]'
                    : 'text-[#A3B899] hover:text-[#F5F0E6]'
                }`}
              >
                {st === 'All' ? 'All Status' : st === 'active' ? 'Published' : 'Draft'}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Product List Table / Grid */}
      <div className="bg-[#0D3325] border border-[#16382A] rounded-[2px] overflow-hidden shadow-xl">
        
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#B8954A] mx-auto" />
            <p className="text-xs font-sans-clean uppercase tracking-wider text-[#A3B899]">
              Loading Products from Firestore...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#6B7266] mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                {products.length === 0 ? 'No products in database yet.' : 'No matching products found.'}
              </h3>
              <p className="text-xs text-[#A3B899] font-sans-clean max-w-md mx-auto">
                {products.length === 0 
                  ? 'Click "Seed Initial Catalog" to load the verified Stockfish & Crayfish items, or create a new product.'
                  : 'Try changing your search keywords or filter settings.'}
              </p>
            </div>
            {products.length === 0 && (
              <button
                onClick={handleSeedDefaults}
                disabled={actionLoading}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] text-xs font-sans-clean font-semibold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Seed Initial Catalog</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#16382A] bg-[#071F16]/70 text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#6B7266]">
                  <th className="py-3.5 px-4 sm:px-6">Order</th>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Options & Cuts</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16382A] text-xs font-sans-clean">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#071F16]/40 transition-colors">
                    
                    {/* Display Order */}
                    <td className="py-4 px-4 sm:px-6 font-mono text-[#B8954A] font-semibold">
                      #{prod.displayOrder}
                    </td>

                    {/* Image & Product Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[2px] bg-[#071F16] border border-[#16382A] overflow-hidden shrink-0">
                          {prod.imageUrl ? (
                            <img 
                              src={prod.imageUrl} 
                              alt={prod.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#6B7266]">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5 max-w-xs">
                          <div className="font-editorial text-base font-bold text-[#F5F0E6] leading-tight">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-[#A3B899] line-clamp-1">
                            {prod.subtitle || prod.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider rounded-[2px] border ${
                        prod.category === 'Stockfish'
                          ? 'bg-[#16382A] border-[#B8954A]/40 text-[#B8954A]'
                          : 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300'
                      }`}>
                        {prod.category}
                      </span>
                    </td>

                    {/* Options Count */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-[11px] text-[#F5F0E6] font-medium flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-[#B8954A]" />
                          <span>{prod.options?.length || 0} Portions / Cuts</span>
                        </div>
                        <div className="text-[10px] text-[#6B7266] truncate max-w-[160px]">
                          {prod.options?.map(o => o.name).join(', ') || 'No options set'}
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle (Published / Draft) */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-sans-clean font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                          prod.status === 'active'
                            ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/50'
                            : 'bg-amber-950/50 border-amber-700/60 text-amber-300 hover:bg-amber-900/50'
                        }`}
                        title="Click to toggle publication"
                      >
                        {prod.status === 'active' ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-amber-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Stock Availability Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-sans-clean font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                          prod.isAvailable
                            ? 'bg-[#071F16] border-[#16382A] text-emerald-400 hover:border-emerald-700'
                            : 'bg-red-950/40 border-red-800/40 text-red-300 hover:bg-red-900/40'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${prod.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{prod.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-[2px] bg-[#071F16] border border-[#16382A] text-[#A3B899] hover:text-[#B8954A] hover:border-[#B8954A]/40 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(prod)}
                          className="p-1.5 rounded-[2px] bg-[#071F16] border border-[#16382A] text-[#A3B899] hover:text-red-400 hover:border-red-800/40 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* =========================================================================
          CREATE / EDIT PRODUCT MODAL
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0D3325] border border-[#16382A] w-full max-w-3xl rounded-[2px] shadow-2xl overflow-hidden my-8 relative">
            
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />

            {/* Modal Title Bar */}
            <div className="p-6 sm:p-7 border-b border-[#16382A] flex items-center justify-between bg-[#071F16]/50">
              <div className="space-y-1">
                <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.25em] text-[#B8954A]">
                  {editingProduct ? 'Update Inventory Item' : 'New Catalog Item'}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F5F0E6]">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#A3B899] hover:text-[#F5F0E6] rounded-[2px] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Stockfish (Prime Cuts)"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Category (Permitted Only) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Stockfish', 'Crayfish'] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                        className={`py-2.5 px-3 text-xs font-sans-clean font-semibold uppercase tracking-wider rounded-[2px] border transition-all cursor-pointer ${
                          formData.category === cat
                            ? 'bg-[#B8954A] border-[#B8954A] text-[#071F16]'
                            : 'bg-[#071F16] border-[#16382A] text-[#A3B899] hover:text-[#F5F0E6]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Subtitle */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Subtitle / Quality Tagline
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Carefully cured, full-flavored dried fish for traditional cooking"
                  className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe texture, flavor aroma, grading, and cleaning standards..."
                  className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] p-3.5 rounded-[2px] font-sans-clean focus:outline-none leading-relaxed"
                />
              </div>

              {/* Row 4: Culinary Notes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                  Culinary Pairing & Preparation Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.culinaryNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, culinaryNotes: e.target.value }))}
                  placeholder="e.g. Essential for Egusi, Afang, Oha, Banga, native rice, and vegetable soups."
                  className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] p-3.5 rounded-[2px] font-sans-clean focus:outline-none"
                />
              </div>

              {/* Row 5: Product Image (Storage Upload + URL Input + Presets + Preview) */}
              <div className="space-y-3 pt-2 border-t border-[#16382A]">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Product Image
                  </label>
                  <span className="text-[10px] text-[#B8954A] font-sans-clean">
                    Upload image or specify URL
                  </span>
                </div>

                {/* File Upload Zone */}
                <div className="p-3.5 bg-[#0D3325]/70 border border-dashed border-[#16382A] hover:border-[#B8954A]/60 rounded-[2px] transition-colors">
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
                          const url = await uploadFile(file, 'products');
                          setFormData(prev => ({ ...prev, imageUrl: url }));
                          showFeedback('success', `Image "${file.name}" uploaded successfully!`);
                        } catch (err: any) {
                          showFeedback('error', err?.message || 'Failed to upload image.');
                        }
                      }
                      if (e.target) e.target.value = '';
                    }}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[2px] bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A] shrink-0">
                        {isUploadingImage ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#B8954A]" />
                        ) : (
                          <UploadCloud className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-0.5 text-left">
                        <div className="text-xs font-semibold text-[#F5F0E6] font-sans-clean">
                          {isUploadingImage 
                            ? (uploadProgress > 0 ? `Uploading image... ${uploadProgress}%` : 'Initiating upload...') 
                            : 'Upload image from computer'}
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
                      <div className="w-full bg-[#071F16] h-1.5 rounded-full overflow-hidden">
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
                              const url = await uploadFile(selectedFileForRetry, 'products');
                              setFormData(prev => ({ ...prev, imageUrl: url }));
                              showFeedback('success', 'Image uploaded successfully!');
                            } catch (err: any) {
                              showFeedback('error', err?.message || 'Retry failed.');
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

                {/* Direct Image URL fallback & Preview */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-sans-clean font-medium text-[#6B7266]">
                    Or specify Image URL directly:
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://... or select a preset asset below"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] font-sans-clean focus:outline-none font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-[#6B7266] font-sans-clean">Quick Presets:</span>
                  {PRESET_IMAGE_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, imageUrl: opt.url }));
                        setSelectedFileForRetry(opt.url);
                      }}
                      className="text-[10px] font-sans-clean text-[#A3B899] hover:text-[#B8954A] bg-[#071F16] border border-[#16382A] px-2 py-1 rounded-[2px] transition-colors cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Current Image Preview & Storage Sync */}
                {formData.imageUrl && (
                  <div className="p-2.5 bg-[#071F16] border border-[#16382A] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-[2px] bg-[#0D3325] border border-[#16382A] overflow-hidden shrink-0">
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
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
                              ? 'Hosted Storage Image' 
                              : formData.imageUrl.includes('firebasestorage.googleapis.com')
                                ? 'Firebase Cloud Storage Image'
                                : 'Attached Local / External Image'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6B7266] truncate font-mono">
                          {formData.imageUrl}
                        </div>
                      </div>
                    </div>

                    {/* If image is local asset, offer one-click upload to Storage */}
                    {formData.imageUrl.startsWith('/src/') && (
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={async () => {
                          setSelectedFileForRetry(formData.imageUrl);
                          try {
                            const url = await uploadFile(formData.imageUrl, 'products');
                            setFormData(prev => ({ ...prev, imageUrl: url }));
                            showFeedback('success', 'Preset asset uploaded to image storage!');
                          } catch (err: any) {
                            showFeedback('error', err?.message || 'Could not upload asset to storage.');
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

              {/* Row 6: Key Highlights Builder */}
              <div className="space-y-3 pt-2 border-t border-[#16382A]">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Key Bullet Highlights ({formData.highlights.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="text-[11px] text-[#B8954A] hover:text-[#C9A55B] font-sans-clean font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Highlight</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6B7266] w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                        placeholder="e.g. Properly dried and inspected for quality"
                        className="flex-1 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        disabled={formData.highlights.length <= 1}
                        className="p-2 text-[#6B7266] hover:text-red-400 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 7: Product Options & Packaging Cuts Builder */}
              <div className="space-y-3 pt-2 border-t border-[#16382A]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                      Available Cuts / Portions / Bag Sizes ({formData.options.length})
                    </label>
                    <span className="text-[10px] text-[#6B7266]">
                      Portions displayed to customers when ordering
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-[11px] text-[#B8954A] hover:text-[#C9A55B] font-sans-clean font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="p-3.5 bg-[#071F16] border border-[#16382A] rounded-[2px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-sans-clean uppercase tracking-wider text-[#B8954A]">
                          Option #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          disabled={formData.options.length <= 1}
                          className="text-[#6B7266] hover:text-red-400 text-xs disabled:opacity-30 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => handleUpdateOption(idx, 'name', e.target.value)}
                          placeholder="Portion Name (e.g. Prime Cuts / Full Bag)"
                          className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                        />
                        <input
                          type="text"
                          value={opt.description}
                          onChange={(e) => handleUpdateOption(idx, 'description', e.target.value)}
                          placeholder="Short description (e.g. Wholesale 45kg bag)"
                          className="w-full bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] text-xs text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Display Order, Status & Stock Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#16382A]">
                
                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-sm text-[#F5F0E6] px-3 py-2 rounded-[2px] font-sans-clean focus:outline-none"
                  />
                </div>

                {/* Status Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Publication Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'draft' : 'active' }))}
                    className={`w-full py-2.5 px-3 rounded-[2px] border text-xs font-sans-clean font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      formData.status === 'active'
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                        : 'bg-amber-950/60 border-amber-700 text-amber-300'
                    }`}
                  >
                    {formData.status === 'active' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{formData.status === 'active' ? 'Published' : 'Draft'}</span>
                  </button>
                </div>

                {/* Stock Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                    Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                    className={`w-full py-2.5 px-3 rounded-[2px] border text-xs font-sans-clean font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      formData.isAvailable
                        ? 'bg-[#071F16] border-[#16382A] text-emerald-400'
                        : 'bg-red-950/60 border-red-700 text-red-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formData.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span>{formData.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                  </button>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="pt-5 border-t border-[#16382A] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-[2px] bg-[#071F16] border border-[#16382A] text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] hover:text-[#F5F0E6] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-[2px] bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] text-xs font-sans-clean font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0D3325] border border-red-800/60 max-w-md w-full p-6 sm:p-7 rounded-[2px] shadow-2xl space-y-5 relative">
            
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-[2px] bg-red-950/80 border border-red-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#F5F0E6]">
                  Delete Product?
                </h4>
                <span className="text-[10px] font-sans-clean uppercase tracking-wider text-red-400">
                  Irreversible Action
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A3B899] font-sans-clean leading-relaxed">
              Are you sure you want to permanently remove <span className="font-bold text-[#F5F0E6]">"{deleteCandidate.name}"</span> from the Firestore database?
            </p>

            <div className="pt-3 border-t border-[#16382A] flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-[2px] bg-[#071F16] border border-[#16382A] text-xs font-sans-clean text-[#A3B899] hover:text-[#F5F0E6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="px-5 py-2 rounded-[2px] bg-red-800 hover:bg-red-700 text-white text-xs font-sans-clean font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
