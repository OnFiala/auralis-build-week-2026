import { z } from "zod";

export const FREQUENCY_GRID_HZ = [250, 500, 1000, 2000, 4000, 8000] as const;
export const FREQUENCY_KEYS = ["250", "500", "1000", "2000", "4000", "8000"] as const;
export const MANUAL_THRESHOLD_MIN_DB_HL = 0;
export const MANUAL_THRESHOLD_MAX_DB_HL = 100;
export const MANUAL_THRESHOLD_STEP_DB_HL = 5;
export const MANUAL_PROFILE_ENTRY_LABEL = "Enter an audiogram";
export const PREDEFINED_PROFILE_IDS = [
  "high-frequency-hearing-loss",
  "flat-hearing-loss",
  "asymmetric-hearing-loss",
] as const;

export type Ear = "left" | "right";
export type FrequencyHz = (typeof FREQUENCY_GRID_HZ)[number];
export type FrequencyKey = (typeof FREQUENCY_KEYS)[number];
export type PredefinedProfileId = (typeof PREDEFINED_PROFILE_IDS)[number];
export type ProfileEntryOption = "manual" | PredefinedProfileId;

export type EarThresholds = Readonly<Record<FrequencyKey, number>>;
export type EarThresholdDraft = Readonly<Record<FrequencyKey, string>>;

export type ManualAudiogramDraft = Readonly<{
  left: EarThresholdDraft;
  right: EarThresholdDraft;
}>;

export type PredefinedHearingProfile = Readonly<{
  id: PredefinedProfileId;
  displayName: string;
  rightThresholdsDbHl: EarThresholds;
  leftThresholdsDbHl: EarThresholds;
  classification: "synthetic-illustrative";
}>;

