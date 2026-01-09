/**
 * Theme colors
 */
export const COLORS = {
  voidBlack: "#050505",
  slateGrey: "#0a0f14",
  electricCyan: "#00f3ff",
  acidGreen: "#ccff00",
  warning: "#ff6b00",
  error: "#ff0040",
} as const;

/**
 * Animation timings (in milliseconds)
 */
export const TIMING = {
  fast: 150,
  normal: 300,
  slow: 500,
  glitch: 200,
  scan: 2000,
} as const;

/**
 * Asset paths
 */
export const PATHS = {
  audio: "/audio",
  models: "/models",
  fonts: "/fonts",
} as const;

/**
 * Application configuration
 */
export const CONFIG = {
  // Scan configuration
  scanDuration: 3000, // ms
  scanRetries: 3,

  // 3D configuration
  cameraPosition: { x: 0, y: 0, z: 5 },
  modelRotationSpeed: 0.005,

  // Audio configuration
  volume: 0.5,

  // UI configuration
  maxParticles: 100,
  particleLife: 2000, // ms
} as const;

/**
 * Artifact grades with colors and labels
 */
export const GRADES = {
  S: {
    label: "S-TIER",
    color: COLORS.acidGreen,
    description: "Exceptional quality",
    minScore: 90,
  },
  A: {
    label: "A-TIER",
    color: COLORS.electricCyan,
    description: "Excellent quality",
    minScore: 80,
  },
  B: {
    label: "B-TIER",
    color: "#00ff88",
    description: "Good quality",
    minScore: 70,
  },
  C: {
    label: "C-TIER",
    color: COLORS.warning,
    description: "Fair quality",
    minScore: 60,
  },
  D: {
    label: "D-TIER",
    color: COLORS.error,
    description: "Poor quality",
    minScore: 0,
  },
} as const;

/**
 * Sound effect file names
 */
export const SOUNDS = {
  scanStart: "scan-start.mp3",
  scanning: "scanning.mp3",
  scanComplete: "scan-complete.mp3",
  error: "error.mp3",
  hover: "hover.mp3",
  click: "click.mp3",
} as const;

/**
 * Animation presets
 */
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  overlay: 10,
  modal: 50,
  tooltip: 100,
} as const;
