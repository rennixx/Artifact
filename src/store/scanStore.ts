import { create } from "zustand";

/**
 * Scan state type
 */
export type ScanState = "idle" | "scanning" | "complete" | "error";

/**
 * Artifact grade type
 */
export type ArtifactGrade = "S" | "A" | "B" | "C" | "D" | "F";

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
  scanProgress: number; // 0 to 1
  showResults: boolean;
  appraisalData: AppraisalData | null;
  error: string | null;

  // Actions
  startScan: () => void;
  setScanProgress: (progress: number) => void;
  completeScan: (data: AppraisalData) => void;
  failScan: (error: string) => void;
  showResultsCard: () => void;
  hideResults: () => void;
  reset: () => void;
}

/**
 * Create the scan store
 */
export const useScanStore = create<ScanStore>((set) => ({
  // Initial state
  scanState: "idle",
  scanProgress: 0,
  showResults: false,
  appraisalData: null,
  error: null,

  // Actions
  startScan: () =>
    set({
      scanState: "scanning",
      scanProgress: 0,
      appraisalData: null,
      error: null,
      showResults: false,
    }),

  setScanProgress: (progress) =>
    set((state) => ({
      scanProgress: Math.max(0, Math.min(1, progress)),
    })),

  completeScan: (data) =>
    set({
      scanState: "complete",
      scanProgress: 1,
      appraisalData: data,
      error: null,
    }),

  failScan: (error) =>
    set({
      scanState: "error",
      error,
    }),

  showResultsCard: () => set({ showResults: true }),

  hideResults: () => set({ showResults: false }),

  reset: () =>
    set({
      scanState: "idle",
      scanProgress: 0,
      appraisalData: null,
      error: null,
      showResults: false,
    }),
}));
