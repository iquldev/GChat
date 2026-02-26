import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SidebarChatList from "~/components/sidebar/SidebarChatList.vue";

describe("SidebarChatList", () => {
  const mockChats = [
    { id: 1, title: "First Chat" },
    { id: 2, title: "Second Chat" },
    { id: 3, title: "Third Chat" },
  ];

  const mountChatList = async (props = {}) => {
    return await mountSuspended(SidebarChatList, {
      props: {
        isSidebarExpanded: false,
        chats: mockChats,
        changeSelected: vi.fn(),
        ...props,
      },
    });
  };

  it("renders chat items when not expanded", async () => {
    const wrapper = await mountChatList({ isSidebarExpanded: false });
    expect(wrapper.text()).toContain("First Chat");
    expect(wrapper.text()).toContain("Second Chat");
    expect(wrapper.text()).toContain("Third Chat");
  });

  it("renders correct number of chat items", async () => {
    const wrapper = await mountChatList({ isSidebarExpanded: false });
    const chatItems = wrapper.findAllComponents({ name: "SidebarChat" });
    expect(chatItems.length).toBe(3);
  });

  it("does not render when sidebar is expanded", async () => {
    const wrapper = await mountChatList({ isSidebarExpanded: true });
    expect(wrapper.text()).toBe("");
  });

  it("renders empty list when no chats provided", async () => {
    const wrapper = await mountChatList({
      chats: [],
      isSidebarExpanded: false,
    });
    const chatItems = wrapper.findAllComponents({ name: "SidebarChat" });
    expect(chatItems.length).toBe(0);
  });

  it("calls changeSelected when a chat item is clicked", async () => {
    const changeSelected = vi.fn();
    const wrapper = await mountChatList({
      changeSelected,
      isSidebarExpanded: false,
    });
    const firstChat = wrapper.findAllComponents({ name: "SidebarChat" })[0];
    await firstChat!.trigger("click");
    expect(changeSelected).toHaveBeenCalledWith(1);
  });
});
