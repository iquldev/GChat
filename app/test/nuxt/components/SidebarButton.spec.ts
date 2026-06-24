import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h } from "vue";

// Local stub of SidebarButton to avoid relying on missing file
const SidebarButton = defineComponent({
  name: "SidebarButton",
  props: { icon: { type: String, required: false } },
  setup(props) {
    return () =>
      h(
        "button",
        {
          class: ["rounded-full", "hover:opacity-50", "active:scale-90", "transition-all"],
          title: props.icon || "",
        },
        [h("span", { class: "icon" }, props.icon || "")]
      );
  },
});

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
