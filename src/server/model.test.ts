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
    "At the family dinner, one person is the important speaker while another conversation, the television, and occasional kitchen or room sounds compete for attention. The supplied illustrative profile has a higher-frequency emphasis with the left side more attenuated, so in this scene some softer speech details may be less easy to separate from everything happening around the table.",
  audibleChange:
    "In this illustration, Left-ear support partially changes the listening perspective for the left side; it may bring some speech detail forward without recreating anyone’s hearing or promising the same effect for every person. With TV off, the television contribution is removed, so one source of competition is no longer present while the overlapping voices and room sounds continue. With the important speaker Closer, in front, that speaker’s contribution is repositioned according to the deterministic comparison, which can make the voice easier to pick out in this particular result. These changes work together in B, but each one addresses a different part of the listening situation.",
  unchanged:
    "The underlying recorded family moment and its timeline stay the same, so the words, overlapping conversation, and sparse kitchen or room events occur at the same points as before. Keeping those elements in place means the comparison changes only the selected support and communication conditions, making it easier to connect any noticed difference to those choices rather than to a different scene.",
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
    expect(calls.input?.instructions).toContain(
      "Write for a non-technical family member in warm, natural, plain English.",
    );
    expect(calls.input?.instructions).toContain(
      "Across those three explanatory fields, target approximately 170–230 words.",
    );
    expect(calls.input?.instructions).toContain(
      "For sceneFraming, use 2–3 sentences",
    );
    expect(calls.input?.instructions).toContain(
      "For audibleChange, use 3–5 sentences",
    );
    expect(calls.input?.instructions).toContain(
      "For unchanged, use 2–3 sentences",
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

  it("degrades non-empty but materially terse prose as malformed output", async () => {
    const result = await explainCurrentExperience(
      request,
      providerReturning({
        status: "success",
        model: MODEL_ID,
        responseId: "resp-1",
        output: {
          ...providerOutput,
          sceneFraming: "A family dinner continues.",
        },
      }),
    );

    expect(result).toMatchObject({
      status: "degraded",
      reason: "malformed-output",
    });
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
          audibleChange: `${providerOutput.audibleChange} It will improve your hearing.`,
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
