import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUIStore } from "~/stores/ui";

describe("UI Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("toggles sidebar state", () => {
    const store = useUIStore();
    const initialState = store.isSidebarExpanded;

    store.toggleSidebar();
    expect(store.isSidebarExpanded).toBe(!initialState);

    store.toggleSidebar();
    expect(store.isSidebarExpanded).toBe(initialState);
  });

  it("toggles search state", () => {
    const store = useUIStore();
    store.toggleSearch();
    expect(store.isSearchActive).toBe(true);
  });

  it("updates search query", () => {
    const store = useUIStore();
    store.setSearchQuery("test query");
    expect(store.searchQuery).toBe("test query");
  });

  it("has a default selected model", () => {
    const store = useUIStore();
    expect(store.selectedModel).toBe("gemini-3-flash");
  });
});
