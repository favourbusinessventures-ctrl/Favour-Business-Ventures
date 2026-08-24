import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  RotateCcw, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Sparkles,
  Package,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { useCustomerCare } from '../../context/CustomerCareContext';
import { useBusinessSettings } from '../../hooks/useBusinessSettings';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { AVAILABILITY_STATUS_TEXT } from '../../services/customerCare/knowledgeBase';

export const CustomerCareChatModal: React.FC = () => {
  const { 
    isOpen, 
    closeAssistant, 
    messages, 
    sendMessage, 
    isTyping, 
    productContext, 
    clearProductContext, 
    resetConversation, 
    handleQuickAction, 
    setFeedback 
  } = useCustomerCare();

  const { settings } = useBusinessSettings();
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message or typing
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input on desktop
      const timer = setTimeout(() => {
        if (window.innerWidth > 640) {
          inputRef.current?.focus();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, isTyping]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const openHumanWhatsApp = (customPrompt?: string) => {
    const prompt = customPrompt || "Hello FAVORA, I would like to speak directly with customer care about my inquiry.";
    const url = buildWhatsAppUrl(prompt, settings.whatsappNumberRaw);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-end justify-end p-3 sm:p-6"
        aria-modal="true"
        role="dialog"
        aria-label="Customer Care Assistant"
      >
        {/* Backdrop on mobile */}
        <div 
          onClick={closeAssistant}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs sm:hidden pointer-events-auto transition-opacity"
        />

        {/* Chat Window Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative w-full sm:w-[410px] h-[82vh] sm:h-[620px] max-h-[88vh] bg-[#071F16] border border-[#B8954A]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-[#F5F0E6]"
        >
          {/* 1. HEADER */}
          <div className="bg-[#0D3325] border-b border-[#16382A] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#071F16] border border-[#B8954A]/40 flex items-center justify-center text-[#B8954A] shadow-inner">
                <Headphones className="w-4 h-4 text-[#B8954A]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-editorial text-base font-bold tracking-tight text-[#F5F0E6]">
                    FAVORA
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-sans-clean">
                  <span className="text-[#A3B899]">Customer Care</span>
                  <span className="w-1 h-1 rounded-full bg-[#6B7266]" />
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {AVAILABILITY_STATUS_TEXT}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetConversation}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={closeAssistant}
                title="Close chat"
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A3B899] hover:text-[#F5F0E6] hover:bg-[#16382A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. PRODUCT CONTEXT BANNER (IF ACTIVE) */}
          {productContext && (
            <div className="bg-[#123A2C] border-b border-[#B8954A]/30 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Package className="w-3.5 h-3.5 text-[#B8954A] shrink-0" />
                <div className="text-[11px] font-sans-clean truncate">
                  <span className="text-[#A3B899]">Asking about:</span>{' '}
                  <strong className="text-[#F5F0E6] font-semibold">{productContext.name}</strong>
                  <span className="text-[#B8954A] text-[10px] ml-1">({productContext.category})</span>
                </div>
              </div>
              <button
                onClick={clearProductContext}
                className="text-[10px] font-sans-clean text-[#A3B899] hover:text-[#F5F0E6] underline shrink-0 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* 3. MESSAGE STREAM */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans-clean leading-relaxed">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-1">
                    <span className="px-3 py-1 rounded-full bg-[#0D3325] border border-[#16382A] text-[10px] text-[#A3B899] flex items-center gap-1.5">
                      <Package className="w-3 h-3 text-[#B8954A]" />
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {/* Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#16382A] text-[#F5F0E6] border border-[#B8954A]/40 rounded-br-xs'
                        : 'bg-[#0D3325] text-[#F5F0E6] border border-[#16382A] rounded-bl-xs shadow-md'
                    }`}
                  >
                    {/* Render message body with bolding */}
                    <div className="space-y-1.5">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                        return (
                          <p key={lIdx}>
                            {line.split(/(\*[^*]+\*)/g).map((chunk, cIdx) => {
                              if (chunk.startsWith('*') && chunk.endsWith('*')) {
                                return (
                                  <strong key={cIdx} className="font-bold text-[#B8954A]">
                                    {chunk.slice(1, -1)}
                                  </strong>
                                );
                              }
                              return chunk;
                            })}
                          </p>
                        );
                      })}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        isUser ? 'text-[#A3B899]' : 'text-[#6B7266]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Feedback Controls for Assistant Messages */}
                  {!isUser && msg.sender === 'assistant' && (
                    <div className="flex items-center gap-2 text-[10px] text-[#A3B899] px-1">
                      <span>Helpful?</span>
                      <button
                        onClick={() => setFeedback(msg.id, 'helpful')}
                        className={`p-1 rounded hover:bg-[#0D3325] transition-colors cursor-pointer ${
                          msg.feedback === 'helpful' ? 'text-emerald-400 font-semibold' : 'text-[#6B7266] hover:text-[#F5F0E6]'
                        }`}
                        title="Helpful"
                        aria-label="Mark response as helpful"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setFeedback(msg.id, 'not_helpful')}
                        className={`p-1 rounded hover:bg-[#0D3325] transition-colors cursor-pointer ${
                          msg.feedback === 'not_helpful' ? 'text-amber-400 font-semibold' : 'text-[#6B7266] hover:text-[#F5F0E6]'
                        }`}
                        title="Not helpful"
                        aria-label="Mark response as not helpful"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {msg.feedback && (
                        <span className="text-[9px] text-[#A3B899] italic">
                          Thank you!
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quick Action Options */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                      {msg.quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action)}
                          className={`btn-tactile text-[10.5px] font-sans-clean font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            action.actionType === 'whatsapp'
                              ? 'bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] border-[#B8954A] font-bold'
                              : 'bg-[#071F16] hover:bg-[#16382A] text-[#F5F0E6] border-[#B8954A]/30 hover:border-[#B8954A]'
                          }`}
                        >
                          {action.actionType === 'whatsapp' && (
                            <MessageCircle className="w-3 h-3 text-[#071F16]" />
                          )}
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-[#0D3325] border border-[#16382A] rounded-2xl rounded-bl-xs w-24">
                <span className="w-2 h-2 rounded-full bg-[#B8954A] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#B8954A] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#B8954A] animate-bounce" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. HUMAN HANDOFF BAR */}
          <div className="bg-[#0D3325]/70 border-t border-[#16382A] px-3.5 py-2 flex items-center justify-between text-[11px] font-sans-clean">
            <span className="text-[#A3B899]">Need direct assistance?</span>
            <button
              onClick={() => openHumanWhatsApp()}
              className="inline-flex items-center gap-1.5 text-[#B8954A] hover:text-[#F5F0E6] font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Talk to a Human on WhatsApp</span>
            </button>
          </div>

          {/* 5. INPUT FORM */}
          <form
            onSubmit={handleSend}
            className="bg-[#071F16] border-t border-[#16382A] p-3 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about stockfish, crayfish, delivery..."
              aria-label="Type your message"
              disabled={isTyping}
              className="flex-1 bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E6] placeholder:text-[#6B7266] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
