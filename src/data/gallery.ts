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
    description: 'Clean cured stockfish alongside aromatic sun-dried crayfish, ready for traditional Nigerian soup pots.',
    imageUrl: heroImg,
    aspect: 'landscape',
    badge: 'Signature Provisions',
    kitchenUse: 'Egusi, Afang, Oha & Banga Soups',
    processNote: 'Hand-sorted and thoroughly inspected for zero moisture retention'
  },
  {
    id: 'g-stockfish-cuts',
    title: 'Stockfish Body Cuts',
    category: 'stockfish',
    description: 'Firm, fleshy center cuts selected for tenderness and rich umami depth without excess bone.',
    imageUrl: stockfishCutsImg,
    aspect: 'portrait',
    badge: 'Prime Meaty Cuts',
    kitchenUse: 'Family Stews, Vegetable & Native Soups',
    processNote: 'Cleaned, pre-portioned, and stored in dry ventilated conditions'
  },
  {
    id: 'g-crayfish-whole',
    title: 'Whole Dried Crayfish',
    category: 'crayfish',
    description: 'Crisp, whole sun-dried crayfish with natural vibrant red-orange hue and intense sweet seafood aroma.',
    imageUrl: crayfishWholeImg,
    aspect: 'portrait',
    badge: 'Zero-Sand Sun-Dried',
    kitchenUse: 'Native Jollof, Soups, Sauces & Pottage',
    processNote: 'Carefully winnowed and sifted to guarantee complete absence of grit or sand'
  },
  {
    id: 'g-stockfish-heads',
    title: 'Stockfish Heads & Collars',
    category: 'stockfish',
    description: 'Mineral-rich stockfish heads and collars cured to impart rich, savory depth into long-simmered broths.',
    imageUrl: stockfishHeadImg,
    aspect: 'square',
    badge: 'Deep Broth Base',
    kitchenUse: 'Pepper Soup, Native Broths & Bitterleaf Soup',
    processNote: 'Properly cured and thoroughly checked for clean interior cavity'
  },
  {
    id: 'g-crayfish-ground',
    title: 'Pure Ground Crayfish',
    category: 'crayfish',
    description: 'Freshly milled 100% pure dried crayfish powder offering quick, aromatic seasoning for everyday cooking.',
    imageUrl: crayfishGroundImg,
    aspect: 'landscape',
    badge: 'Pure 100% Milled',
    kitchenUse: 'Instant Seasoning, Stews, Beans & Fried Rice',
    processNote: 'Milled from clean whole crayfish with zero additives or filler'
  },
  {
    id: 'g-stockfish-bale',
    title: 'Packaged Stockfish Bale',
    category: 'stockfish',
    description: 'Wholesale and bulk quantities securely packaged for caterers, restaurants, and large household orders.',
    imageUrl: stockfishBaleImg,
    aspect: 'portrait',
    badge: 'Dispatch-Ready Packaging',
    kitchenUse: 'Commercial Catering, Events & Bulk Kitchens',
    processNote: 'Hygienically bundled and sealed for safe transit and prolonged shelf life'
  }
];
