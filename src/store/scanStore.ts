import { create } from "zustand";

/**
 * Scan state type
 */
export type ScanState = "idle" | "scanning" | "complete" | "error";

/**
 * Artifact grade type
 */
export type ArtifactGrade = "S" | "A" | "B" | "C" | "D";

/**
 * Artifact metrics
 */
export interface ArtifactMetrics {
  authenticity: number; // 0-100
  craftsmanship: number; // 0-100
  preservation: number; // 0-100
  provenance: number; // 0-100
}

/**
 * Appraisal data structure
 */
export interface AppraisalData {
  id: string;
  grade: ArtifactGrade;
  value: number;
  confidence: number;
  metrics: ArtifactMetrics;
  timestamp: number;
  artifactName: string;
  artifactType: string;
}

/**
 * Store state interface
 */
interface ScanStore {
  // State
  scanState: ScanState;
  appraisalData: AppraisalData | null;
  error: string | null;

  // Actions
  startScan: () => void;
  completeScan: (data: AppraisalData) => void;
  failScan: (error: string) => void;
  reset: () => void;
}

/**
 * Create the scan store
 */
export const useScanStore = create<ScanStore>((set) => ({
  // Initial state
  scanState: "idle",
  appraisalData: null,
  error: null,

  // Actions
  startScan: () =>
    set({
      scanState: "scanning",
      appraisalData: null,
      error: null,
    }),

  completeScan: (data) =>
    set({
      scanState: "complete",
      appraisalData: data,
      error: null,
    }),

  failScan: (error) =>
    set({
      scanState: "error",
      error,
    }),

  reset: () =>
    set({
      scanState: "idle",
      appraisalData: null,
      error: null,
    }),
}));
