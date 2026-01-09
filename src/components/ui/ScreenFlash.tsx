"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * Screen Flash component properties
 */
export interface ScreenFlashProps {
  /** Whether to show the flash effect */
  trigger: boolean;
  /** Maximum opacity of the flash (0-1) */
  intensity?: number;
  /** Flash color (default: white) */
  color?: string;
  /** Duration in seconds */
  duration?: number;
  /** Callback when flash completes */
  onComplete?: () => void;
}

/**
 * Screen Flash Component
 *
 * A full-screen flash effect used for dramatic impact during the reveal sequence.
 * Creates a momentary burst of light that fades quickly.
 *
 * Timing:
 * - Fade in: 50ms
 * - Hold: 50ms
 * - Fade out: 100ms
 * - Total: 200ms
 */
export function ScreenFlash({
  trigger,
  intensity = 0.3,
  color = "#ffffff",
  duration = 0.2,
  onComplete,
}: ScreenFlashProps) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: intensity }}
          exit={{ opacity: 0 }}
          transition={{
            duration: duration / 2,
            ease: "linear",
          }}
          onAnimationComplete={(definition) => {
            if (definition === "exit" && onComplete) {
              onComplete();
            }
          }}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}
