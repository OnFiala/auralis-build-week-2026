import {
  MODEL_ID,
  MODEL_OPERATION,
  modelExplanationRequestSchema,
  providerExplanationSchema,
  type DegradedModelExplanation,
  type ModelExplanationRequest,
  type ModelExplanationResponse,
  type ProviderExplanation,
} from "../contracts/runtime";

export type ExplanationProviderInput = Readonly<{
  instructions: string;
  input: string;
}>;

export type ExplanationProviderResult =
  | Readonly<{
      status: "success";
      model: string;
      responseId: string;
      output: unknown;
    }>
  | Readonly<{
      status:
        | "configuration-unavailable"
        | "timeout"
        | "refused"
        | "provider-failure"
        | "malformed-output";
      responseId: string | null;
    }>;

export type ExplanationProvider = Readonly<{
  generate(input: ExplanationProviderInput): Promise<ExplanationProviderResult>;
}>;

const DEGRADED_MESSAGE =
  "Live GPT explanation is unavailable. The deterministic audio comparison remains available." as const;

const supportPromptLabels = {
  none: "No support",
  "left-one-sided": "Left-ear support",
  bilateral: "Bilateral support",
} as const;

const interventionPromptLabels = {
  "tv-on": "TV on",
  "tv-off": "TV off",
} as const;

function degraded(
  request: ModelExplanationRequest,
  reason: DegradedModelExplanation["reason"],
  responseId: string | null = null,
): DegradedModelExplanation {
  return Object.freeze({
    status: "degraded" as const,
    operation: MODEL_OPERATION,
    runId: request.runId,
    attemptId: request.attemptId,
    attemptNumber: request.attemptNumber,
    groundingRevision: request.groundingRevision,
    sourceIdentity: request.sourceIdentity,
    resultIdentity: request.resultIdentity,
    model: MODEL_ID,
    responseId,
    reason,
    message: DEGRADED_MESSAGE,
  });
}

function providerInputFor(
  request: ModelExplanationRequest,
): ExplanationProviderInput {
  const supportLabel = supportPromptLabels[request.supportMode];
  const interventionLabel =
    interventionPromptLabels[request.interventionState];

  const instructions = [
    "Return only the strict structured explanation object.",
    "Frame one original synthetic family-dinner scene for the current run.",
    "Explain only the supplied verified deterministic result.",
    `The audibleChange field must explicitly use the phrases "${supportLabel}" and "${interventionLabel}".`,
    "Do not diagnose, prescribe, promise benefit, claim clinical accuracy, or infer raw hearing thresholds.",
    "Do not suggest a product, treatment, device, or action.",
    "Keep every field concise, factual, illustrative, and non-clinical.",
    'Use exactly "Individual perception can differ." in the limitation field.',
  ].join(" ");

  return Object.freeze({
    instructions,
    input: JSON.stringify({
      operation: request.operation,
      runId: request.runId,
      attemptId: request.attemptId,
      groundingRevision: request.groundingRevision,
      sourceIdentity: request.sourceIdentity,
      resultIdentity: request.resultIdentity,
      profile: request.profile,
      supportMode: request.supportMode,
      supportLabel,
      interventionState: request.interventionState,
      interventionLabel,
      transformation: request.transformation,
      scene: request.scene,
    }),
  });
}

function outputText(output: ProviderExplanation): string {
  return [
    output.sceneFraming,
    output.audibleChange,
    output.unchanged,
    output.limitation,
  ].join(" ");
}

function violatesClaims(output: ProviderExplanation): boolean {
  const text = outputText(output);
  const forbiddenClaims = [
    /\bdiagnos(?:e|ed|is|tic)\b/i,
    /\bprescri(?:be|bed|ption|ptive)\b/i,
    /\bguarantee(?:d|s)?\b/i,
    /\byou (?:have|need|should)\b/i,
    /\bwill (?:restore|improve|fix|treat)\b/i,
    /\bhearing[- ]aid fitting\b/i,
    /\bclinically accurate\b/i,
    /\bexact(?:ly)? (?:matches|represents|recreates) (?:your|an individual)/i,
  ];

  return forbiddenClaims.some((pattern) => pattern.test(text));
}

function matchesGrounding(
  request: ModelExplanationRequest,
  output: ProviderExplanation,
): boolean {
  const expectedSupport = supportPromptLabels[request.supportMode].toLowerCase();
  const expectedIntervention =
    interventionPromptLabels[request.interventionState].toLowerCase();
  const audibleChange = output.audibleChange.toLowerCase();

  return (
    output.runId === request.runId &&
    output.attemptId === request.attemptId &&
    output.groundingRevision === request.groundingRevision &&
    output.sourceIdentity === request.sourceIdentity &&
    output.resultIdentity === request.resultIdentity &&
    output.profileOrigin === request.profile.origin &&
    output.profilePattern === request.profile.pattern &&
    output.supportMode === request.supportMode &&
    output.interventionState === request.interventionState &&
    audibleChange.includes(expectedSupport) &&
    audibleChange.includes(expectedIntervention) &&
    output.limitation === "Individual perception can differ."
  );
}

function requestGroundingIsCoherent(request: ModelExplanationRequest): boolean {
  const expectedSupport = {
    none: "unsupported",
    "left-one-sided": "left-ear-partial-compensation",
    bilateral: "bilateral-partial-compensation",
  } as const;
  const expectedTelevision =
    request.interventionState === "tv-on" ? "included" : "removed";

  return (
    request.transformation.support === expectedSupport[request.supportMode] &&
    request.transformation.television === expectedTelevision
  );
}

export async function explainCurrentExperience(
  input: unknown,
  provider: ExplanationProvider,
): Promise<ModelExplanationResponse> {
  const parsedRequest = modelExplanationRequestSchema.safeParse(input);

  if (!parsedRequest.success) {
    throw new Error("The model application received an invalid request.");
  }

  const request = parsedRequest.data;

  if (!requestGroundingIsCoherent(request)) {
    return degraded(request, "grounding-mismatch");
  }

  let providerResult: ExplanationProviderResult;

  try {
    providerResult = await provider.generate(providerInputFor(request));
  } catch {
    return degraded(request, "provider-failure");
  }

  if (providerResult.status !== "success") {
    return degraded(
      request,
      providerResult.status,
      providerResult.responseId,
    );
  }

  if (providerResult.model !== MODEL_ID) {
    return degraded(request, "grounding-mismatch", providerResult.responseId);
  }

  const parsedOutput = providerExplanationSchema.safeParse(
    providerResult.output,
  );

  if (!parsedOutput.success) {
    return degraded(request, "malformed-output", providerResult.responseId);
  }

  if (!matchesGrounding(request, parsedOutput.data)) {
    return degraded(request, "grounding-mismatch", providerResult.responseId);
  }

  if (violatesClaims(parsedOutput.data)) {
    return degraded(request, "claim-violation", providerResult.responseId);
  }

  return Object.freeze({
    status: "live" as const,
    operation: MODEL_OPERATION,
    runId: request.runId,
    attemptId: request.attemptId,
    attemptNumber: request.attemptNumber,
    groundingRevision: request.groundingRevision,
    sourceIdentity: request.sourceIdentity,
    resultIdentity: request.resultIdentity,
    model: MODEL_ID,
    responseId: providerResult.responseId,
    sceneFraming: parsedOutput.data.sceneFraming,
    audibleChange: parsedOutput.data.audibleChange,
    unchanged: parsedOutput.data.unchanged,
    limitation: parsedOutput.data.limitation,
  });
}
