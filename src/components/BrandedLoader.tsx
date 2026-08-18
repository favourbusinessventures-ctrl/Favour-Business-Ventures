import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface BrandedLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ isLoading, onFinish }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Provisions Desk...');
  const startTimeRef = useRef<number>(Date.now());
  const TOTAL_DURATION_MS = 15000; // Exact 15 seconds

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 2000 : TOTAL_DURATION_MS;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Contextual status milestones during the 15-second experience
      if (pct < 22) {
        setStatusText('Connecting Direct Provisions Desk...');
      } else if (pct < 45) {
        setStatusText('Curating Grade-A Stockfish & Sun-Dried Crayfish...');
      } else if (pct < 70) {
        setStatusText('Synchronizing Live Cuts & Portion Details...');
      } else if (pct < 92) {
        setStatusText('Preparing Culinary Showcase...');
      } else {
        setStatusText('Welcome to Favour Business Ventures');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setShouldRender(false);
          if (onFinish) onFinish();
        }, 400);
      }
    }, 40);

    // Hard failsafe: guarantee dismissal after duration + 300ms
    const failsafe = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setShouldRender(false);
      if (onFinish) onFinish();
    }, duration + 300);

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
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] bg-[#071F16] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Radiance */}
          <div className="absolute w-[32rem] h-[32rem] rounded-full bg-[#B8954A]/10 blur-3xl pointer-events-none" />
          <div className="absolute w-[40rem] h-[40rem] rounded-full bg-[#0D3325]/80 blur-2xl pointer-events-none" />

          {/* Central Branded Card */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full space-y-7 px-4">
            
            {/* Minimalist Emblem with Synchronized Gold Ring */}
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Outer Pulsing Dashed Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#B8954A]/40"
              />
              
              {/* Secondary Glowing Arc */}
              <div className="absolute inset-1.5 rounded-full border-t-2 border-r border-[#B8954A] animate-spin" />

              {/* Center Emblem Container */}
              <div className="w-16 h-16 rounded-full bg-[#0D3325] border border-[#16382A] flex items-center justify-center shadow-2xl">
                <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#B8954A] tracking-tighter">
                  FBV
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2.5">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3325]/80 border border-[#16382A] shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-[#B8954A]" />
                <span className="text-[9.5px] font-sans-clean font-semibold uppercase tracking-[0.28em] text-[#B8954A]">
                  PROVISIONS DESK
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18 }}
                className="font-editorial text-2xl sm:text-4xl font-bold text-[#F5F0E6] tracking-wider"
              >
                FAVOUR BUSINESS VENTURES
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex items-center justify-center gap-2.5 text-[11px] font-sans-clean text-[#F5F0E6]/75 tracking-widest uppercase pt-0.5"
              >
                <span>Stockfish</span>
                <span className="w-1 h-1 rounded-full bg-[#B8954A]" />
                <span>Crayfish</span>
              </motion.div>
            </div>

            {/* Intentional 15-Second Progress Experience */}
            <div className="w-full max-w-xs space-y-3 pt-2">
              {/* Progress Bar with Luminous Gold Gradient */}
              <div className="w-full h-1.5 bg-[#0D3325] border border-[#16382A] rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-[#B8954A]/80 via-[#C9A75E] to-[#B8954A] rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(184,149,74,0.6)]"
                />
              </div>

              {/* Progress Percentage & Status Label */}
              <div className="flex items-center justify-between text-xs font-sans-clean">
                <span className="text-[11px] text-[#F5F0E6]/65 font-light tracking-wide truncate max-w-[200px]">
                  {statusText}
                </span>
                <span className="text-[11px] font-semibold text-[#B8954A] tracking-wider tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Quality Standard Guarantee Footer */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-sans-clean text-[#F5F0E6]/50 tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8954A]/70" />
              <span>Direct Nigerian Foodstuff Sourcing</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
