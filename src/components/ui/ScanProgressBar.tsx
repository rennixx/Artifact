import React from "react";
import { cn } from "@/lib/utils";

export interface ScanProgressBarProps {
  progress: number; // 0 to 1
  className?: string;
}

/**
 * ScanProgressBar - Horizontal progress bar styled as battery charging
 * Displays scan progress with animated glow effect
 */
export const ScanProgressBar = ({ progress, className }: ScanProgressBarProps) => {
  const percentage = Math.round(progress * 100);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Outer chamfered container */}
      <div
        className="relative h-5 bg-voidBlack/80 border border-electricCyan/30"
        style={{
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
        }}
      >
        {/* Fill bar */}
        <div
          className="absolute top-0 left-0 h-full bg-electricCyan transition-all duration-75 ease-out"
          style={{
            width: `${percentage}%`,
            clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 50%, calc(100% - 4px) 100%, 0 100%)",
            boxShadow: percentage > 0 ? "0 0 10px rgba(0, 243, 255, 0.5)" : "none",
          }}
        />

        {/* Glow effect at the leading edge */}
        {percentage > 0 && percentage < 100 && (
          <div
            className="absolute top-0 h-full w-1 bg-white"
            style={{
              left: `${percentage}%`,
              boxShadow: "0 0 15px rgba(0, 243, 255, 0.8), 0 0 30px rgba(0, 243, 255, 0.4)",
            }}
          />
        )}

        {/* Progress percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-electricCyan mix-blend-difference">
            {percentage}%
          </span>
        </div>

        {/* Scan line animation overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom,
              transparent 0%,
              rgba(0, 243, 255, 0.1) ${percentage - 5}%,
              rgba(0, 243, 255, 0.2) ${percentage}%,
              rgba(0, 243, 255, 0.1) ${percentage + 5}%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-electricCyan/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-electricCyan/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-electricCyan/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-electricCyan/50" />
    </div>
  );
};
