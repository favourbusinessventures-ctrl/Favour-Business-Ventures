import { CustomerReview } from '../types';

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-001',
    customerName: 'Chief Emeka Okonkwo',
    rating: 5,
    reviewTitle: 'Exceptional Norwegian Cod Stockfish Quality',
    comment: 'I order the whole round Norwegian cod body for our family gatherings and festive celebrations. The stockfish is well-dried, aromatic, and free from moisture damage. Softens beautifully when soaked and gives our Ofe Owerri and bitterleaf soups genuine richness.',
    productId: 'norwegian-stockfish',
    productName: 'Norwegian Stockfish (Torsk / Cod)',
    location: 'Lagos & Imo State',
    status: 'approved',
    createdAt: '2025-01-15T10:30:00.000Z'
  },
  {
    id: 'rev-002',
    customerName: 'Mrs. Folashade Adeyemi',
    rating: 5,
    reviewTitle: 'Clean, Sand-Free Oron Crayfish',
    comment: 'The hardest thing about buying crayfish in open markets is finding grit-free and fresh batches. FAVORA delivers thoroughly sorted, sun-cured Oron crayfish. The vibrant orange color and sweet aroma elevate my jollof rice and native soups without any sand or gravel.',
    productId: 'oron-crayfish',
    productName: 'Oron Crayfish (Sun-Cured / Stone-Free)',
    location: 'Lekki, Lagos',
    status: 'approved',
    createdAt: '2025-01-28T14:15:00.000Z'
  },
  {
    id: 'rev-003',
    customerName: 'Chef Nnamdi Eze',
    rating: 5,
    reviewTitle: 'Bulk Restaurant Delivery Was Flawless',
    comment: 'We run a modern African bistro in Abuja and needed a reliable supplier for cut stockfish steaks and premium crayfish. Delivery was fast via interstate parcel logistics, packaging was clean and hygienic, and portion cuts saved our kitchen prep hours.',
    productId: 'norwegian-stockfish',
    productName: 'Norwegian Stockfish (Torsk / Cod)',
    location: 'Maitama, Abuja',
    status: 'approved',
    createdAt: '2025-02-04T09:45:00.000Z'
  },
  {
    id: 'rev-004',
    customerName: 'Dr. Blessing Chukwuma',
    rating: 5,
    reviewTitle: 'Arrived Perfectly Packed for UK Travel',
    comment: 'Ordered stockfish cuts and sealed crayfish packs through WhatsApp. The team vacuum-wrapped and sealed them securely so there was no odor in transit. Best provision shopping experience!',
    productId: 'oron-crayfish',
    productName: 'Oron Crayfish (Sun-Cured / Stone-Free)',
    location: 'London, UK & Enugu',
    status: 'approved',
    createdAt: '2025-02-12T16:20:00.000Z'
  },
  {
    id: 'rev-005',
    customerName: 'Amara Kalu',
    rating: 4,
    reviewTitle: 'Very fresh and deeply flavorful',
    comment: 'The stockfish head and collar cuts yield so much flavor in egusi soup. Prompt communication on WhatsApp with instant delivery tracking. Will definitely be a regular customer.',
    productId: 'norwegian-stockfish',
    productName: 'Norwegian Stockfish (Torsk / Cod)',
    location: 'Port Harcourt',
    status: 'approved',
    createdAt: '2025-02-18T11:10:00.000Z'
  }
];
