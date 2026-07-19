"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import {
  AudioPlaybackCancelledError,
  BrowserAudioEngine,
  FAMILY_DINNER_SOURCE_ID,
} from "../browser/audio";
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
  projectTerminalCompletion,
  projectVisibleExperienceState,
  type ExperienceComparisonMode,
  type ExperienceInterventionState,
  type ExperienceSpeakerPositionState,
  type ExperienceSupportMode,
} from "../core/experience";
import {
  FREQUENCY_GRID_HZ,
  MANUAL_PROFILE_ENTRY_LABEL,
  PREDEFINED_HEARING_PROFILES,
  frequencyKey,
  predefinedProfileById,
  type Ear,
  type ProfileEntryOption,
} from "../core/profile";

type CheckState = "idle" | "checking" | "ready" | "unavailable";

const statusText: Record<CheckState, string> = {
  idle: "System status has not been checked.",
  checking: "Checking system status…",
  ready: "System status: ready.",
  unavailable: "System status: unavailable.",
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

function isExpectedHealthResponse(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const health = value as Record<string, unknown>;
  return (
    Object.keys(health).length === 3 &&
    health.status === "ok" &&
    health.service === "auralis-shell" &&
    health.phase === "9-walking-skeleton"
  );
}

export default function HomePage() {
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [experience, dispatch] = useReducer(
    experienceReducer,
    createInitialExperienceState(),
  );
  const audioEngineRef = useRef<BrowserAudioEngine | null>(null);
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
  const controlsLocked =
    isRendering || isPlaying || experience.source.status === "loading";
  const selectedPredefinedProfile =
    experience.selectedProfileEntry === "manual"
      ? null
      : predefinedProfileById(experience.selectedProfileEntry);

  useEffect(
    () => () => {
      void audioEngineRef.current?.dispose();
    },
    [],
  );

  function audioEngine(): BrowserAudioEngine {
    audioEngineRef.current ??= new BrowserAudioEngine();
    return audioEngineRef.current;
  }

  async function checkSystemStatus() {
    setCheckState("checking");

    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isExpectedHealthResponse(payload)) {
        throw new Error("Unexpected health response");
      }

      setCheckState("ready");
    } catch {
      setCheckState("unavailable");
    }
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

    try {
      const evidence = await audioEngine().loadSource();
      dispatch({
        type: "source-ready",
        sourceIdentity: evidence.sourceIdentity,
        sampleRate: evidence.sampleRate,
        frameCount: evidence.frameCount,
        durationSeconds: evidence.durationSeconds,
      });
    } catch {
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
    dispatch({ type: "comparison-reset" });
  }

  return (
    <main>
      <header className="hero" aria-labelledby="auralis-heading">
        <p className="eyebrow">OpenAI Build Week 2026</p>
        <h1 id="auralis-heading">Auralis</h1>
        <p className="tagline">See what hearing sounds like.</p>
        <p>
          This is the executable system shell. It now hosts a bounded local Phase
          10 deterministic audio proof.
        </p>
        <p>
          The hearing experience is not implemented yet.
        </p>
        <p>
          This local build contains only the first bounded deterministic proof,
          not the complete product experience.
        </p>

        <button
          className="secondary-button"
          type="button"
          onClick={checkSystemStatus}
          disabled={checkState === "checking"}
        >
          {checkState === "checking" ? "Checking…" : "Check system status"}
        </button>

        <p className={`status status-${checkState}`} role="status" aria-live="polite">
          {statusText[checkState]}
        </p>
      </header>

      <section aria-labelledby="profile-entry-heading">
        <p className="step-label">Step 1</p>
        <h2 id="profile-entry-heading">Choose a profile entry</h2>
        <p>
          Choose one of three fixed synthetic examples or enter an audiogram.
          Every option uses the same deterministic transformation, support and
          browser-audio pipeline.
        </p>
        <p>
          The named profiles are illustrative examples—not diagnoses—and do not
          represent expected individual perception.
        </p>

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

        {selectedPredefinedProfile ? (
          <>
            <p>
              Review the exact synthetic right- and left-ear values before
              confirming this illustrative profile.
            </p>
            <div className="table-scroll">
              <table>
                <caption>
                  {selectedPredefinedProfile.displayName}: exact fixed synthetic
                  thresholds
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
                          {selectedPredefinedProfile.rightThresholdsDbHl[key]}
                        </td>
                        <td>
                          {selectedPredefinedProfile.leftThresholdsDbHl[key]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
            <div className="explanation">
              <p>
                An audiogram records a threshold for each ear across pitches
                from lower to higher frequency. The values below are synthetic
                dB HL inputs—not playback-volume settings.
              </p>
              <p>
                A higher value applies more illustrative attenuation around that
                frequency. This cannot reproduce an individual&apos;s
                perception, diagnose a condition, or recommend treatment or
                hearing support.
              </p>
            </div>

            <div className="table-scroll">
              <table>
                <caption>
                  Edit the right and left values separately, then confirm the
                  exact profile.
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
      </section>

      <section aria-labelledby="source-heading">
        <p className="step-label">Step 2</p>
        <h2 id="source-heading">Load the validated family scene</h2>
        <p>
          Four owner-approved synthetic stems form one synchronized source. No
          external recording, stock sample, real television content, or music is
          used.
        </p>
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
      </section>

      <section aria-labelledby="comparison-heading">
        <p className="step-label">Step 3</p>
        <h2 id="comparison-heading">Compare the exact same source</h2>
        <p>
          Reference and simulated playback reuse the same decoded four-stem
          package. The selected illustrative support state changes only the
          profile-derived per-ear filters.
        </p>

        <fieldset
          className="support-selector"
          disabled={!experience.comparisonPlan || controlsLocked}
        >
          <legend>Illustrative support state</legend>
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

        <fieldset
          className="intervention-selector"
          disabled={
            !experience.confirmedProfile ||
            experience.source.status !== "ready" ||
            controlsLocked
          }
        >
          <legend>Illustrative environmental intervention</legend>
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
        <p>
          TV-off is an illustrative environmental comparison, not a medical
          recommendation or a guaranteed outcome. This summary is deterministic
          and does not come from a live model.
        </p>

        <fieldset
          className="speaker-position-selector"
          disabled={
            !experience.confirmedProfile ||
            experience.source.status !== "ready" ||
            controlsLocked
          }
        >
          <legend>Illustrative important-speaker position</legend>
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
        <p>
          This is an illustrative spatial comparison, not a medical
          recommendation or a guaranteed communication outcome.
        </p>

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
                    const rightFilter = selectedTransformation.rightFilters[index];

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

        <div className="button-row">
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
          <button
            className="stop-button"
            type="button"
            onClick={stopPlayback}
            disabled={!isPlaying && !isRendering}
          >
            Stop immediately
          </button>
        </div>

        <div className="state-panel" aria-live="polite" aria-atomic="true">
          <h3>Current data-derived state</h3>
          <ul>
            <li>{visible.profile}</li>
            <li>{visible.source}</li>
            <li>{visible.support}</li>
            <li>{visible.intervention}</li>
            <li>{visible.interventionSummary}</li>
            <li>{visible.speakerPosition}</li>
            <li>{visible.speakerPositionSummary}</li>
            <li>{visible.reference}</li>
            <li>{visible.simulated}</li>
            <li>{visible.playback}</li>
            <li>{visible.model}</li>
          </ul>
        </div>

        <p className="limitation">
          This is an illustrative, non-clinical spectral transformation. It is
          not a hearing test, diagnosis, treatment, prescription, or exact model
          of any person&apos;s hearing. Support is not a hearing-aid fitting,
          prescription, or prediction of individual benefit. Start at low volume.
        </p>
      </section>

      <section aria-labelledby="live-explanation-heading">
        <p className="step-label">Step 4</p>
        <h2 id="live-explanation-heading">Explain the current result</h2>
        <p>
          Generate one fresh, bounded explanation for the current illustrative
          profile, support state, TV intervention and important-speaker
          position. No raw audiogram values are sent to the model.
        </p>
        <p>
          The explanation is not a diagnosis, prescription or guarantee of
          individual perception. Deterministic audio remains available if GPT is
          unavailable.
        </p>

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
      </section>

      <section aria-labelledby="completion-heading">
        <p className="step-label">Step 5</p>
        <h2 id="completion-heading">Complete this comparison</h2>
        <p>
          Completion is available only for the current validated deterministic
          result after one explicit live-explanation attempt has finished.
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
            <button type="button" onClick={startAnotherComparison}>
              Start another comparison
            </button>
          </div>
        ) : (
          <p className="state-line">
            Completion state: in progress. Finish the current deterministic
            result and one explanation attempt before completing.
          </p>
        )}
      </section>
    </main>
  );
}
