import { useCallback, useRef, useEffect } from "react";
import { useNavigationStore } from "@/store/navigationStore";
import { ORBIT_CONFIG } from "@/lib/navigation";

/**
 * Gesture state tracking
 */
interface GestureState {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

/**
 * useOrbitGestures hook
 *
 * Handles mouse wheel, drag, and touch gestures for rotating the orbit navigation.
 */
export function useOrbitGestures() {
  const { rotateBy, setDragging, setRotating, snapToNearest, currentAngle } = useNavigationStore();

  const gestureState = useRef<GestureState>({
    startX: 0,
    currentX: 0,
    isDragging: false,
  });

  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle wheel/scroll events
   */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      // Calculate rotation based on scroll direction
      const delta = e.deltaY * ORBIT_CONFIG.rotationSensitivity;

      // Rotate the navigation
      rotateBy(delta);

      // Set rotating state
      setRotating(true);

      // Clear existing timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      // Set timeout to snap to nearest node after scrolling stops
      wheelTimeoutRef.current = setTimeout(() => {
        snapToNearest();
      }, 150);
    },
    [rotateBy, setRotating, snapToNearest]
  );

  /**
   * Handle mouse down (start drag)
   */
  const onMouseDown = useCallback((e: MouseEvent) => {
    gestureState.current = {
      startX: e.clientX,
      currentX: e.clientX,
      isDragging: true,
    };
    setDragging(true);
  }, [setDragging]);

  /**
   * Handle mouse move (during drag)
   */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!gestureState.current.isDragging) return;

      const deltaX = e.clientX - gestureState.current.startX;
      const rotation = deltaX * ORBIT_CONFIG.rotationSensitivity * -1; // Invert for natural feel

      gestureState.current.currentX = e.clientX;
      rotateBy(rotation);
      gestureState.current.startX = e.clientX; // Reset start for continuous rotation

      setRotating(true);
    },
    [rotateBy, setRotating]
  );

  /**
   * Handle mouse up (end drag)
   */
  const onMouseUp = useCallback(() => {
    if (gestureState.current.isDragging) {
      gestureState.current.isDragging = false;
      setDragging(false);
      snapToNearest();
    }
  }, [setDragging, snapToNearest]);

  /**
   * Handle touch start (start swipe)
   */
  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      gestureState.current = {
        startX: e.touches[0].clientX,
        currentX: e.touches[0].clientX,
        isDragging: true,
      };
      setDragging(true);
    }
  }, [setDragging]);

  /**
   * Handle touch move (during swipe)
   */
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!gestureState.current.isDragging || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - gestureState.current.startX;
      const rotation = deltaX * ORBIT_CONFIG.rotationSensitivity * -1; // Invert for natural feel

      gestureState.current.currentX = e.touches[0].clientX;
      rotateBy(rotation);
      gestureState.current.startX = e.touches[0].clientX; // Reset start for continuous rotation

      setRotating(true);
    },
    [rotateBy, setRotating]
  );

  /**
   * Handle touch end (end swipe)
   */
  const onTouchEnd = useCallback(() => {
    if (gestureState.current.isDragging) {
      gestureState.current.isDragging = false;
      setDragging(false);
      snapToNearest();
    }
  }, [setDragging, snapToNearest]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  return {
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
