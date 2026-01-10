"use client";

import { HotspotTooltip } from "./HotspotTooltip";
import { useHotspotStore } from "@/lib/hotspotStore";

/**
 * HotspotTooltipOverlay Component
 *
 * Renders the hotspot tooltip outside the Canvas as a 2D overlay.
 * This component should be placed outside the <Canvas> component in the DOM.
 */
export function HotspotTooltipOverlay() {
  const activeHotspot = useHotspotStore((s) => s.activeHotspot);
  const tooltipPosition = useHotspotStore((s) => s.tooltipPosition);
  const occludedStates = useHotspotStore((s) => s.occludedStates);

  // Don't show tooltip if no hotspot is active or if it's occluded
  if (!activeHotspot) {
    return null;
  }

  const isOccluded = occludedStates[activeHotspot.id];
  if (isOccluded) {
    return null;
  }

  return (
    <HotspotTooltip
      data={activeHotspot.data}
      position={tooltipPosition}
      visible={true}
      label={activeHotspot.label}
    />
  );
}
