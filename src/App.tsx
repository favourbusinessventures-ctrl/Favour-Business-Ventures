import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { StickyMobileOrderBar } from './components/StickyMobileOrderBar';
import { FavoraBrandIntro } from './components/FavoraBrandIntro';
import { CartDrawer } from './components/CartDrawer';
import { CustomerCareFloatingButton, CustomerCareChatModal } from './components/CustomerCare';
import { CustomerCareProvider, useCustomerCare } from './context/CustomerCareContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { AboutView } from './views/AboutView';
import { GalleryView } from './views/GalleryView';
import { ContactView } from './views/ContactView';
import { AdminRoot } from './admin/AdminRoot';
import { ErrorBoundary } from './components/ErrorBoundary';

interface StorefrontContentProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onNavigateToAdmin: () => void;
  isInitialLoading: boolean;
  onFinishLoading: () => void;
}

const StorefrontContent: React.FC<StorefrontContentProps> = ({
  currentTab,
  onNavigate,
  onNavigateToAdmin,
  isInitialLoading,
  onFinishLoading
}) => {
  const { isDark } = useTheme();
  const { setNavigationHandler } = useCustomerCare();

  useEffect(() => {
    setNavigationHandler(onNavigate);
  }, [setNavigationHandler, onNavigate]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-[#071F16] text-[#EDEDED]' : 'bg-[#F5F0E6] text-[#173B2A]'
    } selection:bg-[#B8954A]/30 selection:text-[#173B2A]`}>
      
      {/* FAVORA Brand Intro on Initial Session Entry */}
      <FavoraBrandIntro onFinish={onFinishLoading} />

      {/* Top Editorial & Mobile-First Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={onNavigate}
      />

      {/* Main Content View with Smooth App-Like Route Transition (350ms, cubic-bezier(0.22, 1, 0.36, 1)) */}
      <main className="flex-1 overflow-hidden pb-12 sm:pb-0">
        <ErrorBoundary sectionName="Page Content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {currentTab === 'home' && <HomeView onNavigate={onNavigate} />}
              {currentTab === 'products' && <ProductsView />}
              {currentTab === 'about' && <AboutView />}
              {currentTab === 'gallery' && <GalleryView onNavigate={onNavigate} />}
              {currentTab === 'contact' && <ContactView />}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={onNavigate} 
        onNavigateToAdmin={onNavigateToAdmin}
      />

      {/* Subtle Floating WhatsApp Action for Desktop / Tablet */}
      <div className="hidden sm:block">
        <WhatsAppFloatingButton />
      </div>

      {/* Customer Care Floating Trigger Button */}
      <CustomerCareFloatingButton />

      {/* Interactive Customer Care Assistant Chat Modal */}
      <CustomerCareChatModal />

      {/* Shopping Cart Drawer */}
      <CartDrawer onNavigate={onNavigate} />

      {/* Sticky Mobile Order Action for Smartphones (Unobtrusive & Touch-Optimized) */}
      <StickyMobileOrderBar
        currentTab={currentTab}
        onNavigate={onNavigate}
      />

    </div>
  );
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path.startsWith('/admin') || hash.startsWith('#/admin') || hash.startsWith('#admin');
  });

  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setIsAdminRoute(path.startsWith('/admin') || hash.startsWith('#/admin') || hash.startsWith('#admin'));
    };

    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);

    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  const handleNavigate = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToStore = () => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If URL indicates Admin portal, render isolated Admin Application
  if (isAdminRoute) {
    return (
      <ThemeProvider>
        <ErrorBoundary fallbackTitle="Admin Panel Notice" fallbackMessage="An error occurred while loading the admin workspace. Please refresh or return to the storefront.">
          <AdminRoot onReturnToStore={handleReturnToStore} />
        </ErrorBoundary>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <CustomerCareProvider>
        <CartProvider>
          <StorefrontContent
            currentTab={currentTab}
            onNavigate={handleNavigate}
            onNavigateToAdmin={handleNavigateToAdmin}
            isInitialLoading={isInitialLoading}
            onFinishLoading={() => setIsInitialLoading(false)}
          />
        </CartProvider>
      </CustomerCareProvider>
    </ThemeProvider>
  );
}
