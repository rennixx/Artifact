"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChamferedContainer } from "./ChamferedContainer";
import { GradeStamp } from "./GradeStamp";
import { PriceCounter } from "./PriceCounter";
import { MetricsPanel } from "./MetricsPanel";
import { TrapezoidButton } from "./TrapezoidButton";
import { GlitchText } from "./GlitchText";
import { AppraisalData } from "@/store/scanStore";
import { cn } from "@/lib/utils";

export interface ResultCardProps {
  appraisalData: AppraisalData | null;
  visible: boolean;
  onScanAgain?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

/**
 * ResultCard - Comprehensive appraisal result display
 * Shows grade, value, metrics, and action buttons with entrance animation
 */
export const ResultCard = ({
  appraisalData,
  visible,
  onScanAgain,
  onViewDetails,
  className,
}: ResultCardProps) => {
  if (!visible || !appraisalData) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className={cn(
            "absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-30",
            className
          )}
        >
          <ChamferedContainer className="bg-voidBlack/95 backdrop-blur-xl border-electricCyan/50">
            <div className="space-y-6 p-6">
              {/* Top section: Grade and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Grade Stamp */}
                <div className="flex justify-center">
                  <GradeStamp grade={appraisalData.grade} visible={visible} />
                </div>

                {/* Price Counter */}
                <div className="flex justify-center">
                  <PriceCounter
                    targetValue={appraisalData.value}
                    duration={800}
                    visible={visible}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-electricCyan/20" />

              {/* Middle section: Item info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-center space-y-2"
              >
                <h2 className="text-2xl font-bold text-electricCyan">
                  <GlitchText trigger="once">{appraisalData.artifactName}</GlitchText>
                </h2>
                <p className="text-sm text-electricCyan/60">
                  {appraisalData.artifactType} • Confidence: {appraisalData.confidence}%
                </p>
                <p className="text-xs text-electricCyan/40 font-mono">
                  ID: {appraisalData.id}
                </p>
              </motion.div>

              {/* Divider */}
              <div className="border-t border-electricCyan/20" />

              {/* Metrics Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <MetricsPanel metrics={appraisalData.metrics} />
              </motion.div>

              {/* Footer: Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              >
                <TrapezoidButton variant="secondary" onClick={onViewDetails}>
                  View Details
                </TrapezoidButton>
                <TrapezoidButton variant="primary" onClick={onScanAgain}>
                  Scan Another
                </TrapezoidButton>
              </motion.div>

              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-px bg-electricCyan/30" />
                <div className="absolute top-0 left-0 w-px h-full bg-electricCyan/30" />
              </div>
              <div className="absolute top-2 right-2 w-8 h-8">
                <div className="absolute top-0 right-0 w-full h-px bg-electricCyan/30" />
                <div className="absolute top-0 right-0 w-px h-full bg-electricCyan/30" />
              </div>
              <div className="absolute bottom-2 left-2 w-8 h-8">
                <div className="absolute bottom-0 left-0 w-full h-px bg-electricCyan/30" />
                <div className="absolute bottom-0 left-0 w-px h-full bg-electricCyan/30" />
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-full h-px bg-electricCyan/30" />
                <div className="absolute bottom-0 right-0 w-px h-full bg-electricCyan/30" />
              </div>
            </div>
          </ChamferedContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
