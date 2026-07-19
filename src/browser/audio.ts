import {
  AUDIO_SAFETY_POLICY,
  AudioSafetyError,
  assertPlaybackPreconditions,
  assertSourcePackageMetadata,
  validateRenderedAudio,
  type RenderValidation,
  type SourceBufferMetadata,
} from "../core/safety";
import {
  referenceResultForIntervention,
  resultForSupportMode,
  type ComparisonMode,
  type ComparisonPlan,
  type InterventionState,
  type SpeakerPositionState,
  type SourceContributionPlan,
  type SpectralFilter,
  type SupportMode,
} from "../core/transformation";

export const FAMILY_DINNER_SOURCE_ID =
  "auralis-family-dinner-greenhouse:a6cb7016fa973cb52a1994454cacd880a4f5864ce0a32a8081a75aad36224aed";

const MANIFEST_URL = "/media/family-dinner/manifest.json";
const APPROVED_FILES = [
  "focused-speech.wav",
  "overlapping-speech.wav",
  "television.wav",
  "kitchen-room.wav",
] as const;

type ManifestAsset = Readonly<{
  file: (typeof APPROVED_FILES)[number];
  sha256: string;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  frameCount: number;
}>;

type SceneManifest = Readonly<{
  sourceIdentity: typeof FAMILY_DINNER_SOURCE_ID;
  sceneVersion: string;
  assets: readonly ManifestAsset[];
}>;

type LoadedSource = Readonly<{
  manifest: SceneManifest;
  buffers: readonly AudioBuffer[];
  commonMetadata: SourceBufferMetadata;
}>;

type RenderedResult = Readonly<{
  buffer: AudioBuffer;
  validation: RenderValidation;
  resultIdentity: string;
}>;

type ActivePlayback = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  resultIdentity: string;
  stopping: boolean;
  onEnded: () => void;
  onInterrupted: () => void;
};

export type SourceReadyEvidence = Readonly<{
  sourceIdentity: string;
  sceneVersion: string;
  sampleRate: number;
  frameCount: number;
  durationSeconds: number;
  assetCount: 4;
}>;

export type PlaybackEvidence = Readonly<{
  sourceIdentity: string;
  resultIdentity: string;
  mode: ComparisonMode;
  supportMode: SupportMode | null;
  interventionState: InterventionState;
  speakerPositionState: SpeakerPositionState;
  peakDbFs: number;
  durationSeconds: number;
  sampleRate: number;
  frameCount: number;
}>;

export class AudioPlaybackCancelledError extends Error {
  constructor() {
    super("Playback preparation was cancelled.");
    this.name = "AudioPlaybackCancelledError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseManifestAsset(value: unknown): ManifestAsset {
  if (!isRecord(value)) {
    throw new AudioSafetyError("The media manifest contains an invalid asset.");
  }

  const file = value.file;
  const alignment = value.alignment;

  if (
    typeof file !== "string" ||
    !APPROVED_FILES.includes(file as (typeof APPROVED_FILES)[number]) ||
    typeof value.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.sha256) ||
    typeof value.durationSeconds !== "number" ||
    typeof value.sampleRate !== "number" ||
    typeof value.channels !== "number" ||
    typeof value.frameCount !== "number" ||
    value.sampleWidthBits !== 16 ||
    value.thirdPartySource !== "none" ||
    value.aiDisclosureRequired !== true ||
    typeof value.humanReviewStatus !== "string" ||
    !value.humanReviewStatus.startsWith("approved by human owner") ||
    !isRecord(alignment) ||
    alignment.startFrame !== 0 ||
    alignment.endFrameExclusive !== value.frameCount ||
    alignment.commonSourceIdentity !== FAMILY_DINNER_SOURCE_ID
  ) {
    throw new AudioSafetyError("The media manifest asset is outside the approved package.");
  }

  return Object.freeze({
    file: file as ManifestAsset["file"],
    sha256: value.sha256,
    durationSeconds: value.durationSeconds,
    sampleRate: value.sampleRate,
    channels: value.channels,
    frameCount: value.frameCount,
  });
}

