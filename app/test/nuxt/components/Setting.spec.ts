import { describe, it, expect } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Setting from "~/components/settings/SettingsSetting.vue";
import Selector from "~/components/UiSelector.vue";

mockNuxtImport("useColorMode", () => {
  return () => ({
    value: "light",
  });
});

describe("Setting", () => {
  it("renders the label", async () => {
    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "Custom Setting",
        modelValue: "",
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    expect(wrapper.text()).toContain("Custom Setting");
  });

  it("renders Selector when options are provided", async () => {
    const options = [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ];

    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "Select Setting",
        options,
        modelValue: "1",
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const selector = wrapper.findComponent(Selector);
    expect(selector.exists()).toBe(true);
  });

  it("renders InputField when options are empty", async () => {
    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "Input Setting",
        options: [],
        placeholder: "Enter value...",
        modelValue: "",
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const inputField = wrapper.findComponent({ name: "InputField" });
    expect(inputField.exists()).toBe(true);
  });
});
