"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { flushSync } from "react-dom";

import {
  AudioPlaybackCancelledError,
  BrowserAudioEngine,
  FAMILY_DINNER_SOURCE_ID,
  type SceneTranscriptEntry,
} from "../browser/audio";
import { downloadAttributableEvidence } from "../browser/evidence";
import { requestLiveExplanation } from "../browser/model-client";
import { MAX_MODEL_ATTEMPTS_PER_SESSION } from "../contracts/runtime";
import {
  canCompleteExperience,
  canRequestModelExplanation,
  comparisonResultIdentity,
  createInitialExperienceState,
  createModelExplanationRequest,
  currentTransformedResult,
  experienceReducer,
  projectAttributableEvidence,
  projectTerminalCompletion,
  projectVisibleExperienceState,
  type ExperienceComparisonMode,
  type ExperienceInterventionState,
  type ExperienceSpeakerPositionState,
  type ExperienceSupportMode,
} from "../core/experience";
import {
  FREQUENCY_GRID_HZ,
  MANUAL_THRESHOLD_MAX_DB_HL,
  MANUAL_THRESHOLD_MIN_DB_HL,
  MANUAL_PROFILE_ENTRY_LABEL,
  PREDEFINED_HEARING_PROFILES,
  frequencyKey,
  predefinedProfileById,
  type Ear,
  type EarThresholdDraft,
  type EarThresholds,
  type FrequencyKey,
  type ProfileEntryOption,
} from "../core/profile";

type ActiveScreen =
  | "welcome"
  | "profile"
  | "scene"
  | "listening"
  | "interventions"
  | "explanation"
  | "completion";

type ExperienceScreen = Exclude<ActiveScreen, "welcome">;

const experienceScreenOrder: readonly ExperienceScreen[] = [
  "profile",
  "scene",
  "listening",
  "interventions",
  "explanation",
  "completion",
];

const screenLabels: Record<ExperienceScreen, string> = {
  profile: "Profile",
  scene: "Scene",
  listening: "Listening",
  interventions: "Interventions",
  explanation: "Explanation",
  completion: "Completion",
};

const nextScreen: Record<Exclude<ActiveScreen, "completion">, ExperienceScreen> = {
  welcome: "profile",
  profile: "scene",
  scene: "listening",
  listening: "interventions",
  interventions: "explanation",
  explanation: "completion",
};

const previousScreen: Record<ExperienceScreen, ActiveScreen> = {
  profile: "welcome",
  scene: "profile",
  listening: "scene",
  interventions: "listening",
  explanation: "interventions",
  completion: "explanation",
};

const supportLabels: Record<ExperienceSupportMode, string> = {
  none: "No support",
  "left-one-sided": "Left-ear support",
  bilateral: "Bilateral support",
};

const interventionLabels: Record<ExperienceInterventionState, string> = {
  "tv-on": "TV on",
  "tv-off": "TV off",
};

const speakerPositionLabels: Record<
  ExperienceSpeakerPositionState,
  string
> = {
  "original-position": "Original position",
  "closer-in-front": "Closer, in front",
};

function formatTranscriptTime(startSeconds: number): string {
  const minutes = Math.floor(startSeconds / 60);
  const seconds = (startSeconds - minutes * 60)
    .toFixed(2)
    .replace(/\.?0+$/, "")
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

const AUDIOGRAM_GRID_DB_HL = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
] as const;
const AUDIOGRAM_VIEWBOX_WIDTH = 680;
const AUDIOGRAM_VIEWBOX_HEIGHT = 440;
const AUDIOGRAM_PLOT_LEFT = 98;
const AUDIOGRAM_PLOT_RIGHT = 640;
const AUDIOGRAM_PLOT_TOP = 42;
const AUDIOGRAM_PLOT_BOTTOM = 360;

type AudiogramThresholds = EarThresholds | EarThresholdDraft;

function audiogramX(index: number): number {
  return (
    AUDIOGRAM_PLOT_LEFT +
    (index * (AUDIOGRAM_PLOT_RIGHT - AUDIOGRAM_PLOT_LEFT)) /
      (FREQUENCY_GRID_HZ.length - 1)
  );
}

function audiogramY(value: number): number {
  return (
    AUDIOGRAM_PLOT_TOP +
    ((value - MANUAL_THRESHOLD_MIN_DB_HL) /
      (MANUAL_THRESHOLD_MAX_DB_HL - MANUAL_THRESHOLD_MIN_DB_HL)) *
      (AUDIOGRAM_PLOT_BOTTOM - AUDIOGRAM_PLOT_TOP)
  );
}

function numericAudiogramValue(value: string | number): number | null {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numericValue) &&
    numericValue >= MANUAL_THRESHOLD_MIN_DB_HL &&
    numericValue <= MANUAL_THRESHOLD_MAX_DB_HL
    ? numericValue
    : null;
}

function describeThresholds(thresholds: AudiogramThresholds): string {
  return FREQUENCY_GRID_HZ.map((frequency) => {
    const value = thresholds[frequencyKey(frequency)];
    const displayedValue =
      typeof value === "string" && value.trim() === ""
        ? "not entered"
        : `${value} dB HL`;

    return `${frequency} Hz: ${displayedValue}`;
  }).join("; ");
}

