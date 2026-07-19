import {
  MAX_MODEL_ATTEMPTS_PER_SESSION,
  MODEL_ID,
  MODEL_OPERATION,
  modelExplanationRequestSchema,
  type ModelExplanationRequest,
  type ModelExplanationResponse,
} from "../contracts/runtime";
import {
  FREQUENCY_KEYS,
  MANUAL_PROFILE_ENTRY_LABEL,
  ProfileValidationError,
  confirmManualAudiogramDraft,
  confirmPredefinedProfile,
  createManualAudiogramDraft,
  predefinedProfileById,
  updateManualAudiogramDraft,
  type ConfirmedHearingProfile,
  type Ear,
  type FrequencyKey,
  type ManualAudiogramDraft,
  type PredefinedProfileId,
  type ProfileEntryOption,
} from "./profile";
import {
  createComparisonPlan,
  resultForSupportMode,
  resultIdentityForMode,
  type ComparisonMode,
  type ComparisonPlan,
  type InterventionState,
  type SpeakerPositionState,
  type SupportMode,
  type TransformedResultPlan,
} from "./transformation";

export type ExperienceComparisonMode = ComparisonMode;
export type ExperienceSupportMode = SupportMode;
export type ExperienceInterventionState = InterventionState;
export type ExperienceSpeakerPositionState = SpeakerPositionState;
export type ExperienceProfileEntryOption = ProfileEntryOption;
export type ExperienceCompletionState =
  | "in-progress"
  | "complete-live"
  | "complete-degraded";

export type ModelState =
  | Readonly<{ status: "idle" }>
  | Readonly<{
      status: "loading";
      request: ModelExplanationRequest;
      canonicalResultIdentity: string;
    }>
  | Readonly<{
      status: "live";
      result: Extract<ModelExplanationResponse, { status: "live" }>;
    }>
  | Readonly<{
      status: "degraded";
      result: Extract<ModelExplanationResponse, { status: "degraded" }>;
    }>;

type SourceState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{
      status: "ready";
      sourceIdentity: string;
      sampleRate: number;
      frameCount: number;
      durationSeconds: number;
    }>
  | Readonly<{ status: "failed" }>;

type RenderState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "rendering" }>
  | Readonly<{
      status: "ready";
      sourceIdentity: string;
      resultIdentity: string;
      peakDbFs: number;
    }>
  | Readonly<{ status: "failed" }>;

type PlaybackState =
  | Readonly<{
      status: "stopped";
      mode: null;
      supportMode: null;
      interventionState: null;
      speakerPositionState: null;
      resultIdentity: null;
    }>
  | Readonly<{
      status: "playing";
      mode: ComparisonMode;
      supportMode: SupportMode | null;
      interventionState: InterventionState;
      speakerPositionState: SpeakerPositionState;
      resultIdentity: string;
    }>
  | Readonly<{
      status: "failed";
      mode: null;
      supportMode: null;
      interventionState: null;
      speakerPositionState: null;
      resultIdentity: null;
    }>;

export type ValidatedFailureCode =
  | "invalid-profile"
  | "invalid-transition"
  | "stale-transition"
  | "source-load-failed"
  | "audio-safety-rejected"
  | "audio-runtime-unavailable"
  | "audio-runtime-interrupted";

export type ValidatedFailure = Readonly<{
  validated: true;
  code: ValidatedFailureCode;
  message: string;
}>;

export type ExperienceState = Readonly<{
  selectedProfileEntry: ProfileEntryOption;
  manualDraft: ManualAudiogramDraft;
  draftRevision: number;
  lastEdit: Readonly<{
    ear: Ear;
    frequency: FrequencyKey;
    previousValue: string;
    nextValue: string;
  }> | null;
  confirmedProfile: ConfirmedHearingProfile | null;
  comparisonPlan: ComparisonPlan | null;
  supportMode: SupportMode;
  interventionState: InterventionState;
  speakerPositionState: SpeakerPositionState;
  source: SourceState;
  renders: Readonly<Record<ComparisonMode, RenderState>>;
  lowVolumeAcknowledged: boolean;
  playback: PlaybackState;
  modelGroundingRevision: number;
  modelAttemptsUsed: number;
  modelState: ModelState;
  completionState: ExperienceCompletionState;
  failure: ValidatedFailure | null;
}>;

