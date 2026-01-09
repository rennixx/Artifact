import { gsap } from "gsap";
import { AppraisalData } from "@/store/scanStore";

/**
 * Reveal timeline stage callbacks
 */
export interface RevealCallbacks {
  onScanComplete?: () => void;
  onGradeStamp?: () => void;
  onPriceCounter?: () => void;
  onShockwave?: () => void;
  onMetrics?: () => void;
  onButtons?: () => void;
  onComplete?: () => void;
}

/**
 * Reveal timeline configuration
 */
export interface RevealTimelineConfig {
  /** Appraisal data to display */
  data: AppraisalData;
  /** Callbacks for each stage */
  callbacks?: RevealCallbacks;
}

/**
 * GSAP Timeline for the complete reveal sequence
 *
 * Precise timing sequence:
 * T+0.0s: Scan complete, model solidifies
 * T+0.3s: Grade stamp slams in with shake
 * T+0.7s: Price counter counts up
 * T+1.5s: Shockwave distortion from center
 * T+1.8s: Metrics bars animate in staggered
 * T+2.0s: Action buttons fade in
 */
export function createRevealTimeline(config: RevealTimelineConfig): GSAPTimeline {
  const { callbacks } = config;
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      console.log("Reveal sequence complete");
      callbacks?.onComplete?.();
    },
  });

  // T+0.0s: Scan complete
  tl.add(() => {
    console.log("T+0.0s: Scan complete");
    callbacks?.onScanComplete?.();
  }, 0);

  // T+0.3s: Grade stamp appears with shake animation
  tl.add(() => {
    console.log("T+0.3s: Grade stamp");
    callbacks?.onGradeStamp?.();
  }, 0.3);

  // T+0.7s: Price counter starts counting up
  tl.add(() => {
    console.log("T+0.7s: Price counter");
    callbacks?.onPriceCounter?.();
  }, 0.7);

  // T+1.5s: Shockwave distortion effect
  tl.add(() => {
    console.log("T+1.5s: Shockwave");
    callbacks?.onShockwave?.();
  }, 1.5);

  // T+1.8s: Metrics panel staggered animation
  tl.add(() => {
    console.log("T+1.8s: Metrics");
    callbacks?.onMetrics?.();
  }, 1.8);

  // T+2.0s: Action buttons appear
  tl.add(() => {
    console.log("T+2.0s: Buttons");
    callbacks?.onButtons?.();
  }, 2.0);

  return tl;
}

/**
 * Trigger reveal animations using custom events
 * Components can listen for these events to trigger their animations
 */
export function triggerRevealEvent(stage: keyof RevealCallbacks): void {
  window.dispatchEvent(new CustomEvent(`reveal-${stage}`));
}

/**
 * Helper to set up event listeners for reveal stages
 * Returns a cleanup function to remove listeners
 */
export function setupRevealListeners(
  handlers: Partial<RevealCallbacks>
): () => void {
  const listeners: { event: string; handler: () => void }[] = [];

  Object.entries(handlers).forEach(([stage, handler]) => {
    if (handler) {
      const eventName = `reveal-${stage}` as const;
      window.addEventListener(eventName, handler);
      listeners.push({ event: eventName, handler });
    }
  });

  // Return cleanup function
  return () => {
    listeners.forEach(({ event, handler }) => {
      window.removeEventListener(event, handler);
    });
  };
}

/**
 * Stagger children animation configuration
 */
export const staggerConfig = {
  staggerChildren: 0.1,
  delayChildren: 0.2,
};

/**
 * Common animation variants for reveal components
 */
export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

/**
 * Timing constants for individual components
 */
export const TIMING = {
  shockwave: 0.4,
  gradeStamp: 0.4,
  priceCounter: 0.8,
  metricsPanel: 0.4,
  resultCard: 0.5,
} as const;

/**
 * Stage delays for the reveal sequence
 */
export const STAGE_DELAYS = {
  scanComplete: 0.0,
  gradeStamp: 0.3,
  priceCounter: 0.7,
  shockwave: 1.5,
  metrics: 1.8,
  buttons: 2.0,
} as const;
