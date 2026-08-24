import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Play } from 'lucide-react';
import { BrandingSettings } from '../../../types/branding';
import { validateHexColor } from '../../../config/branding';

interface IntroAnimationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrandingSettings;
}

export const IntroAnimationPreviewModal: React.FC<IntroAnimationPreviewModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const durationMs = Math.max(1500, Math.min(6000, (settings.introDuration || 3.6) * 1000));
  const effectiveBg = settings.introBackground === 'custom' 
    ? validateHexColor(settings.introBackgroundColor, '#051710') 
    : validateHexColor(settings.darkModeBackground, '#051710');

  const effectiveLogo = settings.darkModeLogoUrl || settings.primaryLogoUrl;

  const runAnimation = () => {
    setIsPlaying(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, durationMs);
  };

  useEffect(() => {
    if (isOpen) {
      runAnimation();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, settings.introDuration]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative w-full max-w-2xl h-[520px] rounded-[4px] border border-[#16382A] shadow-2xl overflow-hidden flex flex-col justify-between select-none"
        style={{ backgroundColor: effectiveBg }}
      >
        {/* Top Control Bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-[#071F16]/90 border border-[#16382A] px-3 py-1 rounded-[2px] backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B8954A]" />
            <span className="text-[11px] font-sans-clean font-semibold uppercase tracking-wider text-[#F5F0E6]">
              Intro Preview ({settings.introDuration}s • {settings.introAnimationStyle})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runAnimation}
              className="bg-[#071F16]/90 hover:bg-[#B8954A] text-[#F5F0E6] hover:text-[#071F16] border border-[#16382A] px-2.5 py-1 rounded-[2px] text-xs font-sans-clean flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Replay</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#071F16]/90 hover:bg-red-900 text-[#F5F0E6] border border-[#16382A] p-1 rounded-[2px] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${validateHexColor(settings.accentColor, '#B8954A')}25 0%, transparent 70%)`
          }}
        />

        {/* Animated Brand Stage */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10">
          <AnimatePresence mode="wait">
            {isPlaying && (
              <motion.div
                key="intro-content"
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 max-w-md flex flex-col items-center"
              >
                {/* Logo or Emblem */}
                {effectiveLogo ? (
                  <motion.img
                    src={effectiveLogo}
                    alt={settings.brandName}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{
                      height: settings.introLogoSize === 'large' ? '70px' : settings.introLogoSize === 'small' ? '40px' : '54px'
                    }}
                    className="object-contain"
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-12 h-12 rounded-[2px] border border-[#B8954A]/40 flex items-center justify-center"
                    style={{ backgroundColor: `${validateHexColor(settings.accentColor, '#B8954A')}15` }}
                  >
                    <Sparkles className="w-6 h-6 text-[#B8954A]" />
                  </motion.div>
                )}

                {/* Brand Name Title */}
                <div className="space-y-1.5">
                  <motion.h1
                    initial={{ opacity: 0, letterSpacing: '0.08em' }}
                    animate={{ opacity: 1, letterSpacing: '0.18em' }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="font-editorial text-3xl sm:text-4xl font-extrabold uppercase text-[#F5F0E6] tracking-[0.18em]"
                  >
                    {settings.brandName || 'FAVORA'}
                  </motion.h1>

                  {settings.showIntroTagline && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.7 }}
                      className="text-xs sm:text-sm font-sans-clean font-medium tracking-[0.15em] uppercase text-[#B8954A]"
                    >
                      {settings.introTagline || settings.brandTagline || 'Stockfish • Crayfish • Seafood'}
                    </motion.p>
                  )}
                </div>

                {/* Bottom luxury divider line */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B8954A] to-transparent"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-3"
            >
              <div className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-[#A3B899]">
                Animation Cycle Finished
              </div>
              <button
                type="button"
                onClick={runAnimation}
                className="px-4 py-2 bg-[#B8954A] text-[#071F16] font-sans-clean font-bold text-xs rounded-[2px] uppercase tracking-wider shadow-md hover:bg-[#C9A65B] transition-colors inline-flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Replay Animation</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-[#071F16]/90 border-t border-[#16382A] text-center text-[10px] font-sans-clean text-[#A3B899] z-20">
          Customers experience this sequence on initial website launch.
        </div>
      </div>
    </div>
  );
};
