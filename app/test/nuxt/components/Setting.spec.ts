import { describe, it, expect } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Setting from "~/components/settings/setting.vue";

mockNuxtImport("useColorMode", () => {
  return () => ({
    value: "light",
  });
});

describe("Setting", () => {
  it("renders the label", async () => {
    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "API Key",
        modelValue: "",
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    expect(wrapper.text()).toContain("API Key");
  });

  it("renders Selector when options are provided", async () => {
    const options = [
      { label: "English", value: "en" },
      { label: "Русский", value: "ru" },
    ];

    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "Language",
        options,
        modelValue: "en",
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const selector = wrapper.findComponent({ name: "Selector" });
    expect(selector.exists()).toBe(true);
  });

  it("renders InputField when options are empty", async () => {
    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "API Key",
        options: [],
        placeholder: "Enter key...",
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

  it("passes isKey prop to InputField", async () => {
    const wrapper = await mountSuspended(Setting, {
      props: {
        label: "API Key",
        options: [],
        isKey: true,
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
    expect(inputField.props("isKey")).toBe(true);
  });
});