function parseManifest(value: unknown): SceneManifest {
  if (
    !isRecord(value) ||
    value.sourceIdentity !== FAMILY_DINNER_SOURCE_ID ||
    typeof value.sceneVersion !== "string" ||
    value.sceneVersion.trim() === "" ||
    value.classification !== "original synthetic generated media" ||
    !isRecord(value.originAndRights) ||
    value.originAndRights.thirdPartySource !== "none" ||
    !Array.isArray(value.assets)
  ) {
    throw new AudioSafetyError("The media manifest is outside the approved source package.");
  }

  const assets = value.assets.map(parseManifestAsset);
  const fileSet = new Set(assets.map((asset) => asset.file));

  if (
    assets.length !== APPROVED_FILES.length ||
    APPROVED_FILES.some((file) => !fileSet.has(file))
  ) {
    throw new AudioSafetyError("The media manifest does not contain the exact four stems.");
  }

  const orderedAssets = APPROVED_FILES.map((file) => {
    const asset = assets.find((candidate) => candidate.file === file);

    if (!asset) {
      throw new AudioSafetyError("The media manifest is missing an approved stem.");
    }

    return asset;
  });

  return Object.freeze({
    sourceIdentity: FAMILY_DINNER_SOURCE_ID,
    sceneVersion: value.sceneVersion,
    assets: Object.freeze(orderedAssets),
  });
}

async function sha256Hex(data: ArrayBuffer): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new AudioSafetyError("This browser cannot verify the media digests.");
  }

  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new AudioSafetyError("An approved media stem could not be loaded.");
  }

  return response.arrayBuffer();
}

function metadataForBuffer(buffer: AudioBuffer): SourceBufferMetadata {
  return Object.freeze({
    sampleRate: buffer.sampleRate,
    numberOfChannels: buffer.numberOfChannels,
    frameCount: buffer.length,
    durationSeconds: buffer.duration,
  });
}

function contributionForAsset(
  contributions: SourceContributionPlan,
  file: ManifestAsset["file"],
): 0 | 1 {
  switch (file) {
    case "focused-speech.wav":
      return contributions.focusedSpeech;
    case "overlapping-speech.wav":
      return contributions.overlappingSpeech;
    case "television.wav":
      return contributions.television;
    case "kitchen-room.wav":
      return contributions.kitchenRoom;
  }
}

function connectFilterChain(
  context: OfflineAudioContext,
  input: AudioNode,
  filters: readonly SpectralFilter[],
  destination: AudioNode,
  outputChannel: number,
): void {
  let current: AudioNode = input;

  for (const filterPlan of filters) {
    const filter = context.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.value = filterPlan.frequencyHz;
    filter.Q.value = filterPlan.q;
    filter.gain.value = filterPlan.gainDb;
    current.connect(filter);
    current = filter;
  }

  current.connect(destination, 0, outputChannel);
}

export class BrowserAudioEngine {
  private loadedSource: LoadedSource | null = null;
  private readonly renderedResults = new Map<string, RenderedResult>();
  private context: AudioContext | null = null;
  private active: ActivePlayback | null = null;
  private operationToken = 0;

  async loadSource(): Promise<SourceReadyEvidence> {
    if (this.loadedSource) {
      return this.sourceEvidence(this.loadedSource);
    }

    const manifestResponse = await fetch(MANIFEST_URL, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });

    if (!manifestResponse.ok) {
      throw new AudioSafetyError("The approved media manifest could not be loaded.");
    }

    const manifest = parseManifest(await manifestResponse.json());
    const decoder = new OfflineAudioContext(1, 1, manifest.assets[0].sampleRate);
    const buffers: AudioBuffer[] = [];

    for (const asset of manifest.assets) {
      const bytes = await fetchArrayBuffer(`/media/family-dinner/${asset.file}`);
      const digest = await sha256Hex(bytes);

      if (digest !== asset.sha256) {
        throw new AudioSafetyError("A media stem failed digest verification.");
      }

      const buffer = await decoder.decodeAudioData(bytes.slice(0));

      if (
        buffer.sampleRate !== asset.sampleRate ||
        buffer.numberOfChannels !== asset.channels ||
        buffer.length !== asset.frameCount ||
        Math.abs(buffer.duration - asset.durationSeconds) >= 1 / asset.sampleRate
      ) {
        throw new AudioSafetyError("A decoded media stem failed format verification.");
      }

      buffers.push(buffer);
    }

