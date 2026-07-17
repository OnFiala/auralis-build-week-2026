import {
  assertValidComparisonPlan,
  type ComparisonMode,
  type ComparisonPlan,
} from "./transformation";

export const AUDIO_SAFETY_POLICY = Object.freeze({
  policyVersion: "auralis-digital-audio-safety-v1",
  renderedPeakCeilingDbFs: -6,
  renderedPeakCeilingLinear: 10 ** (-6 / 20),
  transitionRampMs: 50,
  stopRampMs: 20,
  maximumObservedStopMs: 100,
});

export type SourceBufferMetadata = Readonly<{
  sampleRate: number;
  numberOfChannels: number;
  frameCount: number;
  durationSeconds: number;
}>;

export type RenderedAudioView = Readonly<{
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  duration: number;
  getChannelData(channel: number): Float32Array;
}>;

export type RenderValidation = Readonly<{
  finite: true;
  peakLinear: number;
  peakDbFs: number;
  sampleRate: number;
  numberOfChannels: number;
  frameCount: number;
  durationSeconds: number;
  policyVersion: string;
}>;

export class AudioSafetyError extends Error {
  readonly code = "audio-safety-rejected";

  constructor(message: string) {
    super(message);
    this.name = "AudioSafetyError";
  }
}

export function assertSourcePackageMetadata(
  metadata: readonly SourceBufferMetadata[],
): SourceBufferMetadata {
  const first = metadata[0];

  if (!first || metadata.length !== 4) {
    throw new AudioSafetyError("The source package must contain exactly four stems.");
  }

  const valid = metadata.every(
    (stem) =>
      Number.isFinite(stem.sampleRate) &&
      stem.sampleRate > 0 &&
      Number.isSafeInteger(stem.numberOfChannels) &&
      stem.numberOfChannels === 1 &&
      Number.isSafeInteger(stem.frameCount) &&
      stem.frameCount > 0 &&
      Number.isFinite(stem.durationSeconds) &&
      stem.durationSeconds > 0 &&
      stem.sampleRate === first.sampleRate &&
      stem.numberOfChannels === first.numberOfChannels &&
      stem.frameCount === first.frameCount &&
      Math.abs(stem.durationSeconds - first.durationSeconds) < 1 / first.sampleRate,
  );

  if (!valid) {
    throw new AudioSafetyError(
      "The source stems do not share one finite synchronized audio format.",
    );
  }

  return first;
}

export function assertPlaybackPreconditions(
  plan: ComparisonPlan,
  mode: ComparisonMode,
  lowVolumeAcknowledged: boolean,
  sourceIdentity: string | null,
): void {
  assertValidComparisonPlan(plan);

  if (!lowVolumeAcknowledged) {
    throw new AudioSafetyError("Low-volume acknowledgement is required before playback.");
  }

  if (
    sourceIdentity === null ||
    sourceIdentity !== plan.sourceIdentity ||
    plan[mode].sourceIdentity !== sourceIdentity
  ) {
    throw new AudioSafetyError("The loaded source does not match the comparison plan.");
  }
}

export function validateRenderedAudio(audio: RenderedAudioView): RenderValidation {
  if (
    audio.numberOfChannels !== 2 ||
    !Number.isSafeInteger(audio.length) ||
    audio.length <= 0 ||
    !Number.isFinite(audio.sampleRate) ||
    audio.sampleRate <= 0 ||
    !Number.isFinite(audio.duration) ||
    audio.duration <= 0
  ) {
    throw new AudioSafetyError("Rendered audio metadata is invalid.");
  }

  let peakLinear = 0;

  for (let channel = 0; channel < audio.numberOfChannels; channel += 1) {
    const samples = audio.getChannelData(channel);

    if (samples.length !== audio.length) {
      throw new AudioSafetyError("Rendered channel lengths do not match.");
    }

    for (const sample of samples) {
      if (!Number.isFinite(sample)) {
        throw new AudioSafetyError("Rendered audio contains a non-finite sample.");
      }

      peakLinear = Math.max(peakLinear, Math.abs(sample));
    }
  }

  if (peakLinear > AUDIO_SAFETY_POLICY.renderedPeakCeilingLinear) {
    throw new AudioSafetyError("Rendered audio exceeds the digital sample-peak ceiling.");
  }

  return Object.freeze({
    finite: true as const,
    peakLinear,
    peakDbFs: peakLinear === 0 ? Number.NEGATIVE_INFINITY : 20 * Math.log10(peakLinear),
    sampleRate: audio.sampleRate,
    numberOfChannels: audio.numberOfChannels,
    frameCount: audio.length,
    durationSeconds: audio.duration,
    policyVersion: AUDIO_SAFETY_POLICY.policyVersion,
  });
}
