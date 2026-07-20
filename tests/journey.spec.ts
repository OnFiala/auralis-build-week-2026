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
  await page
    .getByRole("checkbox", {
      name: /I have set my device to a low volume/,
    })
    .check();
  await page
    .getByRole("button", { name: "Load validated family scene" })
    .click();
  await expect(
    page.getByText("Family scene: ready, 64.0 s at 24000 Hz.", {
      exact: true,
    }).first(),
  ).toBeVisible({ timeout: 60_000 });
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

async function playAndStop(
  page: Page,
  buttonName: RegExp,
  playingState: string,
): Promise<void> {
  await page.getByRole("button", { name: buttonName }).click();
  await expect(
    page.getByText(playingState, { exact: true }),
  ).toBeVisible({ timeout: 60_000 });
  await page.getByRole("button", { name: "Stop immediately" }).click();
  await expect(
    page.getByText("Playback: stopped.", { exact: true }),
  ).toBeVisible();
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
    page.getByRole("heading", { name: "Prepare the family scene", level: 2 }),
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
  await continueToScreen(page, "Scene", "Prepare the family scene");
  await acknowledgeAndLoadSource(page);
  await assertAccessibleSceneTranscript(page);
  await continueToScreen(
    page,
    "Listening",
    "Compare the same family moment",
  );
  await page.getByRole("button", { name: /^Play source reference/ }).click();
  await expect(
    page.getByText("Playback: reference, TV on, Original position.", {
      exact: true,
    }),
  ).toBeVisible({ timeout: 60_000 });
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(
    page.getByRole("heading", { name: "Prepare the family scene", level: 2 }),
  ).toBeFocused();
  await continueToScreen(
    page,
    "Listening",
    "Compare the same family moment",
  );
  await expect(
    page.getByText("Playback: stopped.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Stop immediately" }),
  ).toBeDisabled();

  await playAndStop(
    page,
    /^Play source reference/,
    "Playback: reference, TV on, Original position.",
  );
  await playAndStop(
    page,
    /^Play no support result/,
    "Playback: No support, TV on, Original position.",
  );

  await page.getByRole("radio", { name: "Bilateral support" }).check();
  await playAndStop(
    page,
    /^Play bilateral support result/,
    "Playback: Bilateral support, TV on, Original position.",
  );
  await continueToScreen(
    page,
    "Interventions",
    "Change the listening conditions",
  );
  await page.getByRole("radio", { name: "TV off" }).check();
  await page.getByRole("radio", { name: "Closer, in front" }).check();
  await playAndStop(
    page,
    /^Play bilateral support result/,
    "Playback: Bilateral support, TV off, Closer, in front.",
  );
  await continueToScreen(
    page,
    "Explanation",
    "Explain the current result",
  );

  await page
    .getByRole("button", { name: "Generate live explanation" })
    .click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Live GPT explanation: current and grounded." }),
  ).toBeVisible();
  await continueToScreen(
    page,
    "Completion",
    "Complete this comparison",
  );
  await page.getByRole("button", { name: "Complete experience" }).click();

  const completionResult = page.locator(".completion-result");
  const completion = completionResult.getByRole("heading", {
    name: "Your current Auralis comparison",
  });
  await expect(completion).toBeVisible();
  await expect(
    completionResult.getByText("Complete — live", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("Manual audiogram", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("Bilateral support", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("TV off", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("Closer, in front", { exact: true }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("Live GPT", { exact: true }),
  ).toBeVisible();

  const visibleResultIdentity = (
    await completionResult.locator(".completion-summary code").textContent()
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
  await continueToScreen(page, "Scene", "Prepare the family scene");
  await acknowledgeAndLoadSource(page);
  await continueToScreen(
    page,
    "Listening",
    "Compare the same family moment",
  );
  await playAndStop(
    page,
    /^Play source reference/,
    "Playback: reference, TV on, Original position.",
  );
  await playAndStop(
    page,
    /^Play no support result/,
    "Playback: No support, TV on, Original position.",
  );
  await continueToScreen(
    page,
    "Interventions",
    "Change the listening conditions",
  );
  await continueToScreen(
    page,
    "Explanation",
    "Explain the current result",
  );

  await page
    .getByRole("button", { name: "Generate live explanation" })
    .click();
  await expect(
    page.getByRole("status").filter({
      hasText:
        "Live GPT explanation: degraded; deterministic audio remains available.",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Change the listening conditions",
      level: 2,
    }),
  ).toBeFocused();
  await playAndStop(
    page,
    /^Play source reference/,
    "Playback: reference, TV on, Original position.",
  );
  await continueToScreen(
    page,
    "Explanation",
    "Explain the current result",
  );
  await expect(
    page.getByRole("status").filter({
      hasText:
        "Live GPT explanation: degraded; deterministic audio remains available.",
    }),
  ).toBeVisible();
  await continueToScreen(
    page,
    "Completion",
    "Complete this comparison",
  );
  await page.getByRole("button", { name: "Complete experience" }).click();

  const completionResult = page.locator(".completion-result");
  await expect(
    completionResult.getByRole("heading", {
      name: "Your current Auralis comparison",
    }),
  ).toBeVisible();
  await expect(
    completionResult.getByText("Complete — degraded", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Live GPT", { exact: true })).toHaveCount(0);
  await expect(
    completionResult.getByText("Degraded", { exact: true }),
  ).toBeVisible();

  const visibleResultIdentity = (
    await completionResult.locator(".completion-summary code").textContent()
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
