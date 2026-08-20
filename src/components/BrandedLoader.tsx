```tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandedLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

const TARGET_DURATION_MS = 4000;
const HARD_MAX_MS = 5000;
const EXIT_DURATION_MS = 600;

// Premium easing curves
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.45, 0, 0.15, 1] as const;

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  isLoading,
  onFinish,
}) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    finishedRef.current = false;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const duration = prefersReducedMotion
      ? 1200
      : TARGET_DURATION_MS;

    const finish = () => {
      if (finishedRef.current) return;

      finishedRef.current = true;
      setProgress(100);

      setTimeout(() => {
        setShouldRender(false);

        if (onFinish) {
          onFinish();
        }
      }, EXIT_DURATION_MS);
    };

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;

      // Ease-out progress curve for a natural fill
      const linear = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - linear, 2.2);
      const pct = Math.min(100, Math.floor(eased * 100));

      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        finish();
      }
    }, 40);

    // Absolute failsafe: loader can never remain forever
    const failsafe = setTimeout(() => {
      clearInterval(interval);
      finish();
    }, HARD_MAX_MS);

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
          exit={{
            opacity: 0,
            filter: 'blur(8px)',
            transition: {
              duration: EXIT_DURATION_MS / 1000,
              ease: EASE_OUT_EXPO,
            },
          }}
          className="fixed inset-0 z-[100] bg-[#071F16] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        >
          {/* Subtle premium depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(13,51,37,0.55) 0%, rgba(7,31,22,0) 70%)',
            }}
          />

          {/* Faint glass veil */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-[#071F16]/20 pointer-events-none" />

          {/* Centerpiece */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Emblem reveal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                ease: EASE_OUT_EXPO,
                delay: 0.05,
              }}
              className="relative flex items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px]"
            >

              {/* Outer hairline ring */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 1.08,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1.1,
                  ease: EASE_OUT_EXPO,
                  delay: 0.1,
                }}
                className="absolute inset-0 rounded-full border border-[#B8954A]/25"
              />

              {/* Inner emblem disc */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0D3325] border border-[#16382A] flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.5)] overflow-hidden">

                <span className="font-editorial text-lg sm:text-xl font-bold text-[#B8954A] tracking-tighter relative z-10">
                  FBV
                </span>

                {/* Subtle light sweep */}
                <motion.div
                  initial={{
                    x: '-120%',
                    opacity: 0,
                  }}
                  animate={{
                    x: '120%',
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 1.1,
                    ease: EASE_IN_OUT,
                    delay: 0.55,
                    times: [0, 0.5, 1],
                  }}
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 35%, rgba(245,240,230,0.22) 50%, transparent 65%)',
                  }}
                />
              </div>

              {/* Tiny gold settle tick */}
              <motion.div
                initial={{
                  scaleX: 0,
                  opacity: 0,
                }}
                animate={{
                  scaleX: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.7,
                  ease: EASE_OUT_EXPO,
                  delay: 0.85,
                }}
                className="absolute -bottom-3 w-8 h-px bg-[#B8954A]/70 origin-center"
              />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 10,
                letterSpacing: '0.28em',
              }}
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: '0.14em',
              }}
              transition={{
                duration: 1.0,
                ease: EASE_OUT_EXPO,
                delay: 0.45,
              }}
              className="font-editorial text-lg sm:text-xl md:text-[22px] font-semibold text-[#F5F0E6] uppercase mt-7 whitespace-nowrap"
            >
              Favour Business Ventures
            </motion.h1>

            {/* Progress indicator */}
            <motion.div
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                ease: EASE_OUT_EXPO,
                delay: 0.75,
              }}
              className="relative w-36 sm:w-44 h-[2px] mt-6 rounded-full bg-[#0D3325] border border-[#16382A]/70 overflow-hidden"
            >

              {/* Filled portion */}
              <div
                style={{
                  width: `${progress}%`,
                }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#B8954A] to-[#C9A75E] rounded-full transition-all duration-100 ease-out"
              />

              {/* Traveling highlight */}
              <motion.div
                initial={{
                  x: '-100%',
                }}
                animate={{
                  x: '100%',
                }}
                transition={{
                  duration: 1.8,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatDelay: 0.2,
                }}
                className="absolute inset-y-0 w-1/3 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(245,240,230,0.45), transparent)',
                }}
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```
