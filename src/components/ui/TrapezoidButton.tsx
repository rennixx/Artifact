import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { trapezoidPath } from "@/lib/shapes";

export interface TrapezoidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/**
 * TrapezoidButton - A button with trapezoid shape using clip-path
 * Features hover effects with glow and brief glitch animation
 */
export const TrapezoidButton = forwardRef<
  HTMLButtonElement,
  TrapezoidButtonProps
>(
  (
    {
      children,
      className,
      variant = "primary",
      disabled = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setIsHovered(true);
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 100);
      onMouseEnter?.(e);
      // Sound effect trigger point - TODO: Phase 9
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    const baseStyles = "relative inline-flex items-center justify-center";
    const sizeStyles = "px-8 py-3 text-sm font-medium";
    const fontStyles = "uppercase tracking-widest";

    const variantStyles = {
      primary: cn(
        "border border-electricCyan text-electricCyan",
        "bg-transparent",
        "hover:bg-electricCyan/10",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      ),
      secondary: cn(
        "border border-electricCyan/50 text-electricCyan/70",
        "bg-transparent",
        "hover:bg-electricCyan/10 hover:border-electricCyan hover:text-electricCyan",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      ),
    };

    const clipPath = trapezoidPath(300, 50, 12);

    const buttonStyle: React.CSSProperties = {
      clipPath,
      transition: "all 0.2s ease",
      transform: isHovered && !disabled ? "translateY(-2px)" : "translateY(0)",
      boxShadow:
        isHovered && !disabled && variant === "primary"
          ? "0 0 20px rgba(0, 243, 255, 0.4)"
          : "none",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles,
          fontStyles,
          variantStyles[variant],
          isGlitching && "animate-glitch-text",
          className
        )}
        style={buttonStyle}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TrapezoidButton.displayName = "TrapezoidButton";
