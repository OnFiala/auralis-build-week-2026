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
  await expect(page.getByRole("heading", { name: "Auralis", level: 1 })).toBeVisible();
  await expect(
    page.getByText("One family scene. Different listening conditions.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "This is an illustrative, non-clinical experience—not a diagnosis, hearing-aid fitting, prescription, or prediction of individual perception.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Check system status" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Start the comparison" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a hearing profile" }),
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
