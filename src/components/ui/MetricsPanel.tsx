"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArtifactMetrics } from "@/store/scanStore";

export interface MetricBarProps {
  label: string;
  value: number; // 0-100
  color: string;
  delay: number;
}

const MetricBar = ({ label, value, color, delay }: MetricBarProps) => {
  const getColorClass = (val: number) => {
    if (val >= 90) return "bg-electricCyan";
    if (val >= 70) return "bg-acidGreen";
    return "bg-error";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="space-y-1"
    >
      <div className="flex justify-between items-center text-xs">
        <span className="text-electricCyan/70 uppercase tracking-wider">{label}</span>
        <span className={cn("font-mono font-bold", value >= 90 ? "text-electricCyan" : value >= 70 ? "text-acidGreen" : "text-error")}>
          {Math.round(value)}%
        </span>
      </div>

      {/* Background bar */}
      <div className="h-2 bg-slateGrey/50 relative overflow-hidden">
        {/* Fill bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.1, duration: 0.4, ease: "easeOut" }}
          className={cn("h-full", getColorClass(value))}
          style={{ boxShadow: value >= 90 ? "0 0 10px rgba(0, 243, 255, 0.5)" : "none" }}
        />

        {/* Gloss effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </motion.div>
  );
};

export interface MetricsPanelProps {
  metrics: ArtifactMetrics;
  className?: string;
}

/**
 * MetricsPanel - Display artifact analysis metrics with animated progress bars
 */
export const MetricsPanel = ({ metrics, className }: MetricsPanelProps) => {
  const metricItems = [
    { label: "Authenticity", value: metrics.authenticity },
    { label: "Craftsmanship", value: metrics.craftsmanship },
    { label: "Preservation", value: metrics.preservation },
    { label: "Provenance", value: metrics.provenance },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center pb-4 border-b border-electricCyan/20"
      >
        <h3 className="text-sm font-bold text-electricCyan uppercase tracking-widest">
          Analysis Metrics
        </h3>
        <p className="text-xs text-electricCyan/50 mt-1">
          AI-powered artifact evaluation
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="space-y-4">
        {metricItems.map((metric, index) => (
          <MetricBar
            key={metric.label}
            label={metric.label}
            value={metric.value}
            color=""
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Overall score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="pt-4 border-t border-electricCyan/20 text-center"
      >
        <div className="text-xs text-electricCyan/50 uppercase tracking-wider mb-2">
          Overall Confidence
        </div>
        <div className="text-2xl font-mono font-bold text-acidGreen">
          {Math.round((metrics.authenticity + metrics.craftsmanship + metrics.preservation + metrics.provenance) / 4)}%
        </div>
      </motion.div>
    </div>
  );
};
