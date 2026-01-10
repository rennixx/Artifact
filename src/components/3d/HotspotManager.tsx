"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Hotspot } from "./Hotspot";
import { HotspotConfig } from "@/lib/hotspotData";
import { isHotspotOccluded, projectToScreen } from "@/lib/3d/occlusionUtils";
import { useHotspotStore } from "@/lib/hotspotStore";
import * as THREE from "three";

/**
 * HotspotManager component properties
 */
export interface HotspotManagerProps {
  /** Array of hotspot configurations */
  hotspots: HotspotConfig[];
  /** Whether hotspots are enabled */
  enabled: boolean;
  /** Reference to the model mesh for occlusion detection */
  modelRef?: React.RefObject<THREE.Object3D | null>;
}

/**
 * HotspotManager Component
 *
 * Manages multiple 3D hotspots with occlusion detection.
 * Tooltip is rendered separately via HotspotTooltipOverlay outside the Canvas.
 */
export function HotspotManager({ hotspots, enabled = false, modelRef }: HotspotManagerProps) {
  const { camera, size } = useThree();
  const checkOcclusionRef = useRef(false);
  const setActiveHotspot = useHotspotStore((s) => s.setActiveHotspot);
  const setTooltipPosition = useHotspotStore((s) => s.setTooltipPosition);
  const setOccludedStates = useHotspotStore((s) => s.setOccludedStates);
  const activeHotspotId = useHotspotStore((s) => s.activeHotspot?.id);
  const occludedStates = useHotspotStore((s) => s.occludedStates);

  // Handle hotspot click
  const handleHotspotClick = (id: string) => {
    const hotspot = hotspots.find((h) => h.id === id);
    if (hotspot) {
      const currentId = activeHotspotId;
      setActiveHotspot(currentId === id ? null : { id: hotspot.id, label: hotspot.label, data: hotspot.data });
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-hotspot]')) {
        setActiveHotspot(null);
      }
    };

    if (activeHotspotId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeHotspotId, setActiveHotspot]);

  // Update occlusion states every frame
  useFrame(() => {
    if (!enabled || !modelRef?.current || !checkOcclusionRef.current) return;

    const newOccludedStates: Record<string, boolean> = {};

    hotspots.forEach((hotspot) => {
      const position = new THREE.Vector3(...hotspot.position);
      const isOccluded = isHotspotOccluded(position, camera, modelRef.current!);
      newOccludedStates[hotspot.id] = isOccluded;
    });

    setOccludedStates(newOccludedStates);
    checkOcclusionRef.current = false;
  });

  // Update tooltip position for active hotspot
  useFrame(() => {
    if (!enabled || !activeHotspotId || !modelRef?.current) return;

    const hotspot = hotspots.find((h) => h.id === activeHotspotId);
    if (hotspot && !occludedStates[hotspot.id]) {
      const position = new THREE.Vector3(...hotspot.position);
      const screenPos = projectToScreen(position, camera, size.width, size.height);
      setTooltipPosition(screenPos);
    }
  });

  // Trigger occlusion check after a short delay when enabled
  useEffect(() => {
    if (enabled) {
      const timeout = setTimeout(() => {
        checkOcclusionRef.current = true;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          id={hotspot.id}
          position={hotspot.position}
          label={hotspot.label}
          data={hotspot.data}
          isActive={activeHotspotId === hotspot.id}
          isOccluded={occludedStates[hotspot.id] || false}
          onClick={handleHotspotClick}
        />
      ))}
    </>
  );
}
