import React, { useState } from 'react';
import { useLiveOrders } from '../hooks/useLiveOrders';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { AdminOrder, OrderCategory, OrderSource, OrderStatus } from './types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ExternalLink,
  Trash2,
  Edit3,
  Eye,
  X,
  Loader2,
  RefreshCw,
  User,
  Package,
  FileText,
  Tag
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, loading, error } = useLiveOrders();
  const { settings } = useBusinessSettings();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<AdminOrder | null>(null);

  // Form State for Adding / Editing Order
  const [formData, setFormData] = useState<{
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    productName: string;
    category: OrderCategory;
    option: string;
    quantity: string;
    customerMessage: string;
    source: OrderSource;
    status: OrderStatus;
  }>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    productName: '',
    category: 'stockfish',
    option: '',
    quantity: '1',
    customerMessage: '',
    source: 'admin',
    status: 'new'
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Show temporary toast
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerEmail && ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.option && ord.option.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || ord.source === sourceFilter;
    const matchesCategory = categoryFilter === 'all' || ord.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesCategory;
  });

  // Calculate Metrics
  const counts = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    contacted: orders.filter(o => o.status === 'contacted').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingOrder(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      productName: '',
      category: 'stockfish',
      option: '',
      quantity: '1',
      customerMessage: '',
      source: 'admin',
      status: 'new'
    });
    setFormError(null);
    setIsRecordModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ord: AdminOrder) => {
    setEditingOrder(ord);
    setFormData({
      customerName: ord.customerName,
      customerPhone: ord.customerPhone,
      customerEmail: ord.customerEmail || '',
      productName: ord.productName,
      category: ord.category,
      option: ord.option || '',
      quantity: ord.quantity || '1',
      customerMessage: ord.customerMessage || '',
      source: ord.source,
      status: ord.status
    });
    setFormError(null);
    setIsRecordModalOpen(true);
  };

  // Handle Submit Form (Create or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.customerName.trim()) {
      setFormError('Customer name is required.');
      return;
    }
    if (!formData.customerPhone.trim()) {
      setFormError('Customer phone number is required.');
      return;
    }
    if (!formData.productName.trim()) {
      setFormError('Product name is required.');
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date().toISOString();
      if (editingOrder) {
        // Update existing
        const orderRef = doc(db, 'orders', editingOrder.id);
        await updateDoc(orderRef, {
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerEmail: formData.customerEmail.trim() || '',
          productName: formData.productName.trim(),
          category: formData.category,
          option: formData.option.trim() || '',
          quantity: formData.quantity.trim() || '1',
          customerMessage: formData.customerMessage.trim() || '',
          source: formData.source,
          status: formData.status,
          updatedAt: now
        });
        showToast('success', `Order for "${formData.customerName}" successfully updated.`);
        if (selectedOrder && selectedOrder.id === editingOrder.id) {
          setSelectedOrder({
            ...editingOrder,
            ...formData,
            updatedAt: now
          });
        }
      } else {
        // Create new
        const ordersRef = collection(db, 'orders');
        await addDoc(ordersRef, {
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerEmail: formData.customerEmail.trim() || '',
          productName: formData.productName.trim(),
          category: formData.category,
          option: formData.option.trim() || '',
          quantity: formData.quantity.trim() || '1',
          customerMessage: formData.customerMessage.trim() || '',
          source: formData.source,
          status: formData.status,
          createdAt: now,
          updatedAt: now
        });
        showToast('success', `Inquiry for "${formData.customerName}" recorded successfully.`);
      }

      setIsRecordModalOpen(false);
      setEditingOrder(null);
    } catch (err: any) {
      console.error('Error saving order:', err);
      setFormError(err?.message || 'Failed to save order record in Firestore.');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Status Update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoading(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const now = new Date().toISOString();
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: now
      });

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus, updatedAt: now } : null);
      }

      showToast('success', `Order status changed to "${newStatus.toUpperCase()}".`);
    } catch (err: any) {
      console.error('Error updating status:', err);
      showToast('error', `Failed to update status: ${err?.message || 'Permission denied'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Order
  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    setActionLoading(true);
    try {
      await deleteDoc(doc(db, 'orders', deletingOrder.id));
      showToast('success', `Order record deleted.`);
      if (selectedOrder && selectedOrder.id === deletingOrder.id) {
        setSelectedOrder(null);
      }
      setDeletingOrder(null);
    } catch (err: any) {
      console.error('Error deleting order:', err);
      showToast('error', `Failed to delete order: ${err?.message || 'Permission denied'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to build WhatsApp direct link to customer
  const getCustomerWhatsAppUrl = (order: AdminOrder): string => {
    const rawNumber = order.customerPhone.replace(/[^0-9]/g, '');
    const message = `Hello ${order.customerName}, this is ${settings.shortName || 'FAVORA'}. We received your inquiry regarding *${order.productName}* (${order.option || 'Standard package'}, quantity: ${order.quantity || '1'}). How may we assist you with delivery and pricing?`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  // Format Status Badge
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-blue-950/70 text-blue-300 border border-blue-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-amber-950/70 text-amber-300 border border-amber-800/50">
            <Clock className="w-2.5 h-2.5" />
            Contacted
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#16382A] text-[#B8954A] border border-[#B8954A]/40">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-sans-clean font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-red-950/70 text-red-300 border border-red-800/50">
            <XCircle className="w-2.5 h-2.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Format Source Badge
  const renderSourceBadge = (source: OrderSource) => {
    switch (source) {
      case 'whatsapp':
        return (
          <span className="text-[10px] font-sans-clean text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-1.5 py-0.5 rounded-[2px]">
            WhatsApp
          </span>
        );
      case 'website':
        return (
          <span className="text-[10px] font-sans-clean text-blue-400 bg-blue-950/40 border border-blue-800/30 px-1.5 py-0.5 rounded-[2px]">
            Website
          </span>
        );
      case 'admin':
        return (
          <span className="text-[10px] font-sans-clean text-[#B8954A] bg-[#16382A]/70 border border-[#B8954A]/30 px-1.5 py-0.5 rounded-[2px]">
            Admin Log
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-[2px] shadow-2xl flex items-center gap-3 border text-xs font-sans-clean animate-in slide-in-from-bottom-2 duration-200 ${
          toastMessage.type === 'success' 
            ? 'bg-[#0D3325] text-emerald-300 border-emerald-700/60' 
            : 'bg-[#2A0D0D] text-red-300 border-red-700/60'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="bg-[#0D3325] border border-[#16382A] p-6 sm:p-8 rounded-[2px] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-[#B8954A]" />
              <span className="text-[10px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-[#B8954A]">
                Phase 4 • Inquiries & Orders
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F0E6]">
              Customer Inquiry & Order Management
            </h1>
            <p className="text-xs sm:text-sm text-[#A3B899] font-sans-clean font-light max-w-2xl">
              Track customer inquiries, record offline or phone orders, manage fulfillment status, and maintain a secure audit trail.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] font-sans-clean font-semibold text-xs tracking-[0.15em] uppercase py-3 px-5 rounded-[2px] transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Inquiry</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Orders */}
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#071F16] border-[#B8954A] shadow-md ring-1 ring-[#B8954A]/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-[#B8954A]/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-[#A3B899] uppercase tracking-wider font-semibold">
            Total
          </div>
          <div className="text-2xl font-editorial font-bold text-[#F5F0E6] mt-1">
            {counts.total}
          </div>
          <div className="text-[10px] text-[#6B7266] font-sans-clean mt-0.5">
            All records
          </div>
        </div>

        {/* New */}
        <div 
          onClick={() => setStatusFilter('new')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'new'
              ? 'bg-[#071F16] border-blue-400 shadow-md ring-1 ring-blue-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-blue-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-blue-300 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>New</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
          <div className="text-2xl font-editorial font-bold text-blue-100 mt-1">
            {counts.new}
          </div>
          <div className="text-[10px] text-blue-400/70 font-sans-clean mt-0.5">
            Awaiting response
          </div>
        </div>

        {/* Contacted */}
        <div 
          onClick={() => setStatusFilter('contacted')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'contacted'
              ? 'bg-[#071F16] border-amber-400 shadow-md ring-1 ring-amber-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-amber-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-amber-300 uppercase tracking-wider font-semibold">
            Contacted
          </div>
          <div className="text-2xl font-editorial font-bold text-amber-100 mt-1">
            {counts.contacted}
          </div>
          <div className="text-[10px] text-amber-400/70 font-sans-clean mt-0.5">
            Followed up
          </div>
        </div>

        {/* Confirmed */}
        <div 
          onClick={() => setStatusFilter('confirmed')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'confirmed'
              ? 'bg-[#071F16] border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-emerald-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-emerald-300 uppercase tracking-wider font-semibold">
            Confirmed
          </div>
          <div className="text-2xl font-editorial font-bold text-emerald-100 mt-1">
            {counts.confirmed}
          </div>
          <div className="text-[10px] text-emerald-400/70 font-sans-clean mt-0.5">
            Payment / Waybill
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => setStatusFilter('completed')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-[#071F16] border-[#B8954A] shadow-md ring-1 ring-[#B8954A]/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-[#B8954A]/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-[#B8954A] uppercase tracking-wider font-semibold">
            Completed
          </div>
          <div className="text-2xl font-editorial font-bold text-[#F5F0E6] mt-1">
            {counts.completed}
          </div>
          <div className="text-[10px] text-[#A3B899] font-sans-clean mt-0.5">
            Delivered
          </div>
        </div>

        {/* Cancelled */}
        <div 
          onClick={() => setStatusFilter('cancelled')}
          className={`p-4 rounded-[2px] border transition-all cursor-pointer ${
            statusFilter === 'cancelled'
              ? 'bg-[#071F16] border-red-400 shadow-md ring-1 ring-red-400/50'
              : 'bg-[#0D3325] border-[#16382A] hover:border-red-500/40'
          }`}
        >
          <div className="text-[10px] font-sans-clean text-red-300 uppercase tracking-wider font-semibold">
            Cancelled
          </div>
          <div className="text-2xl font-editorial font-bold text-red-200 mt-1">
            {counts.cancelled}
          </div>
          <div className="text-[10px] text-red-400/70 font-sans-clean mt-0.5">
            Closed / void
          </div>
        </div>

      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-[#0D3325] border border-[#16382A] p-4 rounded-[2px] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7266]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone number, product, or email..."
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] pl-10 pr-3.5 py-2.5 rounded-[2px] outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7266] hover:text-[#F5F0E6]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Statuses ({counts.total})</option>
              <option value="new">New ({counts.new})</option>
              <option value="contacted">Contacted ({counts.contacted})</option>
              <option value="confirmed">Confirmed ({counts.confirmed})</option>
              <option value="completed">Completed ({counts.completed})</option>
              <option value="cancelled">Cancelled ({counts.cancelled})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="stockfish">Stockfish</option>
              <option value="crayfish">Crayfish</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="md:col-span-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="website">Website</option>
              <option value="admin">Admin Log</option>
            </select>
          </div>

        </div>

        {/* Active Filter Indicator */}
        {(searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#16382A] text-[11px] font-sans-clean text-[#A3B899]">
            <span>
              Showing <strong className="text-[#F5F0E6]">{filteredOrders.length}</strong> of {orders.length} orders
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSourceFilter('all');
                setCategoryFilter('all');
              }}
              className="text-[#B8954A] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. ORDERS LIST (DESKTOP TABLE & RESPONSIVE MOBILE CARDS) */}
      {loading ? (
        <div className="bg-[#0D3325] border border-[#16382A] p-12 text-center rounded-[2px] space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#B8954A] mx-auto" />
          <div className="text-xs font-sans-clean text-[#A3B899] tracking-wider uppercase">
            Loading Inquiry Records from Firestore...
          </div>
        </div>
      ) : error ? (
        <div className="bg-[#2A0D0D] border border-red-800/60 p-6 rounded-[2px] text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
          <div className="text-sm font-sans-clean font-semibold text-red-200">
            Database Access Notice
          </div>
          <div className="text-xs text-red-300 font-sans-clean max-w-md mx-auto">
            {error}
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="bg-[#0D3325] border border-[#16382A] p-12 sm:p-16 rounded-[2px] text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#071F16] border border-[#16382A] flex items-center justify-center text-[#B8954A] mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-editorial text-xl font-bold text-[#F5F0E6]">
              {orders.length === 0 ? 'No customer inquiries or orders recorded yet' : 'No matching orders found'}
            </h3>
            <p className="text-xs text-[#A3B899] font-sans-clean leading-relaxed">
              {orders.length === 0 
                ? 'Customer inquiries originating from phone calls, direct market consultations, or WhatsApp channels can be logged here for structured fulfillment tracking.'
                : 'Try adjusting your search query or removing active status filters.'
              }
            </p>
          </div>
          {orders.length === 0 ? (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] font-sans-clean font-semibold text-xs tracking-[0.15em] uppercase py-2.5 px-5 rounded-[2px] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record First Inquiry</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSourceFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs font-sans-clean text-[#B8954A] hover:underline"
            >
              Clear Search Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden lg:block bg-[#0D3325] border border-[#16382A] rounded-[2px] overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#16382A] bg-[#071F16]/60 text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#6B7266]">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product & Specification</th>
                  <th className="py-3.5 px-3">Qty</th>
                  <th className="py-3.5 px-3">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16382A] text-xs font-sans-clean">
                {filteredOrders.map((ord) => (
                  <tr 
                    key={ord.id}
                    className="hover:bg-[#071F16]/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrder(ord)}
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#F5F0E6] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#B8954A]" />
                        <span>{ord.customerName}</span>
                      </div>
                      <div className="text-[11px] text-[#A3B899] font-mono mt-0.5">
                        {ord.customerPhone}
                      </div>
                    </td>

                    {/* Product & Option */}
                    <td className="py-3.5 px-4">
                      <div className="text-[#F5F0E6] font-medium">
                        {ord.productName}
                      </div>
                      <div className="text-[11px] text-[#6B7266] truncate max-w-xs">
                        {ord.option || (ord.category === 'stockfish' ? 'Norwegian Stockfish' : 'Oron Crayfish')}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 font-semibold text-[#F5F0E6]">
                      {ord.quantity || '1'}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-3">
                      {renderSourceBadge(ord.source)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(ord.status)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[11px] text-[#A3B899]">
                      {new Date(ord.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* WhatsApp Action */}
                        {ord.customerPhone && (
                          <a
                            href={getCustomerWhatsAppUrl(ord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-400 hover:bg-emerald-950/60 rounded-[2px] transition-colors"
                            title="Reply on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* View Action */}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A] rounded-[2px] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Action */}
                        <button
                          onClick={() => handleOpenEditModal(ord)}
                          className="p-1.5 text-[#B8954A] hover:bg-[#16382A] rounded-[2px] transition-colors"
                          title="Edit Order"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => setDeletingOrder(ord)}
                          className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-[2px] transition-colors"
                          title="Delete Record"
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

          {/* Mobile Card Grid View (Shown on screens < lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3.5">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className="bg-[#0D3325] border border-[#16382A] p-4 rounded-[2px] space-y-3 cursor-pointer hover:border-[#B8954A]/50 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#16382A]">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sm text-[#F5F0E6] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B8954A]" />
                      <span>{ord.customerName}</span>
                    </div>
                    <div className="text-xs text-[#A3B899] font-mono">
                      {ord.customerPhone}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {renderStatusBadge(ord.status)}
                    {renderSourceBadge(ord.source)}
                  </div>
                </div>

                <div className="space-y-1 text-xs font-sans-clean">
                  <div className="text-[#F5F0E6] font-medium flex items-center justify-between">
                    <span>{ord.productName}</span>
                    <span className="text-[#B8954A] font-semibold">Qty: {ord.quantity || '1'}</span>
                  </div>
                  {ord.option && (
                    <div className="text-[11px] text-[#A3B899]">
                      Option: {ord.option}
                    </div>
                  )}
                  {ord.customerMessage && (
                    <p className="text-[11px] text-[#6B7266] line-clamp-2 italic pt-1">
                      "{ord.customerMessage}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#16382A] text-[10px] font-sans-clean text-[#6B7266]">
                  <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {ord.customerPhone && (
                      <a
                        href={getCustomerWhatsAppUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenEditModal(ord)}
                      className="text-[#B8954A] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ORDER DETAILS MODAL                                                    */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0D3325] border border-[#16382A] max-w-2xl w-full rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#071F16] border-b border-[#16382A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[2px] bg-[#0D3325] border border-[#16382A] flex items-center justify-center text-[#B8954A]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                    Order Inquiry Details
                  </h3>
                  <div className="text-[10px] font-mono text-[#6B7266]">
                    ID: {selectedOrder.id}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {renderStatusBadge(selectedOrder.status)}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-[#A3B899] hover:text-[#F5F0E6] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Customer Profile Box */}
              <div className="bg-[#071F16] p-4 rounded-[2px] border border-[#16382A] space-y-3">
                <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
                  Customer Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans-clean">
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Full Name</div>
                    <div className="text-[#F5F0E6] font-semibold mt-0.5">{selectedOrder.customerName}</div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Phone Number</div>
                    <div className="text-[#F5F0E6] font-mono mt-0.5 flex items-center gap-1.5">
                      <span>{selectedOrder.customerPhone}</span>
                      <a href={`tel:${selectedOrder.customerPhone}`} className="text-[#B8954A] hover:underline" title="Call directly">
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div>
                      <div className="text-[#6B7266] text-[11px]">Email Address</div>
                      <div className="text-[#F5F0E6] mt-0.5">{selectedOrder.customerEmail}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Lead Source</div>
                    <div className="mt-0.5">{renderSourceBadge(selectedOrder.source)}</div>
                  </div>
                </div>
              </div>

              {/* Product Specifications Box */}
              <div className="bg-[#071F16] p-4 rounded-[2px] border border-[#16382A] space-y-3">
                <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A]">
                  Requested Products & Packaging
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans-clean">
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Product</div>
                    <div className="text-[#F5F0E6] font-semibold mt-0.5">{selectedOrder.productName}</div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Category</div>
                    <div className="text-[#F5F0E6] capitalize mt-0.5">{selectedOrder.category}</div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Package / Cut Option</div>
                    <div className="text-[#F5F0E6] mt-0.5">{selectedOrder.option || 'Standard Packaging'}</div>
                  </div>
                  <div>
                    <div className="text-[#6B7266] text-[11px]">Quantity</div>
                    <div className="text-[#F5F0E6] font-semibold mt-0.5">{selectedOrder.quantity || '1'}</div>
                  </div>
                </div>

                {selectedOrder.customerMessage && (
                  <div className="pt-2 border-t border-[#16382A]">
                    <div className="text-[#6B7266] text-[11px]">Customer Notes & Delivery Location</div>
                    <p className="text-xs text-[#A3B899] font-sans-clean mt-1 italic whitespace-pre-wrap bg-[#0D3325]/50 p-2.5 rounded-[2px]">
                      {selectedOrder.customerMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Transition Action Buttons */}
              <div className="space-y-2">
                <div className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#A3B899]">
                  Update Fulfillment Status
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    disabled={actionLoading || selectedOrder.status === 'contacted'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'contacted')}
                    className="p-2 text-xs font-sans-clean rounded-[2px] bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/60 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Mark Contacted
                  </button>
                  <button
                    disabled={actionLoading || selectedOrder.status === 'confirmed'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                    className="p-2 text-xs font-sans-clean rounded-[2px] bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Mark Confirmed
                  </button>
                  <button
                    disabled={actionLoading || selectedOrder.status === 'completed'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    className="p-2 text-xs font-sans-clean rounded-[2px] bg-[#16382A] border border-[#B8954A]/60 text-[#B8954A] hover:bg-[#16382A]/80 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Mark Completed
                  </button>
                  <button
                    disabled={actionLoading || selectedOrder.status === 'cancelled'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                    className="p-2 text-xs font-sans-clean rounded-[2px] bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900/60 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Mark Cancelled
                  </button>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex items-center justify-between text-[11px] font-sans-clean text-[#6B7266] pt-2 border-t border-[#16382A]">
                <span>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</span>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-[#071F16] border-t border-[#16382A] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedOrder.customerPhone && (
                  <a
                    href={getCustomerWhatsAppUrl(selectedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans-clean font-semibold text-xs py-2 px-4 rounded-[2px] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact on WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    handleOpenEditModal(selectedOrder);
                  }}
                  className="p-2 text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A] rounded-[2px] transition-colors border border-[#16382A]"
                  title="Edit details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingOrder(selectedOrder)}
                  className="p-2 text-red-400 hover:bg-red-950/60 rounded-[2px] transition-colors border border-red-900/40"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto text-xs font-sans-clean text-[#A3B899] hover:text-[#F5F0E6] px-4 py-2"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CREATE / EDIT INQUIRY MODAL                                            */}
      {/* ========================================================================= */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0D3325] border border-[#16382A] max-w-xl w-full rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-[#071F16] border-b border-[#16382A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[2px] bg-[#0D3325] flex items-center justify-center text-[#B8954A]">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                  {editingOrder ? 'Edit Inquiry / Order' : 'Record New Customer Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-[#A3B899] hover:text-[#F5F0E6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              
              {formError && (
                <div className="p-3 bg-[#2A0D0D] border border-red-800/60 rounded-[2px] text-xs text-red-200 font-sans-clean flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Chief Mrs. Adebayo or Grand Oak Hotel"
                  className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] outline-none"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Customer Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="customer@example.com"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] outline-none"
                  />
                </div>
              </div>

              {/* Category & Product Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as OrderCategory })}
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none cursor-pointer"
                  >
                    <option value="stockfish">Stockfish</option>
                    <option value="crayfish">Crayfish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Norwegian Cod Stockfish"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] outline-none"
                  />
                </div>
              </div>

              {/* Option & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Package / Cut Option
                  </label>
                  <input
                    type="text"
                    value={formData.option}
                    onChange={(e) => setFormData({ ...formData, option: e.target.value })}
                    placeholder="e.g. 50kg wholesale bag, Prime Fillet"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Quantity / Volume
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 2 bags, 5kg"
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3.5 py-2.5 rounded-[2px] outline-none"
                  />
                </div>
              </div>

              {/* Source & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Inquiry Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as OrderSource })}
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none cursor-pointer"
                  >
                    <option value="admin">Admin Manual Entry</option>
                    <option value="whatsapp">Direct WhatsApp Chat</option>
                    <option value="website">Storefront Web Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                    className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] px-3 py-2.5 rounded-[2px] outline-none cursor-pointer"
                  >
                    <option value="new">New (Pending Contact)</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Message / Notes */}
              <div>
                <label className="block text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899] mb-1">
                  Customer Message / Special Instructions / Delivery Location
                </label>
                <textarea
                  rows={3}
                  value={formData.customerMessage}
                  onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
                  placeholder="Delivery destination (e.g. Victoria Island Lagos, Onitsha Main Market), special packaging requests, or price notes..."
                  className="w-full bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] text-xs font-sans-clean text-[#F5F0E6] p-3 rounded-[2px] outline-none resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#16382A]">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-sans-clean text-[#A3B899] hover:text-[#F5F0E6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-[#B8954A] hover:bg-[#C9A55B] text-[#071F16] font-sans-clean font-semibold text-xs tracking-[0.15em] uppercase py-2.5 px-5 rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingOrder ? 'Save Changes' : 'Record Order'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DELETE CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {deletingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#0D3325] border border-red-800/60 max-w-md w-full p-6 rounded-[2px] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-8 h-8 rounded-[2px] bg-[#2A0D0D] flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-[#F5F0E6]">
                Delete Order Record?
              </h4>
            </div>

            <p className="text-xs text-[#A3B899] font-sans-clean leading-relaxed">
              Are you sure you want to delete the order record for <strong className="text-[#F5F0E6]">{deletingOrder.customerName}</strong> ({deletingOrder.productName})? This action removes the entry from the Firestore audit database and cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2 text-xs font-sans-clean text-[#A3B899] hover:text-[#F5F0E6]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteOrder}
                className="bg-red-700 hover:bg-red-600 text-white font-sans-clean font-semibold text-xs tracking-wider uppercase py-2 px-4 rounded-[2px] transition-colors cursor-pointer"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
