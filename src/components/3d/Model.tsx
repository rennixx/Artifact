"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { scanVertexShader, scanFragmentShader } from "@/lib/shaders/scanShader";
import { HotspotManager } from "./HotspotManager";
import { DEFAULT_HOTSPOTS } from "@/lib/hotspotData";

export interface ModelProps {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  isScanning?: boolean;
  scanProgress?: number;
  showHotspots?: boolean;
}

type MaterialType = 'wireframe' | 'scanning' | 'solid';

/**
 * Model - 3D model loader with GLTF format and scan shader support
 */
export const Model = ({
  modelPath,
  scale = 1,
  autoRotate = true,
  rotationSpeed = 0.002,
  isScanning = false,
  scanProgress = 0,
  showHotspots = false,
}: ModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [materialType, setMaterialType] = useState<MaterialType>('wireframe');

  // Load the GLTF model
  const { scene } = useGLTF(modelPath);

  // Store original materials
  const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

  // Clone the scene and store original materials
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if ("isMesh" in child && child.isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        // Store original material
        if (mesh.material) {
          originalMaterials.current.set(mesh, mesh.material);
        }
      }
    });
    return cloned;
  }, [scene]);

  // Apply materials based on state
  useEffect(() => {
    if (!clonedScene || !groupRef.current) return;

    clonedScene.traverse((child) => {
      if ("isMesh" in child && child.isMesh) {
        const mesh = child as THREE.Mesh;

        if (isScanning) {
          setMaterialType('scanning');

          // Apply scan shader material
          mesh.material = new THREE.ShaderMaterial({
            vertexShader: scanVertexShader,
            fragmentShader: scanFragmentShader,
            uniforms: {
              uScanProgress: { value: scanProgress },
              uAccentColor: { value: new THREE.Color('#00f3ff') },
              uScanHeight: { value: 2.0 - scanProgress * 4.0 },
              uScanThickness: { value: 0.15 },
              uTime: { value: 0 },
            },
            transparent: true,
            side: THREE.DoubleSide,
          });
        } else if (materialType === 'solid' || scanProgress >= 1.0) {
          setMaterialType('solid');

          // Restore or create solid material
          const originalMat = originalMaterials.current.get(mesh);
          if (originalMat) {
            mesh.material = originalMat;
          } else {
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0x4a5568,
              metalness: 0.7,
              roughness: 0.3,
            });
          }
        } else {
          setMaterialType('wireframe');

          // Apply wireframe material
          mesh.material = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
          });
        }
      }
    });
  }, [isScanning, scanProgress, materialType, clonedScene]);

  // Auto-rotate animation (disable when hotspot is active)
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  if (!clonedScene) {
    return null;
  }

  // For LoadingPlaceholder (no actual model), still show hotspots
  const isPlaceholder = modelPath.includes("placeholder");

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
      {/* Show hotspots after scan is complete */}
      {showHotspots && (
        <HotspotManager
          hotspots={DEFAULT_HOTSPOTS}
          enabled={true}
          modelRef={groupRef}
        />
      )}
    </group>
  );
};
