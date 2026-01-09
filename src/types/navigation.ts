/**
 * Navigation node types
 */

/**
 * Represents a single navigation item in the orbit system
 */
export interface NavNode {
  /** Unique identifier for the node */
  id: string;
  /** Display label for the node */
  label: string;
  /** Optional icon name/identifier */
  icon?: string;
  /** Base angle in degrees (0-360) where the node is positioned */
  angle: number;
  /** Route path for navigation */
  route: string;
}

/**
 * Represents the state of the orbit navigation system
 */
export interface OrbitNavState {
  /** Current rotation angle in degrees (0-360) */
  currentAngle: number;
  /** ID of the currently active node */
  activeNodeId: string | null;
  /** Whether the navigation is currently being rotated */
  isRotating: boolean;
  /** Whether the user is currently dragging/swiping */
  isDragging: boolean;
}

/**
 * Position coordinates for a nav node
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Configuration for the orbit navigation
 */
export interface OrbitNavConfig {
  /** Radius of the orbit in pixels */
  radius: number;
  /** Center X position */
  centerX: number;
  /** Center Y position */
  centerY: number;
  /** Whether to center the model in the orbit */
  centerModel: boolean;
  /** Snap angle in degrees (default: 90 for 4 nodes) */
  snapAngle: number;
}
