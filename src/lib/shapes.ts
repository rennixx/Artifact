/**
 * Generate clip-path polygon for trapezoid shape with cut top corners
 * @param width - Width of the element (for percentage calculations)
 * @param height - Height of the element (for percentage calculations)
 * @param cutSize - Size of the corner cut in pixels
 * @returns CSS clip-path polygon string
 */
export function trapezoidPath(
  width: number,
  height: number,
  cutSize: number = 12
): string {
  const cutPercent = (cutSize / width) * 100;
  const cutVerticalPercent = (cutSize / height) * 100;

  return `polygon(
    ${cutPercent}% 0,
    ${100 - cutPercent}% 0,
    100% ${cutVerticalPercent}%,
    100% 100%,
    0 100%,
    0 ${cutVerticalPercent}%
  )`;
}

/**
 * Generate clip-path polygon for perfect hexagon
 * @param size - Optional size modifier (default: 1.0)
 * @returns CSS clip-path polygon string for hexagon
 */
export function hexagonPath(size: number = 1.0): string {
  const flat = size * 50;
  const point = size * 25;

  return `polygon(
    50% 0%,
    100% ${point}%,
    100% ${100 - point}%,
    50% 100%,
    0 ${100 - point}%,
    0 ${point}%
  )`;
}

/**
 * Generate clip-path polygon for rectangle with 45° cut corners
 * @param cutSize - Size of the corner cut in pixels
 * @param width - Width of the element (for percentage calculations)
 * @param height - Height of the element (for percentage calculations)
 * @returns CSS clip-path polygon string
 */
export function chamferedRectPath(
  cutSize: number = 16,
  width: number = 400,
  height: number = 200
): string {
  const cutWidthPercent = (cutSize / width) * 100;
  const cutHeightPercent = (cutSize / height) * 100;

  return `polygon(
    ${cutWidthPercent}% 0,
    ${100 - cutWidthPercent}% 0,
    100% ${cutHeightPercent}%,
    100% ${100 - cutHeightPercent}%,
    ${100 - cutWidthPercent}% 100%,
    ${cutWidthPercent}% 100%,
    0 ${100 - cutHeightPercent}%,
    0 ${cutHeightPercent}%
  )`;
}

/**
 * Generate clip-path polygon for parallelogram
 * @param skew - Skew amount in degrees (default: 10)
 * @returns CSS clip-path polygon string for parallelogram
 */
export function parallelogramPath(skew: number = 10): string {
  const offset = Math.tan((skew * Math.PI) / 180) * 100;

  return `polygon(
    ${offset}% 0,
    100% 0,
    ${100 - offset}% 100%,
    0 100%
  )`;
}

/**
 * Generate clip-path polygon for chevron/arrow shape
 * @param size - Size of the arrow head (default: 20)
 * @returns CSS clip-path polygon string
 */
export function chevronPath(size: number = 20): string {
  return `polygon(
    0 0,
    calc(50% - ${size}px) 0,
    50% 50%,
    calc(50% + ${size}px) 0,
    100% 0,
    100% 100%,
    calc(50% + ${size}px) 100%,
    50% calc(50% - ${size / 2}px),
    calc(50% - ${size}px) 100%,
    0 100%
  )`;
}

/**
 * Generate CSS styles for glowing border effect
 * @param color - Color of the glow (default: 'currentColor')
 * @param size - Size of the glow in pixels (default: 8)
 * @param intensity - Opacity of the glow (default: 0.6)
 * @returns React.CSSProperties object with box-shadow
 */
export function glowBorderStyle(
  color: string = "currentColor",
  size: number = 8,
  intensity: number = 0.6
): React.CSSProperties {
  return {
    boxShadow: `0 0 ${size}px ${color.replace(")", `, ${intensity})`).replace(
      "rgb",
      "rgba"
    )}`,
  };
}

/**
 * Generate clip-path for angled top
 * @param angle - Angle in degrees (default: -5)
 * @returns CSS clip-path polygon string
 */
export function angledTopPath(angle: number = -5): string {
  const offset = Math.abs(Math.tan((angle * Math.PI) / 180) * 100);

  return `polygon(
    0 ${offset}%,
    100% 0,
    100% 100%,
    0 100%
  )`;
}

/**
 * Generate clip-path for notch cut
 * @param position - Position of notch ('top' | 'bottom' | 'left' | 'right')
 * @param size - Size of notch in pixels (default: 20)
 * @returns CSS clip-path polygon string
 */
export function notchPath(
  position: "top" | "bottom" | "left" | "right" = "top",
  size: number = 20
): string {
  const sizePercent = (size / 100) * 100; // Assuming 100px base for calculation

  switch (position) {
    case "top":
      return `polygon(
        0 100%,
        0 0,
        calc(50% - ${size / 2}px) 0,
        50% ${size}px,
        calc(50% + ${size / 2}px) 0,
        100% 0,
        100% 100%
      )`;
    case "bottom":
      return `polygon(
        0 0,
        0 100%,
        calc(50% - ${size / 2}px) 100%,
        50% calc(100% - ${size}px),
        calc(50% + ${size / 2}px) 100%,
        100% 100%,
        100% 0
      )`;
    case "left":
      return `polygon(
        0 0,
        100% 0,
        100% 100%,
        0 100%,
        0 calc(50% + ${size / 2}px),
        ${size}px 50%,
        0 calc(50% - ${size / 2}px)
      )`;
    case "right":
      return `polygon(
        0 0,
        100% 0,
        100% calc(50% - ${size / 2}px),
        calc(100% - ${size}px) 50%,
        100% calc(50% + ${size / 2}px),
        100% 100%,
        0 100%
      )`;
  }
}

/**
 * Pre-calculated clip-path strings for common sizes
 */
export const CLIP_PATHS = {
  trapezoidSmall: trapezoidPath(200, 50, 8),
  trapezoidMedium: trapezoidPath(300, 60, 12),
  trapezoidLarge: trapezoidPath(400, 70, 16),
  hexagon: hexagonPath(1.0),
  chamferedSmall: chamferedRectPath(8, 200, 100),
  chamferedMedium: chamferedRectPath(16, 400, 200),
  chamferedLarge: chamferedRectPath(24, 600, 300),
  parallelogram: parallelogramPath(10),
  chevron: chevronPath(20),
} as const;
