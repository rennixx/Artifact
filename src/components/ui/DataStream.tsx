"use client";

import { useEffect, useState, useRef } from "react";
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateDataFragment, generateTimestamp } from "@/lib/dataGenerator";

/**
 * DataStream component properties
 */
export interface DataStreamProps {
  /** Whether the stream is active (scanning in progress) */
  isActive: boolean;
  /** Speed of data generation (lines per second, default: 60) */
  speed?: number;
  /** Maximum number of lines to keep (default: 20) */
  maxLines?: number;
}

/**
 * DataStream Component
 *
 * Displays a scrolling stream of diagnostic data during scanning.
 * Shows hex codes, JSON fragments, and analysis messages with syntax highlighting.
 */
export function DataStream({ isActive, speed = 60, maxLines = 20 }: DataStreamProps) {
  const [lines, setLines] = useState<Array<{ id: number; text: string; timestamp: string }>>([]);
  const lineIdRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start/stop streaming based on isActive
  useEffect(() => {
    if (isActive) {
      // Add initial lines
      const initialLines = Array(5).fill(0).map(() => ({
        id: lineIdRef.current++,
        text: generateDataFragment(),
        timestamp: generateTimestamp(),
      }));
      setLines(initialLines);

      // Start streaming
      const intervalMs = 1000 / speed;
      intervalRef.current = setInterval(() => {
        const newLine = {
          id: lineIdRef.current++,
          text: generateDataFragment(),
          timestamp: generateTimestamp(),
        };

        setLines((prev) => {
          const updated = [...prev, newLine];
          // Keep only last maxLines
          if (updated.length > maxLines) {
            return updated.slice(updated.length - maxLines);
          }
          return updated;
        });
      }, intervalMs);
    } else {
      // Stop streaming and clear lines
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Optionally keep lines or clear them
      // setLines([]);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, speed, maxLines]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Syntax highlighting helper
  const highlightSyntax = (text: string): ReactElement => {
    // Highlight hex codes (0x...)
    const hexRegex = /(0x[0-9A-F]+)/gi;
    // Highlight numbers
    const numberRegex = /\b(\d+\.?\d*)\b/g;
    // Highlight JSON keys
    const jsonKeyRegex = /"([^"]+)":/g;
    // Highlight RGB values
    const rgbRegex = /RGB\[(\d+),(\d+),(\d+)\]/g;

    let parts: Array<string | ReactElement> = [text];

    // Apply highlighting (simplified for performance)
    if (hexRegex.test(text)) {
      parts = text.split(hexRegex).flatMap((part, i) =>
        hexRegex.test(part) ? <span key={i} className="text-yellow-400">{part}</span> : part
      );
    } else if (rgbRegex.test(text)) {
      return (
        <>
          {text.split(rgbRegex).flatMap((part, i) => {
            const match = part.match(/RGB\[(\d+),(\d+),(\d+)\]/);
            if (match) {
              return (
                <span key={i} className="text-green-400">
                  RGB[
                  <span className="text-red-400">{match[1]}</span>,
                  <span className="text-green-400">{match[2]}</span>,
                  <span className="text-blue-400">{match[3]}</span>]
                </span>
              );
            }
            return part;
          })}
        </>
      );
    } else if (/ERROR|FAIL|WARNING/i.test(text)) {
      return <span className="text-red-500">{text}</span>;
    } else if (/SUCCESS|COMPLETE|FOUND/i.test(text)) {
      return <span className="text-acidGreen">{text}</span>;
    } else if (/"[^"]+":\s*/.test(text)) {
      return (
        <>
          {text.split(/("([^"]+)":)/g).map((part, i) => {
            if (/^"([^"]+)":$/.test(part)) {
              return <span key={i} className="text-purple-400">{part}</span>;
            }
            return part;
          })}
        </>
      );
    }

    return <>{parts}</>;
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-screen w-[300px] bg-voidBlack/95 backdrop-blur-md border-l border-electricCyan/30 z-30"
        >
          {/* Header */}
          <div className="p-3 border-b border-electricCyan/20 bg-slateGrey/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-electricCyan rounded-full animate-pulse" />
              <span className="text-xs font-mono font-bold text-electricCyan tracking-wider">
                DATA STREAM
              </span>
            </div>
          </div>

          {/* Stream content */}
          <div
            ref={containerRef}
            className="h-[calc(100vh-48px)] overflow-y-auto p-3 font-mono text-[10px] leading-relaxed scrollbar-thin scrollbar-thumb-electricCyan/30 scrollbar-track-transparent"
          >
            {lines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-1 text-electricCyan/80 break-all"
              >
                <span className="text-electricCyan/40 mr-2">{line.timestamp}</span>
                {highlightSyntax(line.text)}
              </motion.div>
            ))}
          </div>

          {/* Scan line effect */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electricCyan to-transparent opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
