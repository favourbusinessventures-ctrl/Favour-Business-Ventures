import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FavoraBrandIntroProps {
  onFinish?: () => void;
}

const INTRO_SESSION_KEY = 'favora_brand_intro_seen';
const TOTAL_DURATION_MS = 2100;
const EXIT_DURATION_MS = 500;

// Premium easing
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export const FavoraBrandIntro: React.FC<FavoraBrandIntroProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Check if user already saw the intro in this browser session
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFinishedRef = useRef<boolean>(false);

  const completeIntro = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    } catch {
      // Ignore storage restrictions in private tabs
    }

    setIsVisible(false);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      if (onFinish) onFinish();
    }, EXIT_DURATION_MS);
  };

  useEffect(() => {
    if (!isVisible) {
      if (onFinish) onFinish();
      return;
    }

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const activeDuration = prefersReducedMotion ? 600 : TOTAL_DURATION_MS;

    timerRef.current = setTimeout(() => {
      completeIntro();
    }, activeDuration);

    // Keyboard escape listener to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        completeIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onFinish]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          id="favora-brand-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            filter: 'blur(4px)',
            transition: {
              duration: EXIT_DURATION_MS / 1000,
              ease: EASE_PREMIUM,
            },
          }}
          onClick={completeIntro}
          className="fixed inset-0 z-[9999] bg-[#071F16] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden cursor-pointer"
          role="dialog"
          aria-label="FAVORA Brand Introduction"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(13,51,37,0.7) 0%, rgba(7,31,22,1) 85%)',
            }}
          />

          {/* Very faint fine linen grain/veil overlay */}
          <div className="absolute inset-0 bg-[#071F16]/20 pointer-events-none" />

          {/* Centered Brand Signature */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full mx-auto px-4">
            
            {/* Subtle top gold accent pip */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
              className="w-1.5 h-1.5 rounded-full bg-[#B8954A] shadow-[0_0_12px_rgba(184,149,74,0.6)] mb-5"
            />

            {/* Main Wordmark: FAVORA */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 14,
                letterSpacing: '0.24em',
              }}
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: '0.34em',
              }}
              transition={{
                duration: 0.95,
                ease: EASE_PREMIUM,
                delay: 0.15,
              }}
              className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold text-[#F5F0E6] uppercase tracking-[0.34em] pl-[0.34em] leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            >
              FAVORA
            </motion.h1>

            {/* Delicate divider rule */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: EASE_PREMIUM,
                delay: 0.5,
              }}
              className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B8954A]/80 to-transparent my-4 sm:my-5 origin-center"
            />

            {/* Tagline: Stockfish • Crayfish • Seafood */}
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.85,
                ease: EASE_PREMIUM,
                delay: 0.65,
              }}
              className="flex items-center justify-center gap-2 sm:gap-3 text-[#B8954A] text-[10px] sm:text-xs font-sans-clean font-semibold tracking-[0.26em] uppercase whitespace-nowrap"
            >
              <span>Stockfish</span>
              <span className="text-[#B8954A]/60 text-[8px]">•</span>
              <span>Crayfish</span>
              <span className="text-[#B8954A]/60 text-[8px]">•</span>
              <span>Seafood</span>
            </motion.div>

            {/* Subtle Sub-label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="text-[9px] sm:text-[10px] font-sans-clean text-[#EDEDED]/50 tracking-[0.2em] uppercase mt-3"
            >
              Premium Nigerian Provisions
            </motion.p>
          </div>

          {/* Gentle skip hint (subtle, non-distracting) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="absolute bottom-6 sm:bottom-8 text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#EDEDED]/40 pointer-events-none"
          >
            Click or tap to enter
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
