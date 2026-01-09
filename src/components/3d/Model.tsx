"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export interface ModelProps {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

/**
 * Model - 3D model loader with GLTF format
 * Loads and displays 3D models with optional auto-rotation
 */
export const Model = ({
  modelPath,
  scale = 1,
  autoRotate = true,
  rotationSpeed = 0.002,
}: ModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Load the GLTF model
  const { scene } = useGLTF(modelPath);

  // Clone the scene to avoid mutations
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if ("isMesh" in child && child.isMesh) {
        (child as THREE.Mesh).castShadow = false;
        (child as THREE.Mesh).receiveShadow = false;
      }
    });
    return cloned;
  }, [scene]);

  // Auto-rotate animation
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  if (!clonedScene) {
    return null;
  }

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};
