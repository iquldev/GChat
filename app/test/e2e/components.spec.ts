import { test, expect } from "@playwright/test";

test.describe("Chat Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("New Chat should allow sending messages", async ({ page }) => {
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();

    const sendButton = page.locator('button[aria-label="Send"]');
    await expect(sendButton).toBeDisabled();

    await textarea.fill("Hello AI!");
    await expect(sendButton).toBeEnabled();
  });

  test("Selector should allow picking options", async ({ page }) => {
    await page.locator("button").first().click();
    const modal = page.locator("dialog[open]");
    await expect(modal).toBeVisible({ timeout: 10000 });

    const themeLabel = modal.locator("p", { hasText: "Theme" });
    await expect(themeLabel).toBeVisible();
    const themeRow = themeLabel.locator("..");
    const selector = themeRow.locator('[role="combobox"]');

    await selector.click();
    const darkOption = page.getByText("Dark", { exact: true });
    await expect(darkOption).toBeVisible();

    await darkOption.click();
    await expect(selector).toContainText("Dark");

    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });
});
