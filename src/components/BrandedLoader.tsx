import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandedLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

const TARGET_DURATION_MS = 4000;
const HARD_MAX_MS = 5000;

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ isLoading, onFinish }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 1200 : TARGET_DURATION_MS;

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setProgress(100);
      setTimeout(() => {
        setShouldRender(false);
        if (onFinish) onFinish();
      }, 350);
    };

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        finish();
      }
    }, 40);

    const failsafe = setTimeout(finish, HARD_MAX_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          id="branded-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] bg-[#071F16]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
        >
          <div className="relative z-10 flex flex-col items-center space-y-6">
            {/* Logo Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center w-16 h-16"
            >
              <div className="absolute inset-0 rounded-full border border-[#B8954A]/30" />
              <div className="absolute inset-1.5 rounded-full border-t-2 border-[#B8954A] animate-spin" />
              <div className="w-11 h-11 rounded-full bg-[#0D3325] border border-[#16382A] flex items-center justify-center shadow-lg">
                <span className="font-editorial text-lg font-bold text-[#B8954A] tracking-tighter">
                  FBV
                </span>
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-editorial text-xl sm:text-2xl font-bold text-[#F5F0E6] tracking-[0.12em] uppercase"
            >
              Favour Business Ventures
            </motion.h1>

            {/* Subtle Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-40 h-[3px] bg-[#0D3325] border border-[#16382A] rounded-full overflow-hidden"
            >
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[#B8954A] to-[#C9A75E] rounded-full transition-all duration-100 ease-out"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
