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
export const SUPPORT_ALGORITHM_VERSION = "auralis-partial-support-v1";
export const SUPPORT_COMPENSATION_FRACTION = 0.5;
export const SUPPORT_MAX_COMPENSATION_DB = 9;

export type SpectralFilter = Readonly<{
  frequencyHz: number;
  q: number;
  inputThresholdDbHl: number;
  gainDb: number;
}>;

export type ComparisonMode = "reference" | "simulated";
export type SupportMode = "none" | "left-one-sided" | "bilateral";

export type TransformedResultPlan = Readonly<{
  mode: "simulated";
  supportMode: SupportMode;
  sourceIdentity: string;
  resultIdentity: string;
  leftFilters: readonly SpectralFilter[];
  rightFilters: readonly SpectralFilter[];
}>;

export type ComparisonPlan = Readonly<{
  algorithmVersion: typeof TRANSFORMATION_ALGORITHM_VERSION;
  supportAlgorithmVersion: typeof SUPPORT_ALGORITHM_VERSION;
  sourceIdentity: string;
  profileId: string;
  reference: Readonly<{
    mode: "reference";
    sourceIdentity: string;
    resultIdentity: string;
  }>;
  simulated: TransformedResultPlan;
  support: Readonly<{
    "left-one-sided": TransformedResultPlan;
    bilateral: TransformedResultPlan;
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

export function supportCompensationDb(thresholdDbHl: number): number {
  return Math.min(
    SUPPORT_MAX_COMPENSATION_DB,
    Math.abs(thresholdToGainDb(thresholdDbHl)) * SUPPORT_COMPENSATION_FRACTION,
  );
}

export function supportedThresholdToGainDb(thresholdDbHl: number): number {
  return thresholdToGainDb(thresholdDbHl) + supportCompensationDb(thresholdDbHl);
}

function createEarFilters(
  profile: ConfirmedHearingProfile,
  ear: Ear,
  supported: boolean,
): SpectralFilter[] {
  const thresholds =
    ear === "left" ? profile.leftThresholdsDbHl : profile.rightThresholdsDbHl;

  return FREQUENCY_GRID_HZ.map((frequencyHz) => {
    const inputThresholdDbHl = thresholds[frequencyKey(frequencyHz)];

    return Object.freeze({
      frequencyHz,
      q: TRANSFORMATION_FILTER_Q,
      inputThresholdDbHl,
      gainDb: supported
        ? supportedThresholdToGainDb(inputThresholdDbHl)
        : thresholdToGainDb(inputThresholdDbHl),
    });
  });
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

  const leftFilters = Object.freeze(createEarFilters(profile, "left", false));
  const rightFilters = Object.freeze(createEarFilters(profile, "right", false));
  const supportedLeftFilters = Object.freeze(
    createEarFilters(profile, "left", true),
  );
  const supportedRightFilters = Object.freeze(
    createEarFilters(profile, "right", true),
  );
  const referenceIdentity = `reference-v1:${sourceIdentity}`;
  const simulatedIdentity = [
    TRANSFORMATION_ALGORITHM_VERSION,
    sourceIdentity,
    profile.profileId,
    `L[${serializeFilters(leftFilters)}]`,
    `R[${serializeFilters(rightFilters)}]`,
  ].join("|");
  const leftSupportIdentity = [
    SUPPORT_ALGORITHM_VERSION,
    "left-one-sided",
    sourceIdentity,
    profile.profileId,
    `L[${serializeFilters(supportedLeftFilters)}]`,
    `R[${serializeFilters(rightFilters)}]`,
  ].join("|");
  const bilateralIdentity = [
    SUPPORT_ALGORITHM_VERSION,
    "bilateral",
    sourceIdentity,
    profile.profileId,
    `L[${serializeFilters(supportedLeftFilters)}]`,
    `R[${serializeFilters(supportedRightFilters)}]`,
  ].join("|");

  const plan = Object.freeze({
    algorithmVersion: TRANSFORMATION_ALGORITHM_VERSION,
    supportAlgorithmVersion: SUPPORT_ALGORITHM_VERSION,
    sourceIdentity,
    profileId: profile.profileId,
    reference: Object.freeze({
      mode: "reference" as const,
      sourceIdentity,
      resultIdentity: referenceIdentity,
    }),
    simulated: Object.freeze({
      mode: "simulated" as const,
      supportMode: "none" as const,
      sourceIdentity,
      resultIdentity: simulatedIdentity,
      leftFilters,
      rightFilters,
    }),
    support: Object.freeze({
      "left-one-sided": Object.freeze({
        mode: "simulated" as const,
        supportMode: "left-one-sided" as const,
        sourceIdentity,
        resultIdentity: leftSupportIdentity,
        leftFilters: supportedLeftFilters,
        rightFilters,
      }),
      bilateral: Object.freeze({
        mode: "simulated" as const,
        supportMode: "bilateral" as const,
        sourceIdentity,
        resultIdentity: bilateralIdentity,
        leftFilters: supportedLeftFilters,
        rightFilters: supportedRightFilters,
      }),
    }),
    limitation: "illustrative-non-clinical" as const,
  });

  assertValidComparisonPlan(plan);
  return plan;
}

function assertValidFilters(
  filters: readonly SpectralFilter[],
  supported: boolean,
): void {
  if (filters.length !== FREQUENCY_GRID_HZ.length) {
    throw new Error("The transformation plan does not cover the approved frequency grid.");
  }

  filters.forEach((filter, index) => {
    const expectedFrequency = FREQUENCY_GRID_HZ[index];
    const expectedGain = supported
      ? supportedThresholdToGainDb(filter.inputThresholdDbHl)
      : thresholdToGainDb(filter.inputThresholdDbHl);

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
      Math.abs(filter.gainDb - expectedGain) > 1e-9
    ) {
      throw new Error("The transformation plan contains an unsafe or invalid filter.");
    }
  });
}

export function assertValidComparisonPlan(plan: ComparisonPlan): void {
  const transformedResults = [
    plan.simulated,
    plan.support["left-one-sided"],
    plan.support.bilateral,
  ];
  const identities = [
    plan.reference.resultIdentity,
    ...transformedResults.map((result) => result.resultIdentity),
  ];

  if (
    plan.algorithmVersion !== TRANSFORMATION_ALGORITHM_VERSION ||
    plan.supportAlgorithmVersion !== SUPPORT_ALGORITHM_VERSION ||
    plan.sourceIdentity.trim() === "" ||
    plan.reference.sourceIdentity !== plan.sourceIdentity ||
    plan.reference.mode !== "reference" ||
    plan.reference.resultIdentity.trim() === "" ||
    transformedResults.some(
      (result) =>
        result.mode !== "simulated" ||
        result.sourceIdentity !== plan.sourceIdentity ||
        result.resultIdentity.trim() === "",
    ) ||
    plan.simulated.supportMode !== "none" ||
    plan.support["left-one-sided"].supportMode !== "left-one-sided" ||
    plan.support.bilateral.supportMode !== "bilateral" ||
    new Set(identities).size !== identities.length ||
    plan.limitation !== "illustrative-non-clinical"
  ) {
    throw new Error("The comparison plan violates the same-source contract.");
  }

  assertValidFilters(plan.simulated.leftFilters, false);
  assertValidFilters(plan.simulated.rightFilters, false);
  assertValidFilters(plan.support["left-one-sided"].leftFilters, true);
  assertValidFilters(plan.support["left-one-sided"].rightFilters, false);
  assertValidFilters(plan.support.bilateral.leftFilters, true);
  assertValidFilters(plan.support.bilateral.rightFilters, true);
}

export function resultForSupportMode(
  plan: ComparisonPlan,
  supportMode: SupportMode,
): TransformedResultPlan {
  switch (supportMode) {
    case "none":
      return plan.simulated;
    case "left-one-sided":
      return plan.support["left-one-sided"];
    case "bilateral":
      return plan.support.bilateral;
  }
}

export function resultIdentityForMode(
  plan: ComparisonPlan,
  mode: ComparisonMode,
  supportMode: SupportMode = "none",
): string {
  return mode === "reference"
    ? plan.reference.resultIdentity
    : resultForSupportMode(plan, supportMode).resultIdentity;
}
