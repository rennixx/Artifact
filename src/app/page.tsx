"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { TrapezoidButton, DecorativeText, ScanProgressBar } from "@/components/ui";
import { LoadingPlaceholder } from "@/components/3d";
import { useScanStore } from "@/store/scanStore";
import { useScanner } from "@/lib/hooks/useScanner";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

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

const Model = dynamic(() => import("@/components/3d/Model").then((mod) => mod.Model), {
  ssr: false,
});

const Controls = dynamic(() => import("@/components/3d/Controls").then((mod) => mod.Controls), {
  ssr: false,
});

const WebGLError = dynamic(() => import("@/components/3d/WebGLError").then((mod) => mod.WebGLError), {
  ssr: false,
});

export default function Home() {
  const [showFlash, setShowFlash] = useState(false);

  const { scanState, scanProgress } = useScanStore();
  const { startScan, resetScan } = useScanner({
    scanDuration: 2.5,
    onComplete: () => {
      // Trigger flash effect on completion
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 100);
    },
  });

  const handleScanClick = () => {
    if (scanState === "idle" || scanState === "complete") {
      resetScan();
      setTimeout(() => startScan(), 50);
    }
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
            />
          </Suspense>
          <Controls />
        </Scene>

        {/* Scan completion flash effect */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-white pointer-events-none z-20"
            />
          )}
        </AnimatePresence>

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <DecorativeText text="V.0.0.1" position="top-left" />
          <DecorativeText text="SYS_READY" position="top-right" />
          <DecorativeText text={scanState === "scanning" ? "[SCANNING...]" : "[READY]"} position="bottom-left" />
          <DecorativeText text="● LIVE" position="bottom-right" />
        </div>

        {/* Title overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-electricCyan tracking-widest uppercase">
            Artifact Analyzer
          </h1>
          <p className="text-xs md:text-sm text-electricCyan/70 tracking-wider mt-2">
            3D Visualization // Phase 4
          </p>
        </div>

        {/* Progress bar */}
        {scanState === "scanning" && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-80 pointer-events-none">
            <ScanProgressBar progress={scanProgress} />
          </div>
        )}

        {/* Bottom UI */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <TrapezoidButton
            variant="primary"
            disabled={scanState === "scanning"}
            onClick={handleScanClick}
          >
            {getButtonText()}
          </TrapezoidButton>
        </div>
      </div>
    </>
  );
}
