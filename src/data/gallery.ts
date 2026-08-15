import { GalleryItem } from '../types';
import { 
  heroImg, 
  stockfishCutsImg, 
  stockfishHeadImg, 
  stockfishBaleImg, 
  crayfishWholeImg, 
  crayfishGroundImg 
} from './products';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-hero-display',
    title: 'Stockfish & Crayfish Pairing',
    category: 'stockfish',
    description: 'Clean dried stockfish and sun-dried crayfish ready for traditional soup preparation.',
    imageUrl: heroImg,
    aspect: 'landscape'
  },
  {
    id: 'g-stockfish-cuts',
    title: 'Stockfish Body Cuts',
    category: 'stockfish',
    description: 'Firm, fleshy cuts selected for soup depth and tenderness.',
    imageUrl: stockfishCutsImg,
    aspect: 'portrait'
  },
  {
    id: 'g-crayfish-whole',
    title: 'Whole Dried Crayfish',
    category: 'crayfish',
    description: 'Cleaned, sun-dried whole crayfish with natural vibrant color.',
    imageUrl: crayfishWholeImg,
    aspect: 'portrait'
  },
  {
    id: 'g-stockfish-heads',
    title: 'Stockfish Heads & Pieces',
    category: 'stockfish',
    description: 'Rich pieces curated for deep broth flavor in traditional Nigerian dishes.',
    imageUrl: stockfishHeadImg,
    aspect: 'square'
  },
  {
    id: 'g-crayfish-ground',
    title: 'Pure Ground Crayfish',
    category: 'crayfish',
    description: 'Freshly ground dried crayfish for quick, aromatic seasoning.',
    imageUrl: crayfishGroundImg,
    aspect: 'landscape'
  },
  {
    id: 'g-stockfish-bale',
    title: 'Bulk Stockfish Presentation',
    category: 'stockfish',
    description: 'Large quantity packaged stockfish ready for order and distribution.',
    imageUrl: stockfishBaleImg,
    aspect: 'portrait'
  }
];
