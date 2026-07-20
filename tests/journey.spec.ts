import {
  expect,
  test,
  type Download,
  type Page,
  type Route,
} from "@playwright/test";

import { FAMILY_DINNER_SOURCE_ID } from "../src/browser/audio";
import {
  MODEL_ID,
  MODEL_OPERATION,
  modelExplanationRequestSchema,
  type ModelExplanationRequest,
} from "../src/contracts/runtime";
import {
  FREQUENCY_GRID_HZ,
  frequencyKey,
  predefinedProfileById,
} from "../src/core/profile";

const manualValues = {
  right: [20, 25, 30, 35, 45, 55],
  left: [25, 30, 35, 45, 60, 70],
} as const;

function expectedAudiogramDescription(
  profileLabel: string,
  rightValues: readonly (number | string)[],
  leftValues: readonly (number | string)[],
): string {
  const describe = (values: readonly (number | string)[]) =>
    FREQUENCY_GRID_HZ.map(
      (frequency, index) => `${frequency} Hz: ${values[index]} dB HL`,
    ).join("; ");

  return `${profileLabel}. Right ear exact values: ${describe(
    rightValues,
  )}. Left ear exact values: ${describe(leftValues)}.`;
}

async function expectAudiogramProjection(
  page: Page,
  profileLabel: string,
  rightValues: readonly (number | string)[],
  leftValues: readonly (number | string)[],
): Promise<void> {
  const graph = page.getByRole("img", {
    name: `Bilateral audiogram for ${profileLabel}`,
  });

  await expect(graph).toBeVisible();
  await expect(graph).toHaveAccessibleDescription(
    expectedAudiogramDescription(profileLabel, rightValues, leftValues),
  );
}

async function openExperience(page: Page): Promise<void> {
  const navigation = await page.goto("/");

  expect(navigation?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Auralis", level: 1 }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start the comparison" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a hearing profile", level: 2 }),
  ).toBeFocused();
  await expect(page.getByRole("radio")).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Continue to Scene" }),
  ).toBeDisabled();
}

async function loadManualProfile(page: Page): Promise<void> {
  await page.getByRole("radio", { name: "Enter an audiogram" }).check();
  const exactTable = page.getByRole("table", {
    name: "Enter an audiogram: exact current thresholds",
  });

  await expect(exactTable).toBeVisible();

  for (const [ear, values] of Object.entries(manualValues) as [
    keyof typeof manualValues,
    (typeof manualValues)[keyof typeof manualValues],
  ][]) {
    for (const [index, frequency] of FREQUENCY_GRID_HZ.entries()) {
      const input = exactTable.getByRole("spinbutton", {
        name: `${ear} ear at ${frequency} Hz`,
      });

      await input.fill(String(values[index]));
      await expect(input).toHaveValue(String(values[index]));
    }
  }

  await expectAudiogramProjection(
    page,
    "Enter an audiogram",
    manualValues.right,
    manualValues.left,
  );
  await expect(
    page.getByRole("button", { name: "Continue to Scene" }),
  ).toBeDisabled();

  await page
    .getByRole("button", { name: "Confirm exact manual profile" })
    .click();
  await expect(
    page
      .getByText(/^Manual audiogram confirmed from revision \d+\.$/)
      .first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue to Scene" }),
  ).toBeEnabled();
}

async function continueToScreen(
  page: Page,
  screenName: string,
  headingName: string,
): Promise<void> {
  await page
    .getByRole("button", { name: `Continue to ${screenName}` })
    .click();
  await expect(
    page.getByRole("heading", { name: headingName, level: 2 }),
  ).toBeFocused();
}

