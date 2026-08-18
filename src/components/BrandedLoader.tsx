import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BrandedLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ isLoading, onFinish }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    // If reduced motion is preferred or loading finishes quickly, exit gracefully
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Safety timer to prevent loader from lingering longer than 850ms
    const timer = setTimeout(() => {
      setShouldRender(false);
      if (onFinish) onFinish();
    }, prefersReducedMotion ? 200 : 750);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // When isLoading flips to false externally, dismiss
  useEffect(() => {
    if (!isLoading) {
      const dismissTimer = setTimeout(() => {
        setShouldRender(false);
        if (onFinish) onFinish();
      }, 300);
      return () => clearTimeout(dismissTimer);
    }
  }, [isLoading, onFinish]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          id="branded-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] bg-[#071F16] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Radiance */}
          <div className="absolute w-80 h-80 rounded-full bg-[#B8954A]/10 blur-3xl pointer-events-none" />
          <div className="absolute w-96 h-96 rounded-full bg-[#0D3325]/80 blur-2xl pointer-events-none" />

          {/* Central Branded Card */}
          <div className="relative z-10 flex flex-col items-center max-w-sm space-y-6">
            
            {/* Minimalist Emblem with Gentle Gold Ring */}
            <div className="relative flex items-center justify-center w-20 h-20">
              {/* Outer Pulsing Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#B8954A]/40"
              />
              
              {/* Secondary Glowing Arc */}
              <div className="absolute inset-1 rounded-full border-t-2 border-[#B8954A] animate-spin" />

              {/* Center Emblem Container */}
              <div className="w-14 h-14 rounded-full bg-[#0D3325] border border-[#16382A] flex items-center justify-center shadow-lg">
                <span className="font-editorial text-2xl font-bold text-[#B8954A] tracking-tighter">
                  FBV
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.35em] text-[#B8954A] block"
              >
                PROVISIONS DESK
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18 }}
                className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F0E6] tracking-wider"
              >
                FAVOUR BUSINESS VENTURES
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex items-center justify-center gap-2 text-[11px] font-sans-clean text-[#F5F0E6]/70 tracking-widest uppercase pt-1"
              >
                <span>Stockfish</span>
                <span className="w-1 h-1 rounded-full bg-[#B8954A]" />
                <span>Crayfish</span>
              </motion.div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-36 h-[2px] bg-[#16382A] rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-transparent via-[#B8954A] to-transparent"
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
