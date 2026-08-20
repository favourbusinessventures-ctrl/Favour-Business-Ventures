import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ChatMessage, QuickAction, MessageFeedback } from '../services/customerCare/types';
import { WELCOME_MESSAGE_TEXT, DEFAULT_QUICK_ACTIONS } from '../services/customerCare/knowledgeBase';
import { processCustomerQuery } from '../services/customerCare/assistantEngine';
import { ProductDetail, NavigationTab } from '../types';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface CustomerCareContextType {
  isOpen: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  productContext: ProductDetail | null;
  openAssistant: (product?: ProductDetail | null, initialPrompt?: string) => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (text: string) => Promise<void>;
  handleQuickAction: (action: QuickAction) => void;
  setFeedback: (messageId: string, feedback: MessageFeedback) => void;
  resetConversation: () => void;
  clearProductContext: () => void;
  setNavigationHandler: (fn: (tab: NavigationTab) => void) => void;
}

const CustomerCareContext = createContext<CustomerCareContextType | null>(null);

const STORAGE_KEY = 'fbv_customer_care_chat_history_v1';

export const CustomerCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useLiveProducts();
  const { settings } = useBusinessSettings();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [productContext, setProductContext] = useState<ProductDetail | null>(null);
  const [navigationCallback, setNavigationCallback] = useState<((tab: NavigationTab) => void) | null>(null);

  // Initialize messages with welcome message
  const createWelcomeMessage = (contextProduct?: ProductDetail | null): ChatMessage => {
    let welcomeText = WELCOME_MESSAGE_TEXT;
    if (contextProduct) {
      welcomeText = `Hi 👋 Welcome to Favour Business Ventures. I see you are inquiring about *${contextProduct.name}*. I can provide information about cuts, preparation, availability, and ordering.`;
    }
    return {
      id: 'welcome-' + Date.now(),
      sender: 'assistant',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: DEFAULT_QUICK_ACTIONS,
      productContext: contextProduct ? { id: contextProduct.id, name: contextProduct.name, category: contextProduct.category } : undefined
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [createWelcomeMessage(null)];
  });

  const setNavigationHandler = useCallback((fn: (tab: NavigationTab) => void) => {
    setNavigationCallback(() => fn);
  }, []);

  const openAssistant = useCallback((product?: ProductDetail | null, initialPrompt?: string) => {
    if (product) {
      setProductContext(product);
      setMessages(prev => {
        // Check if last message was already about this product
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.productContext?.id === product.id) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'context-notice-' + Date.now(),
            sender: 'system',
            text: `Inquiring about ${product.name} (${product.category})`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            productContext: { id: product.id, name: product.name, category: product.category }
          }
        ];
      });
    }
    setIsOpen(true);

    if (initialPrompt && initialPrompt.trim()) {
      setTimeout(() => {
        sendMessage(initialPrompt.trim(), product);
      }, 150);
    }
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const clearProductContext = useCallback(() => {
    setProductContext(null);
  }, []);

  const resetConversation = useCallback(() => {
    setProductContext(null);
    setMessages([createWelcomeMessage(null)]);
  }, []);

  const setFeedback = useCallback((messageId: string, feedback: MessageFeedback) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, feedback };
        }
        return msg;
      })
    );
  }, []);

  const sendMessage = async (text: string, overrideContext?: ProductDetail | null) => {
    if (!text.trim()) return;

    const userMsgText = text.trim();
    const activeContext = overrideContext !== undefined ? overrideContext : productContext;

    // 1. Add User Message
    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      productContext: activeContext ? { id: activeContext.id, name: activeContext.name, category: activeContext.category } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // 2. Process Query with natural micro-delay (300-600ms for realistic responsiveness)
    try {
      const response = await processCustomerQuery(
        userMsgText,
        activeContext,
        products,
        settings
      );

      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: 'assistant-' + Date.now(),
          sender: 'assistant',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: response.quickActions,
          isEscalation: response.isEscalation,
          productContext: activeContext ? { id: activeContext.id, name: activeContext.name, category: activeContext.category } : undefined
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 400);
    } catch (err) {
      setTimeout(() => {
        const errorMessage: ChatMessage = {
          id: 'assistant-err-' + Date.now(),
          sender: 'assistant',
          text: "I'm having a brief connection issue. Please contact our team directly on WhatsApp for immediate help.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEscalation: true,
          quickActions: [
            {
              id: 'err-whatsapp',
              label: '💬 Chat on WhatsApp',
              actionType: 'whatsapp',
              payload: `Hello Favour Business Ventures, I had a question regarding: "${userMsgText}"`
            }
          ]
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 300);
    }
  };

  const handleQuickAction = useCallback((action: QuickAction) => {
    if (action.actionType === 'navigate') {
      if (navigationCallback && action.payload) {
        navigationCallback(action.payload as NavigationTab);
        // Add acknowledgement in chat
        setMessages(prev => [
          ...prev,
          {
            id: 'action-nav-' + Date.now(),
            sender: 'assistant',
            text: `Navigated to the ${action.payload} section. Let me know if you need help choosing a cut!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } else if (action.actionType === 'query' && action.payload) {
      sendMessage(action.payload);
    } else if (action.actionType === 'whatsapp') {
      const msg = action.payload || settings.defaultOrderMessage;
      const url = buildWhatsAppUrl(msg, settings.whatsappNumberRaw);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [navigationCallback, settings, productContext]);

  return (
    <CustomerCareContext.Provider
      value={{
        isOpen,
        isTyping,
        messages,
        productContext,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        sendMessage: (t) => sendMessage(t),
        handleQuickAction,
        setFeedback,
        resetConversation,
        clearProductContext,
        setNavigationHandler
      }}
    >
      {children}
    </CustomerCareContext.Provider>
  );
};

export const useCustomerCare = () => {
  const ctx = useContext(CustomerCareContext);
  if (!ctx) {
    throw new Error('useCustomerCare must be used within CustomerCareProvider');
  }
  return ctx;
};
