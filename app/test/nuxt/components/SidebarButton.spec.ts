import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SidebarButton from "~/components/sidebar/SidebarButton.vue";

describe("SidebarButton", () => {
  const mountButton = async (icon = "lucide:settings") => {
    return await mountSuspended(SidebarButton, {
      props: { icon },
    });
  };

  it("renders a button element", async () => {
    const wrapper = await mountButton();
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("renders with rounded-full class", async () => {
    const wrapper = await mountButton();
    expect(wrapper.find("button").classes()).toContain("rounded-full");
  });

  it("renders an icon element inside the button", async () => {
    const wrapper = await mountButton("lucide:search");
    const button = wrapper.find("button");
    expect(button.element.children.length).toBeGreaterThan(0);
  });

  it("has hover and active transition classes", async () => {
    const wrapper = await mountButton();
    const button = wrapper.find("button");
    expect(button.classes()).toContain("hover:opacity-50");
    expect(button.classes()).toContain("active:scale-90");
    expect(button.classes()).toContain("transition-all");
  });
});
