import { User as FirebaseUser } from 'firebase/auth';

export interface ProductOption {
  name: string;
  description: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: 'Stockfish' | 'Crayfish';
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  options: ProductOption[];
  culinaryNotes: string;
  status: 'active' | 'draft';
  isAvailable: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminGalleryItem {
  id: string;
  title: string;
  category: 'stockfish' | 'crayfish';
  description: string;
  imageUrl: string;
  aspect: 'portrait' | 'landscape' | 'square';
  status: 'active' | 'draft';
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminBusinessSettings {
  name: string;
  shortName: string;
  tagline: string;
  heroSubtitle: string;
  description: string;
  
  // WhatsApp & Phone
  whatsappNumberRaw: string;
  whatsappNumberDisplay: string;
  phoneNumberDisplay: string;
  phoneCallUrl: string;
  email: string;
  
  // Default WhatsApp order templates
  defaultOrderMessage: string;
  stockfishOrderMessage: string;
  crayfishOrderMessage: string;

  createdAt?: string;
  updatedAt?: string;
}

export type OrderCategory = 'stockfish' | 'crayfish';
export type OrderSource = 'whatsapp' | 'website' | 'admin';
export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productName: string;
  category: OrderCategory;
  option?: string;
  quantity?: string;
  customerMessage?: string;
  source: OrderSource;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserData {
  uid: string;
  email: string | null;
  role: 'admin';
  displayName?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export type ReviewModerationStatus = 'pending' | 'approved' | 'rejected';

export interface AdminReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  reviewTitle: string;
  comment: string;
  productId: string;
  productName: string;
  location?: string;
  status: ReviewModerationStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAuthContextType {
  user: FirebaseUser | null;
  adminData: AdminUserData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export type AdminTab = 'dashboard' | 'products' | 'gallery' | 'orders' | 'reviews' | 'customerCare' | 'systemHealth' | 'settings';
