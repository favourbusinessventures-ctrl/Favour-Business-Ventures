import { ProductDetail } from '../../types';
import { AdminBusinessSettings } from '../../admin/types';
import { ChatMessage, QuickAction } from './types';
import { KNOWLEDGE_BASE_FAQS } from './knowledgeBase';
import { PRODUCTS_DATA } from '../../data/products';
import { BUSINESS_CONFIG } from '../../config/business';

export interface EngineResult {
  text: string;
  quickActions?: QuickAction[];
  isEscalation?: boolean;
  matchedFaqId?: string;
}

/**
 * Normalizes text for keyword and semantic matching
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Calculates keyword overlap score between query and a list of keywords
 */
function calculateKeywordScore(queryWords: string[], keywords: string[]): number {
  let score = 0;
  for (const kw of keywords) {
    const normKw = normalize(kw);
    if (queryWords.some(w => w === normKw || (normKw.length > 3 && w.includes(normKw)))) {
      score += 2;
    } else if (normKw.split(' ').every(kwPart => queryWords.includes(kwPart))) {
      score += 3;
    }
  }
  return score;
}

/**
 * Process a customer query using the safe 3-tier architecture.
 */
export async function processCustomerQuery(
  rawQuery: string,
  productContext?: ProductDetail | null,
  activeProducts?: ProductDetail[],
  businessSettings?: AdminBusinessSettings
): Promise<EngineResult> {
  const query = rawQuery.trim();
  const normalizedQuery = normalize(query);
  const queryWords = normalizedQuery.split(' ').filter(w => w.length > 1);

  const products = (activeProducts && activeProducts.length > 0) ? activeProducts : PRODUCTS_DATA;
  const settings = businessSettings || {
    name: BUSINESS_CONFIG.name,
    whatsappNumberRaw: BUSINESS_CONFIG.whatsappNumberRaw,
    email: BUSINESS_CONFIG.email,
    phoneNumberDisplay: BUSINESS_CONFIG.phoneNumberDisplay
  };

  // If query is empty
  if (!query) {
    return {
      text: "How can I assist you today with our stockfish or crayfish provisions?",
      quickActions: [
        { id: 'stockfish', label: '🐟 Browse Stockfish', actionType: 'navigate', payload: 'products' },
        { id: 'crayfish', label: '🦐 Browse Crayfish', actionType: 'navigate', payload: 'products' },
        { id: 'how_order', label: '🛒 How to Order', actionType: 'query', payload: 'How do I place an order?' }
      ]
    };
  }

  // -------------------------------------------------------------
  // LEVEL 2A: CONTEXT-SPECIFIC PRODUCT INQUIRIES
  // -------------------------------------------------------------
  if (productContext) {
    // If asking for options / cuts of the current product
    if (queryWords.some(w => ['option', 'options', 'format', 'formats', 'cut', 'cuts', 'package', 'pack', 'size'].includes(w))) {
      const optionsList = productContext.options.map(opt => `• *${opt.name}*: ${opt.description}`).join('\n');
      return {
        text: `Here are the available formats for *${productContext.name}*:\n\n${optionsList}\n\nWould you like to place an order for one of these options?`,
        quickActions: [
          {
            id: 'order_curr',
            label: `Order ${productContext.name} on WhatsApp`,
            actionType: 'whatsapp',
            payload: `Hello Favour Business Ventures, I would like to order ${productContext.name}. Please confirm current price and delivery.`
          },
          {
            id: 'ask_culinary',
            label: 'Culinary & Cooking Notes',
            actionType: 'query',
            payload: `How do I cook ${productContext.name}?`
          }
        ]
      };
    }

    // If asking about cooking/culinary notes for this product
    if (queryWords.some(w => ['cook', 'cooking', 'soak', 'soaking', 'recipe', 'soup', 'use', 'prepare', 'preparation'].includes(w))) {
      return {
        text: `*Culinary Recommendations for ${productContext.name}:*\n\n${productContext.culinaryNotes}\n\n*Key Qualities:*\n${productContext.highlights.map(h => `• ${h}`).join('\n')}`,
        quickActions: [
          {
            id: 'order_curr',
            label: `Order ${productContext.name}`,
            actionType: 'whatsapp',
            payload: `Hello Favour Business Ventures, I want to order ${productContext.name}.`
          }
        ]
      };
    }

    // If asking about price/cost for this context product
    if (queryWords.some(w => ['price', 'cost', 'how much', 'naira', 'rate', 'amount', 'pricing'].includes(w))) {
      return {
        text: `Prices for *${productContext.name}* are based on current batch market weights and chosen portion format (${productContext.options.map(o => o.name).join(', ')}).\n\nTo get the exact instant price for your required quantity, please chat with us on WhatsApp:`,
        quickActions: [
          {
            id: 'whatsapp_price_context',
            label: `Get Price for ${productContext.name}`,
            actionType: 'whatsapp',
            payload: `Hello Favour Business Ventures, please what is the current price for ${productContext.name}?`
          }
        ]
      };
    }
  }

  // -------------------------------------------------------------
  // LEVEL 2B: PRODUCT CATALOG SEARCH / OVERVIEW
  // -------------------------------------------------------------
  const mentionsStockfish = queryWords.some(w => ['stockfish', 'okporoko', 'cod', 'fish'].includes(w));
  const mentionsCrayfish = queryWords.some(w => ['crayfish', 'crawfish', 'powder', 'ground', 'shrimp'].includes(w));

  if (mentionsStockfish && !mentionsCrayfish) {
    const stockfishProduct = products.find(p => p.category === 'Stockfish' || p.id === 'stockfish');
    if (stockfishProduct) {
      const optionsText = stockfishProduct.options.map(o => `• *${o.name}*: ${o.description}`).join('\n');
      return {
        text: `*Favour Business Ventures Stockfish:*\n${stockfishProduct.subtitle}\n\n*Available Formats:*\n${optionsText}\n\n*Culinary Tip:* ${stockfishProduct.culinaryNotes}`,
        quickActions: [
          { id: 'view_stockfish_prod', label: 'View in Catalog', actionType: 'navigate', payload: 'products' },
          {
            id: 'order_stockfish',
            label: 'Order Stockfish on WhatsApp',
            actionType: 'whatsapp',
            payload: 'Hello Favour Business Ventures, I would like to order Stockfish.'
          }
        ]
      };
    }
  }

  if (mentionsCrayfish && !mentionsStockfish) {
    const crayfishProduct = products.find(p => p.category === 'Crayfish' || p.id === 'crayfish');
    if (crayfishProduct) {
      const optionsText = crayfishProduct.options.map(o => `• *${o.name}*: ${o.description}`).join('\n');
      return {
        text: `*Favour Business Ventures Crayfish:*\n${crayfishProduct.subtitle}\n\n*Available Formats:*\n${optionsText}\n\n*Cleanliness:* 100% winnowed and free from sand or grit.\n*Culinary Tip:* ${crayfishProduct.culinaryNotes}`,
        quickActions: [
          { id: 'view_crayfish_prod', label: 'View in Catalog', actionType: 'navigate', payload: 'products' },
          {
            id: 'order_crayfish',
            label: 'Order Crayfish on WhatsApp',
            actionType: 'whatsapp',
            payload: 'Hello Favour Business Ventures, I would like to order clean Crayfish.'
          }
        ]
      };
    }
  }

  // If asking what is in stock / available products
  if (queryWords.some(w => ['stock', 'available', 'products', 'catalog', 'items', 'list', 'sell', 'provisions'].includes(w))) {
    const productSummary = products.map(p => `• *${p.name}* (${p.category}): ${p.subtitle}`).join('\n');
    return {
      text: `We specialize in two core, premium foodstuffs:\n\n${productSummary}\n\nBoth are available for immediate dispatch in retail and wholesale quantities across Nigeria.`,
      quickActions: [
        { id: 'browse_all', label: 'Browse Full Catalog', actionType: 'navigate', payload: 'products' },
        { id: 'whatsapp_general', label: 'Inquire on WhatsApp', actionType: 'whatsapp', payload: 'Hello Favour Business Ventures, what products do you have available today?' }
      ]
    };
  }

  // -------------------------------------------------------------
  // LEVEL 1: KNOWLEDGE BASE FAQ MATCHING
  // -------------------------------------------------------------
  let bestFaq: typeof KNOWLEDGE_BASE_FAQS[0] | null = null;
  let highestScore = 0;

  for (const faq of KNOWLEDGE_BASE_FAQS) {
    const score = calculateKeywordScore(queryWords, faq.keywords);
    // Also check direct question match
    const normQuestion = normalize(faq.question);
    if (normQuestion.includes(normalizedQuery) || normalizedQuery.includes(normQuestion)) {
      score + 10;
    }
    if (score > highestScore) {
      highestScore = score;
      bestFaq = faq;
    }
  }

  // Threshold check for Level 1 confidence
  if (bestFaq && highestScore >= 3) {
    return {
      text: bestFaq.answer,
      quickActions: bestFaq.suggestedActions || [
        {
          id: 'talk_human',
          label: 'Talk to Us on WhatsApp',
          actionType: 'whatsapp',
          payload: `Hello Favour Business Ventures, I had a question regarding: "${query}"`
        }
      ],
      matchedFaqId: bestFaq.id
    };
  }

  // -------------------------------------------------------------
  // GREETINGS & INTRODUCTIONS
  // -------------------------------------------------------------
  const isGreeting = queryWords.some(w => ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'].includes(w));
  if (isGreeting && queryWords.length <= 4) {
    return {
      text: `Hello! 👋 Welcome to Favour Business Ventures. I am your customer-care assistant. How can I help you today with our stockfish, crayfish, or nationwide delivery?`,
      quickActions: [
        { id: 'stockfish', label: '🐟 Browse Stockfish', actionType: 'navigate', payload: 'products' },
        { id: 'crayfish', label: '🦐 Browse Crayfish', actionType: 'navigate', payload: 'products' },
        { id: 'how_to_order', label: '🛒 How to Order', actionType: 'query', payload: 'How do I place an order?' },
        { id: 'delivery', label: '🚚 Delivery & Waybill', actionType: 'query', payload: 'What is your delivery and waybill process?' }
      ]
    };
  }

  // -------------------------------------------------------------
  // LEVEL 3: SAFE ESCALATION / HUMAN HANDOFF
  // -------------------------------------------------------------
  // We do NOT hallucinate or guess if confidence is low.
  const encodedQuery = encodeURIComponent(query);
  return {
    text: "I want to ensure you get completely accurate and up-to-date information for your order. Please speak directly with our customer care representative on WhatsApp, who will assist you right away.",
    isEscalation: true,
    quickActions: [
      {
        id: 'escalate_whatsapp',
        label: '💬 Talk to a Human on WhatsApp',
        actionType: 'whatsapp',
        payload: `Hello Favour Business Ventures, I need assistance with: "${query}"`
      },
      {
        id: 'faq_ordering',
        label: '🛒 How Ordering Works',
        actionType: 'query',
        payload: 'How do I place an order?'
      },
      {
        id: 'faq_delivery',
        label: '🚚 Delivery Information',
        actionType: 'query',
        payload: 'What is your delivery and waybill process?'
      }
    ]
  };
}
