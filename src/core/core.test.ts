import { describe, expect, it } from "vitest";

import {
  createInitialExperienceState,
  currentTransformedResult,
  experienceReducer,
  projectVisibleExperienceState,
  type ExperienceState,
} from "./experience";
import {
  FREQUENCY_KEYS,
  ProfileValidationError,
  confirmManualAudiogram,
  createManualAudiogramDraft,
} from "./profile";
import {
  AUDIO_SAFETY_POLICY,
  AudioSafetyError,
  assertPlaybackPreconditions,
  assertSourcePackageMetadata,
  validateRenderedAudio,
} from "./safety";
import {
  SUPPORT_MAX_COMPENSATION_DB,
  assertValidComparisonPlan,
  createComparisonPlan,
  resultForSupportMode,
  supportCompensationDb,
  supportedThresholdToGainDb,
  thresholdToGainDb,
  type ComparisonPlan,
} from "./transformation";

const SOURCE_IDENTITY =
  "auralis-family-dinner-greenhouse:a6cb7016fa973cb52a1994454cacd880a4f5864ce0a32a8081a75aad36224aed";

function validThresholds(value = 25) {
  return {
    "250": value,
    "500": value,
    "1000": value,
    "2000": value,
    "4000": value,
    "8000": value,
  };
}

function confirmedProfile() {
  return confirmManualAudiogram(
    {
      left: {
        ...validThresholds(),
        "2000": 45,
        "4000": 60,
      },
      right: {
        ...validThresholds(),
        "2000": 35,
        "4000": 45,
      },
    },
    4,
  );
}

function confirmedState(): ExperienceState {
  let state = createInitialExperienceState();
  state = experienceReducer(state, {
    type: "manual-value-changed",
    ear: "left",
    frequency: "2000",
    value: "45",
  });
  state = experienceReducer(state, {
    type: "manual-value-changed",
    ear: "right",
    frequency: "2000",
    value: "35",
  });
  state = experienceReducer(state, {
    type: "manual-value-changed",
    ear: "left",
    frequency: "4000",
    value: "60",
  });
  state = experienceReducer(state, {
    type: "manual-value-changed",
    ear: "right",
    frequency: "4000",
    value: "45",
  });

  return experienceReducer(state, {
    type: "manual-profile-confirmed",
    sourceIdentity: SOURCE_IDENTITY,
  });
}

describe("manual hearing profile", () => {
  it("confirms a valid manual profile and preserves exact separate values", () => {
    const profile = confirmedProfile();

    expect(profile.sourceType).toBe("manual");
    expect(profile.leftThresholdsDbHl["2000"]).toBe(45);
    expect(profile.rightThresholdsDbHl["2000"]).toBe(35);
    expect(profile.leftThresholdsDbHl["4000"]).toBe(60);
    expect(profile.rightThresholdsDbHl["4000"]).toBe(45);
    expect(profile.frequencyGridHz).toEqual([250, 500, 1000, 2000, 4000, 8000]);
  });

  it("rejects missing, non-finite, out-of-range and off-grid values", () => {
    const invalidInputs = [
      {
        left: { ...validThresholds(), "2000": undefined },
        right: validThresholds(),
      },
      {
        left: { ...validThresholds(), "2000": Number.NaN },
        right: validThresholds(),
      },
      {
        left: { ...validThresholds(), "2000": 105 },
        right: validThresholds(),
      },
      {
        left: { ...validThresholds(), "2000": 42 },
        right: validThresholds(),
      },
    ];

    for (const input of invalidInputs) {
      expect(() => confirmManualAudiogram(input, 1)).toThrow(ProfileValidationError);
    }
  });

  it("does not expose or substitute any nearest preset", () => {
    const first = confirmedProfile();
    const second = confirmManualAudiogram(
      {
        left: { ...validThresholds(), "4000": 55 },
        right: { ...validThresholds(), "4000": 40 },
      },
      2,
    );

    expect("presetId" in first).toBe(false);
    expect(first.profileId).not.toBe(second.profileId);
    expect(first.leftThresholdsDbHl["4000"]).toBe(60);
    expect(second.leftThresholdsDbHl["4000"]).toBe(55);
  });

  it("creates a complete unconfirmed synthetic draft without confirming it", () => {
    const draft = createManualAudiogramDraft();

    expect(FREQUENCY_KEYS.map((frequency) => draft.left[frequency])).toEqual([
      "25",
      "25",
      "25",
      "25",
      "25",
      "25",
    ]);
  });
});

