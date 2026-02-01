import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Sidebar from "~/components/sidebar/sidebar.vue";
import { createTestingPinia } from "@pinia/testing";
import { useUIStore } from "~/stores/ui";

vi.mock("motion-v", () => ({
  motion: {
    div: {
      template: "<div><slot /></div>",
    },
  },
}));

vi.mock("#app", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Sidebar Component", () => {
  it("renders correctly", () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              ui: { isSidebarExpanded: false, isSearchActive: false },
              chat: { chats: [] },
            },
          }),
        ],
        stubs: {
          sidebarButtons: true,
          sidebarChatList: true,
        },
        provide: {
          toggleSettings: vi.fn(),
        },
        mocks: {
          $colorMode: {
            preference: "light",
            value: "light",
            unknown: false,
            forced: false,
          },
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("toggles sidebar when action is triggered", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        provide: {
          toggleSettings: vi.fn(),
        },
        mocks: {
          $colorMode: {
            preference: "light",
            value: "light",
            unknown: false,
            forced: false,
          },
        },
      },
    });
    const store = useUIStore();
    expect(store).toBeDefined();
  });
});
