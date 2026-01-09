"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * PageTransition component properties
 */
export interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition Component
 *
 * Wraps page content with smooth transition effects.
 * Uses Framer Motion AnimatePresence for fade in/out.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {
            opacity: 0,
            y: 20,
          },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            },
          },
          exit: {
            opacity: 0,
            y: -20,
            transition: {
              duration: 0.2,
              ease: "easeInOut",
            },
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
