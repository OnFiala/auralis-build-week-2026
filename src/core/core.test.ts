import { describe, expect, it } from "vitest";

import {
  canRequestModelExplanation,
  createInitialExperienceState,
  createModelExplanationRequest,
  currentTransformedResult,
  experienceReducer,
  projectVisibleExperienceState,
  type ExperienceState,
} from "./experience";
import {
  FREQUENCY_KEYS,
  PREDEFINED_HEARING_PROFILES,
  ProfileValidationError,
  confirmManualAudiogram,
  confirmPredefinedProfile,
  createManualAudiogramDraft,
  type EarThresholds,
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
  referenceResultForIntervention,
  resultForSupportMode,
  sourceContributionsForIntervention,
  supportCompensationDb,
  supportedThresholdToGainDb,
  thresholdToGainDb,
  type ComparisonPlan,
} from "./transformation";
import { MODEL_ID } from "../contracts/runtime";

const SOURCE_IDENTITY =
  "auralis-family-dinner-greenhouse:a6cb7016fa973cb52a1994454cacd880a4f5864ce0a32a8081a75aad36224aed";

const EXPECTED_PREDEFINED_PROFILES = [
  {
    id: "high-frequency-hearing-loss",
    displayName: "High-frequency hearing loss",
    right: [20, 20, 25, 35, 55, 70],
    left: [20, 20, 25, 35, 55, 70],
  },
  {
    id: "flat-hearing-loss",
    displayName: "Flat hearing loss",
    right: [45, 45, 45, 45, 45, 45],
    left: [45, 45, 45, 45, 45, 45],
  },
  {
    id: "asymmetric-hearing-loss",
    displayName: "Asymmetric hearing loss",
    right: [20, 20, 25, 30, 35, 40],
    left: [45, 50, 55, 60, 65, 70],
  },
] as const;

function thresholdValues(thresholds: EarThresholds): number[] {
  return FREQUENCY_KEYS.map((frequency) => thresholds[frequency]);
}

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

