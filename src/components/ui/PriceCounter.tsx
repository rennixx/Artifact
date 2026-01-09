"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export interface PriceCounterProps {
  targetValue: number;
  duration?: number; // in milliseconds
  visible: boolean;
  className?: string;
}

/**
 * PriceCounter - Animated count-up effect for price display
 * Large monospace numbers with glow effect
 */
export const PriceCounter = ({
  targetValue,
  duration = 800,
  visible,
  className,
}: PriceCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!visible || hasAnimated) return;

    setHasAnimated(true);
    const startTime = performance.now();
    const startValue = 0;
    const valueRange = targetValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + valueRange * easeOutQuart;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }, [visible, targetValue, duration, hasAnimated]);

  // Reset when not visible
  useEffect(() => {
    if (!visible) {
      setDisplayValue(0);
      setHasAnimated(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={cn("relative", className)}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 blur-2xl opacity-50"
            style={{
              background: "radial-gradient(circle, #00f3ff 0%, transparent 70%)",
            }}
          />

          {/* Price display */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.2,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="font-mono font-bold text-electricCyan"
              style={{
                fontSize: "72px",
                lineHeight: 1,
                textShadow: "0 0 20px rgba(0, 243, 255, 0.5), 0 0 40px rgba(0, 243, 255, 0.3)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {formatCurrency(displayValue)}
            </motion.div>

            {/* USD label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.2 }}
              className="text-electricCyan/70 text-sm tracking-widest uppercase mt-2"
            >
              Estimated Value
            </motion.div>
          </div>

          {/* Decorative corner brackets */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-electricCyan/50"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-electricCyan/50"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-electricCyan/50"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-electricCyan/50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
