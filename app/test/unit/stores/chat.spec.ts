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

  it("selects a chat and deselects others", () => {
    const store = useChatStore();
    const targetId = 2;

    store.changeSelected(targetId);

    const selectedChat = store.chats.find((c) => c.id === targetId);
    const unselectedChat = store.chats.find((c) => c.id !== targetId);

    expect(selectedChat?.isSelected).toBe(true);
    expect(unselectedChat?.isSelected).toBe(false);
  });

  it("removes selection from all chats", () => {
    const store = useChatStore();
    store.changeSelected(1);

    store.removeSelection();

    const anySelected = store.chats.some((c) => c.isSelected);
    expect(anySelected).toBe(false);
  });
});