function modelReadyState(): ExperienceState {
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
  const result = currentTransformedResult(state)!;
  state = experienceReducer(state, {
    type: "playback-started",
    mode: "simulated",
    supportMode: state.supportMode,
    interventionState: state.interventionState,
    sourceIdentity: result.sourceIdentity,
    resultIdentity: result.resultIdentity,
    peakDbFs: -9,
  });

  return experienceReducer(state, { type: "playback-stopped" });
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

  it("does not substitute any nearest predefined profile", () => {
    const first = confirmedProfile();
    const second = confirmManualAudiogram(
      {
        left: { ...validThresholds(), "4000": 55 },
        right: { ...validThresholds(), "4000": 40 },
      },
      2,
    );

    expect(first.predefinedProfileId).toBeNull();
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

describe("synthetic predefined hearing profiles", () => {
  it("freezes exactly three unique approved fixtures with exact per-ear values", () => {
    expect(PREDEFINED_HEARING_PROFILES).toHaveLength(3);
    expect(
      PREDEFINED_HEARING_PROFILES.map((profile) => ({
        id: profile.id,
        displayName: profile.displayName,
        right: thresholdValues(profile.rightThresholdsDbHl),
        left: thresholdValues(profile.leftThresholdsDbHl),
      })),
    ).toEqual(EXPECTED_PREDEFINED_PROFILES);
    expect(
      new Set(PREDEFINED_HEARING_PROFILES.map((profile) => profile.id)).size,
    ).toBe(3);
    expect(
      new Set(PREDEFINED_HEARING_PROFILES.map((profile) => profile.displayName))
        .size,
    ).toBe(3);
    expect(Object.isFrozen(PREDEFINED_HEARING_PROFILES)).toBe(true);

    for (const profile of PREDEFINED_HEARING_PROFILES) {
      expect(profile.classification).toBe("synthetic-illustrative");
      expect(Object.isFrozen(profile)).toBe(true);
      expect(Object.isFrozen(profile.rightThresholdsDbHl)).toBe(true);
      expect(Object.isFrozen(profile.leftThresholdsDbHl)).toBe(true);
    }
  });

  it("keeps every fixture on the approved grid, bounds and 5 dB step", () => {
    const signatures = new Set<string>();

    for (const profile of PREDEFINED_HEARING_PROFILES) {
      const values = [
        ...thresholdValues(profile.rightThresholdsDbHl),
        ...thresholdValues(profile.leftThresholdsDbHl),
      ];

      for (const value of values) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
        expect(value % 5).toBe(0);
      }

      signatures.add(values.join(","));
    }

    expect(signatures.size).toBe(3);
  });

  it("confirms exact fixture values without mutation and shares the manual shape", () => {
    const manual = confirmedProfile();

    for (const fixture of PREDEFINED_HEARING_PROFILES) {
      const before = JSON.stringify(fixture);
      const confirmed = confirmPredefinedProfile(fixture.id, 0);

      expect(confirmed.sourceType).toBe("predefined");
      expect(confirmed.predefinedProfileId).toBe(fixture.id);
      expect(confirmed.displayName).toBe(fixture.displayName);
      expect(confirmed.rightThresholdsDbHl).toEqual(
        fixture.rightThresholdsDbHl,
      );
      expect(confirmed.leftThresholdsDbHl).toEqual(fixture.leftThresholdsDbHl);
      expect(Object.keys(confirmed).sort()).toEqual(
        Object.keys(manual).sort(),
      );
      expect(JSON.stringify(fixture)).toBe(before);
    }
  });

  it("uses the same deterministic same-source support pipeline for every fixture", () => {
    for (const fixture of PREDEFINED_HEARING_PROFILES) {
      const profile = confirmPredefinedProfile(fixture.id, 0);
      const first = createComparisonPlan(profile, SOURCE_IDENTITY);
      const second = createComparisonPlan(profile, SOURCE_IDENTITY);

      expect(first).toEqual(second);
      expect(first.profileId).toBe(profile.profileId);
      expect(first.sourceIdentity).toBe(SOURCE_IDENTITY);

      for (const supportMode of [
        "none",
        "left-one-sided",
        "bilateral",
      ] as const) {
        const result = resultForSupportMode(first, supportMode);

        expect(result.sourceIdentity).toBe(SOURCE_IDENTITY);
        expect(result.resultIdentity).toBe(
          resultForSupportMode(second, supportMode).resultIdentity,
        );
        expect(
          result.rightFilters.map((filter) => filter.inputThresholdDbHl),
        ).toEqual(thresholdValues(fixture.rightThresholdsDbHl));
        expect(
          result.leftFilters.map((filter) => filter.inputThresholdDbHl),
        ).toEqual(thresholdValues(fixture.leftThresholdsDbHl));
      }
    }
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

describe("coherent TV-off intervention", () => {
  it("removes only the television contribution and preserves the source plan", () => {
    const plan = createComparisonPlan(confirmedProfile(), SOURCE_IDENTITY);
    const referenceOn = referenceResultForIntervention(plan, "tv-on");
    const referenceOff = referenceResultForIntervention(plan, "tv-off");

    expect(referenceOn.sourceContributions).toEqual({
      focusedSpeech: 1,
      overlappingSpeech: 1,
      television: 1,
      kitchenRoom: 1,
    });
    expect(referenceOff.sourceContributions).toEqual({
      focusedSpeech: 1,
      overlappingSpeech: 1,
      television: 0,
      kitchenRoom: 1,
    });
    expect(referenceOff.sourceIdentity).toBe(referenceOn.sourceIdentity);
    expect(referenceOff.resultIdentity).not.toBe(referenceOn.resultIdentity);

    for (const supportMode of [
      "none",
      "left-one-sided",
      "bilateral",
    ] as const) {
      const tvOn = resultForSupportMode(plan, supportMode, "tv-on");
      const tvOff = resultForSupportMode(plan, supportMode, "tv-off");

      expect(tvOff.sourceContributions).toEqual(
        sourceContributionsForIntervention("tv-off"),
      );
      expect(tvOff.sourceIdentity).toBe(tvOn.sourceIdentity);
      expect(tvOff.resultIdentity).not.toBe(tvOn.resultIdentity);
      expect(tvOff.leftFilters).toEqual(tvOn.leftFilters);
      expect(tvOff.rightFilters).toEqual(tvOn.rightFilters);
    }
  });

  it("is deterministic for every profile and support state", () => {
    const profiles = [
      confirmedProfile(),
      ...PREDEFINED_HEARING_PROFILES.map((fixture) =>
        confirmPredefinedProfile(fixture.id, 0),
      ),
    ];

    for (const profile of profiles) {
      const first = createComparisonPlan(profile, SOURCE_IDENTITY);
      const second = createComparisonPlan(profile, SOURCE_IDENTITY);

      for (const supportMode of [
        "none",
        "left-one-sided",
        "bilateral",
      ] as const) {
        const firstResult = resultForSupportMode(
          first,
          supportMode,
          "tv-off",
        );
        const secondResult = resultForSupportMode(
          second,
          supportMode,
          "tv-off",
        );

        expect(firstResult).toEqual(secondResult);
        expect(firstResult.sourceIdentity).toBe(SOURCE_IDENTITY);
        expect(firstResult.sourceContributions.television).toBe(0);
      }
    }
  });

  it("keeps intervention state canonical and rejects stale playback", () => {
    let state = confirmedState();
    expect(state.interventionState).toBe("tv-on");
    expect(projectVisibleExperienceState(state)).toMatchObject({
      intervention: "Environmental intervention: TV on.",
      interventionSummary:
        "The television remains part of the competing family scene.",
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

    const tvOnIdentity = currentTransformedResult(state)!.resultIdentity;
    state = experienceReducer(state, {
      type: "playback-started",
      mode: "simulated",
      supportMode: "none",
      interventionState: "tv-on",
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity: tvOnIdentity,
      peakDbFs: -9,
    });

    const rejectedWhilePlaying = experienceReducer(state, {
      type: "intervention-state-changed",
      interventionState: "tv-off",
    });
    expect(rejectedWhilePlaying.failure?.code).toBe("invalid-transition");
    expect(rejectedWhilePlaying.interventionState).toBe("tv-on");
    expect(rejectedWhilePlaying.playback.status).toBe("playing");

    state = experienceReducer(rejectedWhilePlaying, {
      type: "playback-stopped",
    });
    state = experienceReducer(state, {
      type: "intervention-state-changed",
      interventionState: "tv-off",
    });

    const tvOffIdentity = currentTransformedResult(state)!.resultIdentity;
    expect(state.interventionState).toBe("tv-off");
    expect(state.source.status).toBe("ready");
    expect(state.renders.reference.status).toBe("idle");
    expect(state.renders.simulated.status).toBe("idle");
    expect(state.playback.status).toBe("stopped");
    expect(tvOffIdentity).not.toBe(tvOnIdentity);
    expect(projectVisibleExperienceState(state)).toMatchObject({
      intervention: "Environmental intervention: TV off.",
      interventionSummary:
        "The television contribution has been removed; focused speech, overlapping speech, and room events remain unchanged.",
    });

    state = experienceReducer(state, {
      type: "render-started",
      mode: "simulated",
    });
    const stale = experienceReducer(state, {
      type: "playback-started",
      mode: "simulated",
      supportMode: "none",
      interventionState: "tv-on",
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity: tvOnIdentity,
      peakDbFs: -9,
    });
    expect(stale.failure?.code).toBe("stale-transition");
    expect(stale.playback.status).toBe("stopped");

    state = experienceReducer(stale, {
      type: "playback-started",
      mode: "simulated",
      supportMode: "none",
      interventionState: "tv-off",
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity: tvOffIdentity,
      peakDbFs: -9,
    });
    expect(state.playback).toMatchObject({
      status: "playing",
      interventionState: "tv-off",
      resultIdentity: tvOffIdentity,
    });

    state = experienceReducer(state, { type: "playback-stopped" });
    expect(state.playback.status).toBe("stopped");
  });
});

describe("canonical experience state", () => {
  it("confirms only the canonically selected predefined profile", () => {
    let state = createInitialExperienceState();
    state = experienceReducer(state, {
      type: "profile-entry-selected",
      entryOption: "flat-hearing-loss",
    });
    state = experienceReducer(state, {
      type: "predefined-profile-confirmed",
      profileId: "flat-hearing-loss",
      sourceIdentity: SOURCE_IDENTITY,
    });

    expect(state.selectedProfileEntry).toBe("flat-hearing-loss");
    expect(state.confirmedProfile).toMatchObject({
      sourceType: "predefined",
      predefinedProfileId: "flat-hearing-loss",
      displayName: "Flat hearing loss",
    });
    expect(state.comparisonPlan?.profileId).toBe(
      state.confirmedProfile?.profileId,
    );
    expect(projectVisibleExperienceState(state).profile).toContain(
      "Flat hearing loss confirmed",
    );

    const selectedOther = experienceReducer(createInitialExperienceState(), {
      type: "profile-entry-selected",
      entryOption: "high-frequency-hearing-loss",
    });
    const mismatched = experienceReducer(selectedOther, {
      type: "predefined-profile-confirmed",
      profileId: "flat-hearing-loss",
      sourceIdentity: SOURCE_IDENTITY,
    });

    expect(mismatched.failure?.code).toBe("invalid-transition");
    expect(mismatched.confirmedProfile).toBeNull();
  });

  it("invalidates stale output when entry changes and preserves the manual draft", () => {
    let state = createInitialExperienceState();
    state = experienceReducer(state, {
      type: "manual-value-changed",
      ear: "right",
      frequency: "4000",
      value: "55",
    });
    state = experienceReducer(state, {
      type: "profile-entry-selected",
      entryOption: "high-frequency-hearing-loss",
    });
    state = experienceReducer(state, {
      type: "predefined-profile-confirmed",
      profileId: "high-frequency-hearing-loss",
      sourceIdentity: SOURCE_IDENTITY,
    });
    state = experienceReducer(state, {
      type: "support-mode-changed",
      supportMode: "bilateral",
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
    const resultIdentity = currentTransformedResult(state)!.resultIdentity;
    state = experienceReducer(state, {
      type: "playback-started",
      mode: "simulated",
      supportMode: "bilateral",
      interventionState: "tv-on",
      sourceIdentity: SOURCE_IDENTITY,
      resultIdentity,
      peakDbFs: -9,
    });

    state = experienceReducer(state, {
      type: "profile-entry-selected",
      entryOption: "asymmetric-hearing-loss",
    });

    expect(state.selectedProfileEntry).toBe("asymmetric-hearing-loss");
    expect(state.confirmedProfile).toBeNull();
    expect(state.comparisonPlan).toBeNull();
    expect(state.supportMode).toBe("none");
    expect(state.renders.reference.status).toBe("idle");
    expect(state.renders.simulated.status).toBe("idle");
    expect(state.playback.status).toBe("stopped");
    expect(projectVisibleExperienceState(state).profile).toBe(
      "Asymmetric hearing loss: confirmation required.",
    );

    state = experienceReducer(state, {
      type: "profile-entry-selected",
      entryOption: "manual",
    });
    state = experienceReducer(state, {
      type: "manual-profile-confirmed",
      sourceIdentity: SOURCE_IDENTITY,
    });

    expect(state.confirmedProfile?.sourceType).toBe("manual");
    expect(state.confirmedProfile?.rightThresholdsDbHl["4000"]).toBe(55);
    expect(state.confirmedProfile?.predefinedProfileId).toBeNull();
  });

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
      interventionState: "tv-on",
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
      interventionState: "tv-on",
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
      interventionState: "tv-on",
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

describe("canonical live and degraded model state", () => {
  it("creates a sanitized request and applies only the matching fresh result", () => {
    let state = modelReadyState();
    const request = createModelExplanationRequest(
      state,
      "run-1",
      "attempt-1",
      "result-transport-1",
    );

    expect(request).not.toBeNull();
    expect(request).not.toHaveProperty("leftThresholdsDbHl");
    expect(request).not.toHaveProperty("rightThresholdsDbHl");
    expect(JSON.stringify(request)).not.toMatch(/threshold|audiogram/i);
    expect(request!.resultIdentity).toBe("result-transport-1");
    expect(request!.resultIdentity).not.toBe(
      currentTransformedResult(state)!.resultIdentity,
    );
    expect(JSON.stringify(request)).not.toContain(
      currentTransformedResult(state)!.resultIdentity,
    );
    expect(request).toMatchObject({
      profile: {
        origin: "manual",
        predefinedProfileId: null,
        pattern: "higher-frequency-emphasis",
        earBalance: "similar",
      },
      supportMode: "none",
      interventionState: "tv-on",
    });

    state = experienceReducer(state, {
      type: "model-request-started",
      request: request!,
    });
    expect(state.modelState.status).toBe("loading");
    expect(state.modelAttemptsUsed).toBe(1);

    state = experienceReducer(state, {
      type: "model-result-received",
      result: {
        status: "live",
        operation: request!.operation,
        runId: request!.runId,
        attemptId: request!.attemptId,
        attemptNumber: request!.attemptNumber,
        groundingRevision: request!.groundingRevision,
        sourceIdentity: request!.sourceIdentity,
        resultIdentity: request!.resultIdentity,
        model: MODEL_ID,
        responseId: "resp-1",
        sceneFraming: "A synthetic family dinner is in progress.",
        audibleChange: "No support is active and TV on remains in the scene.",
        unchanged: "The source and timeline remain unchanged.",
        limitation: "Individual perception can differ.",
      },
    });

    expect(state.modelState.status).toBe("live");
    expect(projectVisibleExperienceState(state).model).toContain(
      "current and grounded",
    );
  });

  it("rejects stale run, attempt, revision and result identities", () => {
    const mismatches = [
      { runId: "other-run" },
      { attemptId: "other-attempt" },
      { groundingRevision: 999 },
      { resultIdentity: "other-result" },
    ];

    for (const mismatch of mismatches) {
      let state = modelReadyState();
      const request = createModelExplanationRequest(
        state,
        "run-1",
        "attempt-1",
        "result-transport-1",
      )!;
      state = experienceReducer(state, {
        type: "model-request-started",
        request,
      });
      state = experienceReducer(state, {
        type: "model-result-received",
        result: {
          status: "degraded",
          operation: request.operation,
          runId: request.runId,
          attemptId: request.attemptId,
          attemptNumber: request.attemptNumber,
          groundingRevision: request.groundingRevision,
          sourceIdentity: request.sourceIdentity,
          resultIdentity: request.resultIdentity,
          model: MODEL_ID,
          responseId: null,
          reason: "provider-failure",
          message:
            "Live GPT explanation is unavailable. The deterministic audio comparison remains available.",
          ...mismatch,
        },
      });

      expect(state.modelState.status).toBe("idle");
    }
  });

  it("invalidates an explanation when support or intervention grounding changes", () => {
    let state = modelReadyState();
    const request = createModelExplanationRequest(
      state,
      "run-1",
      "attempt-1",
      "result-transport-1",
    )!;
    state = experienceReducer(state, {
      type: "model-request-started",
      request,
    });
    state = experienceReducer(state, {
      type: "model-result-received",
      result: {
        status: "degraded",
        operation: request.operation,
        runId: request.runId,
        attemptId: request.attemptId,
        attemptNumber: request.attemptNumber,
        groundingRevision: request.groundingRevision,
        sourceIdentity: request.sourceIdentity,
        resultIdentity: request.resultIdentity,
        model: MODEL_ID,
        responseId: null,
        reason: "provider-failure",
        message:
          "Live GPT explanation is unavailable. The deterministic audio comparison remains available.",
      },
    });

    const revision = state.modelGroundingRevision;
    state = experienceReducer(state, {
      type: "support-mode-changed",
      supportMode: "left-one-sided",
    });
    expect(state.modelState.status).toBe("idle");
    expect(state.modelGroundingRevision).toBe(revision + 1);

    state = experienceReducer(state, {
      type: "intervention-state-changed",
      interventionState: "tv-off",
    });
    expect(state.modelState.status).toBe("idle");
    expect(state.modelGroundingRevision).toBe(revision + 2);
  });

  it("keeps deterministic audio usable while degraded and limits explicit attempts", () => {
    let state = modelReadyState();

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const request = createModelExplanationRequest(
        state,
        "run-1",
        `attempt-${attempt}`,
        `result-transport-${attempt}`,
      )!;
      state = experienceReducer(state, {
        type: "model-request-started",
        request,
      });
      state = experienceReducer(state, {
        type: "model-result-received",
        result: {
          status: "degraded",
          operation: request.operation,
          runId: request.runId,
          attemptId: request.attemptId,
          attemptNumber: request.attemptNumber,
          groundingRevision: request.groundingRevision,
          sourceIdentity: request.sourceIdentity,
          resultIdentity: request.resultIdentity,
          model: MODEL_ID,
          responseId: null,
          reason: "timeout",
          message:
            "Live GPT explanation is unavailable. The deterministic audio comparison remains available.",
        },
      });
    }

    expect(state.modelState.status).toBe("degraded");
    expect(state.modelAttemptsUsed).toBe(3);
    expect(canRequestModelExplanation(state)).toBe(false);
    expect(
      createModelExplanationRequest(
        state,
        "run-1",
        "attempt-4",
        "result-transport-4",
      ),
    ).toBeNull();

    state = experienceReducer(state, {
      type: "render-started",
      mode: "reference",
    });
    const reference = referenceResultForIntervention(
      state.comparisonPlan!,
      state.interventionState,
    );
    state = experienceReducer(state, {
      type: "playback-started",
      mode: "reference",
      supportMode: null,
      interventionState: state.interventionState,
      sourceIdentity: reference.sourceIdentity,
      resultIdentity: reference.resultIdentity,
      peakDbFs: -8,
    });

    expect(state.playback.status).toBe("playing");
    expect(state.modelState.status).toBe("degraded");
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
        "tv-on",
        false,
        SOURCE_IDENTITY,
      ),
    ).toThrow(AudioSafetyError);
    expect(() =>
      assertPlaybackPreconditions(
        plan,
        "reference",
        "none",
        "tv-off",
        true,
        "wrong-source",
      ),
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
