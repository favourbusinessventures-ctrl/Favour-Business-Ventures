import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { AboutView } from './views/AboutView';
import { GalleryView } from './views/GalleryView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  const handleNavigate = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071F16] text-[#F5F0E6]">
      
      {/* Top Editorial Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* Main Content View with Smooth Transition */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentTab === 'products' && <ProductsView />}
        {currentTab === 'about' && <AboutView />}
        {currentTab === 'gallery' && <GalleryView />}
        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Subtle Floating WhatsApp Action */}
      <WhatsAppFloatingButton />

    </div>
  );
}
