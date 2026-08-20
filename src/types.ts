export type NavigationTab = 'home' | 'products' | 'about' | 'gallery' | 'contact';

export interface ProductOption {
  name: string;
  description: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  category: 'Stockfish' | 'Crayfish';
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  options: ProductOption[];
  culinaryNotes: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'stockfish' | 'crayfish';
  description: string;
  imageUrl: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  reviewTitle: string;
  comment: string;
  productId: string; // 'norwegian-stockfish' | 'oron-crayfish' | 'general' | product.id
  productName: string;
  location?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewSubmissionData {
  customerName: string;
  rating: number;
  reviewTitle: string;
  comment: string;
  productId: string;
  productName: string;
  location?: string;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  starCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
