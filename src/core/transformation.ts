import {
  FREQUENCY_GRID_HZ,
  MANUAL_THRESHOLD_MAX_DB_HL,
  MANUAL_THRESHOLD_MIN_DB_HL,
  MANUAL_THRESHOLD_STEP_DB_HL,
  frequencyKey,
  type ConfirmedHearingProfile,
  type Ear,
} from "./profile";

export const TRANSFORMATION_ALGORITHM_VERSION = "auralis-peaking-attenuation-v1";
export const TRANSFORMATION_FILTER_Q = 1;
export const TRANSFORMATION_DB_PER_DB_HL = -0.24;
export const TRANSFORMATION_MIN_GAIN_DB = -24;
export const TRANSFORMATION_MAX_GAIN_DB = 0;

export type SpectralFilter = Readonly<{
  frequencyHz: number;
  q: number;
  inputThresholdDbHl: number;
  gainDb: number;
}>;

export type ComparisonMode = "reference" | "simulated";

export type ComparisonPlan = Readonly<{
  algorithmVersion: typeof TRANSFORMATION_ALGORITHM_VERSION;
  sourceIdentity: string;
  profileId: string;
  reference: Readonly<{
    mode: "reference";
    sourceIdentity: string;
    resultIdentity: string;
  }>;
  simulated: Readonly<{
    mode: "simulated";
    sourceIdentity: string;
    resultIdentity: string;
    leftFilters: readonly SpectralFilter[];
    rightFilters: readonly SpectralFilter[];
  }>;
  limitation: "illustrative-non-clinical";
}>;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function thresholdToGainDb(thresholdDbHl: number): number {
  return clamp(
    thresholdDbHl * TRANSFORMATION_DB_PER_DB_HL,
    TRANSFORMATION_MIN_GAIN_DB,
    TRANSFORMATION_MAX_GAIN_DB,
  );
}

function createEarFilters(profile: ConfirmedHearingProfile, ear: Ear): SpectralFilter[] {
  const thresholds =
    ear === "left" ? profile.leftThresholdsDbHl : profile.rightThresholdsDbHl;

  return FREQUENCY_GRID_HZ.map((frequencyHz) =>
    Object.freeze({
      frequencyHz,
      q: TRANSFORMATION_FILTER_Q,
      inputThresholdDbHl: thresholds[frequencyKey(frequencyHz)],
      gainDb: thresholdToGainDb(thresholds[frequencyKey(frequencyHz)]),
    }),
  );
}

function serializeFilters(filters: readonly SpectralFilter[]): string {
  return filters
    .map(
      ({ frequencyHz, inputThresholdDbHl, gainDb }) =>
        `${frequencyHz}:${inputThresholdDbHl}:${gainDb.toFixed(2)}`,
    )
    .join(",");
}

export function createComparisonPlan(
  profile: ConfirmedHearingProfile,
  sourceIdentity: string,
): ComparisonPlan {
  if (sourceIdentity.trim() === "") {
    throw new Error("A source identity is required.");
  }

  const leftFilters = Object.freeze(createEarFilters(profile, "left"));
  const rightFilters = Object.freeze(createEarFilters(profile, "right"));
  const referenceIdentity = `reference-v1:${sourceIdentity}`;
  const simulatedIdentity = [
    TRANSFORMATION_ALGORITHM_VERSION,
    sourceIdentity,
    profile.profileId,
    `L[${serializeFilters(leftFilters)}]`,
    `R[${serializeFilters(rightFilters)}]`,
  ].join("|");

  const plan = Object.freeze({
    algorithmVersion: TRANSFORMATION_ALGORITHM_VERSION,
    sourceIdentity,
    profileId: profile.profileId,
    reference: Object.freeze({
      mode: "reference" as const,
      sourceIdentity,
      resultIdentity: referenceIdentity,
    }),
    simulated: Object.freeze({
      mode: "simulated" as const,
      sourceIdentity,
      resultIdentity: simulatedIdentity,
      leftFilters,
      rightFilters,
    }),
    limitation: "illustrative-non-clinical" as const,
  });

  assertValidComparisonPlan(plan);
  return plan;
}

function assertValidFilters(filters: readonly SpectralFilter[]): void {
  if (filters.length !== FREQUENCY_GRID_HZ.length) {
    throw new Error("The transformation plan does not cover the approved frequency grid.");
  }

  filters.forEach((filter, index) => {
    const expectedFrequency = FREQUENCY_GRID_HZ[index];
    const expectedGain = thresholdToGainDb(filter.inputThresholdDbHl);

    if (
      filter.frequencyHz !== expectedFrequency ||
      filter.q !== TRANSFORMATION_FILTER_Q ||
      !Number.isFinite(filter.inputThresholdDbHl) ||
      filter.inputThresholdDbHl < MANUAL_THRESHOLD_MIN_DB_HL ||
      filter.inputThresholdDbHl > MANUAL_THRESHOLD_MAX_DB_HL ||
      filter.inputThresholdDbHl % MANUAL_THRESHOLD_STEP_DB_HL !== 0 ||
      !Number.isFinite(filter.gainDb) ||
      filter.gainDb < TRANSFORMATION_MIN_GAIN_DB ||
      filter.gainDb > TRANSFORMATION_MAX_GAIN_DB ||
      Math.abs(filter.gainDb - expectedGain) > Number.EPSILON
    ) {
      throw new Error("The transformation plan contains an unsafe or invalid filter.");
    }
  });
}

export function assertValidComparisonPlan(plan: ComparisonPlan): void {
  if (
    plan.algorithmVersion !== TRANSFORMATION_ALGORITHM_VERSION ||
    plan.sourceIdentity.trim() === "" ||
    plan.reference.sourceIdentity !== plan.sourceIdentity ||
    plan.simulated.sourceIdentity !== plan.sourceIdentity ||
    plan.reference.mode !== "reference" ||
    plan.simulated.mode !== "simulated" ||
    plan.reference.resultIdentity.trim() === "" ||
    plan.simulated.resultIdentity.trim() === "" ||
    plan.reference.resultIdentity === plan.simulated.resultIdentity ||
    plan.limitation !== "illustrative-non-clinical"
  ) {
    throw new Error("The comparison plan violates the same-source contract.");
  }

  assertValidFilters(plan.simulated.leftFilters);
  assertValidFilters(plan.simulated.rightFilters);
}

export function resultIdentityForMode(
  plan: ComparisonPlan,
  mode: ComparisonMode,
): string {
  return plan[mode].resultIdentity;
}
