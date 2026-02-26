import { describe, it, expect, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { nextTick, defineComponent } from "vue";
import { flushPromises } from "@vue/test-utils";
import SettingsModal from "~/components/settings/SettingsModal.vue";

mockNuxtImport("useColorMode", () => {
  return () => ({
    preference: "light",
    value: "light",
  });
});

describe("SettingsModal", () => {
  const mockTranslations: Record<string, string> = {
    "settings.title": "Settings",
    "settings.apiKey": "API Key",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.disableBlur": "Disable Blur",
    "settings.themes.system": "System",
    "settings.themes.light": "Light",
    "settings.themes.dark": "Dark",
    "settings.options.off": "Off",
    "settings.options.on": "On",
    "common.select": "Select",
  };

  const TransitionStub = defineComponent({
    setup(_, { slots }) {
      return () => (slots.default ? slots.default() : null);
    },
  });

  const mountModal = async (isSettingsOpen = false) => {
    const proto = HTMLDialogElement.prototype as unknown as HTMLDialogElement;
    proto.showModal = vi.fn();
    proto.close = vi.fn();

    const wrapper = await mountSuspended(SettingsModal, {
      props: {
        isSettingsOpen: false,
      },
      global: {
        provide: {
          toggleSettings: vi.fn(),
        },
        mocks: {
          $t: (msg: string) => mockTranslations[msg] || msg,
        },
        stubs: {
          Transition: TransitionStub,
        },
      },
      attachTo: document.body,
    });

    if (isSettingsOpen) {
      const dialog = wrapper.find("dialog").element as HTMLDialogElement;
      if (dialog) {
        dialog.showModal = vi.fn();
        dialog.close = vi.fn();
      }

      await wrapper.setProps({ isSettingsOpen: true });
      await flushPromises();
      await nextTick();
    }

    return wrapper;
  };

  it("renders a dialog element", async () => {
    const wrapper = await mountModal();
    expect(wrapper.find("dialog").exists()).toBe(true);
    wrapper.unmount();
  });

  it("dialog has settings-dialog class", async () => {
    const wrapper = await mountModal();
    expect(wrapper.find("dialog").classes()).toContain("settings-dialog");
    wrapper.unmount();
  });

  it("shows settings title when open", async () => {
    const wrapper = await mountModal(true);
    expect(wrapper.text()).toContain("Settings");
    wrapper.unmount();
  });

  it("shows Language setting when open", async () => {
    const wrapper = await mountModal(true);
    expect(wrapper.text()).toContain("Language");
    wrapper.unmount();
  });

  it("shows Theme setting when open", async () => {
    const wrapper = await mountModal(true);
    expect(wrapper.text()).toContain("Theme");
    wrapper.unmount();
  });

  it("shows Disable Blur setting when open", async () => {
    const wrapper = await mountModal(true);
    expect(wrapper.text()).toContain("Disable Blur");
    wrapper.unmount();
  });
});
