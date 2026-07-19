import { describe, expect, it } from "vitest";

import {
  MAX_MODEL_REQUEST_BYTES,
  MODEL_ID,
  ModelRequestValidationError,
  modelExplanationRequestSchema,
  modelExplanationResponseSchema,
  parseModelExplanationRequestText,
  type ModelExplanationRequest,
  type ProviderExplanation,
} from "../contracts/runtime";
import {
  explainCurrentExperience,
  type ExplanationProvider,
  type ExplanationProviderInput,
  type ExplanationProviderResult,
} from "./model";

const request: ModelExplanationRequest = {
  operation: "explain-current-experience",
  runId: "run-1",
  attemptId: "attempt-1",
  attemptNumber: 1,
  groundingRevision: 4,
  sourceIdentity: "family-source:abc123",
  resultIdentity: "result:abc123",
  profile: {
    origin: "manual",
    predefinedProfileId: null,
    pattern: "higher-frequency-emphasis",
    earBalance: "left-more-attenuated",
  },
  supportMode: "left-one-sided",
  interventionState: "tv-off",
  speakerPositionState: "closer-in-front",
  transformation: {
    support: "left-ear-partial-compensation",
    television: "removed",
    focusedSpeechPosition: "closer-in-front",
    overlappingSpeech: "unchanged",
    kitchenRoom: "unchanged",
    limitation: "illustrative-non-clinical",
  },
  scene: {
    sceneId: "family-dinner",
    sourcePackage: "four-synchronized-synthetic-stems",
    focusedSpeech: "present",
    overlappingSpeech: "present",
    television: "present-in-source",
    kitchenRoom: "sparse-events",
  },
};

const providerOutput: ProviderExplanation = {
  runId: request.runId,
  attemptId: request.attemptId,
  groundingRevision: request.groundingRevision,
  sourceIdentity: request.sourceIdentity,
  resultIdentity: request.resultIdentity,
  profileOrigin: request.profile.origin,
  profilePattern: request.profile.pattern,
  supportMode: request.supportMode,
  interventionState: request.interventionState,
  speakerPositionState: request.speakerPositionState,
  sceneFraming:
    "A synthetic family conversation continues around a shared dinner table.",
  audibleChange:
    "Left-ear support is active, TV off removes the television contribution, and Closer, in front places the important speaker centrally.",
  unchanged:
    "Overlapping speech, sparse room events, source identity and timing remain unchanged.",
  limitation: "Individual perception can differ.",
};

function providerReturning(
  result: ExplanationProviderResult,
  calls?: { count: number; input?: ExplanationProviderInput },
): ExplanationProvider {
  return {
    async generate(input) {
      if (calls) {
        calls.count += 1;
        calls.input = input;
      }

      return result;
    },
  };
}

describe("bounded model transport", () => {
  it("strictly parses the allowlisted request and response shapes", () => {
    expect(modelExplanationRequestSchema.parse(request)).toEqual(request);

    const live = {
      status: "live",
      operation: request.operation,
      runId: request.runId,
      attemptId: request.attemptId,
      attemptNumber: request.attemptNumber,
      groundingRevision: request.groundingRevision,
      sourceIdentity: request.sourceIdentity,
      resultIdentity: request.resultIdentity,
      model: MODEL_ID,
      responseId: "resp-1",
      sceneFraming: providerOutput.sceneFraming,
      audibleChange: providerOutput.audibleChange,
      unchanged: providerOutput.unchanged,
      limitation: providerOutput.limitation,
    };

    expect(modelExplanationResponseSchema.parse(live)).toEqual(live);
    expect(() =>
      modelExplanationRequestSchema.parse({ ...request, arbitraryPrompt: "hi" }),
    ).toThrow();
    expect(() =>
      modelExplanationResponseSchema.parse({ ...live, extra: true }),
    ).toThrow();
  });

  it("rejects raw-profile fields and oversized input before provider use", () => {
    const rawProfile = JSON.stringify({
      ...request,
      leftThresholdsDbHl: [20, 25, 30, 35, 40, 45],
    });

    expect(() => parseModelExplanationRequestText(rawProfile)).toThrow(
      ModelRequestValidationError,
    );
    expect(() =>
      parseModelExplanationRequestText(
        JSON.stringify({ ...request, unknown: "field" }),
      ),
    ).toThrow(ModelRequestValidationError);
    expect(() =>
      parseModelExplanationRequestText("x".repeat(MAX_MODEL_REQUEST_BYTES + 1)),
    ).toThrow(ModelRequestValidationError);
  });
});

