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
export type InterventionState = "tv-on" | "tv-off";

export type SourceContributionPlan = Readonly<{
  focusedSpeech: 1;
  overlappingSpeech: 1;
  television: 0 | 1;
  kitchenRoom: 1;
}>;

export type ReferenceResultPlan = Readonly<{
  mode: "reference";
  interventionState: InterventionState;
  sourceIdentity: string;
  resultIdentity: string;
  sourceContributions: SourceContributionPlan;
}>;

export type TransformedResultPlan = Readonly<{
  mode: "simulated";
  supportMode: SupportMode;
  interventionState: InterventionState;
  sourceIdentity: string;
  resultIdentity: string;
  sourceContributions: SourceContributionPlan;
  leftFilters: readonly SpectralFilter[];
  rightFilters: readonly SpectralFilter[];
}>;

export type ComparisonPlan = Readonly<{
  algorithmVersion: typeof TRANSFORMATION_ALGORITHM_VERSION;
  supportAlgorithmVersion: typeof SUPPORT_ALGORITHM_VERSION;
  sourceIdentity: string;
  profileId: string;
  reference: ReferenceResultPlan;
  simulated: TransformedResultPlan;
  support: Readonly<{
    "left-one-sided": TransformedResultPlan;
    bilateral: TransformedResultPlan;
  }>;
  limitation: "illustrative-non-clinical";
}>;

const TV_ON_IDENTITY_SUFFIX = "|intervention:tv-on";

const TV_ON_SOURCE_CONTRIBUTIONS: SourceContributionPlan = Object.freeze({
  focusedSpeech: 1 as const,
  overlappingSpeech: 1 as const,
  television: 1 as const,
  kitchenRoom: 1 as const,
});

const TV_OFF_SOURCE_CONTRIBUTIONS: SourceContributionPlan = Object.freeze({
  focusedSpeech: 1 as const,
  overlappingSpeech: 1 as const,
  television: 0 as const,
  kitchenRoom: 1 as const,
});

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

export function sourceContributionsForIntervention(
  interventionState: InterventionState,
): SourceContributionPlan {
  return interventionState === "tv-on"
    ? TV_ON_SOURCE_CONTRIBUTIONS
    : TV_OFF_SOURCE_CONTRIBUTIONS;
}

function identityForIntervention(
  tvOnResultIdentity: string,
  interventionState: InterventionState,
): string {
  if (!tvOnResultIdentity.endsWith(TV_ON_IDENTITY_SUFFIX)) {
    throw new Error("The transformation result identity has no canonical TV state.");
  }

  if (interventionState === "tv-on") {
    return tvOnResultIdentity;
  }

  return `${tvOnResultIdentity.slice(0, -TV_ON_IDENTITY_SUFFIX.length)}|intervention:tv-off`;
}

function transformedResultForIntervention(
  result: TransformedResultPlan,
  interventionState: InterventionState,
): TransformedResultPlan {
  if (interventionState === "tv-on") {
    return result;
  }

  return Object.freeze({
    ...result,
    interventionState,
    resultIdentity: identityForIntervention(
      result.resultIdentity,
      interventionState,
    ),
    sourceContributions:
      sourceContributionsForIntervention(interventionState),
  });
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
  const referenceIdentity = `reference-v1:${sourceIdentity}${TV_ON_IDENTITY_SUFFIX}`;
  const simulatedIdentity =
    [
      TRANSFORMATION_ALGORITHM_VERSION,
      sourceIdentity,
      profile.profileId,
      `L[${serializeFilters(leftFilters)}]`,
      `R[${serializeFilters(rightFilters)}]`,
    ].join("|") + TV_ON_IDENTITY_SUFFIX;
  const leftSupportIdentity =
    [
      SUPPORT_ALGORITHM_VERSION,
      "left-one-sided",
      sourceIdentity,
      profile.profileId,
      `L[${serializeFilters(supportedLeftFilters)}]`,
      `R[${serializeFilters(rightFilters)}]`,
    ].join("|") + TV_ON_IDENTITY_SUFFIX;
  const bilateralIdentity =
    [
      SUPPORT_ALGORITHM_VERSION,
      "bilateral",
      sourceIdentity,
      profile.profileId,
      `L[${serializeFilters(supportedLeftFilters)}]`,
      `R[${serializeFilters(supportedRightFilters)}]`,
    ].join("|") + TV_ON_IDENTITY_SUFFIX;

  const plan = Object.freeze({
    algorithmVersion: TRANSFORMATION_ALGORITHM_VERSION,
    supportAlgorithmVersion: SUPPORT_ALGORITHM_VERSION,
    sourceIdentity,
    profileId: profile.profileId,
    reference: Object.freeze({
      mode: "reference" as const,
      interventionState: "tv-on" as const,
      sourceIdentity,
      resultIdentity: referenceIdentity,
      sourceContributions: TV_ON_SOURCE_CONTRIBUTIONS,
    }),
    simulated: Object.freeze({
      mode: "simulated" as const,
      supportMode: "none" as const,
      interventionState: "tv-on" as const,
      sourceIdentity,
      resultIdentity: simulatedIdentity,
      sourceContributions: TV_ON_SOURCE_CONTRIBUTIONS,
      leftFilters,
      rightFilters,
    }),
    support: Object.freeze({
      "left-one-sided": Object.freeze({
        mode: "simulated" as const,
        supportMode: "left-one-sided" as const,
        interventionState: "tv-on" as const,
        sourceIdentity,
        resultIdentity: leftSupportIdentity,
        sourceContributions: TV_ON_SOURCE_CONTRIBUTIONS,
        leftFilters: supportedLeftFilters,
        rightFilters,
      }),
      bilateral: Object.freeze({
        mode: "simulated" as const,
        supportMode: "bilateral" as const,
        interventionState: "tv-on" as const,
        sourceIdentity,
        resultIdentity: bilateralIdentity,
        sourceContributions: TV_ON_SOURCE_CONTRIBUTIONS,
        leftFilters: supportedLeftFilters,
        rightFilters: supportedRightFilters,
      }),
    }),
    limitation: "illustrative-non-clinical" as const,
  });

  assertValidComparisonPlan(plan);
  return plan;
}