export type ExperienceAction =
  | Readonly<{
      type: "profile-entry-selected";
      entryOption: ProfileEntryOption;
    }>
  | Readonly<{
      type: "manual-value-changed";
      ear: Ear;
      frequency: FrequencyKey;
      value: string;
    }>
  | Readonly<{ type: "manual-profile-confirmed"; sourceIdentity: string }>
  | Readonly<{
      type: "predefined-profile-confirmed";
      profileId: PredefinedProfileId;
      sourceIdentity: string;
    }>
  | Readonly<{ type: "support-mode-changed"; supportMode: SupportMode }>
  | Readonly<{
      type: "intervention-state-changed";
      interventionState: InterventionState;
    }>
  | Readonly<{
      type: "speaker-position-changed";
      speakerPositionState: SpeakerPositionState;
    }>
  | Readonly<{ type: "low-volume-acknowledgement-changed"; acknowledged: boolean }>
  | Readonly<{ type: "source-load-started" }>
  | Readonly<{
      type: "source-ready";
      sourceIdentity: string;
      sampleRate: number;
      frameCount: number;
      durationSeconds: number;
    }>
  | Readonly<{ type: "render-started"; mode: ComparisonMode }>
  | Readonly<{
      type: "playback-started";
      mode: ComparisonMode;
      supportMode: SupportMode | null;
      interventionState: InterventionState;
      speakerPositionState: SpeakerPositionState;
      sourceIdentity: string;
      resultIdentity: string;
      peakDbFs: number;
    }>
  | Readonly<{ type: "playback-stopped" }>
  | Readonly<{ type: "playback-ended"; resultIdentity: string }>
  | Readonly<{
      type: "model-request-started";
      request: ModelExplanationRequest;
    }>
  | Readonly<{
      type: "model-result-received";
      result: ModelExplanationResponse;
    }>
  | Readonly<{ type: "experience-completed" }>
  | Readonly<{ type: "comparison-reset" }>
  | Readonly<{
      type: "operation-failed";
      code: Exclude<ValidatedFailureCode, "invalid-profile" | "invalid-transition" | "stale-transition">;
      mode?: ComparisonMode;
    }>;

const failureMessages: Record<ValidatedFailureCode, string> = {
  "invalid-profile":
    "Complete every left and right value using 0–100 dB HL in 5 dB steps.",
  "invalid-transition": "That action is not available in the current experience state.",
  "stale-transition": "The result no longer matches the confirmed profile or source.",
  "source-load-failed": "The validated family scene could not be loaded.",
  "audio-safety-rejected": "Playback was blocked because digital validation did not pass.",
  "audio-runtime-unavailable": "This browser could not prepare the audio proof.",
  "audio-runtime-interrupted":
    "Playback was muted because the browser audio runtime was interrupted.",
};

const idleRenders = (): Readonly<Record<ComparisonMode, RenderState>> =>
  Object.freeze({
    reference: Object.freeze({ status: "idle" as const }),
    simulated: Object.freeze({ status: "idle" as const }),
  });

const stoppedPlayback = (): PlaybackState =>
  Object.freeze({
    status: "stopped" as const,
    mode: null,
    supportMode: null,
    interventionState: null,
    speakerPositionState: null,
    resultIdentity: null,
  });

const idleModelState = (): ModelState =>
  Object.freeze({ status: "idle" as const });

export function createInitialExperienceState(): ExperienceState {
  return Object.freeze({
    selectedProfileEntry: "manual" as const,
    manualDraft: createManualAudiogramDraft(),
    draftRevision: 0,
    lastEdit: null,
    confirmedProfile: null,
    comparisonPlan: null,
    supportMode: "none" as const,
    interventionState: "tv-on" as const,
    speakerPositionState: "original-position" as const,
    source: Object.freeze({ status: "idle" as const }),
    renders: idleRenders(),
    lowVolumeAcknowledged: false,
    playback: stoppedPlayback(),
    modelGroundingRevision: 0,
    modelAttemptsUsed: 0,
    modelState: idleModelState(),
    completionState: "in-progress" as const,
    failure: null,
  });
}

function failure(code: ValidatedFailureCode): ValidatedFailure {
  return Object.freeze({
    validated: true as const,
    code,
    message: failureMessages[code],
  });
}

function rejectTransition(
  state: ExperienceState,
  code: "invalid-transition" | "stale-transition",
): ExperienceState {
  return Object.freeze({
    ...state,
    failure: failure(code),
  });
}

function expectedResultIdentity(
  state: ExperienceState,
  mode: ComparisonMode,
): string | null {
  return state.comparisonPlan
    ? resultIdentityForMode(
        state.comparisonPlan,
        mode,
        state.supportMode,
        state.interventionState,
        state.speakerPositionState,
      )
    : null;
}

function invalidatedModelAndCompletionState(state: ExperienceState) {
  return {
    modelGroundingRevision: state.modelGroundingRevision + 1,
    modelState: idleModelState(),
    completionState: "in-progress" as const,
  } as const;
}

