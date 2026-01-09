"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
}

/**
 * ParticleField - Animated particle background system
 * Creates a rotating field of particles for depth and atmosphere
 */
export const ParticleField = ({
  count = 500,
  color = "#ffffff",
  size = 0.05,
}: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random position in a box around the scene
      positions[i3] = (Math.random() - 0.5) * 20; // X: -10 to 10
      positions[i3 + 1] = (Math.random() - 0.5) * 20; // Y: -10 to 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10 - 10; // Z: -15 to -5
    }

    return positions;
  }, [count]);

  // Create geometry with positions
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(particles, 3));
    return geo;
  }, [particles]);

  // Animate rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
      pointsRef.current.rotation.x += 0.00005;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        color={color}
        opacity={0.6}
        transparent
        sizeAttenuation
      />
    </points>
  );
};
