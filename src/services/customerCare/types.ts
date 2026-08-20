import { ProductDetail } from '../../types';

export type MessageSender = 'user' | 'assistant' | 'system';

export type QuickActionType = 'navigate' | 'query' | 'whatsapp' | 'product';

export interface QuickAction {
  id: string;
  label: string;
  actionType: QuickActionType;
  payload?: string;
  icon?: string;
}

export type MessageFeedback = 'helpful' | 'not_helpful';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  quickActions?: QuickAction[];
  feedback?: MessageFeedback;
  productContext?: {
    id: string;
    name: string;
    category?: string;
  };
  isEscalation?: boolean;
}

export interface FAQItem {
  id: string;
  category: 'products' | 'ordering' | 'delivery' | 'payment' | 'storage' | 'general';
  question: string;
  answer: string;
  keywords: string[];
  suggestedActions?: QuickAction[];
}

export interface CustomerCareConfig {
  welcomeMessage: string;
  availabilityStatus: string;
  operatingNote: string;
  quickPrompts: string[];
}