function Audiogram({
  profileLabel,
  rightThresholds,
  leftThresholds,
}: Readonly<{
  profileLabel: string;
  rightThresholds: AudiogramThresholds;
  leftThresholds: AudiogramThresholds;
}>) {
  const series = [
    {
      ear: "right",
      thresholds: rightThresholds,
    },
    {
      ear: "left",
      thresholds: leftThresholds,
    },
  ] as const;
  const plottedSeries = series.map((earSeries) => ({
    ...earSeries,
    points: FREQUENCY_GRID_HZ.map((frequency, index) => {
      const value = numericAudiogramValue(
        earSeries.thresholds[frequencyKey(frequency)],
      );

      return {
        frequency,
        value,
        x: audiogramX(index),
        y: value === null ? null : audiogramY(value),
      };
    }),
  }));
  const hasUnplottedValues = plottedSeries.some((earSeries) =>
    earSeries.points.some((point) => point.y === null),
  );
  const accessibleDescription = `${profileLabel}. Right ear exact values: ${describeThresholds(
    rightThresholds,
  )}. Left ear exact values: ${describeThresholds(leftThresholds)}.`;

  return (
    <figure className="audiogram-figure">
      <div className="audiogram-heading-row">
        <div>
          <p className="audiogram-kicker">Exact bilateral view</p>
          <h3>Audiogram</h3>
        </div>
        <ul className="audiogram-legend" aria-label="Audiogram ear legend">
          <li>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <line
                className="audiogram-legend-line audiogram-right-line"
                x1="1"
                y1="10"
                x2="19"
                y2="10"
              />
              <circle
                className="audiogram-right-marker"
                cx="10"
                cy="10"
                r="4"
              />
            </svg>
            <span>Right ear · circles · solid</span>
          </li>
          <li>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <line
                className="audiogram-legend-line audiogram-left-line"
                x1="1"
                y1="10"
                x2="19"
                y2="10"
              />
              <path
                className="audiogram-left-marker"
                d="M6 6 L14 14 M14 6 L6 14"
              />
            </svg>
            <span>Left ear · crosses · dashed</span>
          </li>
        </ul>
      </div>

      <svg
        className="audiogram-chart"
        viewBox={`0 0 ${AUDIOGRAM_VIEWBOX_WIDTH} ${AUDIOGRAM_VIEWBOX_HEIGHT}`}
        role="img"
        aria-labelledby="audiogram-chart-title"
        aria-describedby="audiogram-chart-description"
      >
        <title id="audiogram-chart-title">
          Bilateral audiogram for {profileLabel}
        </title>
        <desc id="audiogram-chart-description">{accessibleDescription}</desc>

        <g aria-hidden="true">
          <text className="audiogram-axis-title" x="18" y="24">
            Hearing level (dB HL)
          </text>
          {AUDIOGRAM_GRID_DB_HL.map((level) => {
            const y = audiogramY(level);

            return (
              <g key={level}>
                <line
                  className="audiogram-grid-line"
                  x1={AUDIOGRAM_PLOT_LEFT}
                  y1={y}
                  x2={AUDIOGRAM_PLOT_RIGHT}
                  y2={y}
                />
                {level % 20 === 0 ? (
                  <text
                    className="audiogram-axis-label"
                    x={AUDIOGRAM_PLOT_LEFT - 18}
                    y={y + 6}
                    textAnchor="end"
                  >
                    {level}
                  </text>
                ) : null}
              </g>
            );
          })}

          {FREQUENCY_GRID_HZ.map((frequency, index) => {
            const x = audiogramX(index);

            return (
              <g key={frequency}>
                <line
                  className="audiogram-grid-line audiogram-grid-line-vertical"
                  x1={x}
                  y1={AUDIOGRAM_PLOT_TOP}
                  x2={x}
                  y2={AUDIOGRAM_PLOT_BOTTOM}
                />
                <text
                  className="audiogram-axis-label"
                  x={x}
                  y={AUDIOGRAM_PLOT_BOTTOM + 31}
                  textAnchor="middle"
                >
                  {frequency}
                </text>
              </g>
            );
          })}
          <text
            className="audiogram-axis-title"
            x={(AUDIOGRAM_PLOT_LEFT + AUDIOGRAM_PLOT_RIGHT) / 2}
            y={AUDIOGRAM_VIEWBOX_HEIGHT - 12}
            textAnchor="middle"
          >
            Frequency (Hz)
          </text>

          {plottedSeries.map((earSeries) =>
            earSeries.points.slice(0, -1).map((point, index) => {
              const nextPoint = earSeries.points[index + 1];

              return point.y !== null && nextPoint.y !== null ? (
                <line
                  key={`${earSeries.ear}-${point.frequency}-${nextPoint.frequency}`}
                  className={`audiogram-series-line audiogram-${earSeries.ear}-line`}
                  x1={point.x}
                  y1={point.y}
                  x2={nextPoint.x}
                  y2={nextPoint.y}
                />
              ) : null;
            }),
          )}

          {plottedSeries.map((earSeries) =>
            earSeries.points.map((point) =>
              point.y === null ? null : earSeries.ear === "right" ? (
                <circle
                  key={`${earSeries.ear}-${point.frequency}`}
                  className="audiogram-right-marker"
                  cx={point.x}
                  cy={point.y}
                  r="7"
                />
              ) : (
                <path
                  key={`${earSeries.ear}-${point.frequency}`}
                  className="audiogram-left-marker"
                  d={`M${point.x - 7} ${point.y - 7} L${point.x + 7} ${
                    point.y + 7
                  } M${point.x + 7} ${point.y - 7} L${point.x - 7} ${
                    point.y + 7
                  }`}
                />
              ),
            ),
          )}
        </g>
      </svg>

      <figcaption>
        Six exact octave-frequency points per ear. Lower dB HL values appear at
        the top; higher values appear at the bottom. Lines only connect adjacent
        entered points.
      </figcaption>
      {hasUnplottedValues ? (
        <p className="audiogram-plot-note">
          Missing, non-finite, or out-of-range values are not plotted or
          approximated; the exact entry remains in the editor below.
        </p>
      ) : null}
    </figure>
  );
}

