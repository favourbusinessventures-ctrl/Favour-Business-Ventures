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
