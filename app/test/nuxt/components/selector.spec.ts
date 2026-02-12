import { describe, it, expect, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Selector from "~/components/selector.vue";

mockNuxtImport("useColorMode", () => {
  return () => ({
    value: "light",
  });
});

describe("Selector", () => {
  const options = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ];

  it("renders with default label", async () => {
    const wrapper = await mountSuspended(Selector, {
      props: {
        options,
        modelValue: "",
      },
    });

    expect(wrapper.text()).toContain("Select");
  });

  it("renders with selected option label", async () => {
    const selected = options[0];
    if (!selected) throw new Error("No option found");
    const wrapper = await mountSuspended(Selector, {
      props: {
        options,
        modelValue: selected.value,
      },
    });

    expect(wrapper.text()).toContain(selected.label);
  });

  it("toggles dropdown on click", async () => {
    const option = options[0];
    if (!option) throw new Error("No option found");
    const wrapper = await mountSuspended(Selector, {
      props: {
        options,
        modelValue: "",
      },
    });

    const trigger = wrapper.find("[role='combobox']");

    expect(wrapper.text()).not.toContain(option.label);

    await trigger.trigger("click");
    expect(wrapper.text()).toContain(option.label);

    await trigger.trigger("click");
    expect(wrapper.text()).not.toContain(option.label);
  });

  it("selects an option", async () => {
    const wrapper = await mountSuspended(Selector, {
      props: {
        options,
        modelValue: "",
        "onUpdate:modelValue": (e: string | number | boolean | undefined) =>
          wrapper.setProps({ modelValue: e }),
      },
    });

    const trigger = wrapper.find("[role='combobox']");
    await trigger.trigger("click");

    const targetOption = options[0];
    if (!targetOption) throw new Error("No option found");

    const optionElement = wrapper
      .findAll("[role='option']")
      .filter((w) => w.text() === targetOption.label)
      .at(0);

    if (optionElement) {
      await optionElement.trigger("click");
      expect(wrapper.props("modelValue")).toBe(targetOption.value);
    } else {
      throw new Error(`Option ${targetOption.label} not found`);
    }
  });
});
