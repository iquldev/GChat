import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import Selector from "~/components/selector.vue";

vi.mock("motion-v", () => ({
  motion: {
    div: {
      template: "<div><slot /></div>",
    },
  },
}));

describe("Selector Component", () => {
  const options = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ];

  it("renders the current label", () => {
    const wrapper: VueWrapper<any> = mount(Selector, {
      props: {
        options,
        modelValue: "opt1",
        "onUpdate:modelValue": (val?: string | number) =>
          wrapper.setProps({ modelValue: val }),
      },
    });

    expect(wrapper.text()).toContain("Option 1");
  });

  it("opens dropdown on click", async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: "opt1",
      },
    });

    await wrapper.find("div.cursor-pointer").trigger("click");
    expect(wrapper.find(".absolute.top-full").exists()).toBe(true);
  });

  it("selects an option and closes dropdown", async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: "opt1",
      },
    });

    await wrapper.find("div.cursor-pointer").trigger("click");

    const item = wrapper
      .findAll(".px-4.py-2")
      .find((el) => el.text() === "Option 2");

    await item?.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["opt2"]);

    expect(wrapper.find(".absolute.top-full").exists()).toBe(false);
  });
});
