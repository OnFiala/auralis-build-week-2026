import {
  MODEL_ID,
  MODEL_OPERATION,
  modelExplanationRequestSchema,
  modelExplanationResponseSchema,
  type DegradedModelExplanation,
  type ModelExplanationRequest,
  type ModelExplanationResponse,
} from "../contracts/runtime";

const CLIENT_TIMEOUT_MS = 18_000;
const DEGRADED_MESSAGE =
  "Live GPT explanation is unavailable. The deterministic audio comparison remains available." as const;

function clientDegraded(
  request: ModelExplanationRequest,
  reason: "client-timeout" | "network-failure" | "invalid-response",
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
    responseId: null,
    reason,
    message: DEGRADED_MESSAGE,
  });
}

export async function requestLiveExplanation(
  input: ModelExplanationRequest,
): Promise<ModelExplanationResponse> {
  const parsedRequest = modelExplanationRequestSchema.safeParse(input);

  if (!parsedRequest.success) {
    throw new Error("The browser model client received an invalid request.");
  }

  const request = parsedRequest.data;
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(
    () => controller.abort(),
    CLIENT_TIMEOUT_MS,
  );

  try {
    const response = await fetch("/api/model", {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      return clientDegraded(request, "invalid-response");
    }

    const parsedResponse = modelExplanationResponseSchema.safeParse(
      await response.json(),
    );

    return parsedResponse.success
      ? parsedResponse.data
      : clientDegraded(request, "invalid-response");
  } catch (error) {
    return clientDegraded(
      request,
      error instanceof DOMException && error.name === "AbortError"
        ? "client-timeout"
        : "network-failure",
    );
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
