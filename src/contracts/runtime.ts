import { z } from "zod";

export const MODEL_OPERATION = "explain-current-experience" as const;
export const MODEL_ID = "gpt-5.6-terra" as const;
export const MAX_MODEL_REQUEST_BYTES = 8_192;
export const MAX_MODEL_ATTEMPTS_PER_SESSION = 3;

const boundedIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(96)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/);

const identitySchema = z.string().trim().min(1).max(2_048);

export const supportModeSchema = z.enum([
  "none",
  "left-one-sided",
  "bilateral",
]);

export const interventionStateSchema = z.enum(["tv-on", "tv-off"]);
export const speakerPositionStateSchema = z.enum([
  "original-position",
  "closer-in-front",
]);

export const profileSummarySchema = z
  .object({
    origin: z.enum(["manual", "predefined"]),
    predefinedProfileId: z.string().trim().min(1).max(64).nullable(),
    pattern: z.enum([
      "broad-frequency",
      "higher-frequency-emphasis",
      "mixed-frequency",
    ]),
    earBalance: z.enum([
      "similar",
      "left-more-attenuated",
      "right-more-attenuated",
    ]),
  })
  .strict()
  .superRefine((summary, context) => {
    if (
      (summary.origin === "manual" && summary.predefinedProfileId !== null) ||
      (summary.origin === "predefined" && summary.predefinedProfileId === null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Profile origin and predefined profile identity do not match.",
      });
    }
  });

export const verifiedTransformationSummarySchema = z
  .object({
    support: z.enum([
      "unsupported",
      "left-ear-partial-compensation",
      "bilateral-partial-compensation",
    ]),
    television: z.enum(["included", "removed"]),
    focusedSpeechPosition: speakerPositionStateSchema,
    overlappingSpeech: z.literal("unchanged"),
    kitchenRoom: z.literal("unchanged"),
    limitation: z.literal("illustrative-non-clinical"),
  })
  .strict();

export const fixedSceneFactsSchema = z
  .object({
    sceneId: z.literal("family-dinner"),
    sourcePackage: z.literal("four-synchronized-synthetic-stems"),
    focusedSpeech: z.literal("present"),
    overlappingSpeech: z.literal("present"),
    television: z.literal("present-in-source"),
    kitchenRoom: z.literal("sparse-events"),
  })
  .strict();

export const modelExplanationRequestSchema = z
  .object({
    operation: z.literal(MODEL_OPERATION),
    runId: boundedIdSchema,
    attemptId: boundedIdSchema,
    attemptNumber: z.number().int().min(1).max(MAX_MODEL_ATTEMPTS_PER_SESSION),
    groundingRevision: z.number().int().min(0).max(1_000_000),
    sourceIdentity: identitySchema,
    resultIdentity: identitySchema,
    profile: profileSummarySchema,
    supportMode: supportModeSchema,
    interventionState: interventionStateSchema,
    speakerPositionState: speakerPositionStateSchema,
    transformation: verifiedTransformationSummarySchema,
    scene: fixedSceneFactsSchema,
  })
  .strict();

export type ModelExplanationRequest = z.infer<
  typeof modelExplanationRequestSchema
>;

const explanationTextSchema = {
  sceneFraming: z.string().trim().min(140).max(650),
  audibleChange: z.string().trim().min(260).max(950),
  unchanged: z.string().trim().min(140).max(650),
  limitation: z.literal("Individual perception can differ."),
} as const;

export const providerExplanationSchema = z
  .object({
    runId: boundedIdSchema,
    attemptId: boundedIdSchema,
    groundingRevision: z.number().int().min(0).max(1_000_000),
    sourceIdentity: identitySchema,
    resultIdentity: identitySchema,
    profileOrigin: z.enum(["manual", "predefined"]),
    profilePattern: profileSummarySchema.shape.pattern,
    supportMode: supportModeSchema,
    interventionState: interventionStateSchema,
    speakerPositionState: speakerPositionStateSchema,
    ...explanationTextSchema,
  })
  .strict();

export type ProviderExplanation = z.infer<typeof providerExplanationSchema>;

const responseGroundingSchema = {
  operation: z.literal(MODEL_OPERATION),
  runId: boundedIdSchema,
  attemptId: boundedIdSchema,
  attemptNumber: z.number().int().min(1).max(MAX_MODEL_ATTEMPTS_PER_SESSION),
  groundingRevision: z.number().int().min(0).max(1_000_000),
  sourceIdentity: identitySchema,
  resultIdentity: identitySchema,
} as const;

export const liveModelExplanationSchema = z
  .object({
    status: z.literal("live"),
    ...responseGroundingSchema,
    model: z.literal(MODEL_ID),
    responseId: boundedIdSchema,
    ...explanationTextSchema,
  })
  .strict();

export const degradedReasonSchema = z.enum([
  "configuration-unavailable",
  "timeout",
  "refused",
  "provider-failure",
  "malformed-output",
  "grounding-mismatch",
  "claim-violation",
  "client-timeout",
  "network-failure",
  "invalid-response",
]);

export const degradedModelExplanationSchema = z
  .object({
    status: z.literal("degraded"),
    ...responseGroundingSchema,
    model: z.literal(MODEL_ID),
    responseId: boundedIdSchema.nullable(),
    reason: degradedReasonSchema,
    message: z
      .literal(
        "Live GPT explanation is unavailable. The deterministic audio comparison remains available.",
      ),
  })
  .strict();

export const modelExplanationResponseSchema = z.discriminatedUnion("status", [
  liveModelExplanationSchema,
  degradedModelExplanationSchema,
]);

export type LiveModelExplanation = z.infer<
  typeof liveModelExplanationSchema
>;
export type DegradedModelExplanation = z.infer<
  typeof degradedModelExplanationSchema
>;
export type ModelExplanationResponse = z.infer<
  typeof modelExplanationResponseSchema
>;

export class ModelRequestValidationError extends Error {
  constructor() {
    super("The model request is outside the bounded transport contract.");
    this.name = "ModelRequestValidationError";
  }
}

function containsRawProfileShape(value: unknown): boolean {
  if (Array.isArray(value)) {
    return true;
  }

  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.entries(value).some(
    ([key, nested]) =>
      /(audiogram|threshold|left.?ear|right.?ear|db.?hl)/i.test(key) ||
      containsRawProfileShape(nested),
  );
}

export function parseModelExplanationRequestText(
  body: string,
): ModelExplanationRequest {
  if (
    new TextEncoder().encode(body).byteLength > MAX_MODEL_REQUEST_BYTES ||
    body.trim() === ""
  ) {
    throw new ModelRequestValidationError();
  }

  let value: unknown;

  try {
    value = JSON.parse(body);
  } catch {
    throw new ModelRequestValidationError();
  }

  if (containsRawProfileShape(value)) {
    throw new ModelRequestValidationError();
  }

  const parsed = modelExplanationRequestSchema.safeParse(value);

  if (!parsed.success) {
    throw new ModelRequestValidationError();
  }

  return parsed.data;
}
