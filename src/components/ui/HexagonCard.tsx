import React from "react";
import { cn } from "@/lib/utils";
import { hexagonPath } from "@/lib/shapes";

export interface HexagonCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * HexagonCard - A card component with hexagon shape
 * Features backdrop blur, border glow on hover, and smooth transitions
 */
export const HexagonCard = ({
  children,
  className,
  glowColor = "rgba(0, 243, 255, 0.3)",
}: HexagonCardProps) => {
  const clipPath = hexagonPath(1.0);

  return (
    <div
      className={cn(
        "relative p-6",
        "bg-slateGrey/50 backdrop-blur-md",
        "border border-white/20",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg",
        className
      )}
      style={{
        clipPath,
        transition: "all 0.3s ease",
      }}
    >
      {/* Glow border effect on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          clipPath,
          boxShadow: `inset 0 0 20px ${glowColor}`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
