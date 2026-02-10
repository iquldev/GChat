import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-security",
    "motion-v/nuxt",
  ],
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
    },
    langDir: "locales",
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "ru", language: "ru-RU", file: "ru.json" },
    ],
  },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { charset: "utf-8" },
      ],
    },
  },
  fonts: {
    provider: "google",
  },
});
