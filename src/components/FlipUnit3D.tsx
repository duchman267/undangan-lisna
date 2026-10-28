import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlipUnit3DProps {
  value: number;
  label: string;
}

export const FlipUnit3D: React.FC<FlipUnit3DProps> = ({ value, label }) => {
  const formatted = String(Math.max(0, value)).padStart(2, '0');
  const [prevValue, setPrevValue] = useState(formatted);

  useEffect(() => {
    if (formatted !== prevValue) {
      const t = setTimeout(() => setPrevValue(formatted), 350);
      return () => clearTimeout(t);
    }
  }, [formatted, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-18 h-22 sm:w-24 sm:h-28 perspective-1000 select-none">
        <div className="w-full h-full rounded-2xl bg-[#121215] border border-[#C5A059]/40 shadow-[0_18px_38px_-10px_rgba(0,0,0,0.75)] flex items-center justify-center overflow-hidden relative preserve-3d">
          {/* Center horizontal split crease */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#C5A059]/25 z-20" />
          {/* Subtle top metallic sheen */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none z-10" />

          <AnimatePresence mode="popLayout">
            <motion.span
              key={formatted}
              initial={{ rotateX: -90, opacity: 0, y: -12 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ rotateX: 90, opacity: 0, y: 12 }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-[#FAFAFA] tabular-nums tracking-tight z-10"
            >
              {formatted}
            </motion.span>
          </AnimatePresence>

          {/* Thin champagne gold corner accents */}
          <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-[#C5A059]/60" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-[#C5A059]/60" />
          <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-[#C5A059]/60" />
          <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-[#C5A059]/60" />
        </div>
      </div>
      <span className="mt-2.5 text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-medium">
        {label}
      </span>
    </div>
  );
};
