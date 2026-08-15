import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { StickyMobileOrderBar } from './components/StickyMobileOrderBar';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { AboutView } from './views/AboutView';
import { GalleryView } from './views/GalleryView';
import { ContactView } from './views/ContactView';
import { AdminRoot } from './admin/AdminRoot';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
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
    return <AdminRoot onReturnToStore={handleReturnToStore} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#071F16] text-[#F5F0E6] selection:bg-[#B8954A]/30 selection:text-[#F5F0E6]">
      
      {/* Top Editorial & Mobile-First Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* Main Content View with Smooth App-Like Route Transition (350ms, cubic-bezier(0.22, 1, 0.36, 1)) */}
      <main className="flex-1 overflow-hidden pb-12 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {currentTab === 'home' && <HomeView onNavigate={handleNavigate} />}
            {currentTab === 'products' && <ProductsView />}
            {currentTab === 'about' && <AboutView />}
            {currentTab === 'gallery' && <GalleryView />}
            {currentTab === 'contact' && <ContactView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onNavigateToAdmin={handleNavigateToAdmin}
      />

      {/* Subtle Floating WhatsApp Action for Desktop / Tablet */}
      <div className="hidden sm:block">
        <WhatsAppFloatingButton />
      </div>

      {/* Sticky Mobile Order Action for Smartphones (Unobtrusive & Touch-Optimized) */}
      <StickyMobileOrderBar
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

    </div>
  );
}
