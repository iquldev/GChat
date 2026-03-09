import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";
import { useChatStore } from "~/stores/chat";

vi.mock("@vueuse/core", () => ({
  useLocalStorage: vi.fn((key, defaultValue) => ref(defaultValue)),
}));

vi.stubGlobal("navigateTo", vi.fn());

describe("Chat Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with an empty chat list", () => {
    const store = useChatStore();
    expect(store.chats.length).toBe(0);
  });

  it("selects a chat by ID", () => {
    const store = useChatStore();
    const chatId = store.addChat({
      id: 1,
      role: "user",
      parts: [{ text: "Hello" }],
      timestamp: new Date().toISOString(),
      status: "sent",
      model: "gemini-3-flash-preview",
    });

    store.changeSelected(chatId);

    expect(store.selectedChatId).toBe(chatId);
    expect(store.selectedChat?.id).toBe(chatId);
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
    
    const chatId = store.addChat({
      id: 1,
      role: "user",
      parts: [{ text: "Hello" }],
      timestamp: new Date().toISOString(),
      status: "sent",
      model: "gemini-3-flash-preview",
    });

    store.changeSelected(chatId);
    expect(store.selectedChatId).toBe(chatId);

    store.deleteChat(chatId);

    expect(store.selectedChatId).toBeNull();
  });
});