export function comparisonResultIdentity(
  state: ExperienceState,
  mode: ExperienceComparisonMode,
): string | null {
  return expectedResultIdentity(state, mode);
}

export function currentTransformedResult(
  state: ExperienceState,
): TransformedResultPlan | null {
  return state.comparisonPlan
    ? resultForSupportMode(
        state.comparisonPlan,
        state.supportMode,
        state.interventionState,
        state.speakerPositionState,
      )
    : null;
}

export function canCompleteExperience(state: ExperienceState): boolean {
  const result = currentTransformedResult(state);
  const modelResult =
    state.modelState.status === "live" || state.modelState.status === "degraded"
      ? state.modelState.result
      : null;

  return (
    state.confirmedProfile !== null &&
    state.source.status === "ready" &&
    result !== null &&
    state.renders.reference.status !== "rendering" &&
    state.renders.simulated.status === "ready" &&
    state.renders.simulated.sourceIdentity === result.sourceIdentity &&
    state.renders.simulated.resultIdentity === result.resultIdentity &&
    state.playback.status === "stopped" &&
    modelResult !== null &&
    modelResult.sourceIdentity === result.sourceIdentity &&
    modelResult.groundingRevision === state.modelGroundingRevision
  );
}

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function profileSummary(
  profile: ConfirmedHearingProfile,
): ModelExplanationRequest["profile"] {
  const left = FREQUENCY_KEYS.map(
    (frequency) => profile.leftThresholdsDbHl[frequency],
  );
  const right = FREQUENCY_KEYS.map(
    (frequency) => profile.rightThresholdsDbHl[frequency],
  );
  const combined = left.map((value, index) => (value + right[index]!) / 2);
  const lowerAverage = average(combined.slice(0, 3));
  const higherAverage = average(combined.slice(3));
  const range = Math.max(...combined) - Math.min(...combined);
  const leftAverage = average(left);
  const rightAverage = average(right);

  return Object.freeze({
    origin: profile.sourceType,
    predefinedProfileId: profile.predefinedProfileId,
    pattern:
      higherAverage - lowerAverage >= 10
        ? ("higher-frequency-emphasis" as const)
        : range <= 15
          ? ("broad-frequency" as const)
          : ("mixed-frequency" as const),
    earBalance:
      leftAverage - rightAverage >= 10
        ? ("left-more-attenuated" as const)
        : rightAverage - leftAverage >= 10
          ? ("right-more-attenuated" as const)
          : ("similar" as const),
  });
}

export function canRequestModelExplanation(state: ExperienceState): boolean {
  const result = currentTransformedResult(state);

  return (
    state.confirmedProfile !== null &&
    state.source.status === "ready" &&
    result !== null &&
    state.renders.simulated.status === "ready" &&
    state.renders.simulated.sourceIdentity === result.sourceIdentity &&
    state.renders.simulated.resultIdentity === result.resultIdentity &&
    state.modelState.status !== "loading" &&
    state.modelAttemptsUsed < MAX_MODEL_ATTEMPTS_PER_SESSION
  );
}

