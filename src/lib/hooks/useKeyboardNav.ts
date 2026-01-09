import { useEffect } from "react";
import { useNavigationStore } from "@/store/navigationStore";
import { NAV_NODES } from "@/lib/navigation";

/**
 * useKeyboardNav hook
 *
 * Handles keyboard navigation for the orbit system.
 * - Arrow Left: Rotate counter-clockwise (90°)
 * - Arrow Right: Rotate clockwise (90°)
 * - Tab: Focus next nav node
 * - Enter/Space: Activate focused node
 */
export function useKeyboardNav() {
  const { rotateBy, setActiveNode, activeNodeId } = useNavigationStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          // Rotate counter-clockwise (90°)
          rotateBy(-90);
          break;

        case "ArrowRight":
          e.preventDefault();
          // Rotate clockwise (90°)
          rotateBy(90);
          break;

        case "ArrowUp":
          e.preventDefault();
          // Also rotate counter-clockwise
          rotateBy(-90);
          break;

        case "ArrowDown":
          e.preventDefault();
          // Also rotate clockwise
          rotateBy(90);
          break;

        case "Tab":
          e.preventDefault();
          // Cycle to next node
          const currentIndex = NAV_NODES.findIndex((n) => n.id === activeNodeId);
          const nextIndex = (currentIndex + 1) % NAV_NODES.length;
          setActiveNode(NAV_NODES[nextIndex].id);
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          // Activate current node (could trigger navigation)
          const activeNode = NAV_NODES.find((n) => n.id === activeNodeId);
          if (activeNode) {
            // Navigate to the route
            window.location.href = activeNode.route;
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rotateBy, setActiveNode, activeNodeId]);
}
