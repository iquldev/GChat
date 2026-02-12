import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { useChatStore } from "~/stores/chat";

vi.mock("@vueuse/core", () => ({
  useLocalStorage: vi.fn((key, defaultValue) => ref(defaultValue)),
}));

describe("Chat Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with default chats", () => {
    const store = useChatStore();
    expect(store.chats.length).toBeGreaterThan(0);
    expect(store.chats[0]?.title).toBeDefined();
  });

  it("selects a chat by ID", () => {
    const store = useChatStore();
    const targetId = 2;

    store.changeSelected(targetId);

    expect(store.selectedChatId).toBe(targetId);
    expect(store.selectedChat?.id).toBe(targetId);
  });

  it("removes selection", () => {
    const store = useChatStore();
    store.changeSelected(1);
    store.removeSelection();

    expect(store.selectedChatId).toBeNull();
    expect(store.selectedChat).toBeUndefined();
  });

  it("clears selection when selected chat is removed", async () => {
    const store = useChatStore();
    const chatId = 1;
    store.changeSelected(chatId);

    expect(store.selectedChatId).toBe(chatId);

    store.chats = store.chats.filter((c) => c.id !== chatId);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(store.selectedChatId).toBeNull();
  });
});
