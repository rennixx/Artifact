"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface LoadingPlaceholderProps {
  size?: [number, number, number];
  color?: string;
  wireframe?: boolean;
}

/**
 * LoadingPlaceholder - Simple rotating cube placeholder
 * Displays while 3D model is loading or unavailable
 */
export const LoadingPlaceholder = ({
  size = [1, 1, 1],
  color = "#00f3ff",
  wireframe = true,
}: LoadingPlaceholderProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={size as [number, number, number]} />
      <meshBasicMaterial
        wireframe={wireframe}
        color={color}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};