export function createModelExplanationRequest(
  state: ExperienceState,
  runId: string,
  attemptId: string,
  transportResultIdentity: string,
): ModelExplanationRequest | null {
  if (!canRequestModelExplanation(state) || !state.confirmedProfile) {
    return null;
  }

  const result = currentTransformedResult(state);

  if (!result) {
    return null;
  }

  return modelExplanationRequestSchema.parse({
    operation: MODEL_OPERATION,
    runId,
    attemptId,
    attemptNumber: state.modelAttemptsUsed + 1,
    groundingRevision: state.modelGroundingRevision,
    sourceIdentity: result.sourceIdentity,
    resultIdentity: transportResultIdentity,
    profile: profileSummary(state.confirmedProfile),
    supportMode: state.supportMode,
    interventionState: state.interventionState,
    speakerPositionState: state.speakerPositionState,
    transformation: {
      support:
        state.supportMode === "none"
          ? "unsupported"
          : state.supportMode === "left-one-sided"
            ? "left-ear-partial-compensation"
            : "bilateral-partial-compensation",
      television:
        state.interventionState === "tv-on" ? "included" : "removed",
      focusedSpeechPosition: state.speakerPositionState,
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
  });
}

function confirmProfile(
  state: ExperienceState,
  profile: ConfirmedHearingProfile,
  sourceIdentity: string,
): ExperienceState {
  const comparisonPlan = createComparisonPlan(profile, sourceIdentity);

  return Object.freeze({
    ...state,
    confirmedProfile: profile,
    comparisonPlan,
    supportMode: "none" as const,
    interventionState: "tv-on" as const,
    speakerPositionState: "original-position" as const,
    renders: idleRenders(),
    playback: stoppedPlayback(),
    ...invalidatedModelAndCompletionState(state),
    failure: null,
  });
}

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "profile-entry-selected": {
      if (state.selectedProfileEntry === action.entryOption) {
        return Object.freeze({
          ...state,
          failure: null,
        });
      }

      return Object.freeze({
        ...state,
        selectedProfileEntry: action.entryOption,
        confirmedProfile: null,
        comparisonPlan: null,
        supportMode: "none" as const,
        interventionState: "tv-on" as const,
        speakerPositionState: "original-position" as const,
        source:
          state.source.status === "loading"
            ? Object.freeze({ status: "idle" as const })
            : state.source,
        renders: idleRenders(),
        playback: stoppedPlayback(),
        ...invalidatedModelAndCompletionState(state),
        failure: null,
      });
    }

    case "manual-value-changed": {
      if (
        state.selectedProfileEntry !== "manual" ||
        state.playback.status === "playing"
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      const previousValue = state.manualDraft[action.ear][action.frequency];

      return Object.freeze({
        ...state,
        manualDraft: updateManualAudiogramDraft(
          state.manualDraft,
          action.ear,
          action.frequency,
          action.value,
        ),
        draftRevision: state.draftRevision + 1,
        lastEdit: Object.freeze({
          ear: action.ear,
          frequency: action.frequency,
          previousValue,
          nextValue: action.value,
        }),
        confirmedProfile: null,
        comparisonPlan: null,
        supportMode: "none" as const,
        interventionState: "tv-on" as const,
        speakerPositionState: "original-position" as const,
        source:
          state.source.status === "loading"
            ? Object.freeze({ status: "idle" as const })
            : state.source,
        renders: idleRenders(),
        playback: stoppedPlayback(),
        ...invalidatedModelAndCompletionState(state),
        failure: null,
      });
    }

    case "manual-profile-confirmed": {
      if (
        state.selectedProfileEntry !== "manual" ||
        state.playback.status === "playing"
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      try {
        const profile = confirmManualAudiogramDraft(
          state.manualDraft,
          state.draftRevision,
        );

        return confirmProfile(state, profile, action.sourceIdentity);
      } catch (error) {
        if (error instanceof ProfileValidationError) {
          return Object.freeze({
            ...state,
            confirmedProfile: null,
            comparisonPlan: null,
            supportMode: "none" as const,
            interventionState: "tv-on" as const,
            speakerPositionState: "original-position" as const,
            renders: idleRenders(),
            failure: failure("invalid-profile"),
          });
        }

        throw error;
      }
    }

    case "predefined-profile-confirmed": {
      if (
        state.selectedProfileEntry !== action.profileId ||
        state.playback.status === "playing"
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      try {
        const profile = confirmPredefinedProfile(
          action.profileId,
          state.draftRevision,
        );

        return confirmProfile(state, profile, action.sourceIdentity);
      } catch (error) {
        if (error instanceof ProfileValidationError) {
          return Object.freeze({
            ...state,
            confirmedProfile: null,
            comparisonPlan: null,
            supportMode: "none" as const,
            interventionState: "tv-on" as const,
            speakerPositionState: "original-position" as const,
            renders: idleRenders(),
            failure: failure("invalid-profile"),
          });
        }

        throw error;
      }
    }

    case "support-mode-changed": {
      const rendering =
        state.renders.reference.status === "rendering" ||
        state.renders.simulated.status === "rendering";

      if (
        !state.comparisonPlan ||
        state.source.status === "loading" ||
        state.playback.status === "playing" ||
        rendering
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      if (state.supportMode === action.supportMode) {
        return Object.freeze({
          ...state,
          failure: null,
        });
      }

      return Object.freeze({
        ...state,
        supportMode: action.supportMode,
        renders: Object.freeze({
          ...state.renders,
          simulated: Object.freeze({ status: "idle" as const }),
        }),
        playback: stoppedPlayback(),
        ...invalidatedModelAndCompletionState(state),
        failure: null,
      });
    }

    case "intervention-state-changed": {
      const rendering =
        state.renders.reference.status === "rendering" ||
        state.renders.simulated.status === "rendering";

      if (
        !state.comparisonPlan ||
        state.source.status !== "ready" ||
        state.playback.status === "playing" ||
        rendering
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      if (state.interventionState === action.interventionState) {
        return Object.freeze({
          ...state,
          failure: null,
        });
      }

      return Object.freeze({
        ...state,
        interventionState: action.interventionState,
        renders: idleRenders(),
        playback: stoppedPlayback(),
        ...invalidatedModelAndCompletionState(state),
        failure: null,
      });
    }

    case "speaker-position-changed": {
      const rendering =
        state.renders.reference.status === "rendering" ||
        state.renders.simulated.status === "rendering";

      if (
        !state.comparisonPlan ||
        state.source.status !== "ready" ||
        state.playback.status === "playing" ||
        rendering
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      if (state.speakerPositionState === action.speakerPositionState) {
        return Object.freeze({
          ...state,
          failure: null,
        });
      }

      return Object.freeze({
        ...state,
        speakerPositionState: action.speakerPositionState,
        renders: idleRenders(),
        playback: stoppedPlayback(),
        ...invalidatedModelAndCompletionState(state),
        failure: null,
      });
    }

    case "low-volume-acknowledgement-changed": {
      const rendering =
        state.renders.reference.status === "rendering" ||
        state.renders.simulated.status === "rendering";

      if ((state.playback.status === "playing" || rendering) && !action.acknowledged) {
        return rejectTransition(state, "invalid-transition");
      }

      return Object.freeze({
        ...state,
        lowVolumeAcknowledged: action.acknowledged,
        failure: null,
      });
    }

    case "source-load-started": {
      if (!state.comparisonPlan || state.playback.status === "playing") {
        return rejectTransition(state, "invalid-transition");
      }

      return Object.freeze({
        ...state,
        source: Object.freeze({ status: "loading" as const }),
        renders: idleRenders(),
        ...invalidatedModelAndCompletionState(state),
        failure: null,
      });
    }

    case "source-ready": {
      if (
        !state.comparisonPlan ||
        state.source.status !== "loading" ||
        action.sourceIdentity !== state.comparisonPlan.sourceIdentity
      ) {
        return rejectTransition(state, "stale-transition");
      }

      return Object.freeze({
        ...state,
        source: Object.freeze({
          status: "ready" as const,
          sourceIdentity: action.sourceIdentity,
          sampleRate: action.sampleRate,
          frameCount: action.frameCount,
          durationSeconds: action.durationSeconds,
        }),
        renders: idleRenders(),
        failure: null,
      });
    }

    case "render-started": {
      if (
        !state.comparisonPlan ||
        state.source.status !== "ready" ||
        state.source.sourceIdentity !== state.comparisonPlan.sourceIdentity ||
        !state.lowVolumeAcknowledged ||
        state.playback.status === "playing"
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      return Object.freeze({
        ...state,
        renders: Object.freeze({
          ...state.renders,
          [action.mode]: Object.freeze({ status: "rendering" as const }),
        }),
        completionState: "in-progress" as const,
        failure: null,
      });
    }

    case "playback-started": {
      const expectedIdentity = expectedResultIdentity(state, action.mode);
      const expectedSupportMode =
        action.mode === "reference" ? null : state.supportMode;

      if (
        !state.lowVolumeAcknowledged ||
        state.source.status !== "ready" ||
        state.source.sourceIdentity !== action.sourceIdentity ||
        state.comparisonPlan?.sourceIdentity !== action.sourceIdentity ||
        expectedIdentity === null ||
        expectedIdentity !== action.resultIdentity ||
        action.supportMode !== expectedSupportMode ||
        action.interventionState !== state.interventionState ||
        action.speakerPositionState !== state.speakerPositionState ||
        state.renders[action.mode].status !== "rendering"
      ) {
        return rejectTransition(state, "stale-transition");
      }

      return Object.freeze({
        ...state,
        renders: Object.freeze({
          ...state.renders,
          [action.mode]: Object.freeze({
            status: "ready" as const,
            sourceIdentity: action.sourceIdentity,
            resultIdentity: action.resultIdentity,
            peakDbFs: action.peakDbFs,
          }),
        }),
        playback: Object.freeze({
          status: "playing" as const,
          mode: action.mode,
          supportMode: expectedSupportMode,
          interventionState: state.interventionState,
          speakerPositionState: state.speakerPositionState,
          resultIdentity: action.resultIdentity,
        }),
        completionState: "in-progress" as const,
        failure: null,
      });
    }

    case "playback-stopped": {
      const resetInterruptedRender = (render: RenderState): RenderState =>
        render.status === "rendering"
          ? Object.freeze({ status: "idle" as const })
          : render;

      return Object.freeze({
        ...state,
        renders: Object.freeze({
          reference: resetInterruptedRender(state.renders.reference),
          simulated: resetInterruptedRender(state.renders.simulated),
        }),
        playback: stoppedPlayback(),
        failure: null,
      });
    }

    case "playback-ended": {
      if (
        state.playback.status !== "playing" ||
        state.playback.resultIdentity !== action.resultIdentity
      ) {
        return state;
      }

      return Object.freeze({
        ...state,
        playback: stoppedPlayback(),
      });
    }

    case "model-request-started": {
      const currentResult = currentTransformedResult(state);
      const request = action.request;

      if (
        !canRequestModelExplanation(state) ||
        !currentResult ||
        request.operation !== MODEL_OPERATION ||
        request.attemptNumber !== state.modelAttemptsUsed + 1 ||
        request.groundingRevision !== state.modelGroundingRevision ||
        request.sourceIdentity !== currentResult.sourceIdentity ||
        request.supportMode !== state.supportMode ||
        request.interventionState !== state.interventionState ||
        request.speakerPositionState !== state.speakerPositionState
      ) {
        return rejectTransition(state, "stale-transition");
      }

      return Object.freeze({
        ...state,
        modelAttemptsUsed: state.modelAttemptsUsed + 1,
        modelState: Object.freeze({
          status: "loading" as const,
          request,
          canonicalResultIdentity: currentResult.resultIdentity,
        }),
        completionState: "in-progress" as const,
        failure: null,
      });
    }

    case "model-result-received": {
      if (state.modelState.status !== "loading") {
        return state;
      }

      const pending = state.modelState.request;
      const pendingCanonicalResultIdentity =
        state.modelState.canonicalResultIdentity;
      const currentResult = currentTransformedResult(state);
      const result = action.result;

      if (
        !currentResult ||
        result.operation !== MODEL_OPERATION ||
        result.runId !== pending.runId ||
        result.attemptId !== pending.attemptId ||
        result.attemptNumber !== pending.attemptNumber ||
        result.groundingRevision !== pending.groundingRevision ||
        result.groundingRevision !== state.modelGroundingRevision ||
        result.sourceIdentity !== pending.sourceIdentity ||
        result.sourceIdentity !== currentResult.sourceIdentity ||
        result.resultIdentity !== pending.resultIdentity ||
        pendingCanonicalResultIdentity !== currentResult.resultIdentity
      ) {
        return Object.freeze({
          ...state,
          modelState: idleModelState(),
        });
      }

      return Object.freeze({
        ...state,
        modelState:
          result.status === "live"
            ? Object.freeze({ status: "live" as const, result })
            : Object.freeze({ status: "degraded" as const, result }),
        failure: null,
      });
    }

    case "experience-completed": {
      if (
        !canCompleteExperience(state) ||
        (state.modelState.status !== "live" &&
          state.modelState.status !== "degraded")
      ) {
        return rejectTransition(state, "invalid-transition");
      }

      return Object.freeze({
        ...state,
        completionState:
          state.modelState.status === "live"
            ? ("complete-live" as const)
            : ("complete-degraded" as const),
        failure: null,
      });
    }

    case "comparison-reset": {
      if (state.completionState === "in-progress") {
        return rejectTransition(state, "invalid-transition");
      }

      return Object.freeze({
        ...createInitialExperienceState(),
        modelGroundingRevision: state.modelGroundingRevision + 1,
        modelAttemptsUsed: state.modelAttemptsUsed,
      });
    }

    case "operation-failed": {
      return Object.freeze({
        ...state,
        source:
          action.code === "source-load-failed"
            ? Object.freeze({ status: "failed" as const })
            : state.source,
        renders: action.mode
          ? Object.freeze({
              ...state.renders,
              [action.mode]: Object.freeze({ status: "failed" as const }),
            })
          : state.renders,
        playback: Object.freeze({
          status: "failed" as const,
          mode: null,
          supportMode: null,
          interventionState: null,
          speakerPositionState: null,
          resultIdentity: null,
        }),
        completionState: "in-progress" as const,
        failure: failure(action.code),
      });
    }
  }
}

export type VisibleExperienceState = Readonly<{
  profile: string;
  source: string;
  support: string;
  intervention: string;
  interventionSummary: string;
  speakerPosition: string;
  speakerPositionSummary: string;
  reference: string;
  simulated: string;
  playback: string;
  model: string;
  lastEdit: string | null;
  failure: string | null;
}>;

export type TerminalCompletionProjection = Readonly<{
  status: "complete-live" | "complete-degraded";
  profile: string;
  profileOrigin: "Manual" | "Synthetic predefined";
  support: string;
  television: string;
  speakerPosition: string;
  resultIdentity: string;
  explanationStatus: "Live GPT" | "Degraded";
  explanationAvailability: string;
  limitation: string;
  nextAction: string;
}>;

export const ATTRIBUTABLE_EVIDENCE_SCHEMA_VERSION =
  "auralis-evidence-v1" as const;

export type AttributableEvidenceProjection = Readonly<{
  schemaVersion: typeof ATTRIBUTABLE_EVIDENCE_SCHEMA_VERSION;
  sourceIdentity: string;
  resultIdentity: string;
  profile: Readonly<{
    label: string;
    origin: "manual" | "predefined";
    predefinedProfileId: PredefinedProfileId | null;
  }>;
  supportMode: SupportMode;
  televisionState: InterventionState;
  speakerPositionState: SpeakerPositionState;
  completionStatus: "complete-live" | "complete-degraded";
  explanation: Readonly<
    | {
        status: "live";
        model: typeof MODEL_ID;
      }
    | {
        status: "degraded";
        model: null;
      }
  >;
  limitation: string;
  generatedAt: string;
}>;

const supportLabels: Record<SupportMode, string> = {
  none: "No support",
  "left-one-sided": "Left-ear support",
  bilateral: "Bilateral support",
};

const interventionLabels: Record<InterventionState, string> = {
  "tv-on": "TV on",
  "tv-off": "TV off",
};

const interventionSummaries: Record<InterventionState, string> = {
  "tv-on": "The television remains part of the competing family scene.",
  "tv-off":
    "The television contribution has been removed; focused speech, overlapping speech, and room events remain unchanged.",
};

const speakerPositionLabels: Record<SpeakerPositionState, string> = {
  "original-position": "Original position",
  "closer-in-front": "Closer, in front",
};

const speakerPositionSummaries: Record<SpeakerPositionState, string> = {
  "original-position":
    "The important speaker remains at the manifest position: 12° left and 1.2 m away.",
  "closer-in-front":
    "Only the important speaker moves to the front at 0.8 m with bounded 2.5 dB focused-speech gain; competing scene content remains unchanged.",
};

function terminalResultIdentity(resultIdentity: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;

  for (let index = 0; index < resultIdentity.length; index += 1) {
    const code = resultIdentity.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ code, 0x85ebca6b);
    second ^= second >>> 13;
  }

  return `auralis-result-v1-${(first >>> 0).toString(16).padStart(8, "0")}${(
    second >>> 0
  )
    .toString(16)
    .padStart(8, "0")}`;
}

export function projectTerminalCompletion(
  state: ExperienceState,
): TerminalCompletionProjection | null {
  const result = currentTransformedResult(state);
  const profile = state.confirmedProfile;
  const completionMatchesModel =
    (state.completionState === "complete-live" &&
      state.modelState.status === "live") ||
    (state.completionState === "complete-degraded" &&
      state.modelState.status === "degraded");

  if (
    !result ||
    !profile ||
    !canCompleteExperience(state) ||
    !completionMatchesModel
  ) {
    return null;
  }

  const isLive = state.modelState.status === "live";

  return Object.freeze({
    status: isLive ? ("complete-live" as const) : ("complete-degraded" as const),
    profile:
      profile.sourceType === "manual"
        ? "Manual audiogram"
        : profile.displayName,
    profileOrigin:
      profile.sourceType === "manual"
        ? ("Manual" as const)
        : ("Synthetic predefined" as const),
    support: supportLabels[state.supportMode],
    television: interventionLabels[state.interventionState],
    speakerPosition: speakerPositionLabels[state.speakerPositionState],
    resultIdentity: terminalResultIdentity(result.resultIdentity),
    explanationStatus: isLive ? ("Live GPT" as const) : ("Degraded" as const),
    explanationAvailability: isLive
      ? "A fresh grounded explanation is available for this result."
      : "Live explanation is unavailable; the deterministic comparison remains available.",
    limitation:
      "This experience is illustrative; it is not a diagnosis, prescription, hearing-aid fitting, or prediction of individual perception.",
    nextAction:
      "Use this comparison to discuss communication conditions with the people around you.",
  });
}

export function projectAttributableEvidence(
  state: ExperienceState,
  generatedAt: string,
): AttributableEvidenceProjection | null {
  const terminal = projectTerminalCompletion(state);
  const result = currentTransformedResult(state);
  const profile = state.confirmedProfile;
  const generatedTime = Date.parse(generatedAt);

  if (
    !terminal ||
    !result ||
    !profile ||
    !Number.isFinite(generatedTime) ||
    new Date(generatedTime).toISOString() !== generatedAt ||
    (state.modelState.status !== "live" &&
      state.modelState.status !== "degraded")
  ) {
    return null;
  }

  return Object.freeze({
    schemaVersion: ATTRIBUTABLE_EVIDENCE_SCHEMA_VERSION,
    sourceIdentity: result.sourceIdentity,
    resultIdentity: terminal.resultIdentity,
    profile: Object.freeze({
      label: terminal.profile,
      origin: profile.sourceType,
      predefinedProfileId: profile.predefinedProfileId,
    }),
    supportMode: state.supportMode,
    televisionState: state.interventionState,
    speakerPositionState: state.speakerPositionState,
    completionStatus: terminal.status,
    explanation:
      state.modelState.status === "live"
        ? Object.freeze({
            status: "live" as const,
            model: MODEL_ID,
          })
        : Object.freeze({
            status: "degraded" as const,
            model: null,
          }),
    limitation: terminal.limitation,
    generatedAt,
  });
}

function renderLabel(
  mode: ComparisonMode,
  supportMode: SupportMode,
  interventionState: InterventionState,
  speakerPositionState: SpeakerPositionState,
  render: RenderState,
): string {
  const name =
    mode === "reference" ? "Reference" : supportLabels[supportMode];
  const intervention = interventionLabels[interventionState];
  const speakerPosition = speakerPositionLabels[speakerPositionState];

  switch (render.status) {
    case "idle":
      return `${name}, ${intervention}, ${speakerPosition}: not rendered.`;
    case "rendering":
      return `${name}, ${intervention}, ${speakerPosition}: validating and rendering.`;
    case "ready":
      return `${name}, ${intervention}, ${speakerPosition}: validated at ${render.peakDbFs.toFixed(1)} dBFS peak.`;
    case "failed":
      return `${name}, ${intervention}, ${speakerPosition}: rejected.`;
  }
}

export function projectVisibleExperienceState(
  state: ExperienceState,
): VisibleExperienceState {
  const selectedEntryName =
    state.selectedProfileEntry === "manual"
      ? MANUAL_PROFILE_ENTRY_LABEL
      : predefinedProfileById(state.selectedProfileEntry).displayName;
  const profile = state.confirmedProfile
    ? state.confirmedProfile.sourceType === "manual"
      ? `Manual audiogram confirmed from revision ${state.confirmedProfile.revision}.`
      : `${state.confirmedProfile.displayName} confirmed as a synthetic illustrative profile.`
    : `${selectedEntryName}: confirmation required.`;

  let source: string;
  switch (state.source.status) {
    case "idle":
      source = "Family scene: not loaded.";
      break;
    case "loading":
      source = "Family scene: loading and validating.";
      break;
    case "ready":
      source = `Family scene: ready, ${state.source.durationSeconds.toFixed(1)} s at ${state.source.sampleRate} Hz.`;
      break;
    case "failed":
      source = "Family scene: unavailable.";
      break;
  }

  const playback =
    state.playback.status === "playing"
      ? state.playback.mode === "reference"
        ? `Playback: reference, ${interventionLabels[state.playback.interventionState]}, ${speakerPositionLabels[state.playback.speakerPositionState]}.`
        : `Playback: ${supportLabels[state.playback.supportMode ?? "none"]}, ${interventionLabels[state.playback.interventionState]}, ${speakerPositionLabels[state.playback.speakerPositionState]}.`
      : state.playback.status === "failed"
        ? "Playback: blocked."
        : "Playback: stopped.";

  const lastEdit = state.selectedProfileEntry === "manual" && state.lastEdit
    ? `Last edit: ${state.lastEdit.ear} ear at ${state.lastEdit.frequency} Hz, ${state.lastEdit.previousValue || "missing"} → ${state.lastEdit.nextValue || "missing"} dB HL.`
    : null;

  const model =
    state.modelState.status === "loading"
      ? "Live GPT explanation: generating for the current result."
      : state.modelState.status === "live"
        ? "Live GPT explanation: current and grounded."
        : state.modelState.status === "degraded"
          ? "Live GPT explanation: degraded; deterministic audio remains available."
          : "Live GPT explanation: not requested.";

  return Object.freeze({
    profile,
    source,
    support: `Support state: ${supportLabels[state.supportMode]}.`,
    intervention: `Environmental intervention: ${interventionLabels[state.interventionState]}.`,
    interventionSummary: interventionSummaries[state.interventionState],
    speakerPosition: `Speaker position: ${speakerPositionLabels[state.speakerPositionState]}.`,
    speakerPositionSummary:
      speakerPositionSummaries[state.speakerPositionState],
    reference: renderLabel(
      "reference",
      state.supportMode,
      state.interventionState,
      state.speakerPositionState,
      state.renders.reference,
    ),
    simulated: renderLabel(
      "simulated",
      state.supportMode,
      state.interventionState,
      state.speakerPositionState,
      state.renders.simulated,
    ),
    playback,
    model,
    lastEdit,
    failure: state.failure?.message ?? null,
  });
}
