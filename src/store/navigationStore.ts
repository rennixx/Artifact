import { create } from "zustand";
import { NAV_NODES, findClosestNode, normalizeAngle } from "@/lib/navigation";
import type { NavNode } from "@/types/navigation";

/**
 * Navigation store interface
 */
interface NavigationStore {
  // State
  currentAngle: number;
  activeNodeId: string | null;
  isRotating: boolean;
  isDragging: boolean;

  // Actions
  rotateBy: (degrees: number) => void;
  rotateTo: (angle: number) => void;
  setActiveNode: (id: string) => void;
  setRotating: (isRotating: boolean) => void;
  setDragging: (isDragging: boolean) => void;
  snapToNearest: () => void;
  reset: () => void;

  // Computed helpers
  getActiveNode: () => NavNode | null;
}

/**
 * Create the navigation store
 */
export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial state
  currentAngle: 0,
  activeNodeId: "home",
  isRotating: false,
  isDragging: false,

  // Actions
  rotateBy: (degrees) =>
    set((state) => {
      const newAngle = normalizeAngle(state.currentAngle + degrees);
      const closestNode = findClosestNode(newAngle, NAV_NODES);
      return {
        currentAngle: newAngle,
        activeNodeId: closestNode?.id || null,
      };
    }),

  rotateTo: (angle) =>
    set((state) => {
      const normalizedAngle = normalizeAngle(angle);
      const closestNode = findClosestNode(normalizedAngle, NAV_NODES);
      return {
        currentAngle: normalizedAngle,
        activeNodeId: closestNode?.id || null,
      };
    }),

  setActiveNode: (id) =>
    set((state) => {
      const node = NAV_NODES.find((n) => n.id === id);
      if (node) {
        return {
          activeNodeId: id,
          currentAngle: node.angle,
        };
      }
      return state;
    }),

  setRotating: (isRotating) => set({ isRotating }),

  setDragging: (isDragging) => set({ isDragging }),

  snapToNearest: () =>
    set((state) => {
      const snappedAngle = Math.round(state.currentAngle / 90) * 90;
      const normalizedAngle = normalizeAngle(snappedAngle);
      const closestNode = findClosestNode(normalizedAngle, NAV_NODES);
      return {
        currentAngle: normalizedAngle,
        activeNodeId: closestNode?.id || null,
        isRotating: false,
      };
    }),

  reset: () =>
    set({
      currentAngle: 0,
      activeNodeId: "home",
      isRotating: false,
      isDragging: false,
    }),

  // Computed helpers
  getActiveNode: () => {
    const { activeNodeId } = get();
    return NAV_NODES.find((n) => n.id === activeNodeId) || null;
  },
}));
