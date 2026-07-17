import { z } from "zod";

export const FREQUENCY_GRID_HZ = [250, 500, 1000, 2000, 4000, 8000] as const;
export const FREQUENCY_KEYS = ["250", "500", "1000", "2000", "4000", "8000"] as const;
export const MANUAL_THRESHOLD_MIN_DB_HL = 0;
export const MANUAL_THRESHOLD_MAX_DB_HL = 100;
export const MANUAL_THRESHOLD_STEP_DB_HL = 5;

export type Ear = "left" | "right";
export type FrequencyHz = (typeof FREQUENCY_GRID_HZ)[number];
export type FrequencyKey = (typeof FREQUENCY_KEYS)[number];

export type EarThresholds = Readonly<Record<FrequencyKey, number>>;
export type EarThresholdDraft = Readonly<Record<FrequencyKey, string>>;

export type ManualAudiogramDraft = Readonly<{
  left: EarThresholdDraft;
  right: EarThresholdDraft;
}>;

export type ConfirmedHearingProfile = Readonly<{
  profileId: string;
  sourceType: "manual";
  frequencyGridHz: typeof FREQUENCY_GRID_HZ;
  leftThresholdsDbHl: EarThresholds;
  rightThresholdsDbHl: EarThresholds;
  unit: "dB HL";
  confirmationStatus: "confirmed";
  revision: number;
  disclosure: "Synthetic manual test profile";
  sessionLifetime: "browser-memory-only";
}>;

const thresholdSchema = z
  .number()
  .finite()
  .min(MANUAL_THRESHOLD_MIN_DB_HL)
  .max(MANUAL_THRESHOLD_MAX_DB_HL)
  .multipleOf(MANUAL_THRESHOLD_STEP_DB_HL);

const earThresholdsSchema = z
  .object({
    "250": thresholdSchema,
    "500": thresholdSchema,
    "1000": thresholdSchema,
    "2000": thresholdSchema,
    "4000": thresholdSchema,
    "8000": thresholdSchema,
  })
  .strict();

const manualAudiogramSchema = z
  .object({
    left: earThresholdsSchema,
    right: earThresholdsSchema,
  })
  .strict();

export class ProfileValidationError extends Error {
  readonly code = "invalid-manual-profile";

  constructor() {
    super(
      "Enter one supported finite value from 0 to 100 dB HL in 5 dB steps for every frequency and ear.",
    );
    this.name = "ProfileValidationError";
  }
}

function createEarDraft(initialValue: number): EarThresholdDraft {
  const value = String(initialValue);

  return Object.freeze({
    "250": value,
    "500": value,
    "1000": value,
    "2000": value,
    "4000": value,
    "8000": value,
  });
}

export function createManualAudiogramDraft(initialValue = 25): ManualAudiogramDraft {
  if (
    !Number.isFinite(initialValue) ||
    initialValue < MANUAL_THRESHOLD_MIN_DB_HL ||
    initialValue > MANUAL_THRESHOLD_MAX_DB_HL ||
    initialValue % MANUAL_THRESHOLD_STEP_DB_HL !== 0
  ) {
    throw new ProfileValidationError();
  }

  return Object.freeze({
    left: createEarDraft(initialValue),
    right: createEarDraft(initialValue),
  });
}

export function updateManualAudiogramDraft(
  draft: ManualAudiogramDraft,
  ear: Ear,
  frequency: FrequencyKey,
  value: string,
): ManualAudiogramDraft {
  return Object.freeze({
    ...draft,
    [ear]: Object.freeze({
      ...draft[ear],
      [frequency]: value,
    }),
  });
}

function draftValueToNumber(value: string): number {
  if (value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

function parseDraftEar(draft: EarThresholdDraft): Record<FrequencyKey, number> {
  return {
    "250": draftValueToNumber(draft["250"]),
    "500": draftValueToNumber(draft["500"]),
    "1000": draftValueToNumber(draft["1000"]),
    "2000": draftValueToNumber(draft["2000"]),
    "4000": draftValueToNumber(draft["4000"]),
    "8000": draftValueToNumber(draft["8000"]),
  };
}

function profileIdentity(left: EarThresholds, right: EarThresholds): string {
  const serialize = (ear: EarThresholds) =>
    FREQUENCY_KEYS.map((frequency) => ear[frequency]).join("-");

  return `manual-v1:L${serialize(left)}:R${serialize(right)}`;
}

export function confirmManualAudiogram(
  input: unknown,
  revision: number,
): ConfirmedHearingProfile {
  const parsed = manualAudiogramSchema.safeParse(input);

  if (!parsed.success || !Number.isSafeInteger(revision) || revision < 0) {
    throw new ProfileValidationError();
  }

  const left = Object.freeze({ ...parsed.data.left });
  const right = Object.freeze({ ...parsed.data.right });

  return Object.freeze({
    profileId: profileIdentity(left, right),
    sourceType: "manual",
    frequencyGridHz: FREQUENCY_GRID_HZ,
    leftThresholdsDbHl: left,
    rightThresholdsDbHl: right,
    unit: "dB HL",
    confirmationStatus: "confirmed",
    revision,
    disclosure: "Synthetic manual test profile",
    sessionLifetime: "browser-memory-only",
  });
}

export function confirmManualAudiogramDraft(
  draft: ManualAudiogramDraft,
  revision: number,
): ConfirmedHearingProfile {
  return confirmManualAudiogram(
    {
      left: parseDraftEar(draft.left),
      right: parseDraftEar(draft.right),
    },
    revision,
  );
}

export function frequencyKey(frequency: FrequencyHz): FrequencyKey {
  return String(frequency) as FrequencyKey;
}
