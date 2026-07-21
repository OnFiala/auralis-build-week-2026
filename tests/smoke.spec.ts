import { expect, test } from "@playwright/test";

test("public Auralis welcome reaches its trusted health boundary", async ({ page }) => {
  const configuredUrl = process.env.PLAYWRIGHT_BASE_URL;
  let authenticatedOrigin: string | undefined;

  if (configuredUrl) {
    const parsed = new URL(configuredUrl);

    if (parsed.searchParams.has("_vercel_share")) {
      await page.goto(parsed.toString(), { waitUntil: "domcontentloaded" });
      authenticatedOrigin = new URL(page.url()).origin;
    }
  }

  const pageUrl = authenticatedOrigin
    ? new URL("/", authenticatedOrigin).toString()
    : "/";
  const navigation = await page.goto(pageUrl);

  expect(navigation?.status()).toBe(200);
  expect(navigation?.headers()["www-authenticate"]).toBeUndefined();
  await expect(page).toHaveTitle("Auralis — See what hearing sounds like");
  const favicon = page.locator('link[rel~="icon"]').first();
  await expect(favicon).toHaveAttribute("href", /\/icon\.png/);
  await expect(page.getByRole("heading", { name: "Auralis", level: 1 })).toBeVisible();
  await expect(
    page.getByText(
      "Auralis turns an audiogram into a guided listening comparison.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Choose a hearing profile, step into an everyday family scene, and hear how distance, background sound, and communication support can change what reaches a listener.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Built to help families understand an everyday listening experience—not to diagnose hearing or recommend treatment.",
      {
      exact: true,
      },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Best experienced with headphones — AirPods Pro, AirPods Max, or any comfortable stereo headphones. Set a comfortable listening level before you begin.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Check system status" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Start the comparison" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a listening profile" }),
  ).toBeFocused();

  const healthUrl = authenticatedOrigin
    ? new URL("/api/health", authenticatedOrigin).toString()
    : "/api/health";
  const health = await page.context().request.get(healthUrl);
  expect(health.status()).toBe(200);
  expect(health.headers()["www-authenticate"]).toBeUndefined();
  expect(health.headers()["cache-control"]).toContain("no-store");
  await expect(health.json()).resolves.toEqual({
    status: "ok",
    service: "auralis-shell",
    phase: "9-walking-skeleton",
  });
});
