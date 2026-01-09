"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export interface ShockwaveEffectProps {
  trigger: boolean;
  origin?: { x: number; y: number };
  color?: string;
  onComplete?: () => void;
}

/**
 * ShockwaveEffect - Expanding circular shockwave animation
 * Renders at portal level to avoid z-index issues
 */
export const ShockwaveEffect = ({
  trigger,
  origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  color = "#00f3ff",
  onComplete,
}: ShockwaveEffectProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger && !isVisible) {
      setIsVisible(true);

      // Auto-remove after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(() => onComplete(), 100);
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [trigger, isVisible, onComplete]);

  if (!isVisible) return null;

  const content = (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          style={{ background: "transparent" }}
        >
          {/* Expanding circle */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{
              width: 800,
              height: 800,
              opacity: [0.6, 0.3, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="absolute rounded-full border-2"
            style={{
              left: origin.x - 400, // Center the 800px circle
              top: origin.y - 400,
              borderColor: color,
              filter: "blur(2px)",
              boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color}`,
            }}
          />

          {/* Secondary shockwave (slightly delayed) */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.4 }}
            animate={{
              width: 600,
              height: 600,
              opacity: [0.4, 0.2, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              left: origin.x - 300,
              top: origin.y - 300,
              background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
              filter: "blur(4px)",
            }}
          />

          {/* Inner flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              left: origin.x,
              top: origin.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              background: color,
              filter: "blur(8px)",
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );

  // Use portal to render at body level
  return createPortal(content, document.body);
};