describe("deterministic same-source transformation", () => {
  it("creates the same serializable plan and identity for the same input", () => {
    const first = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const second = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);

    expect(first).toEqual(second);
    expect(JSON.parse(JSON.stringify(first))).toEqual(first);
    expect(first.simulated.resultIdentity).toBe(second.simulated.resultIdentity);
  });

  it("keeps the exact same source identity in reference and simulated states", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);

    expect(plan.reference.sourceIdentity).toBe(SOURCE_IDENTITY);
    expect(plan.simulated.sourceIdentity).toBe(SOURCE_IDENTITY);
    expect(plan.sourceIdentity).toBe(SOURCE_IDENTITY);
  });

  it("uses frequency-dependent per-ear structure rather than an overall gain", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const leftGains = plan.simulated.leftFilters.map((filter) => filter.gainDb);
    const rightGains = plan.simulated.rightFilters.map((filter) => filter.gainDb);

    expect(new Set(leftGains).size).toBeGreaterThan(1);
    expect(new Set(rightGains).size).toBeGreaterThan(1);
    expect(plan.simulated.leftFilters[3]).toMatchObject({
      frequencyHz: 2000,
      inputThresholdDbHl: 45,
    });
    expect(plan.simulated.leftFilters[3]?.gainDb).toBeCloseTo(-10.8);
    expect(plan.simulated.leftFilters[4]).toMatchObject({
      frequencyHz: 4000,
      inputThresholdDbHl: 60,
    });
    expect(plan.simulated.leftFilters[4]?.gainDb).toBeCloseTo(-14.4);
  });

  it("rejects a non-finite or out-of-policy transformation plan", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const unsafe = {
      ...plan,
      simulated: {
        ...plan.simulated,
        leftFilters: [
          { ...plan.simulated.leftFilters[0], gainDb: Number.NaN },
          ...plan.simulated.leftFilters.slice(1),
        ],
      },
    } as ComparisonPlan;

    expect(() => assertValidComparisonPlan(unsafe)).toThrow(
      "unsafe or invalid filter",
    );
  });
});

describe("genuine support progression", () => {
  it("preserves the unsupported plan and changes only the supported left ear", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const unsupported = resultForSupportMode(plan, "none");
    const leftSupport = resultForSupportMode(plan, "left-one-sided");

    expect(unsupported).toBe(plan.simulated);
    expect(
      unsupported.leftFilters.map((filter) => filter.gainDb),
    ).toEqual(
      unsupported.leftFilters.map((filter) =>
        thresholdToGainDb(filter.inputThresholdDbHl),
      ),
    );
    expect(leftSupport.rightFilters).toEqual(unsupported.rightFilters);
    expect(leftSupport.leftFilters).not.toEqual(unsupported.leftFilters);
    expect(leftSupport.leftFilters[4]).toMatchObject({
      inputThresholdDbHl: 60,
      gainDb: supportedThresholdToGainDb(60),
    });
    expect(leftSupport.rightFilters[4]).toMatchObject({
      inputThresholdDbHl: 45,
      gainDb: thresholdToGainDb(45),
    });
  });

  it("applies the same bounded policy independently to both ears", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const leftSupport = resultForSupportMode(plan, "left-one-sided");
    const bilateral = resultForSupportMode(plan, "bilateral");

    expect(bilateral.leftFilters).toEqual(leftSupport.leftFilters);
    expect(bilateral.rightFilters).not.toEqual(leftSupport.rightFilters);
    expect(bilateral.rightFilters[3]).toMatchObject({
      inputThresholdDbHl: 35,
      gainDb: supportedThresholdToGainDb(35),
    });

    for (const threshold of [0, 25, 35, 45, 60, 100]) {
      expect(supportCompensationDb(threshold)).toBeLessThanOrEqual(
        SUPPORT_MAX_COMPENSATION_DB,
      );
      expect(supportedThresholdToGainDb(threshold)).toBeGreaterThanOrEqual(
        thresholdToGainDb(threshold),
      );
      expect(supportedThresholdToGainDb(threshold)).toBeLessThanOrEqual(0);
    }
    expect(supportedThresholdToGainDb(100)).toBe(-15);
  });

  it("is deterministic, same-source and frequency-specific for every support mode", () => {
    const first = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const second = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);

    for (const supportMode of [
      "none",
      "left-one-sided",
      "bilateral",
    ] as const) {
      const firstResult = resultForSupportMode(first, supportMode);
      const secondResult = resultForSupportMode(second, supportMode);
      const leftCompensation = firstResult.leftFilters.map(
        (filter, index) =>
          filter.gainDb - first.simulated.leftFilters[index]!.gainDb,
      );

      expect(firstResult).toEqual(secondResult);
      expect(firstResult.sourceIdentity).toBe(SOURCE_IDENTITY);
      expect(firstResult.resultIdentity).toBe(secondResult.resultIdentity);

      if (supportMode !== "none") {
        expect(new Set(leftCompensation).size).toBeGreaterThan(1);
      }
    }
  });

  it("rejects an invalid support plan instead of bypassing safety validation", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const unsafe = {
      ...plan,
      support: {
        ...plan.support,
        bilateral: {
          ...plan.support.bilateral,
          leftFilters: [
            { ...plan.support.bilateral.leftFilters[0], gainDb: 1 },
            ...plan.support.bilateral.leftFilters.slice(1),
          ],
        },
      },
    } as ComparisonPlan;

    expect(() => assertValidComparisonPlan(unsafe)).toThrow(
      "unsafe or invalid filter",
    );
  });
});

