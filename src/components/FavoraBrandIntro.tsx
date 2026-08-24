import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FavoraBrandIntroProps {
  onFinish?: () => void;
}

const INTRO_SESSION_KEY = 'favora_brand_intro_seen';
// Full cinematic timeline: 3.7 seconds of experience + 0.65s smooth dissolve reveal
const TOTAL_EXPERIENCE_MS = 3700;
const EXIT_DURATION_MS = 650;

// Bespoke luxury easing curves
const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;
const EASE_SHEEN = [0.25, 1, 0.5, 1] as const;

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
      // Ignore storage restrictions in restricted contexts
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

    // Check for user reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const activeDuration = prefersReducedMotion ? 500 : TOTAL_EXPERIENCE_MS;

    timerRef.current = setTimeout(() => {
      completeIntro();
    }, activeDuration);

    // Keyboard shortcut to skip immediately
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
            scale: 1.025,
            filter: 'blur(6px)',
            transition: {
              duration: EXIT_DURATION_MS / 1000,
              ease: EASE_CINEMATIC,
            },
          }}
          onClick={completeIntro}
          className="fixed inset-0 z-[9999] bg-[#051710] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden cursor-pointer"
          role="dialog"
          aria-label="FAVORA Brand Introduction"
        >
          {/* Phase 1: Atmospheric Background & Slow Ambient Radial Breathing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{
              duration: 3.5,
              ease: 'easeOut',
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle 800px at 50% 50%, rgba(22,73,54,0.45) 0%, rgba(13,51,37,0.2) 45%, rgba(5,23,16,1) 85%)',
            }}
          />

          {/* Faint Center Warm Gold Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0.35] }}
            transition={{
              duration: 3.2,
              times: [0, 0.6, 1],
              ease: 'easeInOut',
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle 420px at 50% 48%, rgba(184,149,74,0.12) 0%, rgba(184,149,74,0.02) 60%, transparent 80%)',
            }}
          />

          {/* Minimalist Framing Accents (Luxury Border Hints) */}
          <div className="absolute inset-8 sm:inset-14 md:inset-20 border border-[#B8954A]/10 pointer-events-none rounded-sm">
            {/* Top-left corner mark */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#B8954A]/40" />
            {/* Top-right corner mark */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#B8954A]/40" />
            {/* Bottom-left corner mark */}
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#B8954A]/40" />
            {/* Bottom-right corner mark */}
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#B8954A]/40" />
          </div>

          {/* Centered Brand Presentation */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full mx-auto px-4">
            
            {/* Phase 1 & 2: Top Refined Crest Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.85,
                ease: EASE_CINEMATIC,
                delay: 0.3,
              }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <span className="w-1 h-1 rounded-full bg-[#B8954A]/50" />
              <span className="w-2 h-2 rotate-45 border border-[#B8954A] bg-[#B8954A]/30 shadow-[0_0_12px_rgba(184,149,74,0.5)]" />
              <span className="w-1 h-1 rounded-full bg-[#B8954A]/50" />
            </motion.div>

            {/* Phase 2: FAVORA Wordmark Reveal */}
            <div className="relative overflow-hidden py-1 px-4">
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 20,
                  letterSpacing: '0.22em',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  letterSpacing: '0.36em',
                }}
                transition={{
                  duration: 1.15,
                  ease: EASE_CINEMATIC,
                  delay: 0.7,
                }}
                className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F5F0E6] uppercase tracking-[0.36em] pl-[0.36em] leading-none drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
              >
                FAVORA
              </motion.h1>

              {/* Phase 3: Premium Light Sweep passing across the wordmark */}
              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={{
                  x: '140%',
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.1,
                  ease: EASE_SHEEN,
                  delay: 1.8,
                  times: [0, 0.2, 0.8, 1],
                }}
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.05) 35%, rgba(245,240,230,0.6) 50%, rgba(184,149,74,0.5) 58%, transparent 75%)',
                }}
              />
            </div>

            {/* Phase 4: Delicate Gold Divider Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: EASE_CINEMATIC,
                delay: 2.1,
              }}
              className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent my-5 sm:my-6 origin-center"
            />

            {/* Phase 4: Tagline Reveal (Noticeably after wordmark) */}
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.85,
                ease: EASE_CINEMATIC,
                delay: 2.3,
              }}
              className="flex items-center justify-center gap-2.5 sm:gap-3.5 text-[#C9A75E] text-[10.5px] sm:text-xs md:text-sm font-sans-clean font-semibold tracking-[0.28em] sm:tracking-[0.32em] uppercase whitespace-nowrap"
            >
              <span>Stockfish</span>
              <span className="text-[#B8954A]/60 text-[8px] sm:text-[9px]">•</span>
              <span>Crayfish</span>
              <span className="text-[#B8954A]/60 text-[8px] sm:text-[9px]">•</span>
              <span>Seafood</span>
            </motion.div>

            {/* Phase 4: Subtle Heritage Descriptor */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.55, y: 0 }}
              transition={{
                duration: 0.7,
                ease: EASE_CINEMATIC,
                delay: 2.65,
              }}
              className="text-[9px] sm:text-[10px] font-sans-clean text-[#EDEDED]/60 tracking-[0.24em] uppercase mt-3.5"
            >
              Artisanal Nigerian Provisions
            </motion.p>
          </div>

          {/* Phase 5 & Skip Indicator: Subtle, non-intrusive interactive affordance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute bottom-6 sm:bottom-10 text-[9.5px] font-sans-clean tracking-[0.22em] uppercase text-[#EDEDED]/40 pointer-events-none"
          >
            Click anywhere to enter
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