async function acknowledgeAndLoadSource(page: Page): Promise<void> {
  const continueToListening = page.getByRole("button", {
    name: "Continue to Listening",
  });
  const sceneImage = page.getByRole("img", {
    name: "A multigenerational family talking in a living room, with a television on the left and kitchen activity on the right.",
  });
  const sourceList = page.getByRole("list", {
    name: "Family scene sound sources",
  });

  await expect(sceneImage).toBeVisible();
  await expect(sceneImage).toHaveAttribute(
    "src",
    /auralis-family-scene\.png/,
  );
  await expect(sourceList.getByRole("listitem")).toHaveCount(4);
  for (const source of [
    "Important speaker",
    "Overlapping speakers",
    "Television",
    "Kitchen / room",
  ]) {
    await expect(sourceList.getByText(source, { exact: true })).toBeVisible();
  }
  await expect(continueToListening).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toHaveCount(0);
  await expect(page.getByText(/^Playback:/)).toHaveCount(0);

  await page.getByRole("button", { name: "Load family scene" }).click();
  await expect(
    page.getByText("Family scene ready.", { exact: true }),
  ).toBeVisible({ timeout: 60_000 });
  await expect(continueToListening).toBeDisabled();
  await expect(page.getByText(/^Playback:/)).toHaveCount(0);

  await page
    .getByRole("checkbox", {
      name: /I’m listening at a low volume/,
    })
    .check();
  await expect(continueToListening).toBeEnabled();
}

async function assertAccessibleSceneTranscript(page: Page): Promise<number> {
  const manifestResponse = await page.request.get(
    "/media/family-dinner/manifest.json",
  );
  expect(manifestResponse.status()).toBe(200);

  const manifest = (await manifestResponse.json()) as {
    timeline?: unknown;
  };
  expect(Array.isArray(manifest.timeline)).toBe(true);

  const timeline = manifest.timeline as {
    startSeconds: number;
    speaker: string;
    text: string;
  }[];
  const transcript = page.locator("details.scene-transcript");
  const summary = transcript.getByText("Scene transcript", { exact: true });

  await summary.focus();
  await expect(summary).toBeFocused();
  await summary.press("Enter");
  await expect(transcript).toHaveAttribute("open", "");

  const entries = transcript.getByRole("listitem");
  await expect(entries).toHaveCount(timeline.length);

  for (const [index, expected] of timeline.entries()) {
    const entry = entries.nth(index);
    const time = entry.locator("time");

    await expect(time).toHaveAttribute("datetime", `PT${expected.startSeconds}S`);
    const [minutes, seconds] = ((await time.textContent()) ?? "").split(":");
    expect(Number(minutes) * 60 + Number(seconds)).toBe(expected.startSeconds);
    await expect(entry.locator(".transcript-speaker")).toHaveText(
      expected.speaker,
    );
    await expect(entry.locator(".transcript-text")).toHaveText(expected.text);
  }

  const renderedTranscript = (await transcript.textContent()) ?? "";
  expect(renderedTranscript).not.toMatch(
    /leftThresholdsDbHl|rightThresholdsDbHl|frequencyGridHz|manualDraft/,
  );
  expect(renderedTranscript).not.toMatch(
    /OPENAI_API_KEY|sk-[A-Za-z0-9]|sourceIdentity|sha256|\/Users\/|_vercel_share/,
  );

  return timeline.length;
}

async function playInterventionAndStop(
  page: Page,
  buttonName: string,
  cardSelector: string,
  preparingState: string,
  playingState: string,
  stoppedState: string,
): Promise<void> {
  const interventionsScreen = page.locator(".interventions-screen");
  const status = interventionsScreen.locator(".intervention-transport-status");
  const card = interventionsScreen.locator(cardSelector);
  const continueToExplanation = page.getByRole("button", {
    name: "Continue to Explanation",
  });

  await page.getByRole("button", { name: buttonName }).click();
  expect([preparingState, playingState]).toContain(await status.textContent());
  const cardIdentityClass = cardSelector.slice(1);
  expect([
    `intervention-ab-card ${cardIdentityClass} intervention-ab-card-preparing`,
    `intervention-ab-card ${cardIdentityClass} intervention-ab-card-playing`,
  ]).toContain(await card.getAttribute("class"));
  await expect(status).toHaveText(playingState, { timeout: 60_000 });
  await expect(card).toHaveClass(/intervention-ab-card-playing/);
  await expect(card.getByText("Now playing", { exact: true })).toBeVisible();
  await expect(continueToExplanation).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Stop immediately" }).click();
  await expect(status).toHaveText(stoppedState);
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeDisabled();
  await expect(continueToExplanation).toBeEnabled();
}

