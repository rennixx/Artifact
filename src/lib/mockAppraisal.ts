import { AppraisalData, ArtifactGrade } from "@/store/scanStore";

/**
 * Generate a weighted random grade
 * Higher grades are rarer
 */
function generateRandomGrade(): ArtifactGrade {
  const random = Math.random() * 100;

  if (random < 5) return "S";      // 5% chance
  if (random < 30) return "A";     // 25% chance
  if (random < 70) return "B";     // 40% chance
  if (random < 95) return "C";     // 25% chance
  if (random < 98) return "D";     // 3% chance
  return "F";                      // 2% chance
}

/**
 * Calculate value range based on grade
 */
function getValueForGrade(grade: ArtifactGrade): number {
  const ranges = {
    S: { min: 800, max: 1500 },
    A: { min: 400, max: 800 },
    B: { min: 200, max: 400 },
    C: { min: 100, max: 200 },
    D: { min: 50, max: 100 },
    F: { min: 10, max: 50 },
  };

  const range = ranges[grade];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Generate random metrics based on grade tier
 * Higher grades have better metrics
 */
function generateMetricsForGrade(grade: ArtifactGrade) {
  const gradeMultiplier = {
    S: 1.0,
    A: 0.9,
    B: 0.75,
    C: 0.6,
    D: 0.45,
    F: 0.3,
  };

  const mult = gradeMultiplier[grade];
  const baseVariance = () => (Math.random() - 0.5) * 20;

  return {
    authenticity: Math.min(100, Math.max(0, 85 * mult + baseVariance())),
    craftsmanship: Math.min(100, Math.max(0, 80 * mult + baseVariance())),
    preservation: Math.min(100, Math.max(0, 90 * mult + baseVariance())),
    provenance: Math.min(100, Math.max(0, 70 * mult + baseVariance())),
  };
}

/**
 * Generate mock appraisal data for an artifact
 * Simulates AI analysis with realistic randomization
 */
export async function generateMockAppraisal(itemId?: string): Promise<AppraisalData> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const grade = generateRandomGrade();
  const value = getValueForGrade(grade);
  const metrics = generateMetricsForGrade(grade);

  // Calculate overall confidence based on metrics
  const avgMetric = Object.values(metrics).reduce((a, b) => a + b, 0) / 4;
  const confidence = Math.min(99, Math.max(85, avgMetric + Math.random() * 10));

  // Artifact type and name generation
  const artifactTypes = [
    "Ancient Relic",
    "Cybernetic Implant",
    "Pre-War Tech",
    "Alien Artifact",
    "Quantum Device",
    "Neural Interface",
    "Power Core",
    "Data Storage",
  ];

  const artifactAdjectives = [
    "Mysterious",
    "Enigmatic",
    "Ancient",
    "Advanced",
    "Experimental",
    "Prototype",
    "Military",
    "Civilian",
  ];

  const type = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
  const adjective = artifactAdjectives[Math.floor(Math.random() * artifactAdjectives.length)];
  const artifactName = `${adjective} ${type}`;

  return {
    id: itemId || `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    grade,
    value,
    confidence: Math.round(confidence),
    metrics,
    timestamp: Date.now(),
    artifactName,
    artifactType: type,
  };
}

/**
 * Quick mock appraisal without delay (for instant results in development)
 */
export function generateMockAppraisalSync(itemId?: string): AppraisalData {
  const grade = generateRandomGrade();
  const value = getValueForGrade(grade);
  const metrics = generateMetricsForGrade(grade);
  const avgMetric = Object.values(metrics).reduce((a, b) => a + b, 0) / 4;
  const confidence = Math.min(99, Math.max(85, avgMetric + Math.random() * 10));

  const artifactTypes = [
    "Ancient Relic",
    "Cybernetic Implant",
    "Pre-War Tech",
    "Alien Artifact",
    "Quantum Device",
  ];

  const artifactAdjectives = [
    "Mysterious",
    "Enigmatic",
    "Ancient",
    "Advanced",
    "Experimental",
  ];

  const type = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
  const adjective = artifactAdjectives[Math.floor(Math.random() * artifactAdjectives.length)];

  return {
    id: itemId || `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    grade,
    value,
    confidence: Math.round(confidence),
    metrics,
    timestamp: Date.now(),
    artifactName: `${adjective} ${type}`,
    artifactType: type,
  };
}
