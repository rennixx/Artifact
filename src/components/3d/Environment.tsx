"use client";

import React from "react";

/**
 * Environment - Lighting rig and scene configuration
 * Provides ambient, directional, and point lighting plus fog
 */
export const Environment = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />

      {/* Main directional light from top-right */}
      <directionalLight position={[10, 10, 5]} intensity={0.5} />

      {/* Cyan accent light from bottom-left */}
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.3}
        color="#00f3ff"
      />

      {/* Green accent light for contrast */}
      <pointLight position={[10, -5, -5]} intensity={0.2} color="#ccff00" />

      {/* Fog for depth fading */}
      <fog attach="fog" args={["#050505", 5, 15]} />
    </>
  );
};
