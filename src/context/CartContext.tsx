import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, ProductDetail } from '../types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalUniqueItems: number;
  isCartOpen: boolean;
  recentlyAddedId: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: ProductDetail, selectedOptionName?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'fbv_shopping_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Safe fallback if localStorage is disabled/corrupt
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Safe fallback
    }
  }, [items]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const addItem = useCallback((product: ProductDetail, selectedOptionName?: string, quantity: number = 1) => {
    const optName = selectedOptionName || product.options?.[0]?.name || 'Standard Cut';
    const itemId = `${product.id}__${optName}`;
    const qtyToAdd = Math.max(1, quantity);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        productName: product.name,
        category: product.category,
        subtitle: product.subtitle,
        imageUrl: product.imageUrl,
        selectedOption: optName,
        quantity: qtyToAdd,
      };
      return [...prevItems, newItem];
    });

    // Provide visual pulse feedback
    setRecentlyAddedId(itemId);
    const timer = setTimeout(() => {
      setRecentlyAddedId(null);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: Math.min(99, newQuantity) } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUniqueItems = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalUniqueItems,
        isCartOpen,
        recentlyAddedId,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
