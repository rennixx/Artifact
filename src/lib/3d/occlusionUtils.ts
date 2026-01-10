import * as THREE from "three";
import type { Camera, Object3D, Vector3 } from "three";

/**
 * Check if a hotspot is occluded by the model
 * Uses raycasting to detect if the model blocks the view
 *
 * @param hotspotPosition - Position of the hotspot in 3D space
 * @param camera - Camera to use for raycasting
 * @param model - The model mesh to check against
 * @returns True if the hotspot is behind the model
 */
export function isHotspotOccluded(
  hotspotPosition: Vector3,
  camera: Camera,
  model: Object3D
): boolean {
  const raycaster = new THREE.Raycaster();
  const direction = new THREE.Vector3()
    .subVectors(hotspotPosition, camera.position)
    .normalize();

  raycaster.set(camera.position, direction);
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length === 0) return false;

  const distanceToHotspot = camera.position.distanceTo(hotspotPosition);
  return intersects[0].distance < distanceToHotspot * 0.95; // Small tolerance
}

/**
 * Project 3D position to 2D screen coordinates
 *
 * @param position - 3D position
 * @param camera - Camera to use for projection
 * @param renderer - Renderer (for screen size)
 * @returns Screen coordinates {x, y}
 */
export function projectToScreen(
  position: Vector3,
  camera: Camera,
  width: number,
  height: number
): { x: number; y: number } {
  const vector = position.clone();
  vector.project(camera);

  return {
    x: (vector.x * 0.5 + 0.5) * width,
    y: (-(vector.y * 0.5) + 0.5) * height,
  };
}

/**
 * Get distance from camera to hotspot
 *
 * @param position - 3D position
 * @param camera - Camera
 * @returns Distance in world units
 */
export function getDistanceToCamera(position: Vector3, camera: Camera): number {
  return camera.position.distanceTo(position);
}
