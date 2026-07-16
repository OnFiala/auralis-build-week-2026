import { expect, test } from "@playwright/test";

test("public walking skeleton reaches its trusted health boundary", async ({ page, request }) => {
  const navigation = await page.goto("/");

  expect(navigation?.status()).toBe(200);
  expect(navigation?.headers()["www-authenticate"]).toBeUndefined();
  await expect(page.getByRole("heading", { name: "Auralis", level: 1 })).toBeVisible();
  await expect(page.getByText("This is the executable system shell.")).toBeVisible();
  await expect(page.getByText("The hearing experience is not implemented yet.")).toBeVisible();

  await page.getByRole("button", { name: "Check system status" }).click();
  await expect(page.getByRole("status")).toHaveText("System status: ready.");

  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  expect(health.headers()["www-authenticate"]).toBeUndefined();
  expect(health.headers()["cache-control"]).toContain("no-store");
  await expect(health.json()).resolves.toEqual({
    status: "ok",
    service: "auralis-shell",
    phase: "9-walking-skeleton",
  });
});
