"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import {
  AudioPlaybackCancelledError,
  BrowserAudioEngine,
  FAMILY_DINNER_SOURCE_ID,
} from "../browser/audio";
import {
  comparisonResultIdentity,
  createInitialExperienceState,
  experienceReducer,
  projectVisibleExperienceState,
  type ExperienceComparisonMode,
} from "../core/experience";
import {
  FREQUENCY_GRID_HZ,
  frequencyKey,
  type Ear,
} from "../core/profile";

type CheckState = "idle" | "checking" | "ready" | "unavailable";

const statusText: Record<CheckState, string> = {
  idle: "System status has not been checked.",
  checking: "Checking system status…",
  ready: "System status: ready.",
  unavailable: "System status: unavailable.",
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
  const visible = projectVisibleExperienceState(experience);
  const isRendering =
    experience.renders.reference.status === "rendering" ||
    experience.renders.simulated.status === "rendering";
  const isPlaying = experience.playback.status === "playing";
  const controlsLocked =
    isRendering || isPlaying || experience.source.status === "loading";

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

  function confirmManualProfile() {
    dispatch({
      type: "manual-profile-confirmed",
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

  return (
    <main>
      <header className="hero" aria-labelledby="auralis-heading">
        <p className="eyebrow">OpenAI Build Week 2026</p>
        <h1 id="auralis-heading">Auralis</h1>
        <p className="tagline">See what hearing sounds like.</p>
        <p>
          This is the executable system shell. It now hosts a bounded local Phase
          10A proof.
        </p>
        <p>
          The hearing experience is not implemented yet as a complete product;
          only the first deterministic proof is present.
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

      <section aria-labelledby="manual-profile-heading">
        <p className="step-label">Step 1</p>
        <h2 id="manual-profile-heading">Synthetic manual test profile</h2>
        <div className="explanation">
          <p>
            An audiogram records a threshold for each ear across pitches from
            lower to higher frequency. The values below are synthetic dB HL
            inputs—not playback-volume settings.
          </p>
          <p>
            A higher value applies more illustrative attenuation around that
            frequency. This cannot reproduce an individual&apos;s perception,
            diagnose a condition, or recommend treatment or hearing support.
          </p>
        </div>

        <div className="table-scroll">
          <table>
            <caption>
              Edit the left and right values separately, then confirm the exact
              profile.
            </caption>
            <thead>
              <tr>
                <th scope="col">Frequency</th>
                <th scope="col">Left ear (dB HL)</th>
                <th scope="col">Right ear (dB HL)</th>
              </tr>
            </thead>
            <tbody>
              {FREQUENCY_GRID_HZ.map((frequency) => {
                const key = frequencyKey(frequency);

                return (
                  <tr key={frequency}>
                    <th scope="row">{frequency >= 1000 ? `${frequency / 1000} kHz` : `${frequency} Hz`}</th>
                    {(["left", "right"] as const).map((ear) => (
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
                            updateManualValue(ear, frequency, event.target.value)
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

        {visible.lastEdit ? <p className="state-line">{visible.lastEdit}</p> : null}

        <button type="button" onClick={confirmManualProfile} disabled={controlsLocked}>
          Confirm exact manual profile
        </button>
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
          package. Only the simulated state applies the confirmed profile&apos;s
          per-ear frequency filters.
        </p>

        {experience.comparisonPlan ? (
          <div className="table-scroll proof-table">
            <table>
              <caption>Profile-derived attenuation plan</caption>
              <thead>
                <tr>
                  <th scope="col">Frequency</th>
                  <th scope="col">Left</th>
                  <th scope="col">Right</th>
                </tr>
              </thead>
              <tbody>
                {experience.comparisonPlan.simulated.leftFilters.map(
                  (leftFilter, index) => {
                    const rightFilter =
                      experience.comparisonPlan!.simulated.rightFilters[index];

                    return (
                      <tr key={leftFilter.frequencyHz}>
                        <th scope="row">{leftFilter.frequencyHz} Hz</th>
                        <td>{leftFilter.gainDb.toFixed(1)} dB</td>
                        <td>{rightFilter.gainDb.toFixed(1)} dB</td>
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
            Play source reference
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
            Play profile-derived result
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
            <li>{visible.reference}</li>
            <li>{visible.simulated}</li>
            <li>{visible.playback}</li>
          </ul>
        </div>

        <p className="limitation">
          This is an illustrative, non-clinical spectral transformation. It is
          not a hearing test, diagnosis, treatment, prescription, or exact model
          of any person&apos;s hearing.
        </p>
      </section>
    </main>
  );
}
