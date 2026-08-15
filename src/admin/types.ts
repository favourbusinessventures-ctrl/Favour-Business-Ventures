import { User as FirebaseUser } from 'firebase/auth';

export interface AdminUserData {
  uid: string;
  email: string | null;
  role: 'admin';
  displayName?: string;
  createdAt?: string;
  lastLoginAt?: string;
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

export type AdminTab = 'dashboard' | 'products' | 'gallery' | 'orders' | 'settings';
