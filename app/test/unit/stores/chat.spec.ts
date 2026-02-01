import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useChatStore } from "~/stores/chat";

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
});