describe("server model application", () => {
  it("classifies one fresh validated provider result as live", async () => {
    const calls: { count: number; input?: ExplanationProviderInput } = {
      count: 0,
    };
    const result = await explainCurrentExperience(
      request,
      providerReturning(
        {
          status: "success",
          model: MODEL_ID,
          responseId: "resp-1",
          output: providerOutput,
        },
        calls,
      ),
    );

    expect(result).toMatchObject({
      status: "live",
      model: MODEL_ID,
      responseId: "resp-1",
      runId: request.runId,
      attemptId: request.attemptId,
      groundingRevision: request.groundingRevision,
      sourceIdentity: request.sourceIdentity,
      resultIdentity: request.resultIdentity,
    });
    expect(calls.count).toBe(1);
    expect(calls.input?.input).not.toMatch(
      /threshold|audiogram|leftThresholds|rightThresholds|OPENAI_API_KEY/i,
    );
    expect(calls.input?.input).toContain('"supportMode":"left-one-sided"');
    expect(calls.input?.input).toContain('"interventionState":"tv-off"');
    expect(calls.input?.input).toContain(
      '"speakerPositionState":"closer-in-front"',
    );
  });

  it.each([
    "configuration-unavailable",
    "timeout",
    "refused",
    "provider-failure",
    "malformed-output",
  ] as const)("classifies %s as an honest degraded result", async (status) => {
    const result = await explainCurrentExperience(
      request,
      providerReturning({ status, responseId: null }),
    );

    expect(result).toMatchObject({
      status: "degraded",
      reason: status,
      responseId: null,
      resultIdentity: request.resultIdentity,
    });
  });

  it("does not retry a failed provider attempt", async () => {
    const calls = { count: 0 };
    const result = await explainCurrentExperience(
      request,
      providerReturning(
        { status: "provider-failure", responseId: null },
        calls,
      ),
    );

    expect(result.status).toBe("degraded");
    expect(calls.count).toBe(1);
  });

  it("degrades malformed, mismatched and claim-violating outputs", async () => {
    const cases = [
      {
        output: { ...providerOutput, sceneFraming: "" },
        reason: "malformed-output",
      },
      {
        output: { ...providerOutput, supportMode: "bilateral" },
        reason: "grounding-mismatch",
      },
      {
        output: {
          ...providerOutput,
          speakerPositionState: "original-position",
        },
        reason: "grounding-mismatch",
      },
      {
        output: {
          ...providerOutput,
          audibleChange:
            "Left-ear support with TV off and Closer, in front will improve your hearing.",
        },
        reason: "claim-violation",
      },
    ] as const;

    for (const candidate of cases) {
      const result = await explainCurrentExperience(
        request,
        providerReturning({
          status: "success",
          model: MODEL_ID,
          responseId: "resp-1",
          output: candidate.output,
        }),
      );

      expect(result).toMatchObject({
        status: "degraded",
        reason: candidate.reason,
      });
    }
  });

  it("degrades a wrong model and a thrown provider without a false-live result", async () => {
    const wrongModel = await explainCurrentExperience(
      request,
      providerReturning({
        status: "success",
        model: "gpt-5.6-sol",
        responseId: "resp-1",
        output: providerOutput,
      }),
    );
    const thrown = await explainCurrentExperience(request, {
      async generate() {
        throw new Error("provider unavailable");
      },
    });

    expect(wrongModel).toMatchObject({
      status: "degraded",
      reason: "grounding-mismatch",
    });
    expect(thrown).toMatchObject({
      status: "degraded",
      reason: "provider-failure",
    });
  });
});
