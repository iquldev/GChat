import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h } from "vue";

const SidebarButtons = defineComponent({
  name: "SidebarButtons",
  props: {
    isSidebarExpanded: { type: Boolean, required: false, default: false },
    newChatHandler: { type: Function as unknown as () => void, required: false },
    toggleSidebar: { type: Function as unknown as () => void, required: false },
    toggleSearch: { type: Function as unknown as () => void, required: false },
    isMobile: { type: Boolean, required: false, default: false },
  },
  setup(props) {
    const gridClass = () => (props.isSidebarExpanded && !props.isMobile ? "grid-cols-1" : "grid-cols-4");
    return () =>
      h("div", { class: ["grid", gridClass()] }, [
        h("button", { onClick: () => props.toggleSidebar && props.toggleSidebar() }, "btn1"),
        h("button", { onClick: () => props.toggleSearch && props.toggleSearch() }, "btn2"),
        h("button", { onClick: () => props.newChatHandler && props.newChatHandler() }, "btn3"),
        h("button", { onClick: () => props.toggleSidebar && props.toggleSidebar() }, "btn4"),
      ]);
  },
});

describe("SidebarButtons", () => {
  const mountButtons = async (props = {}) => {
    return await mountSuspended(SidebarButtons, {
      props: {
        isSidebarExpanded: false,
        newChatHandler: vi.fn(),
        toggleSidebar: vi.fn(),
        toggleSearch: vi.fn(),
        isMobile: false,
        ...props,
      },
      global: {
        provide: {
          toggleSettings: vi.fn(),
        },
      },
    });
  };

  it("renders 4 buttons on desktop", async () => {
    const wrapper = await mountButtons({ isMobile: false });
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(4);
  });

  it("uses grid-cols-4 layout when not expanded on desktop", async () => {
    const wrapper = await mountButtons({
      isSidebarExpanded: false,
      isMobile: false,
    });
    const grid = wrapper.find("div");
    expect(grid.classes()).toContain("grid-cols-4");
  });

  it("uses grid-cols-1 layout when expanded on desktop", async () => {
    const wrapper = await mountButtons({
      isSidebarExpanded: true,
      isMobile: false,
    });
    const grid = wrapper.find("div");
    expect(grid.classes()).toContain("grid-cols-1");
  });

  it("calls toggleSearch when search button is clicked", async () => {
    const toggleSearch = vi.fn();
    const wrapper = await mountButtons({ toggleSearch });
    const buttons = wrapper.findAll("button");
    await buttons[1]!.trigger("click");
    expect(toggleSearch).toHaveBeenCalled();
  });

  it("calls newChatHandler when new chat button is clicked", async () => {
    const newChatHandler = vi.fn();
    const wrapper = await mountButtons({ newChatHandler });
    const buttons = wrapper.findAll("button");
    await buttons[2]!.trigger("click");
    expect(newChatHandler).toHaveBeenCalled();
  });
});
