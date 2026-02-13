import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Message from "~/components/chat/message.vue";

describe("Message", () => {
  const createMessage = (overrides: Record<string, unknown> = {}) => ({
    role: "user" as const,
    content: "Hello world",
    status: "sent" as const,
    timestamp: "2026-01-15T12:30:00.000Z",
    model: "gemini-3-flash",
    ...overrides,
  });

  const mountMessage = async (
    messageOverrides: Record<string, unknown> = {},
  ) => {
    return await mountSuspended(Message, {
      props: {
        message: createMessage(messageOverrides),
      },
    });
  };

  it("renders message content", async () => {
    const wrapper = await mountMessage({ content: "Test message content" });
    expect(wrapper.text()).toContain("Test message content");
  });

  it('displays "You" sender for user role', async () => {
    const wrapper = await mountMessage({ role: "user" });
    expect(wrapper.text()).toContain("You");
  });

  it('displays "AI" sender for model role', async () => {
    const wrapper = await mountMessage({ role: "model" });
    expect(wrapper.text()).toContain("AI");
  });

  it("aligns user messages to the right", async () => {
    const wrapper = await mountMessage({ role: "user" });
    const container = wrapper.find("div");
    expect(container.classes()).toContain("justify-end");
  });

  it("aligns model messages to the left", async () => {
    const wrapper = await mountMessage({ role: "model" });
    const container = wrapper.find("div");
    expect(container.classes()).toContain("justify-start");
  });

  it('shows ✅ for "sent" status', async () => {
    const wrapper = await mountMessage({ status: "sent" });
    expect(wrapper.text()).toContain("✅");
  });

  it('shows "Pending..." for "pending" status', async () => {
    const wrapper = await mountMessage({ status: "pending" });
    expect(wrapper.text()).toContain("Pending...");
  });

  it('shows model name for "received" status', async () => {
    const wrapper = await mountMessage({
      status: "received",
      model: "gemini-3-flash",
    });
    expect(wrapper.text()).toContain("gemini-3-flash");
  });

  it('shows "Error" for "error" status', async () => {
    const wrapper = await mountMessage({ status: "error" });
    expect(wrapper.text()).toContain("Error");
  });

  it("applies shimmer animation class for pending status", async () => {
    const wrapper = await mountMessage({ status: "pending" });
    const textEl = wrapper.find("p.text-base");
    expect(textEl.classes()).toContain("animate-text-shimmer");
  });

  it("does not apply shimmer animation for non-pending status", async () => {
    const wrapper = await mountMessage({ status: "sent" });
    const textEl = wrapper.find("p.text-base");
    expect(textEl.classes()).not.toContain("animate-text-shimmer");
  });

  it("formats timestamp correctly", async () => {
    const wrapper = await mountMessage({
      timestamp: "2026-01-15T14:30:00.000Z",
    });
    const text = wrapper.text();
    expect(text).toMatch(/\d{1,2}:\d{2}/);
  });

  it("handles invalid timestamp gracefully", async () => {
    const wrapper = await mountMessage({ timestamp: "invalid-date" });
    expect(wrapper.text()).toContain("Hello world");
  });

  it("applies error color class for error status", async () => {
    const wrapper = await mountMessage({ status: "error" });
    const statusSpan = wrapper.find("span");
    expect(statusSpan.classes()).toContain("text-(--ui-error)");
  });
});
