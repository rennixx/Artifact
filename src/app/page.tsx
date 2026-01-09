"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { TrapezoidButton, DecorativeText } from "@/components/ui";
import { LoadingPlaceholder } from "@/components/3d";

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
  return (
    <>
      <WebGLError />

      <div className="relative w-full h-screen">
        <Scene>
          <Environment />
          <ParticleField count={500} color="#ffffff" size={0.05} />
          <Suspense fallback={<LoadingPlaceholder size={[1.5, 1.5, 1.5]} color="#00f3ff" />}>
            {/* Using LoadingPlaceholder directly since we don't have a .glb file yet */}
            <LoadingPlaceholder size={[1.5, 1.5, 1.5]} color="#00f3ff" wireframe={true} />
          </Suspense>
          <Controls />
        </Scene>

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <DecorativeText text="V.0.0.1" position="top-left" />
          <DecorativeText text="SYS_READY" position="top-right" />
          <DecorativeText text="[SCANNING]" position="bottom-left" />
          <DecorativeText text="● LIVE" position="bottom-right" />
        </div>

        {/* Title overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-electricCyan tracking-widest uppercase">
            Artifact Analyzer
          </h1>
          <p className="text-xs md:text-sm text-electricCyan/70 tracking-wider mt-2">
            3D Visualization // Phase 3
          </p>
        </div>

        {/* Bottom UI */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <TrapezoidButton variant="primary">
            INITIATE SCAN
          </TrapezoidButton>
        </div>
      </div>
    </>
  );
}
