"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GRADES } from "@/lib/constants";

export interface GradeStampProps {
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  visible: boolean;
  className?: string;
}

/**
 * GradeStamp - Dramatic grade reveal component
 * Octagonal stamp with shake animation and glow effect
 */
export const GradeStamp = ({ grade, visible, className }: GradeStampProps) => {
  const gradeInfo = GRADES[grade] || GRADES.D;

  // Octagon clip-path
  const octagonPath = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 45, opacity: 0 }}
          transition={{
            scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
            rotate: { duration: 0.3, ease: "easeOut" },
            opacity: { duration: 0.2 },
          }}
          className={cn("relative inline-block", className)}
        >
          {/* Outer glow */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.2 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute inset-0 blur-xl"
            style={{ backgroundColor: gradeInfo.color }}
          />

          {/* Main octagon stamp */}
          <motion.div
            animate={{
              x: [0, -2, 2, -1, 1, 0],
            }}
            transition={{
              duration: 0.3,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            }}
            className="relative"
            style={{
              clipPath: octagonPath,
              backgroundColor: gradeInfo.color,
              padding: "24px 32px",
              boxShadow: `0 0 30px ${gradeInfo.color}, inset 0 0 20px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Inner border */}
            <div
              className="absolute inset-2 border-4"
              style={{
                borderColor: "rgba(255,255,255,0.8)",
                clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
              }}
            />

            {/* Grade letter */}
            <div className="relative">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="block font-bold text-white"
                style={{
                  fontSize: "120px",
                  lineHeight: 1,
                  textShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.3)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {grade}
              </motion.span>

              {/* Grade label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="block text-white text-center text-xs font-bold tracking-widest uppercase mt-1"
              >
                {gradeInfo.label.split("-")[0]} Tier
              </motion.span>
            </div>
          </motion.div>

          {/* Decorative corner accents */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.15 }}
              className="absolute w-3 h-3"
              style={{
                backgroundColor: "white",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                top: i < 2 ? "4px" : "auto",
                bottom: i >= 2 ? "4px" : "auto",
                left: i % 2 === 0 ? "4px" : "auto",
                right: i % 2 === 1 ? "4px" : "auto",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
