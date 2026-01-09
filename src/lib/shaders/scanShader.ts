/**
 * GLSL Shaders for Scan Effect
 * Implements a scanning plane that transitions the model from wireframe to solid
 */

/**
 * Vertex Shader for Scan Effect
 * Passes position, normal, and UV data to fragment shader
 */
export const scanVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment Shader for Scan Effect
 * Creates scanning plane with wireframe-to-solid transition
 */
export const scanFragmentShader = `
  uniform float uScanProgress;
  uniform vec3 uAccentColor;
  uniform float uScanHeight;
  uniform float uScanThickness;
  uniform float uTime;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    // Calculate distance from scan plane
    float scanDistance = vPosition.y - uScanHeight;

    // Wireframe below scan line, solid above
    float wireframeOpacity = smoothstep(-0.2, 0.2, scanDistance);

    // Scan line glow effect
    float scanGlow = smoothstep(uScanThickness, 0.0, abs(scanDistance));

    // Create pulsing effect on scan line
    float pulse = sin(uTime * 8.0) * 0.5 + 0.5;
    scanGlow *= (0.8 + pulse * 0.4);

    // Base color interpolation
    vec3 wireframeColor = vec3(0.02, 0.95, 1.0); // Electric cyan
    vec3 solidColor = vec3(0.4, 0.45, 0.5); // Grey-blue

    // Mix colors based on scan position
    vec3 baseColor = mix(solidColor, wireframeColor, wireframeOpacity);

    // Add scan line glow
    vec3 finalColor = baseColor + uAccentColor * scanGlow * 2.0;

    // Add rim lighting effect
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float rim = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    rim = pow(rim, 3.0);
    finalColor += uAccentColor * rim * 0.3;

    // Calculate opacity
    float alpha = 1.0;

    // Make wireframe portions slightly transparent
    if (wireframeOpacity > 0.5) {
      alpha = 0.6 + wireframeOpacity * 0.4;
    }

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * Shader uniforms interface
 */
export interface ScanShaderUniforms {
  uScanProgress: number;
  uAccentColor: [number, number, number];
  uScanHeight: number;
  uScanThickness: number;
  uTime: number;
}