async function playListeningAndStop(
  page: Page,
  buttonName: string,
  cardSelector: string,
  preparingState: string,
  playingState: string,
): Promise<void> {
  const status = page.locator(".listening-transport-status");
  const card = page.locator(cardSelector);

  await page.getByRole("button", { name: buttonName }).click();
  expect([preparingState, playingState]).toContain(await status.textContent());
  const cardIdentityClass = cardSelector.slice(1);
  expect([
    `ab-playback-card ${cardIdentityClass} ab-playback-card-preparing`,
    `ab-playback-card ${cardIdentityClass} ab-playback-card-playing`,
  ]).toContain(await card.getAttribute("class"));
  await expect(status).toHaveText(playingState, { timeout: 60_000 });
  await expect(card).toHaveClass(/ab-playback-card-playing/);
  await expect(card.getByText("Now playing", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue to Interventions" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Stop immediately" }).click();
  await expect(status).toHaveText(
    "Playback stopped · A and B controls are ready.",
  );
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeDisabled();
}

function assertSanitizedEvidence(
  raw: string,
  evidence: Record<string, unknown>,
): void {
  expect(Object.keys(evidence).sort()).toEqual([
    "completionStatus",
    "explanation",
    "generatedAt",
    "limitation",
    "profile",
    "resultIdentity",
    "schemaVersion",
    "sourceIdentity",
    "speakerPositionState",
    "supportMode",
    "televisionState",
  ]);
  expect(raw).not.toMatch(
    /leftThresholdsDbHl|rightThresholdsDbHl|frequencyGridHz|manualDraft/,
  );
  expect(raw).not.toMatch(
    /OPENAI_API_KEY|sk-[A-Za-z0-9]|sceneFraming|audibleChange|responseId|runId|attemptId/,
  );
  expect(raw).not.toMatch(/file:\/\/|\/Users\/|_vercel_share/);

  const containsArray = (value: unknown): boolean =>
    Array.isArray(value) ||
    (typeof value === "object" &&
      value !== null &&
      Object.values(value).some(containsArray));

  expect(containsArray(evidence)).toBe(false);
}

async function downloadedEvidence(
  page: Page,
): Promise<Readonly<{ raw: string; value: Record<string, unknown> }>> {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download evidence" }).click();
  const download: Download = await downloadPromise;
  const stream = await download.createReadStream();

  if (!stream) {
    throw new Error("The evidence download did not expose a readable stream.");
  }

  let raw = "";
  for await (const chunk of stream) {
    raw += chunk.toString();
  }

  expect(download.suggestedFilename()).toMatch(
    /^auralis-evidence-.+\.json$/,
  );

  return {
    raw,
    value: JSON.parse(raw) as Record<string, unknown>,
  };
}

function parseModelRequest(route: Route): ModelExplanationRequest {
  const rawRequest = route.request().postDataJSON();
  const serialized = JSON.stringify(rawRequest);

  expect(serialized).not.toMatch(
    /leftThresholdsDbHl|rightThresholdsDbHl|frequencyGridHz|manualDraft/,
  );
  expect(serialized).not.toMatch(/OPENAI_API_KEY|sk-[A-Za-z0-9]/);

  return modelExplanationRequestSchema.parse(rawRequest);
}