    const commonMetadata = assertSourcePackageMetadata(buffers.map(metadataForBuffer));
    this.loadedSource = Object.freeze({
      manifest,
      buffers: Object.freeze(buffers),
      commonMetadata,
    });
    this.renderedResults.clear();

    return this.sourceEvidence(this.loadedSource);
  }

  async play(
    mode: ComparisonMode,
    supportMode: SupportMode,
    interventionState: InterventionState,
    speakerPositionState: SpeakerPositionState,
    plan: ComparisonPlan,
    lowVolumeAcknowledged: boolean,
    callbacks: Readonly<{ onEnded: () => void; onInterrupted: () => void }>,
  ): Promise<PlaybackEvidence> {
    if (this.active) {
      throw new AudioSafetyError("Stop the current playback before starting another state.");
    }

    const loadedSource = this.loadedSource;
    assertPlaybackPreconditions(
      plan,
      mode,
      supportMode,
      interventionState,
      speakerPositionState,
      lowVolumeAcknowledged,
      loadedSource?.manifest.sourceIdentity ?? null,
    );

    if (!loadedSource) {
      throw new AudioSafetyError("The source package is not ready.");
    }

    const operationToken = ++this.operationToken;
    const context = await this.ensureRunningContext();
    const rendered = await this.getRenderedResult(
      mode,
      supportMode,
      interventionState,
      speakerPositionState,
      plan,
      loadedSource,
    );

    if (operationToken !== this.operationToken) {
      throw new AudioPlaybackCancelledError();
    }

    if (context.state !== "running") {
      throw new AudioSafetyError("The audio runtime was interrupted before playback.");
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    const now = context.currentTime;

    source.buffer = rendered.buffer;
    gain.gain.setValueAtTime(0, now);
    source.connect(gain);
    gain.connect(context.destination);

    const active: ActivePlayback = {
      source,
      gain,
      resultIdentity: rendered.resultIdentity,
      stopping: false,
      onEnded: callbacks.onEnded,
      onInterrupted: callbacks.onInterrupted,
    };

    source.onended = () => {
      if (this.active !== active) {
        return;
      }

      this.active = null;

      if (!active.stopping) {
        active.onEnded();
      }
    };

    this.active = active;
    source.start(now);
    gain.gain.linearRampToValueAtTime(
      1,
      now + AUDIO_SAFETY_POLICY.transitionRampMs / 1000,
    );

    return Object.freeze({
      sourceIdentity: plan.sourceIdentity,
      resultIdentity: rendered.resultIdentity,
      mode,
      supportMode: mode === "reference" ? null : supportMode,
      interventionState,
      speakerPositionState,
      peakDbFs: rendered.validation.peakDbFs,
      durationSeconds: rendered.validation.durationSeconds,
      sampleRate: rendered.validation.sampleRate,
      frameCount: rendered.validation.frameCount,
    });
  }

  stop(): void {
    this.operationToken += 1;
    const active = this.active;
    const context = this.context;

    if (!active || !context) {
      return;
    }

    if (active.stopping) {
      return;
    }

    active.stopping = true;
    const now = context.currentTime;
    const stopAt = now + AUDIO_SAFETY_POLICY.stopRampMs / 1000;

    try {
      active.gain.gain.cancelAndHoldAtTime(now);
      active.gain.gain.linearRampToValueAtTime(0, stopAt);
      active.source.stop(stopAt);
    } catch {
      this.active = null;
      active.source.onended = null;
      this.emergencySilence(active);
    }
  }

  async dispose(): Promise<void> {
    this.operationToken += 1;

    if (this.active) {
      this.emergencySilence(this.active);
      this.active = null;
    }

    const context = this.context;
    this.context = null;

    if (context && context.state !== "closed") {
      await context.close();
    }
  }

  private sourceEvidence(source: LoadedSource): SourceReadyEvidence {
    return Object.freeze({
      sourceIdentity: source.manifest.sourceIdentity,
      sceneVersion: source.manifest.sceneVersion,
      sampleRate: source.commonMetadata.sampleRate,
      frameCount: source.commonMetadata.frameCount,
      durationSeconds: source.commonMetadata.durationSeconds,
      assetCount: 4 as const,
    });
  }

  private async ensureRunningContext(): Promise<AudioContext> {
    if (!this.context || this.context.state === "closed") {
      this.context = new AudioContext();
      this.context.onstatechange = () => {
        if (this.active && this.context?.state !== "running") {
          const interrupted = this.active;
          this.active = null;
          this.operationToken += 1;
          this.emergencySilence(interrupted);
          interrupted.onInterrupted();
        }
      };
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    if (this.context.state !== "running") {
      throw new AudioSafetyError("The browser audio runtime is unavailable.");
    }

    return this.context;
  }

  private async getRenderedResult(
    mode: ComparisonMode,
    supportMode: SupportMode,
    interventionState: InterventionState,
    speakerPositionState: SpeakerPositionState,
    plan: ComparisonPlan,
    source: LoadedSource,
  ): Promise<RenderedResult> {
    const selectedResult =
      mode === "reference"
        ? referenceResultForIntervention(
            plan,
            interventionState,
            speakerPositionState,
          )
        : resultForSupportMode(
            plan,
            supportMode,
            interventionState,
            speakerPositionState,
          );
    const resultIdentity = selectedResult.resultIdentity;
    const cached = this.renderedResults.get(resultIdentity);

    if (cached) {
      return cached;
    }

    assertSourcePackageMetadata(source.buffers.map(metadataForBuffer));
    const { frameCount, sampleRate } = source.commonMetadata;
    const context = new OfflineAudioContext(2, frameCount, sampleRate);
    const leftInput = context.createGain();
    const rightInput = context.createGain();
    const merger = context.createChannelMerger(2);
    const sources = source.buffers.flatMap((buffer, index) => {
      const asset = source.manifest.assets[index];

      if (
        !asset ||
        contributionForAsset(
          selectedResult.sourceContributions,
          asset.file,
        ) === 0
      ) {
        return [];
      }

      const node = context.createBufferSource();
      node.buffer = buffer;

      if (asset.file === "focused-speech.wav") {
        const leftSpatialGain = context.createGain();
        const rightSpatialGain = context.createGain();
        leftSpatialGain.gain.value =
          selectedResult.focusedSpeechSpatial.leftChannelGain;
        rightSpatialGain.gain.value =
          selectedResult.focusedSpeechSpatial.rightChannelGain;
        node.connect(leftSpatialGain);
        node.connect(rightSpatialGain);
        leftSpatialGain.connect(leftInput);
        rightSpatialGain.connect(rightInput);
      } else {
        node.connect(leftInput);
        node.connect(rightInput);
      }

      return [node];
    });

    const transformed =
      mode === "simulated"
        ? resultForSupportMode(
            plan,
            supportMode,
            interventionState,
            speakerPositionState,
          )
        : null;
    const leftFilters = transformed?.leftFilters ?? [];
    const rightFilters = transformed?.rightFilters ?? [];
    connectFilterChain(context, leftInput, leftFilters, merger, 0);
    connectFilterChain(context, rightInput, rightFilters, merger, 1);
    merger.connect(context.destination);
    sources.forEach((sourceNode) => sourceNode.start(0));

    const buffer = await context.startRendering();
    const validation = validateRenderedAudio(buffer);
    const result = Object.freeze({
      buffer,
      validation,
      resultIdentity,
    });

    this.renderedResults.set(resultIdentity, result);
    return result;
  }

  private emergencySilence(active: ActivePlayback): void {
    try {
      active.gain.gain.cancelScheduledValues(0);
      active.gain.gain.value = 0;
      active.gain.disconnect();
      active.source.stop();
    } catch {
      // Output is already disconnected or stopped; remain fail-closed.
    }
  }
}
