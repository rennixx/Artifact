import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type DecorativeTextPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface DecorativeTextProps {
  text: string;
  position?: DecorativeTextPosition;
  className?: string;
  enableFlicker?: boolean;
}

/**
 * DecorativeText - Small decorative labels positioned in corners
 * Features optional random flicker animation
 */
export const DecorativeText = ({
  text,
  position = "top-left",
  className,
  enableFlicker = true,
}: DecorativeTextProps) => {
  const [shouldFlicker, setShouldFlicker] = useState(false);

  useEffect(() => {
    if (!enableFlicker) return;

    // 5% chance per second to flicker
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        setShouldFlicker(true);
        setTimeout(() => setShouldFlicker(false), 300);
      }
    }, 1000);

    return () => clearInterval(flickerInterval);
  }, [enableFlicker]);

  const positionStyles: Record<DecorativeTextPosition, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <div
      className={cn(
        "absolute text-xs font-mono opacity-30 pointer-events-none",
        positionStyles[position],
        shouldFlicker && "animate-flicker",
        className
      )}
    >
      {text}
    </div>
  );
};
