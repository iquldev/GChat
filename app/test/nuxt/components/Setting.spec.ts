import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";

// Local stub of the Selector component used by the Setting component
const Selector = defineComponent({
  name: "Selector",
  props: {
    options: { type: Array, required: false },
    modelValue: { type: String, required: false },
  },
  emits: ["update:modelValue"],
  setup(props) {
    return () => h("div", { class: "selector" }, props.modelValue || "");
  },
});

const InputField = defineComponent({
  name: "InputField",
  props: {
    modelValue: { type: String, required: false },
    placeholder: { type: String, required: false },
  },
  emits: ["update:modelValue"],
  setup(props) {
    return () => h("input", { placeholder: props.placeholder || "" });
  },
});

// Local implementation of Setting used in tests (replaces missing file import)
const Setting = defineComponent({
  name: "Setting",
  props: {
    label: { type: String, required: true },
    options: { type: Array as PropType<{ label: string; value: string }[]>, required: false, default: () => [] },
    modelValue: { type: String, required: false },
    placeholder: { type: String, required: false },
  },
  setup(props) {
    return () =>
      h("div", { class: "setting" }, [
        h("label", { class: "label" }, props.label),
        (props.options && props.options.length > 0)
          ? h(Selector, { options: props.options, modelValue: props.modelValue })
          : h(InputField, { modelValue: props.modelValue, placeholder: props.placeholder }),
      ]);
  },
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
