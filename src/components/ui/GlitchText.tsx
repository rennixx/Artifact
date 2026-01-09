import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type GlitchTrigger = "hover" | "always" | "once";

export interface GlitchTextProps {
  children: string;
  trigger?: GlitchTrigger;
  duration?: number;
  className?: string;
  charSet?: string;
}

/**
 * GlitchText - Text component with random character glitch animation
 * Cycles through random characters before showing the actual text
 */
export const GlitchText = ({
  children,
  trigger = "hover",
  duration = 400,
  className,
  charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
}: GlitchTextProps) => {
  const [displayText, setDisplayText] = useState(children);
  const [isGlitching, setIsGlitching] = useState(false);
  const hasGlitchedOnce = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomChar = () => {
    return charSet[Math.floor(Math.random() * charSet.length)];
  };

  const startGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);

    const updateInterval = duration / 10; // Update every 40ms for 10 cycles
    let cycles = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        children
          .split("")
          .map(() => getRandomChar())
          .join("")
      );

      cycles++;

      if (cycles >= 10) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setDisplayText(children);
        setIsGlitching(false);
      }
    }, updateInterval);
  };

  useEffect(() => {
    if (trigger === "always" && !isGlitching) {
      const alwaysInterval = setInterval(() => {
        startGlitch();
      }, duration + 2000); // Glitch, then wait 2 seconds before next

      return () => clearInterval(alwaysInterval);
    }

    if (trigger === "once" && !hasGlitchedOnce.current) {
      setTimeout(() => {
        startGlitch();
        hasGlitchedOnce.current = true;
      }, 500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [trigger, duration, children]);

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      startGlitch();
    }
  };

  return (
    <span
      className={cn(
        "inline-block",
        isGlitching && "animate-glitch-text",
        className
      )}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
};
