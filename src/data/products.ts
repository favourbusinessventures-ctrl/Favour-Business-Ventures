import { ProductDetail } from '../types';
import heroImg from '../assets/images/hero_foodstuff_1786804137879.jpg';
import stockfishCutsImg from '../assets/images/stockfish_cuts_1786804149849.jpg';
import stockfishHeadImg from '../assets/images/stockfish_head_1786804183534.jpg';
import stockfishBaleImg from '../assets/images/stockfish_bale_1786804194361.jpg';
import crayfishWholeImg from '../assets/images/crayfish_whole_1786804160015.jpg';
import crayfishGroundImg from '../assets/images/crayfish_ground_1786804171630.jpg';

export { 
  heroImg, 
  stockfishCutsImg, 
  stockfishHeadImg, 
  stockfishBaleImg, 
  crayfishWholeImg, 
  crayfishGroundImg 
};

export const PRODUCTS_DATA: ProductDetail[] = [
  {
    id: 'stockfish',
    name: 'Stockfish',
    category: 'Stockfish',
    subtitle: 'Carefully cured, full-flavored dried fish for traditional cooking',
    description: 'Our stockfish is selected for firm flesh, deep savory aroma, and clean drying. A classic staple that provides an unmistakable rich depth to traditional soups, sauces, and stews.',
    highlights: [
      'Firm, clean texture that tenderizes when cooked',
      'Deep, authentic flavor for enriching broths and soups',
      'Properly dried and inspected for quality',
      'Available in cuts, heads, and bulk quantities'
    ],
    imageUrl: stockfishCutsImg,
    options: [
      { name: 'Prime Cuts', description: 'Meaty center pieces ideal for family and catering soups' },
      { name: 'Heads & Collars', description: 'Flavorful bone and collar pieces for rich soup bases' },
      { name: 'Bulk Pack', description: 'Wholesale quantities for large orders and food vendors' }
    ],
    culinaryNotes: 'Soak in clean warm water before boiling to release maximum depth into Egusi, Afang, Oha, Banga, and native vegetable soups.'
  },
  {
    id: 'crayfish',
    name: 'Crayfish',
    category: 'Crayfish',
    subtitle: 'Sun-dried, aromatic, and thoroughly cleaned',
    description: 'Thoroughly cleaned to remove grit and impurities, our dried crayfish brings rich color, distinct sweetness, and intense aroma to every culinary preparation.',
    highlights: [
      'Clean and well-winnowed before packing',
      'Vibrant color with intense, sweet seafood aroma',
      'Available as whole dried crayfish or pure ground powder',
      'Versatile seasoning for everyday meals and celebrations'
    ],
    imageUrl: crayfishWholeImg,
    options: [
      { name: 'Whole Crayfish', description: 'Crisp whole dried crayfish for traditional cooking' },
      { name: 'Pure Ground Crayfish', description: 'Finely milled powder for quick seasoning and sauces' },
      { name: 'Bulk Bags', description: 'Large volume bags for regular kitchens and caterers' }
    ],
    culinaryNotes: 'Essential for traditional soups, native rice, vegetable stews, porridge, and pottage dishes.'
  }
];
