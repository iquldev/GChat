import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

mockNuxtImport("useColorMode", () => {
  return () => ({
    preference: "light",
    value: "light",
    unknown: false,
    forced: false,
  });
});

mockNuxtImport("useI18n", () => {
  return () => ({
    locale: ref("en"),
    setLocale: () => {},
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.search": "Search...",
      };
      return translations[key] ?? key;
    },
  });
});

// @ts-expect-error - __NUXT_COLOR_MODE__ is injected by @nuxtjs/color-mode plugin
window.__NUXT_COLOR_MODE__ = {
  preference: "light",
  value: "light",
  getColorScheme: () => "light",
  addColorScheme: () => {},
  removeColorScheme: () => {},
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  },
});
