"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import {
  TrapezoidButton,
  DecorativeText,
  ScanProgressBar,
  ResultCard,
  ShockwaveEffect,
  ScreenFlash,
  DataStream,
  HotspotTooltipOverlay,
} from "@/components/ui";
import { LoadingPlaceholder } from "@/components/3d";
import { useScanStore } from "@/store/scanStore";
import { useScanner } from "@/lib/hooks/useScanner";
import { motion, AnimatePresence } from "framer-motion";
import { createRevealTimeline, RevealCallbacks } from "@/lib/animations/revealTimeline";
import { generateMockAppraisalSync } from "@/lib/mockAppraisal";

// Dynamically import 3D components to disable SSR
const Scene = dynamic(() => import("@/components/3d/Scene").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-voidBlack">
      <div className="text-center space-y-4">
        <div className="text-electricCyan text-xl font-mono animate-pulse">
          [INITIALIZING 3D ENVIRONMENT]
        </div>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-electricCyan animate-pulse" />
          <div className="w-2 h-2 bg-electricCyan animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-electricCyan animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  ),
});

const Environment = dynamic(() => import("@/components/3d/Environment").then((mod) => mod.Environment), {
  ssr: false,
});

const ParticleField = dynamic(() => import("@/components/3d/ParticleField").then((mod) => mod.ParticleField), {
  ssr: false,
});

const Controls = dynamic(() => import("@/components/3d/Controls").then((mod) => mod.Controls), {
  ssr: false,
});

const WebGLError = dynamic(() => import("@/components/3d/WebGLError").then((mod) => mod.WebGLError), {
  ssr: false,
});

export default function Home() {
  const [showShockwave, setShowShockwave] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const { scanState, scanProgress, appraisalData, showResults, showResultsCard, hideResults, reset } = useScanStore();

  // Store the current timeline in a ref
  const timelineRef = useRef<GSAPTimeline | null>(null);

  // Create reveal timeline callback
  const handleRevealComplete = () => {
    console.log("Full reveal sequence complete");
  };

  // Setup reveal callbacks
  const revealCallbacks: RevealCallbacks = {
    onScanComplete: () => {
      console.log("Scan complete - model solidified");
    },
    onGradeStamp: () => {
      console.log("Grade stamp revealed");
    },
    onPriceCounter: () => {
      console.log("Price counter revealed");
    },
    onShockwave: () => {
      console.log("Triggering shockwave");
      setShowShockwave(true);
    },
    onMetrics: () => {
      console.log("Metrics revealed");
    },
    onButtons: () => {
      console.log("Buttons revealed");
      showResultsCard();
    },
    onComplete: handleRevealComplete,
  };

  const { startScan, resetScan } = useScanner({
    scanDuration: 2.5,
    onComplete: () => {
      // Generate mock appraisal data (sync version for instant results)
      const mockData = generateMockAppraisalSync();

      // Create and play the reveal timeline
      const timeline = createRevealTimeline({
        data: mockData,
        callbacks: revealCallbacks,
      });

      timelineRef.current = timeline;
      timeline.play();
    },
  });

  const handleScanClick = () => {
    if (scanState === "idle" || scanState === "complete") {
      hideResults();
      reset();
      setShowShockwave(false);
      setShowFlash(false);

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // Small delay before starting scan
      setTimeout(() => {
        startScan();
      }, 50);
    }
  };

  const handleScanAgain = () => {
    hideResults();
    reset();
    setShowShockwave(false);
    setShowFlash(false);

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Small delay before starting scan
    setTimeout(() => {
      startScan();
    }, 300);
  };

  const handleViewDetails = () => {
    console.log("View details clicked", appraisalData);
    // TODO: Navigate to details page or show modal
  };

  const getButtonText = () => {
    switch (scanState) {
      case "idle":
        return "INITIATE SCAN";
      case "scanning":
        return "SCANNING...";
      case "complete":
        return "SCAN COMPLETE";
      case "error":
        return "SCAN FAILED";
      default:
        return "INITIATE SCAN";
    }
  };

  // Cleanup timeline on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      <WebGLError />

      <div className="relative w-full h-screen">
        <Scene>
          <Environment />
          <ParticleField count={500} color="#ffffff" size={0.05} />
          <Suspense fallback={<LoadingPlaceholder size={[1.5, 1.5, 1.5]} color="#00f3ff" />}>
            {/* Using LoadingPlaceholder directly since we don't have a .glb file yet */}
            <LoadingPlaceholder
              size={[1.5, 1.5, 1.5]}
              color="#00f3ff"
              wireframe={scanState !== "complete"}
              showHotspots={scanState === "complete"}
            />
          </Suspense>
          <Controls />
        </Scene>

        {/* Hotspot Tooltip Overlay - 2D overlay outside Canvas */}
        <HotspotTooltipOverlay />

        {/* Data Stream - shows during scanning */}
        <DataStream isActive={scanState === "scanning"} speed={60} />

        {/* Screen Flash Effect */}
        <ScreenFlash
          trigger={showFlash}
          intensity={0.3}
          duration={0.2}
          onComplete={() => setShowFlash(false)}
        />

        {/* Shockwave effect */}
        <ShockwaveEffect
          trigger={showShockwave}
          origin={{ x: typeof window !== "undefined" ? window.innerWidth / 2 : 500, y: typeof window !== "undefined" ? window.innerHeight / 2 : 400 }}
          onComplete={() => setShowShockwave(false)}
        />

        {/* Result Card */}
        <ResultCard
          appraisalData={appraisalData}
          visible={showResults}
          onScanAgain={handleScanAgain}
          onViewDetails={handleViewDetails}
        />

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <DecorativeText text="V.0.0.1" position="top-left" />
          <DecorativeText text="SYS_READY" position="top-right" />
          <DecorativeText text={scanState === "scanning" ? "[SCANNING...]" : scanState === "complete" ? "[COMPLETE]" : "[READY]"} position="bottom-left" />
          <DecorativeText text="● LIVE" position="bottom-right" />
        </div>

        {/* Title overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-electricCyan tracking-widest uppercase">
            Artifact Analyzer
          </h1>
          <p className="text-xs md:text-sm text-electricCyan/70 tracking-wider mt-2">
            3D Visualization // Phase 7
          </p>
        </div>

        {/* Progress bar */}
        {scanState === "scanning" && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-80 pointer-events-none">
            <ScanProgressBar progress={scanProgress} />
          </div>
        )}

        {/* Bottom UI - hide when result is visible */}
        <AnimatePresence>
          {!showResults && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
            >
              <TrapezoidButton
                variant="primary"
                disabled={scanState === "scanning"}
                onClick={handleScanClick}
              >
                {getButtonText()}
              </TrapezoidButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
