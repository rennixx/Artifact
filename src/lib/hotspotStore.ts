"use client";

import { create } from "zustand";

/**
 * Hotspot data structure
 */
export interface HotspotData {
  id: string;
  label: string;
  data: Record<string, string | number>;
}

/**
 * Hotspot store state
 */
interface HotspotState {
  /** Currently active hotspot */
  activeHotspot: HotspotData | null;
  /** Screen position for tooltip */
  tooltipPosition: { x: number; y: number };
  /** Whether hotspots are occluded */
  occludedStates: Record<string, boolean>;
  /** Set active hotspot */
  setActiveHotspot: (hotspot: HotspotData | null) => void;
  /** Update tooltip position */
  setTooltipPosition: (position: { x: number; y: number }) => void;
  /** Update occlusion state for a specific hotspot */
  setOccludedState: (id: string, isOccluded: boolean) => void;
  /** Update all occlusion states */
  setOccludedStates: (states: Record<string, boolean>) => void;
  /** Check if a hotspot is occluded */
  isOccluded: (id: string) => boolean;
}

/**
 * Zustand store for hotspot state
 * Shared between 3D scene and 2D UI overlay
 */
export const useHotspotStore = create<HotspotState>((set, get) => ({
  activeHotspot: null,
  tooltipPosition: { x: 0, y: 0 },
  occludedStates: {},

  setActiveHotspot: (hotspot) => set({ activeHotspot: hotspot }),

  setTooltipPosition: (position) => set({ tooltipPosition: position }),

  setOccludedState: (id, isOccluded) =>
    set((state) => ({
      occludedStates: { ...state.occludedStates, [id]: isOccluded },
    })),

  setOccludedStates: (states) => set({ occludedStates: states }),

  isOccluded: (id) => get().occludedStates[id] ?? false,
}));
