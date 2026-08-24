import { FAQItem, QuickAction } from './types';

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: 'view_products', label: 'View Products', actionType: 'navigate', payload: 'products' },
  { id: 'stockfish_questions', label: 'Stockfish Questions', actionType: 'query', payload: 'Tell me about your stockfish types and preparation tips.' },
  { id: 'crayfish_questions', label: 'Crayfish Questions', actionType: 'query', payload: 'Tell me about your crayfish quality and processing.' },
  { id: 'delivery_info', label: 'Delivery & Waybill', actionType: 'query', payload: 'What is your delivery and waybill process?' },
  { id: 'payment_info', label: 'Payment Terms', actionType: 'query', payload: 'How do I make payment?' },
  { id: 'talk_to_person', label: 'Talk to a Person', actionType: 'whatsapp', payload: 'Hello FAVORA, I would like to speak with customer care.' }
];

export const KNOWLEDGE_BASE_FAQS: FAQItem[] = [
  // 1. ORDERING & PURCHASING
  {
    id: 'how_to_order',
    category: 'ordering',
    question: 'How do I place an order with FAVORA?',
    answer: 'Ordering is direct and straightforward:\n1. Choose your preferred provision and cut/format (Prime Cuts, Heads & Collars, Whole Crayfish, or Pure Ground Crayfish).\n2. Click the "Order on WhatsApp" button or contact us directly.\n3. Confirm your quantity and delivery location on WhatsApp.\n4. We provide real-time pricing, invoice confirmation, and dispatch details.',
    keywords: ['order', 'how to order', 'buy', 'purchase', 'place order', 'process', 'steps'],
    suggestedActions: [
      { id: 'view_products', label: 'Browse Products', actionType: 'navigate', payload: 'products' },
      { id: 'whatsapp_order', label: 'Chat on WhatsApp', actionType: 'whatsapp', payload: 'Hello FAVORA, I want to place an order.' }
    ]
  },
  {
    id: 'bulk_wholesale',
    category: 'ordering',
    question: 'Do you sell in bulk or wholesale quantities?',
    answer: 'Yes! We supply both retail quantities for families and wholesale bulk packages/bales for caterers, restaurants, and foodstuff vendors across Nigeria. Wholesale pricing and minimum bale sizes are confirmed directly on WhatsApp.',
    keywords: ['bulk', 'wholesale', 'bale', 'bag', 'commercial', 'caterer', 'restaurant', 'retail'],
    suggestedActions: [
      { id: 'whatsapp_bulk', label: 'Inquire Bulk Orders', actionType: 'whatsapp', payload: 'Hello FAVORA, I want to inquire about bulk wholesale packages.' }
    ]
  },

  // 2. STOCKFISH DETAILS
  {
    id: 'stockfish_info',
    category: 'products',
    question: 'What types of Stockfish do you supply?',
    answer: 'We provide premium, authentic dried stockfish carefully cured for deep flavor and firm texture. Our formats include:\n• Prime Cuts: Thick, meaty center pieces perfect for family soups and catering.\n• Heads & Collars: Rich bone and collar cuts that release maximum savory broth into soup bases.\n• Bulk Packs: Full bale and multi-kilo packs for large kitchens.',
    keywords: ['stockfish', 'okporoko', 'cod', 'tusk', 'cuts', 'heads', 'collars', 'fish', 'prime cuts'],
    suggestedActions: [
      { id: 'view_stockfish', label: 'View Stockfish Details', actionType: 'navigate', payload: 'products' },
      { id: 'whatsapp_stockfish', label: 'Order Stockfish', actionType: 'whatsapp', payload: 'Hello FAVORA, I want to order Stockfish.' }
    ]
  },
  {
    id: 'stockfish_soaking',
    category: 'storage',
    question: 'How should I soak and cook the Stockfish?',
    answer: 'To get the most tender texture and richest broth:\n1. Soak the stockfish pieces in clean, lukewarm or warm water for 2 to 4 hours (or overnight in the refrigerator for very thick cuts).\n2. Rinse thoroughly to remove any surface salt crystals.\n3. Boil gently with your seasoning and meat until tender before incorporating into Egusi, Afang, Oha, Banga, Bitterleaf, or Ogbono soups.',
    keywords: ['soak', 'prepare', 'cook', 'cooking', 'soften', 'boil', 'recipe', 'soup', 'tender'],
    suggestedActions: [
      { id: 'ask_more', label: 'Ask About Cuts', actionType: 'query', payload: 'What is the difference between Prime Cuts and Heads?' }
    ]
  },

  // 3. CRAYFISH DETAILS
  {
    id: 'crayfish_info',
    category: 'products',
    question: 'What types of Crayfish do you supply?',
    answer: 'Our crayfish is thoroughly winnowed and sun-dried to ensure intense sweetness, vibrant color, and zero sand/grit. We offer:\n• Whole Dried Crayfish: Crisp, intact whole crayfish for traditional pounding or direct cooking.\n• Pure Ground Crayfish: 100% pure, finely milled crayfish powder without fillers or additives.\n• Bulk Bags: Sealed volume sacks for regular kitchens and commercial vendors.',
    keywords: ['crayfish', 'ground crayfish', 'whole crayfish', 'powder', 'oron', 'sweet', 'sand', 'grit', 'clean'],
    suggestedActions: [
      { id: 'view_crayfish', label: 'View Crayfish Details', actionType: 'navigate', payload: 'products' },
      { id: 'whatsapp_crayfish', label: 'Order Crayfish', actionType: 'whatsapp', payload: 'Hello FAVORA, I want to order Crayfish.' }
    ]
  },
  {
    id: 'crayfish_cleanliness',
    category: 'products',
    question: 'Is your crayfish clean and free from sand?',
    answer: 'Yes, 100%. Cleanliness is our highest priority. Every batch is thoroughly winnowed and sifted to remove sand, dust, and shells before packaging, ensuring that your soups and stews have a smooth, clean texture with pure seafood aroma.',
    keywords: ['sand', 'clean', 'dirt', 'stones', 'grit', 'hygiene', 'quality', 'purity'],
    suggestedActions: [
      { id: 'order_crayfish', label: 'Order Clean Crayfish', actionType: 'whatsapp', payload: 'Hello FAVORA, I would like to order clean crayfish.' }
    ]
  },

  // 4. DELIVERY & LOGISTICS
  {
    id: 'delivery_info',
    category: 'delivery',
    question: 'How does delivery and waybill work?',
    answer: 'We arrange nationwide dispatch across Nigerian states:\n• Inter-state Waybill: Dispatched via trusted transport parks, courier hubs, or logistics partners to your state/city.\n• Packaging: All items are securely packed in moisture-resistant, hygienic sacks/cartons to keep them crisp and fresh in transit.\n• Waybill Fee & Timing: Waybill fees depend on parcel weight and destination city, confirmed before dispatch.',
    keywords: ['delivery', 'waybill', 'shipping', 'dispatch', 'lagos', 'abuja', 'port harcourt', 'states', 'interstate', 'send', 'location'],
    suggestedActions: [
      { id: 'whatsapp_delivery', label: 'Confirm Waybill to My City', actionType: 'whatsapp', payload: 'Hello FAVORA, what is the waybill cost and timing to my location?' }
    ]
  },

  // 5. PAYMENT & PRICING
  {
    id: 'pricing_info',
    category: 'payment',
    question: 'How do I know the current price?',
    answer: 'Because stockfish and crayfish are commodity provisions influenced by seasonal supply and currency exchange for imported cuts, prices fluctuate slightly. We give you exact, up-to-the-minute prices on WhatsApp when you select your desired cut and portion.',
    keywords: ['price', 'cost', 'how much', 'naira', 'pricing', 'rate', 'expensive', 'cheap'],
    suggestedActions: [
      { id: 'whatsapp_pricing', label: 'Get Today’s Price List', actionType: 'whatsapp', payload: 'Hello FAVORA, please share your current price list.' }
    ]
  },
  {
    id: 'payment_methods',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept direct bank transfers to our verified Nigerian business bank account. Bank details and payment confirmation are provided upon order invoice generation prior to parcel dispatch.',
    keywords: ['payment', 'bank transfer', 'account', 'pay', 'cash on delivery', 'pos', 'transfer'],
    suggestedActions: [
      { id: 'whatsapp_pay', label: 'Payment Inquiry', actionType: 'whatsapp', payload: 'Hello FAVORA, what are your account details for payment?' }
    ]
  },

  // 6. STORAGE & PRESERVATION
  {
    id: 'storage_guide',
    category: 'storage',
    question: 'How should I store Stockfish and Crayfish at home?',
    answer: '• Stockfish: Store in a cool, well-ventilated, dry place. For long-term preservation in humid climates, keep in an airtight container or freeze soaked portions.\n• Crayfish: Keep in a sealed airtight jar or container away from moisture to retain crispness and sweet aroma. Storing in the freezer also preserves flavor for months.',
    keywords: ['store', 'storage', 'preservation', 'shelf life', 'spoil', 'keep', 'fridge', 'freezer', 'airtight']
  },

  // 7. LOCATION & CONTACT
  {
    id: 'location_contact',
    category: 'general',
    question: 'Where are you located and how do I contact you?',
    answer: 'FAVORA is based in Nigeria, operating nation-wide dispatch for all foodstuffs. You can reach our customer desk via:\n• Direct WhatsApp Chat\n• Telephone voice line\n• Official Email: favourbusinessventures@gmail.com\nWe are available during regular business hours Monday to Saturday.',
    keywords: ['location', 'address', 'where are you', 'office', 'phone', 'contact', 'email', 'hours', 'open'],
    suggestedActions: [
      { id: 'view_contact_page', label: 'View Contact Details', actionType: 'navigate', payload: 'contact' },
      { id: 'whatsapp_chat', label: 'Chat on WhatsApp', actionType: 'whatsapp', payload: 'Hello FAVORA, I would like to get in touch.' }
    ]
  }
];

export const WELCOME_MESSAGE_TEXT = 
  "Hi 👋 Welcome to FAVORA Customer Care. I can help you with our premium stockfish cuts, clean crayfish, ordering steps, delivery/waybill, and preparation tips.";

export const AVAILABILITY_STATUS_TEXT = "Available to help";
