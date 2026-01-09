"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";
import { useOrbitGestures } from "@/lib/hooks/useOrbitGestures";
import { useKeyboardNav } from "@/lib/hooks/useKeyboardNav";
import { NAV_NODES, calculateNodePosition, ORBIT_CONFIG, NAV_BREAKPOINTS } from "@/lib/navigation";
import { TrapezoidButton } from "@/components/ui";

/**
 * OrbitNav component properties
 */
export interface OrbitNavProps {
  /** Radius of the orbit in pixels (default: from config) */
  radius?: number;
  /** Whether to center the model in the orbit (default: true) */
  centerModel?: boolean;
}

/**
 * OrbitNav Component
 *
 * Radial orbit navigation system where menu items are positioned
 * around the 3D object and can be rotated via scroll or drag gestures.
 */
export function OrbitNav({ radius = ORBIT_CONFIG.desktopRadius, centerModel = true }: OrbitNavProps) {
  const router = useRouter();
  const { currentAngle, activeNodeId, isRotating, isDragging, setActiveNode } = useNavigationStore();

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize keyboard navigation
  useKeyboardNav();

  // Get gesture handlers
  const gestureHandlers = useOrbitGestures();

  // Detect screen size for responsive behavior
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }

      // Check if mobile
      setIsMobile(window.innerWidth < NAV_BREAKPOINTS.tablet);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  // Handle node click
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setActiveNode(nodeId);
      const node = NAV_NODES.find((n) => n.id === nodeId);
      if (node) {
        router.push(node.route);
      }
    },
    [setActiveNode, router]
  );

  // Attach event listeners to container
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return;

    container.addEventListener("wheel", gestureHandlers.onWheel, { passive: false });
    container.addEventListener("mousedown", gestureHandlers.onMouseDown);
    window.addEventListener("mousemove", gestureHandlers.onMouseMove);
    window.addEventListener("mouseup", gestureHandlers.onMouseUp);
    container.addEventListener("touchstart", gestureHandlers.onTouchStart, { passive: false });
    container.addEventListener("touchmove", gestureHandlers.onTouchMove, { passive: false });
    window.addEventListener("touchend", gestureHandlers.onTouchEnd);

    return () => {
      container.removeEventListener("wheel", gestureHandlers.onWheel);
      container.removeEventListener("mousedown", gestureHandlers.onMouseDown);
      window.removeEventListener("mousemove", gestureHandlers.onMouseMove);
      window.removeEventListener("mouseup", gestureHandlers.onMouseUp);
      container.removeEventListener("touchstart", gestureHandlers.onTouchStart);
      container.removeEventListener("touchmove", gestureHandlers.onTouchMove);
      window.removeEventListener("touchend", gestureHandlers.onTouchEnd);
    };
  }, [gestureHandlers, isMobile]);

  // Calculate adjusted radius for responsive
  const adjustedRadius = isMobile ? ORBIT_CONFIG.mobileRadius : containerSize.width < NAV_BREAKPOINTS.tablet ? ORBIT_CONFIG.tabletRadius : radius;

  // Render mobile bottom sheet
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slateGrey/95 backdrop-blur-md border-t border-electricCyan/20">
        <div className="flex overflow-x-auto gap-4 p-4 scrollbar-hide">
          {NAV_NODES.map((node) => (
            <motion.button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                node.id === activeNodeId
                  ? "bg-electricCyan text-voidBlack"
                  : "bg-transparent text-electricCyan/70 border border-electricCyan/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {node.label}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Render desktop orbit navigation
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        filter: isRotating ? "blur(0.5px)" : "none",
      }}
    >
      {/* Orbit circle visualization (optional, for visual guide) */}
      <div
        className="absolute border border-electricCyan/10 rounded-full pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          width: adjustedRadius * 2,
          height: adjustedRadius * 2,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Navigation nodes */}
      {NAV_NODES.map((node) => {
        // Calculate visual angle based on current rotation
        const visualAngle = normalizeAngle(node.angle - currentAngle - 90); // -90 to put first node at top

        // Calculate position
        const position = calculateNodePosition(visualAngle, adjustedRadius, centerX, centerY);

        // Check if this node is active (closest to top, which is -90° or 270°)
        const isActive = node.id === activeNodeId;

        // Calculate scale based on active state
        const scale = isActive ? 1.1 : 0.85;
        const opacity = isActive ? 1 : 0.6;

        // Calculate z-index based on y position (depth effect)
        const zIndex = Math.round(position.y);

        return (
          <motion.div
            key={node.id}
            className="absolute pointer-events-auto"
            style={{
              left: position.x,
              top: position.y,
              x: "-50%",
              y: "-50%",
              zIndex,
            }}
            animate={{
              scale,
              opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            whileHover={{ scale: isActive ? 1.15 : 0.95 }}
            whileTap={{ scale: isActive ? 1.05 : 0.8 }}
            onClick={() => handleNodeClick(node.id)}
          >
            <TrapezoidButton
              variant={isActive ? "primary" : "secondary"}
              disabled={false}
              className={`min-w-[100px] ${isActive ? "shadow-lg shadow-electricCyan/50" : ""}`}
            >
              <span className="text-sm font-bold tracking-wider">{node.label}</span>
            </TrapezoidButton>
          </motion.div>
        );
      })}

      {/* Center indicator showing active route */}
      <AnimatePresence>
        {activeNodeId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: `calc(50% - ${adjustedRadius + 60}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="text-electricCyan/50 text-xs font-mono tracking-widest">
              {NAV_NODES.find((n) => n.id === activeNodeId)?.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Helper function to normalize angle to 0-360 range
 */
function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}
