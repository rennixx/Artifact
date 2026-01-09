import { NavNode, NodePosition } from "@/types/navigation";

/**
 * Navigation nodes for the orbit system
 * Positioned at 0°, 90°, 180°, 270° around the orbit
 */
export const NAV_NODES: NavNode[] = [
  { id: "home", label: "HOME", angle: 0, route: "/" },
  { id: "scan", label: "SCAN", angle: 90, route: "/scan" },
  { id: "history", label: "HISTORY", angle: 180, route: "/history" },
  { id: "settings", label: "SETTINGS", angle: 270, route: "/settings" },
];

/**
 * Calculate the position of a node on the orbit
 * @param angle - Angle in degrees
 * @param radius - Radius of the orbit in pixels
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @returns Position with x and y coordinates
 */
export function calculateNodePosition(
  angle: number,
  radius: number,
  centerX: number,
  centerY: number
): NodePosition {
  const rad = (angle * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(rad),
    y: centerY + radius * Math.sin(rad),
  };
}

/**
 * Normalize an angle to 0-360 range
 * @param angle - Angle in degrees
 * @returns Normalized angle (0-360)
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Calculate the angular distance between two angles
 * @param angle1 - First angle in degrees
 * @param angle2 - Second angle in degrees
 * @returns Shortest angular distance in degrees (-180 to 180)
 */
export function angularDistance(angle1: number, angle2: number): number {
  const diff = angle2 - angle1;
  const normalized = normalizeAngle(diff + 180);
  return normalized - 180;
}

/**
 * Find the node closest to a given angle
 * @param angle - Target angle in degrees
 * @param nodes - Array of navigation nodes
 * @returns The node closest to the target angle
 */
export function findClosestNode(angle: number, nodes: NavNode[]): NavNode | null {
  if (nodes.length === 0) return null;

  let closestNode = nodes[0];
  let smallestDistance = Math.abs(angularDistance(angle, nodes[0].angle));

  for (let i = 1; i < nodes.length; i++) {
    const distance = Math.abs(angularDistance(angle, nodes[i].angle));
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestNode = nodes[i];
    }
  }

  return closestNode;
}

/**
 * Snap an angle to the nearest multiple of snapAngle
 * @param angle - Angle in degrees
 * @param snapAngle - Snap interval in degrees (default: 90)
 * @returns Snapped angle
 */
export function snapAngle(angle: number, snapAngle: number = 90): number {
  return Math.round(angle / snapAngle) * snapAngle;
}

/**
 * Orbit navigation configuration defaults
 */
export const ORBIT_CONFIG = {
  /** Default radius for desktop */
  desktopRadius: 300,
  /** Default radius for tablet */
  tabletRadius: 220,
  /** Default radius for mobile (not used, uses bottom sheet) */
  mobileRadius: 150,
  /** Snap angle in degrees */
  snapAngle: 90,
  /** Rotation sensitivity for scroll/drag */
  rotationSensitivity: 0.5,
  /** Minimum rotation to trigger snap */
  snapThreshold: 15,
  /** Animation duration for snap */
  snapDuration: 0.3,
} as const;

/**
 * Responsive breakpoints for navigation modes
 */
export const NAV_BREAKPOINTS = {
  /** Mobile: use bottom sheet */
  mobile: 768,
  /** Tablet: use smaller orbit */
  tablet: 1024,
  /** Desktop: use full orbit */
  desktop: 1024,
} as const;
