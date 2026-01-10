"use client";

import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hotspot component properties
 */
export interface HotspotProps {
  /** 3D position [x, y, z] */
  position: [number, number, number];
  /** Label for the hotspot */
  label: string;
  /** Data object for tooltip */
  data: Record<string, string | number>;
  /** Click handler */
  onClick?: (id: string) => void;
  /** Unique ID */
  id: string;
  /** Whether this hotspot is active */
  isActive?: boolean;
  /** Whether this hotspot is occluded (behind model) */
  isOccluded?: boolean;
}

/**
 * Hotspot Component
 *
 * Interactive 3D hotspot that displays in the scene.
 * Shows a glowing dot that pulses and can be clicked to show information.
 */
export function Hotspot({ position, label, data, onClick, id, isActive = false, isOccluded = false }: HotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const scale = isHovered || isActive ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(id);
  };

  const opacity = isOccluded ? 0.2 : 1;

  return (
    <mesh ref={meshRef} position={position} visible={false}>
      {/* The hotspot marker - rendered in HTML for crisp rendering */}
      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="relative cursor-pointer"
          style={{ opacity, transition: "opacity 0.2s" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full animate-ping"
            style={{
              width: "24px",
              height: "24px",
              background: "rgba(0, 243, 255, 0.3)",
              marginLeft: "-12px",
              marginTop: "-12px",
            }}
          />

          {/* Main dot */}
          <div
            className="relative rounded-full"
            style={{
              width: "12px",
              height: "12px",
              background: isActive ? "#ccff00" : "#00f3ff",
              boxShadow: isActive
                ? "0 0 20px rgba(204, 255, 0, 0.8), 0 0 40px rgba(204, 255, 0, 0.4)"
                : "0 0 15px rgba(0, 243, 255, 0.8), 0 0 30px rgba(0, 243, 255, 0.4)",
              transition: "all 0.2s ease",
            }}
          />

          {/* Label on hover */}
          {(isHovered || isActive) && (
            <div
              className="absolute top-full mt-2 whitespace-nowrap transition-opacity duration-200"
              style={{ opacity: 1 }}
            >
              <div className="bg-voidBlack/90 backdrop-blur-sm border border-electricCyan/50 px-3 py-1 rounded text-xs font-mono text-electricCyan">
                {label}
              </div>
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
}
