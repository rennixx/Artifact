/**
 * Data Generator for streaming data visualization
 * Generates mock diagnostic and analysis data
 */

/**
 * Generate a single data fragment for the stream
 * Returns various types of mock data strings
 */
export const generateDataFragment = (): string => {
  const randomType = Math.floor(Math.random() * 20);

  switch (randomType) {
    case 0:
      return `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
    case 1:
      return `{"id":"${Math.random().toString(36).substr(2, 9)}","val":${Math.random().toFixed(2)}}`;
    case 2:
      return `RGB[${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}]`;
    case 3:
      return `PARSING MATERIAL DENSITY`;
    case 4:
      return `ANALYZING SURFACE TOPOLOGY`;
    case 5:
      return `COMPUTING VOLUMETRIC DATA`;
    case 6:
      return `EXTRACTING TEXTURE PATTERNS`;
    case 7:
      return `AUTHENTICITY_CHECK: ${(Math.random() * 100).toFixed(1)}%`;
    case 8:
      return `CONFIDENCE_SCORE: ${(Math.random() * 100).toFixed(1)}%`;
    case 9:
      return `HISTOGRAM_DATA: [${Array(5).fill(0).map(() => Math.floor(Math.random() * 100)).join(',')}]`;
    case 10:
      return `[${new Date().toISOString()}] SCAN_PROGRESS`;
    case 11:
      return `[${new Date().toISOString()}] PROCESSING_FRAGMENT`;
    case 12:
      return `MESH_VERTICES: ${Math.floor(Math.random() * 10000)}`;
    case 13:
      return `POLYGON_COUNT: ${Math.floor(Math.random() * 5000)}`;
    case 14:
      return `MATERIAL_DENSITY: ${(Math.random() * 5).toFixed(2)} g/cm³`;
    case 15:
      return `SURFACE_ROUGHNESS: ${(Math.random() * 100).toFixed(1)} µm`;
    case 16:
      return `SPECTRAL_PEAK: ${Math.floor(Math.random() * 500)} nm`;
    case 17:
      return `REFLECTANCE: ${(Math.random() * 100).toFixed(1)}%`;
    case 18:
      return Math.random() > 0.5 ? "PATTERN_MATCH: FOUND" : "PATTERN_MATCH: SEARCHING";
    case 19:
      return `FEATURE_EXTRACTION: ${Math.floor(Math.random() * 100)}%`;
    default:
      return `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
  }
};

/**
 * Generate an array of data fragments
 * @param count - Number of fragments to generate
 * @returns Array of data strings
 */
export const generateDataStream = (count: number): string[] => {
  return Array(count).fill(0).map(() => generateDataFragment());
};

/**
 * Generate a timestamp for log entries
 * @returns Formatted timestamp string
 */
export const generateTimestamp = (): string => {
  const now = new Date();
  return `[${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}]`;
};

/**
 * Data fragment types for variety
 */
export type DataFragmentType =
  | "hex"
  | "json"
  | "rgb"
  | "diagnostic"
  | "metric"
  | "timestamp"
  | "histogram"
  | "mesh"
  | "spectral";

/**
 * Generate a typed data fragment
 * @param type - Type of fragment to generate
 * @returns Data string of specified type
 */
export const generateTypedFragment = (type: DataFragmentType): string => {
  switch (type) {
    case "hex":
      return `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
    case "json":
      return `{"${Math.random().toString(36).substr(2, 4)}":${Math.floor(Math.random() * 1000)}}`;
    case "rgb":
      return `RGB[${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}]`;
    case "diagnostic":
      const messages = ["SCANNING", "ANALYZING", "PROCESSING", "COMPUTING", "EXTRACTING"];
      return `${messages[Math.floor(Math.random() * messages.length)]}_REGION_${Math.floor(Math.random() * 10)}`;
    case "metric":
      const metrics = ["DENSITY", "QUALITY", "INTEGRITY", "AUTHENTICITY", "CONFIDENCE"];
      return `${metrics[Math.floor(Math.random() * metrics.length)]}:${(Math.random() * 100).toFixed(1)}%`;
    case "timestamp":
      return generateTimestamp();
    case "histogram":
      return `HIST:[${Array(8).fill(0).map(() => Math.floor(Math.random() * 100)).join(",")}]`;
    case "mesh":
      return `MESH:v${Math.floor(Math.random() * 10000)} f${Math.floor(Math.random() * 5000)}`;
    case "spectral":
      return `SPEC:${Math.floor(Math.random() * 800)}nm ${(Math.random() * 100).toFixed(1)}%`;
    default:
      return generateDataFragment();
  }
};
