"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "react-error-boundary";

export interface SceneProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scene - Canvas wrapper component for React Three Fiber
 * Configures camera, renderer settings, and provides error boundary
 */
export const Scene = ({ children, className }: SceneProps) => {
  const ErrorFallback = ({
    error,
    resetErrorBoundary,
  }: {
    error: Error;
    resetErrorBoundary: () => void;
  }) => (
    <div className="w-full h-screen flex items-center justify-center bg-voidBlack">
      <div className="text-center space-y-4 p-8">
        <div className="text-error text-xl font-mono">
          ⚠ SYSTEM ERROR // 3D RENDER FAILURE
        </div>
        <div className="text-electricCyan/70 text-sm font-mono max-w-md">
          {error.message}
        </div>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-6 py-2 border border-electricCyan text-electricCyan hover:bg-electricCyan/10 transition-colors font-mono text-sm uppercase tracking-wider"
        >
          [RETRY]
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows={false}
        style={{ height: "100vh", width: "100vw" }}
        className={className}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};
