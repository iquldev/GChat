import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InputField from "~/components/inputField.vue";

describe("InputField", () => {
  const createWrapper = async (props: Record<string, unknown> = {}) => {
    let currentModelValue = (props.modelValue as string) ?? "";
    const wrapper = await mountSuspended(InputField, {
      props: {
        placeholder: "Default Placeholder",
        modelValue: currentModelValue,
        "onUpdate:modelValue": (e: string) => {
          currentModelValue = e;
          wrapper.setProps({ modelValue: e });
        },
        ...props,
      },
    });
    return wrapper;
  };

  it("renders with placeholder", async () => {
    const wrapper = await createWrapper({ placeholder: "Test placeholder" });
    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Test placeholder");
  });

  it("updates modelValue", async () => {
    const wrapper = await createWrapper({
      props: {
        placeholder: "Test",
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("test value");

    expect(wrapper.props("modelValue")).toBe("test value");
  });

  it("replaces invalid characters when isKey is true", async () => {
    const wrapper = await mountSuspended(InputField, {
      props: {
        placeholder: "Key",
        isKey: true,
        modelValue: "",
        "onUpdate:modelValue": (e: string) =>
          wrapper.setProps({ modelValue: e }),
      },
    });

    const input = wrapper.find("input");
    await input.setValue("Invalid @#$ Characters");

    expect(wrapper.props("modelValue")).toBe("InvalidCharacters");
  });

  it("limits length to 39 characters when isKey is true", async () => {
    const wrapper = await mountSuspended(InputField, {
      props: {
        placeholder: "Key",
        isKey: true,
        modelValue: "",
        "onUpdate:modelValue": (e: string) =>
          wrapper.setProps({ modelValue: e }),
      },
    });

    const longString = "a".repeat(50);
    const input = wrapper.find("input");
    await input.setValue(longString);

    expect((wrapper.props("modelValue") as string).length).toBe(39);
  });
});
