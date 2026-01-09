"use client";

import React, { useEffect, useState } from "react";
import { ChamferedContainer } from "@/components/ui";

/**
 * WebGLError - WebGL support detector
 * Displays error message if WebGL is not available
 */
export const WebGLError = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (gl) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  if (isSupported === null) {
    return null;
  }

  if (isSupported) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-voidBlack z-50">
      <ChamferedContainer className="max-w-lg">
        <div className="text-center space-y-6">
          {/* Error icon */}
          <div className="text-6xl text-error">⚠</div>

          {/* Error title */}
          <h2 className="text-2xl font-bold text-error uppercase tracking-widest">
            System Error
          </h2>

          {/* Error message */}
          <div className="space-y-2">
            <p className="text-electricCyan/80 font-mono text-sm">
              WebGL 2.0 Required
            </p>
            <p className="text-electricCyan/60 text-xs">
              Your browser does not support WebGL 2.0, which is required for
              the 3D artifact visualization system.
            </p>
          </div>

          {/* Browser compatibility info */}
          <div className="text-left space-y-2 pt-4 border-t border-electricCyan/20">
            <p className="text-electricCyan/70 text-xs uppercase tracking-wider">
              Compatible Browsers:
            </p>
            <ul className="text-electricCyan/50 text-xs space-y-1 font-mono">
              <li>▸ Chrome 56+ (Desktop & Mobile)</li>
              <li>▸ Firefox 51+ (Desktop & Mobile)</li>
              <li>▸ Safari 11+ (Desktop & Mobile)</li>
              <li>▸ Edge 79+ (Desktop)</li>
            </ul>
          </div>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 border border-electricCyan text-electricCyan hover:bg-electricCyan/10 transition-colors font-mono text-sm uppercase tracking-wider"
          >
            [ Retry ]
          </button>
        </div>
      </ChamferedContainer>
    </div>
  );
};