test("manual profile completes one attributable live journey", async ({
  page,
}) => {
  let modelCalls = 0;
  let capturedRequest: ModelExplanationRequest | null = null;

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/model", async (route) => {
    modelCalls += 1;
    const request = parseModelRequest(route);
    capturedRequest = request;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      json: {
        status: "live",
        operation: MODEL_OPERATION,
        runId: request.runId,
        attemptId: request.attemptId,
        attemptNumber: request.attemptNumber,
        groundingRevision: request.groundingRevision,
        sourceIdentity: request.sourceIdentity,
        resultIdentity: request.resultIdentity,
        model: MODEL_ID,
        responseId: "journey-live-response",
        sceneFraming: "A synthetic family dinner is in progress.",
        audibleChange:
          "Bilateral support is active, TV off removes the television contribution, and Closer, in front changes only the focused speaker position.",
        unchanged:
          "The same source identity, timeline, overlapping speech, and room events remain in use.",
        limitation: "Individual perception can differ.",
      },
    });
  });

  await openExperience(page);
  await loadManualProfile(page);
  const continueToScene = page.getByRole("button", {
    name: "Continue to Scene",
  });
  await continueToScene.focus();
  await continueToScene.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Meet the family scene", level: 2 }),
  ).toBeFocused();
  await expect(page.locator(".experience-screen")).toHaveCSS(
    "animation-name",
    "none",
  );

  const backToProfile = page.getByRole("button", { name: "Back" });
  await backToProfile.focus();
  await backToProfile.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Choose a hearing profile", level: 2 }),
  ).toBeFocused();
  await expect(
    page
      .getByText(/^Manual audiogram confirmed from revision \d+\.$/)
      .first(),
  ).toBeVisible();
  await continueToScreen(page, "Scene", "Meet the family scene");
  await acknowledgeAndLoadSource(page);
  await assertAccessibleSceneTranscript(page);
  await continueToScreen(
    page,
    "Listening",
    "Compare the same family moment",
  );
  const listeningScreen = page.locator(".listening-screen");
  const referenceCard = listeningScreen.locator(".ab-playback-card-a");
  const resultCard = listeningScreen.locator(".ab-playback-card-b");
  const primaryControls = listeningScreen.locator(
    ".ab-play-button, .listening-support-selector",
  );
  const continueToInterventions = page.getByRole("button", {
    name: "Continue to Interventions",
  });

  await expect(referenceCard.getByText("Source reference")).toBeVisible();
  await expect(referenceCard).not.toContainText(
    /No support|Left-ear support|Bilateral support/,
  );
  await expect(resultCard.getByText("Illustrative result")).toBeVisible();
  await expect(
    resultCard.getByText("Support applies only to B.", { exact: true }),
  ).toBeVisible();
  await expect(primaryControls).toHaveCount(3);
  await expect(primaryControls.nth(0)).toHaveAccessibleName(
    "Play A — Source reference",
  );
  await expect(primaryControls.nth(1)).toHaveAccessibleName(
    "Play B — No support illustrative result",
  );
  await expect(primaryControls.nth(2)).toHaveAccessibleName(
    "Illustrative support for B",
  );
  await expect(listeningScreen.getByRole("radio")).toHaveCount(3);
  await expect(
    listeningScreen.locator(".listening-transport-status"),
  ).toHaveText("Playback stopped · A and B controls are ready.");
  await expect(continueToInterventions).toBeDisabled();

  await page
    .getByRole("button", { name: "Play A — Source reference" })
    .click();
  await expect(
    listeningScreen.locator(".listening-transport-status"),
  ).toHaveText(
    "Preparing A · Source reference · TV on · Original position",
  );
  await expect(referenceCard).toHaveClass(/ab-playback-card-preparing/);
  await expect(
    listeningScreen.locator(".listening-transport-status"),
  ).toHaveText("Playing A · Source reference · TV on · Original position", {
    timeout: 60_000,
  });
  await expect(referenceCard).toHaveClass(/ab-playback-card-playing/);
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(
    page.getByRole("heading", { name: "Meet the family scene", level: 2 }),
  ).toBeFocused();
  await continueToScreen(
    page,
    "Listening",
    "Compare the same family moment",
  );
  await expect(
    page.locator(".listening-transport-status"),
  ).toHaveText("Playback stopped · A and B controls are ready.");
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeDisabled();
  await expect(continueToInterventions).toBeDisabled();

  await playListeningAndStop(
    page,
    "Play A — Source reference",
    ".ab-playback-card-a",
    "Preparing A · Source reference · TV on · Original position",
    "Playing A · Source reference · TV on · Original position",
  );
  await expect(continueToInterventions).toBeDisabled();

  await playListeningAndStop(
    page,
    "Play B — No support illustrative result",
    ".ab-playback-card-b",
    "Preparing B · No support · TV on · Original position",
    "Playing B · No support · TV on · Original position",
  );
  await expect(continueToInterventions).toBeEnabled();

  await page.getByRole("radio", { name: "Bilateral support" }).check();
  await expect(continueToInterventions).toBeDisabled();
  await playListeningAndStop(
    page,
    "Play B — Bilateral support illustrative result",
    ".ab-playback-card-b",
    "Preparing B · Bilateral support · TV on · Original position",
    "Playing B · Bilateral support · TV on · Original position",
  );
  await expect(continueToInterventions).toBeEnabled();
  await continueToScreen(
    page,
    "Interventions",
    "Change the communication conditions",
  );

  const interventionsScreen = page.locator(".interventions-screen");
  const interventionGroups = interventionsScreen.locator(
    ".intervention-control-grid fieldset",
  );
  const interventionStateSummary = interventionsScreen.locator(
    ".intervention-state-summary",
  );
  const supportContext = interventionsScreen.locator(
    ".intervention-support-context",
  );
  const continueToExplanation = page.getByRole("button", {
    name: "Continue to Explanation",
  });
  const interventionTransport = interventionsScreen.locator(
    ".intervention-transport-status",
  );
  const sourceState = (source: string) =>
    interventionStateSummary.locator(`[data-source="${source}"] dd`);

  await expect(interventionGroups).toHaveCount(2);
  await expect(interventionsScreen.getByRole("radio")).toHaveCount(4);
  await expect(supportContext.getByRole("radio")).toHaveCount(0);
  await expect(
    interventionsScreen.getByRole("heading", {
      name: "Source reference",
      level: 4,
    }),
  ).toBeVisible();
  await expect(
    interventionsScreen.getByRole("heading", {
      name: "Current illustrative result",
      level: 4,
    }),
  ).toBeVisible();
  await expect(supportContext).toContainText("Bilateral support");
  await expect(supportContext.locator("dl div").nth(0).locator("dt")).toHaveText(
    "Right ear",
  );
  await expect(supportContext.locator("dl div").nth(0).locator("dd")).toHaveText(
    "Illustrative support",
  );
  await expect(supportContext.locator("dl div").nth(1).locator("dt")).toHaveText(
    "Left ear",
  );
  await expect(supportContext.locator("dl div").nth(1).locator("dd")).toHaveText(
    "Illustrative support",
  );
  await expect(
    interventionsScreen.getByRole("radio", { name: "TV on" }),
  ).toBeChecked();
  await expect(
    interventionsScreen.getByRole("radio", { name: "Original position" }),
  ).toBeChecked();
  await expect(sourceState("important-speaker")).toHaveText(
    "Original position",
  );
  await expect(sourceState("overlapping-speakers")).toHaveText("Included");
  await expect(sourceState("television")).toHaveText("Included");
  await expect(sourceState("kitchen-room")).toHaveText("Included");
  await expect(interventionTransport).toHaveText(
    "Playback stopped · Current result ready · Bilateral support · TV on · Original position",
  );
  await expect(continueToExplanation).toBeEnabled();

  await page.getByRole("radio", { name: "TV off" }).check();
  await expect(sourceState("television")).toHaveText("Removed from audio");
  await expect(sourceState("important-speaker")).toHaveText(
    "Original position",
  );
  await expect(sourceState("overlapping-speakers")).toHaveText("Included");
  await expect(sourceState("kitchen-room")).toHaveText("Included");
  await expect(interventionTransport).toHaveText(
    "Playback stopped · Conditions changed · Play B to prepare the current illustrative result.",
  );
  await expect(continueToExplanation).toBeDisabled();
  await expect(
    interventionsScreen.locator(".intervention-ab-card-b"),
  ).toContainText("Needs refresh");

  await playInterventionAndStop(
    page,
    "Play B — Bilateral support current illustrative result",
    ".intervention-ab-card-b",
    "Preparing B · Bilateral support · TV off · Original position",
    "Playing B · Bilateral support · TV off · Original position",
    "Playback stopped · Current result ready · Bilateral support · TV off · Original position",
  );

  await page.getByRole("radio", { name: "Closer, in front" }).check();
  await expect(sourceState("important-speaker")).toHaveText(
    "Closer, in front",
  );
  await expect(sourceState("television")).toHaveText("Removed from audio");
  await expect(sourceState("overlapping-speakers")).toHaveText("Included");
  await expect(sourceState("kitchen-room")).toHaveText("Included");
  await expect(interventionTransport).toHaveText(
    "Playback stopped · Conditions changed · Play B to prepare the current illustrative result.",
  );
  await expect(continueToExplanation).toBeDisabled();

  await playInterventionAndStop(
    page,
    "Play B — Bilateral support current illustrative result",
    ".intervention-ab-card-b",
    "Preparing B · Bilateral support · TV off · Closer, in front",
    "Playing B · Bilateral support · TV off · Closer, in front",
    "Playback stopped · Current result ready · Bilateral support · TV off · Closer, in front",
  );
  await continueToScreen(
    page,
    "Explanation",
    "Understand this result",
  );

  const explanationScreen = page.locator(".explanation-screen");
  const deterministicSummary = explanationScreen.locator(
    ".explanation-deterministic-summary",
  );
  const continueToCompletion = page.getByRole("button", {
    name: "Continue to Completion",
  });

  await expect(deterministicSummary).toBeVisible();
  await expect(
    deterministicSummary.getByRole("heading", { name: "What you compared" }),
  ).toBeVisible();
  await expect(deterministicSummary).toContainText("Manual audiogram");
  await expect(deterministicSummary).toContainText("Manually entered");
  await expect(deterministicSummary).toContainText("Bilateral support");
  await expect(deterministicSummary).toContainText("Right ear");
  await expect(deterministicSummary).toContainText("Left ear");
  await expect(deterministicSummary).toContainText("TV off");
  await expect(deterministicSummary).toContainText("Closer, in front");
  await expect(deterministicSummary).toContainText(
    "Same validated family scene and timeline",
  );
  await expect(continueToCompletion).toBeDisabled();
  expect(modelCalls).toBe(0);

  await page.getByRole("button", { name: "Generate explanation" }).click();
  await expect(
    explanationScreen.getByRole("status").filter({
      hasText:
        "Live GPT explanation is current for this deterministic comparison.",
    }),
  ).toBeVisible();
  const liveExplanation = explanationScreen.locator(".model-result-live");
  await expect(
    liveExplanation.getByText("Live GPT", { exact: true }),
  ).toBeVisible();
  await expect(liveExplanation).toContainText(
    "A synthetic family dinner is in progress.",
  );
  await expect(liveExplanation).toContainText(
    "Bilateral support is active, TV off removes the television contribution, and Closer, in front changes only the focused speaker position.",
  );
  await expect(liveExplanation).toContainText(
    "The same source identity, timeline, overlapping speech, and room events remain in use.",
  );
  await expect(liveExplanation).toContainText(
    "Individual perception can differ.",
  );
  await expect(continueToCompletion).toBeEnabled();
  expect(modelCalls).toBe(1);
  await continueToScreen(
    page,
    "Completion",
    "Your Auralis comparison",
  );

  const completionResult = page.locator(".completion-result");
  const completion = completionResult.getByText("Comparison complete", {
    exact: true,
  });
  await expect(completion).toBeVisible();
  await expect(
    completionResult.getByRole("heading", { name: "Attributable summary" }),
  ).toBeVisible();
  const completionSummary = completionResult.locator(".completion-summary");
  await expect(
    completionSummary.getByText("Manual audiogram", { exact: true }),
  ).toBeVisible();
  await expect(
    completionSummary.getByText("Bilateral support", { exact: true }),
  ).toBeVisible();
  await expect(
    completionSummary.getByText("TV off", { exact: true }),
  ).toBeVisible();
  await expect(
    completionSummary.getByText("Closer, in front", { exact: true }),
  ).toBeVisible();
  await expect(
    completionSummary.getByText("Live GPT", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.getByRole("button", { name: "Review explanation" }),
  ).toBeVisible();

  const visibleResultIdentity = (
    await completionResult.locator(".completion-details code").textContent()
  )?.trim();
  const { raw, value: evidence } = await downloadedEvidence(page);
  const profile = evidence.profile as Record<string, unknown>;
  const explanation = evidence.explanation as Record<string, unknown>;

  expect(modelCalls).toBe(1);
  expect(capturedRequest).not.toBeNull();
  expect(evidence).toMatchObject({
    schemaVersion: "auralis-evidence-v1",
    sourceIdentity: FAMILY_DINNER_SOURCE_ID,
    resultIdentity: visibleResultIdentity,
    supportMode: "bilateral",
    televisionState: "tv-off",
    speakerPositionState: "closer-in-front",
    completionStatus: "complete-live",
  });
  expect(profile).toEqual({
    label: "Manual audiogram",
    origin: "manual",
    predefinedProfileId: null,
  });
  expect(explanation).toEqual({ status: "live", model: MODEL_ID });
  assertSanitizedEvidence(raw, evidence);

  await page
    .getByRole("button", { name: "Start another comparison" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Choose a hearing profile", level: 2 }),
  ).toBeFocused();
  await expect(completion).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Continue to Scene" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Download evidence" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Review explanation" }),
  ).toHaveCount(0);
});

