import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SidebarChat from "~/components/sidebar/SidebarChat.vue";

describe("SidebarChat", () => {
  const mountChat = async (props = {}) => {
    return await mountSuspended(SidebarChat, {
      props: {
        id: 1,
        title: "Test Chat Title",
        isSelected: false,
        ...props,
      },
    });
  };

  it("renders the chat title", async () => {
    const wrapper = await mountChat({ title: "My Chat" });
    expect(wrapper.text()).toContain("My Chat");
  });

  it("renders the delete button", async () => {
    const wrapper = await mountChat();
    const button = wrapper.find('button[title="Delete"]');
    expect(button.exists()).toBe(true);
  });

  it("renders title in a truncated paragraph", async () => {
    const wrapper = await mountChat();
    const p = wrapper.find("p");
    expect(p.exists()).toBe(true);
    expect(p.classes()).toContain("truncate");
  });

  it("applies selected background when isSelected is true", async () => {
    const wrapper = await mountChat({ isSelected: true });
    const container = wrapper.find("div");
    expect(container.classes()).toContain("bg-(--ui-background)");
  });

  it("does not apply selected background when isSelected is false", async () => {
    const wrapper = await mountChat({ isSelected: false });
    const container = wrapper.find("div");
    expect(container.classes()).not.toContain("bg-(--ui-background)");
  });

  it("applies secondary text color when isSelected is false", async () => {
    const wrapper = await mountChat({ isSelected: false });
    const container = wrapper.find("div");
    expect(container.classes()).toContain("text-(--ui-text-second)");
  });

  it("does not apply secondary text color when isSelected is true", async () => {
    const wrapper = await mountChat({ isSelected: true });
    const container = wrapper.find("div");
    expect(container.classes()).not.toContain("text-(--ui-text-second)");
  });

  it("has hover transition classes", async () => {
    const wrapper = await mountChat();
    const container = wrapper.find("div");
    expect(container.classes()).toContain("hover:cursor-pointer");
    expect(container.classes()).toContain("transition-all");
  });
});