function assertValidSourceContributions(
  contributions: SourceContributionPlan,
  interventionState: InterventionState,
): void {
  const expected = sourceContributionsForIntervention(interventionState);

  if (
    contributions.focusedSpeech !== expected.focusedSpeech ||
    contributions.overlappingSpeech !== expected.overlappingSpeech ||
    contributions.television !== expected.television ||
    contributions.kitchenRoom !== expected.kitchenRoom
  ) {
    throw new Error("The source contribution plan violates the TV intervention.");
  }
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
  const tvOffIdentities = [
    referenceResultForIntervention(plan, "tv-off").resultIdentity,
    ...(["none", "left-one-sided", "bilateral"] as const).map(
      (supportMode) =>
        resultForSupportMode(plan, supportMode, "tv-off").resultIdentity,
    ),
  ];

  if (
    plan.algorithmVersion !== TRANSFORMATION_ALGORITHM_VERSION ||
    plan.supportAlgorithmVersion !== SUPPORT_ALGORITHM_VERSION ||
    plan.sourceIdentity.trim() === "" ||
    plan.reference.sourceIdentity !== plan.sourceIdentity ||
    plan.reference.mode !== "reference" ||
    plan.reference.interventionState !== "tv-on" ||
    plan.reference.resultIdentity.trim() === "" ||
    transformedResults.some(
      (result) =>
        result.mode !== "simulated" ||
        result.interventionState !== "tv-on" ||
        result.sourceIdentity !== plan.sourceIdentity ||
        result.resultIdentity.trim() === "",
    ) ||
    plan.simulated.supportMode !== "none" ||
    plan.support["left-one-sided"].supportMode !== "left-one-sided" ||
    plan.support.bilateral.supportMode !== "bilateral" ||
    new Set([...identities, ...tvOffIdentities]).size !==
      identities.length + tvOffIdentities.length ||
    plan.limitation !== "illustrative-non-clinical"
  ) {
    throw new Error("The comparison plan violates the same-source contract.");
  }

  assertValidSourceContributions(
    plan.reference.sourceContributions,
    plan.reference.interventionState,
  );
  transformedResults.forEach((result) =>
    assertValidSourceContributions(
      result.sourceContributions,
      result.interventionState,
    ),
  );
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
  interventionState: InterventionState = "tv-on",
): TransformedResultPlan {
  let result: TransformedResultPlan;

  switch (supportMode) {
    case "none":
      result = plan.simulated;
      break;
    case "left-one-sided":
      result = plan.support["left-one-sided"];
      break;
    case "bilateral":
      result = plan.support.bilateral;
      break;
  }

  return transformedResultForIntervention(result, interventionState);
}

export function referenceResultForIntervention(
  plan: ComparisonPlan,
  interventionState: InterventionState,
): ReferenceResultPlan {
  if (interventionState === "tv-on") {
    return plan.reference;
  }

  return Object.freeze({
    ...plan.reference,
    interventionState,
    resultIdentity: identityForIntervention(
      plan.reference.resultIdentity,
      interventionState,
    ),
    sourceContributions:
      sourceContributionsForIntervention(interventionState),
  });
}

export function resultIdentityForMode(
  plan: ComparisonPlan,
  mode: ComparisonMode,
  supportMode: SupportMode = "none",
  interventionState: InterventionState = "tv-on",
): string {
  return mode === "reference"
    ? referenceResultForIntervention(plan, interventionState).resultIdentity
    : resultForSupportMode(
        plan,
        supportMode,
        interventionState,
      ).resultIdentity;
}
