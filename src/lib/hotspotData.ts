/**
 * 3D Hotspot configuration and data
 * Defines hotspots for interactive 3D model annotations
 */

/**
 * Hotspot configuration interface
 */
export interface HotspotConfig {
  /** Unique identifier for the hotspot */
  id: string;
  /** 3D position [x, y, z] in model space */
  position: [number, number, number];
  /** Label for the hotspot */
  label: string;
  /** Data to display in tooltip */
  data: Record<string, string | number>;
}

/**
 * Default hotspot configurations for the artifact model
 * Positioned around a cube/box shaped model
 */
export const DEFAULT_HOTSPOTS: HotspotConfig[] = [
  {
    id: "hs1",
    position: [0.5, 0.5, 0.5],
    label: "MATERIAL ANALYSIS",
    data: {
      material: "Leather",
      quality: "Grade A",
      wear_percent: 12,
      authenticity_percent: 97,
      age_years: 150,
    },
  },
  {
    id: "hs2",
    position: [-0.5, -0.3, 0.5],
    label: "STRUCTURAL INTEGRITY",
    data: {
      condition: "Excellent",
      damage: "None",
      repairs: "None",
      stability_percent: 98,
    },
  },
  {
    id: "hs3",
    position: [0, 0.6, -0.5],
    label: "SURFACE TOPOLOGY",
    data: {
      roughness_um: 45,
      texture: "Grained",
      treatment: "Natural",
      finish_percent: 92,
    },
  },
  {
    id: "hs4",
    position: [-0.4, -0.5, -0.3],
    label: "MANUFACTURING MARKS",
    data: {
      origin: "European",
      period: "19th Century",
      technique: "Hand-stitched",
      rarity: "Rare",
    },
  },
];

/**
 * Hotspot state for the manager
 */
export interface HotspotState {
  /** ID of the currently active hotspot */
  activeHotspotId: string | null;
  /** Whether hotspots are visible */
  visible: boolean;
  /** Hotspot occlusion states */
  occludedStates: Record<string, boolean>;
}
