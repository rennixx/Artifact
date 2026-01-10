"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

/**
 * HotspotTooltip component properties
 */
export interface HotspotTooltipProps {
  /** Data to display in the tooltip */
  data: Record<string, string | number>;
  /** Position in screen coordinates */
  position: { x: number; y: number };
  /** Whether the tooltip is visible */
  visible: boolean;
  /** Optional label for the tooltip */
  label?: string;
}

/**
 * HotspotTooltip Component
 *
 * Displays detailed information about a 3D hotspot in a styled tooltip.
 * Shows key-value pairs with proper formatting.
 */
export function HotspotTooltip({ data, position, visible, label }: HotspotTooltipProps) {
  // Calculate position to avoid edge overflow
  const adjustedPosition = useMemo(() => {
    const tooltipWidth = 200;
    const tooltipHeight = 150;
    const padding = 20;

    let x = position.x;
    let y = position.y;

    // Adjust horizontally
    if (x + tooltipWidth > window.innerWidth - padding) {
      x = position.x - tooltipWidth;
    }
    if (x < padding) {
      x = padding;
    }

    // Adjust vertically
    if (y + tooltipHeight > window.innerHeight - padding) {
      y = position.y - tooltipHeight;
    }
    if (y < padding) {
      y = padding;
    }

    return { x, y };
  }, [position]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: adjustedPosition.y - 10 }}
          animate={{ opacity: 1, scale: 1, y: adjustedPosition.y }}
          exit={{ opacity: 0, scale: 0.8, y: adjustedPosition.y - 10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y,
          }}
        >
          {/* Tooltip content */}
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute w-px bg-electricCyan/50"
              style={{
                left: position.x > adjustedPosition.x + 100 ? "-20px" : "auto",
                right: position.x <= adjustedPosition.x + 100 ? "-20px" : "auto",
                top: "50%",
                height: "20px",
                transform: "translateY(-50%)",
              }}
            />

            {/* Tooltip card */}
            <div className="bg-slateGrey/95 backdrop-blur-md border border-electricCyan/40 rounded-lg p-4 min-w-[200px] shadow-lg shadow-electricCyan/20">
              {/* Label */}
              {label && (
                <h3 className="text-sm font-bold text-electricCyan mb-3 tracking-wider border-b border-electricCyan/20 pb-2">
                  {label}
                </h3>
              )}

              {/* Data entries */}
              <div className="space-y-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-electricCyan/70 uppercase tracking-wide">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-mono font-bold text-acidGreen">
                      {typeof value === "number" ? value.toFixed(1) : value}
                      {typeof value === "number" && key.toLowerCase().includes("percent") ? "%" : ""}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-electricCyan" />
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-electricCyan" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-electricCyan" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-electricCyan" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
