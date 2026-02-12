import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import NewChat from "~/components/newChat.vue";
import { nextTick } from "vue";

describe("NewChat", () => {
  const createOptions = () => ({
    global: {
      mocks: {
        $t: (msg: string) => msg,
      },
    },
  });

  it("renders correctly", async () => {
    const wrapper = await mountSuspended(NewChat, createOptions());

    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find("button[aria-label='chat.send']").exists()).toBe(true);
  });

  it("disables send button when prompt is empty", async () => {
    const wrapper = await mountSuspended(NewChat, {
      ...createOptions(),
      attachTo: document.body,
    });

    const sendButton = wrapper.find("button[aria-label='chat.send']");
    expect(sendButton.attributes()).toHaveProperty("disabled");
    wrapper.unmount();
  });

  it("enables send button when prompt is not empty", async () => {
    const wrapper = await mountSuspended(NewChat, createOptions());

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello");

    const sendButton = wrapper.find("button[aria-label='chat.send']");
    expect(sendButton.attributes()).not.toHaveProperty("disabled");
  });
});