test("predefined profile completes one honest degraded journey", async ({
  page,
}) => {
  let modelCalls = 0;

  await page.route("**/api/model", async (route) => {
    modelCalls += 1;
    const request = parseModelRequest(route);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      json: {
        status: "degraded",
        operation: MODEL_OPERATION,
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
  });

  await openExperience(page);
  const flatProfile = predefinedProfileById("flat-hearing-loss");

  await page.getByRole("radio", { name: "Flat hearing loss" }).check();
  const flatRightValues = FREQUENCY_GRID_HZ.map(
    (frequency) => flatProfile.rightThresholdsDbHl[frequencyKey(frequency)],
  );
  const flatLeftValues = FREQUENCY_GRID_HZ.map(
    (frequency) => flatProfile.leftThresholdsDbHl[frequencyKey(frequency)],
  );

  await expectAudiogramProjection(
    page,
    flatProfile.displayName,
    flatRightValues,
    flatLeftValues,
  );

  const exactFlatTable = page.getByRole("table", {
    name: `${flatProfile.displayName}: exact fixed synthetic thresholds`,
  });
  const flatRows = exactFlatTable.getByRole("row");

  await expect(flatRows).toHaveCount(FREQUENCY_GRID_HZ.length + 1);
  for (const [index, frequency] of FREQUENCY_GRID_HZ.entries()) {
    const valueCells = flatRows.nth(index + 1).getByRole("cell");
    const key = frequencyKey(frequency);

    await expect(valueCells.nth(0)).toHaveText(
      String(flatProfile.rightThresholdsDbHl[key]),
    );
    await expect(valueCells.nth(1)).toHaveText(
      String(flatProfile.leftThresholdsDbHl[key]),
    );
  }

  await expect(
    page.getByRole("button", { name: "Continue to Scene" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Confirm Flat hearing loss" })
    .click();
  await expect(
    page.getByRole("button", { name: "Continue to Scene" }),
  ).toBeEnabled();
  await continueToScreen(page, "Scene", "Meet the family scene");
  await acknowledgeAndLoadSource(page);
  await continueToScreen(
    page,
    "Listening",
    "Compare the same family moment",
  );
  await playListeningAndStop(
    page,
    "Play A — Source reference",
    ".ab-playback-card-a",
    "Preparing A · Source reference · TV on · Original position",
    "Playing A · Source reference · TV on · Original position",
  );
  await playListeningAndStop(
    page,
    "Play B — No support illustrative result",
    ".ab-playback-card-b",
    "Preparing B · No support · TV on · Original position",
    "Playing B · No support · TV on · Original position",
  );
  await continueToScreen(
    page,
    "Interventions",
    "Change the communication conditions",
  );
  await continueToScreen(
    page,
    "Explanation",
    "Understand this result",
  );

  const explanationScreen = page.locator(".explanation-screen");
  const deterministicSummary = explanationScreen.locator(
    ".explanation-deterministic-summary",
  );
  const continueToCompletion = page.getByRole("button", {
    name: "Continue to Completion",
  });

  await expect(deterministicSummary).toBeVisible();
  await expect(deterministicSummary).toContainText("Flat hearing loss");
  await expect(deterministicSummary).toContainText("Synthetic predefined");
  await expect(deterministicSummary).toContainText("No support");
  await expect(deterministicSummary).toContainText("TV on");
  await expect(deterministicSummary).toContainText("Original position");
  await expect(continueToCompletion).toBeDisabled();
  expect(modelCalls).toBe(0);

  await page.getByRole("button", { name: "Generate explanation" }).click();
  await expect(
    explanationScreen.getByRole("status").filter({
      hasText:
        "Live GPT unavailable; the deterministic comparison remains complete and usable.",
    }),
  ).toBeVisible();
  await expect(
    explanationScreen.locator(".degraded-core-message"),
  ).toHaveText(
    "Live GPT unavailable; the deterministic comparison remains complete and usable.",
  );
  await expect(explanationScreen.locator(".model-result-degraded")).toContainText(
    "Live GPT explanation is unavailable. The deterministic audio comparison remains available.",
  );
  await expect(continueToCompletion).toBeEnabled();
  expect(modelCalls).toBe(1);

  await page.getByRole("button", { name: "Back" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Change the communication conditions",
      level: 2,
    }),
  ).toBeFocused();
  await playInterventionAndStop(
    page,
    "Play A — Source reference for current conditions",
    ".intervention-ab-card-a",
    "Preparing A · Source reference · TV on · Original position",
    "Playing A · Source reference · TV on · Original position",
    "Playback stopped · Current result ready · No support · TV on · Original position",
  );
  await continueToScreen(
    page,
    "Explanation",
    "Understand this result",
  );
  await expect(
    explanationScreen.getByRole("status").filter({
      hasText:
        "Live GPT unavailable; the deterministic comparison remains complete and usable.",
    }),
  ).toBeVisible();
  expect(modelCalls).toBe(1);
  await continueToScreen(
    page,
    "Completion",
    "Your Auralis comparison",
  );

  const completionResult = page.locator(".completion-result");
  await expect(
    completionResult.getByRole("heading", {
      name: "Attributable summary",
    }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("Comparison complete", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Live GPT", { exact: true })).toHaveCount(0);
  const completionSummary = completionResult.locator(".completion-summary");
  await expect(
    completionSummary.getByText("Degraded", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.locator(".completion-degraded-truth"),
  ).toHaveText(
    "The deterministic comparison completed successfully; only Live GPT availability was limited.",
  );
  await expect(
    completionResult.getByRole("button", { name: "Review explanation" }),
  ).toBeVisible();

  const visibleResultIdentity = (
    await completionResult.locator(".completion-details code").textContent()
  )?.trim();
  const { raw, value: evidence } = await downloadedEvidence(page);

  expect(modelCalls).toBe(1);
  expect(evidence).toMatchObject({
    schemaVersion: "auralis-evidence-v1",
    sourceIdentity: FAMILY_DINNER_SOURCE_ID,
    resultIdentity: visibleResultIdentity,
    profile: {
      label: "Flat hearing loss",
      origin: "predefined",
      predefinedProfileId: "flat-hearing-loss",
    },
    supportMode: "none",
    televisionState: "tv-on",
    speakerPositionState: "original-position",
    completionStatus: "complete-degraded",
    explanation: {
      status: "degraded",
      model: null,
    },
  });
  assertSanitizedEvidence(raw, evidence);
});
