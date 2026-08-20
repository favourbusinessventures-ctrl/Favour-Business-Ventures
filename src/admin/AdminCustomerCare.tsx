import React, { useState } from 'react';
import { 
  Headphones, 
  HelpCircle, 
  MessageSquare, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';
import { KNOWLEDGE_BASE_FAQS, DEFAULT_QUICK_ACTIONS, WELCOME_MESSAGE_TEXT, AVAILABILITY_STATUS_TEXT } from '../services/customerCare/knowledgeBase';
import { processCustomerQuery } from '../services/customerCare/assistantEngine';
import { FAQItem } from '../services/customerCare/types';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { useBusinessSettings } from '../hooks/useBusinessSettings';

export const AdminCustomerCare: React.FC = () => {
  const { products } = useLiveProducts();
  const { settings } = useBusinessSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Live Tester state
  const [testQuery, setTestQuery] = useState<string>('');
  const [testHistory, setTestHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string; isEscalation?: boolean }>>([
    {
      sender: 'assistant',
      text: WELCOME_MESSAGE_TEXT
    }
  ]);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [selectedTestProduct, setSelectedTestProduct] = useState<string>('none');

  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'ordering', label: 'Ordering' },
    { id: 'products', label: 'Products' },
    { id: 'delivery', label: 'Delivery & Waybill' },
    { id: 'payment', label: 'Payment & Pricing' },
    { id: 'storage', label: 'Storage & Preparation' },
    { id: 'general', label: 'General & Contact' }
  ];

  const filteredFaqs = KNOWLEDGE_BASE_FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleRunTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testQuery.trim() || isTesting) return;

    const query = testQuery.trim();
    setTestQuery('');
    setTestHistory(prev => [...prev, { sender: 'user', text: query }]);
    setIsTesting(true);

    try {
      const activeProd = selectedTestProduct !== 'none' 
        ? products.find(p => p.id === selectedTestProduct) || null 
        : null;

      const result = await processCustomerQuery(query, activeProd, products, settings);
      
      setTestHistory(prev => [
        ...prev, 
        { sender: 'assistant', text: result.text, isEscalation: result.isEscalation }
      ]);
    } catch (err) {
      setTestHistory(prev => [
        ...prev, 
        { sender: 'assistant', text: 'Error executing test query.', isEscalation: true }
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetTester = () => {
    setTestHistory([
      {
        sender: 'assistant',
        text: WELCOME_MESSAGE_TEXT
      }
    ]);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#F5F0E6]">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#16382A]">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans-clean font-semibold uppercase tracking-[0.2em] text-[#B8954A] mb-1">
            <Headphones className="w-4 h-4 text-[#B8954A]" />
            <span>Assistant Management</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F0E6]">
            Customer Care Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm font-sans-clean text-[#A3B899] mt-1 font-light max-w-2xl">
            Inspect the 3-tier safe response engine, review FAQ knowledge modules, and test customer inquiry resolution in real time.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D3325] border border-[#B8954A]/30 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-sans-clean font-semibold text-[#F5F0E6]">
            Assistant Engine Active
          </span>
        </div>
      </div>

      {/* ── Policy & Guardrails Banner ── */}
      <div className="bg-[#0D3325]/80 border border-[#B8954A]/30 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-sans-clean font-bold uppercase tracking-[0.16em] text-[#B8954A]">
            <ShieldCheck className="w-4 h-4 text-[#B8954A]" />
            <span>Tier 1: Verified Knowledge</span>
          </div>
          <p className="text-xs font-sans-clean text-[#A3B899] leading-relaxed">
            Strict domain FAQs on preparation, cuts, winnowing cleanliness, nationwide waybill, and bank transfer payment.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-sans-clean font-bold uppercase tracking-[0.16em] text-[#B8954A]">
            <Sparkles className="w-4 h-4 text-[#B8954A]" />
            <span>Tier 2: Live App Catalog</span>
          </div>
          <p className="text-xs font-sans-clean text-[#A3B899] leading-relaxed">
            Pulls real product cuts, descriptions, and contact channels from active catalog without inventing data.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-sans-clean font-bold uppercase tracking-[0.16em] text-[#B8954A]">
            <MessageSquare className="w-4 h-4 text-[#B8954A]" />
            <span>Tier 3: Safe WhatsApp Escalation</span>
          </div>
          <p className="text-xs font-sans-clean text-[#A3B899] leading-relaxed">
            Out-of-domain or unverified inquiries escalate instantly to direct WhatsApp chat with the customer's question preserved.
          </p>
        </div>
      </div>

      {/* ── Main 2-Column Grid: FAQ Browser & Live Playground ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Knowledge Base FAQs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-xl font-bold text-[#F5F0E6] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#B8954A]" />
              <span>Knowledge Base Modules ({filteredFaqs.length})</span>
            </h2>
          </div>

          {/* Search and Category Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#6B7266] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs by question, answer, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D3325] border border-[#16382A] focus:border-[#B8954A] rounded-xl text-xs font-sans-clean text-[#F5F0E6] placeholder:text-[#6B7266] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-sans-clean font-semibold tracking-[0.1em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#B8954A] text-[#071F16]'
                      : 'bg-[#0D3325] text-[#A3B899] hover:text-[#F5F0E6] border border-[#16382A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion / Cards */}
          <div className="space-y-3.5">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[#0D3325] border border-[#16382A] hover:border-[#B8954A]/40 rounded-xl p-4.5 space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-sans-clean font-bold uppercase tracking-[0.2em] text-[#B8954A] px-2 py-0.5 rounded bg-[#071F16] border border-[#16382A] inline-block">
                      {faq.category}
                    </span>
                    <h3 className="font-editorial text-base font-bold text-[#F5F0E6] mt-1">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <p className="text-xs font-sans-clean text-[#A3B899] whitespace-pre-line leading-relaxed pl-2 border-l-2 border-[#B8954A]/50">
                  {faq.answer}
                </p>

                {/* Keywords tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] font-sans-clean text-[#6B7266] uppercase tracking-wider">
                    Keywords:
                  </span>
                  {faq.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#071F16] text-[9.5px] font-sans-clean text-[#A3B899] border border-[#16382A]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 bg-[#0D3325]/40 border border-[#16382A] rounded-2xl">
                <HelpCircle className="w-8 h-8 text-[#6B7266] mx-auto mb-2" />
                <p className="text-xs font-sans-clean text-[#A3B899]">
                  No FAQs match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Assistant Playground / Tester (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-xl font-bold text-[#F5F0E6] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B8954A]" />
              <span>Live Assistant Tester</span>
            </h2>
            <button
              onClick={handleResetTester}
              title="Reset tester"
              className="text-[11px] font-sans-clean text-[#A3B899] hover:text-[#F5F0E6] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Tester Panel */}
          <div className="bg-[#071F16] border border-[#B8954A]/30 rounded-2xl overflow-hidden flex flex-col h-[560px] shadow-xl">
            {/* Tester Header */}
            <div className="bg-[#0D3325] p-3.5 border-b border-[#16382A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-sans-clean font-bold text-[#F5F0E6]">
                  Simulated Customer Chat
                </span>
              </div>

              {/* Product context select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#A3B899]">Context:</span>
                <select
                  value={selectedTestProduct}
                  onChange={(e) => setSelectedTestProduct(e.target.value)}
                  className="bg-[#071F16] text-[10.5px] font-sans-clean text-[#F5F0E6] border border-[#16382A] rounded px-2 py-1 focus:outline-none"
                >
                  <option value="none">No Product (General)</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-sans-clean">
              {testHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl p-3 whitespace-pre-wrap leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#16382A] text-[#F5F0E6] border border-[#B8954A]/40'
                        : msg.isEscalation
                        ? 'bg-[#0D3325] text-[#F5F0E6] border border-amber-500/50'
                        : 'bg-[#0D3325] text-[#F5F0E6] border border-[#16382A]'
                    }`}
                  >
                    {msg.text}
                    {msg.isEscalation && (
                      <div className="mt-2 pt-2 border-t border-[#16382A] text-[10px] text-amber-300 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        <span>Escalated to WhatsApp handoff (Low confidence / custom inquiry)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTesting && (
                <div className="flex items-center gap-2 p-2.5 bg-[#0D3325] border border-[#16382A] rounded-xl w-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] animate-bounce [animation-delay:-0.3s]" />
                </div>
              )}
            </div>

            {/* Quick Test Prompt Pills */}
            <div className="p-2.5 bg-[#0D3325]/50 border-t border-[#16382A] flex flex-wrap gap-1.5">
              {[
                'How do I order?',
                'Do you deliver to Abuja?',
                'Tell me about Prime Cuts',
                'Is crayfish clean from sand?',
                'How much is 10kg stockfish?'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTestQuery(p);
                  }}
                  className="px-2 py-1 rounded bg-[#071F16] hover:bg-[#16382A] text-[9.5px] text-[#A3B899] hover:text-[#F5F0E6] border border-[#16382A] transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Test Input */}
            <form onSubmit={handleRunTest} className="p-3 bg-[#0D3325] border-t border-[#16382A] flex items-center gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Type a test customer message..."
                disabled={isTesting}
                className="flex-1 bg-[#071F16] border border-[#16382A] focus:border-[#B8954A] rounded-xl px-3 py-2 text-xs text-[#F5F0E6] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!testQuery.trim() || isTesting}
                className="w-9 h-9 rounded-xl bg-[#B8954A] hover:bg-[#C9A75E] text-[#071F16] flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
