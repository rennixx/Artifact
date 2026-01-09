"use client";

import React from "react";
import { OrbitControls } from "@react-three/drei";

export interface ControlsProps {
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  autoRotate?: boolean;
  minDistance?: number;
  maxDistance?: number;
  maxPolarAngle?: number;
  minPolarAngle?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
}

/**
 * Controls - Orbit controls for camera interaction
 * Provides smooth camera movement with damping
 */
export const Controls = ({
  enableZoom = true,
  enablePan = false,
  enableRotate = true,
  autoRotate = false,
  minDistance = 3,
  maxDistance = 8,
  maxPolarAngle = Math.PI / 1.5,
  minPolarAngle = Math.PI / 3,
  enableDamping = true,
  dampingFactor = 0.05,
}: ControlsProps) => {
  return (
    <OrbitControls
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      autoRotate={autoRotate}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={maxPolarAngle}
      minPolarAngle={minPolarAngle}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      makeDefault
    />
  );
};
