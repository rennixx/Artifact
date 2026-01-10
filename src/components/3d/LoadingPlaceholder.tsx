"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HotspotManager } from "./HotspotManager";
import { DEFAULT_HOTSPOTS } from "@/lib/hotspotData";

export interface LoadingPlaceholderProps {
  size?: [number, number, number];
  color?: string;
  wireframe?: boolean;
  showHotspots?: boolean;
}

/**
 * LoadingPlaceholder - Simple rotating cube placeholder
 * Displays while 3D model is loading or unavailable
 */
export const LoadingPlaceholder = ({
  size = [1, 1, 1],
  color = "#00f3ff",
  wireframe = true,
  showHotspots = false,
}: LoadingPlaceholderProps) => {
  const meshRef = useRef<THREE.Object3D>(null);

  // Rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={size as [number, number, number]} />
        <meshBasicMaterial
          wireframe={wireframe}
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Show hotspots when scan is complete */}
      {showHotspots && (
        <HotspotManager
          hotspots={DEFAULT_HOTSPOTS}
          enabled={true}
          modelRef={meshRef}
        />
      )}
    </group>
  );
};