export default function HomePage() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("welcome");
  const [sceneTranscript, setSceneTranscript] = useState<
    readonly SceneTranscriptEntry[]
  >([]);
  const [experience, dispatch] = useReducer(
    experienceReducer,
    createInitialExperienceState(),
  );
  const audioEngineRef = useRef<BrowserAudioEngine | null>(null);
  const screenHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const previousActiveScreenRef = useRef<ActiveScreen>("welcome");
  const runIdRef = useRef<string | null>(null);
  const modelRequestInFlightRef = useRef(false);
  const visible = projectVisibleExperienceState(experience);
  const terminalCompletion = projectTerminalCompletion(experience);
  const completionEligible = canCompleteExperience(experience);
  const selectedTransformation = currentTransformedResult(experience);
  const isRendering =
    experience.renders.reference.status === "rendering" ||
    experience.renders.simulated.status === "rendering";
  const isPlaying = experience.playback.status === "playing";
  const transportStatus = isRendering
    ? "Preparing audio for playback…"
    : visible.playback;
  const controlsLocked =
    isRendering || isPlaying || experience.source.status === "loading";
  const selectedPredefinedProfile =
    experience.selectedProfileEntry === "manual"
      ? null
      : predefinedProfileById(experience.selectedProfileEntry);
  const referenceIdentity = comparisonResultIdentity(experience, "reference");
  const simulatedIdentity = comparisonResultIdentity(experience, "simulated");
  const referenceReady =
    referenceIdentity !== null &&
    experience.renders.reference.status === "ready" &&
    experience.renders.reference.sourceIdentity === FAMILY_DINNER_SOURCE_ID &&
    experience.renders.reference.resultIdentity === referenceIdentity;
  const simulatedReady =
    simulatedIdentity !== null &&
    experience.renders.simulated.status === "ready" &&
    experience.renders.simulated.sourceIdentity === FAMILY_DINNER_SOURCE_ID &&
    experience.renders.simulated.resultIdentity === simulatedIdentity;
  const sceneReady =
    experience.confirmedProfile !== null &&
    experience.source.status === "ready" &&
    experience.lowVolumeAcknowledged;
  const listeningComparisonReady = referenceReady && simulatedReady;
  const explanationReady = simulatedReady;

  useEffect(
    () => () => {
      void audioEngineRef.current?.dispose();
    },
    [],
  );

  useEffect(() => {
    if (previousActiveScreenRef.current === activeScreen) {
      return;
    }

    screenHeadingRef.current
      ?.closest("section")
      ?.scrollIntoView({ block: "start" });
    screenHeadingRef.current?.focus({ preventScroll: true });
    previousActiveScreenRef.current = activeScreen;
  }, [activeScreen]);

  useEffect(() => {
    if (activeScreen === "welcome") {
      return;
    }

    let furthestValidScreen: ExperienceScreen = "profile";

    if (experience.confirmedProfile) {
      furthestValidScreen = "scene";
    }

    if (sceneReady) {
      furthestValidScreen = "interventions";
    }

    if (sceneReady && explanationReady) {
      furthestValidScreen = "explanation";
    }

    if (canCompleteExperience(experience)) {
      furthestValidScreen = "completion";
    }

    if (
      experienceScreenOrder.indexOf(activeScreen) >
      experienceScreenOrder.indexOf(furthestValidScreen)
    ) {
      setActiveScreen(furthestValidScreen);
    }
  }, [activeScreen, experience, explanationReady, sceneReady]);

  function audioEngine(): BrowserAudioEngine {
    audioEngineRef.current ??= new BrowserAudioEngine();
    return audioEngineRef.current;
  }

  function updateManualValue(ear: Ear, frequency: number, value: string) {
    dispatch({
      type: "manual-value-changed",
      ear,
      frequency: frequencyKey(frequency as (typeof FREQUENCY_GRID_HZ)[number]),
      value,
    });
  }

  function selectProfileEntry(entryOption: ProfileEntryOption) {
    audioEngineRef.current?.stop();
    dispatch({ type: "profile-entry-selected", entryOption });
  }

  function confirmSelectedProfile() {
    if (experience.selectedProfileEntry === "manual") {
      dispatch({
        type: "manual-profile-confirmed",
        sourceIdentity: FAMILY_DINNER_SOURCE_ID,
      });
      return;
    }

    dispatch({
      type: "predefined-profile-confirmed",
      profileId: experience.selectedProfileEntry,
      sourceIdentity: FAMILY_DINNER_SOURCE_ID,
    });
  }

  async function loadSource() {
    dispatch({ type: "source-load-started" });
    setSceneTranscript([]);

    try {
      const evidence = await audioEngine().loadSource();
      setSceneTranscript(evidence.transcript);
      dispatch({
        type: "source-ready",
        sourceIdentity: evidence.sourceIdentity,
        sampleRate: evidence.sampleRate,
        frameCount: evidence.frameCount,
        durationSeconds: evidence.durationSeconds,
      });
    } catch {
      setSceneTranscript([]);
      dispatch({ type: "operation-failed", code: "source-load-failed" });
    }
  }

  async function play(mode: ExperienceComparisonMode) {
    const plan = experience.comparisonPlan;

    if (!plan) {
      dispatch({ type: "operation-failed", code: "audio-runtime-unavailable" });
      return;
    }

    const resultIdentity = comparisonResultIdentity(experience, mode);

    if (!resultIdentity) {
      dispatch({ type: "operation-failed", code: "audio-runtime-unavailable" });
      return;
    }
    dispatch({ type: "render-started", mode });

    try {
      const evidence = await audioEngine().play(
        mode,
        experience.supportMode,
        experience.interventionState,
        experience.speakerPositionState,
        plan,
        experience.lowVolumeAcknowledged,
        {
          onEnded: () => {
            dispatch({ type: "playback-ended", resultIdentity });
          },
          onInterrupted: () => {
            dispatch({
              type: "operation-failed",
              code: "audio-runtime-interrupted",
              mode,
            });
          },
        },
      );

      dispatch({
        type: "playback-started",
        mode,
        supportMode: evidence.supportMode,
        interventionState: evidence.interventionState,
        speakerPositionState: evidence.speakerPositionState,
        sourceIdentity: evidence.sourceIdentity,
        resultIdentity: evidence.resultIdentity,
        peakDbFs: evidence.peakDbFs,
      });
    } catch (error) {
      if (error instanceof AudioPlaybackCancelledError) {
        return;
      }

      dispatch({
        type: "operation-failed",
        code:
          error instanceof Error && error.name === "AudioSafetyError"
            ? "audio-safety-rejected"
            : "audio-runtime-unavailable",
        mode,
      });
    }
  }

  function stopPlayback() {
    audioEngineRef.current?.stop();
    dispatch({ type: "playback-stopped" });
  }

  function navigateTo(screen: ActiveScreen) {
    if (isPlaying || isRendering) {
      audioEngineRef.current?.stop();
      flushSync(() => {
        dispatch({ type: "playback-stopped" });
      });
    }

    setActiveScreen(screen);
  }

  function canContinueFrom(screen: ActiveScreen): boolean {
    switch (screen) {
      case "welcome":
        return true;
      case "profile":
        return experience.confirmedProfile !== null;
      case "scene":
        return sceneReady;
      case "listening":
        return listeningComparisonReady;
      case "interventions":
        return canRequestModelExplanation(experience);
      case "explanation":
        return canCompleteExperience(experience);
      case "completion":
        return false;
    }
  }

  function continueExperience() {
    if (activeScreen === "completion" || !canContinueFrom(activeScreen)) {
      return;
    }

    navigateTo(nextScreen[activeScreen]);
  }

  function goBack() {
    if (activeScreen === "welcome") {
      return;
    }

    navigateTo(previousScreen[activeScreen]);
  }

  async function generateLiveExplanation() {
    if (modelRequestInFlightRef.current) {
      return;
    }

    runIdRef.current ??= globalThis.crypto.randomUUID();
    const request = createModelExplanationRequest(
      experience,
      runIdRef.current,
      globalThis.crypto.randomUUID(),
      `result-${globalThis.crypto.randomUUID()}`,
    );

    if (!request) {
      return;
    }

    modelRequestInFlightRef.current = true;
    dispatch({ type: "model-request-started", request });

    try {
      const result = await requestLiveExplanation(request);
      dispatch({ type: "model-result-received", result });
    } finally {
      modelRequestInFlightRef.current = false;
    }
  }

  function completeExperience() {
    dispatch({ type: "experience-completed" });
  }

  function startAnotherComparison() {
    audioEngineRef.current?.stop();
    runIdRef.current = null;
    setSceneTranscript([]);
    flushSync(() => {
      dispatch({ type: "comparison-reset" });
    });
    setActiveScreen("profile");
  }

  function downloadCurrentEvidence() {
    const evidence = projectAttributableEvidence(
      experience,
      new Date().toISOString(),
    );

    if (evidence) {
      downloadAttributableEvidence(evidence);
    }
  }

  function sceneTranscriptDetail() {
    return sceneTranscript.length > 0 ? (
      <details className="scene-transcript">
        <summary>Scene transcript</summary>
        <p>
          All comparison states use the same underlying scene and timeline.
          Processing changes the listening comparison, not the spoken wording.
        </p>
        <ol>
          {sceneTranscript.map((entry, index) => (
            <li key={`${entry.startSeconds}-${entry.speaker}-${index}`}>
              <div className="transcript-cue">
                <time dateTime={`PT${entry.startSeconds}S`}>
                  {formatTranscriptTime(entry.startSeconds)}
                </time>
                <strong className="transcript-speaker">{entry.speaker}</strong>
              </div>
              <p className="transcript-text">{entry.text}</p>
            </li>
          ))}
        </ol>
      </details>
    ) : null;
  }

  function renderProfileScreen() {
    const profileLabel =
      selectedPredefinedProfile?.displayName ?? MANUAL_PROFILE_ENTRY_LABEL;
    const rightThresholds =
      selectedPredefinedProfile?.rightThresholdsDbHl ??
      experience.manualDraft.right;
    const leftThresholds =
      selectedPredefinedProfile?.leftThresholdsDbHl ??
      experience.manualDraft.left;

    return (
      <section
        key="profile"
        className="experience-screen"
        aria-labelledby="profile-entry-heading"
      >
        <p className="step-label">Profile / Audiogram</p>
        <h2
          id="profile-entry-heading"
          ref={screenHeadingRef}
          className="screen-heading"
          tabIndex={-1}
        >
          Choose a hearing profile
        </h2>
        <p className="screen-introduction">
          Choose one fixed synthetic example or enter exact values for each ear.
          Every option uses the same comparison pipeline.
        </p>

        <div className="profile-workspace">
          <div className="profile-entry-column">
            <fieldset className="profile-selector" disabled={controlsLocked}>
              <legend>Profile entry</legend>
              <div className="profile-options">
                {PREDEFINED_HEARING_PROFILES.map((profile) => (
                  <label key={profile.id}>
                    <input
                      type="radio"
                      name="profile-entry"
                      value={profile.id}
                      checked={experience.selectedProfileEntry === profile.id}
                      onChange={() => selectProfileEntry(profile.id)}
                    />
                    <span>{profile.displayName}</span>
                  </label>
                ))}
                <label>
                  <input
                    type="radio"
                    name="profile-entry"
                    value="manual"
                    checked={experience.selectedProfileEntry === "manual"}
                    onChange={() => selectProfileEntry("manual")}
                  />
                  <span>{MANUAL_PROFILE_ENTRY_LABEL}</span>
                </label>
              </div>
            </fieldset>
            <p className="profile-selection-note">
              Three profiles are fixed synthetic examples. Manual entry remains
              exact and separate for the right and left ears.
            </p>
          </div>

          <div className="profile-detail-column">
            <Audiogram
              profileLabel={profileLabel}
              rightThresholds={rightThresholds}
              leftThresholds={leftThresholds}
            />

            {selectedPredefinedProfile ? (
              <>
                <p className="profile-detail-introduction">
                  Review the exact fixed values before confirming this synthetic
                  illustrative profile.
                </p>
                <details className="profile-values-detail" open>
                  <summary>Exact threshold values</summary>
                  <div className="table-scroll profile-table-shell">
                    <table className="profile-threshold-table">
                      <caption>
                        {selectedPredefinedProfile.displayName}: exact fixed
                        synthetic thresholds
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Frequency</th>
                          <th scope="col">Right ear (dB HL)</th>
                          <th scope="col">Left ear (dB HL)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FREQUENCY_GRID_HZ.map((frequency) => {
                          const key = frequencyKey(frequency);

                          return (
                            <tr key={frequency}>
                              <th scope="row">
                                {frequency >= 1000
                                  ? `${frequency / 1000} kHz`
                                  : `${frequency} Hz`}
                              </th>
                              <td>
                                {
                                  selectedPredefinedProfile
                                    .rightThresholdsDbHl[key]
                                }
                              </td>
                              <td>
                                {
                                  selectedPredefinedProfile.leftThresholdsDbHl[
                                    key
                                  ]
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </details>
                <button
                  type="button"
                  onClick={confirmSelectedProfile}
                  disabled={controlsLocked}
                >
                  Confirm {selectedPredefinedProfile.displayName}
                </button>
              </>
            ) : (
              <>
                <p className="profile-detail-introduction">
                  Edit the exact thresholds below. The graph reads these same
                  values directly and does not smooth or approximate them.
                </p>

                <div className="table-scroll profile-table-shell">
                  <table className="profile-threshold-table">
                    <caption>
                      {MANUAL_PROFILE_ENTRY_LABEL}: exact current thresholds
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Frequency</th>
                        <th scope="col">Right ear (dB HL)</th>
                        <th scope="col">Left ear (dB HL)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FREQUENCY_GRID_HZ.map((frequency) => {
                        const key = frequencyKey(frequency);

                        return (
                          <tr key={frequency}>
                            <th scope="row">
                              {frequency >= 1000
                                ? `${frequency / 1000} kHz`
                                : `${frequency} Hz`}
                            </th>
                            {(["right", "left"] as const).map((ear) => (
                              <td key={ear}>
                                <input
                                  aria-label={`${ear} ear at ${frequency} Hz`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="5"
                                  inputMode="numeric"
                                  value={experience.manualDraft[ear][key]}
                                  disabled={controlsLocked}
                                  onChange={(event) =>
                                    updateManualValue(
                                      ear,
                                      frequency,
                                      event.target.value,
                                    )
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {visible.lastEdit ? (
                  <p className="state-line">{visible.lastEdit}</p>
                ) : null}

                <button
                  type="button"
                  onClick={confirmSelectedProfile}
                  disabled={controlsLocked}
                >
                  Confirm exact manual profile
                </button>
              </>
            )}

            <p className="state-line">{visible.profile}</p>
            {visible.failure ? (
              <p className="error-message" role="alert">
                {visible.failure}
              </p>
            ) : null}
          </div>
        </div>

        <p className="limitation profile-limitation">
          Synthetic profiles and manually entered values are illustrative—not
          diagnoses or predictions of individual perception.
        </p>
      </section>
    );
  }

  function renderSceneScreen() {
    return (
      <section
        key="scene"
        className="experience-screen"
        aria-labelledby="source-heading"
      >
        <p className="step-label">One validated source</p>
        <h2
          id="source-heading"
          ref={screenHeadingRef}
          className="screen-heading"
          tabIndex={-1}
        >
          Prepare the family scene
        </h2>
        <p className="screen-introduction">
          Four owner-approved synthetic stems form one synchronized family
          scene. Every comparison uses this same source and timeline.
        </p>
        <p className="limitation">
          No external recording, stock sample, real television content, or music
          is used.
        </p>

        <label className="acknowledgement">
          <input
            type="checkbox"
            checked={experience.lowVolumeAcknowledged}
            disabled={controlsLocked}
            onChange={(event) =>
              dispatch({
                type: "low-volume-acknowledgement-changed",
                acknowledged: event.target.checked,
              })
            }
          />
          <span>
            I have set my device to a low volume and understand that digital
            validation cannot guarantee physical listening level.
          </span>
        </label>

        <button
          type="button"
          onClick={() => void loadSource()}
          disabled={
            !experience.confirmedProfile ||
            experience.source.status === "loading" ||
            controlsLocked
          }
        >
          {experience.source.status === "loading"
            ? "Loading and validating…"
            : "Load validated family scene"}
        </button>
        <p className="state-line">{visible.source}</p>
        {sceneTranscriptDetail()}
        {visible.failure ? (
          <p className="error-message" role="alert">
            {visible.failure}
          </p>
        ) : null}
      </section>
    );
  }

  function playbackButtons() {
    return (
      <div className="listening-pair">
        <article className="listening-option">
          <p className="comparison-letter">A</p>
          <h3>Source reference</h3>
          <p>The validated family scene before the illustrative profile result.</p>
          <button
            type="button"
            onClick={() => void play("reference")}
            disabled={
              !experience.comparisonPlan ||
              experience.source.status !== "ready" ||
              !experience.lowVolumeAcknowledged ||
              controlsLocked
            }
          >
            Play source reference —{" "}
            {interventionLabels[experience.interventionState]},{" "}
            {speakerPositionLabels[experience.speakerPositionState]}
          </button>
        </article>
        <article className="listening-option">
          <p className="comparison-letter">B</p>
          <h3>Illustrative result</h3>
          <p>
            The same source with{" "}
            {supportLabels[experience.supportMode].toLowerCase()}.
          </p>
          <button
            type="button"
            onClick={() => void play("simulated")}
            disabled={
              !experience.comparisonPlan ||
              experience.source.status !== "ready" ||
              !experience.lowVolumeAcknowledged ||
              controlsLocked
            }
          >
            Play {supportLabels[experience.supportMode].toLowerCase()} result —{" "}
            {interventionLabels[experience.interventionState]},{" "}
            {speakerPositionLabels[experience.speakerPositionState]}
          </button>
        </article>
      </div>
    );
  }

  function renderListeningScreen() {
    return (
      <section
        key="listening"
        className="experience-screen"
        aria-labelledby="comparison-heading"
      >
        <p className="step-label">A / B listening comparison</p>
        <h2
          id="comparison-heading"
          ref={screenHeadingRef}
          className="screen-heading"
          tabIndex={-1}
        >
          Compare the same family moment
        </h2>
        <p className="same-source-line">Same family scene · same timeline</p>
        <p className="screen-introduction">
          A is the source reference. B is the illustrative profile result; the
          support choice applies only to B.
        </p>

        <fieldset
          className="support-selector"
          disabled={!experience.comparisonPlan || controlsLocked}
        >
          <legend>Illustrative support for B</legend>
          <div className="support-options">
            {(
              [
                ["none", "No support"],
                ["left-one-sided", "Left-ear support"],
                ["bilateral", "Bilateral support"],
              ] as const
            ).map(([supportMode, label]) => (
              <label key={supportMode}>
                <input
                  type="radio"
                  name="support-mode"
                  value={supportMode}
                  checked={experience.supportMode === supportMode}
                  onChange={() =>
                    dispatch({ type: "support-mode-changed", supportMode })
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="state-line">{visible.support}</p>
        <p className="acknowledgement-confirmed">
          Low-volume acknowledgement confirmed for this comparison.
        </p>

        {playbackButtons()}

        <p className="playback-state" role="status" aria-live="polite">
          {transportStatus}
        </p>
        {sceneTranscriptDetail()}

        <details className="technical-detail">
          <summary>Technical comparison details</summary>
          <ul>
            <li>{visible.profile}</li>
            <li>{visible.source}</li>
            <li>{visible.reference}</li>
            <li>{visible.simulated}</li>
          </ul>
          {selectedTransformation ? (
            <div className="table-scroll proof-table">
              <table>
                <caption>
                  {supportLabels[experience.supportMode]} profile-derived plan
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Frequency</th>
                    <th scope="col">Right</th>
                    <th scope="col">Left</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTransformation.leftFilters.map(
                    (leftFilter, index) => {
                      const rightFilter =
                        selectedTransformation.rightFilters[index];

                      return (
                        <tr key={leftFilter.frequencyHz}>
                          <th scope="row">{leftFilter.frequencyHz} Hz</th>
                          <td>{rightFilter.gainDb.toFixed(1)} dB</td>
                          <td>{leftFilter.gainDb.toFixed(1)} dB</td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </details>

        <p className="limitation">
          This spectral transformation and every support state are illustrative
          and non-clinical. They are not a hearing-aid fitting, prescription, or
          prediction of individual benefit.
        </p>
      </section>
    );
  }

  function renderInterventionsScreen() {
    return (
      <section
        key="interventions"
        className="experience-screen"
        aria-labelledby="interventions-heading"
      >
        <p className="step-label">Communication conditions</p>
        <h2
          id="interventions-heading"
          ref={screenHeadingRef}
          className="screen-heading"
          tabIndex={-1}
        >
          Change the listening conditions
        </h2>
        <p className="screen-introduction">
          Keep the same source and adjust only the television contribution or
          the important speaker&apos;s position.
        </p>
        <p className="support-context">
          Current B support:{" "}
          <strong>{supportLabels[experience.supportMode]}</strong>
        </p>

        <div className="intervention-grid">
          <div>
            <fieldset
              className="intervention-selector"
              disabled={
                !experience.confirmedProfile ||
                experience.source.status !== "ready" ||
                controlsLocked
              }
            >
              <legend>Television contribution</legend>
              <div className="intervention-options">
                {(["tv-on", "tv-off"] as const).map((interventionState) => (
                  <label key={interventionState}>
                    <input
                      type="radio"
                      name="intervention-state"
                      value={interventionState}
                      checked={
                        experience.interventionState === interventionState
                      }
                      onChange={() =>
                        dispatch({
                          type: "intervention-state-changed",
                          interventionState,
                        })
                      }
                    />
                    <span>{interventionLabels[interventionState]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="state-line">{visible.intervention}</p>
            <p>{visible.interventionSummary}</p>
          </div>

          <div>
            <fieldset
              className="speaker-position-selector"
              disabled={
                !experience.confirmedProfile ||
                experience.source.status !== "ready" ||
                controlsLocked
              }
            >
              <legend>Important-speaker position</legend>
              <div className="speaker-position-options">
                {(
                  ["original-position", "closer-in-front"] as const
                ).map((speakerPositionState) => (
                  <label key={speakerPositionState}>
                    <input
                      type="radio"
                      name="speaker-position-state"
                      value={speakerPositionState}
                      checked={
                        experience.speakerPositionState === speakerPositionState
                      }
                      onChange={() =>
                        dispatch({
                          type: "speaker-position-changed",
                          speakerPositionState,
                        })
                      }
                    />
                    <span>{speakerPositionLabels[speakerPositionState]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="state-line">{visible.speakerPosition}</p>
            <p>{visible.speakerPositionSummary}</p>
          </div>
        </div>

        {playbackButtons()}
        <p className="playback-state" role="status" aria-live="polite">
          {transportStatus}
        </p>
        <p className="limitation">
          TV-off and speaker position are deterministic illustrative
          comparisons—not medical recommendations or guaranteed communication
          outcomes.
        </p>
      </section>
    );
  }

  function renderExplanationScreen() {
    return (
      <section
        key="explanation"
        className="experience-screen"
        aria-labelledby="live-explanation-heading"
      >
        <p className="step-label">Grounded explanation</p>
        <h2
          id="live-explanation-heading"
          ref={screenHeadingRef}
          className="screen-heading"
          tabIndex={-1}
        >
          Explain the current result
        </h2>
        <p className="screen-introduction">
          Generate one fresh, bounded explanation for the current illustrative
          result. No raw audiogram values are sent to the model.
        </p>

        <dl className="context-summary">
          <div>
            <dt>Profile</dt>
            <dd>{visible.profile}</dd>
          </div>
          <div>
            <dt>Support</dt>
            <dd>{supportLabels[experience.supportMode]}</dd>
          </div>
          <div>
            <dt>Television</dt>
            <dd>{interventionLabels[experience.interventionState]}</dd>
          </div>
          <div>
            <dt>Important speaker</dt>
            <dd>
              {speakerPositionLabels[experience.speakerPositionState]}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => void generateLiveExplanation()}
          disabled={!canRequestModelExplanation(experience)}
        >
          {experience.modelState.status === "loading"
            ? "Generating live explanation…"
            : experience.modelState.status === "degraded"
              ? "Retry live explanation"
              : "Generate live explanation"}
        </button>

        <p className="state-line" role="status" aria-live="polite">
          {visible.model}
        </p>
        <p className="attempt-count">
          Explanation attempts used: {experience.modelAttemptsUsed} of{" "}
          {MAX_MODEL_ATTEMPTS_PER_SESSION}.
        </p>

        {experience.modelState.status === "live" ? (
          <div className="model-result model-result-live">
            <p className="model-badge">Live GPT</p>
            <h3>Current grounded explanation</h3>
            <p>{experience.modelState.result.sceneFraming}</p>
            <p>{experience.modelState.result.audibleChange}</p>
            <p>{experience.modelState.result.unchanged}</p>
            <p>{experience.modelState.result.limitation}</p>
          </div>
        ) : null}

        {experience.modelState.status === "degraded" ? (
          <div className="model-result model-result-degraded" role="alert">
            <p className="model-badge">Degraded</p>
            <h3>Live explanation unavailable</h3>
            <p>{experience.modelState.result.message}</p>
          </div>
        ) : null}

        <p className="limitation">
          The explanation is not a diagnosis, prescription, or guarantee of
          individual perception. The deterministic comparison remains available
          when GPT is unavailable.
        </p>
      </section>
    );
  }

  function renderCompletionScreen() {
    return (
      <section
        key="completion"
        className="experience-screen"
        aria-labelledby="completion-heading"
      >
        <p className="step-label">Your comparison</p>
        <h2
          id="completion-heading"
          ref={screenHeadingRef}
          className="screen-heading"
          tabIndex={-1}
        >
          Complete this comparison
        </h2>
        <p className="screen-introduction">
          Complete the current validated deterministic result and keep a
          sanitized proof of the illustrative run.
        </p>
        <button
          type="button"
          onClick={completeExperience}
          disabled={
            !completionEligible || experience.completionState !== "in-progress"
          }
        >
          Complete experience
        </button>

        {terminalCompletion ? (
          <div
            className="completion-result"
            aria-labelledby="completion-result-heading"
          >
            <p className="model-badge">
              {terminalCompletion.status === "complete-live"
                ? "Complete — live"
                : "Complete — degraded"}
            </p>
            <h3 id="completion-result-heading">
              Your current Auralis comparison
            </h3>
            <dl className="completion-summary">
              <div>
                <dt>Profile</dt>
                <dd>{terminalCompletion.profile}</dd>
              </div>
              <div>
                <dt>Profile origin</dt>
                <dd>{terminalCompletion.profileOrigin}</dd>
              </div>
              <div>
                <dt>Support</dt>
                <dd>{terminalCompletion.support}</dd>
              </div>
              <div>
                <dt>Television</dt>
                <dd>{terminalCompletion.television}</dd>
              </div>
              <div>
                <dt>Important speaker</dt>
                <dd>{terminalCompletion.speakerPosition}</dd>
              </div>
              <div>
                <dt>Deterministic result identity</dt>
                <dd>
                  <code>{terminalCompletion.resultIdentity}</code>
                </dd>
              </div>
              <div>
                <dt>Explanation status</dt>
                <dd>{terminalCompletion.explanationStatus}</dd>
              </div>
            </dl>
            <p>{terminalCompletion.explanationAvailability}</p>
            <p className="limitation">{terminalCompletion.limitation}</p>
            <p>
              <strong>Next action:</strong> {terminalCompletion.nextAction}
            </p>
            <p>
              The downloadable JSON is a sanitized, attributable proof of this
              illustrative run. It is not a clinical report.
            </p>
            <div className="button-row">
              <button type="button" onClick={downloadCurrentEvidence}>
                Download evidence
              </button>
              <button type="button" onClick={startAnotherComparison}>
                Start another comparison
              </button>
            </div>
          </div>
        ) : (
          <p className="state-line">
            Completion state: ready. Confirm to create the terminal summary.
          </p>
        )}
      </section>
    );
  }

  function renderActiveScreen() {
    switch (activeScreen) {
      case "profile":
        return renderProfileScreen();
      case "scene":
        return renderSceneScreen();
      case "listening":
        return renderListeningScreen();
      case "interventions":
        return renderInterventionsScreen();
      case "explanation":
        return renderExplanationScreen();
      case "completion":
        return renderCompletionScreen();
      case "welcome":
        return null;
    }
  }

  const showPersistentStop =
    activeScreen === "listening" ||
    activeScreen === "interventions" ||
    activeScreen === "explanation";
  const activeStep =
    activeScreen === "welcome"
      ? null
      : experienceScreenOrder.indexOf(activeScreen) + 1;

  return (
    <main className="guided-shell">
      {activeScreen === "welcome" ? (
        <section
          key="welcome"
          className="welcome-screen experience-screen"
          aria-labelledby="auralis-heading"
        >
          <div className="welcome-copy">
            <p className="eyebrow">A guided listening comparison</p>
            <h1
              id="auralis-heading"
              ref={screenHeadingRef}
              className="screen-heading"
              tabIndex={-1}
            >
              Auralis
            </h1>
            <p className="tagline">See what hearing sounds like.</p>
            <p className="welcome-statement">
              One family scene. Different listening conditions.
            </p>
            <p>
              Compare a source reference with an illustrative result shaped by
              a confirmed hearing profile and communication conditions.
            </p>
            <button type="button" onClick={() => navigateTo("profile")}>
              Start the comparison
            </button>
            <p className="limitation">
              This is an illustrative, non-clinical experience—not a diagnosis,
              hearing-aid fitting, prescription, or prediction of individual
              perception.
            </p>
            <details className="how-it-works">
              <summary>How it works</summary>
              <p>
                Confirm a profile, load one validated family scene, compare A
                and B, explore two communication conditions, then review and
                export a sanitized summary.
              </p>
            </details>
          </div>
          <div className="welcome-principle" aria-hidden="true">
            <span>Same scene</span>
            <span>Same timeline</span>
            <span>Different listening conditions</span>
          </div>
        </section>
      ) : (
        <>
          <header className="experience-header">
            <h1 className="app-wordmark">Auralis</h1>
            <p
              className="progress-label"
              aria-label={`Step ${activeStep} of 6: ${screenLabels[activeScreen]}`}
              aria-current="step"
            >
              <span>
                {activeStep} of 6
              </span>
              <strong>{screenLabels[activeScreen]}</strong>
            </p>
            {showPersistentStop ? (
              <div className="persistent-stop-slot">
                <button
                  className="stop-button"
                  type="button"
                  onClick={stopPlayback}
                  disabled={!isPlaying && !isRendering}
                >
                  Stop immediately
                </button>
              </div>
            ) : (
              <div className="header-balance" aria-hidden="true" />
            )}
          </header>

          <div className="screen-stage">{renderActiveScreen()}</div>

          <nav className="screen-navigation" aria-label="Experience navigation">
            <button
              className="secondary-button"
              type="button"
              onClick={goBack}
            >
              Back
            </button>
            {activeScreen !== "completion" ? (
              <button
                type="button"
                onClick={continueExperience}
                disabled={!canContinueFrom(activeScreen)}
              >
                Continue to {screenLabels[nextScreen[activeScreen]]}
              </button>
            ) : null}
          </nav>
        </>
      )}
    </main>
  );
}
