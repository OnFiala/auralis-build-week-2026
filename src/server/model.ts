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

const speakerPositionPromptLabels = {
  "original-position": "Original position",
  "closer-in-front": "Closer, in front",
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
  const speakerPositionLabel =
    speakerPositionPromptLabels[request.speakerPositionState];

  const instructions = [
    "Return only the strict structured explanation object.",
    "Write for a non-technical family member in warm, natural, plain English.",
    "Make sceneFraming, audibleChange, and unchanged read as one coherent explanation of the supplied verified deterministic result, not as disconnected technical fragments.",
    "Across those three explanatory fields, target approximately 170–230 words.",
    "Use complete sentences, concrete language, and calm causal transitions; do not use Markdown, bullets, headings, fragments, or internal implementation jargon inside the fields.",
    "For sceneFraming, use 2–3 sentences to explain the family-dinner moment, the important speaker, and the competing conversation, television, and room sounds.",
    "Connect that situation carefully to the supplied illustrative profile pattern without interpreting or exposing raw hearing thresholds.",
    `For audibleChange, use 3–5 sentences and explicitly include the exact phrases "${supportLabel}", "${interventionLabel}", and "${speakerPositionLabel}".`,
    "Explain in causal order what the current illustrative B result is doing now, why a listener may notice a difference, and separately what support, the television intervention, and the speaker-position intervention change.",
    'Use cautious phrases such as "may", "can", and "in this illustration"; do not promise benefit or say every person would hear the same effect.',
    "For unchanged, use 2–3 sentences to explain in everyday language that the underlying recorded family moment and timeline remain the same, which competing voices and room events remain present or unchanged according to the supplied facts, and why that makes the comparison easier to interpret.",
    "Do not claim that the focused-speaker position or gain remained unchanged when it changed.",
    "Do not diagnose, prescribe, recommend treatment or a hearing device, predict clinical benefit, claim clinical accuracy, or infer raw hearing thresholds.",
    "Do not invent dialogue, family relationships, exact distances, acoustic measurements, frequencies, gains, device behavior, or events not present in the supplied grounding.",
    "Do not use internal terms such as schema, grounding revision, source identity, result identity, stems, transformation object, or provider.",
    "Do not claim that GPT created or altered the deterministic audio or that the illustration exactly reproduces an individual person’s hearing.",
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
      speakerPositionState: request.speakerPositionState,
      speakerPositionLabel,
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
  const expectedSpeakerPosition =
    speakerPositionPromptLabels[
      request.speakerPositionState
    ].toLowerCase();
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
    output.speakerPositionState === request.speakerPositionState &&
    audibleChange.includes(expectedSupport) &&
    audibleChange.includes(expectedIntervention) &&
    audibleChange.includes(expectedSpeakerPosition) &&
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
    request.transformation.television === expectedTelevision &&
    request.transformation.focusedSpeechPosition ===
      request.speakerPositionState
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