describe("canonical experience state", () => {
  it("accepts the valid confirmation, source, render and playback transition chain", () => {
    let state = confirmedState();
    expect(state.confirmedProfile?.leftThresholdsDbHl["4000"]).toBe(60);
    expect(state.comparisonPlan).not.toBeNull();

    state = experienceReducer(state, {
      type: "low-volume-acknowledgement-changed",
      acknowledged: true,
    });
    state = experienceReducer(state, { type: "source-load-started" });
    state = experienceReducer(state, {
      type: "source-ready",
      sourceIdentity: SOURCE_IDENTITY,
      sampleRate: 24000,
      frameCount: 1536000,
      durationSeconds: 64,
    });
    state = experienceReducer(state, {
      type: "render-started",
      mode: "simulated",
    });

    const resultIdentity = state.comparisonPlan?.simulated.resultIdentity;
    expect(resultIdentity).toBeTypeOf("string");

    state = experienceReducer(state, {
      type: "playback-started",
      mode: "simulated",
      supportMode: "none",
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity: resultIdentity!,
      peakDbFs: -9,
    });

    expect(state.playback).toMatchObject({
      status: "playing",
      mode: "simulated",
      resultIdentity,
    });
    expect(state.renders.simulated.status).toBe("ready");
  });

  it("rejects invalid profile confirmation and stale source transitions", () => {
    let invalid = createInitialExperienceState();
    invalid = experienceReducer(invalid, {
      type: "manual-value-changed",
      ear: "left",
      frequency: "2000",
      value: "",
    });
    invalid = experienceReducer(invalid, {
      type: "manual-profile-confirmed",
      sourceIdentity: SOURCE_IDENTITY,
    });
    expect(invalid.failure?.code).toBe("invalid-profile");
    expect(invalid.confirmedProfile).toBeNull();

    let stale = confirmedState();
    stale = experienceReducer(stale, {
      type: "source-ready",
      sourceIdentity: "different-source",
      sampleRate: 24000,
      frameCount: 1536000,
      durationSeconds: 64,
    });
    expect(stale.failure?.code).toBe("stale-transition");
    expect(stale.source.status).toBe("idle");
  });

  it("rejects invalid transitions and safely invalidates a pending source load", () => {
    const initial = createInitialExperienceState();
    const invalid = experienceReducer(initial, { type: "source-load-started" });

    expect(invalid.failure?.code).toBe("invalid-transition");

    let loading = confirmedState();
    loading = experienceReducer(loading, { type: "source-load-started" });
    expect(loading.source.status).toBe("loading");

    loading = experienceReducer(loading, {
      type: "manual-value-changed",
      ear: "left",
      frequency: "2000",
      value: "50",
    });
    expect(loading.source.status).toBe("idle");
    expect(loading.comparisonPlan).toBeNull();

    const staleCompletion = experienceReducer(loading, {
      type: "source-ready",
      sourceIdentity: SOURCE_IDENTITY,
      sampleRate: 24000,
      frameCount: 1536000,
      durationSeconds: 64,
    });
    expect(staleCompletion.failure?.code).toBe("stale-transition");
    expect(staleCompletion.source.status).toBe("idle");
  });

  it("moves immediately to stopped semantics and ignores stale end callbacks", () => {
    let state = confirmedState();
    state = experienceReducer(state, {
      type: "low-volume-acknowledgement-changed",
      acknowledged: true,
    });
    state = experienceReducer(state, { type: "source-load-started" });
    state = experienceReducer(state, {
      type: "source-ready",
      sourceIdentity: SOURCE_IDENTITY,
      sampleRate: 24000,
      frameCount: 1536000,
      durationSeconds: 64,
    });
    state = experienceReducer(state, {
      type: "render-started",
      mode: "reference",
    });

    const resultIdentity = state.comparisonPlan!.reference.resultIdentity;
    state = experienceReducer(state, {
      type: "playback-started",
      mode: "reference",
      supportMode: null,
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity,
      peakDbFs: -8,
    });
    state = experienceReducer(state, { type: "playback-stopped" });

    expect(state.playback.status).toBe("stopped");
    expect(
      experienceReducer(state, {
        type: "playback-ended",
        resultIdentity,
      }),
    ).toBe(state);
  });

  it("does not allow low-volume acknowledgement to be revoked during rendering", () => {
    let state = confirmedState();
    state = experienceReducer(state, {
      type: "low-volume-acknowledgement-changed",
      acknowledged: true,
    });
    state = experienceReducer(state, { type: "source-load-started" });
    state = experienceReducer(state, {
      type: "source-ready",
      sourceIdentity: SOURCE_IDENTITY,
      sampleRate: 24000,
      frameCount: 1536000,
      durationSeconds: 64,
    });
    state = experienceReducer(state, {
      type: "render-started",
      mode: "simulated",
    });
    state = experienceReducer(state, {
      type: "low-volume-acknowledgement-changed",
      acknowledged: false,
    });

    expect(state.failure?.code).toBe("invalid-transition");
    expect(state.lowVolumeAcknowledged).toBe(true);
    expect(state.renders.simulated.status).toBe("rendering");
  });

  it("keeps support canonical and rejects a change during supported playback", () => {
    let state = confirmedState();
    state = experienceReducer(state, {
      type: "support-mode-changed",
      supportMode: "left-one-sided",
    });
    state = experienceReducer(state, {
      type: "low-volume-acknowledgement-changed",
      acknowledged: true,
    });
    state = experienceReducer(state, { type: "source-load-started" });
    state = experienceReducer(state, {
      type: "source-ready",
      sourceIdentity: SOURCE_IDENTITY,
      sampleRate: 24000,
      frameCount: 1536000,
      durationSeconds: 64,
    });
    state = experienceReducer(state, {
      type: "render-started",
      mode: "simulated",
    });

    const resultIdentity = state.comparisonPlan!.support[
      "left-one-sided"
    ].resultIdentity;
    state = experienceReducer(state, {
      type: "playback-started",
      mode: "simulated",
      supportMode: "left-one-sided",
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity,
      peakDbFs: -8,
    });
    const rejected = experienceReducer(state, {
      type: "support-mode-changed",
      supportMode: "bilateral",
    });

    expect(rejected.failure?.code).toBe("invalid-transition");
    expect(rejected.supportMode).toBe("left-one-sided");
    expect(rejected.playback.status).toBe("playing");
    expect(currentTransformedResult(rejected)?.supportMode).toBe(
      "left-one-sided",
    );
    expect(projectVisibleExperienceState(rejected).support).toContain(
      "Left-ear support",
    );

    const stopped = experienceReducer(rejected, { type: "playback-stopped" });
    expect(stopped.playback.status).toBe("stopped");
    expect(stopped.supportMode).toBe("left-one-sided");
  });
});

