import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBranding } from '../hooks/useBranding';
import { validateHexColor } from '../config/branding';

interface FavoraBrandIntroProps {
  onFinish?: () => void;
}

const INTRO_SESSION_KEY = 'favora_brand_intro_seen';
const EXIT_DURATION_MS = 650;

// Bespoke luxury easing curves
const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;
const EASE_SHEEN = [0.25, 1, 0.5, 1] as const;

export const FavoraBrandIntro: React.FC<FavoraBrandIntroProps> = ({ onFinish }) => {
  const { branding } = useBranding();

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
    if (!branding.enableIntro || !isVisible) {
      if (onFinish) onFinish();
      return;
    }

    // Check for user reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const durationMs = (branding.introDuration || 3.6) * 1000;
    const activeDuration = prefersReducedMotion ? 500 : durationMs;

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
  }, [isVisible, onFinish, branding.enableIntro, branding.introDuration]);

  if (!branding.enableIntro || !isVisible) return null;

  const effectiveBg = branding.introBackground === 'custom'
    ? validateHexColor(branding.introBackgroundColor, '#051710')
    : validateHexColor(branding.darkModeBackground, '#051710');

  const accentColor = validateHexColor(branding.accentColor, '#B8954A');
  const brandTitle = branding.brandName || 'FAVORA';
  const brandTagline = branding.introTagline || branding.brandTagline || 'Stockfish • Crayfish • Seafood';
  const customLogo = branding.darkModeLogoUrl || branding.primaryLogoUrl;

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden cursor-pointer"
          style={{ backgroundColor: effectiveBg }}
          role="dialog"
          aria-label={`${brandTitle} Brand Introduction`}
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
              background: `radial-gradient(circle 800px at 50% 50%, ${accentColor}30 0%, ${effectiveBg} 85%)`,
            }}
          />

          {/* Luxury Corner Accents */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-8 h-8 border-t border-l pointer-events-none" style={{ borderColor: `${accentColor}40` }} />
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-8 h-8 border-t border-r pointer-events-none" style={{ borderColor: `${accentColor}40` }} />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-8 h-8 border-b border-l pointer-events-none" style={{ borderColor: `${accentColor}40` }} />
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-8 h-8 border-b border-r pointer-events-none" style={{ borderColor: `${accentColor}40` }} />

          {/* Centered Brand Presentation */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full mx-auto px-4">
            
            {/* Top Logo / Emblem */}
            {customLogo ? (
              <motion.img
                src={customLogo}
                alt={brandTitle}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  ease: EASE_CINEMATIC,
                  delay: 0.2,
                }}
                className="max-h-16 max-w-[200px] object-contain mb-4"
              />
            ) : (
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
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}80` }} />
                <span 
                  className="w-2 h-2 rotate-45 border shadow-[0_0_12px_rgba(184,149,74,0.5)]"
                  style={{
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}50`,
                  }}
                />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}80` }} />
              </motion.div>
            )}

            {/* Wordmark Reveal */}
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
                {brandTitle}
              </motion.h1>

              {/* Light Sweep */}
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

            {/* Delicate Gold Divider Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: EASE_CINEMATIC,
                delay: 2.1,
              }}
              className="w-20 sm:w-28 h-[1px] my-5 sm:my-6 origin-center"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`
              }}
            />

            {/* Tagline Reveal */}
            {branding.showIntroTagline && (
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
                className="flex items-center justify-center gap-2.5 sm:gap-3.5 text-[10.5px] sm:text-xs md:text-sm font-sans-clean font-semibold tracking-[0.28em] sm:tracking-[0.32em] uppercase whitespace-nowrap"
                style={{ color: accentColor }}
              >
                <span>{brandTagline}</span>
              </motion.div>
            )}

            {/* Subtitle Descriptor */}
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
              {branding.subTagline || 'Artisanal Nigerian Provisions'}
            </motion.p>
          </div>

          {/* Click anywhere to enter */}
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
