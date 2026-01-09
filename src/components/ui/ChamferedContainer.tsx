import React from "react";
import { cn } from "@/lib/utils";
import { chamferedRectPath } from "@/lib/shapes";

export interface ChamferedContainerProps {
  children: React.ReactNode;
  className?: string;
  cutSize?: number;
}

/**
 * ChamferedContainer - A container with 45° cut corners
 * Features decorative corner accents and responsive cut sizes
 */
export const ChamferedContainer = ({
  children,
  className,
  cutSize = 16,
}: ChamferedContainerProps) => {
  // Responsive cut size - smaller on mobile
  const responsiveCutSize = typeof window !== "undefined" && window.innerWidth < 768
    ? Math.max(cutSize * 0.6, 8)
    : cutSize;

  const clipPath = chamferedRectPath(responsiveCutSize, 600, 400);

  return (
    <div
      className={cn(
        "relative p-8",
        "bg-voidBlack/80 backdrop-blur-sm",
        "border border-electricCyan/30",
        "transition-all duration-300",
        className
      )}
      style={{
        clipPath,
      }}
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <div
          className="absolute top-1 left-1 w-6 h-px bg-electricCyan/50"
          style={{ transform: "rotate(45deg)", transformOrigin: "top left" }}
        />
      </div>
      <div className="absolute top-0 right-0 w-8 h-8">
        <div
          className="absolute top-1 right-1 w-6 h-px bg-electricCyan/50"
          style={{ transform: "rotate(-45deg)", transformOrigin: "top right" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8">
        <div
          className="absolute bottom-1 left-1 w-6 h-px bg-electricCyan/50"
          style={{ transform: "rotate(-45deg)", transformOrigin: "bottom left" }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8">
        <div
          className="absolute bottom-1 right-1 w-6 h-px bg-electricCyan/50"
          style={{ transform: "rotate(45deg)", transformOrigin: "bottom right" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
