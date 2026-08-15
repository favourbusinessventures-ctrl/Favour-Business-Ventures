export type NavigationTab = 'home' | 'products' | 'about' | 'gallery' | 'contact';

export interface ProductDetail {
  id: string;
  name: string;
  category: 'Stockfish' | 'Crayfish';
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  options: {
    name: string;
    description: string;
  }[];
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