describe("fail-closed audio safety policy", () => {
  it("requires low-volume acknowledgement and the matching source", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);

    expect(() =>
      assertPlaybackPreconditions(
        plan,
        "reference",
        "none",
        false,
        SOURCE_IDENTITY,
      ),
    ).toThrow(AudioSafetyError);
    expect(() =>
      assertPlaybackPreconditions(plan, "reference", "none", true, "wrong-source"),
    ).toThrow(AudioSafetyError);
  });

  it("requires four synchronized mono source stems", () => {
    const valid = {
      sampleRate: 24000,
      numberOfChannels: 1,
      frameCount: 1536000,
      durationSeconds: 64,
    };

    expect(assertSourcePackageMetadata([valid, valid, valid, valid])).toEqual(valid);
    expect(() =>
      assertSourcePackageMetadata([
        valid,
        valid,
        valid,
        { ...valid, frameCount: 100 },
      ]),
    ).toThrow(AudioSafetyError);
  });

  it("rejects non-finite samples and peak-ceiling overshoot", () => {
    const audioView = (samples: Float32Array) => ({
      numberOfChannels: 2,
      length: samples.length,
      sampleRate: 24000,
      duration: samples.length / 24000,
      getChannelData: () => samples,
    });

    expect(validateRenderedAudio(audioView(new Float32Array([0, 0.25])))).toMatchObject({
      finite: true,
      peakLinear: 0.25,
    });
    expect(() =>
      validateRenderedAudio(audioView(new Float32Array([0, Number.NaN]))),
    ).toThrow("non-finite");
    expect(() =>
      validateRenderedAudio(
        audioView(
          new Float32Array([
            0,
            AUDIO_SAFETY_POLICY.renderedPeakCeilingLinear + 0.01,
          ]),
        ),
      ),
    ).toThrow("sample-peak ceiling");
  });
});
