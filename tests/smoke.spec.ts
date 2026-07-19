import { expect, test } from "@playwright/test";

test("public walking skeleton reaches its trusted health boundary", async ({ page }) => {
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
  await expect(page.getByText("This is the executable system shell.")).toBeVisible();
  await expect(page.getByText("The hearing experience is not implemented yet.")).toBeVisible();

  await page.getByRole("button", { name: "Check system status" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "System status: ready." }),
  ).toHaveText("System status: ready.");

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
