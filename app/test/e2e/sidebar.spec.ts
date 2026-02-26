import { test, expect } from "@playwright/test";

test.describe("Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "gchat:chats",
        JSON.stringify([
          {
            id: 123456789,
            title: "The connections",
            content: [
              {
                id: 1,
                role: "user",
                parts: [{ text: "The connections" }],
                status: "sent",
                timestamp: new Date().toISOString(),
              },
            ],
          },
        ]),
      );
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("should be visible and toggle expansion", async ({ page }) => {
    const sidebar = page.locator(".rounded-4xl").first();
    await expect(sidebar).toBeVisible();
    const buttons = sidebar.locator("button");
    const toggleButton = buttons.nth(3);

    await toggleButton.click();

    await expect(sidebar).toHaveClass(/rounded-full/, { timeout: 5000 });
  });

  test("should allow searching chats", async ({ page }) => {
    const sidebar = page.locator(".rounded-4xl").first();
    const searchButton = sidebar.locator("button").nth(1);
    await searchButton.click();
    const searchInput = page.locator('input[placeholder="Search..."]');
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    await searchInput.fill("The connections");

    const chatItem = page.getByText("The connections", { exact: false });
    await expect(chatItem.first()).toBeVisible();
  });

  test("should navigate to a chat when clicked", async ({ page }) => {
    const chatItem = page
      .getByText("The connections", { exact: false })
      .first();
    await expect(chatItem).toBeVisible({ timeout: 5000 });
    await chatItem.click();

    await expect(page).toHaveURL(/\/chat\/\d+/, { timeout: 10000 });
  });
});
