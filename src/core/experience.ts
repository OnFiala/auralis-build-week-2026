import {
  ProfileValidationError,
  confirmManualAudiogramDraft,
  createManualAudiogramDraft,
  updateManualAudiogramDraft,
  type ConfirmedHearingProfile,
  type Ear,
  type FrequencyKey,
  type ManualAudiogramDraft,
} from "./profile";
import {
  createComparisonPlan,
  resultIdentityForMode,
  type ComparisonMode,
  type ComparisonPlan,
} from "./transformation";

export type ExperienceComparisonMode = ComparisonMode;

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
  | Readonly<{ status: "stopped"; mode: null; resultIdentity: null }>
  | Readonly<{
      status: "playing";
      mode: ComparisonMode;
      resultIdentity: string;
    }>
  | Readonly<{ status: "failed"; mode: null; resultIdentity: null }>;

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
  source: SourceState;
  renders: Readonly<Record<ComparisonMode, RenderState>>;
  lowVolumeAcknowledged: boolean;
  playback: PlaybackState;
  failure: ValidatedFailure | null;
}>;

export type ExperienceAction =
  | Readonly<{
      type: "manual-value-changed";
      ear: Ear;
      frequency: FrequencyKey;
      value: string;
    }>
  | Readonly<{ type: "manual-profile-confirmed"; sourceIdentity: string }>
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
      sourceIdentity: string;
      resultIdentity: string;
      peakDbFs: number;
    }>
  | Readonly<{ type: "playback-stopped" }>
  | Readonly<{ type: "playback-ended"; resultIdentity: string }>
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
    resultIdentity: null,
  });

export function createInitialExperienceState(): ExperienceState {
  return Object.freeze({
    manualDraft: createManualAudiogramDraft(),
    draftRevision: 0,
    lastEdit: null,
    confirmedProfile: null,
    comparisonPlan: null,
    source: Object.freeze({ status: "idle" as const }),
    renders: idleRenders(),
    lowVolumeAcknowledged: false,
    playback: stoppedPlayback(),
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
    ? resultIdentityForMode(state.comparisonPlan, mode)
    : null;
}

export function comparisonResultIdentity(
  state: ExperienceState,
  mode: ExperienceComparisonMode,
): string | null {
  return expectedResultIdentity(state, mode);
}

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "manual-value-changed": {
      if (state.playback.status === "playing") {
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
        source:
          state.source.status === "loading"
            ? Object.freeze({ status: "idle" as const })
            : state.source,
        renders: idleRenders(),
        playback: stoppedPlayback(),
        failure: null,
      });
    }

    case "manual-profile-confirmed": {
      if (state.playback.status === "playing") {
        return rejectTransition(state, "invalid-transition");
      }

      try {
        const profile = confirmManualAudiogramDraft(
          state.manualDraft,
          state.draftRevision,
        );
        const comparisonPlan = createComparisonPlan(profile, action.sourceIdentity);

        return Object.freeze({
          ...state,
          confirmedProfile: profile,
          comparisonPlan,
          renders: idleRenders(),
          playback: stoppedPlayback(),
          failure: null,
        });
      } catch (error) {
        if (error instanceof ProfileValidationError) {
          return Object.freeze({
            ...state,
            confirmedProfile: null,
            comparisonPlan: null,
            renders: idleRenders(),
            failure: failure("invalid-profile"),
          });
        }

        throw error;
      }
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
        failure: null,
      });
    }

    case "playback-started": {
      const expectedIdentity = expectedResultIdentity(state, action.mode);

      if (
        !state.lowVolumeAcknowledged ||
        state.source.status !== "ready" ||
        state.source.sourceIdentity !== action.sourceIdentity ||
        state.comparisonPlan?.sourceIdentity !== action.sourceIdentity ||
        expectedIdentity === null ||
        expectedIdentity !== action.resultIdentity ||
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
          resultIdentity: action.resultIdentity,
        }),
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
          resultIdentity: null,
        }),
        failure: failure(action.code),
      });
    }
  }
}

export type VisibleExperienceState = Readonly<{
  profile: string;
  source: string;
  reference: string;
  simulated: string;
  playback: string;
  lastEdit: string | null;
  failure: string | null;
}>;

function renderLabel(mode: ComparisonMode, render: RenderState): string {
  const name = mode === "reference" ? "Reference" : "Simulated";

  switch (render.status) {
    case "idle":
      return `${name}: not rendered.`;
    case "rendering":
      return `${name}: validating and rendering.`;
    case "ready":
      return `${name}: validated at ${render.peakDbFs.toFixed(1)} dBFS peak.`;
    case "failed":
      return `${name}: rejected.`;
  }
}

export function projectVisibleExperienceState(
  state: ExperienceState,
): VisibleExperienceState {
  const profile = state.confirmedProfile
    ? `Manual profile confirmed from revision ${state.confirmedProfile.revision}.`
    : "Manual profile is not confirmed.";

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
      ? `Playback: ${state.playback.mode}.`
      : state.playback.status === "failed"
        ? "Playback: blocked."
        : "Playback: stopped.";

  const lastEdit = state.lastEdit
    ? `Last edit: ${state.lastEdit.ear} ear at ${state.lastEdit.frequency} Hz, ${state.lastEdit.previousValue || "missing"} → ${state.lastEdit.nextValue || "missing"} dB HL.`
    : null;

  return Object.freeze({
    profile,
    source,
    reference: renderLabel("reference", state.renders.reference),
    simulated: renderLabel("simulated", state.renders.simulated),
    playback,
    lastEdit,
    failure: state.failure?.message ?? null,
  });
}
