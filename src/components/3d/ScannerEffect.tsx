"use client";

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ScannerEffectProps {
  isScanning: boolean;
  scanProgress: number;
  onScanComplete?: () => void;
  modelRef: React.RefObject<THREE.Group>;
  scanDuration?: number; // in seconds
}

/**
 * ScannerEffect - Controller component for scan animation
 * Manages scan progress and updates shader uniforms
 */
export const ScannerEffect = ({
  isScanning,
  scanProgress,
  onScanComplete,
  modelRef,
  scanDuration = 2.5,
}: ScannerEffectProps) => {
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Reset start time when scan begins
  useEffect(() => {
    if (isScanning && !startTimeRef.current) {
      startTimeRef.current = performance.now();
      completedRef.current = false;
    } else if (!isScanning) {
      startTimeRef.current = null;
      completedRef.current = false;
    }
  }, [isScanning]);

  // Update shader uniforms every frame
  useFrame(({ clock }) => {
    if (!modelRef.current || !isScanning) return;

    const elapsedTime = clock.getElapsedTime();

    // Calculate scan height based on progress
    // Map 0-1 progress to Y range (2 to -2)
    const scanHeight = 2.0 - scanProgress * 4.0;

    // Traverse and update all mesh materials
    modelRef.current.traverse((child) => {
      if ("material" in child && child.material instanceof THREE.ShaderMaterial) {
        const material = child.material as THREE.ShaderMaterial;

        if (material.uniforms) {
          material.uniforms.uScanProgress.value = scanProgress;
          material.uniforms.uScanHeight.value = scanHeight;
          material.uniforms.uTime.value = elapsedTime;
        }
      }
    });

    // Check if scan is complete
    if (scanProgress >= 1.0 && !completedRef.current && onScanComplete) {
      completedRef.current = true;
      onScanComplete();
    }
  });

  return null;
};