export type ConfirmedHearingProfile = Readonly<{
  profileId: string;
  sourceType: "manual" | "predefined";
  predefinedProfileId: PredefinedProfileId | null;
  displayName: string;
  frequencyGridHz: typeof FREQUENCY_GRID_HZ;
  leftThresholdsDbHl: EarThresholds;
  rightThresholdsDbHl: EarThresholds;
  unit: "dB HL";
  confirmationStatus: "confirmed";
  revision: number;
  disclosure:
    | "Synthetic manual test profile"
    | "Synthetic predefined illustrative profile";
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

const predefinedProfileSchema = z
  .object({
    id: z.enum(PREDEFINED_PROFILE_IDS),
    displayName: z.string().trim().min(1),
    rightThresholdsDbHl: earThresholdsSchema,
    leftThresholdsDbHl: earThresholdsSchema,
    classification: z.literal("synthetic-illustrative"),
  })
  .strict();

export class ProfileValidationError extends Error {
  readonly code = "invalid-manual-profile";

  constructor(
    message = "Enter one supported finite value from 0 to 100 dB HL in 5 dB steps for every frequency and ear.",
  ) {
    super(message);
    this.name = "ProfileValidationError";
  }
}

function definePredefinedProfile(input: unknown): PredefinedHearingProfile {
  const parsed = predefinedProfileSchema.safeParse(input);

  if (!parsed.success) {
    throw new ProfileValidationError("A predefined profile fixture is invalid.");
  }

  return Object.freeze({
    ...parsed.data,
    rightThresholdsDbHl: Object.freeze({ ...parsed.data.rightThresholdsDbHl }),
    leftThresholdsDbHl: Object.freeze({ ...parsed.data.leftThresholdsDbHl }),
  });
}

export const PREDEFINED_HEARING_PROFILES = Object.freeze([
  definePredefinedProfile({
    id: "high-frequency-hearing-loss",
    displayName: "High-frequency hearing loss",
    rightThresholdsDbHl: {
      "250": 20,
      "500": 20,
      "1000": 25,
      "2000": 35,
      "4000": 55,
      "8000": 70,
    },
    leftThresholdsDbHl: {
      "250": 20,
      "500": 20,
      "1000": 25,
      "2000": 35,
      "4000": 55,
      "8000": 70,
    },
    classification: "synthetic-illustrative",
  }),
  definePredefinedProfile({
    id: "flat-hearing-loss",
    displayName: "Flat hearing loss",
    rightThresholdsDbHl: {
      "250": 45,
      "500": 45,
      "1000": 45,
      "2000": 45,
      "4000": 45,
      "8000": 45,
    },
    leftThresholdsDbHl: {
      "250": 45,
      "500": 45,
      "1000": 45,
      "2000": 45,
      "4000": 45,
      "8000": 45,
    },
    classification: "synthetic-illustrative",
  }),
  definePredefinedProfile({
    id: "asymmetric-hearing-loss",
    displayName: "Asymmetric hearing loss",
    rightThresholdsDbHl: {
      "250": 20,
      "500": 20,
      "1000": 25,
      "2000": 30,
      "4000": 35,
      "8000": 40,
    },
    leftThresholdsDbHl: {
      "250": 45,
      "500": 50,
      "1000": 55,
      "2000": 60,
      "4000": 65,
      "8000": 70,
    },
    classification: "synthetic-illustrative",
  }),
]);

if (
  PREDEFINED_HEARING_PROFILES.length !== 3 ||
  new Set(PREDEFINED_HEARING_PROFILES.map((profile) => profile.id)).size !== 3 ||
  new Set(PREDEFINED_HEARING_PROFILES.map((profile) => profile.displayName)).size !== 3
) {
  throw new ProfileValidationError(
    "The predefined profile fixtures must contain exactly three unique IDs and names.",
  );
}

export function predefinedProfileById(
  id: PredefinedProfileId,
): PredefinedHearingProfile {
  const profile = PREDEFINED_HEARING_PROFILES.find((candidate) => candidate.id === id);

  if (!profile) {
    throw new ProfileValidationError("Choose one approved predefined profile.");
  }

  return profile;
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

function serializeThresholds(ear: EarThresholds): string {
  return FREQUENCY_KEYS.map((frequency) => ear[frequency]).join("-");
}

function profileIdentity(
  sourceType: "manual" | "predefined",
  predefinedProfileId: PredefinedProfileId | null,
  left: EarThresholds,
  right: EarThresholds,
): string {
  const origin =
    sourceType === "manual"
      ? "manual-v1"
      : `predefined-v1:${predefinedProfileId ?? "invalid"}`;

  return `${origin}:L${serializeThresholds(left)}:R${serializeThresholds(right)}`;
}

function createConfirmedProfile(
  sourceType: "manual" | "predefined",
  predefinedProfileId: PredefinedProfileId | null,
  displayName: string,
  left: EarThresholds,
  right: EarThresholds,
  revision: number,
): ConfirmedHearingProfile {
  if (!Number.isSafeInteger(revision) || revision < 0) {
    throw new ProfileValidationError();
  }

  return Object.freeze({
    profileId: profileIdentity(sourceType, predefinedProfileId, left, right),
    sourceType,
    predefinedProfileId,
    displayName,
    frequencyGridHz: FREQUENCY_GRID_HZ,
    leftThresholdsDbHl: left,
    rightThresholdsDbHl: right,
    unit: "dB HL" as const,
    confirmationStatus: "confirmed" as const,
    revision,
    disclosure:
      sourceType === "manual"
        ? ("Synthetic manual test profile" as const)
        : ("Synthetic predefined illustrative profile" as const),
    sessionLifetime: "browser-memory-only" as const,
  });
}

export function confirmManualAudiogram(
  input: unknown,
  revision: number,
): ConfirmedHearingProfile {
  const parsed = manualAudiogramSchema.safeParse(input);

  if (!parsed.success) {
    throw new ProfileValidationError();
  }

  const left = Object.freeze({ ...parsed.data.left });
  const right = Object.freeze({ ...parsed.data.right });

  return createConfirmedProfile(
    "manual",
    null,
    MANUAL_PROFILE_ENTRY_LABEL,
    left,
    right,
    revision,
  );
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

export function confirmPredefinedProfile(
  id: PredefinedProfileId,
  revision: number,
): ConfirmedHearingProfile {
  const fixture = predefinedProfileById(id);

  return createConfirmedProfile(
    "predefined",
    fixture.id,
    fixture.displayName,
    fixture.leftThresholdsDbHl,
    fixture.rightThresholdsDbHl,
    revision,
  );
}

export function frequencyKey(frequency: FrequencyHz): FrequencyKey {
  return String(frequency) as FrequencyKey;
}
