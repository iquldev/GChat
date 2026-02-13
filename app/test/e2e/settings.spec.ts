import { test, expect } from "@playwright/test";

test.describe("Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should open and close settings modal", async ({ page }) => {
    await page.locator("button").first().click();

    const modal = page.locator("dialog[open]");
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Settings")).toBeVisible();

    const modalCloseButton = modal.locator("button").first();
    await modalCloseButton.click();
    await expect(page.locator("dialog[open]")).toHaveCount(0, {
      timeout: 10000,
    });
  });

  test("should update API key", async ({ page }) => {
    await page.locator("button").first().click();
    const modal = page.locator("dialog[open]");
    await expect(modal).toBeVisible({ timeout: 10000 });
    const apiKeyInput = modal.locator('input[placeholder="AIzaSyC..."]');
    await expect(apiKeyInput).toBeVisible();
    await apiKeyInput.fill("test-api-key");

    await expect(apiKeyInput).toHaveValue("test-api-key");
  });

  test("should change language", async ({ page }) => {
    await page.locator("button").first().click();
    const modal = page.locator("dialog[open]");
    await expect(modal).toBeVisible({ timeout: 10000 });

    const languageLabel = modal.locator("p", { hasText: "Language" });
    await expect(languageLabel).toBeVisible();
    const languageRow = languageLabel.locator("..");
    const selector = languageRow.locator('[role="combobox"]');

    await selector.click();
    await page.getByText("Русский").click();

    await expect(modal.getByText("Настройки")).toBeVisible({ timeout: 5000 });
  });
});
