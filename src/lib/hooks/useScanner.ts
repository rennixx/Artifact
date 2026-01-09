import { useEffect, useRef, useCallback, useState } from "react";
import { useScanStore } from "@/store/scanStore";

export interface UseScannerOptions {
  scanDuration?: number; // in seconds
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export interface UseScannerReturn {
  isScanning: boolean;
  progress: number;
  startScan: () => void;
  stopScan: () => void;
  resetScan: () => void;
}

/**
 * useScanner - Custom hook for managing scan animation
 * Handles timing, progress updates, and state management
 */
export const useScanner = (options: UseScannerOptions = {}): UseScannerReturn => {
  const { scanDuration = 2.5, onComplete, onError } = options;

  const { scanState, scanProgress, startScan: storeStartScan, setScanProgress, completeScan, failScan, reset } = useScanStore();

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [localProgress, setLocalProgress] = useState(0);

  const isScanning = scanState === "scanning";
  const progress = scanProgress;

  // Start scan
  const startScan = useCallback(() => {
    if (isScanning) return;

    storeStartScan();
    startTimeRef.current = performance.now();
    setLocalProgress(0);

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = (currentTime - startTimeRef.current) / 1000; // Convert to seconds
      const newProgress = Math.min(elapsed / scanDuration, 1.0);

      setLocalProgress(newProgress);
      setScanProgress(newProgress);

      if (newProgress >= 1.0) {
        // Scan complete - call the store's completeScan with mock data
        completeScan({
          id: Date.now().toString(),
          grade: "A",
          value: 10000,
          confidence: 95,
          metrics: {
            authenticity: 92,
            craftsmanship: 88,
            preservation: 95,
            provenance: 90,
          },
          timestamp: Date.now(),
          artifactName: "Unknown Artifact",
          artifactType: "Ancient",
        });

        if (onComplete) {
          onComplete();
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isScanning, storeStartScan, setScanProgress, completeScan, scanDuration, onComplete]);

  // Stop scan
  const stopScan = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  // Reset scan
  const resetScan = useCallback(() => {
    stopScan();
    reset();
    setLocalProgress(0);
  }, [stopScan, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Stop animation if scan completes
  useEffect(() => {
    if (progress >= 1.0 && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [progress]);

  return {
    isScanning,
    progress,
    startScan,
    stopScan,
    resetScan,
  };
};
